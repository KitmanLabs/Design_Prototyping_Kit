import React, { useState, useRef, useEffect } from 'react'
import {
  Box,
  Typography,
  Button,
  Chip,
  Slider,
  ToggleButton,
  ToggleButtonGroup,
  TextField,
  Collapse,
} from '@mui/material'
import { InfoOutlined, CloseOutlined, StickyNote2Outlined, ChevronRightOutlined } from '@mui/icons-material'
import bodyMapSvgUrl from '../../assets/body-map.svg'
import '../../styles/design-tokens.css'

let SVG_CACHE = null

// Symptom modes + colours
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

function partIdToName(id) {
  return id.replace(/^(front|rear)-/, '').replace(/_+/g, ' ').replace(/\s+/g, ' ').trim()
}

function hexToRgba(hex, alpha) {
  const h = hex.replace('#', '')
  const r = parseInt(h.slice(0, 2), 16)
  const g = parseInt(h.slice(2, 4), 16)
  const b = parseInt(h.slice(4, 6), 16)
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

const severityAlpha = (severity) => 0.3 + (Math.max(1, Math.min(10, severity)) / 10) * 0.7

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

      if (groupView !== currentView) {
        group.style.display = 'none'
        return
      }
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

  return (
    <Box
      ref={containerRef}
      onClick={handleClick}
      dangerouslySetInnerHTML={{ __html: svgHtml ?? '' }}
      sx={{ width: '100%' }}
    />
  )
}

// ---- Page ------------------------------------------------------------------
export default function BodyMapClassicModes() {
  const [currentView, setCurrentView] = useState('front')
  const [activeMode, setActiveMode] = useState('Pain')
  // selections per mode: { [mode]: { [partId]: { name, severity } } }
  const [selections, setSelections] = useState({ Pain: {}, Soreness: {}, Stiffness: {} })
  const [activeRegion, setActiveRegion] = useState({ Pain: null, Soreness: null, Stiffness: null })
  // one note per body area, shared across all modes
  const [notes, setNotes] = useState({})
  const [noteOpenFor, setNoteOpenFor] = useState(null)
  const [expandedNotes, setExpandedNotes] = useState(new Set())

  const MAX_AREAS = 10
  const color = MODE_COLORS[activeMode]
  const modeSelections = selections[activeMode]
  const entries = Object.entries(modeSelections)
  const count = entries.length
  const activeRegionId = activeRegion[activeMode]
  const activeData = activeRegionId ? modeSelections[activeRegionId] : null

  const selectRegion = (id, name) => {
    setSelections((prev) => {
      if (prev[activeMode][id]) return prev
      if (Object.keys(prev[activeMode]).length >= MAX_AREAS) return prev
      return { ...prev, [activeMode]: { ...prev[activeMode], [id]: { name, severity: 5 } } }
    })
    setActiveRegion((prev) => ({ ...prev, [activeMode]: id }))
    setNoteOpenFor(null)
  }

  const handlePartClick = (id, name) => selectRegion(id, name)

  const handleCommon = (id, label) => {
    setCurrentView(id.startsWith('rear-') ? 'rear' : 'front')
    selectRegion(id, label)
  }

  const handleSeverity = (value) => {
    if (!activeRegionId) return
    setSelections((prev) => ({
      ...prev,
      [activeMode]: { ...prev[activeMode], [activeRegionId]: { ...prev[activeMode][activeRegionId], severity: value } },
    }))
  }

  const handleRemove = (id) => {
    setSelections((prev) => {
      const next = { ...prev[activeMode] }
      delete next[id]
      return { ...prev, [activeMode]: next }
    })
    setActiveRegion((prev) => (prev[activeMode] === id ? { ...prev, [activeMode]: null } : prev))
  }

  const toggleNoteExpanded = (id) => {
    setExpandedNotes((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  // Model fills + on-model labels for the active mode only
  const regionStyles = {}
  const labels = {}
  entries.forEach(([id, { severity }]) => {
    regionStyles[id] = {
      fill: hexToRgba(color, severityAlpha(severity)),
      stroke: color,
      strokeWidth: id === activeRegionId ? 2 : 1,
    }
    labels[id] = severity
  })

  const frontEntries = entries.filter(([id]) => id.startsWith('front-'))
  const backEntries = entries.filter(([id]) => id.startsWith('rear-'))
  const notedEntries = entries.filter(([id]) => notes[id])

  const renderChip = ([id, { name, severity }]) => (
    <Box
      key={id}
      onClick={() => { setActiveRegion((prev) => ({ ...prev, [activeMode]: id })); setNoteOpenFor(null) }}
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 1,
        height: 32,
        pl: 0.5,
        pr: 0.5,
        borderRadius: '16px',
        cursor: 'pointer',
        backgroundColor: hexToRgba(color, 0.12),
        border: id === activeRegionId ? `2px solid ${color}` : `1px solid ${color}`,
      }}
    >
      <Box
        sx={{
          width: 22,
          height: 22,
          borderRadius: '50%',
          backgroundColor: color,
          color: 'var(--color-white)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '11px',
          fontWeight: 700,
          flexShrink: 0,
        }}
      >
        {severity}
      </Box>
      <Typography variant="body2" sx={{ color, fontSize: '12px', fontWeight: 500 }}>
        {name}
      </Typography>
      <Box
        component="button"
        type="button"
        aria-label={`Remove ${name}`}
        onClick={(e) => { e.stopPropagation(); handleRemove(id) }}
        sx={{ mr: 0.25, p: 0, border: 'none', background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', color }}
      >
        <CloseOutlined sx={{ fontSize: 16 }} />
      </Box>
    </Box>
  )

  return (
    <Box sx={{ p: 4 }}>
      <Box sx={{ maxWidth: 960 }}>
        {/* Sub-section heading + description */}
        <Typography variant="h6" sx={{ fontWeight: 600, color: 'var(--color-text-primary)' }}>
          Sub-section 1.1
        </Typography>
        <Typography variant="subtitle1" sx={{ fontWeight: 600, color: 'var(--color-text-primary)', mt: 1 }}>
          Body map for Sprint Review
        </Typography>
        <Typography variant="body2" sx={{ color: 'var(--color-text-secondary)', mb: 2 }}>
          Tap an area, then set severity 1–10.
        </Typography>

        {/* Front / Back toggle — top right of content area */}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 1 }}>
          <ToggleButtonGroup
            exclusive
            size="small"
            value={currentView}
            onChange={(_, v) => v && setCurrentView(v)}
            sx={{
              '& .MuiToggleButton-root': {
                textTransform: 'none',
                px: 2,
                py: 0.5,
                fontSize: '13px',
                color: 'var(--color-text-secondary)',
                borderColor: 'var(--color-border-primary)',
                '&.Mui-selected': {
                  backgroundColor: 'var(--color-background-secondary)',
                  color: 'var(--color-text-primary)',
                  fontWeight: 600,
                },
              },
            }}
          >
            <ToggleButton value="front">Front</ToggleButton>
            <ToggleButton value="rear">Back</ToggleButton>
          </ToggleButtonGroup>
        </Box>

        {/* Two columns: model left, content right */}
        <Box sx={{ display: 'flex', gap: 4, alignItems: 'flex-start', flexWrap: 'wrap' }}>
          {/* Left — body model */}
          <Box sx={{ flex: '0 0 auto', '& svg': { width: 'auto', height: '460px', display: 'block' } }}>
            <BodyModelSvg regionStyles={regionStyles} labels={labels} currentView={currentView} onPartClick={handlePartClick} />
          </Box>

          {/* Right — content */}
          <Box sx={{ flex: '1 1 360px', minWidth: 300 }}>
            {/* Mode buttons */}
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
              {MODES.map((mode) => {
                const c = MODE_COLORS[mode]
                const active = activeMode === mode
                return (
                  <Button
                    key={mode}
                    variant="contained"
                    disableElevation
                    size="small"
                    onClick={() => { setActiveMode(mode); setNoteOpenFor(null) }}
                    sx={{
                      textTransform: 'none',
                      fontWeight: 600,
                      px: 2,
                      borderRadius: '20px',
                      border: `1.5px solid ${c}`,
                      // eslint-disable-next-line design-system/no-hardcoded-colors
                      backgroundColor: active ? c : 'transparent',
                      color: active ? 'var(--color-white)' : c,
                      '&:hover': {
                        // eslint-disable-next-line design-system/no-hardcoded-colors
                        backgroundColor: active ? c : hexToRgba(c, 0.08),
                      },
                    }}
                  >
                    {mode}
                  </Button>
                )
              })}
            </Box>

            {/* Heading + subtitle reflect the active mode */}
            <Typography variant="h6" sx={{ fontWeight: 600, color: 'var(--color-text-primary)', mb: 0.5 }}>
              Mark any {activeMode.toLowerCase()}
            </Typography>
            <Typography variant="body2" sx={{ color: 'var(--color-text-secondary)', mb: 2.5 }}>
              Select an area and set your {activeMode.toLowerCase()} severity 1–10.
            </Typography>

            {/* Inline severity slider + Add note when a region is active */}
            {activeData && (
              <Box sx={{ mb: 2.5 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600, color: 'var(--color-text-primary)', mb: 0.5 }}>
                  {activeData.name}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Slider
                    min={1}
                    max={10}
                    step={1}
                    value={activeData.severity}
                    onChange={(_, v) => handleSeverity(v)}
                    sx={{
                      flex: 1,
                      color,
                      '& .MuiSlider-thumb': { backgroundColor: color },
                      '& .MuiSlider-track': { backgroundColor: color, borderColor: color },
                      '& .MuiSlider-rail': { backgroundColor: 'var(--color-border-primary)' },
                    }}
                  />
                  <Typography variant="body1" sx={{ color, fontWeight: 700, minWidth: 44, textAlign: 'right' }}>
                    {activeData.severity}/10
                  </Typography>
                </Box>
                <Box
                  component="button"
                  type="button"
                  onClick={() => handleRemove(activeRegionId)}
                  sx={{ mt: 1, p: 0, border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--color-error)', fontSize: '13px', fontWeight: 500 }}
                >
                  Remove area
                </Box>

                {/* Add note (one note per body area, shared across modes) */}
                <Box sx={{ mt: 1.5 }}>
                  {notes[activeRegionId] != null || noteOpenFor === activeRegionId ? (
                    <TextField
                      multiline
                      minRows={2}
                      fullWidth
                      variant="filled"
                      size="small"
                      autoFocus={noteOpenFor === activeRegionId}
                      value={notes[activeRegionId] || ''}
                      onChange={(e) => setNotes((prev) => ({ ...prev, [activeRegionId]: e.target.value.slice(0, 280) }))}
                      inputProps={{ maxLength: 280 }}
                      helperText={`${(notes[activeRegionId] || '').length}/280`}
                      FormHelperTextProps={{ sx: { textAlign: 'right', m: 0, mt: 0.5 } }}
                    />
                  ) : (
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<StickyNote2Outlined sx={{ fontSize: 18 }} />}
                      onClick={() => setNoteOpenFor(activeRegionId)}
                      sx={{
                        textTransform: 'none',
                        fontWeight: 500,
                        borderRadius: '20px',
                        color: 'var(--color-text-secondary)',
                        borderColor: 'var(--color-border-primary)',
                        '&:hover': { borderColor: 'var(--color-border-primary)', backgroundColor: 'var(--color-background-secondary)' },
                      }}
                    >
                      Add note
                    </Button>
                  )}
                </Box>
              </Box>
            )}

            {count === 0 && !activeData ? (
              /* Default state — common area shortcuts */
              <>
                <Typography variant="caption" sx={{ display: 'block', color: 'var(--color-text-muted)', fontSize: '11px', fontWeight: 700, letterSpacing: '0.06em', mb: 1 }}>
                  COMMON
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {COMMON_AREAS.map((area) => (
                    <Chip
                      key={area.id}
                      label={area.label}
                      variant="outlined"
                      onClick={() => handleCommon(area.id, area.label)}
                      sx={{
                        cursor: 'pointer',
                        borderColor: 'var(--color-border-primary)',
                        color: 'var(--color-text-secondary)',
                        '&:hover': { backgroundColor: 'var(--color-background-secondary)' },
                      }}
                    />
                  ))}
                </Box>
              </>
            ) : (
              <>
                {/* Info banner */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, px: 1.5, py: 1, mb: 2, borderRadius: 'var(--radius-md)', backgroundColor: 'var(--color-background-secondary)' }}>
                  <InfoOutlined sx={{ fontSize: 18, color: 'var(--color-text-secondary)' }} />
                  <Typography variant="body2" sx={{ color: 'var(--color-text-secondary)' }}>
                    Tap a marked area to edit, or select another area on the body.
                  </Typography>
                </Box>

                {/* Marked count for the active mode */}
                <Typography variant="caption" sx={{ display: 'block', color: 'var(--color-text-secondary)', fontWeight: 700, letterSpacing: '0.06em', mb: 1.5 }}>
                  {COUNT_LABEL[activeMode]} · {count}
                </Typography>

                {frontEntries.length > 0 && (
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="caption" sx={{ display: 'block', color: 'var(--color-text-muted)', fontSize: '11px', fontWeight: 700, letterSpacing: '0.06em', mb: 0.75 }}>
                      FRONT
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>{frontEntries.map(renderChip)}</Box>
                  </Box>
                )}
                {backEntries.length > 0 && (
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="caption" sx={{ display: 'block', color: 'var(--color-text-muted)', fontSize: '11px', fontWeight: 700, letterSpacing: '0.06em', mb: 0.75 }}>
                      BACK
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>{backEntries.map(renderChip)}</Box>
                  </Box>
                )}

                {/* Note indicators per area (shared across modes) */}
                {notedEntries.length > 0 && (
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    {notedEntries.map(([id, { name }]) => (
                      <Box key={id}>
                        <Box onClick={() => toggleNoteExpanded(id)} sx={{ display: 'flex', alignItems: 'center', gap: 0.5, cursor: 'pointer' }}>
                          <StickyNote2Outlined sx={{ fontSize: 14, color: 'var(--color-text-muted)' }} />
                          <Typography variant="caption" sx={{ color: 'var(--color-text-muted)', fontSize: '11px' }}>
                            Note added · {name}
                          </Typography>
                          <Box sx={{ ml: 'auto', display: 'flex', alignItems: 'center', gap: 0.25 }}>
                            <Typography variant="caption" sx={{ color: 'var(--color-text-secondary)', fontSize: '11px' }}>
                              View
                            </Typography>
                            <ChevronRightOutlined sx={{ fontSize: 14, color: 'var(--color-text-secondary)', transform: expandedNotes.has(id) ? 'rotate(90deg)' : 'none', transition: 'transform 0.2s' }} />
                          </Box>
                        </Box>
                        <Collapse in={expandedNotes.has(id)} unmountOnExit>
                          <Box sx={{ mt: 0.5, p: 1.25, backgroundColor: 'var(--color-background-secondary)', borderRadius: 'var(--radius-md)' }}>
                            <Typography variant="body2" sx={{ color: 'var(--color-text-secondary)', fontSize: '12px', lineHeight: 1.5 }}>
                              {notes[id]}
                            </Typography>
                          </Box>
                        </Collapse>
                      </Box>
                    ))}
                  </Box>
                )}
              </>
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  )
}
