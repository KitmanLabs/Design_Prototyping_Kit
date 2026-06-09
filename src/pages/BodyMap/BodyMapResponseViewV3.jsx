import React, { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box,
  Typography,
  Avatar,
  IconButton,
  Button,
  Chip,
  Tabs,
  Tab,
  Collapse,
  CircularProgress,
  Divider,
} from '@mui/material'
import {
  ArrowBackOutlined,
  ChevronRightOutlined,
  DragIndicator,
  SyncOutlined,
  StickyNote2Outlined,
  KeyboardArrowLeft,
  KeyboardArrowRight,
  CloseOutlined,
} from '@mui/icons-material'
import bodyMapSvgUrl from '../../assets/body-map.svg'
import '../../styles/design-tokens.css'

let SVG_CACHE = null

const SYMPTOM_TYPES = ['Pain', 'Stiffness', 'Soreness']

// ---- Symptom colours -------------------------------------------------------
// eslint-disable-next-line design-system/no-hardcoded-colors
const SYMPTOM_COLORS = { Pain: '#c0392b', Stiffness: '#e67e22', Soreness: '#2980b9' }
// eslint-disable-next-line design-system/no-hardcoded-colors
const symptomColor = (type) => SYMPTOM_COLORS[type] || '#3B4960'

function hexToRgba(hex, alpha) {
  const h = hex.replace('#', '')
  const r = parseInt(h.slice(0, 2), 16)
  const g = parseInt(h.slice(2, 4), 16)
  const b = parseInt(h.slice(4, 6), 16)
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

const severityAlpha = (severity) => 0.25 + (Math.max(1, Math.min(10, severity)) / 10) * 0.7

// ---- Example completed response (read-only) -------------------------------
const RESPONSE = [
  {
    partId: 'front-Abdominal',
    name: 'Abdomen',
    symptoms: { Pain: 7, Stiffness: 3 },
    note: 'Felt a sharp pull during the sprint drills in the second half of training. Came on suddenly around the 40 minute mark.',
  },
  { partId: 'front-Left_Anterior_Thigh', name: 'Left anterior thigh', symptoms: { Soreness: 5 } },
  { partId: 'rear-Right_Posterior_Lower_Leg', name: 'Right posterior lower leg', symptoms: { Pain: 9 } },
]

// ---- Anthropic body-map summary generation (Change 2) ---------------------
function buildSummaryInput(response) {
  return response
    .map((area) => {
      const parts = SYMPTOM_TYPES.filter((t) => area.symptoms[t] != null).map(
        (t) => `${t} ${area.symptoms[t]}/10`
      )
      return `${area.name}: ${parts.join(', ')}${area.note ? ` (player note: ${area.note})` : ''}`
    })
    .join('\n')
}

async function generateBodyMapSummary(response) {
  const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY
  if (!apiKey) throw new Error('Anthropic API key not configured')

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 300,
      system:
        'You are a sports medicine assistant. Produce a concise clinical summary of a player\'s reported body-map discomfort from the structured input. Write one short paragraph, factual and clinical, highlighting the most significant areas first. No preamble, headings, or lists.',
      messages: [
        {
          role: 'user',
          content: `Player body map response:\n${buildSummaryInput(response)}\n\nWrite a concise clinical summary paragraph.`,
        },
      ],
    }),
  })

  if (!res.ok) throw new Error(`Anthropic API error: ${res.status}`)
  const data = await res.json()
  const text = data?.content?.[0]?.text?.trim()
  if (!text) throw new Error('Empty response')
  return text
}

// ---- Section navigation (matches the eForms response shell) ---------------
const NAV_SECTIONS = [
  {
    title: 'Section 1: Player Information',
    completed: '1 of 6 steps completed',
    subs: [
      'Sub section 1.1: Full Legal Name',
      'Sub section 1.2: Preferred/Display Name',
      'Sub section 1.3: Date of Birth',
      'Sub section 1.4: Age Range',
    ],
  },
  {
    title: 'Section 2: Player Profile',
    completed: '1 of 6 steps completed',
    subs: [
      'Sub section 2.1: Player ID / Jersey Number',
      'Sub section 2.2: Primary Position',
      'Sub section 2.3: Secondary Position',
      'Sub section 2.4: Height and Weight',
      'Sub section 2.5: College and High School',
      'Sub section 2.6: Awards and Achievements',
    ],
  },
]
const ACTIVE_SUB = 'Sub section 1.1: Full Legal Name'

// ---- Read-only body model --------------------------------------------------
function BodyMapSvg({ regionStyles, currentView }) {
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
          .replace(/path:hover\s*\{[^}]*\}/, 'path { cursor: default; }')
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
      } else {
        // eslint-disable-next-line design-system/no-hardcoded-colors
        path.style.fill = '#E0E0E0'
        // eslint-disable-next-line design-system/no-hardcoded-colors
        path.style.stroke = '#FFFFFF'
        path.style.strokeWidth = '1'
      }
    })
  }, [regionStyles, currentView, svgHtml])

  return (
    <Box
      ref={containerRef}
      dangerouslySetInnerHTML={{ __html: svgHtml ?? '' }}
      sx={{ width: '100%' }}
    />
  )
}

// ---- Page ------------------------------------------------------------------
export default function BodyMapResponseViewV3() {
  const navigate = useNavigate()

  const playerName = 'John Smith'
  const submittedAt = 'Submitted: 4 Jun 2026, 14:32'
  const formTitle = 'Medical history form'

  const [currentView, setCurrentView] = useState('front')
  const [activeLayer, setActiveLayer] = useState('Pain')

  // AI summary panel
  const [isSummaryView, setIsSummaryView] = useState(false)
  const [summaryNotesExpanded, setSummaryNotesExpanded] = useState(new Set())
  const [aiSummary, setAiSummary] = useState('')
  const [aiLoading, setAiLoading] = useState(false)
  const [aiError, setAiError] = useState(false)

  const hasBodyMapData = RESPONSE.length > 0

  // Generate the AI body-map summary the first time the panel is opened
  useEffect(() => {
    if (!isSummaryView || !hasBodyMapData) return
    if (aiSummary || aiError || aiLoading) return
    setAiLoading(true)
    generateBodyMapSummary(RESPONSE)
      .then((text) => {
        setAiSummary(text)
        setAiLoading(false)
      })
      .catch(() => {
        setAiError(true)
        setAiLoading(false)
      })
  }, [isSummaryView, hasBodyMapData, aiSummary, aiError, aiLoading])

  const toggleSummaryNote = (partId) => {
    setSummaryNotesExpanded((prev) => {
      const next = new Set(prev)
      if (next.has(partId)) next.delete(partId)
      else next.add(partId)
      return next
    })
  }

  // Region fills for the active symptom layer
  const regionStyles = {}
  RESPONSE.forEach((area) => {
    const sev = area.symptoms[activeLayer]
    if (sev == null) return
    const color = symptomColor(activeLayer)
    regionStyles[area.partId] = {
      fill: hexToRgba(color, severityAlpha(sev)),
      stroke: color,
      strokeWidth: 1,
    }
  })

  return (
    <Box sx={{ display: 'flex', width: '100%', overflow: 'hidden', flexDirection: 'column', height: '100vh' }}>
      {/* Top breadcrumb row */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          px: 3,
          py: 1.5,
          borderBottom: '1px solid var(--color-border-primary)',
          backgroundColor: 'var(--color-background-primary)',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography
            variant="body2"
            sx={{ color: 'var(--color-text-primary)', fontWeight: 500, cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}
            onClick={() => navigate('/forms')}
          >
            Form Templates
          </Typography>
          <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', color: 'var(--color-text-secondary)' }}>
            <Box component="span" sx={{ mx: 0.5 }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 12a3 3 0 100-6 3 3 0 000 6zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" /></svg>
            </Box>
            Player list
          </Typography>
          <Typography variant="body2" sx={{ color: 'var(--color-text-secondary)' }}>&gt; &gt;</Typography>
        </Box>

        <Box sx={{ ml: 'auto', display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Typography variant="body2" sx={{ color: 'var(--color-text-primary)' }}>Primary Squad</Typography>
          <Typography variant="body2" sx={{ color: 'var(--color-text-secondary)' }}>▼</Typography>
          <Avatar sx={{ width: 32, height: 32, ml: 1 }} src="" />
        </Box>
      </Box>

      {/* Header row */}
      <Box sx={{ display: 'flex', alignItems: 'center', px: 3, py: 2, gap: 2, borderBottom: '1px solid var(--color-border-primary)' }}>
        <IconButton
          size="small"
          onClick={() => navigate('/forms')}
          sx={{ color: 'var(--color-text-secondary)', '&:hover': { backgroundColor: 'var(--color-background-secondary)' } }}
        >
          <ArrowBackOutlined />
        </IconButton>
        <Avatar sx={{ width: 40, height: 40, bgcolor: 'var(--color-text-disabled)', fontSize: '14px', fontWeight: 600 }}>OP</Avatar>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 400, color: 'var(--color-text-primary)', fontSize: '1.5rem' }}>
            {formTitle}
          </Typography>
          <Typography variant="caption" sx={{ color: 'var(--color-text-secondary)' }}>
            {playerName} · {submittedAt}
          </Typography>
        </Box>

        <Box sx={{ ml: 'auto', display: 'flex', alignItems: 'center', gap: 1 }}>
          <Button
            variant="outlined"
            size="medium"
            onClick={() => setIsSummaryView(true)}
            sx={{
              borderColor: 'var(--color-primary)',
              color: 'var(--color-primary)',
              textTransform: 'none',
              fontWeight: 500,
              px: 2,
              '&:hover': { borderColor: 'var(--color-primary-dark)', backgroundColor: 'var(--color-primary-light)' },
            }}
          >
            Summary View
          </Button>
          <Button
            variant="contained"
            size="medium"
            disableElevation
            sx={{
              backgroundColor: 'var(--color-primary)',
              color: 'var(--color-white)',
              textTransform: 'none',
              fontWeight: 500,
              px: 2.5,
              '&:hover': { backgroundColor: 'var(--color-primary-hover)' },
            }}
          >
            Create
          </Button>
        </Box>
      </Box>

      {/* Content area with left sidebar + main */}
      <Box sx={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* Left sidebar — section / subsection navigation */}
        <Box
          sx={{
            width: 320,
            flexShrink: 0,
            borderRight: '1px solid var(--color-border-primary)',
            overflowY: 'auto',
            backgroundColor: 'var(--color-background-primary)',
          }}
        >
          {/* Collapse chevron at top */}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', px: 2, py: 1.5, borderBottom: '1px solid var(--color-border-secondary)' }}>
            <ChevronRightOutlined sx={{ fontSize: 18, color: 'var(--color-text-secondary)' }} />
          </Box>

          {NAV_SECTIONS.map((section) => (
            <Box key={section.title}>
              {/* Section header */}
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  px: 2,
                  py: 1.5,
                  backgroundColor: 'var(--color-background-secondary)',
                }}
              >
                <DragIndicator sx={{ color: 'var(--color-text-disabled)', fontSize: 18, mr: 1, mt: 0.25 }} />
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: 'var(--color-text-primary)', fontSize: '13px', lineHeight: 1.4 }}>
                    {section.title}
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'var(--color-text-secondary)', fontSize: '11px' }}>
                    {section.completed}
                  </Typography>
                </Box>
                <ChevronRightOutlined sx={{ color: 'var(--color-text-secondary)', fontSize: 18, mt: 0.25 }} />
              </Box>
              {/* Subsections */}
              {section.subs.map((sub) => {
                const active = sub === ACTIVE_SUB
                return (
                  <Box
                    key={sub}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      pl: 5,
                      pr: 2,
                      py: 1.25,
                      backgroundColor: active ? 'var(--color-background-secondary)' : 'transparent',
                      borderBottom: '1px solid var(--color-border-secondary)',
                    }}
                  >
                    <DragIndicator sx={{ color: 'var(--color-text-disabled)', fontSize: 16, mr: 1 }} />
                    <Typography variant="body2" sx={{ flex: 1, color: 'var(--color-text-secondary)', fontSize: '12px', lineHeight: 1.4 }}>
                      {sub}
                    </Typography>
                    <ChevronRightOutlined sx={{ color: 'var(--color-text-secondary)', fontSize: 16 }} />
                  </Box>
                )
              })}
            </Box>
          ))}
        </Box>

        {/* Main content */}
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', backgroundColor: 'var(--color-background-primary)' }}>
          <Box sx={{ flex: 1, p: 4, overflowY: 'auto' }}>
            {/* Section heading */}
            <Typography
              variant="h4"
              sx={{ fontWeight: 400, color: 'var(--color-text-primary)', fontSize: '1.75rem', mb: 3, letterSpacing: '-0.01em' }}
            >
              SECTION 1 — Player Information
            </Typography>

            {/* Body Map response block */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.75, mb: 3 }}>
              <Typography
                variant="caption"
                sx={{ color: 'var(--color-text-muted)', fontSize: '11px', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.04em' }}
              >
                Sub-section 1.1
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 500, color: 'var(--color-text-primary)', lineHeight: 1.4 }}>
                Where are you experiencing discomfort?
              </Typography>
              <Typography variant="body2" sx={{ color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
                Select any area on the body and indicate the severity.
              </Typography>
            </Box>

            {/* Model + confirmed selections — paired unit, max ~900px, left-aligned */}
            <Box sx={{ display: 'flex', gap: 4, alignItems: 'flex-start', flexWrap: 'wrap', mt: 1, maxWidth: 900 }}>
              {/* Body model (read-only) — compact, left-aligned */}
              <Box sx={{ flex: '0 0 auto', display: 'flex', flexDirection: 'column' }}>
                {/* Front/back flip button */}
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

                {/* Symptom layer toggle — tabs, left-aligned to the model */}
                <Box sx={{ display: 'flex', justifyContent: 'flex-start', mb: 1 }}>
                  <Tabs
                    value={activeLayer}
                    onChange={(_, v) => setActiveLayer(v)}
                    sx={{
                      minHeight: 36,
                      '& .MuiTab-root': {
                        minHeight: 36,
                        px: 1.5,
                        textTransform: 'none',
                        fontSize: '13px',
                        color: 'var(--color-text-secondary)',
                        '&.Mui-selected': { color: 'var(--color-text-primary)', fontWeight: 600 },
                      },
                      '& .MuiTabs-indicator': { backgroundColor: 'var(--color-text-primary)' },
                    }}
                  >
                    {SYMPTOM_TYPES.map((type) => (
                      <Tab key={type} label={type} value={type} />
                    ))}
                  </Tabs>
                </Box>

                <Box sx={{ '& svg': { width: 'auto', height: '500px', display: 'block' } }}>
                  <BodyMapSvg regionStyles={regionStyles} currentView={currentView} />
                </Box>
              </Box>

              {/* Confirmed selections — read-only chip groups by body area */}
              <Box sx={{ flex: '0 1 440px', minWidth: 280, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                {RESPONSE.map((area) => {
                  const entries = SYMPTOM_TYPES.filter((t) => area.symptoms[t] != null)
                  return (
                    <Box key={area.partId}>
                      <Typography variant="caption" sx={{ color: 'var(--color-text-muted)', fontSize: '11px', display: 'block', mb: 0.5 }}>
                        {area.name}
                      </Typography>

                      {/* Player note (read-only, expanded) */}
                      {area.note && (
                        <Box sx={{ mb: 1 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5 }}>
                            <StickyNote2Outlined sx={{ fontSize: 14, color: 'var(--color-text-muted)' }} />
                            <Typography variant="caption" sx={{ color: 'var(--color-text-muted)', fontSize: '11px' }}>
                              Player note
                            </Typography>
                          </Box>
                          <Box sx={{ p: 1.25, backgroundColor: 'var(--color-background-secondary)', borderRadius: 'var(--radius-md)' }}>
                            <Typography variant="body2" sx={{ color: 'var(--color-text-secondary)', fontSize: '12px', lineHeight: 1.5 }}>
                              {area.note}
                            </Typography>
                          </Box>
                        </Box>
                      )}

                      {/* Read-only symptom chips */}
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        {entries.map((type) => {
                          const color = symptomColor(type)
                          return (
                            <Chip
                              key={type}
                              size="small"
                              label={`${type} · ${area.symptoms[type]}`}
                              sx={{
                                height: 28,
                                backgroundColor: hexToRgba(color, 0.12),
                                border: `1px solid ${color}`,
                                color,
                                fontSize: '12px',
                              }}
                            />
                          )
                        })}
                      </Box>
                    </Box>
                  )
                })}
              </Box>
            </Box>
          </Box>

          {/* Bottom navigation buttons */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, px: 4, py: 2, borderTop: '1px solid var(--color-border-primary)' }}>
            <Button
              variant="outlined"
              size="medium"
              startIcon={<KeyboardArrowLeft />}
              sx={{ borderColor: 'var(--color-border-primary)', color: 'var(--color-primary)', textTransform: 'none', fontWeight: 500 }}
            >
              Back
            </Button>
            <Button
              variant="outlined"
              size="medium"
              endIcon={<KeyboardArrowRight />}
              sx={{ borderColor: 'var(--color-border-primary)', color: 'var(--color-primary)', textTransform: 'none', fontWeight: 500 }}
            >
              Next
            </Button>
          </Box>
        </Box>
      </Box>

      {/* AI Summary panel */}
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          right: 0,
          width: 400,
          height: '100vh',
          backgroundColor: 'var(--color-background-primary)',
          borderLeft: '1px solid var(--color-border-primary)',
          transform: isSummaryView ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 0.3s ease',
          zIndex: 1200,
          display: 'flex',
          flexDirection: 'column',
          boxShadow: isSummaryView ? '-4px 0 12px rgba(0,0,0,0.1)' : 'none',
        }}
      >
        {/* Drawer header */}
        <Box sx={{ px: 3, py: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--color-border-primary)' }}>
          <Typography variant="h6" sx={{ fontWeight: 600, color: 'var(--color-text-primary)' }}>
            Form summary
          </Typography>
          <IconButton size="small" onClick={() => setIsSummaryView(false)} sx={{ color: 'var(--color-text-secondary)' }}>
            <CloseOutlined fontSize="small" />
          </IconButton>
        </Box>

        <Box sx={{ flex: 1, overflowY: 'auto', px: 3, py: 2 }}>
          {/* Existing athlete medical summary content */}
          <Typography variant="subtitle1" sx={{ fontWeight: 600, color: 'var(--color-text-primary)', mb: 2 }}>
            Athlete Medical Summary
          </Typography>
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 600, color: 'var(--color-text-primary)', mb: 0.5 }}>
              Musculoskeletal History
            </Typography>
            <Typography variant="body2" sx={{ color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
              Right ACL reconstruction (Aug 2023) with full return-to-play clearance. Chronic left ankle instability noted.
            </Typography>
          </Box>
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 600, color: 'var(--color-text-primary)', mb: 0.5 }}>
              Allergy & Medication
            </Typography>
            <Typography variant="body2" sx={{ color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
              Known penicillin allergy. Daily multivitamin and Vitamin D supplementation.
            </Typography>
          </Box>

          {/* Body Map Summary section (Change 1 + 2) */}
          {hasBodyMapData && (
            <>
              <Divider sx={{ my: 2 }} />
              <Typography variant="subtitle1" sx={{ fontWeight: 600, color: 'var(--color-text-primary)', mb: 1.5 }}>
                Body Map Summary
              </Typography>

              {/* AI-generated narrative paragraph */}
              <Box sx={{ mb: 2 }}>
                {aiLoading ? (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CircularProgress size={16} sx={{ color: 'var(--color-text-secondary)' }} />
                    <Typography variant="body2" sx={{ color: 'var(--color-text-secondary)' }}>
                      Generating summary…
                    </Typography>
                  </Box>
                ) : aiError ? (
                  <Typography variant="body2" sx={{ color: 'var(--color-text-muted)', fontStyle: 'italic' }}>
                    Summary unavailable
                  </Typography>
                ) : (
                  <Typography variant="body2" sx={{ color: 'var(--color-text-primary)', lineHeight: 1.6 }}>
                    {aiSummary}
                  </Typography>
                )}
              </Box>

              {/* Data-driven grouped list */}
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                {RESPONSE.map((area) => {
                  const entries = SYMPTOM_TYPES.filter((t) => area.symptoms[t] != null)
                  return (
                    <Box key={area.partId}>
                      <Typography variant="body2" sx={{ fontWeight: 600, color: 'var(--color-text-primary)', mb: 0.5 }}>
                        {area.name}
                      </Typography>
                      {entries.map((type) => {
                        const color = symptomColor(type)
                        return (
                          <Box key={type} sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mb: 0.25 }}>
                            <Box sx={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: color, flexShrink: 0 }} />
                            <Typography variant="body2" sx={{ color, fontWeight: 500 }}>
                              {type} · {area.symptoms[type]}/10
                            </Typography>
                          </Box>
                        )
                      })}

                      {/* Player note — collapsed by default with View note toggle */}
                      {area.note && (
                        <Box sx={{ mt: 0.5, pl: 1.75 }}>
                          <Box
                            onClick={() => toggleSummaryNote(area.partId)}
                            sx={{ display: 'flex', alignItems: 'center', gap: 0.5, cursor: 'pointer' }}
                          >
                            <StickyNote2Outlined sx={{ fontSize: 14, color: 'var(--color-text-muted)' }} />
                            <Typography variant="caption" sx={{ color: 'var(--color-text-secondary)', fontSize: '11px' }}>
                              View note
                            </Typography>
                            <ChevronRightOutlined
                              sx={{
                                fontSize: 14,
                                color: 'var(--color-text-secondary)',
                                transform: summaryNotesExpanded.has(area.partId) ? 'rotate(90deg)' : 'none',
                                transition: 'transform 0.2s',
                              }}
                            />
                          </Box>
                          <Collapse in={summaryNotesExpanded.has(area.partId)} unmountOnExit>
                            <Typography variant="body2" sx={{ mt: 0.5, color: 'var(--color-text-secondary)', fontSize: '12px', fontStyle: 'italic', lineHeight: 1.5 }}>
                              {area.note}
                            </Typography>
                          </Collapse>
                        </Box>
                      )}
                    </Box>
                  )
                })}
              </Box>
            </>
          )}
        </Box>
      </Box>
    </Box>
  )
}
