import React, { useState, useRef, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box,
  Typography,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  ToggleButtonGroup,
  ToggleButton,
  Switch,
  FormControlLabel,
  Tabs,
  Tab,
  Slider,
  Chip,
  Button,
  IconButton,
  Collapse,
  Divider,
  RadioGroup,
  Radio,
  FormHelperText,
} from '@mui/material'
import {
  SyncOutlined,
  ArrowBackOutlined,
  KeyboardArrowLeft,
  KeyboardArrowRight,
  StickyNote2Outlined,
  ChevronRightOutlined,
} from '@mui/icons-material'
import bodyMapSvgUrl from '../../assets/body-map.svg'
import FormBuilderHeader from '../../components/forms/builder/FormBuilderHeader'
import MenuTree from '../../components/forms/builder/MenuTree'
import '../../styles/design-tokens.css'

// Loaded once at runtime
let SVG_CACHE = null

function partIdToName(id) {
  return id.replace(/^(front|rear)-/, '').replace(/_/g, ' ')
}

// ---- SVG component --------------------------------------------------------

function BodyMapSvg({ selectedParts, activePart, currentView, onPartClick, symptomValues, activeTab }) {
  const containerRef = useRef(null)
  const [svgHtml, setSvgHtml] = useState(SVG_CACHE)

  // Load SVG once via fetch
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

  // Apply dynamic styles whenever relevant state changes
  useEffect(() => {
    const container = containerRef.current
    if (!container) return
    const svg = container.querySelector('svg')
    if (!svg) return

    // Adjust viewBox for front/rear cropping
    svg.setAttribute('viewBox', currentView === 'front' ? '0 0 225 540' : '225 0 225 540')

    // Hide/show view labels
    svg.querySelectorAll('text').forEach((t) => {
      if (t.textContent === 'FRONT') t.style.display = currentView === 'front' ? '' : 'none'
      if (t.textContent === 'REAR') t.style.display = currentView === 'rear' ? '' : 'none'
    })

    // Style each body-part group
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

  const handleClick = useCallback(
    (e) => {
      const group = e.target.closest('g[id]')
      if (!group) return
      const id = group.id
      const name = group.querySelector('title')?.textContent || partIdToName(id)
      onPartClick(id, name)
    },
    [onPartClick]
  )

  return (
    <Box
      ref={containerRef}
      onClick={handleClick}
      dangerouslySetInnerHTML={{ __html: svgHtml ?? '' }}
      sx={{ width: '100%' }}
    />
  )
}

// ---- Builder config panel -------------------------------------------------

const SYMPTOM_OPTIONS = ['Pain', 'Stiffness', 'Soreness', 'Custom']
const MAX_VISIBLE_CHIPS = 5

function BuilderConfig({ config, onChange }) {
  const { bodyDisplay, symptomTypes, allowComment, customQuestion } = config

  const toggleSymptomType = (type) => {
    const next = symptomTypes.includes(type)
      ? symptomTypes.filter((t) => t !== type)
      : [...symptomTypes, type]
    if (next.length > 0) onChange({ ...config, symptomTypes: next })
  }

  return (
    <Paper elevation={0} sx={{ border: '1px solid var(--color-border-primary)', borderRadius: 'var(--radius-md)', p: 3 }}>
      <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2.5, color: 'var(--color-text-primary)' }}>
        Question configuration
      </Typography>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
        {/* Question style — read-only, always Body Map */}
        <FormControl size="small" variant="filled" sx={{ maxWidth: 280 }}>
          <InputLabel>Question style</InputLabel>
          <Select value="body_map" onChange={() => {}}>
            <MenuItem value="body_map">Body map</MenuItem>
          </Select>
        </FormControl>

        {/* Default player-facing copy — display only (Change 1) */}
        <Box>
          <Typography variant="caption" sx={{ color: 'var(--color-text-secondary)', mb: 0.5, display: 'block' }}>
            Default player-facing text
          </Typography>
          <Typography variant="body2" sx={{ color: 'var(--color-text-secondary)' }}>
            Where are you experiencing discomfort?
          </Typography>
          <Typography variant="body2" sx={{ color: 'var(--color-text-secondary)' }}>
            Select any area on the body and indicate the severity.
          </Typography>
        </Box>

        {/* Optional custom question (Change 2) */}
        <TextField
          size="small"
          variant="filled"
          fullWidth
          label="Add your own question"
          placeholder="e.g. Following today's session, where are you experiencing discomfort?"
          value={customQuestion}
          onChange={(e) => onChange({ ...config, customQuestion: e.target.value })}
        />

        {/* Body display — RadioGroup, two options only (Change 3) */}
        <Box>
          <Typography variant="caption" sx={{ color: 'var(--color-text-secondary)', mb: 0.5, display: 'block' }}>
            Body display
          </Typography>
          <RadioGroup
            value={bodyDisplay}
            onChange={(e) => onChange({ ...config, bodyDisplay: e.target.value })}
          >
            <FormControlLabel value="male" control={<Radio size="small" />} label="Male only" />
            <FormControlLabel value="female" control={<Radio size="small" />} label="Female only" />
          </RadioGroup>
        </Box>

        {/* Symptom types — Chips (Change 5) */}
        <Box>
          <Typography variant="caption" sx={{ color: 'var(--color-text-secondary)', mb: 1, display: 'block' }}>
            Symptom types
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            {SYMPTOM_OPTIONS.map((type) => {
              const selected = symptomTypes.includes(type)
              const isLastSelected = selected && symptomTypes.length === 1
              return (
                <Chip
                  key={type}
                  label={type}
                  size="small"
                  onClick={() => toggleSymptomType(type)}
                  variant={selected ? 'filled' : 'outlined'}
                  onDelete={
                    selected
                      ? () => {
                          if (symptomTypes.length > 1) toggleSymptomType(type)
                        }
                      : undefined
                  }
                  sx={{
                    cursor: 'pointer',
                    ...(selected
                      ? {
                          backgroundColor: 'var(--color-primary)',
                          color: '#fff',
                          '&:hover': { backgroundColor: 'var(--color-primary-hover)' },
                          '& .MuiChip-deleteIcon': {
                            color: isLastSelected ? 'var(--color-text-disabled)' : '#fff',
                            cursor: isLastSelected ? 'default' : 'pointer',
                            '&:hover': { color: isLastSelected ? 'var(--color-text-disabled)' : '#fff' },
                          },
                        }
                      : {
                          borderColor: 'var(--color-border-primary)',
                          color: 'var(--color-text-secondary)',
                          '&:hover': { backgroundColor: 'var(--color-background-secondary)' },
                        }),
                  }}
                />
              )
            })}
          </Box>
          <FormHelperText sx={{ mt: 1, mx: 0, color: 'warning.main' }}>
            At least one symptom type must always be selected.
          </FormHelperText>
        </Box>

        {/* Allow comment toggle */}
        <FormControlLabel
          label={
            <Typography variant="body2" sx={{ color: 'var(--color-text-primary)' }}>
              Allow user to add a comment
            </Typography>
          }
          control={
            <Switch
              checked={allowComment}
              onChange={(e) => onChange({ ...config, allowComment: e.target.checked })}
              size="small"
            />
          }
          sx={{ m: 0 }}
        />
      </Box>
    </Paper>
  )
}

// ---- Response / preview view ----------------------------------------------

function BodyMapPreview({ config }) {
  const { symptomTypes, customQuestion } = config

  const questionHeading = customQuestion && customQuestion.trim()
    ? customQuestion.trim()
    : 'Where are you experiencing discomfort?'
  const instructionText = 'Select any area on the body and indicate the severity.'

  const makeKey = (partId, type) => `${partId}::${type}`

  const redSlider = {
    color: 'var(--color-error)',
    '& .MuiSlider-thumb': { backgroundColor: 'var(--color-error)', width: 20, height: 20 },
    '& .MuiSlider-track': { backgroundColor: 'var(--color-error)', borderColor: 'var(--color-error)' },
    '& .MuiSlider-rail': { backgroundColor: 'var(--color-border-primary)' },
  }

  // Preview state (mirrors mobile v10 interaction pattern)
  const [currentView, setCurrentView] = useState('front')
  // committed: Map<`${partId}::${type}`, {partId, name, symptomType, severity}>
  const [committed, setCommitted] = useState(new Map())
  // draft being edited inline: { partId, name, symptoms: { [type]: severity }, note, noteOpen, noteFocus }
  const [draft, setDraft] = useState(null)
  // one optional note per body area
  const [notes, setNotes] = useState(new Map())
  // body areas whose note is expanded in the chip group
  const [expandedNotes, setExpandedNotes] = useState(new Set())
  // chip overflow expand/collapse
  const [chipsExpanded, setChipsExpanded] = useState(false)

  const openPanelForPart = useCallback(
    (id, name, opts = {}) => {
      const symptoms = {}
      symptomTypes.forEach((type) => {
        const existing = committed.get(makeKey(id, type))
        if (existing) symptoms[type] = existing.severity
      })
      const note = notes.get(id) ?? ''
      setDraft({
        partId: id,
        name,
        symptoms,
        note,
        noteOpen: opts.noteOpen ?? note !== '',
        noteFocus: opts.noteFocus ?? false,
      })
    },
    [committed, notes, symptomTypes]
  )

  const handlePartClick = useCallback((id, name) => openPanelForPart(id, name), [openPanelForPart])
  const handleChipClick = useCallback((entry) => openPanelForPart(entry.partId, entry.name), [openPanelForPart])

  const handleToggleSymptom = useCallback(
    (type) => {
      setDraft((d) => {
        if (!d) return d
        const symptoms = { ...d.symptoms }
        if (symptoms[type] != null) delete symptoms[type]
        else {
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

  const handleNoteChange = useCallback((value) => {
    setDraft((d) => (d ? { ...d, note: value.slice(0, 280) } : d))
  }, [])

  const handleOpenNoteField = useCallback(() => {
    setDraft((d) => (d ? { ...d, noteOpen: true, noteFocus: true } : d))
  }, [])

  const handleEditNote = useCallback(
    (partId, name) => openPanelForPart(partId, name, { noteOpen: true, noteFocus: true }),
    [openPanelForPart]
  )

  const toggleNoteExpanded = useCallback((partId) => {
    setExpandedNotes((prev) => {
      const next = new Set(prev)
      if (next.has(partId)) next.delete(partId)
      else next.add(partId)
      return next
    })
  }, [])

  const handleAdd = useCallback(() => {
    if (!draft) return
    setCommitted((prev) => {
      const next = new Map(prev)
      symptomTypes.forEach((type) => {
        const key = makeKey(draft.partId, type)
        if (draft.symptoms[type] != null) {
          next.set(key, { partId: draft.partId, name: draft.name, symptomType: type, severity: draft.symptoms[type] })
        } else {
          next.delete(key)
        }
      })
      return next
    })
    setNotes((prev) => {
      const next = new Map(prev)
      const trimmed = draft.note.trim()
      if (trimmed) next.set(draft.partId, trimmed)
      else next.delete(draft.partId)
      return next
    })
    setDraft(null)
  }, [draft, symptomTypes])

  const handleCancel = useCallback(() => setDraft(null), [])

  const handleRemoveChip = useCallback((key) => {
    setCommitted((prev) => {
      const next = new Map(prev)
      next.delete(key)
      return next
    })
  }, [])

  // ---- derived values ----
  const selectedParts = new Set([...committed.values()].map((e) => e.partId))
  if (draft) selectedParts.add(draft.partId)

  const symptomValues = {}
  committed.forEach((entry) => {
    if (!symptomValues[entry.partId]) symptomValues[entry.partId] = {}
    symptomValues[entry.partId][entry.symptomType] = entry.severity
  })
  if (draft) {
    if (!symptomValues[draft.partId]) symptomValues[draft.partId] = {}
    Object.entries(draft.symptoms).forEach(([type, sev]) => {
      symptomValues[draft.partId][type] = sev
    })
  }

  const activePart = draft?.partId ?? null
  const activeTab = (draft && symptomTypes.find((t) => draft.symptoms[t] != null)) || symptomTypes[0]

  // Group chips by body area, ordered by first selection
  const areaMap = new Map()
  committed.forEach((entry, key) => {
    if (!areaMap.has(entry.partId)) areaMap.set(entry.partId, { partId: entry.partId, name: entry.name, entries: [] })
    areaMap.get(entry.partId).entries.push([key, entry])
  })
  const orderedAreaGroups = [...areaMap.values()].map((g) => ({
    ...g,
    entries: [...g.entries].sort(
      (a, b) => symptomTypes.indexOf(a[1].symptomType) - symptomTypes.indexOf(b[1].symptomType)
    ),
  }))

  // Overflow cap
  const flatChips = orderedAreaGroups.flatMap((g) => g.entries.map(([key]) => ({ partId: g.partId, key })))
  const totalChips = flatChips.length
  const hasOverflow = totalChips > MAX_VISIBLE_CHIPS
  const visibleKeys = new Set(flatChips.slice(0, MAX_VISIBLE_CHIPS).map((f) => f.key))
  const overflowGroupPartId = hasOverflow ? flatChips[MAX_VISIBLE_CHIPS].partId : null
  const overflowCount = totalChips - MAX_VISIBLE_CHIPS

  const renderChip = ([key, entry]) => (
    <Chip
      key={key}
      size="small"
      onClick={() => handleChipClick(entry)}
      onDelete={() => handleRemoveChip(key)}
      label={`${entry.symptomType} · ${entry.severity}`}
      sx={{
        height: 28,
        cursor: 'pointer',
        backgroundColor: 'var(--color-error-light)',
        border: '1px solid var(--color-error)',
        color: 'var(--color-error-dark)',
        fontSize: '12px',
        '& .MuiChip-deleteIcon': {
          color: 'var(--color-error)',
          fontSize: '18px',
          '&:hover': { color: 'var(--color-error-dark)' },
        },
      }}
    />
  )

  const selectedSymptoms = draft ? symptomTypes.filter((t) => draft.symptoms[t] != null) : []
  const canAdd = selectedSymptoms.length > 0

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, px: 1 }}>
      {/* Section / subsection / question / instruction — left-aligned at the top */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.75 }}>
          <Typography
            variant="caption"
            sx={{
              color: 'var(--color-text-muted)',
              fontSize: '11px',
              fontWeight: 500,
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
            }}
          >
            Sub-section 1.1
          </Typography>
          <Typography variant="h6" sx={{ fontWeight: 500, color: 'var(--color-text-primary)', lineHeight: 1.4 }}>
            {questionHeading}
          </Typography>
          <Typography variant="body2" sx={{ color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
            {instructionText}
          </Typography>
        </Box>

        {/* Body model (left) + selection content (immediately to its right) */}
        <Box sx={{ display: 'flex', gap: 6, alignItems: 'flex-start', flexWrap: 'wrap', mt: 3 }}>
          {/* Body model — left-aligned */}
          <Box sx={{ display: 'inline-block', flexShrink: 0 }}>
            {/* Single flip pill button — centred directly above the model */}
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
              <BodyMapSvg
                selectedParts={selectedParts}
                activePart={activePart}
                currentView={currentView}
                onPartClick={handlePartClick}
                symptomValues={symptomValues}
                activeTab={activeTab}
              />
            </Box>
          </Box>

          {/* Selection content — sits directly to the right of the model */}
          <Box sx={{ flex: '0 1 440px', minWidth: 280, display: 'flex', flexDirection: 'column', gap: 2 }}>

        {/* Empty state — default before any body part is selected */}
        {draft === null && committed.size === 0 && (
          <Typography variant="body2" sx={{ color: 'var(--color-text-muted)', fontStyle: 'italic' }}>
            Select an area on the body to begin
          </Typography>
        )}

        {/* Inline selection panel (mirrors mobile bottom sheet, no sheet on desktop) */}
        <Collapse in={draft !== null} unmountOnExit sx={{ width: '100%' }}>
          {draft && (
            <Box sx={{ border: '1px solid var(--color-border-primary)', borderRadius: 'var(--radius-md)', p: 2 }}>
              {/* Body part name */}
              <Typography variant="h6" sx={{ fontWeight: 600, color: 'var(--color-text-primary)', mb: 0.25 }}>
                {draft.name}
              </Typography>
              {/* Subtitle */}
              <Typography variant="body2" sx={{ color: 'var(--color-text-secondary)', mb: 1.5 }}>
                Select a symptom
              </Typography>

              {/* Symptom multi-select chips */}
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 1.5 }}>
                {symptomTypes.map((type) => {
                  const selected = draft.symptoms[type] != null
                  return (
                    <Chip
                      key={type}
                      label={type}
                      onClick={() => handleToggleSymptom(type)}
                      sx={{
                        height: 36,
                        cursor: 'pointer',
                        fontSize: '13px',
                        ...(selected
                          ? {
                              backgroundColor: 'var(--color-error-light)',
                              border: '2px solid var(--color-error)',
                              color: 'var(--color-error-dark)',
                              fontWeight: 600,
                            }
                          : {
                              backgroundColor: 'var(--color-background-secondary)',
                              border: '1px solid var(--color-border-primary)',
                              color: 'var(--color-text-secondary)',
                              fontWeight: 400,
                            }),
                      }}
                    />
                  )
                })}
              </Box>

              {/* Per-symptom sliders */}
              {symptomTypes.map((type) => {
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
                          onChange={(_, v) => handleSeverityChange(type, v)}
                          valueLabelDisplay="auto"
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

              {/* Add note — one optional note per body area */}
              <Box sx={{ mb: 2 }}>
                {draft.noteOpen ? (
                  <TextField
                    multiline
                    minRows={2}
                    fullWidth
                    variant="filled"
                    size="small"
                    autoFocus={Boolean(draft.noteFocus)}
                    value={draft.note}
                    onChange={(e) => handleNoteChange(e.target.value)}
                    inputProps={{ maxLength: 280 }}
                    helperText={`${draft.note.length}/280`}
                    FormHelperTextProps={{ sx: { textAlign: 'right', m: 0, mt: 0.5 } }}
                  />
                ) : (
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<StickyNote2Outlined sx={{ fontSize: 18 }} />}
                    onClick={handleOpenNoteField}
                    sx={{
                      textTransform: 'none',
                      fontWeight: 500,
                      borderRadius: '20px',
                      color: 'var(--color-text-secondary)',
                      borderColor: 'var(--color-border-primary)',
                      '&:hover': {
                        borderColor: 'var(--color-border-primary)',
                        backgroundColor: 'var(--color-background-secondary)',
                      },
                    }}
                  >
                    Add note
                  </Button>
                )}
              </Box>

              {/* Buttons */}
              <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
                <Button
                  variant="text"
                  onClick={handleCancel}
                  sx={{ textTransform: 'none', color: 'var(--color-text-secondary)', fontWeight: 500, px: 2 }}
                >
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  disableElevation
                  onClick={handleAdd}
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
          )}
        </Collapse>

        {/* Selected chips grouped by body area, with note indicators + overflow cap */}
        {committed.size > 0 && (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            {orderedAreaGroups.map((g) => {
              const visibleEntries = g.entries.filter(([key]) => visibleKeys.has(key))
              const hiddenEntries = g.entries.filter(([key]) => !visibleKeys.has(key))
              const isOverflowGroup = g.partId === overflowGroupPartId
              const headingVisibleCollapsed = visibleEntries.length > 0 || isOverflowGroup
              const showHeadingTop = chipsExpanded || headingVisibleCollapsed
              const showTopRow = visibleEntries.length > 0 || (isOverflowGroup && hasOverflow)
              return (
                <Box key={g.partId}>
                  {showHeadingTop && (
                    <Typography variant="caption" sx={{ color: 'var(--color-text-muted)', fontSize: '11px', display: 'block', mb: 0.5 }}>
                      {g.name}
                    </Typography>
                  )}
                  {/* Compact note indicator */}
                  {showHeadingTop && notes.get(g.partId) && (
                    <Box sx={{ mb: 1 }}>
                      <Box
                        onClick={() => toggleNoteExpanded(g.partId)}
                        sx={{ display: 'flex', alignItems: 'center', gap: 0.5, cursor: 'pointer' }}
                      >
                        <StickyNote2Outlined sx={{ fontSize: 14, color: 'var(--color-text-muted)' }} />
                        <Typography variant="caption" sx={{ color: 'var(--color-text-muted)', fontSize: '11px' }}>
                          Note added
                        </Typography>
                        <Box sx={{ ml: 'auto', display: 'flex', alignItems: 'center', gap: 0.25 }}>
                          <Typography variant="caption" sx={{ color: 'var(--color-text-secondary)', fontSize: '11px' }}>
                            View
                          </Typography>
                          <ChevronRightOutlined
                            sx={{
                              fontSize: 14,
                              color: 'var(--color-text-secondary)',
                              transform: expandedNotes.has(g.partId) ? 'rotate(90deg)' : 'none',
                              transition: 'transform 0.2s',
                            }}
                          />
                        </Box>
                      </Box>
                      <Collapse in={expandedNotes.has(g.partId)} unmountOnExit>
                        <Box sx={{ mt: 0.5, p: 1.25, backgroundColor: 'var(--color-background-secondary)', borderRadius: 'var(--radius-md)' }}>
                          <Typography variant="body2" sx={{ color: 'var(--color-text-secondary)', fontSize: '12px', lineHeight: 1.5 }}>
                            {notes.get(g.partId)}
                          </Typography>
                          <Box
                            component="button"
                            type="button"
                            onClick={() => handleEditNote(g.partId, g.name)}
                            sx={{
                              mt: 0.75,
                              p: 0,
                              border: 'none',
                              background: 'transparent',
                              color: 'var(--color-primary)',
                              cursor: 'pointer',
                              fontSize: '12px',
                              fontWeight: 500,
                            }}
                          >
                            Edit
                          </Box>
                        </Box>
                      </Collapse>
                    </Box>
                  )}
                  {showTopRow && (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {visibleEntries.map(renderChip)}
                      {isOverflowGroup && hasOverflow && (
                        <Chip
                          size="small"
                          label={chipsExpanded ? 'Show less' : `+${overflowCount} more`}
                          onClick={() => setChipsExpanded((v) => !v)}
                          sx={{
                            height: 28,
                            cursor: 'pointer',
                            backgroundColor: 'var(--color-background-secondary)',
                            border: '1px solid var(--color-border-primary)',
                            color: 'var(--color-text-secondary)',
                            fontSize: '12px',
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
      </Box>
  )
}

// ---- Form mock for MenuTree -----------------------------------------------

const BODY_MAP_FORM = {
  id: 'body-map-form',
  title: 'Form name',
  productArea: 'General',
  category: 'Other',
  createdAt: '2026-01-01T00:00:00Z',
  creator: 'Medical team',
  description: '',
  sections: [
    {
      id: 'section-1',
      title: 'Player Information',
      items: [
        {
          id: 'subsection-1-1',
          type: 'subsection',
          title: 'Body Assessment',
          items: [
            { id: 'q-body-map', label: 'Select body areas to indicate soreness', type: 'body_map', mandatory: false }
          ]
        }
      ]
    }
  ]
}

function a11yProps(index) {
  return { id: `bm-tab-${index}`, 'aria-controls': `bm-tabpanel-${index}` }
}

function TabPanel({ children, value, index }) {
  return (
    <div role="tabpanel" hidden={value !== index} id={`bm-tabpanel-${index}`} aria-labelledby={`bm-tab-${index}`}>
      {value === index && children}
    </div>
  )
}

const NAV_BTN_SX = {
  borderColor: 'var(--color-border-primary)',
  color: 'var(--color-primary)',
  textTransform: 'none',
  fontWeight: 500,
  '&:hover': { borderColor: 'var(--color-border-focus)', backgroundColor: 'var(--color-primary-light)' },
}

// Secondary style at all times — no change on hover (Change 3)
const SECONDARY_BTN_SX = {
  backgroundColor: 'var(--button-secondary-bg)',
  color: 'var(--button-secondary-color)',
  textTransform: 'none',
  fontWeight: 500,
  '&:hover': { backgroundColor: 'var(--button-secondary-bg)' },
}

// ---- Page -----------------------------------------------------------------

export default function BodyMapPageV4() {
  const navigate = useNavigate()

  const [config, setConfig] = useState({
    instructions: 'Select any area on the body and set the severity.',
    customQuestion: '',
    bodyDisplay: 'male',
    symptomTypes: ['Pain', 'Stiffness', 'Soreness'],
    minAreas: null,
    maxAreas: null,
    allowComment: false,
  })

  const [tabValue, setTabValue] = useState(0)
  const [selectedSectionId, setSelectedSectionId] = useState('section-1')
  const [selectedQuestionId, setSelectedQuestionId] = useState('q-body-map')

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {/* Back link */}
      <Box sx={{ display: 'flex', alignItems: 'center', mt: 2, px: 3 }}>
        <Box
          component="button"
          type="button"
          onClick={() => navigate('/forms')}
          sx={{
            background: 'transparent',
            border: 'none',
            color: 'var(--color-text-secondary)',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 1,
            cursor: 'pointer',
            px: 0,
            fontSize: '14px',
            '&:hover': { color: 'var(--color-text-primary)', textDecoration: 'underline' },
          }}
        >
          <ArrowBackOutlined fontSize="small" />
          <span>Forms overview</span>
        </Box>
      </Box>

      {/* Title row */}
      <Box sx={{ display: 'flex', alignItems: 'center', px: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 600, color: 'var(--color-text-primary)' }}>
          {BODY_MAP_FORM.title}
        </Typography>
        <Box sx={{ ml: 'auto' }}>
          <Button
            variant="contained"
            size="medium"
            disableElevation
            sx={{
              backgroundColor: 'var(--button-primary-bg)',
              color: 'var(--button-primary-color)',
              textTransform: 'none',
              '&:hover': { backgroundColor: 'var(--button-primary-hover-bg)' },
            }}
          >
            Create
          </Button>
        </Box>
      </Box>

      {/* Metadata */}
      <Box sx={{ px: 3 }}>
        <FormBuilderHeader
          productArea={BODY_MAP_FORM.productArea}
          category={BODY_MAP_FORM.category}
          createdAt={BODY_MAP_FORM.createdAt}
          creator={BODY_MAP_FORM.creator}
          description={BODY_MAP_FORM.description}
        />
      </Box>

      {/* Tabs + content */}
      <Paper elevation={0} sx={{ borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
        <Tabs
          value={tabValue}
          onChange={(_, v) => setTabValue(v)}
          aria-label="Body map builder tabs"
          textColor="inherit"
          sx={{
            px: 3,
            pt: 1,
            '& .MuiTab-root': { color: 'var(--color-text-secondary)', textTransform: 'none', fontWeight: 600 },
            '& .MuiTab-root.Mui-selected': { color: 'var(--color-black)' },
            '& .MuiTabs-indicator': { backgroundColor: 'var(--color-black)' },
          }}
        >
          <Tab label="Build" {...a11yProps(0)} />
          <Tab label="Preview" {...a11yProps(1)} />
          <Tab label="Settings" {...a11yProps(2)} />
          <Tab label="Summary view" {...a11yProps(3)} />
        </Tabs>
        <Divider />

        {/* Build tab */}
        <TabPanel value={tabValue} index={0}>
          <Box sx={{ display: 'grid', gridTemplateColumns: '340px 1fr', gap: 0, minHeight: 'calc(100vh - var(--layout-header-height) - 200px)' }}>
            <MenuTree
              form={BODY_MAP_FORM}
              selectedQuestionId={selectedQuestionId}
              onSelectQuestion={setSelectedQuestionId}
              selectedSectionId={selectedSectionId}
              onSelectSection={setSelectedSectionId}
            />
            <Box sx={{ p: 3, borderLeft: '1px solid var(--color-border-primary)' }}>
              <BuilderConfig config={config} onChange={setConfig} />
            </Box>
          </Box>
          <Box sx={{ display: 'flex', gap: 1, px: 3, py: 2, borderTop: '1px solid var(--color-border-primary)' }}>
            <Button variant="contained" size="medium" disableElevation startIcon={<KeyboardArrowLeft />} sx={NAV_BTN_SX}>
              Back
            </Button>
            <Button variant="contained" size="medium" disableElevation endIcon={<KeyboardArrowRight />} sx={NAV_BTN_SX}>
              Next
            </Button>
          </Box>
        </TabPanel>

        {/* Preview tab */}
        <TabPanel value={tabValue} index={1}>
          <Box sx={{ p: 3 }}>
            <BodyMapPreview config={config} />
          </Box>
          <Box sx={{ display: 'flex', gap: 1, px: 3, py: 2, borderTop: '1px solid var(--color-border-primary)' }}>
            <Button variant="contained" size="medium" disableElevation startIcon={<KeyboardArrowLeft />} sx={SECONDARY_BTN_SX}>
              Back
            </Button>
            <Button variant="contained" size="medium" disableElevation endIcon={<KeyboardArrowRight />} sx={SECONDARY_BTN_SX}>
              Next
            </Button>
          </Box>
        </TabPanel>

        {/* Settings tab */}
        <TabPanel value={tabValue} index={2}>
          <Box sx={{ p: 3 }}>
            <Typography variant="body2" sx={{ color: 'var(--color-text-secondary)' }}>
              Settings
            </Typography>
          </Box>
        </TabPanel>

        {/* Summary view tab */}
        <TabPanel value={tabValue} index={3}>
          <Box sx={{ p: 3 }}>
            <Typography variant="body2" sx={{ color: 'var(--color-text-secondary)' }}>
              Summary view
            </Typography>
          </Box>
        </TabPanel>
      </Paper>
    </Box>
  )
}
