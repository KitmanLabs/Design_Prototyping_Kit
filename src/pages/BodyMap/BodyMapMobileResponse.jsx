import React, { useState, useRef, useEffect, useCallback } from 'react'
import {
  Box,
  Typography,
  Drawer,
  Tabs,
  Tab,
  Slider,
  Chip,
  Button,
  IconButton,
  Divider,
} from '@mui/material'
import { SyncOutlined, MenuOutlined, PersonOutlineOutlined, ChevronRightOutlined } from '@mui/icons-material'
import bodyMapSvgUrl from '../../assets/body-map.svg'
import '../../styles/design-tokens.css'

// Same branded logo asset used by the existing player-facing shell (MainNavigation)
const KITMAN_LOGO = '/assets/logos/Kitman Labs base.png'

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

function SeveritySheet({ open, draft, onTabChange, onSeverityChange, onAdd, onCancel, container }) {
  return (
    <Drawer
      anchor="bottom"
      open={open}
      onClose={onCancel}
      container={container}
      ModalProps={{ container, keepMounted: true }}
      sx={{ position: 'absolute', '& .MuiBackdrop-root': { position: 'absolute' } }}
      PaperProps={{
        sx: {
          position: 'absolute',
          borderTopLeftRadius: 16,
          borderTopRightRadius: 16,
          px: 2.5,
          pt: 1,
          pb: 3,
        },
      }}
    >
      {draft && (
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          {/* Drag handle */}
          <Box
            sx={{
              width: 40,
              height: 4,
              borderRadius: 2,
              backgroundColor: 'var(--color-border-primary)',
              alignSelf: 'center',
              mb: 2,
            }}
          />

          {/* Body part name */}
          <Typography variant="h6" sx={{ fontWeight: 600, color: 'var(--color-text-primary)', mb: 1.5 }}>
            {draft.name}
          </Typography>

          {/* Symptom type tabs */}
          <Tabs
            value={draft.tab}
            onChange={(_, val) => onTabChange(val)}
            variant="fullWidth"
            sx={{
              minHeight: 44,
              borderBottom: '1px solid var(--color-border-primary)',
              mb: 2,
              '& .MuiTab-root': {
                minHeight: 44,
                fontSize: '13px',
                textTransform: 'none',
                color: 'var(--color-text-secondary)',
                '&.Mui-selected': { color: 'var(--color-primary)', fontWeight: 600 },
              },
              '& .MuiTabs-indicator': { backgroundColor: 'var(--color-primary)' },
            }}
          >
            {SYMPTOM_TYPES.map((st) => (
              <Tab key={st} label={st} value={st} />
            ))}
          </Tabs>

          {/* Instruction line */}
          <Typography variant="body2" sx={{ color: 'var(--color-text-secondary)', mb: 2 }}>
            Set your {draft.tab.toLowerCase()} level
          </Typography>

          {/* Slider */}
          <Box sx={{ px: 1, mb: 3 }}>
            <Slider
              min={1}
              max={10}
              step={1}
              value={draft.severity}
              onChange={(_, value) => onSeverityChange(value)}
              valueLabelDisplay="on"
              marks
              sx={{
                color: 'var(--color-error)',
                '& .MuiSlider-thumb': { backgroundColor: 'var(--color-error)', width: 24, height: 24 },
                '& .MuiSlider-track': { backgroundColor: 'var(--color-error)', borderColor: 'var(--color-error)' },
                '& .MuiSlider-rail': { backgroundColor: 'var(--color-border-primary)' },
              }}
            />
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="caption" sx={{ color: 'var(--color-text-muted)' }}>1 — Mild</Typography>
              <Typography variant="caption" sx={{ color: 'var(--color-text-muted)' }}>10 — Severe</Typography>
            </Box>
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
              sx={{
                ml: 'auto',
                flex: 1,
                textTransform: 'none',
                fontWeight: 500,
                py: 1,
                backgroundColor: 'var(--color-primary)',
                color: '#fff',
                '&:hover': { backgroundColor: 'var(--color-primary-hover)' },
              }}
            >
              Add
            </Button>
          </Box>
        </Box>
      )}
    </Drawer>
  )
}

// ---- Mobile response page --------------------------------------------------

export default function BodyMapMobileResponse() {
  const [currentView, setCurrentView] = useState('front')
  // committed: Map<`${partId}::${type}`, {partId, name, symptomType, severity}>
  const [committed, setCommitted] = useState(new Map())
  // draft selection currently being edited in the bottom sheet
  const [draft, setDraft] = useState(null)
  const sheetOpen = draft !== null
  // phone-screen element — the bottom sheet renders within it (not the document body)
  const [screenEl, setScreenEl] = useState(null)

  // ---- selection handlers ----
  const handlePartSelect = useCallback(
    (id, name) => {
      const tab = SYMPTOM_TYPES[0]
      const existing = committed.get(makeKey(id, tab))
      setDraft({ partId: id, name, tab, severity: existing?.severity ?? 5 })
    },
    [committed]
  )

  const handleChipClick = useCallback((entry) => {
    setDraft({ partId: entry.partId, name: entry.name, tab: entry.symptomType, severity: entry.severity })
  }, [])

  const handleTabChange = useCallback(
    (newTab) => {
      setDraft((d) => {
        if (!d) return d
        const existing = committed.get(makeKey(d.partId, newTab))
        return { ...d, tab: newTab, severity: existing?.severity ?? 5 }
      })
    },
    [committed]
  )

  const handleSeverityChange = useCallback((value) => {
    setDraft((d) => (d ? { ...d, severity: value } : d))
  }, [])

  const handleAdd = useCallback(() => {
    if (!draft) return
    setCommitted((prev) => {
      const next = new Map(prev)
      next.set(makeKey(draft.partId, draft.tab), {
        partId: draft.partId,
        name: draft.name,
        symptomType: draft.tab,
        severity: draft.severity,
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

  // Fill intensity map, with live draft severity overlaid.
  const symptomValues = {}
  committed.forEach((entry) => {
    if (!symptomValues[entry.partId]) symptomValues[entry.partId] = {}
    symptomValues[entry.partId][entry.symptomType] = entry.severity
  })
  if (draft) {
    if (!symptomValues[draft.partId]) symptomValues[draft.partId] = {}
    symptomValues[draft.partId][draft.tab] = draft.severity
  }

  const activePart = draft?.partId ?? null
  const activeTab = draft?.tab ?? SYMPTOM_TYPES[0]

  // Group chips by symptom type
  const chipsByType = SYMPTOM_TYPES.reduce((acc, type) => {
    acc[type] = [...committed.entries()].filter(([, e]) => e.symptomType === type)
    return acc
  }, {})

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
          ref={setScreenEl}
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
          <Box sx={{ flex: 1, minHeight: 0, overflowY: 'auto', p: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
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
            <MobileBodyMapSvg
              selectedParts={selectedParts}
              activePart={activePart}
              currentView={currentView}
              onPartSelect={handlePartSelect}
              symptomValues={symptomValues}
              activeTab={activeTab}
            />

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

          {/* Selected chips summary grouped by symptom type */}
          {committed.size > 0 && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mt: 1 }}>
              {SYMPTOM_TYPES.map((type) => {
                const entries = chipsByType[type] ?? []
                if (entries.length === 0) return null
                return (
                  <Box key={type}>
                    <Typography variant="caption" sx={{ color: 'var(--color-text-muted)', fontSize: '11px', display: 'block', mb: 0.5 }}>
                      {type}
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {entries.map(([key, entry]) => (
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
                      ))}
                    </Box>
                  </Box>
                )
              })}
            </Box>
          )}

          {/* Done button — full width */}
          <Button
            fullWidth
            variant="contained"
            disableElevation
            sx={{
              mt: 1,
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
          </Box>

          {/* Bottom sheet severity panel — contained within the phone screen */}
          <SeveritySheet
            open={sheetOpen}
            draft={draft}
            onTabChange={handleTabChange}
            onSeverityChange={handleSeverityChange}
            onAdd={handleAdd}
            onCancel={handleCancel}
            container={screenEl}
          />
        </Box>
      </Box>
    </Box>
  )
}
