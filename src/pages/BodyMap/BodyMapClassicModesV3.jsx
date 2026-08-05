import React, { useState, useRef, useEffect } from 'react'
import { Box, Typography, Button, Chip, Slider, TextField, Collapse } from '@mui/material'
import { InfoOutlined, CloseOutlined, StickyNote2Outlined, ChevronRightOutlined, SyncOutlined } from '@mui/icons-material'
import bodyMapSvgUrl from '../../assets/body-map.svg'
import '../../styles/design-tokens.css'

let SVG_CACHE = null

// eslint-disable-next-line design-system/no-hardcoded-colors
const MODE_COLORS = { Pain: '#c0392b', Soreness: '#e67e22', Stiffness: '#2980b9' }
const MODES = ['Pain', 'Soreness', 'Stiffness']

const COMMON_AREAS = [
  { id: 'rear-Lumbar_Spine___Pelvis', label: 'Lumbar Spine & Pelvis' },
  { id: 'front-Left_Anterior_Thigh', label: 'Left Anterior Thigh' },
  { id: 'front-Neck', label: 'Neck' },
  { id: 'front-Abdominal', label: 'Abdominal' },
]

function partIdToName(id) {
  return id.replace(/^(front|rear)-/, '').replace(/_+/g, ' ').replace(/\s+/g, ' ').trim()
}
function hexToRgba(hex, alpha) {
  const h = hex.replace('#', '')
  return `rgba(${parseInt(h.slice(0, 2), 16)}, ${parseInt(h.slice(2, 4), 16)}, ${parseInt(h.slice(4, 6), 16)}, ${alpha})`
}
const severityAlpha = (s) => 0.3 + (Math.max(1, Math.min(10, s)) / 10) * 0.7

// ---- Body model ------------------------------------------------------------
function BodyModelSvg({ regionStyles, labels, currentView, onPartClick }) {
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

  const handleClick = (e) => {
    const group = e.target.closest('g[id]')
    if (!group) return
    const name = group.querySelector('title')?.textContent || partIdToName(group.id)
    onPartClick(group.id, name)
  }

  return <Box ref={containerRef} onClick={handleClick} dangerouslySetInnerHTML={{ __html: svgHtml ?? '' }} sx={{ width: '100%' }} />
}

// ---- Preview (classic modes, all modes persist) ----------------------------
export default function BodyMapClassicModesV3({ questionTitle }) {
  const [currentView, setCurrentView] = useState('front')
  const [activeMode, setActiveMode] = useState('Pain')
  // sel[mode][partId] = { name, severity }
  const [sel, setSel] = useState({ Pain: {}, Soreness: {}, Stiffness: {} })
  // single active (editing) entry across modes
  const [active, setActive] = useState(null) // { mode, partId } | null
  const [notes, setNotes] = useState({})
  const [noteOpenFor, setNoteOpenFor] = useState(null)
  const [expandedNotes, setExpandedNotes] = useState({})

  const color = MODE_COLORS[activeMode]
  const MAX = 10

  const selectRegion = (id, name) => {
    setSel((prev) => {
      if (prev[activeMode][id]) return prev
      if (Object.keys(prev[activeMode]).length >= MAX) return prev
      return { ...prev, [activeMode]: { ...prev[activeMode], [id]: { name, severity: 5 } } }
    })
    setActive({ mode: activeMode, partId: id })
    setNoteOpenFor(null)
  }
  const handlePartClick = (id, name) => selectRegion(id, name)
  const handleCommon = (id, label) => { setCurrentView(id.startsWith('rear-') ? 'rear' : 'front'); selectRegion(id, label) }

  const setSeverity = (v) => {
    if (!active) return
    setSel((p) => ({ ...p, [active.mode]: { ...p[active.mode], [active.partId]: { ...p[active.mode][active.partId], severity: v } } }))
  }
  const removeEntry = (mode, id) => {
    setSel((p) => { const n = { ...p[mode] }; delete n[id]; return { ...p, [mode]: n } })
    setActive((a) => (a && a.mode === mode && a.partId === id ? null : a))
  }

  // All confirmed selections across every mode are visible on the model at once
  // (Change 1). Where a region is marked under multiple modes, the active mode
  // takes priority, then Pain > Soreness > Stiffness order.
  const regionStyles = {}
  const labels = {}
  const modePriority = [activeMode, ...MODES.filter((m) => m !== activeMode)]
  modePriority.forEach((m) => {
    const c = MODE_COLORS[m]
    Object.entries(sel[m]).forEach(([id, d]) => {
      if (regionStyles[id]) return // already coloured by a higher-priority mode
      const isActive = active && active.mode === m && active.partId === id
      regionStyles[id] = { fill: hexToRgba(c, severityAlpha(d.severity)), stroke: c, strokeWidth: isActive ? 2 : 1 }
      labels[id] = d.severity
    })
  })

  // Combined chip list across all modes
  const allEntries = []
  MODES.forEach((m) => {
    Object.entries(sel[m]).forEach(([id, d]) => allEntries.push({ mode: m, partId: id, name: d.name, severity: d.severity }))
  })
  const total = allEntries.length
  const frontEntries = allEntries.filter((e) => e.partId.startsWith('front-'))
  const backEntries = allEntries.filter((e) => e.partId.startsWith('rear-'))
  const notedParts = [...new Set(allEntries.filter((e) => notes[e.partId]).map((e) => e.partId))]

  const activeData = active ? sel[active.mode]?.[active.partId] : null
  const activeColor = active ? MODE_COLORS[active.mode] : color

  const renderChip = (e) => {
    const c = MODE_COLORS[e.mode]
    const isActive = active && active.mode === e.mode && active.partId === e.partId
    return (
      <Box
        key={`${e.mode}::${e.partId}`}
        onClick={() => { setActive({ mode: e.mode, partId: e.partId }); setActiveMode(e.mode); setCurrentView(e.partId.startsWith('rear-') ? 'rear' : 'front'); setNoteOpenFor(null) }}
        sx={{
          display: 'inline-flex', alignItems: 'center', gap: 1, height: 30, pl: 0.5, pr: 0.25, borderRadius: '15px', cursor: 'pointer',
          backgroundColor: isActive ? hexToRgba(c, 0.18) : 'transparent',
          border: isActive ? `2px solid ${c}` : `1px solid ${hexToRgba(c, 0.5)}`,
          opacity: isActive ? 1 : 0.75,
        }}
      >
        <Box sx={{ width: 20, height: 20, borderRadius: '50%', backgroundColor: c, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 700, flexShrink: 0 }}>{e.severity}</Box>
        <Typography variant="body2" sx={{ color: c, fontSize: '12px', fontWeight: isActive ? 600 : 500 }}>{e.name}</Typography>
        <Box component="button" type="button" aria-label="Remove" onClick={(ev) => { ev.stopPropagation(); removeEntry(e.mode, e.partId) }} sx={{ width: 28, height: 28, p: 0, border: 'none', background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: c }}>
          <CloseOutlined sx={{ fontSize: 16 }} />
        </Box>
      </Box>
    )
  }

  const heading = questionTitle && questionTitle.trim() ? questionTitle.trim() : 'None'

  return (
    <Box sx={{ p: 4 }}>
      <Box sx={{ maxWidth: 960 }}>
        <Typography variant="h6" sx={{ fontWeight: 600 }}>Sub-section 1.1</Typography>
        <Typography variant="subtitle1" sx={{ fontWeight: 600, mt: 1 }}>{heading}</Typography>
        <Typography variant="body2" sx={{ color: 'var(--color-text-secondary)', mb: 2 }}>Tap an area, then set severity 1–10.</Typography>

        <Box sx={{ display: 'flex', gap: 6, alignItems: 'flex-start', flexWrap: 'wrap' }}>
          {/* Left — model with flip button above it */}
          <Box sx={{ flex: '0 0 auto', display: 'flex', flexDirection: 'column' }}>
            {/* Flip pill button (mobile style) over the model */}
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 1 }}>
              <Box
                component="button" type="button"
                onClick={() => setCurrentView((v) => (v === 'front' ? 'rear' : 'front'))}
                sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.75, border: '1px solid var(--color-border-primary)', borderRadius: '20px', px: 2, py: 0.75, backgroundColor: 'var(--color-background-primary)', color: 'var(--color-text-secondary)', cursor: 'pointer', '&:hover': { backgroundColor: 'var(--color-background-secondary)' } }}
              >
                <SyncOutlined sx={{ fontSize: 18 }} />
                <Typography variant="body2" sx={{ fontWeight: 500 }}>{currentView === 'front' ? 'Front' : 'Back'}</Typography>
              </Box>
            </Box>
            <Box sx={{ '& svg': { width: 'auto', height: '460px', display: 'block' } }}>
              <BodyModelSvg regionStyles={regionStyles} labels={labels} currentView={currentView} onPartClick={handlePartClick} />
            </Box>
          </Box>

          {/* Right — content */}
          <Box sx={{ flex: '1 1 360px', minWidth: 300 }}>
            {/* Mode buttons */}
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
              {MODES.map((m) => {
                const c = MODE_COLORS[m]
                const a = activeMode === m
                return (
                  <Button key={m} variant="contained" disableElevation size="small" onClick={() => { setActiveMode(m); setActive(null); setNoteOpenFor(null) }}
                    sx={{ textTransform: 'none', fontWeight: 600, px: 2, borderRadius: '20px', border: `1.5px solid ${c}`, backgroundColor: a ? c : 'transparent', color: a ? '#fff' : c, '&:hover': { backgroundColor: a ? c : hexToRgba(c, 0.08) } }}>
                    {m}
                  </Button>
                )
              })}
            </Box>

            {/* Inline severity slider for the active entry (no "Mark any" heading) */}
            {activeData && (
              <Box sx={{ mb: 2.5 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 0.5 }}>{activeData.name}</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Slider min={1} max={10} step={1} value={activeData.severity} onChange={(_, v) => setSeverity(v)}
                    sx={{ flex: 1, color: activeColor, '& .MuiSlider-thumb': { backgroundColor: activeColor }, '& .MuiSlider-track': { backgroundColor: activeColor, borderColor: activeColor }, '& .MuiSlider-rail': { backgroundColor: 'var(--color-border-primary)' } }} />
                  <Typography variant="body1" sx={{ color: activeColor, fontWeight: 700, minWidth: 44, textAlign: 'right' }}>{activeData.severity}/10</Typography>
                </Box>
                <Box component="button" type="button" onClick={() => removeEntry(active.mode, active.partId)} sx={{ mt: 1, p: 0, border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--color-error)', fontSize: '13px', fontWeight: 500 }}>Remove area</Box>
                {/* Add note */}
                <Box sx={{ mt: 1.5 }}>
                  {notes[active.partId] != null || noteOpenFor === active.partId ? (
                    <TextField multiline minRows={2} fullWidth variant="filled" size="small" value={notes[active.partId] || ''} autoFocus={noteOpenFor === active.partId}
                      onChange={(e) => setNotes((p) => ({ ...p, [active.partId]: e.target.value.slice(0, 280) }))} inputProps={{ maxLength: 280 }}
                      helperText={`${(notes[active.partId] || '').length}/280`} FormHelperTextProps={{ sx: { textAlign: 'right', m: 0, mt: 0.5 } }} />
                  ) : (
                    <Button variant="outlined" size="small" startIcon={<StickyNote2Outlined sx={{ fontSize: 18 }} />} onClick={() => setNoteOpenFor(active.partId)}
                      sx={{ textTransform: 'none', fontWeight: 500, borderRadius: '20px', color: 'var(--color-text-secondary)', borderColor: 'var(--color-border-primary)', '&:hover': { borderColor: 'var(--color-border-primary)', backgroundColor: 'var(--color-background-secondary)' } }}>Add note</Button>
                  )}
                </Box>
              </Box>
            )}

            {total === 0 && !activeData ? (
              /* Empty state — common shortcuts */
              <Box>
                <Typography variant="caption" sx={{ display: 'block', color: 'var(--color-text-muted)', fontSize: '11px', fontWeight: 700, letterSpacing: '0.06em', mb: 1 }}>COMMON</Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {COMMON_AREAS.map((area) => (
                    <Chip key={area.id} label={area.label} variant="outlined" onClick={() => handleCommon(area.id, area.label)}
                      sx={{ cursor: 'pointer', borderColor: 'var(--color-border-primary)', color: 'var(--color-text-secondary)', '&:hover': { backgroundColor: 'var(--color-background-secondary)' } }} />
                  ))}
                </Box>
              </Box>
            ) : (
              <Box>
                {/* Combined count + chips (all modes, grouped Front/Back) */}
                <Typography variant="caption" sx={{ display: 'block', color: 'var(--color-text-secondary)', fontWeight: 700, letterSpacing: '0.06em', mb: 1.5 }}>MARKED · {total}</Typography>
                {frontEntries.length > 0 && (
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="caption" sx={{ display: 'block', color: 'var(--color-text-muted)', fontSize: '11px', fontWeight: 700, letterSpacing: '0.06em', mb: 0.75 }}>FRONT</Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>{frontEntries.map(renderChip)}</Box>
                  </Box>
                )}
                {backEntries.length > 0 && (
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="caption" sx={{ display: 'block', color: 'var(--color-text-muted)', fontSize: '11px', fontWeight: 700, letterSpacing: '0.06em', mb: 0.75 }}>BACK</Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>{backEntries.map(renderChip)}</Box>
                  </Box>
                )}
                {/* Note indicators */}
                {notedParts.length > 0 && (
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 2 }}>
                    {notedParts.map((pid) => (
                      <Box key={pid}>
                        <Box onClick={() => setExpandedNotes((p) => ({ ...p, [pid]: !p[pid] }))} sx={{ display: 'flex', alignItems: 'center', gap: 0.5, cursor: 'pointer' }}>
                          <StickyNote2Outlined sx={{ fontSize: 14, color: 'var(--color-text-muted)' }} />
                          <Typography variant="caption" sx={{ color: 'var(--color-text-muted)', fontSize: '11px' }}>Note added · {partIdToName(pid)}</Typography>
                          <Box sx={{ ml: 'auto', display: 'flex', alignItems: 'center', gap: 0.25 }}>
                            <Typography variant="caption" sx={{ color: 'var(--color-text-secondary)', fontSize: '11px' }}>View</Typography>
                            <ChevronRightOutlined sx={{ fontSize: 14, color: 'var(--color-text-secondary)', transform: expandedNotes[pid] ? 'rotate(90deg)' : 'none', transition: 'transform 0.2s' }} />
                          </Box>
                        </Box>
                        <Collapse in={!!expandedNotes[pid]} unmountOnExit>
                          <Box sx={{ mt: 0.5, p: 1.25, backgroundColor: 'var(--color-background-secondary)', borderRadius: 'var(--radius-md)' }}>
                            <Typography variant="body2" sx={{ color: 'var(--color-text-secondary)', fontSize: '12px', lineHeight: 1.5 }}>{notes[pid]}</Typography>
                          </Box>
                        </Collapse>
                      </Box>
                    ))}
                  </Box>
                )}

              </Box>
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  )
}
