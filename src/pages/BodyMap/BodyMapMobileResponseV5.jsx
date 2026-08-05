import React, { useState, useRef, useEffect, useCallback } from 'react'
import {
  Box,
  Typography,
  Slider,
  Chip,
  Button,
  IconButton,
  Divider,
  Collapse,
} from '@mui/material'
import { keyframes } from '@mui/system'
import { SyncOutlined, MenuOutlined, PersonOutlineOutlined, ChevronRightOutlined, CloseOutlined } from '@mui/icons-material'
import bodyMapSvgUrl from '../../assets/body-map.svg'
import '../../styles/design-tokens.css'

// Same branded logo asset used by the existing player-facing shell (MainNavigation)
const KITMAN_LOGO = '/assets/logos/Kitman Labs base.png'

// Subtle "tap here" pulse for the first-use hotspot
const hotspotPulse = keyframes`
  0% { transform: scale(0.7); opacity: 0.6; }
  70% { transform: scale(2.4); opacity: 0; }
  100% { transform: scale(2.4); opacity: 0; }
`

const MAX_VISIBLE_CHIPS = 5

// Isolated SVG cache for the mobile flow (does not share the builder's cache)
let MOBILE_SVG_CACHE = null

const SYMPTOM_TYPES = ['Pain', 'Stiffness', 'Soreness']
const QUESTION_TITLE = 'Body Map'
const INSTRUCTION_TEXT = 'Select any area on the body and set the severity.'

function partIdToName(id) {
  return id.replace(/^(front|rear)-/, '').replace(/_/g, ' ')
}

const makeKey = (partId, type) => `${partId}::${type}`

// ---- Mobile SVG (replicated rendering + 44px hit-area augmentation) --------

function MobileBodyMapSvg({ selectedParts, activePart, currentView, onPartSelect, symptomValues, activeTab }) {
  const containerRef = useRef(null)
  const [svgHtml, setSvgHtml] = useState(MOBILE_SVG_CACHE)

  // Load SVG once
  useEffect(() => {
    if (MOBILE_SVG_CACHE) { setSvgHtml(MOBILE_SVG_CACHE); return }
    fetch(bodyMapSvgUrl)
      .then((r) => r.text())
      .then((text) => {
        const processed = text
          .replace(' width="450"', '')
          .replace(' height="540"', '')
          .replace(/path:hover\s*\{[^}]*\}/, 'path { cursor: pointer; }')
        MOBILE_SVG_CACHE = processed
        setSvgHtml(processed)
      })
  }, [])

  // Apply dynamic styles + view cropping
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

      if (groupView !== currentView) {
        group.style.display = 'none'
        return
      }
      group.style.display = ''

      if (id === activePart) {
        const severity = symptomValues[id]?.[activeTab] ?? 5
        const opacity = 0.35 + (severity / 10) * 0.6
        path.style.fill = `rgba(220, 53, 69, ${opacity})`
        path.style.stroke = '#dc3545'
        path.style.strokeDasharray = '4,2'
        path.style.strokeWidth = '2'
        path.style.strokeLinejoin = 'round'
      } else if (selectedParts.has(id)) {
        const severity = symptomValues[id]?.[activeTab] ?? 5
        const opacity = 0.15 + (severity / 10) * 0.2
        path.style.fill = `rgba(220, 53, 69, ${opacity})`
        path.style.stroke = 'rgba(220, 53, 69, 0.4)'
        path.style.strokeDasharray = 'none'
        path.style.strokeWidth = '1'
      } else {
        path.style.fill = '#E0E0E0'
        path.style.stroke = '#FFFFFF'
        path.style.strokeDasharray = 'none'
        path.style.strokeWidth = '1'
      }
    })
  }, [selectedParts, activePart, currentView, symptomValues, activeTab, svgHtml])

  // Augment small regions with an invisible 44x44px touch target
  useEffect(() => {
    const container = containerRef.current
    if (!container) return
    const svg = container.querySelector('svg')
    if (!svg) return

    const addHitAreas = () => {
      const rect = svg.getBoundingClientRect()
      if (!rect.width) return
      const viewBox = (svg.getAttribute('viewBox') || '0 0 225 540').split(' ').map(Number)
      const vbWidth = viewBox[2] || 225
      const unitsPerPx = vbWidth / rect.width
      const minHitSvg = 44 * unitsPerPx // 44px expressed in svg units

      svg.querySelectorAll('g[id]').forEach((group) => {
        if (group.style.display === 'none') return
        const path = group.querySelector('path')
        if (!path) return
        // Remove stale hit area so it recalculates on view change
        const stale = group.querySelector('[data-hit-area="true"]')
        if (stale) stale.remove()
        let bbox
        try { bbox = path.getBBox() } catch { return }
        if (bbox.width >= minHitSvg && bbox.height >= minHitSvg) return
        const cx = bbox.x + bbox.width / 2
        const cy = bbox.y + bbox.height / 2
        const r = minHitSvg / 2
        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle')
        circle.setAttribute('cx', cx)
        circle.setAttribute('cy', cy)
        circle.setAttribute('r', r)
        circle.setAttribute('fill', 'transparent')
        circle.setAttribute('data-hit-area', 'true')
        circle.style.cursor = 'pointer'
        group.appendChild(circle)
      })
    }

    // Defer to allow layout to settle
    const raf = requestAnimationFrame(addHitAreas)
    window.addEventListener('resize', addHitAreas)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', addHitAreas)
    }
  }, [currentView, svgHtml])

  const handleClick = useCallback(
    (e) => {
      const group = e.target.closest('g[id]')
      if (!group) return
      const id = group.id
      const name = group.querySelector('title')?.textContent || partIdToName(id)
      onPartSelect(id, name)
    },
    [onPartSelect]
  )

  return (
    <Box
      ref={containerRef}
      onClick={handleClick}
      dangerouslySetInnerHTML={{ __html: svgHtml ?? '' }}
      sx={{
        display: 'flex',
        justifyContent: 'center',
        '& svg': {
          height: 'min(56vh, 420px)',
          width: 'auto',
          maxWidth: '100%',
          display: 'block',
        },
      }}
    />
  )
}

// ---- Bottom sheet severity panel ------------------------------------------

// Snap geometry (matches the 393×852 phone screen)
const SCREEN_H = 852
const SNAP_TY = { full: 0, half: Math.round(SCREEN_H * 0.45), min: SCREEN_H - 96 }

function SnapSheet({ draft, onToggleSymptom, onSeverityChange, onAdd, onCancel }) {
  const selectedSymptoms = SYMPTOM_TYPES.filter((t) => draft.symptoms[t] != null)
  const canAdd = selectedSymptoms.length > 0

  const redSlider = {
    color: 'var(--color-error)',
    '& .MuiSlider-thumb': { backgroundColor: 'var(--color-error)', width: 24, height: 24 },
    '& .MuiSlider-track': { backgroundColor: 'var(--color-error)', borderColor: 'var(--color-error)' },
    '& .MuiSlider-rail': { backgroundColor: 'var(--color-border-primary)' },
  }

  const [snap, setSnap] = useState('half')
  const [entered, setEntered] = useState(false)
  const [drag, setDrag] = useState(null) // { startY, startTY, ty } while dragging

  // Slide up into the half position on mount
  useEffect(() => {
    const raf = requestAnimationFrame(() => setEntered(true))
    return () => cancelAnimationFrame(raf)
  }, [])

  // Pop back to half whenever a different body part is opened
  useEffect(() => {
    setSnap('half')
    setDrag(null)
  }, [draft.partId])

  const baseTY = SNAP_TY[snap]
  const translateY = !entered ? SCREEN_H : drag ? drag.ty : baseTY
  const transition = drag ? 'none' : 'transform 0.34s cubic-bezier(0.22, 1, 0.36, 1)'

  const handleDragStart = (e) => {
    e.currentTarget.setPointerCapture?.(e.pointerId)
    setDrag({ startY: e.clientY, startTY: baseTY, ty: baseTY })
  }
  const handleDragMove = (e) => {
    setDrag((d) => {
      if (!d) return d
      let ty = d.startTY + (e.clientY - d.startY)
      ty = Math.max(SNAP_TY.full, Math.min(SNAP_TY.min, ty))
      return { ...d, ty }
    })
  }
  const handleDragEnd = () => {
    setDrag((d) => {
      if (!d) return null
      const ty = d.ty
      let nearest = 'min'
      if (ty < (SNAP_TY.full + SNAP_TY.half) / 2) nearest = 'full'
      else if (ty < (SNAP_TY.half + SNAP_TY.min) / 2) nearest = 'half'
      setSnap(nearest)
      return null
    })
  }

  return (
    <Box
      sx={{
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        height: SCREEN_H,
        transform: `translateY(${translateY}px)`,
        transition,
        backgroundColor: 'var(--color-background-primary)',
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
        boxShadow: '0 -8px 24px rgba(0,0,0,0.18)',
        display: 'flex',
        flexDirection: 'column',
        zIndex: 25,
      }}
    >
      {/* Drag zone — handle + header. Drag gestures only start here, not in the content. */}
      <Box
        onPointerDown={handleDragStart}
        onPointerMove={handleDragMove}
        onPointerUp={handleDragEnd}
        sx={{ flexShrink: 0, px: 2.5, pt: 1, pb: 1, cursor: 'grab', touchAction: 'none' }}
      >
        {/* Drag handle */}
        <Box
          sx={{
            width: 40,
            height: 4,
            borderRadius: 2,
            backgroundColor: 'var(--color-border-primary)',
            mx: 'auto',
            mt: '4px',
            mb: 1.5,
          }}
        />
        {/* Header row: body part name + close button */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="h6" sx={{ fontWeight: 600, color: 'var(--color-text-primary)' }}>
            {draft.name}
          </Typography>
          <IconButton
            onClick={() => setSnap('min')}
            aria-label="Close"
            sx={{ width: 44, height: 44, color: 'var(--color-text-secondary)' }}
          >
            <CloseOutlined />
          </IconButton>
        </Box>
      </Box>

      {/* Scrollable content */}
      <Box sx={{ flex: 1, minHeight: 0, overflowY: 'auto', px: 2.5, pb: 3 }}>
          {/* Symptom multi-select chips */}
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 1.5 }}>
            {SYMPTOM_TYPES.map((type) => {
              const selected = draft.symptoms[type] != null
              return (
                <Chip
                  key={type}
                  label={type}
                  onClick={() => onToggleSymptom(type)}
                  sx={{
                    height: 36,
                    cursor: 'pointer',
                    fontSize: '13px',
                    ...(selected
                      ? {
                          backgroundColor: 'var(--color-error-light)',
                          border: '1px solid var(--color-error)',
                          color: 'var(--color-error-dark)',
                        }
                      : {
                          backgroundColor: 'var(--color-background-secondary)',
                          border: '1px solid var(--color-border-primary)',
                          color: 'var(--color-text-secondary)',
                        }),
                  }}
                />
              )
            })}
          </Box>

          {/* Per-symptom sliders — each appears/disappears with a smooth transition */}
          {SYMPTOM_TYPES.map((type) => {
            const selected = draft.symptoms[type] != null
            const value = draft.symptoms[type] ?? 5
            return (
              <Collapse key={type} in={selected} unmountOnExit>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" sx={{ color: 'var(--color-text-secondary)', mb: 1 }}>
                    Set your {type.toLowerCase()} level
                  </Typography>
                  <Box sx={{ px: 1 }}>
                    <Slider
                      min={1}
                      max={10}
                      step={1}
                      value={value}
                      onChange={(_, v) => onSeverityChange(type, v)}
                      valueLabelDisplay="on"
                      marks
                      sx={redSlider}
                    />
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="caption" sx={{ color: 'var(--color-text-muted)' }}>1 — Mild</Typography>
                      <Typography variant="caption" sx={{ color: 'var(--color-text-muted)' }}>10 — Severe</Typography>
                    </Box>
                  </Box>
                </Box>
              </Collapse>
            )
          })}

          {/* Live chip preview — one chip per selected symptom, display only */}
          <Box sx={{ mb: 2 }}>
            <Typography variant="caption" sx={{ color: 'var(--color-text-muted)', fontSize: '11px', display: 'block', mb: 0.5 }}>
              Adding:
            </Typography>
            {selectedSymptoms.length === 0 ? (
              <Typography variant="body2" sx={{ color: 'var(--color-text-muted)' }}>
                Select a symptom above
              </Typography>
            ) : (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {selectedSymptoms.map((type) => (
                  <Chip
                    key={type}
                    avatar={
                      <Box
                        sx={{
                          width: 8,
                          height: 8,
                          borderRadius: '50%',
                          backgroundColor: 'var(--color-error)',
                          flexShrink: 0,
                          ml: '8px !important',
                        }}
                      />
                    }
                    label={`${type} · ${draft.symptoms[type]}`}
                    sx={{
                      height: 36,
                      backgroundColor: 'var(--color-error-light)',
                      border: '1px solid var(--color-error)',
                      color: 'var(--color-error-dark)',
                      fontSize: '13px',
                      '& .MuiChip-avatar': { width: 8, height: 8 },
                    }}
                  />
                ))}
              </Box>
            )}
          </Box>

          {/* Buttons */}
          <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
            <Button
              variant="text"
              onClick={onCancel}
              sx={{
                textTransform: 'none',
                color: 'var(--color-text-secondary)',
                fontWeight: 500,
                px: 2,
              }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              disableElevation
              onClick={onAdd}
              disabled={!canAdd}
              sx={{
                ml: 'auto',
                flex: 1,
                textTransform: 'none',
                fontWeight: 500,
                py: 1,
                backgroundColor: 'var(--color-primary)',
                color: '#fff',
                '&:hover': { backgroundColor: 'var(--color-primary-hover)' },
                '&.Mui-disabled': {
                  backgroundColor: 'var(--color-background-secondary)',
                  color: 'var(--color-text-muted)',
                },
              }}
            >
              Add
            </Button>
          </Box>
      </Box>
    </Box>
  )
}

// ---- Mobile response page --------------------------------------------------

export default function BodyMapMobileResponseV5() {
  const [currentView, setCurrentView] = useState('front')
  // committed: Map<`${partId}::${type}`, {partId, name, symptomType, severity}>
  const [committed, setCommitted] = useState(new Map())
  // draft being edited in the bottom sheet: { partId, name, symptoms: { [type]: severity } }
  const [draft, setDraft] = useState(null)
  // chip overflow expand/collapse toggle
  const [chipsExpanded, setChipsExpanded] = useState(false)
  // first-use hotspot — hidden permanently once any region is tapped (or if resumed with selections)
  const [hasInteracted, setHasInteracted] = useState(committed.size > 0)

  // Open the sheet for a body part, restoring any previously committed symptoms + severities
  const openSheetForPart = useCallback(
    (id, name) => {
      const symptoms = {}
      SYMPTOM_TYPES.forEach((type) => {
        const existing = committed.get(makeKey(id, type))
        if (existing) symptoms[type] = existing.severity
      })
      setDraft({ partId: id, name, symptoms })
    },
    [committed]
  )

  // ---- selection handlers ----
  const handlePartSelect = useCallback(
    (id, name) => {
      setHasInteracted(true)
      openSheetForPart(id, name)
    },
    [openSheetForPart]
  )

  const handleChipClick = useCallback(
    (entry) => {
      openSheetForPart(entry.partId, entry.name)
    },
    [openSheetForPart]
  )

  const handleToggleSymptom = useCallback(
    (type) => {
      setDraft((d) => {
        if (!d) return d
        const symptoms = { ...d.symptoms }
        if (symptoms[type] != null) {
          delete symptoms[type]
        } else {
          const existing = committed.get(makeKey(d.partId, type))
          symptoms[type] = existing?.severity ?? 5
        }
        return { ...d, symptoms }
      })
    },
    [committed]
  )

  const handleSeverityChange = useCallback((type, value) => {
    setDraft((d) => (d ? { ...d, symptoms: { ...d.symptoms, [type]: value } } : d))
  }, [])

  const handleAdd = useCallback(() => {
    if (!draft) return
    setCommitted((prev) => {
      const next = new Map(prev)
      // Reconcile each symptom: selected → set/update, deselected → remove
      SYMPTOM_TYPES.forEach((type) => {
        const key = makeKey(draft.partId, type)
        if (draft.symptoms[type] != null) {
          next.set(key, {
            partId: draft.partId,
            name: draft.name,
            symptomType: type,
            severity: draft.symptoms[type],
          })
        } else {
          next.delete(key)
        }
      })
      return next
    })
    setDraft(null)
  }, [draft])

  const handleCancel = useCallback(() => {
    setDraft(null)
  }, [])

  const handleRemoveChip = useCallback((key) => {
    setCommitted((prev) => {
      const next = new Map(prev)
      next.delete(key)
      return next
    })
  }, [])

  // ---- derived values for the model ----
  // Highlight every part with a committed entry, plus the part currently being edited.
  const selectedParts = new Set([...committed.values()].map((e) => e.partId))
  if (draft) selectedParts.add(draft.partId)

  // Fill intensity map, with live draft severities overlaid.
  const symptomValues = {}
  committed.forEach((entry) => {
    if (!symptomValues[entry.partId]) symptomValues[entry.partId] = {}
    symptomValues[entry.partId][entry.symptomType] = entry.severity
  })
  if (draft) {
    if (!symptomValues[draft.partId]) symptomValues[draft.partId] = {}
    Object.entries(draft.symptoms).forEach(([type, severity]) => {
      symptomValues[draft.partId][type] = severity
    })
  }

  const activePart = draft?.partId ?? null
  // Drive the active region's fill from its first selected draft symptom
  const activeTab = (draft && SYMPTOM_TYPES.find((t) => draft.symptoms[t] != null)) || SYMPTOM_TYPES[0]

  // Group chips by symptom type
  const chipsByType = SYMPTOM_TYPES.reduce((acc, type) => {
    acc[type] = [...committed.entries()].filter(([, e]) => e.symptomType === type)
    return acc
  }, {})

  // ---- chip overflow (Change 3) ----
  const orderedGroups = SYMPTOM_TYPES
    .map((type) => ({ type, entries: chipsByType[type] ?? [] }))
    .filter((g) => g.entries.length > 0)
  const flatChips = orderedGroups.flatMap((g) => g.entries.map(([key]) => ({ type: g.type, key })))
  const totalChips = flatChips.length
  const hasOverflow = totalChips > MAX_VISIBLE_CHIPS
  const visibleKeys = new Set(flatChips.slice(0, MAX_VISIBLE_CHIPS).map((f) => f.key))
  const overflowGroupType = hasOverflow ? flatChips[MAX_VISIBLE_CHIPS].type : null
  const overflowCount = totalChips - MAX_VISIBLE_CHIPS

  // Shared chip renderer so the model chips and overflow chips stay identical
  const renderChip = ([key, entry]) => (
    <Chip
      key={key}
      onClick={() => handleChipClick(entry)}
      onDelete={() => handleRemoveChip(key)}
      avatar={
        <Box
          sx={{
            width: 8,
            height: 8,
            borderRadius: '50%',
            backgroundColor: 'var(--color-error)',
            flexShrink: 0,
            ml: '8px !important',
          }}
        />
      }
      label={`${entry.name} · ${entry.severity}`}
      sx={{
        height: 36,
        cursor: 'pointer',
        backgroundColor: 'var(--color-error-light)',
        border: '1px solid var(--color-error)',
        color: 'var(--color-error-dark)',
        fontSize: '13px',
        // 44x44 touch target for the delete icon
        '& .MuiChip-deleteIcon': {
          color: 'var(--color-error)',
          fontSize: '20px',
          width: 44,
          height: 44,
          p: '12px',
          m: 0,
          borderRadius: '50%',
          '&:hover': { color: 'var(--color-error-dark)' },
        },
        '& .MuiChip-avatar': { width: 8, height: 8 },
      }}
    />
  )

  return (
    /* Review surround — centres the iPhone frame */
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start', py: 4, px: 2, width: '100%' }}>
      {/* iPhone 17 device frame (393×852 logical) — review only */}
      <Box
        sx={{
          flexShrink: 0,
          width: 393 + 24,
          height: 852 + 24,
          p: '12px',
          borderRadius: '62px',
          // eslint-disable-next-line design-system/no-hardcoded-colors
          backgroundColor: '#0a0a0a',
          boxShadow: '0 24px 60px rgba(0,0,0,0.35)',
        }}
      >
        {/* Screen area */}
        <Box
          sx={{
            position: 'relative',
            width: 393,
            height: 852,
            borderRadius: '50px',
            overflow: 'hidden',
            backgroundColor: 'var(--color-background-primary)',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {/* Dynamic island overlay */}
          <Box
            sx={{
              position: 'absolute',
              top: 10,
              left: '50%',
              transform: 'translateX(-50%)',
              width: 125,
              height: 35,
              borderRadius: '20px',
              // eslint-disable-next-line design-system/no-hardcoded-colors
              backgroundColor: '#000',
              zIndex: 30,
            }}
          />

          {/* Player-facing dark top navigation bar — static visual replica of MainNavigation's
              dark shell (same gradient background + logo asset). Visual only, no nav logic. */}
          <Box
            sx={{
              flexShrink: 0,
              height: 88,
              pt: '40px',
              px: 1.5,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              // eslint-disable-next-line design-system/no-hardcoded-colors
              background: 'linear-gradient(180deg, #000000 0%, #111111 40%, #000000 70%, #040037ff 90%, #040037ff 100%)',
              color: 'var(--color-white)',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', color: 'var(--color-white)' }}>
              <MenuOutlined />
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.25, color: 'var(--color-white)' }}>
              <PersonOutlineOutlined fontSize="small" />
              <ChevronRightOutlined fontSize="small" />
              <ChevronRightOutlined fontSize="small" />
            </Box>
            <Box
              sx={{
                width: 32,
                height: 32,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <img
                src={KITMAN_LOGO}
                alt="Kitman labs"
                style={{ height: '100%', width: 'auto', objectFit: 'contain' }}
              />
            </Box>
          </Box>

          {/* Scrollable form page */}
          <Box sx={{ flex: 1, minHeight: 0, overflowY: 'auto', p: 2, pb: '96px', display: 'flex', flexDirection: 'column', gap: 2 }}>
        {/* Body Map question block */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          {/* Question title */}
          <Typography variant="h6" sx={{ fontWeight: 600, color: 'var(--color-text-primary)' }}>
            {QUESTION_TITLE}
          </Typography>

          {/* Instruction text */}
          <Typography variant="body2" sx={{ color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
            {INSTRUCTION_TEXT}
          </Typography>

          {/* Body model */}
          <Box>
            <Box sx={{ position: 'relative' }}>
              <MobileBodyMapSvg
                selectedParts={selectedParts}
                activePart={activePart}
                currentView={currentView}
                onPartSelect={handlePartSelect}
                symptomValues={symptomValues}
                activeTab={activeTab}
              />

              {/* First-use tap hotspot — pointer events pass through to the SVG beneath */}
              {!hasInteracted && (
                <Box
                  sx={{
                    position: 'absolute',
                    top: '31%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 16,
                    height: 16,
                    pointerEvents: 'none',
                    zIndex: 5,
                  }}
                >
                  {/* solid core */}
                  <Box
                    sx={{
                      position: 'absolute',
                      inset: 0,
                      borderRadius: '50%',
                      // eslint-disable-next-line design-system/no-hardcoded-colors
                      backgroundColor: 'rgba(220, 53, 69, 0.85)',
                    }}
                  />
                  {/* pulsing ring */}
                  <Box
                    sx={{
                      position: 'absolute',
                      inset: 0,
                      borderRadius: '50%',
                      // eslint-disable-next-line design-system/no-hardcoded-colors
                      border: '2px solid rgba(220, 53, 69, 0.55)',
                      animation: `${hotspotPulse} 1.8s ease-out infinite`,
                    }}
                  />
                </Box>
              )}
            </Box>

            {/* Flip button — centred below model */}
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 1 }}>
              <IconButton
                onClick={() => setCurrentView((v) => (v === 'front' ? 'rear' : 'front'))}
                sx={{
                  border: '1px solid var(--color-border-primary)',
                  borderRadius: '20px',
                  px: 2,
                  py: 0.75,
                  gap: 0.75,
                  color: 'var(--color-text-secondary)',
                  '&:hover': { backgroundColor: 'var(--color-background-secondary)' },
                }}
              >
                <SyncOutlined sx={{ fontSize: 18 }} />
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  {currentView === 'front' ? 'Front' : 'Back'}
                </Typography>
              </IconButton>
            </Box>
          </Box>

          {/* Selected chips summary grouped by symptom type, with overflow cap (Change 3) */}
          {committed.size > 0 && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mt: 1 }}>
              {orderedGroups.map((g) => {
                const visibleEntries = g.entries.filter(([key]) => visibleKeys.has(key))
                const hiddenEntries = g.entries.filter(([key]) => !visibleKeys.has(key))
                const isOverflowGroup = g.type === overflowGroupType
                const headingVisibleCollapsed = visibleEntries.length > 0 || isOverflowGroup
                const showHeadingTop = chipsExpanded || headingVisibleCollapsed
                const showTopRow = visibleEntries.length > 0 || (isOverflowGroup && hasOverflow)
                return (
                  <Box key={g.type}>
                    {showHeadingTop && (
                      <Typography variant="caption" sx={{ color: 'var(--color-text-muted)', fontSize: '11px', display: 'block', mb: 0.5 }}>
                        {g.type}
                      </Typography>
                    )}
                    {showTopRow && (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        {visibleEntries.map(renderChip)}
                        {isOverflowGroup && hasOverflow && (
                          <Chip
                            label={chipsExpanded ? 'Show less' : `+${overflowCount} more`}
                            onClick={() => setChipsExpanded((v) => !v)}
                            sx={{
                              height: 36,
                              cursor: 'pointer',
                              backgroundColor: 'var(--color-background-secondary)',
                              border: '1px solid var(--color-border-primary)',
                              color: 'var(--color-text-secondary)',
                              fontSize: '13px',
                            }}
                          />
                        )}
                      </Box>
                    )}
                    {hiddenEntries.length > 0 && (
                      <Collapse in={chipsExpanded} unmountOnExit>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: showTopRow ? 1 : 0 }}>
                          {hiddenEntries.map(renderChip)}
                        </Box>
                      </Collapse>
                    )}
                  </Box>
                )
              })}
            </Box>
          )}
        </Box>
          </Box>

          {/* Done button — fixed footer bar at the bottom of the screen (Change 2) */}
          <Box
            sx={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              p: 2,
              backgroundColor: 'var(--color-background-primary)',
              borderTop: '1px solid var(--color-border-primary)',
              zIndex: 20,
            }}
          >
            <Button
              fullWidth
              variant="contained"
              disableElevation
              sx={{
                py: 1.25,
                textTransform: 'none',
                fontWeight: 500,
                backgroundColor: 'var(--color-primary)',
                color: '#fff',
                '&:hover': { backgroundColor: 'var(--color-primary-hover)' },
              }}
            >
              Done
            </Button>
          </Box>

          {/* Multi-snap bottom sheet — contained within the phone screen */}
          {draft && (
            <SnapSheet
              draft={draft}
              onToggleSymptom={handleToggleSymptom}
              onSeverityChange={handleSeverityChange}
              onAdd={handleAdd}
              onCancel={handleCancel}
            />
          )}
        </Box>
      </Box>
    </Box>
  )
}
