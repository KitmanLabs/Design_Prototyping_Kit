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
} from '@mui/material'
import { SyncOutlined, ArrowBackOutlined, KeyboardArrowLeft, KeyboardArrowRight } from '@mui/icons-material'
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

function BuilderConfig({ config, onChange }) {
  const { instructions, bodyDisplay, symptomTypes, allowComment } = config

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

        {/* Instructions */}
        <TextField
          size="small"
          variant="filled"
          multiline
          rows={2}
          label="Instructions"
          fullWidth
          value={instructions}
          onChange={(e) => onChange({ ...config, instructions: e.target.value })}
        />

        {/* Body display — RadioGroup (Change 4) */}
        <Box>
          <Typography variant="caption" sx={{ color: 'var(--color-text-secondary)', mb: 0.5, display: 'block' }}>
            Body display
          </Typography>
          <RadioGroup
            value={bodyDisplay}
            onChange={(e) => onChange({ ...config, bodyDisplay: e.target.value })}
          >
            <FormControlLabel value="male_female" control={<Radio size="small" />} label="Male and female" />
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
              return (
                <Chip
                  key={type}
                  label={type}
                  size="small"
                  onClick={() => toggleSymptomType(type)}
                  variant={selected ? 'filled' : 'outlined'}
                  sx={{
                    cursor: 'pointer',
                    ...(selected
                      ? {
                          backgroundColor: 'var(--color-primary)',
                          color: '#fff',
                          '&:hover': { backgroundColor: 'var(--color-primary-hover)' },
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
  const { instructions, symptomTypes } = config

  const questionTitle = 'Body Map'

  // Preview state
  const [currentView, setCurrentView] = useState('front')
  // partEntries: Map<`${partId}::${symptomType}`, {partId, name, symptomType, severity}>
  // Each entry is an independent (body part, symptom type) selection with its own severity.
  const [partEntries, setPartEntries] = useState(new Map())
  const [activePart, setActivePart] = useState(null)
  const [activeTab, setActiveTab] = useState(symptomTypes[0] ?? 'Pain')

  // Keep activeTab valid when symptomTypes change
  React.useEffect(() => {
    if (!symptomTypes.includes(activeTab)) {
      setActiveTab(symptomTypes[0] ?? 'Pain')
    }
  }, [symptomTypes, activeTab])

  const makeKey = (partId, type) => `${partId}::${type}`
  const activeKey = activePart ? makeKey(activePart, activeTab) : null

  // All unique partIds that have any entry (for SVG highlight)
  const selectedParts = new Set([...partEntries.values()].map((e) => e.partId))

  // symptomValues for SVG fill intensity: { [partId]: { [symptomType]: severity } }
  const symptomValues = {}
  partEntries.forEach((entry) => {
    if (!symptomValues[entry.partId]) symptomValues[entry.partId] = {}
    symptomValues[entry.partId][entry.symptomType] = entry.severity
  })

  const handlePartClick = useCallback(
    (id, name) => {
      const key = makeKey(id, activeTab)
      setPartEntries((prev) => {
        if (prev.has(key)) return prev // already exists under this tab — just reactivate
        const next = new Map(prev)
        next.set(key, { partId: id, name, symptomType: activeTab, severity: 5 })
        return next
      })
      setActivePart(id)
    },
    [activeTab]
  )

  const handleSliderChange = useCallback(
    (_, value) => {
      if (!activeKey || !activePart) return
      setPartEntries((prev) => {
        const existing = prev.get(activeKey)
        const next = new Map(prev)
        if (existing) {
          next.set(activeKey, { ...existing, severity: value })
        } else {
          // Create entry when sliding on a part not yet added under this tab
          next.set(activeKey, { partId: activePart, name: partIdToName(activePart), symptomType: activeTab, severity: value })
        }
        return next
      })
    },
    [activeKey, activePart, activeTab]
  )

  const handleRemovePart = useCallback(
    (key) => {
      setPartEntries((prev) => {
        const next = new Map(prev)
        next.delete(key)
        return next
      })
      if (key === activeKey) {
        const remaining = [...partEntries.entries()].filter(([k, e]) => k !== key && e.symptomType === activeTab)
        setActivePart(remaining.length > 0 ? remaining[remaining.length - 1][1].partId : null)
      }
    },
    [activeKey, activeTab, partEntries]
  )

  const handleChipClick = useCallback((key, entry) => {
    setActivePart(entry.partId)
    setActiveTab(entry.symptomType)
  }, [])

  const currentSeverity = activeKey ? (partEntries.get(activeKey)?.severity ?? 5) : 5
  const activePartName = activePart ? (partEntries.get(activeKey)?.name ?? partIdToName(activePart)) : ''

  const panelVisible = activePart !== null

  // Group entries by symptom type for chip display
  const chipsByType = symptomTypes.reduce((acc, type) => {
    acc[type] = [...partEntries.entries()].filter(([, e]) => e.symptomType === type)
    return acc
  }, {})

  return (
    <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-start' }}>
      {/* LEFT COLUMN — fixed max width (Change 1) */}
      <Box sx={{ flex: '0 0 auto', width: 420, display: 'flex', flexDirection: 'column', gap: 2 }}>
        {/* Question title */}
        <Typography
          variant="h6"
          sx={{ fontWeight: 500, color: 'var(--color-text-primary)', lineHeight: 1.4 }}
        >
          {questionTitle}
        </Typography>

        {/* Instruction text */}
        <Typography variant="body2" sx={{ color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
          {instructions}
        </Typography>

        {/* Severity panel */}
        <Collapse in={panelVisible} unmountOnExit sx={{ width: '100%' }}>
          <Box
            sx={{
              border: '1px solid var(--color-border-primary)',
              borderRadius: 'var(--radius-md)',
              overflow: 'hidden',
            }}
          >
            {/* Symptom type tabs */}
            <Tabs
              value={symptomTypes.includes(activeTab) ? activeTab : symptomTypes[0]}
              onChange={(_, val) => setActiveTab(val)}
              variant="fullWidth"
              sx={{
                minHeight: 40,
                borderBottom: '1px solid var(--color-border-primary)',
                '& .MuiTab-root': {
                  minHeight: 40,
                  minWidth: 50,
                  px: 1,
                  py: 0,
                  fontSize: '12px',
                  textTransform: 'none',
                  color: 'var(--color-text-secondary)',
                  '&.Mui-selected': { color: 'var(--color-primary)', fontWeight: 600 },
                },
                '& .MuiTabs-indicator': { backgroundColor: 'var(--color-primary)' },
              }}
            >
              {symptomTypes.map((st) => (
                <Tab key={st} label={st} value={st} />
              ))}
            </Tabs>

            <Box sx={{ p: 2 }}>
              {/* Area label */}
              <Typography variant="body2" sx={{ color: 'var(--color-text-primary)', mb: 1.5, fontWeight: 500 }}>
                {activePartName} — set {activeTab.toLowerCase()} level
              </Typography>

              {/* Severity slider */}
              <Box sx={{ px: 1 }}>
                <Slider
                  min={1}
                  max={10}
                  step={1}
                  value={currentSeverity}
                  onChange={handleSliderChange}
                  valueLabelDisplay="auto"
                  marks
                  sx={{
                    color: 'var(--color-error)',
                    '& .MuiSlider-thumb': { backgroundColor: 'var(--color-error)' },
                    '& .MuiSlider-track': { backgroundColor: 'var(--color-error)', borderColor: 'var(--color-error)' },
                    '& .MuiSlider-rail': { backgroundColor: 'var(--color-border-primary)' },
                  }}
                />
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="caption" sx={{ color: 'var(--color-text-muted)' }}>1 — Mild</Typography>
                  <Typography variant="caption" sx={{ color: 'var(--color-text-muted)' }}>10 — Severe</Typography>
                </Box>
              </Box>
            </Box>
          </Box>
        </Collapse>

        {/* Selection chips grouped by symptom type */}
        {partEntries.size > 0 && (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            {symptomTypes.map((type) => {
              const entries = chipsByType[type] ?? []
              if (entries.length === 0) return null
              return (
                <Box key={type}>
                  <Typography variant="caption" sx={{ color: 'var(--color-text-muted)', fontSize: '11px', display: 'block', mb: 0.5 }}>
                    {type}
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {entries.map(([key, entry]) => {
                      const isActive = entry.partId === activePart && entry.symptomType === activeTab
                      const severity = entry.severity
                      return (
                        <Chip
                          key={key}
                          size="small"
                          onClick={() => handleChipClick(key, entry)}
                          onDelete={() => handleRemovePart(key)}
                          avatar={
                            <Box
                              sx={{
                                width: 8,
                                height: 8,
                                borderRadius: '50%',
                                backgroundColor: isActive ? 'var(--color-error)' : 'var(--color-text-muted)',
                                flexShrink: 0,
                                ml: '6px !important',
                              }}
                            />
                          }
                          label={`${entry.name} · ${severity}`}
                          sx={{
                            height: 28,
                            cursor: 'pointer',
                            backgroundColor: isActive ? 'var(--color-error-light)' : 'var(--color-background-secondary)',
                            borderWidth: 1,
                            borderStyle: 'solid',
                            borderColor: isActive ? 'var(--color-error)' : 'var(--color-border-primary)',
                            color: isActive ? 'var(--color-error-dark)' : 'var(--color-text-secondary)',
                            fontSize: '12px',
                            '& .MuiChip-deleteIcon': {
                              color: isActive ? 'var(--color-error)' : 'var(--color-text-muted)',
                              fontSize: '18px',
                              p: '2px',
                              '&:hover': { color: isActive ? 'var(--color-error-dark)' : 'var(--color-text-primary)' },
                            },
                            '& .MuiChip-avatar': { width: 8, height: 8 },
                          }}
                        />
                      )
                    })}
                  </Box>
                </Box>
              )
            })}
          </Box>
        )}

        {/* Done button */}
        <Box>
          <Button
            variant="contained"
            size="small"
            disableElevation
            sx={{
              backgroundColor: 'var(--color-primary)',
              color: '#fff',
              textTransform: 'none',
              fontWeight: 500,
              px: 3,
              '&:hover': { backgroundColor: 'var(--color-primary-hover)' },
            }}
          >
            Done
          </Button>
        </Box>
      </Box>

      {/* RIGHT COLUMN — SVG */}
      <Box sx={{ flex: '0 0 220px', position: 'relative' }}>
        {/* Flip button */}
        <IconButton
          size="small"
          onClick={() => setCurrentView((v) => (v === 'front' ? 'rear' : 'front'))}
          title={currentView === 'front' ? 'Show rear view' : 'Show front view'}
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            zIndex: 1,
            width: 36,
            height: 36,
            borderRadius: '50%',
            backgroundColor: 'var(--color-background-secondary)',
            border: '1px solid var(--color-border-primary)',
            color: 'var(--color-text-secondary)',
            '&:hover': { backgroundColor: 'var(--color-background-tertiary)' },
          }}
        >
          <SyncOutlined sx={{ fontSize: 18 }} />
        </IconButton>

        {/* View label */}
        <Typography
          variant="caption"
          sx={{
            position: 'absolute',
            top: 16,
            left: 0,
            color: 'var(--color-text-muted)',
            fontSize: '11px',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
          }}
        >
          {currentView === 'front' ? 'Front view' : 'Rear view'}
        </Typography>

        <Box sx={{ mt: 4, '& svg': { width: 'auto', height: '500px', display: 'block' } }}>
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

// ---- Page -----------------------------------------------------------------

export default function BodyMapPage() {
  const navigate = useNavigate()

  const [config, setConfig] = useState({
    instructions: 'Select any area on the body and set the severity.',
    bodyDisplay: 'male_female',
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
            <Button variant="contained" size="medium" disableElevation startIcon={<KeyboardArrowLeft />} sx={NAV_BTN_SX}>
              Back
            </Button>
            <Button variant="contained" size="medium" disableElevation endIcon={<KeyboardArrowRight />} sx={NAV_BTN_SX}>
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
