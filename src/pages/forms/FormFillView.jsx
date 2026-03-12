import React from 'react'
import { useNavigate, useParams, useLocation } from 'react-router-dom'
import { 
  Box, 
  Typography, 
  Divider, 
  TextField,
  Avatar,
  Button as MuiButton,
  IconButton,
  Autocomplete,
  InputAdornment,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  ListItemText,
  OutlinedInput
} from '@mui/material'
import { ArrowBackOutlined, Close, ChevronRight, Lock, Search, InfoOutlined, DiamondOutlined, DragIndicator, KeyboardArrowLeft, KeyboardArrowRight } from '@mui/icons-material'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import '../../styles/design-tokens.css'

// Medical History form template matching screenshot structure
const medicalAssessmentTemplate = {
  id: 'medical-history',
  title: 'Medical history form',
  productArea: 'Medical',
  category: 'Medical',
  sections: [
    {
      id: 's1',
      title: 'Player Information',
      items: [
        {
          id: 'ss1-1',
          type: 'subsection',
          title: 'Full Legal Name',
          items: []
        },
        {
          id: 'ss1-2',
          type: 'subsection',
          title: 'Preferred/Display Name',
          items: []
        },
        {
          id: 'ss1-3',
          type: 'subsection',
          title: 'Date of Birth',
          items: []
        },
        {
          id: 'ss1-4',
          type: 'subsection',
          title: 'Age Range',
          items: []
        }
      ]
    },
    {
      id: 's2',
      title: 'Player Profile',
      items: [
        {
          id: 'ss2-1',
          type: 'subsection',
          title: 'Player ID / Jersey Number',
          items: []
        },
        {
          id: 'ss2-2',
          type: 'subsection',
          title: 'Primary Position',
          items: []
        },
        {
          id: 'ss2-3',
          type: 'subsection',
          title: 'Secondary Position',
          items: []
        },
        {
          id: 'ss2-4',
          type: 'subsection',
          title: 'Height and Weight',
          items: []
        },
        {
          id: 'ss2-5',
          type: 'subsection',
          title: 'College and High School',
          items: []
        },
        {
          id: 'ss2-6',
          type: 'subsection',
          title: 'Awards and Achievements',
          items: []
        }
      ]
    },
    {
      id: 's3',
      title: 'Player Profile',
      items: [
        {
          id: 'ss3-1',
          type: 'subsection',
          title: 'Emergency Contact',
          items: []
        },
        {
          id: 'ss3-2',
          type: 'subsection',
          title: 'Insurance Information',
          items: []
        }
      ]
    }
  ]
}

// Track completion per section (mocked for display)
const sectionCompletion = {
  's1': { completed: 1, total: 6 },
  's2': { completed: 1, total: 6 },
  's3': { completed: 1, total: 6 }
}

// Get initials from name
function getInitials(name) {
  if (!name) return '?'
  const parts = name.trim().split(' ')
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase()
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase()
}

export default function FormFillView() {
  const navigate = useNavigate()
  const { athleteId } = useParams()
  const location = useLocation()

  // Get athlete name and form title from location state
  const athleteName = location.state?.athleteName || 'Athlete'
  const formTitle = location.state?.formTitle || 'Medical history form'

  const template = medicalAssessmentTemplate
  
  // Track selected section and subsection for navigation
  const [selectedSectionId, setSelectedSectionId] = React.useState(() => template.sections?.[0]?.id)
  const [selectedSubsectionId, setSelectedSubsectionId] = React.useState(null)
  
  // UI state
  const [isSaving, setIsSaving] = React.useState(false)
  const [isSummaryView, setIsSummaryView] = React.useState(false)
  const [selectedSummaryItem, setSelectedSummaryItem] = React.useState(null)

  // Form answer state
  const [hasAllergies, setHasAllergies] = React.useState('')
  const [allergyDetails, setAllergyDetails] = React.useState('')
  const [injuries, setInjuries] = React.useState([])
  const [injuryOtherDetails, setInjuryOtherDetails] = React.useState('')
  const [medications, setMedications] = React.useState('')
  const [lastPhysicalDate, setLastPhysicalDate] = React.useState(null)
  const [preExistingConditions, setPreExistingConditions] = React.useState([])
  const [conditionOtherDetails, setConditionOtherDetails] = React.useState('')

  // Dropdown options
  const injuryOptions = ['Sprain', 'Fracture', 'Concussion', 'Other']
  const conditionOptions = ['Asthma', 'Diabetes', 'Heart Condition', 'Other']

  // Recent summaries data
  const recentSummaries = [
    { title: 'Nutritional Assessment and Dietary Planning', date: 'Sep 27, 2025' },
    { title: 'Skill Development and Tactical Review', date: 'Sep 27, 2025' },
    { title: 'Mental Health Evaluation Support and Session', date: 'Sep 27, 2025' },
    { title: 'Team Strategy and Communication Workshop', date: 'Sep 27, 2025' },
    { title: 'End of Season Health Audit and Feedback', date: 'Sep 27, 2025' }
  ]

  const handleSaveAsDraft = () => {
    setIsSaving(true)
    setTimeout(() => {
      setIsSaving(false)
      navigate(-1)
    }, 500)
  }

  const handleSubmit = () => {
    setIsSaving(true)
    setTimeout(() => {
      setIsSaving(false)
      navigate(-1)
    }, 500)
  }

  // Get the current section for display
  const currentSection = template.sections?.find(s => s.id === selectedSectionId) || template.sections?.[0]
  const currentSectionIndex = template.sections?.findIndex(s => s.id === selectedSectionId) ?? 0
  
  // Get the current subsection for display
  const currentSubsection = selectedSubsectionId 
    ? currentSection?.items?.find(item => item.id === selectedSubsectionId)
    : currentSection?.items?.[0]
  const currentSubsectionIndex = currentSection?.items?.findIndex(item => item.id === (selectedSubsectionId || currentSection?.items?.[0]?.id)) ?? 0

  return (
    <Box sx={{ display: 'flex', width: '100%', overflow: 'hidden', flexDirection: 'column', height: '100vh' }}>
      {/* Top breadcrumb row */}
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        px: 3,
        py: 1.5,
        borderBottom: '1px solid var(--color-border-primary)',
        backgroundColor: 'var(--color-background-primary)'
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography 
            variant="body2" 
            sx={{ 
              color: 'var(--color-text-primary)', 
              fontWeight: 500,
              cursor: 'pointer',
              '&:hover': { textDecoration: 'underline' }
            }}
            onClick={() => navigate('/forms')}
          >
            Forms
          </Typography>
          <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', color: 'var(--color-text-secondary)' }}>
            <Box component="span" sx={{ mx: 0.5 }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 12a3 3 0 100-6 3 3 0 000 6zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
            </Box>
            Player list
          </Typography>
          <Typography variant="body2" sx={{ color: 'var(--color-text-secondary)' }}>&gt; &gt;</Typography>
        </Box>
        
        <Box sx={{ ml: 'auto', display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Typography variant="body2" sx={{ color: 'var(--color-text-primary)' }}>Primary Squad</Typography>
          <Typography variant="body2" sx={{ color: 'var(--color-text-secondary)' }}>▼</Typography>
          <Avatar 
            sx={{ 
              width: 32, 
              height: 32, 
              ml: 1
            }}
            src=""
          />
        </Box>
      </Box>

      {/* Main content area - shifts left when summary drawer is open */}
      <Box 
        sx={{ 
          display: 'flex', 
          flexDirection: 'column',
          flex: 1,
          minWidth: 0,
          transition: 'margin-right 0.3s ease',
          marginRight: isSummaryView ? '400px' : 0,
          overflow: 'hidden'
        }}
      >
        {/* Header row with back arrow, avatar, title, and buttons */}
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          px: 3, 
          py: 2,
          gap: 2,
          borderBottom: '1px solid var(--color-border-primary)'
        }}>
          {/* Back arrow */}
          <IconButton
            size="small"
            onClick={() => navigate(-1)}
            sx={{ 
              color: 'var(--color-text-secondary)',
              '&:hover': { backgroundColor: 'var(--color-background-secondary)' }
            }}
          >
            <ArrowBackOutlined />
          </IconButton>
          
          {/* Avatar with initials */}
          <Avatar 
            sx={{ 
              width: 40, 
              height: 40, 
              bgcolor: 'var(--color-primary)',
              fontSize: '14px',
              fontWeight: 600,
              border: '2px solid var(--color-primary)'
            }}
          >
            {getInitials(athleteName)}
          </Avatar>
          
          {/* Form title */}
          <Typography 
            variant="h5" 
            sx={{ 
              fontWeight: 400, 
              color: 'var(--color-text-primary)',
              fontSize: '1.5rem'
            }}
          >
            {formTitle}
          </Typography>
          
          {/* Action buttons */}
          <Box sx={{ ml: 'auto', display: 'flex', alignItems: 'center', gap: 1 }}>
            <MuiButton
              variant="outlined"
              size="medium"
              onClick={() => setIsSummaryView(prev => !prev)}
              sx={{
                borderColor: 'var(--color-primary)',
                color: 'var(--color-primary)',
                textTransform: 'none',
                fontWeight: 500,
                px: 2,
                '&:hover': { 
                  borderColor: 'var(--color-primary-dark)',
                  backgroundColor: 'var(--color-primary-light)'
                }
              }}
            >
              Summary View
            </MuiButton>
            <MuiButton
              variant="outlined"
              size="medium"
              disabled={isSaving}
              onClick={handleSaveAsDraft}
              sx={{
                borderColor: 'var(--color-primary)',
                color: 'var(--color-primary)',
                textTransform: 'none',
                fontWeight: 500,
                px: 2,
                '&:hover': { 
                  borderColor: 'var(--color-primary-dark)',
                  backgroundColor: 'var(--color-primary-light)'
                }
              }}
            >
              Save As Draft
            </MuiButton>
            <MuiButton
              variant="contained"
              size="medium"
              disableElevation
              disabled={isSaving}
              onClick={handleSubmit}
              sx={{
                backgroundColor: 'var(--color-primary)',
                color: 'var(--color-white)',
                textTransform: 'none',
                fontWeight: 500,
                px: 2.5,
                '&:hover': { backgroundColor: 'var(--color-primary-hover)' }
              }}
            >
              Submit
            </MuiButton>
          </Box>
        </Box>

        {/* Main content area with left panel and right content */}
        <Box sx={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
          {/* Left panel - Section/Subsection navigation */}
          <Box sx={{ 
            width: isSummaryView ? '80px' : '320px',
            borderRight: '1px solid var(--color-border-primary)',
            overflowY: 'auto',
            overflowX: 'hidden',
            transition: 'width 0.3s ease',
            backgroundColor: 'var(--color-background-primary)',
            flexShrink: 0
          }}>
            {isSummaryView ? (
              // Collapsed section list
              <Box sx={{ py: 2 }}>
                {(template.sections || []).map((section, index) => (
                  <Box
                    key={section.id}
                    onClick={() => {
                      setSelectedSectionId(section.id)
                      setSelectedSubsectionId(null)
                    }}
                    sx={{
                      px: 1.5,
                      py: 1,
                      cursor: 'pointer',
                      textAlign: 'center',
                      backgroundColor: selectedSectionId === section.id ? 'var(--color-background-secondary)' : 'transparent',
                      '&:hover': { backgroundColor: 'var(--color-background-secondary)' }
                    }}
                  >
                    <Typography 
                      variant="caption" 
                      sx={{ 
                        fontWeight: selectedSectionId === section.id ? 600 : 400,
                        color: 'var(--color-text-primary)',
                        fontSize: '11px'
                      }}
                    >
                      S{index + 1}
                    </Typography>
                  </Box>
                ))}
              </Box>
            ) : (
              // Full section/subsection list matching screenshot
              <Box sx={{ py: 0 }}>
                {(template.sections || []).map((section, sectionIndex) => {
                  const completion = sectionCompletion[section.id] || { completed: 0, total: section.items?.length || 0 }
                  return (
                    <Box key={section.id}>
                      {/* Section header */}
                      <Box
                        onClick={() => {
                          setSelectedSectionId(section.id)
                          setSelectedSubsectionId(null)
                        }}
                        sx={{
                          display: 'flex',
                          alignItems: 'flex-start',
                          px: 2,
                          py: 1.5,
                          cursor: 'pointer',
                          backgroundColor: selectedSectionId === section.id && !selectedSubsectionId ? 'var(--color-background-secondary)' : 'transparent',
                          '&:hover': { backgroundColor: 'var(--color-background-secondary)' }
                        }}
                      >
                        <DragIndicator 
                          sx={{ 
                            color: 'var(--color-text-disabled)', 
                            fontSize: '18px',
                            mr: 1,
                            mt: 0.25
                          }} 
                        />
                        <Box sx={{ flex: 1, minWidth: 0 }}>
                          <Typography 
                            variant="body2" 
                            sx={{ 
                              fontWeight: 600, 
                              color: 'var(--color-text-primary)',
                              fontSize: '13px',
                              lineHeight: 1.4
                            }}
                          >
                            Section {sectionIndex + 1}: {section.title}
                          </Typography>
                          <Typography 
                            variant="caption" 
                            sx={{ 
                              color: 'var(--color-text-secondary)',
                              fontSize: '11px'
                            }}
                          >
                            {completion.completed} of {completion.total} steps completed
                          </Typography>
                        </Box>
                        <ChevronRight 
                          sx={{ 
                            color: 'var(--color-text-secondary)', 
                            fontSize: '18px',
                            mt: 0.25
                          }} 
                        />
                      </Box>
                      
                      {/* Subsection items */}
                      {(section.items || []).map((subsection, subIndex) => (
                        <Box
                          key={subsection.id}
                          onClick={() => {
                            setSelectedSectionId(section.id)
                            setSelectedSubsectionId(subsection.id)
                          }}
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            pl: 5,
                            pr: 2,
                            py: 1.25,
                            cursor: 'pointer',
                            backgroundColor: selectedSubsectionId === subsection.id ? 'var(--color-background-secondary)' : 'transparent',
                            '&:hover': { backgroundColor: 'var(--color-background-secondary)' }
                          }}
                        >
                          <DragIndicator 
                            sx={{ 
                              color: 'var(--color-text-disabled)', 
                              fontSize: '16px',
                              mr: 1
                            }} 
                          />
                          <Typography 
                            variant="body2" 
                            sx={{ 
                              flex: 1,
                              color: 'var(--color-text-secondary)',
                              fontSize: '12px',
                              lineHeight: 1.4
                            }}
                          >
                            Sub section {sectionIndex + 1}.{subIndex + 1}: {subsection.title}
                          </Typography>
                          <ChevronRight 
                            sx={{ 
                              color: 'var(--color-text-secondary)', 
                              fontSize: '16px'
                            }} 
                          />
                        </Box>
                      ))}
                    </Box>
                  )
                })}
              </Box>
            )}
          </Box>

          {/* Right panel - Content area */}
          <Box sx={{ 
            flex: 1, 
            display: 'flex', 
            flexDirection: 'column',
            overflow: 'hidden',
            backgroundColor: 'var(--color-background-primary)'
          }}>
            {/* Section content */}
            <Box sx={{ flex: 1, p: 4, overflowY: 'auto' }}>
              {/* Section heading */}
              <Typography 
                variant="h4" 
                sx={{ 
                  fontWeight: 400,
                  color: 'var(--color-text-primary)',
                  fontSize: '1.75rem',
                  mb: 3,
                  letterSpacing: '-0.01em'
                }}
              >
                SECTION {currentSectionIndex + 1} — {currentSection?.title}
              </Typography>
              
              {/* Subsection heading */}
              <Typography 
                variant="h6" 
                sx={{ 
                  fontWeight: 400,
                  color: 'var(--color-text-primary)',
                  fontSize: '1.1rem',
                  mb: 4
                }}
              >
                {currentSectionIndex + 1}.{currentSubsectionIndex + 1} {currentSubsection?.title || 'Personal Details'}
              </Typography>
              
              {/* Medical Assessment Questions */}
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  {/* Question 1: Allergies */}
                  <Box>
                    <Typography 
                      sx={{ 
                        fontWeight: 500, 
                        color: 'var(--color-text-primary)', 
                        mb: 1.5,
                        fontSize: '0.95rem'
                      }}
                    >
                      1. Do you currently have any allergies?
                    </Typography>
                    <FormControl size="small" sx={{ minWidth: 200, mb: 2 }}>
                      <InputLabel>Select</InputLabel>
                      <Select
                        value={hasAllergies}
                        label="Select"
                        onChange={(e) => setHasAllergies(e.target.value)}
                        sx={{ backgroundColor: 'var(--color-background-primary)' }}
                      >
                        <MenuItem value="Yes">Yes</MenuItem>
                        <MenuItem value="No">No</MenuItem>
                      </Select>
                    </FormControl>
                    {hasAllergies === 'Yes' && (
                      <TextField
                        fullWidth
                        size="small"
                        label="Please specify your allergy"
                        value={allergyDetails}
                        onChange={(e) => setAllergyDetails(e.target.value)}
                        sx={{ mt: 1.5, backgroundColor: 'var(--color-background-primary)' }}
                      />
                    )}
                  </Box>

                  {/* Question 2: Injuries */}
                  <Box>
                    <Typography 
                      sx={{ 
                        fontWeight: 500, 
                        color: 'var(--color-text-primary)', 
                        mb: 1.5,
                        fontSize: '0.95rem'
                      }}
                    >
                      2. Have you sustained any injuries in the past 12 months?
                    </Typography>
                    <FormControl size="small" sx={{ minWidth: 300, mb: 2 }}>
                      <InputLabel>Select injuries</InputLabel>
                      <Select
                        multiple
                        value={injuries}
                        onChange={(e) => setInjuries(e.target.value)}
                        input={<OutlinedInput label="Select injuries" />}
                        renderValue={(selected) => selected.join(', ')}
                        sx={{ backgroundColor: 'var(--color-background-primary)' }}
                      >
                        {injuryOptions.map((option) => (
                          <MenuItem key={option} value={option}>
                            <Checkbox checked={injuries.indexOf(option) > -1} />
                            <ListItemText primary={option} />
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    {injuries.includes('Other') && (
                      <TextField
                        fullWidth
                        size="small"
                        label="Please describe other injury"
                        value={injuryOtherDetails}
                        onChange={(e) => setInjuryOtherDetails(e.target.value)}
                        sx={{ mt: 1.5, backgroundColor: 'var(--color-background-primary)' }}
                      />
                    )}
                  </Box>

                  {/* Question 3: Medications */}
                  <Box>
                    <Typography 
                      sx={{ 
                        fontWeight: 500, 
                        color: 'var(--color-text-primary)', 
                        mb: 1.5,
                        fontSize: '0.95rem'
                      }}
                    >
                      3. Are you currently taking any prescribed medication?
                    </Typography>
                    <TextField
                      fullWidth
                      size="small"
                      label="List medications (if any)"
                      value={medications}
                      onChange={(e) => setMedications(e.target.value)}
                      multiline
                      rows={2}
                      sx={{ backgroundColor: 'var(--color-background-primary)' }}
                    />
                  </Box>

                  {/* Question 4: Last Physical */}
                  <Box>
                    <Typography 
                      sx={{ 
                        fontWeight: 500, 
                        color: 'var(--color-text-primary)', 
                        mb: 1.5,
                        fontSize: '0.95rem'
                      }}
                    >
                      4. When was your last full physical examination?
                    </Typography>
                    <DatePicker
                      label="Select date"
                      value={lastPhysicalDate}
                      onChange={(newValue) => setLastPhysicalDate(newValue)}
                      slotProps={{ 
                        textField: { 
                          size: 'small',
                          sx: { backgroundColor: 'var(--color-background-primary)', minWidth: 250 }
                        } 
                      }}
                    />
                  </Box>

                  {/* Question 5: Pre-existing Conditions */}
                  <Box>
                    <Typography 
                      sx={{ 
                        fontWeight: 500, 
                        color: 'var(--color-text-primary)', 
                        mb: 1.5,
                        fontSize: '0.95rem'
                      }}
                    >
                      5. Do you have any pre-existing medical conditions?
                    </Typography>
                    <FormControl size="small" sx={{ minWidth: 300, mb: 2 }}>
                      <InputLabel>Select conditions</InputLabel>
                      <Select
                        multiple
                        value={preExistingConditions}
                        onChange={(e) => setPreExistingConditions(e.target.value)}
                        input={<OutlinedInput label="Select conditions" />}
                        renderValue={(selected) => selected.join(', ')}
                        sx={{ backgroundColor: 'var(--color-background-primary)' }}
                      >
                        {conditionOptions.map((option) => (
                          <MenuItem key={option} value={option}>
                            <Checkbox checked={preExistingConditions.indexOf(option) > -1} />
                            <ListItemText primary={option} />
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    {preExistingConditions.includes('Other') && (
                      <TextField
                        fullWidth
                        size="small"
                        label="Please describe other condition"
                        value={conditionOtherDetails}
                        onChange={(e) => setConditionOtherDetails(e.target.value)}
                        sx={{ mt: 1.5, backgroundColor: 'var(--color-background-primary)' }}
                      />
                    )}
                  </Box>
                </Box>
              </LocalizationProvider>
            </Box>
            
            {/* Bottom navigation buttons */}
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 1,
              px: 4,
              py: 2,
              borderTop: '1px solid var(--color-border-primary)'
            }}>
              <MuiButton
                variant="outlined"
                size="medium"
                startIcon={<KeyboardArrowLeft />}
                disabled={currentSectionIndex === 0 && currentSubsectionIndex === 0}
                sx={{
                  borderColor: 'var(--color-border-primary)',
                  color: 'var(--color-primary)',
                  textTransform: 'none',
                  fontWeight: 500,
                  '&:hover': { 
                    borderColor: 'var(--color-border-focus)',
                    backgroundColor: 'var(--color-primary-light)'
                  },
                  '&.Mui-disabled': {
                    borderColor: 'var(--color-border-primary)',
                    color: 'var(--color-text-muted)'
                  }
                }}
              >
                Back
              </MuiButton>
              <MuiButton
                variant="outlined"
                size="medium"
                endIcon={<KeyboardArrowRight />}
                sx={{
                  borderColor: 'var(--color-border-primary)',
                  color: 'var(--color-primary)',
                  textTransform: 'none',
                  fontWeight: 500,
                  '&:hover': { 
                    borderColor: 'var(--color-border-focus)',
                    backgroundColor: 'var(--color-primary-light)'
                  }
                }}
              >
                Next
              </MuiButton>
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Summary View Drawer - pushes content left */}
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          right: 0,
          width: '400px',
          height: '100vh',
          backgroundColor: 'var(--color-background-primary)',
          borderLeft: '1px solid var(--color-border-primary)',
          transform: isSummaryView ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 0.3s ease',
          zIndex: 1200,
          display: 'flex',
          flexDirection: 'column',
          boxShadow: isSummaryView ? '-4px 0 12px rgba(0,0,0,0.1)' : 'none'
        }}
      >
        {selectedSummaryItem ? (
          // Detail View
          <>
            {/* Detail Header */}
            <Box sx={{ px: 2, py: 1.5, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <IconButton
                size="small"
                onClick={() => setSelectedSummaryItem(null)}
                sx={{ color: 'var(--color-text-secondary)' }}
              >
                <ArrowBackOutlined fontSize="small" />
              </IconButton>
              <IconButton
                size="small"
                onClick={() => { setIsSummaryView(false); setSelectedSummaryItem(null); }}
                sx={{ color: 'var(--color-text-secondary)' }}
              >
                <Close fontSize="small" />
              </IconButton>
            </Box>

            {/* Title with AI Generated chip */}
            <Box sx={{ px: 3, pb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, mb: 0.5 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, color: 'var(--color-text-primary)', flex: 1 }}>
                  {selectedSummaryItem.title}
                </Typography>
                <Chip
                  size="small"
                  icon={<DiamondOutlined sx={{ fontSize: '14px !important' }} />}
                  label="AI Generated"
                  sx={{
                    height: '24px',
                    backgroundColor: 'var(--color-background-secondary)',
                    color: 'var(--color-text-secondary)',
                    fontSize: '11px',
                    '& .MuiChip-icon': { color: 'var(--color-text-secondary)' }
                  }}
                />
              </Box>
              <Typography variant="caption" sx={{ color: 'var(--color-text-secondary)' }}>
                {selectedSummaryItem.date}
              </Typography>
            </Box>

            <Divider />

            {/* Player selector - locked */}
            <Box sx={{ px: 3, py: 2 }}>
              <TextField
                size="small"
                variant="filled"
                value={athleteName}
                disabled
                fullWidth
                sx={{
                  '& .MuiFilledInput-root': {
                    backgroundColor: 'var(--color-background-secondary)',
                  }
                }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <Lock fontSize="small" sx={{ color: 'var(--color-text-disabled)' }} />
                    </InputAdornment>
                  )
                }}
              />
            </Box>

            {/* Summary Content */}
            <Box sx={{ flex: 1, overflowY: 'auto', px: 3, pb: 3 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, color: 'var(--color-text-primary)', mb: 2 }}>
                Athlete Medical Summary
              </Typography>

              {/* Concussion History */}
              <Box sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <InfoOutlined fontSize="small" sx={{ color: 'var(--color-text-secondary)' }} />
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, color: 'var(--color-text-primary)' }}>
                    Concussion History
                  </Typography>
                </Box>
                <Typography variant="body2" sx={{ color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
                  Significant history of concussion. Sustained a concussion in high school (2012) resulting in loss of consciousness and hospitalization. Recent hospitalization for concussion on March 11, 2025.
                </Typography>
              </Box>

              {/* Musculoskeletal History */}
              <Box sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <InfoOutlined fontSize="small" sx={{ color: 'var(--color-text-secondary)' }} />
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, color: 'var(--color-text-primary)' }}>
                    Musculoskeletal History
                  </Typography>
                </Box>
                <Typography variant="body2" sx={{ color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
                  Right ACL reconstruction surgery performed in August 2023. Completed full rehabilitation program with return to play clearance in February 2024. Chronic left ankle instability noted with history of multiple sprains.
                </Typography>
              </Box>

              {/* Vaccination Status */}
              <Box sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <InfoOutlined fontSize="small" sx={{ color: 'var(--color-text-secondary)' }} />
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, color: 'var(--color-text-primary)' }}>
                    Vaccination Status
                  </Typography>
                </Box>
                <Typography variant="body2" sx={{ color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
                  Incomplete vaccination history. Mumps: Unknown. Pneumonia: Not administered. Tetanus: No record found. Recommend follow-up with team physician to verify and update immunization records.
                </Typography>
              </Box>

              {/* Cardiac Screening */}
              <Box sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <InfoOutlined fontSize="small" sx={{ color: 'var(--color-text-secondary)' }} />
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, color: 'var(--color-text-primary)' }}>
                    Cardiac Screening
                  </Typography>
                </Box>
                <Typography variant="body2" sx={{ color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
                  ECG performed January 2025 showed normal sinus rhythm. Echocardiogram results within normal limits. No family history of sudden cardiac events. Cleared for full athletic participation.
                </Typography>
              </Box>

              {/* Allergy & Medication */}
              <Box sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <InfoOutlined fontSize="small" sx={{ color: 'var(--color-text-secondary)' }} />
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, color: 'var(--color-text-primary)' }}>
                    Allergy & Medication
                  </Typography>
                </Box>
                <Typography variant="body2" sx={{ color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
                  Known allergy to Penicillin (rash reaction). Currently taking daily multivitamin and Vitamin D supplementation. No NSAIDs restrictions. Emergency epinephrine not required.
                </Typography>
              </Box>

              {/* Mental Health Notes */}
              <Box sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <InfoOutlined fontSize="small" sx={{ color: 'var(--color-text-secondary)' }} />
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, color: 'var(--color-text-primary)' }}>
                    Mental Health Notes
                  </Typography>
                </Box>
                <Typography variant="body2" sx={{ color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
                  Completed mental wellness assessment in September 2025. Reported mild performance anxiety during high-stakes competitions. Referred to sports psychologist for optional support sessions. No clinical concerns identified.
                </Typography>
              </Box>
            </Box>
          </>
        ) : (
          // List View
          <>
            {/* Drawer Header */}
            <Box sx={{ px: 3, py: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Typography variant="h6" sx={{ fontWeight: 600, color: 'var(--color-text-primary)' }}>
                Form Summaries
              </Typography>
              <IconButton
                size="small"
                onClick={() => setIsSummaryView(false)}
                sx={{ color: 'var(--color-text-secondary)' }}
              >
                <Close fontSize="small" />
              </IconButton>
            </Box>

            {/* Selectors Row */}
            <Box sx={{ px: 3, pb: 2, display: 'flex', gap: 1.5 }}>
              {/* Player selector - locked */}
              <TextField
                size="small"
                variant="filled"
                value={athleteName}
                disabled
                sx={{ 
                  flex: 1,
                  '& .MuiFilledInput-root': {
                    backgroundColor: 'var(--color-background-secondary)',
                  }
                }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <Lock fontSize="small" sx={{ color: 'var(--color-text-disabled)' }} />
                    </InputAdornment>
                  )
                }}
              />
              {/* Template selector */}
              <Autocomplete
                size="small"
                options={['Medical Assessment', 'Nutritional Assessment', 'Performance Review', 'Mental Health Evaluation', 'End of Season Audit']}
                sx={{ flex: 1 }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant="filled"
                    placeholder="Search templates"
                    InputProps={{
                      ...params.InputProps,
                      startAdornment: (
                        <InputAdornment position="start">
                          <Search fontSize="small" sx={{ color: 'var(--color-text-secondary)' }} />
                        </InputAdornment>
                      )
                    }}
                  />
                )}
              />
            </Box>

            <Divider />

            {/* Recent Section */}
            <Box sx={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
              <Box sx={{ px: 3, pt: 2, pb: 1 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, color: 'var(--color-text-primary)' }}>
                  Recent
                </Typography>
              </Box>

              {/* Recent Form Summaries List */}
              <Box sx={{ flex: 1 }}>
                {recentSummaries.map((item, index) => (
                  <Box
                    key={index}
                    onClick={() => setSelectedSummaryItem(item)}
                    sx={{
                      px: 3,
                      py: 1.5,
                      display: 'flex',
                      alignItems: 'center',
                      cursor: 'pointer',
                      '&:hover': { backgroundColor: 'var(--color-background-secondary)' },
                      borderBottom: '1px solid var(--color-border-secondary)'
                    }}
                  >
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="body2" sx={{ fontWeight: 500, color: 'var(--color-text-primary)', mb: 0.25 }}>
                        {item.title}
                      </Typography>
                      <Typography variant="caption" sx={{ color: 'var(--color-text-secondary)' }}>
                        {item.date}
                      </Typography>
                    </Box>
                    <ChevronRight fontSize="small" sx={{ color: 'var(--color-text-secondary)' }} />
                  </Box>
                ))}
              </Box>
            </Box>

            {/* Bottom Show More Button */}
            <Box sx={{ p: 3, borderTop: '1px solid var(--color-border-primary)' }}>
              <MuiButton
                fullWidth
                variant="contained"
                disableElevation
                sx={{
                  backgroundColor: 'var(--button-secondary-bg)',
                  color: 'var(--button-secondary-color)',
                  textTransform: 'none',
                  '&:hover': { backgroundColor: 'var(--button-secondary-hover-bg)' }
                }}
              >
                Show More
              </MuiButton>
            </Box>
          </>
        )}
      </Box>
    </Box>
  )
}
