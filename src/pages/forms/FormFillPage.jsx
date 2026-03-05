import React, { useState, useMemo, useEffect, useRef } from 'react'
import { useNavigate, useLocation, useParams } from 'react-router-dom'
import {
  Box,
  Paper,
  Typography,
  Divider,
  Switch,
  Checkbox,
  FormControlLabel,
  IconButton,
  Drawer,
  TextField,
  Autocomplete,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Avatar
} from '@mui/material'
import {
  ArrowBackOutlined,
  CloseOutlined,
  ArrowDropDownOutlined,
  ChevronRightOutlined,
  AutoAwesomeOutlined,
  InfoOutlined
} from '@mui/icons-material'
import '../../styles/design-tokens.css'
import { Button, Icon, StatusChip } from '../../components'
import testToggleTemplate from '../../data/formTemplates/test-toggle-switch.json'
import MenuTree from '../../components/forms/builder/MenuTree'

// Mock form templates for summary view
const mockFormTemplates = [
  { id: 1, name: 'Medical Assessment' },
  { id: 2, name: 'Daily Wellness Check' },
  { id: 3, name: 'Pre-Season Screening' },
  { id: 4, name: 'Nutritional Assessment' },
  { id: 5, name: 'Performance Review' }
]

// Mock recent form summaries
const mockRecentSummaries = [
  { id: 1, title: 'Nutritional Assessment and Dietary Planning', date: 'Sep 27, 2025' },
  { id: 2, title: 'Skill Development and Tactical Review', date: 'Sep 25, 2025' },
  { id: 3, title: 'Pre-Season Medical Screening', date: 'Sep 20, 2025' },
  { id: 4, title: 'Daily Wellness Check', date: 'Sep 18, 2025' },
  { id: 5, title: 'Post-Match Recovery Assessment', date: 'Sep 15, 2025' },
  { id: 6, title: 'Training Load Monitoring', date: 'Sep 12, 2025' },
  { id: 7, title: 'Mental Health and Wellbeing Check', date: 'Sep 10, 2025' }
]

// Mock detailed summary content for drill-down view
const mockSummaryDetails = {
  1: {
    sections: [
      {
        title: 'Nutritional Overview',
        items: [
          {
            headline: 'Current Diet Assessment',
            content: 'Athlete maintains a balanced macronutrient intake with adequate protein (1.8g/kg body weight). Carbohydrate timing around training sessions is well-optimized for performance.'
          },
          {
            headline: 'Hydration Status',
            content: 'Consistent daily fluid intake of 3-4 liters. Pre and post-training hydration protocols are being followed effectively.'
          },
          {
            headline: 'Supplement Recommendations',
            content: 'Continue with current Vitamin D supplementation (2000 IU daily). Consider adding omega-3 fatty acids to support joint health and recovery.'
          }
        ]
      },
      {
        title: 'Recommendations',
        items: [
          {
            headline: 'Immediate Actions',
            content: 'Increase iron-rich food intake to address borderline ferritin levels. Schedule follow-up blood work in 4 weeks.'
          },
          {
            headline: 'Dietary Adjustments',
            content: 'Increase complex carbohydrate intake on high-intensity training days. Add pre-sleep casein protein to support overnight recovery.'
          }
        ]
      }
    ]
  },
  3: {
    sections: [
      {
        title: 'Athlete Medical Summary',
        items: [
          {
            headline: 'Concussion History',
            content: 'Significant history of concussion. Sustained a concussion in high school (2012) resulting in loss of consciousness and hospitalization. Recent hospitalization for concussion on March 11, 2025.'
          },
          {
            headline: 'Musculoskeletal History',
            content: 'Right Low Back: History of imaging (X-ray, MRI, CT, or bone scan) performed on December 24, 2024 for chronic issues.'
          },
          {
            headline: 'Vaccination Status',
            content: 'Incomplete vaccination history: Mumps: Unknown, Pneumonia: Tetanus: No'
          }
        ]
      },
      {
        title: 'Recommendations',
        items: [
          {
            headline: 'Immediate Actions',
            content: 'Player should be immediately held from all contact and throwing activities. Urgent comprehensive orthopedic evaluation of the right shoulder is required. Urgent comprehensive neurological evaluation, including a detailed concussion assessment, is required.'
          },
          {
            headline: 'Diagnostic Next Steps',
            content: 'Obtain an MRI of the right shoulder to assess rotator cuff integrity and extent of injury. Conduct a full neuropsychological assessment (e.g., ImPACT testing) and a thorough neurological examination to evaluate sequelae of the recent concussion. Review medical records from the March 11, 2025 hospitalization.'
          }
        ]
      }
    ]
  }
}

// Generate default summary details for items without specific content
const getDefaultSummaryDetail = (summary) => ({
  sections: [
    {
      title: 'Assessment Summary',
      items: [
        {
          headline: 'Overview',
          content: `This ${summary.title.toLowerCase()} was completed and all findings have been documented. Key observations and metrics are within expected parameters.`
        },
        {
          headline: 'Key Findings',
          content: 'All assessed areas show satisfactory results. No immediate concerns were identified during this evaluation.'
        }
      ]
    },
    {
      title: 'Recommendations',
      items: [
        {
          headline: 'Follow-up Actions',
          content: 'Continue with current protocols. Schedule next assessment as per standard monitoring schedule.'
        }
      ]
    }
  ]
})

function getTemplateForForm() {
  // Return the test toggle template for demo purposes
  return testToggleTemplate
}

function buildStubAnswers(template) {
  const answers = {}
  for (const section of template.sections || []) {
    for (const item of section.items || []) {
      if (item.type === 'subsection') {
        for (const q of item.items || []) {
          answers[q.id] = undefined // Not answered yet
        }
      }
    }
  }
  return answers
}

export default function FormFillPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { formId, athleteId } = useParams()
  
  // Get athlete info from location state or use defaults
  const athleteName = location.state?.athleteName || 'Jordan Smith'
  const formTitle = location.state?.formTitle || 'Medical Assessment'
  const isDraft = location.state?.isDraft || false
  
  const template = useMemo(() => getTemplateForForm(), [])
  const [answers, setAnswers] = useState(() => buildStubAnswers(template))
  const [summaryDrawerOpen, setSummaryDrawerOpen] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState(null)
  const [selectedSummary, setSelectedSummary] = useState(null)

  // Flatten questions for navigation
  const allQuestions = useMemo(() => {
    const questions = []
    for (const section of template.sections || []) {
      for (const item of section.items || []) {
        if (item.type === 'subsection') {
          for (const subItem of item.items || []) {
            if (['boolean', 'checkbox', 'switch'].includes(subItem.type)) {
              questions.push(subItem)
            }
          }
        } else if (['boolean', 'checkbox', 'switch'].includes(item.type)) {
          questions.push(item)
        }
      }
    }
    return questions
  }, [template])

  const [selectedQuestionId, setSelectedQuestionId] = useState(allQuestions[0]?.id)
  
  useEffect(() => {
    if (!selectedQuestionId && allQuestions.length > 0) {
      setSelectedQuestionId(allQuestions[0].id)
    }
  }, [allQuestions, selectedQuestionId])

  const hasMountedRef = useRef(false)
  useEffect(() => {
    if (!hasMountedRef.current) {
      hasMountedRef.current = true
      return
    }
    if (selectedQuestionId) {
      const el = document.getElementById(`fill-q-${selectedQuestionId}`)
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [selectedQuestionId])

  const handleToggleAnswer = (questionId) => (event) => {
    const isChecked = event?.target?.checked ?? !answers[questionId]
    setAnswers((prev) => ({ ...prev, [questionId]: isChecked }))
  }

  const handleSaveAsDraft = () => {
    // eslint-disable-next-line no-console
    console.log('Saved as draft:', answers)
    navigate('/medical-assessment')
  }

  const handleSubmit = () => {
    // eslint-disable-next-line no-console
    console.log('Submitted:', answers)
    navigate('/medical-assessment')
  }

  const handleBack = () => {
    navigate('/forms')
  }

  // Calculate drawer width for layout shift
  const drawerWidth = 400

  return (
    <Box sx={{ display: 'flex', bgcolor: 'var(--color-background-primary)', height: '100%' }}>
      {/* Main content area - shifts when drawer opens */}
      <Box
        sx={{
          flex: 1,
          transition: 'margin-right 225ms cubic-bezier(0, 0, 0.2, 1)',
          marginRight: summaryDrawerOpen ? `${drawerWidth}px` : 0,
          display: 'flex',
          flexDirection: 'column',
          minWidth: 0
        }}
      >
        <Paper elevation={0} sx={{ borderRadius: 'var(--radius-md)', overflow: 'hidden', flex: 1, display: 'flex', flexDirection: 'column', m: 2 }}>
          {/* Header */}
          <Box sx={{ px: 3, py: 2, display: 'flex', alignItems: 'center', gap: 2, borderBottom: '1px solid var(--color-border-primary)' }}>
            {/* Back button */}
            <IconButton
              aria-label="Back"
              size="small"
              onClick={handleBack}
              sx={{ color: 'var(--color-text-secondary)' }}
            >
              <ArrowBackOutlined fontSize="small" />
            </IconButton>

            {/* Form title */}
            <Typography
              variant="h6"
              sx={{
                fontWeight: 600,
                color: 'var(--color-text-primary)',
                fontFamily: 'var(--font-family-primary)',
                fontSize: 'var(--font-size-lg)'
              }}
            >
              {formTitle}
            </Typography>

            {/* Athlete avatar and name */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, ml: 2 }}>
              <Avatar
                sx={{
                  width: 32,
                  height: 32,
                  bgcolor: 'var(--color-primary)',
                  fontSize: 'var(--font-size-sm)',
                  fontWeight: 600
                }}
              >
                {athleteName.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)}
              </Avatar>
              <Typography
                variant="body2"
                sx={{
                  fontFamily: 'var(--font-family-primary)',
                  fontSize: 'var(--font-size-sm)',
                  color: 'var(--color-text-primary)'
                }}
              >
                {athleteName}
              </Typography>
            </Box>

            {/* Right side actions */}
            <Box sx={{ ml: 'auto', display: 'flex', alignItems: 'center', gap: 1.5 }}>
              {/* Summary View button */}
              <Button
                variant="secondary"
                size="small"
                onClick={() => setSummaryDrawerOpen(true)}
                style={{ fontWeight: 600, fontSize: 'var(--font-size-sm)', display: 'flex', alignItems: 'center', gap: 6 }}
              >
                <AutoAwesomeOutlined fontSize="small" />
                Summary View
              </Button>

              {/* Save as Draft */}
              <Button
                variant="secondary"
                size="small"
                onClick={handleSaveAsDraft}
                style={{ fontWeight: 600, fontSize: 'var(--font-size-sm)' }}
              >
                Save as Draft
              </Button>

              {/* Submit */}
              <Button
                variant="primary"
                size="small"
                onClick={handleSubmit}
                style={{ fontWeight: 600, fontSize: 'var(--font-size-sm)' }}
              >
                Submit
              </Button>
            </Box>
          </Box>

          {/* Body: left panel + right panel */}
          <Box sx={{ display: 'grid', gridTemplateColumns: '340px 1fr', gap: 0, flex: 1, minHeight: 0 }}>
            {/* Left panel: sections navigation */}
            <MenuTree
              form={template}
              selectedQuestionId={selectedQuestionId}
              onSelectQuestion={(id) => setSelectedQuestionId(id)}
              mode="review"
              completionByQuestionId={useMemo(() => {
                const map = {}
                for (const q of allQuestions) {
                  map[q.id] = answers[q.id] !== undefined
                }
                return map
              }, [allQuestions, answers])}
            />

            {/* Right panel: questions */}
            <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: 0 }}>
              <Box sx={{ flex: '1 1 auto', overflowY: 'auto', px: 3, py: 2 }}>
                {(template.sections || []).map((section) => (
                  <Box key={section.id} sx={{ mb: 3 }}>
                    <Typography variant="body1" sx={{ fontWeight: 600, mb: 1, fontFamily: 'var(--font-family-primary)' }}>
                      {section.title}
                    </Typography>
                    {(section.items || []).map((item) => (
                      <Box key={item.id} sx={{ pl: 2 }}>
                        {item.type === 'subsection' && (
                          <Typography variant="body2" sx={{ color: 'var(--color-text-secondary)', mb: 1, fontFamily: 'var(--font-family-primary)' }}>
                            {item.title}
                          </Typography>
                        )}
                        {(item.items || []).map((q) => {
                          const answer = answers[q.id]
                          const isSelected = selectedQuestionId === q.id
                          return (
                            <Box
                              key={q.id}
                              id={`fill-q-${q.id}`}
                              sx={{
                                py: 1.5,
                                px: 1.5,
                                borderRadius: 'var(--radius-sm)',
                                backgroundColor: isSelected ? 'var(--color-background-secondary)' : 'transparent',
                                mb: 1
                              }}
                            >
                              <Typography
                                variant="body2"
                                sx={{
                                  color: 'var(--color-text-primary)',
                                  mb: 1.5,
                                  fontFamily: 'var(--font-family-primary)'
                                }}
                              >
                                {q.description || q.label}
                                {q.mandatory && (
                                  <Typography component="span" sx={{ color: 'var(--color-error)', ml: 0.5 }}>
                                    *
                                  </Typography>
                                )}
                              </Typography>
                              
                              {/* Editable answer inputs */}
                              <Box>
                                {q.ui?.style === 'checkbox' && (
                                  <FormControlLabel
                                    control={
                                      <Checkbox
                                        checked={answer === true}
                                        onChange={handleToggleAnswer(q.id)}
                                        sx={{
                                          color: 'var(--color-border-primary)',
                                          '&.Mui-checked': { color: 'var(--color-primary)' }
                                        }}
                                      />
                                    }
                                    label={answer === true ? 'Yes' : answer === false ? 'No' : 'Select'}
                                    sx={{
                                      '& .MuiFormControlLabel-label': {
                                        fontFamily: 'var(--font-family-primary)',
                                        fontSize: 'var(--font-size-sm)'
                                      }
                                    }}
                                  />
                                )}
                                {q.ui?.style === 'switch' && (
                                  <FormControlLabel
                                    control={
                                      <Switch
                                        color="primary"
                                        checked={answer === true}
                                        onChange={handleToggleAnswer(q.id)}
                                      />
                                    }
                                    label={answer === true ? 'Yes' : answer === false ? 'No' : 'Select'}
                                    sx={{
                                      '& .MuiFormControlLabel-label': {
                                        fontFamily: 'var(--font-family-primary)',
                                        fontSize: 'var(--font-size-sm)'
                                      }
                                    }}
                                  />
                                )}
                                {q.ui?.style === 'toggle' && (
                                  <Box sx={{ display: 'flex', gap: 1 }}>
                                    <Button
                                      size="small"
                                      variant={answer === true ? 'primary' : 'secondary'}
                                      onClick={() => setAnswers((prev) => ({ ...prev, [q.id]: true }))}
                                      style={{ fontWeight: 600, fontSize: 'var(--font-size-xs)' }}
                                    >
                                      Yes
                                    </Button>
                                    <Button
                                      size="small"
                                      variant={answer === false ? 'primary' : 'secondary'}
                                      onClick={() => setAnswers((prev) => ({ ...prev, [q.id]: false }))}
                                      style={{ fontWeight: 600, fontSize: 'var(--font-size-xs)' }}
                                    >
                                      No
                                    </Button>
                                  </Box>
                                )}
                              </Box>
                            </Box>
                          )
                        })}
                      </Box>
                    ))}
                  </Box>
                ))}
              </Box>

              {/* Bottom question paginator */}
              <Box sx={{ borderTop: '1px solid var(--color-border-primary)', backgroundColor: 'var(--color-background-primary)', px: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, py: 1.5 }}>
                  <Button
                    size="small"
                    variant="secondary"
                    disabled={!selectedQuestionId || allQuestions.findIndex((q) => q.id === selectedQuestionId) <= 0}
                    onClick={() => {
                      const idx = allQuestions.findIndex((q) => q.id === selectedQuestionId)
                      if (idx > 0) setSelectedQuestionId(allQuestions[idx - 1].id)
                    }}
                  >
                    Previous
                  </Button>
                  <Button
                    size="small"
                    variant="primary"
                    disabled={!selectedQuestionId || allQuestions.findIndex((q) => q.id === selectedQuestionId) >= allQuestions.length - 1}
                    onClick={() => {
                      const idx = allQuestions.findIndex((q) => q.id === selectedQuestionId)
                      if (idx < allQuestions.length - 1) setSelectedQuestionId(allQuestions[idx + 1].id)
                    }}
                  >
                    Next
                  </Button>
                </Box>
              </Box>
            </Box>
          </Box>
        </Paper>
      </Box>

      {/* Summary View Drawer - pushes content, doesn't overlay */}
      <Drawer
        variant="persistent"
        anchor="right"
        open={summaryDrawerOpen}
        PaperProps={{
          sx: {
            width: drawerWidth,
            borderLeft: '1px solid var(--color-border-primary)',
            boxShadow: 'none'
          }
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          {selectedSummary ? (
            /* Drill-down Detail View */
            <>
              {/* Drill-down header - Back button and X button */}
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  px: 2,
                  py: 1.5,
                  borderBottom: '1px solid var(--color-border-primary)'
                }}
              >
                <IconButton
                  onClick={() => setSelectedSummary(null)}
                  size="small"
                  aria-label="Back to list"
                  sx={{ color: 'var(--color-text-secondary)' }}
                >
                  <ArrowBackOutlined fontSize="small" />
                </IconButton>
                <Typography
                  variant="body2"
                  sx={{
                    fontFamily: 'var(--font-family-primary)',
                    fontSize: 'var(--font-size-xs)',
                    color: 'var(--color-text-secondary)'
                  }}
                >
                  back
                </Typography>
                <Box sx={{ flex: 1 }} />
                <IconButton
                  onClick={() => {
                    setSelectedSummary(null)
                    setSummaryDrawerOpen(false)
                  }}
                  size="small"
                  aria-label="Close drawer"
                  sx={{ color: 'var(--color-text-secondary)' }}
                >
                  <CloseOutlined fontSize="small" />
                </IconButton>
              </Box>

              {/* Drill-down content */}
              <Box sx={{ flex: 1, overflowY: 'auto', px: 3, py: 2 }}>
                {/* Title and AI chip */}
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, mb: 0.5 }}>
                  <Typography
                    variant="h6"
                    sx={{
                      fontFamily: 'var(--font-family-primary)',
                      fontSize: 'var(--font-size-lg)',
                      fontWeight: 600,
                      color: 'var(--color-text-primary)',
                      lineHeight: 1.3,
                      flex: 1
                    }}
                  >
                    {selectedSummary.title}
                  </Typography>
                  <StatusChip
                    label="AI generated"
                    icon={<AutoAwesomeOutlined sx={{ fontSize: 14 }} />}
                    size="small"
                    sx={{
                      backgroundColor: 'var(--color-background-secondary)',
                      color: 'var(--color-text-secondary)',
                      fontFamily: 'var(--font-family-primary)',
                      fontSize: 'var(--font-size-xs)',
                      flexShrink: 0
                    }}
                  />
                </Box>

                {/* Date */}
                <Typography
                  variant="body2"
                  sx={{
                    fontFamily: 'var(--font-family-primary)',
                    fontSize: 'var(--font-size-sm)',
                    color: 'var(--color-text-secondary)',
                    mb: 2
                  }}
                >
                  {selectedSummary.date}
                </Typography>

                <Divider sx={{ mb: 2 }} />

                {/* Player selector (locked/disabled) */}
                <TextField
                  fullWidth
                  size="small"
                  variant="filled"
                  label="Player"
                  value={athleteName}
                  disabled
                  sx={{
                    mb: 3,
                    '& .MuiInputBase-root': {
                      backgroundColor: 'var(--color-background-secondary)',
                      fontFamily: 'var(--font-family-primary)',
                      fontSize: 'var(--font-size-sm)'
                    },
                    '& .MuiInputLabel-root': {
                      fontFamily: 'var(--font-family-primary)',
                      fontSize: 'var(--font-size-sm)'
                    }
                  }}
                />

                {/* Summary sections */}
                {(mockSummaryDetails[selectedSummary.id] || getDefaultSummaryDetail(selectedSummary)).sections.map((section, sectionIdx) => (
                  <Box key={sectionIdx} sx={{ mb: 3 }}>
                    {/* Section title */}
                    <Typography
                      variant="h6"
                      sx={{
                        fontFamily: 'var(--font-family-primary)',
                        fontSize: 'var(--font-size-md)',
                        fontWeight: 600,
                        color: 'var(--color-text-primary)',
                        mb: 2
                      }}
                    >
                      {section.title}
                    </Typography>

                    {/* Section items */}
                    {section.items.map((item, itemIdx) => (
                      <Box key={itemIdx} sx={{ mb: 2 }}>
                        {/* Item headline with info icon */}
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                          <InfoOutlined
                            sx={{
                              fontSize: 18,
                              color: 'var(--color-text-secondary)'
                            }}
                          />
                          <Typography
                            variant="body2"
                            sx={{
                              fontFamily: 'var(--font-family-primary)',
                              fontSize: 'var(--font-size-sm)',
                              fontWeight: 600,
                              color: 'var(--color-text-primary)'
                            }}
                          >
                            {item.headline}
                          </Typography>
                        </Box>
                        {/* Item content */}
                        <Typography
                          variant="body2"
                          sx={{
                            fontFamily: 'var(--font-family-primary)',
                            fontSize: 'var(--font-size-sm)',
                            color: 'var(--color-text-secondary)',
                            lineHeight: 1.6,
                            pl: 3.5
                          }}
                        >
                          {item.content}
                        </Typography>
                      </Box>
                    ))}

                    {sectionIdx < (mockSummaryDetails[selectedSummary.id] || getDefaultSummaryDetail(selectedSummary)).sections.length - 1 && (
                      <Divider sx={{ mt: 2 }} />
                    )}
                  </Box>
                ))}
              </Box>
            </>
          ) : (
            /* Recent List View (existing functionality) */
            <>
              {/* Drawer header - X button */}
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'flex-end',
                  px: 2,
                  py: 1.5,
                  borderBottom: '1px solid var(--color-border-primary)'
                }}
              >
                <IconButton
                  onClick={() => setSummaryDrawerOpen(false)}
                  size="small"
                  aria-label="Close drawer"
                  sx={{ color: 'var(--color-text-secondary)' }}
                >
                  <CloseOutlined fontSize="small" />
                </IconButton>
              </Box>

              {/* Selectors row */}
              <Box sx={{ px: 3, py: 2 }}>
                {/* Player selector (locked/disabled) */}
                <TextField
                  fullWidth
                  size="small"
                  variant="filled"
                  label="Player"
                  value={athleteName}
                  disabled
                  sx={{
                    mb: 2,
                    '& .MuiInputBase-root': {
                      backgroundColor: 'var(--color-background-secondary)',
                      fontFamily: 'var(--font-family-primary)',
                      fontSize: 'var(--font-size-sm)'
                    },
                    '& .MuiInputLabel-root': {
                      fontFamily: 'var(--font-family-primary)',
                      fontSize: 'var(--font-size-sm)'
                    }
                  }}
                />

                {/* Template search selector */}
                <Autocomplete
                  size="small"
                  options={mockFormTemplates}
                  getOptionLabel={(option) => option.name || ''}
                  value={selectedTemplate}
                  onChange={(_, newValue) => setSelectedTemplate(newValue)}
                  popupIcon={<ArrowDropDownOutlined fontSize="small" sx={{ color: 'var(--color-primary)' }} />}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      variant="filled"
                      label="Search templates"
                      sx={{
                        '& .MuiInputBase-root': {
                          backgroundColor: 'var(--color-background-secondary)',
                          fontFamily: 'var(--font-family-primary)',
                          fontSize: 'var(--font-size-sm)'
                        },
                        '& .MuiInputLabel-root': {
                          fontFamily: 'var(--font-family-primary)',
                          fontSize: 'var(--font-size-sm)'
                        }
                      }}
                    />
                  )}
                />
              </Box>

              <Divider />

              {/* Recent section */}
              <Box sx={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
                <Typography
                  variant="body2"
                  sx={{
                    px: 3,
                    py: 1.5,
                    fontWeight: 600,
                    fontFamily: 'var(--font-family-primary)',
                    fontSize: 'var(--font-size-sm)',
                    color: 'var(--color-text-secondary)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}
                >
                  Recent
                </Typography>

                <List sx={{ py: 0 }}>
                  {mockRecentSummaries.map((summary) => (
                    <ListItem key={summary.id} disablePadding>
                      <ListItemButton
                        onClick={() => setSelectedSummary(summary)}
                        sx={{
                          px: 3,
                          py: 1.5,
                          '&:hover': {
                            backgroundColor: 'var(--color-background-hover)'
                          }
                        }}
                      >
                        <ListItemText
                          primary={summary.title}
                          secondary={summary.date}
                          primaryTypographyProps={{
                            sx: {
                              fontFamily: 'var(--font-family-primary)',
                              fontSize: 'var(--font-size-sm)',
                              fontWeight: 500,
                              color: 'var(--color-text-primary)',
                              lineHeight: 1.4
                            }
                          }}
                          secondaryTypographyProps={{
                            sx: {
                              fontFamily: 'var(--font-family-primary)',
                              fontSize: 'var(--font-size-xs)',
                              color: 'var(--color-text-secondary)',
                              mt: 0.5
                            }
                          }}
                        />
                        <ChevronRightOutlined
                          fontSize="small"
                          sx={{ color: 'var(--color-text-tertiary)', ml: 1 }}
                        />
                      </ListItemButton>
                    </ListItem>
                  ))}
                </List>

                {/* Show More button */}
                <Box sx={{ px: 3, py: 2 }}>
                  <Button
                    variant="secondary"
                    size="small"
                    style={{
                      width: '100%',
                      fontWeight: 600,
                      fontSize: 'var(--font-size-sm)'
                    }}
                  >
                    Show More
                  </Button>
                </Box>
              </Box>
            </>
          )}
        </Box>
      </Drawer>
    </Box>
  )
}
