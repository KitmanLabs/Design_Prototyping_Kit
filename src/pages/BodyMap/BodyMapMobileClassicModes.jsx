import React, { useState, useRef, useEffect, useCallback } from 'react'
import { Box, Typography, Button, Slider, TextField, Collapse, IconButton } from '@mui/material'
import { keyframes } from '@mui/system'
import {
  SyncOutlined,
  MenuOutlined,
  PersonOutlineOutlined,
  ChevronRightOutlined,
  CloseOutlined,
  StickyNote2Outlined,
} from '@mui/icons-material'
import bodyMapSvgUrl from '../../assets/body-map.svg'
import '../../styles/design-tokens.css'

const KITMAN_LOGO = '/assets/logos/Kitman Labs base.png'
let SVG_CACHE = null

// eslint-disable-next-line design-system/no-hardcoded-colors
const MODE_COLORS = { Pain: '#c0392b', Soreness: '#e67e22', Stiffness: '#2980b9' }
const MODES = ['Pain', 'Soreness', 'Stiffness']
const COUNT_LABEL = { Pain: 'PAINFUL AREAS', Soreness: 'SORE AREAS', Stiffness: 'STIFF AREAS' }

const COMMON_AREAS = [
  { id: 'rear-Lumbar_Spine___Pelvis', label: 'Lumbar Spine & Pelvis' },
  { id: 'front-Left_Anterior_Thigh', label: 'Left Anterior Thigh' },
  { id: 'front-Neck', label: 'Neck' },
  { id: 'front-Abdominal', label: 'Abdominal' },
]

const SCREEN_H = 852
const SNAP_TY = { full: 0, half: Math.round(SCREEN_H * 0.45), min: SCREEN_H - 120 }

const hotspotPulse = keyframes`
  0% { transform: scale(0.7); opacity: 0.6; }
  70% { transform: scale(2.4); opacity: 0; }
  100% { transform: scale(2.4); opacity: 0; }
`

function partIdToName(id) {
  return id.replace(/^(front|rear)-/, '').replace(/_+/g, ' ').replace(/\s+/g, ' ').trim()
}
function hexToRgba(hex, alpha) {
  const h = hex.replace('#', '')
  return `rgba(${parseInt(h.slice(0, 2), 16)}, ${parseInt(h.slice(2, 4), 16)}, ${parseInt(h.slice(4, 6), 16)}, ${alpha})`
}
const severityAlpha = (s) => 0.3 + (Math.max(1, Math.min(10, s)) / 10) * 0.7
const makeKey = (m, id) => `${m}::${id}`

// ---- Body model ------------------------------------------------------------
function MobileBodyMapSvg({ regionStyles, labels, currentView, onPartSelect }) {
  const containerRef = useRef(null)
  const [svgHtml, setSvgHtml] = useState(SVG_CACHE)

  useEffect(() => {
    if (SVG_CACHE) { setSvgHtml(SVG_CACHE); return }
    fetch(bodyMapSvgUrl)
      .then((r) => r.text())
      .then((text) => {
        const processed = text
          .replace(' width="450"', '')
          .replace(' height="540"', '')
          .replace(/path:hover\s*\{[^}]*\}/, 'path { cursor: pointer; }')
        SVG_CACHE = processed
        setSvgHtml(processed)
      })
  }, [])

  useEffect(() => {
    const container = containerRef.current
    if (!container) return
    const svg = container.querySelector('svg')
    if (!svg) return

    svg.setAttribute('viewBox', currentView === 'front' ? '0 0 225 540' : '225 0 225 540')
    svg.querySelectorAll('text').forEach((t) => {
      if (t.textContent === 'FRONT') t.style.display = currentView === 'front' ? '' : 'none'
      if (t.textContent === 'REAR') t.style.display = currentView === 'rear' ? '' : 'none'
    })

    svg.querySelectorAll('g[id]').forEach((group) => {
      const id = group.id
      const groupView = id.startsWith('front-') ? 'front' : 'rear'
      const path = group.querySelector('path')
      if (!path) return
      const oldLabel = group.querySelector('text[data-sev-label="true"]')
      if (oldLabel) oldLabel.remove()
      if (groupView !== currentView) { group.style.display = 'none'; return }
      group.style.display = ''

      const style = regionStyles[id]
      if (style) {
        path.style.fill = style.fill
        path.style.stroke = style.stroke
        path.style.strokeWidth = String(style.strokeWidth || 1)
        path.style.strokeLinejoin = 'round'
        const sev = labels[id]
        if (sev != null) {
          let bbox
          try { bbox = path.getBBox() } catch { bbox = null }
          if (bbox) {
            const text = document.createElementNS('http://www.w3.org/2000/svg', 'text')
            text.setAttribute('x', bbox.x + bbox.width / 2)
            text.setAttribute('y', bbox.y + bbox.height / 2)
            text.setAttribute('text-anchor', 'middle')
            text.setAttribute('dominant-baseline', 'central')
            text.setAttribute('data-sev-label', 'true')
            text.setAttribute('font-size', '11')
            text.setAttribute('font-weight', '700')
            text.setAttribute('fill', '#ffffff')
            text.setAttribute('stroke', 'rgba(0,0,0,0.35)')
            text.setAttribute('stroke-width', '0.5')
            text.setAttribute('paint-order', 'stroke')
            text.style.pointerEvents = 'none'
            text.textContent = String(sev)
            group.appendChild(text)
          }
        }
      } else {
        // eslint-disable-next-line design-system/no-hardcoded-colors
        path.style.fill = '#E0E0E0'
        // eslint-disable-next-line design-system/no-hardcoded-colors
        path.style.stroke = '#FFFFFF'
        path.style.strokeWidth = '1'
      }
    })
  }, [regionStyles, labels, currentView, svgHtml])

  // 44px touch targets for small regions
  useEffect(() => {
    const container = containerRef.current
    if (!container) return
    const svg = container.querySelector('svg')
    if (!svg) return
    const addHitAreas = () => {
      const rect = svg.getBoundingClientRect()
      if (!rect.width) return
      const vbWidth = (svg.getAttribute('viewBox') || '0 0 225 540').split(' ').map(Number)[2] || 225
      const minHit = 44 * (vbWidth / rect.width)
      svg.querySelectorAll('g[id]').forEach((group) => {
        if (group.style.display === 'none') return
        const path = group.querySelector('path')
        if (!path) return
        const stale = group.querySelector('[data-hit-area="true"]')
        if (stale) stale.remove()
        let bbox
        try { bbox = path.getBBox() } catch { return }
        if (bbox.width >= minHit && bbox.height >= minHit) return
        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle')
        circle.setAttribute('cx', bbox.x + bbox.width / 2)
        circle.setAttribute('cy', bbox.y + bbox.height / 2)
        circle.setAttribute('r', minHit / 2)
        circle.setAttribute('fill', 'transparent')
        circle.setAttribute('data-hit-area', 'true')
        circle.style.cursor = 'pointer'
        group.appendChild(circle)
      })
    }
    const raf = requestAnimationFrame(addHitAreas)
    window.addEventListener('resize', addHitAreas)
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', addHitAreas) }
  }, [currentView, svgHtml])

  const handleClick = useCallback((e) => {
    const group = e.target.closest('g[id]')
    if (!group) return
    const name = group.querySelector('title')?.textContent || partIdToName(group.id)
    onPartSelect(group.id, name)
  }, [onPartSelect])

  return (
    <Box
      ref={containerRef}
      onClick={handleClick}
      dangerouslySetInnerHTML={{ __html: svgHtml ?? '' }}
      sx={{ display: 'flex', justifyContent: 'center', '& svg': { height: 'min(46vh, 360px)', width: 'auto', maxWidth: '100%', display: 'block' } }}
    />
  )
}

// ---- Snap bottom sheet -----------------------------------------------------
function SnapSheet({ draft, mode, onSeverityChange, onToggleNote, onNoteChange, onRemove, onAdd, onCancel }) {
  const color = MODE_COLORS[mode]
  const [snap, setSnap] = useState('half')
  const [entered, setEntered] = useState(false)
  const [drag, setDrag] = useState(null)

  useEffect(() => { const raf = requestAnimationFrame(() => setEntered(true)); return () => cancelAnimationFrame(raf) }, [])
  useEffect(() => { setSnap('half'); setDrag(null) }, [draft.partId])

  const baseTY = SNAP_TY[snap]
  const translateY = !entered ? SCREEN_H : drag ? drag.ty : baseTY
  const transition = drag ? 'none' : 'transform 0.34s cubic-bezier(0.22, 1, 0.36, 1)'

  const onDown = (e) => { e.currentTarget.setPointerCapture?.(e.pointerId); setDrag({ startY: e.clientY, startTY: baseTY, ty: baseTY }) }
  const onMove = (e) => setDrag((d) => (d ? { ...d, ty: Math.max(SNAP_TY.full, Math.min(SNAP_TY.min, d.startTY + (e.clientY - d.startY))) } : d))
  const onUp = () => setDrag((d) => {
    if (!d) return null
    const ty = d.ty
    let nearest = 'min'
    if (ty < (SNAP_TY.full + SNAP_TY.half) / 2) nearest = 'full'
    else if (ty < (SNAP_TY.half + SNAP_TY.min) / 2) nearest = 'half'
    setSnap(nearest)
    return null
  })

  return (
    <Box
      sx={{
        position: 'absolute', left: 0, right: 0, top: 0, height: SCREEN_H,
        transform: `translateY(${translateY}px)`, transition,
        backgroundColor: 'var(--color-background-primary)',
        borderTopLeftRadius: 16, borderTopRightRadius: 16,
        boxShadow: '0 -8px 24px rgba(0,0,0,0.18)',
        display: 'flex', flexDirection: 'column', zIndex: 25,
      }}
    >
      {/* Drag zone: handle + header + close */}
      <Box onPointerDown={onDown} onPointerMove={onMove} onPointerUp={onUp} sx={{ flexShrink: 0, px: 2.5, pt: 1, pb: 1, cursor: 'grab', touchAction: 'none' }}>
        <Box sx={{ width: 40, height: 4, borderRadius: 2, backgroundColor: 'var(--color-border-primary)', mx: 'auto', mt: '4px', mb: 1.5 }} />
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="h6" sx={{ fontWeight: 600, color: 'var(--color-text-primary)' }}>{draft.name}</Typography>
          <IconButton onClick={onCancel} aria-label="Close" sx={{ width: 44, height: 44, color: 'var(--color-text-secondary)' }}>
            <CloseOutlined fontSize="small" />
          </IconButton>
        </Box>
        <Typography variant="body2" sx={{ color: 'var(--color-text-secondary)' }}>
          Set your {mode.toLowerCase()} level
        </Typography>
      </Box>

      {/* Scrollable content */}
      <Box sx={{ flex: 1, minHeight: 0, overflowY: 'auto', px: 2.5, pb: 3 }}>
        {/* Slider */}
        <Box sx={{ mt: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Slider
              min={1} max={10} step={1} value={draft.severity}
              onChange={(_, v) => onSeverityChange(v)}
              sx={{ flex: 1, color, '& .MuiSlider-thumb': { backgroundColor: color, width: 24, height: 24 }, '& .MuiSlider-track': { backgroundColor: color, borderColor: color }, '& .MuiSlider-rail': { backgroundColor: 'var(--color-border-primary)' } }}
            />
            <Typography variant="body1" sx={{ color, fontWeight: 700, minWidth: 44, textAlign: 'right' }}>{draft.severity}/10</Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="caption" sx={{ color: 'var(--color-text-muted)' }}>1 — Mild</Typography>
            <Typography variant="caption" sx={{ color: 'var(--color-text-muted)' }}>10 — Severe</Typography>
          </Box>
        </Box>

        {/* Add note */}
        <Box sx={{ mt: 2 }}>
          {draft.noteOpen ? (
            <TextField
              multiline minRows={2} fullWidth variant="filled" size="small"
              autoFocus={Boolean(draft.noteFocus)}
              value={draft.note}
              onChange={(e) => onNoteChange(e.target.value)}
              inputProps={{ maxLength: 280 }}
              helperText={`${draft.note.length}/280`}
              FormHelperTextProps={{ sx: { textAlign: 'right', m: 0, mt: 0.5 } }}
            />
          ) : (
            <Button
              variant="outlined" size="small"
              startIcon={<StickyNote2Outlined sx={{ fontSize: 18 }} />}
              onClick={onToggleNote}
              sx={{ textTransform: 'none', fontWeight: 500, borderRadius: '20px', color: 'var(--color-text-secondary)', borderColor: 'var(--color-border-primary)', '&:hover': { borderColor: 'var(--color-border-primary)', backgroundColor: 'var(--color-background-secondary)' } }}
            >
              Add note
            </Button>
          )}
        </Box>

        {/* Remove area */}
        <Box
          component="button" type="button" onClick={onRemove}
          sx={{ mt: 1.5, p: 0, border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--color-error)', fontSize: '13px', fontWeight: 500, display: 'block' }}
        >
          Remove area
        </Box>

        {/* Cancel / Add */}
        <Box sx={{ display: 'flex', gap: 1.5, mt: 3 }}>
          <Button
            variant="outlined" fullWidth onClick={onCancel}
            sx={{ textTransform: 'none', fontWeight: 500, borderColor: 'var(--color-border-primary)', color: 'var(--color-text-secondary)' }}
          >
            Cancel
          </Button>
          <Button
            variant="contained" fullWidth disableElevation onClick={onAdd}
            sx={{ textTransform: 'none', fontWeight: 500, backgroundColor: 'var(--color-primary)', color: 'var(--color-white)', '&:hover': { backgroundColor: 'var(--color-primary-hover)' } }}
          >
            Add
          </Button>
        </Box>
      </Box>
    </Box>
  )
}

// ---- Page ------------------------------------------------------------------
export default function BodyMapMobileClassicModes() {
  const [currentView, setCurrentView] = useState('front')
  const [activeMode, setActiveMode] = useState('Pain')
  const [selections, setSelections] = useState({ Pain: {}, Soreness: {}, Stiffness: {} })
  const [notes, setNotes] = useState({})
  const [draft, setDraft] = useState(null)
  const [hasInteracted, setHasInteracted] = useState(false)
  const [expandedNotes, setExpandedNotes] = useState(new Set())

  const color = MODE_COLORS[activeMode]
  const modeSelections = selections[activeMode]

  const openDraft = useCallback((id, name) => {
    setHasInteracted(true)
    const existing = selections[activeMode][id]
    const note = notes[id] ?? ''
    setDraft({ partId: id, name, severity: existing ?? 5, note, noteOpen: note !== '', noteFocus: false })
  }, [selections, activeMode, notes])

  const handlePartSelect = useCallback((id, name) => openDraft(id, name), [openDraft])

  const handleCommon = (id, label) => {
    setCurrentView(id.startsWith('rear-') ? 'rear' : 'front')
    openDraft(id, label)
  }

  const handleSeverityChange = useCallback((v) => setDraft((d) => (d ? { ...d, severity: v } : d)), [])
  const handleToggleNote = useCallback(() => setDraft((d) => (d ? { ...d, noteOpen: true, noteFocus: true } : d)), [])
  const handleNoteChange = useCallback((v) => setDraft((d) => (d ? { ...d, note: v.slice(0, 280) } : d)), [])

  const handleAdd = useCallback(() => {
    if (!draft) return
    setSelections((prev) => ({ ...prev, [activeMode]: { ...prev[activeMode], [draft.partId]: draft.severity } }))
    setNotes((prev) => {
      const next = { ...prev }
      if (draft.note.trim()) next[draft.partId] = draft.note.trim()
      else delete next[draft.partId]
      return next
    })
    setDraft(null)
  }, [draft, activeMode])

  const handleCancel = useCallback(() => setDraft(null), [])

  const removeFromMode = useCallback((id) => {
    setSelections((prev) => {
      const next = { ...prev[activeMode] }
      delete next[id]
      return { ...prev, [activeMode]: next }
    })
  }, [activeMode])

  const handleRemoveDraft = useCallback(() => {
    if (!draft) return
    removeFromMode(draft.partId)
    setDraft(null)
  }, [draft, removeFromMode])

  const toggleNoteExpanded = (id) => setExpandedNotes((prev) => {
    const next = new Set(prev)
    if (next.has(id)) next.delete(id); else next.add(id)
    return next
  })

  // Model fills + labels (active mode + draft overlay)
  const regionStyles = {}
  const labels = {}
  Object.entries(modeSelections).forEach(([id, sev]) => {
    regionStyles[id] = { fill: hexToRgba(color, severityAlpha(sev)), stroke: color, strokeWidth: 1 }
    labels[id] = sev
  })
  if (draft) {
    regionStyles[draft.partId] = { fill: hexToRgba(color, severityAlpha(draft.severity)), stroke: color, strokeWidth: 2 }
    labels[draft.partId] = draft.severity
  }

  const entries = Object.entries(modeSelections)
  const count = entries.length
  const frontEntries = entries.filter(([id]) => id.startsWith('front-'))
  const backEntries = entries.filter(([id]) => id.startsWith('rear-'))
  const notedEntries = entries.filter(([id]) => notes[id])
  const totalAll = MODES.reduce((s, m) => s + Object.keys(selections[m]).length, 0)

  const renderChip = ([id, severity]) => (
    <Box
      key={id}
      onClick={() => openDraft(id, partIdToName(id))}
      sx={{ display: 'inline-flex', alignItems: 'center', gap: 1, height: 34, pl: 0.5, pr: 0.25, borderRadius: '17px', cursor: 'pointer', backgroundColor: hexToRgba(color, 0.12), border: `1px solid ${color}` }}
    >
      <Box sx={{ width: 24, height: 24, borderRadius: '50%', backgroundColor: color, color: 'var(--color-white)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 700, flexShrink: 0 }}>{severity}</Box>
      <Typography variant="body2" sx={{ color, fontSize: '12px', fontWeight: 500 }}>{partIdToName(id)}</Typography>
      <Box
        component="button" type="button" aria-label="Remove"
        onClick={(e) => { e.stopPropagation(); removeFromMode(id) }}
        sx={{ width: 44, height: 44, p: 0, border: 'none', background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color }}
      >
        <CloseOutlined sx={{ fontSize: 16 }} />
      </Box>
    </Box>
  )

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start', py: 4, px: 2, width: '100%' }}>
      {/* iPhone frame */}
      <Box sx={{ flexShrink: 0, width: 393 + 24, height: 852 + 24, p: '12px', borderRadius: '62px', backgroundColor: '#0a0a0a', boxShadow: '0 24px 60px rgba(0,0,0,0.35)' }}>
        <Box sx={{ position: 'relative', width: 393, height: 852, borderRadius: '50px', overflow: 'hidden', backgroundColor: 'var(--color-background-primary)', display: 'flex', flexDirection: 'column' }}>
          {/* Dynamic island */}
          <Box sx={{ position: 'absolute', top: 10, left: '50%', transform: 'translateX(-50%)', width: 125, height: 35, borderRadius: '20px', backgroundColor: '#000', zIndex: 30 }} />

          {/* Dark top nav */}
          <Box sx={{ flexShrink: 0, height: 88, pt: '40px', px: 1.5, display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'linear-gradient(180deg, #000000 0%, #111111 40%, #000000 70%, #040037ff 90%, #040037ff 100%)', color: 'var(--color-white)' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', color: 'var(--color-white)' }}><MenuOutlined /></Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.25, color: 'var(--color-white)' }}>
              <PersonOutlineOutlined fontSize="small" />
              <ChevronRightOutlined fontSize="small" />
              <ChevronRightOutlined fontSize="small" />
            </Box>
            <Box sx={{ width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <img src={KITMAN_LOGO} alt="Kitman labs" style={{ height: '100%', width: 'auto', objectFit: 'contain' }} />
            </Box>
          </Box>

          {/* Scrollable form page */}
          <Box sx={{ flex: 1, minHeight: 0, overflowY: 'auto', p: 2, pb: totalAll > 0 ? '96px' : 2, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            {/* Sub-section label */}
            <Typography variant="caption" sx={{ color: 'var(--color-text-muted)', fontSize: '11px', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Sub-section 1.1
            </Typography>
            {/* Question heading */}
            <Typography variant="h6" sx={{ fontWeight: 600, color: 'var(--color-text-primary)' }}>
              Where are you experiencing discomfort?
            </Typography>
            <Typography variant="body2" sx={{ color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
              Select any area on the body and indicate the severity.
            </Typography>

            {/* Mode buttons */}
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 0.5 }}>
              {MODES.map((mode) => {
                const c = MODE_COLORS[mode]
                const active = activeMode === mode
                return (
                  <Button
                    key={mode}
                    variant="contained" disableElevation size="small"
                    onClick={() => setActiveMode(mode)}
                    sx={{
                      textTransform: 'none', fontWeight: 600, px: 2, borderRadius: '20px', border: `1.5px solid ${c}`,
                      // eslint-disable-next-line design-system/no-hardcoded-colors
                      backgroundColor: active ? c : 'transparent', color: active ? 'var(--color-white)' : c,
                      // eslint-disable-next-line design-system/no-hardcoded-colors
                      '&:hover': { backgroundColor: active ? c : hexToRgba(c, 0.08) },
                    }}
                  >
                    {mode}
                  </Button>
                )
              })}
            </Box>

            {/* Body model */}
            <Box sx={{ position: 'relative', mt: 0.5 }}>
              <MobileBodyMapSvg regionStyles={regionStyles} labels={labels} currentView={currentView} onPartSelect={handlePartSelect} />
              {/* Hotspot */}
              {!hasInteracted && (
                <Box sx={{ position: 'absolute', top: '31%', left: '50%', transform: 'translate(-50%, -50%)', width: 16, height: 16, pointerEvents: 'none', zIndex: 5 }}>
                  <Box sx={{ position: 'absolute', inset: 0, borderRadius: '50%', backgroundColor: hexToRgba(color, 0.85) }} />
                  <Box sx={{ position: 'absolute', inset: 0, borderRadius: '50%', border: `2px solid ${hexToRgba(color, 0.55)}`, animation: `${hotspotPulse} 1.8s ease-out infinite` }} />
                </Box>
              )}
            </Box>

            {/* Flip button — centred below model */}
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <IconButton
                onClick={() => setCurrentView((v) => (v === 'front' ? 'rear' : 'front'))}
                sx={{ border: '1px solid var(--color-border-primary)', borderRadius: '20px', px: 2, py: 0.75, gap: 0.75, color: 'var(--color-text-secondary)', '&:hover': { backgroundColor: 'var(--color-background-secondary)' } }}
              >
                <SyncOutlined sx={{ fontSize: 18 }} />
                <Typography variant="body2" sx={{ fontWeight: 500 }}>{currentView === 'front' ? 'Front' : 'Back'}</Typography>
              </IconButton>
            </Box>

            {/* Common shortcuts */}
            <Box sx={{ mt: 0.5 }}>
              <Typography variant="caption" sx={{ display: 'block', color: 'var(--color-text-muted)', fontSize: '11px', fontWeight: 700, letterSpacing: '0.06em', mb: 1 }}>
                COMMON
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {COMMON_AREAS.map((area) => (
                  <Box
                    key={area.id}
                    component="button" type="button"
                    onClick={() => handleCommon(area.id, area.label)}
                    sx={{ px: 1.5, py: 0.75, borderRadius: '16px', border: '1px solid var(--color-border-primary)', backgroundColor: 'transparent', color: 'var(--color-text-secondary)', cursor: 'pointer', fontSize: '13px', '&:hover': { backgroundColor: 'var(--color-background-secondary)' } }}
                  >
                    {area.label}
                  </Box>
                ))}
              </Box>
            </Box>

            {/* Marked count + chips for active mode */}
            {count > 0 && (
              <Box sx={{ mt: 1 }}>
                <Typography variant="caption" sx={{ display: 'block', color: 'var(--color-text-secondary)', fontWeight: 700, letterSpacing: '0.06em', mb: 1.5 }}>
                  {COUNT_LABEL[activeMode]} · {count}
                </Typography>
                {frontEntries.length > 0 && (
                  <Box sx={{ mb: 1.5 }}>
                    <Typography variant="caption" sx={{ display: 'block', color: 'var(--color-text-muted)', fontSize: '11px', fontWeight: 700, letterSpacing: '0.06em', mb: 0.75 }}>FRONT</Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>{frontEntries.map(renderChip)}</Box>
                  </Box>
                )}
                {backEntries.length > 0 && (
                  <Box sx={{ mb: 1.5 }}>
                    <Typography variant="caption" sx={{ display: 'block', color: 'var(--color-text-muted)', fontSize: '11px', fontWeight: 700, letterSpacing: '0.06em', mb: 0.75 }}>BACK</Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>{backEntries.map(renderChip)}</Box>
                  </Box>
                )}
                {/* Note indicators */}
                {notedEntries.length > 0 && (
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    {notedEntries.map(([id]) => (
                      <Box key={id}>
                        <Box onClick={() => toggleNoteExpanded(id)} sx={{ display: 'flex', alignItems: 'center', gap: 0.5, cursor: 'pointer' }}>
                          <StickyNote2Outlined sx={{ fontSize: 14, color: 'var(--color-text-muted)' }} />
                          <Typography variant="caption" sx={{ color: 'var(--color-text-muted)', fontSize: '11px' }}>Note added · {partIdToName(id)}</Typography>
                          <Box sx={{ ml: 'auto', display: 'flex', alignItems: 'center', gap: 0.25 }}>
                            <Typography variant="caption" sx={{ color: 'var(--color-text-secondary)', fontSize: '11px' }}>View</Typography>
                            <ChevronRightOutlined sx={{ fontSize: 14, color: 'var(--color-text-secondary)', transform: expandedNotes.has(id) ? 'rotate(90deg)' : 'none', transition: 'transform 0.2s' }} />
                          </Box>
                        </Box>
                        <Collapse in={expandedNotes.has(id)} unmountOnExit>
                          <Box sx={{ mt: 0.5, p: 1.25, backgroundColor: 'var(--color-background-secondary)', borderRadius: 'var(--radius-md)' }}>
                            <Typography variant="body2" sx={{ color: 'var(--color-text-secondary)', fontSize: '12px', lineHeight: 1.5 }}>{notes[id]}</Typography>
                          </Box>
                        </Collapse>
                      </Box>
                    ))}
                  </Box>
                )}
              </Box>
            )}
          </Box>

          {/* Fixed Done footer */}
          {totalAll > 0 && (
            <Box sx={{ position: 'absolute', bottom: 0, left: 0, right: 0, p: 2, backgroundColor: 'var(--color-background-primary)', borderTop: '1px solid var(--color-border-primary)', zIndex: 20 }}>
              <Button fullWidth variant="contained" disableElevation sx={{ py: 1.25, textTransform: 'none', fontWeight: 500, backgroundColor: 'var(--color-primary)', color: 'var(--color-white)', '&:hover': { backgroundColor: 'var(--color-primary-hover)' } }}>
                Done
              </Button>
            </Box>
          )}

          {/* Bottom sheet */}
          {draft && (
            <SnapSheet
              draft={draft}
              mode={activeMode}
              onSeverityChange={handleSeverityChange}
              onToggleNote={handleToggleNote}
              onNoteChange={handleNoteChange}
              onRemove={handleRemoveDraft}
              onAdd={handleAdd}
              onCancel={handleCancel}
            />
          )}
        </Box>
      </Box>
    </Box>
  )
}
