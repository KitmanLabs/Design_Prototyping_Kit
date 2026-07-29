import React, { useState, useRef, useEffect } from 'react'
import { Box, Typography, Button, Slider } from '@mui/material'
import { SyncOutlined, CloseOutlined } from '@mui/icons-material'
import bodyMapSvgUrl from '../../assets/body-map.svg'
import '../../styles/design-tokens.css'

let SVG_CACHE = null

// Dedicated symptom modes — each with its own colour (per this prototype's spec)
// eslint-disable-next-line design-system/no-hardcoded-colors
const MODE_COLORS = { Soreness: '#e67e22', Stiffness: '#2980b9', Pain: '#c0392b' }
const MODES = ['Soreness', 'Stiffness', 'Pain']
const COUNT_LABEL = { Soreness: 'SORE AREAS', Stiffness: 'STIFF AREAS', Pain: 'PAINFUL AREAS' }

function partIdToName(id) {
  return id.replace(/^(front|rear)-/, '').replace(/_/g, ' ')
}

function hexToRgba(hex, alpha) {
  const h = hex.replace('#', '')
  const r = parseInt(h.slice(0, 2), 16)
  const g = parseInt(h.slice(2, 4), 16)
  const b = parseInt(h.slice(4, 6), 16)
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

// Severity (1–10) → fill opacity: lighter = lower, darker = higher
const severityAlpha = (severity) => 0.3 + (Math.max(1, Math.min(10, severity)) / 10) * 0.7

// ---- Body model (single active-mode colour + on-region severity numbers) --
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
    svg.querySelectorAll('text[data-view-label]').forEach((t) => t.remove())
    svg.querySelectorAll('text').forEach((t) => {
      if (t.textContent === 'FRONT') t.style.display = currentView === 'front' ? '' : 'none'
      if (t.textContent === 'REAR') t.style.display = currentView === 'rear' ? '' : 'none'
    })

    svg.querySelectorAll('g[id]').forEach((group) => {
      const id = group.id
      const groupView = id.startsWith('front-') ? 'front' : 'rear'
      const path = group.querySelector('path')
      if (!path) return

      // Remove any prior severity label
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

        // Severity number directly on the region
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
export default function BodyMapSymptomModes() {
  const [activeMode, setActiveMode] = useState('Soreness')
  const [currentView, setCurrentView] = useState('front')
  // selections per mode: { [mode]: { [partId]: { name, severity } } }
  const [selections, setSelections] = useState({ Soreness: {}, Stiffness: {}, Pain: {} })
  // active (slider-open) region per mode
  const [activeRegion, setActiveRegion] = useState({ Soreness: null, Stiffness: null, Pain: null })
  // confirmed / submitted state after pressing Done
  const [submitted, setSubmitted] = useState(false)

  const color = MODE_COLORS[activeMode]
  const modeSelections = selections[activeMode]
  const activePartId = activeRegion[activeMode]

  const handlePartClick = (id, name) => {
    setSelections((prev) => {
      if (prev[activeMode][id]) return prev // already selected — just re-activate
      return { ...prev, [activeMode]: { ...prev[activeMode], [id]: { name, severity: 5 } } }
    })
    setActiveRegion((prev) => ({ ...prev, [activeMode]: id }))
  }

  const handleSeverity = (value) => {
    if (!activePartId) return
    setSelections((prev) => ({
      ...prev,
      [activeMode]: { ...prev[activeMode], [activePartId]: { ...prev[activeMode][activePartId], severity: value } },
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

  // Region fills + on-model severity labels for the active mode only
  const regionStyles = {}
  const labels = {}
  Object.entries(modeSelections).forEach(([id, { severity }]) => {
    regionStyles[id] = {
      fill: hexToRgba(color, severityAlpha(severity)),
      stroke: color,
      strokeWidth: id === activePartId ? 2 : 1,
    }
    labels[id] = severity
  })

  const activeRegionData = activePartId ? modeSelections[activePartId] : null
  const activeRegionName = activeRegionData ? activeRegionData.name : ''
  const activeSeverity = activeRegionData ? activeRegionData.severity : 5

  // Chips grouped Front / Back
  const entries = Object.entries(modeSelections)
  const frontEntries = entries.filter(([id]) => id.startsWith('front-'))
  const backEntries = entries.filter(([id]) => id.startsWith('rear-'))

  const renderChip = ([id, { name, severity }]) => (
    <Box
      key={id}
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 1,
        height: 32,
        pl: 0.5,
        pr: 0.5,
        borderRadius: '16px',
        backgroundColor: hexToRgba(color, 0.12),
        border: `1px solid ${color}`,
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
        onClick={() => handleRemove(id)}
        sx={{
          ml: 0.25,
          mr: 0.25,
          p: 0,
          border: 'none',
          background: 'transparent',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          color,
        }}
      >
        <CloseOutlined sx={{ fontSize: 16 }} />
      </Box>
    </Box>
  )

  const totalCount = entries.length

  const grandTotal = MODES.reduce((sum, m) => sum + Object.keys(selections[m]).length, 0)

  // ---- Done / submitted state ----
  if (submitted) {
    return (
      <Box sx={{ p: 4 }}>
        <Box sx={{ maxWidth: 900 }}>
          {/* Confirmation header */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
              p: 2,
              mb: 3,
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--color-success-light, var(--color-background-secondary))',
              border: '1px solid var(--color-success)',
            }}
          >
            <Box
              sx={{
                width: 28,
                height: 28,
                borderRadius: '50%',
                backgroundColor: 'var(--color-success)',
                color: 'var(--color-white)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                fontWeight: 700,
              }}
            >
              ✓
            </Box>
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, color: 'var(--color-text-primary)' }}>
                Responses submitted
              </Typography>
              <Typography variant="body2" sx={{ color: 'var(--color-text-secondary)' }}>
                {grandTotal === 0
                  ? 'No areas were marked.'
                  : `${grandTotal} area${grandTotal === 1 ? '' : 's'} marked across ${MODES.filter((m) => Object.keys(selections[m]).length > 0).length} symptom type${MODES.filter((m) => Object.keys(selections[m]).length > 0).length === 1 ? '' : 's'}.`}
              </Typography>
            </Box>
          </Box>

          {/* Read-only summary grouped by mode */}
          {MODES.map((mode) => {
            const list = Object.entries(selections[mode])
            if (list.length === 0) return null
            const c = MODE_COLORS[mode]
            return (
              <Box key={mode} sx={{ mb: 3 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, color: c, mb: 1 }}>
                  {mode} · {list.length}
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {list.map(([id, { name, severity }]) => (
                    <Box
                      key={id}
                      sx={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 1,
                        height: 32,
                        pl: 0.5,
                        pr: 1.5,
                        borderRadius: '16px',
                        backgroundColor: hexToRgba(c, 0.12),
                        border: `1px solid ${c}`,
                      }}
                    >
                      <Box
                        sx={{
                          width: 22,
                          height: 22,
                          borderRadius: '50%',
                          backgroundColor: c,
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
                      <Typography variant="body2" sx={{ color: c, fontSize: '12px', fontWeight: 500 }}>
                        {name}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </Box>
            )
          })}

          {/* Edit responses */}
          <Button
            variant="outlined"
            onClick={() => setSubmitted(false)}
            sx={{
              mt: 1,
              textTransform: 'none',
              fontWeight: 500,
              borderColor: 'var(--color-border-primary)',
              color: 'var(--color-primary)',
              '&:hover': { borderColor: 'var(--color-border-focus)', backgroundColor: 'var(--color-primary-light)' },
            }}
          >
            Edit responses
          </Button>
        </Box>
      </Box>
    )
  }

  return (
    <Box sx={{ p: 4 }}>
      <Box sx={{ maxWidth: 900 }}>
        {/* Question heading */}
        <Typography variant="h6" sx={{ fontWeight: 600, color: 'var(--color-text-primary)', mb: 2 }}>
          Where are you experiencing discomfort?
        </Typography>

        {/* Mode buttons */}
        <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
          {MODES.map((mode) => {
            const c = MODE_COLORS[mode]
            const active = activeMode === mode
            return (
              <Button
                key={mode}
                variant="contained"
                disableElevation
                onClick={() => setActiveMode(mode)}
                sx={{
                  textTransform: 'none',
                  fontWeight: 600,
                  px: 2.5,
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

        {/* Builder-config placeholder note */}
        <Typography variant="caption" sx={{ display: 'block', color: 'var(--color-text-muted)', mt: 1, mb: 3 }}>
          Your coach may configure which of these are shown.
        </Typography>

        {/* Interaction panel header */}
        <Typography variant="subtitle1" sx={{ fontWeight: 600, color: 'var(--color-text-primary)' }}>
          Mark any {activeMode.toLowerCase()}
        </Typography>
        <Typography variant="body2" sx={{ color: 'var(--color-text-secondary)', mb: 2 }}>
          Tap an area, then set {activeMode.toLowerCase()} severity 1–10.
        </Typography>

        {/* Model + severity panel */}
        <Box sx={{ display: 'flex', gap: 4, alignItems: 'flex-start', flexWrap: 'wrap' }}>
          {/* Model (compact, left) */}
          <Box sx={{ flex: '0 0 auto', display: 'flex', flexDirection: 'column' }}>
            {/* Front / Back flip button */}
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 1 }}>
              <Box
                component="button"
                type="button"
                onClick={() => setCurrentView((v) => (v === 'front' ? 'rear' : 'front'))}
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 0.75,
                  border: '1px solid var(--color-border-primary)',
                  borderRadius: '20px',
                  px: 2,
                  py: 0.75,
                  backgroundColor: 'var(--color-background-primary)',
                  color: 'var(--color-text-secondary)',
                  cursor: 'pointer',
                  '&:hover': { backgroundColor: 'var(--color-background-secondary)' },
                }}
              >
                <SyncOutlined sx={{ fontSize: 18 }} />
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  {currentView === 'front' ? 'Front' : 'Back'}
                </Typography>
              </Box>
            </Box>
            <Box sx={{ '& svg': { width: 'auto', height: '500px', display: 'block' } }}>
              <BodyModelSvg regionStyles={regionStyles} labels={labels} currentView={currentView} onPartClick={handlePartClick} />
            </Box>
          </Box>

          {/* Severity panel (only when a region is active in this mode) */}
          {activeRegionData && (
            <Box sx={{ flex: '0 1 360px', minWidth: 260, pt: 6 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, color: 'var(--color-text-primary)', mb: 0.5 }}>
                {activeRegionName}
              </Typography>
              <Typography variant="body2" sx={{ color: 'var(--color-text-secondary)', mb: 2 }}>
                Set {activeMode.toLowerCase()} severity
              </Typography>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Slider
                  min={1}
                  max={10}
                  step={1}
                  value={activeSeverity}
                  onChange={(_, v) => handleSeverity(v)}
                  sx={{
                    flex: 1,
                    '& .MuiSlider-rail': {
                      opacity: 1,
                      background: `linear-gradient(90deg, ${hexToRgba(color, 0.25)}, ${color})`,
                    },
                    '& .MuiSlider-track': { border: 'none', backgroundColor: 'transparent' },
                    '& .MuiSlider-thumb': { backgroundColor: color },
                  }}
                />
                <Typography variant="body1" sx={{ color, fontWeight: 700, minWidth: 44, textAlign: 'right' }}>
                  {activeSeverity}/10
                </Typography>
              </Box>

              {/* Remove link */}
              <Box
                component="button"
                type="button"
                onClick={() => handleRemove(activePartId)}
                sx={{
                  mt: 1.5,
                  p: 0,
                  border: 'none',
                  background: 'transparent',
                  cursor: 'pointer',
                  color: 'var(--color-error)',
                  fontSize: '13px',
                  fontWeight: 500,
                }}
              >
                Remove {activeMode.toLowerCase()}
              </Box>
            </Box>
          )}
        </Box>

        {/* Count + chips grouped Front / Back */}
        {totalCount > 0 && (
          <Box sx={{ mt: 3 }}>
            <Typography
              variant="caption"
              sx={{ display: 'block', color: 'var(--color-text-secondary)', fontWeight: 700, letterSpacing: '0.06em', mb: 1.5 }}
            >
              {COUNT_LABEL[activeMode]} · {totalCount}
            </Typography>

            {frontEntries.length > 0 && (
              <Box sx={{ mb: 2 }}>
                <Typography variant="caption" sx={{ display: 'block', color: 'var(--color-text-muted)', fontSize: '11px', mb: 0.75 }}>
                  Front
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>{frontEntries.map(renderChip)}</Box>
              </Box>
            )}
            {backEntries.length > 0 && (
              <Box sx={{ mb: 2 }}>
                <Typography variant="caption" sx={{ display: 'block', color: 'var(--color-text-muted)', fontSize: '11px', mb: 0.75 }}>
                  Back
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>{backEntries.map(renderChip)}</Box>
              </Box>
            )}
          </Box>
        )}

        {/* Done button — full width */}
        <Button
          fullWidth
          variant="contained"
          disableElevation
          onClick={() => setSubmitted(true)}
          sx={{
            mt: 2,
            py: 1.25,
            textTransform: 'none',
            fontWeight: 500,
            backgroundColor: 'var(--color-primary)',
            color: 'var(--color-white)',
            '&:hover': { backgroundColor: 'var(--color-primary-hover)' },
          }}
        >
          Done
        </Button>
      </Box>
    </Box>
  )
}
