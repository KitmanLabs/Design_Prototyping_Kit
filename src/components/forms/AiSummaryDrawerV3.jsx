import React, { useState, useMemo, useEffect, useCallback, useRef } from 'react'
import PropTypes from 'prop-types'
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  Divider,
  TextField,
  Stack,
  Chip,
  Avatar,
  Checkbox,
  Collapse,
  InputAdornment,
  CircularProgress,
  Switch,
  ToggleButton,
  ToggleButtonGroup,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  LinearProgress,
  Tooltip,
  Alert,
  Link,
  Button as MuiButton,
  Snackbar,
  Radio,
  RadioGroup,
  useMediaQuery,
} from '@mui/material'
import { useTheme } from '@mui/material/styles'
import {
  CloseOutlined,
  SearchOutlined,
  KeyboardArrowDownOutlined,
  KeyboardArrowRightOutlined,
  AutoAwesomeOutlined,
  CheckCircleOutlined,
  ContentCopyOutlined,
  RefreshOutlined,
  SyncOutlined,
  ArrowBackOutlined,
  CheckOutlined,
  ExpandLessOutlined,
  ExpandMoreOutlined,
  ArrowDropDownOutlined,
  InfoOutlined,
  WarningAmberOutlined,
  ScheduleOutlined,
  ThumbUpOutlined,
  ThumbDownOutlined,
  ThumbUp,
  ThumbDown,
} from '@mui/icons-material'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { DateRangePicker } from '@mui/x-date-pickers-pro'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { TimePicker } from '@mui/x-date-pickers/TimePicker'
import dayjs from 'dayjs'
import { Button } from '../../components'
import { currentUser } from '../../data/layout'
import {
  rosterGroups,
  allPlayers,
  searchPlayers,
  selectorAthletes,
  selectorTeams,
  getPlayerById,
  formGroups,
  getFormById,
  getSelectorFormById,
  getPlayersForForm,
  getFormsForPlayers,
  selectorForms,
  formCategories,
  dateRangePresets,
  generateMockSummary,
} from '../../data/aiFormSummary'
import '../../styles/design-tokens.css'

// Demo flag — set to false to hide the in-drawer demo hint line.
const DEMO_MODE = true

// V3-only player roster: exactly 12 players (ids reuse the shared dataset so the
// player↔form associations keep working). "Select all" therefore selects 12.
//   Active Roster (6) · Practice Squad (4) · Inactive Roster (2)
const SELECTOR_PLAYERS_V3 = [
  // Active Roster (6)
  { id: 'sa-6', name: 'Harry Anderson', nationality: 'USA', team: 'First Team', group: 'Active Roster' },
  { id: 'sa-7', name: 'Bill Bryson', nationality: 'GBR', team: 'First Team', group: 'Active Roster' },
  { id: 'sa-8', name: 'Bernard William', nationality: 'USA', team: 'First Team', group: 'Active Roster' },
  { id: 'sa-9', name: 'Eric Xavier', nationality: 'BRA', team: 'First Team', group: 'Active Roster' },
  { id: 'sa-10', name: 'Marcus Johnson', nationality: 'USA', team: 'First Team', group: 'Active Roster' },
  { id: 'sa-11', name: 'Jordan Peters', nationality: 'CAN', team: 'First Team', group: 'Active Roster' },
  // Practice Squad (4)
  { id: 'sa-12', name: 'Darius Webb', nationality: 'USA', team: 'Reserve Team', group: 'Practice Squad' },
  { id: 'sa-13', name: 'Kofi Mensah', nationality: 'GHA', team: 'Reserve Team', group: 'Practice Squad' },
  { id: 'sa-14', name: 'Luca Rossi', nationality: 'ITA', team: 'Reserve Team', group: 'Practice Squad' },
  { id: 'sa-15', name: 'Ahmed Hassan', nationality: 'EGY', team: 'Reserve Team', group: 'Practice Squad' },
  // Inactive Roster (2)
  { id: 'sa-16', name: "Ryan O'Brien", nationality: 'IRL', team: 'Reserve Team', group: 'Inactive Roster' },
  { id: 'sa-3', name: 'Thiago Almada', nationality: 'ARG', team: 'Reserve Team', group: 'Inactive Roster' },
]

const fieldStyles = {
  '& .MuiFilledInput-root': {
    backgroundColor: 'var(--color-background-secondary)',
    borderRadius: 'var(--radius-sm)',
    '&:hover': { backgroundColor: 'var(--color-background-tertiary)' },
    '&.Mui-focused': { backgroundColor: 'var(--color-background-primary)' },
    '&:before': { borderBottom: '1px solid var(--color-border-primary)' },
    '&:hover:not(.Mui-disabled):before': { borderBottom: '1px solid var(--color-border-focus)' },
    '&.Mui-focused:after': { borderBottom: '2px solid var(--color-border-focus)' },
  },
  '& .MuiInputBase-input': {
    color: 'var(--color-text-primary)',
    fontSize: 'var(--font-size-sm)',
    fontFamily: 'var(--font-family-primary)',
  },
}

const labelSx = {
  fontFamily: 'var(--font-family-primary)',
  fontSize: 'var(--font-size-sm)',
  fontWeight: 'var(--font-weight-medium)',
  color: 'var(--color-text-primary)',
}

const mutedSx = {
  fontFamily: 'var(--font-family-primary)',
  fontSize: 'var(--font-size-xs)',
  color: 'var(--color-text-secondary)',
}

// Suggested-action links under the summary-size alerts (inherit the alert colour).
const suggestionLinkSx = {
  fontFamily: 'var(--font-family-primary)',
  fontSize: '12px',
  fontWeight: 600,
  color: 'inherit',
  textDecoration: 'underline',
  cursor: 'pointer',
}

const checkboxSx = {
  color: 'var(--color-text-secondary)',
  '&.Mui-checked': { color: 'var(--color-primary)' },
}

const bulletSx = {
  fontFamily: 'var(--font-family-primary)',
  fontSize: 'var(--font-size-sm)',
  color: 'var(--color-text-primary)',
  lineHeight: 1.6,
  mb: 0.5,
}

const navyBtnSx = {
  textTransform: 'none',
  fontFamily: 'var(--font-family-primary)',
  bgcolor: 'var(--color-primary)',
  color: 'var(--color-white)',
  '&:hover': { bgcolor: 'var(--color-primary-hover)' },
  '&.Mui-disabled': {
    bgcolor: 'var(--color-border-primary)',
    color: 'var(--color-text-secondary)',
  },
}

// Outlined-look + text-look styles applied to contained buttons so the
// design-system lint rule (contained-only) is satisfied while matching the spec.
const greyOutlinedBtnSx = {
  textTransform: 'none',
  fontFamily: 'var(--font-family-primary)',
  color: 'var(--color-text-secondary)',
  backgroundColor: 'transparent',
  border: '1px solid var(--color-border-primary)',
  boxShadow: 'none',
  '&:hover': {
    borderColor: 'var(--color-text-secondary)',
    backgroundColor: 'transparent',
    boxShadow: 'none',
  },
}

const textBtnSx = {
  textTransform: 'none',
  fontFamily: 'var(--font-family-primary)',
  color: 'var(--color-text-secondary)',
  backgroundColor: 'transparent',
  boxShadow: 'none',
  '&:hover': { backgroundColor: 'transparent', boxShadow: 'none' },
}

// Filled secondary (grey) — used by "Add schedule".
const greySecondaryBtnSx = {
  textTransform: 'none',
  fontFamily: 'var(--font-family-primary)',
  backgroundColor: 'var(--color-border-primary)',
  color: 'var(--color-text-primary)',
  boxShadow: 'none',
  '&:hover': { backgroundColor: 'var(--color-text-disabled)', boxShadow: 'none' },
}

const headerTitleSx = {
  fontWeight: 600,
  fontFamily: 'var(--font-family-primary)',
  fontSize: 'var(--font-size-lg)',
  color: 'var(--color-text-primary)',
}

const headerMoreChipSx = {
  height: 20,
  fontFamily: 'var(--font-family-primary)',
  fontSize: '11px',
  fontWeight: 600,
  bgcolor: 'var(--color-background-secondary)',
  color: 'var(--color-text-secondary)',
  cursor: 'default',
  '& .MuiChip-label': { px: '8px' },
}

const segmentSx = {
  width: '100%',
  '& .MuiToggleButton-root': {
    flex: 1,
    textTransform: 'none',
    fontFamily: 'var(--font-family-primary)',
    fontSize: 'var(--font-size-sm)',
    fontWeight: 'var(--font-weight-medium)',
    color: 'var(--color-text-secondary)',
    borderColor: 'var(--color-border-primary)',
    '&.Mui-selected': {
      backgroundColor: 'var(--color-primary)',
      color: 'var(--color-white)',
      '&:hover': { backgroundColor: 'var(--color-primary-hover)' },
    },
  },
}

// Pill toggle used by the Notifications section (Email / SMS / Push).
function PillToggle({ label, selected, onClick }) {
  return (
    <Box
      onClick={onClick}
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 0.5,
        minWidth: 80,
        height: 34,
        px: 1.5,
        borderRadius: 999,
        cursor: 'pointer',
        fontFamily: 'var(--font-family-primary)',
        fontSize: 'var(--font-size-sm)',
        fontWeight: 'var(--font-weight-medium)',
        bgcolor: selected ? 'var(--color-primary)' : 'var(--color-background-secondary)',
        color: selected ? 'var(--color-white)' : 'var(--color-text-secondary)',
        '&:hover': {
          bgcolor: selected ? 'var(--color-primary-hover)' : 'var(--color-background-tertiary)',
        },
      }}
    >
      {selected && <CheckOutlined sx={{ fontSize: 16 }} />}
      {label}
    </Box>
  )
}

PillToggle.propTypes = {
  label: PropTypes.string,
  selected: PropTypes.bool,
  onClick: PropTypes.func,
}

// Compact day-of-week pill used by the Weekly recurrence option.
function DayPill({ label, selected, onClick }) {
  return (
    <Box
      onClick={onClick}
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        minWidth: 42,
        height: 32,
        px: 1,
        borderRadius: 999,
        cursor: 'pointer',
        fontFamily: 'var(--font-family-primary)',
        fontSize: 'var(--font-size-xs)',
        fontWeight: 'var(--font-weight-medium)',
        bgcolor: selected ? 'var(--color-primary)' : 'var(--color-background-secondary)',
        color: selected ? 'var(--color-white)' : 'var(--color-text-secondary)',
        '&:hover': {
          bgcolor: selected ? 'var(--color-primary-hover)' : 'var(--color-background-tertiary)',
        },
      }}
    >
      {label}
    </Box>
  )
}

DayPill.propTypes = {
  label: PropTypes.string,
  selected: PropTypes.bool,
  onClick: PropTypes.func,
}

function StepHeader({ index, title, complete, active, summary, onClick }) {
  return (
    <Box
      onClick={onClick}
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1.5,
        px: 2,
        py: 1.5,
        cursor: 'pointer',
      }}
    >
      <Box
        sx={{
          width: 24,
          height: 24,
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          fontSize: 'var(--font-size-xs)',
          fontWeight: 600,
          fontFamily: 'var(--font-family-primary)',
          bgcolor: complete || active ? 'var(--color-primary)' : 'var(--color-background-tertiary)',
          color: complete || active ? 'var(--color-white)' : 'var(--color-text-secondary)',
        }}
      >
        {complete ? <CheckCircleOutlined sx={{ fontSize: 16 }} /> : index}
      </Box>
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography sx={labelSx}>{title}</Typography>
        {!active && summary && (
          <Typography sx={{ ...mutedSx, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {summary}
          </Typography>
        )}
      </Box>
      {active ? (
        <KeyboardArrowDownOutlined fontSize="small" sx={{ color: 'var(--color-text-secondary)' }} />
      ) : (
        <KeyboardArrowRightOutlined fontSize="small" sx={{ color: 'var(--color-text-secondary)' }} />
      )}
    </Box>
  )
}

StepHeader.propTypes = {
  index: PropTypes.number,
  title: PropTypes.string,
  complete: PropTypes.bool,
  active: PropTypes.bool,
  summary: PropTypes.string,
  onClick: PropTypes.func,
}

function AiSummaryDrawer({ open, onClose, initialSummary = false }) {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

  const [activeStep, setActiveStep] = useState(1)

  // Step 1 — players
  const [playerSearch, setPlayerSearch] = useState('')
  const [selectedPlayers, setSelectedPlayers] = useState(new Set())
  const [expandedGroups, setExpandedGroups] = useState(new Set())
  const [autoSyncGroups, setAutoSyncGroups] = useState(
    new Set(rosterGroups.filter((g) => g.autoSync).map((g) => g.id))
  )
  const [teamFilter, setTeamFilter] = useState('All teams')
  const [sortOrder, setSortOrder] = useState('az')
  const [athleteListOpen, setAthleteListOpen] = useState(true)
  const [selectorOpen, setSelectorOpen] = useState(false)

  // Step 2 — forms
  const [formSearch, setFormSearch] = useState('')
  const [selectedForms, setSelectedForms] = useState(new Set())
  const [expandedFormCats, setExpandedFormCats] = useState(new Set())
  const [formCategory, setFormCategory] = useState('All categories')
  const [formSort, setFormSort] = useState('az')

  // Step 3 — date range
  const [datePreset, setDatePreset] = useState(null)
  const [customRange, setCustomRange] = useState([null, null])

  // Result
  const [generating, setGenerating] = useState(false)
  const [summary, setSummary] = useState(null)
  const [copied, setCopied] = useState(false)

  // V3 ADDITION — summary title
  const [summaryTitleValue, setSummaryTitleValue] = useState('')
  const summaryTitleDefaultRef = useRef('')

  // V3 ADDITION — feedback on the generated summary
  const [feedbackType, setFeedbackType] = useState(null) // submitted selection: 'up' | 'down' | null
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false)
  const [feedbackModal, setFeedbackModal] = useState(null) // open modal: 'up' | 'down' | null
  const [feedbackText, setFeedbackText] = useState('')
  const [copySnackbar, setCopySnackbar] = useState(false)
  const [thanksSnackbar, setThanksSnackbar] = useState(false)

  // Schedule section
  const [repeatEnabled, setRepeatEnabled] = useState(false)
  const [schedTitle, setSchedTitle] = useState('')
  const [schedStart, setSchedStart] = useState(null)
  const [schedEnd, setSchedEnd] = useState(null)
  const [schedStartTime, setSchedStartTime] = useState(null)
  const [responsesPerPlayer, setResponsesPerPlayer] = useState(1)
  const [recurrence, setRecurrence] = useState('none')
  const [recurrenceOpen, setRecurrenceOpen] = useState(false)
  const [weeklyDays, setWeeklyDays] = useState(new Set())
  const [customInterval, setCustomInterval] = useState(1)
  const [customUnit, setCustomUnit] = useState('days')

  // Notifications section
  const [notifyChannels, setNotifyChannels] = useState(new Set())

  // Scheduled confirmation / banner
  const [scheduled, setScheduled] = useState(false)
  const [scheduleBannerDismissed, setScheduleBannerDismissed] = useState(false)

  const resetAll = useCallback(() => {
    setActiveStep(1)
    setPlayerSearch('')
    setSelectedPlayers(new Set())
    setExpandedGroups(new Set())
    setAutoSyncGroups(new Set(rosterGroups.filter((g) => g.autoSync).map((g) => g.id)))
    setTeamFilter('All teams')
    setSortOrder('az')
    setAthleteListOpen(true)
    setSelectorOpen(false)
    setFormSearch('')
    setSelectedForms(new Set())
    setExpandedFormCats(new Set())
    setFormCategory('All categories')
    setFormSort('az')
    setDatePreset(null)
    setCustomRange([null, null])
    setGenerating(false)
    setSummary(null)
    setCopied(false)
    setSummaryTitleValue('')
    summaryTitleDefaultRef.current = ''
    setFeedbackType(null)
    setFeedbackSubmitted(false)
    setFeedbackModal(null)
    setFeedbackText('')
    setRepeatEnabled(false)
    setSchedTitle('')
    setSchedStart(null)
    setSchedEnd(null)
    setSchedStartTime(null)
    setResponsesPerPlayer(1)
    setRecurrence('none')
    setRecurrenceOpen(false)
    setWeeklyDays(new Set())
    setCustomInterval(1)
    setCustomUnit('days')
    setNotifyChannels(new Set())
    setScheduled(false)
    setScheduleBannerDismissed(false)
  }, [])

  useEffect(() => {
    if (open) {
      resetAll()
      if (initialSummary) {
        setSummary(true)
        const fallback = 'Medical Assessment — 22 players — Last 30 days'
        setSummaryTitleValue(fallback)
        summaryTitleDefaultRef.current = fallback
      }
    }
  }, [open, resetAll, initialSummary])

  // ——— Step 1 helpers ———
  const filteredPlayers = useMemo(() => searchPlayers(playerSearch), [playerSearch])
  const isSearchingPlayers = playerSearch.trim().length > 0

  const togglePlayer = (id) => {
    setSelectedPlayers((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  // Athlete selector panel — filtered + sorted list
  const visibleAthletes = useMemo(() => {
    const q = playerSearch.trim().toLowerCase()
    const surname = (n) => n.trim().split(' ').slice(-1)[0].toLowerCase()
    const list = SELECTOR_PLAYERS_V3.filter((a) => {
      const matchesSearch = !q || a.name.toLowerCase().includes(q)
      const matchesTeam = teamFilter === 'All teams' || a.team === teamFilter
      return matchesSearch && matchesTeam
    })
    list.sort((a, b) => surname(a.name).localeCompare(surname(b.name)))
    if (sortOrder === 'za') list.reverse()
    return list
  }, [playerSearch, teamFilter, sortOrder])

  const allVisibleSelected =
    visibleAthletes.length > 0 && visibleAthletes.every((a) => selectedPlayers.has(a.id))
  const someVisibleSelected = visibleAthletes.some((a) => selectedPlayers.has(a.id))

  const toggleSelectAllVisible = () => {
    setSelectedPlayers((prev) => {
      const next = new Set(prev)
      if (allVisibleSelected) visibleAthletes.forEach((a) => next.delete(a.id))
      else visibleAthletes.forEach((a) => next.add(a.id))
      return next
    })
  }

  const toggleGroupExpand = (id) => {
    setExpandedGroups((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  const toggleGroupSelectAll = (group) => {
    const allSelected = group.playerIds.every((id) => selectedPlayers.has(id))
    setSelectedPlayers((prev) => {
      const next = new Set(prev)
      group.playerIds.forEach((id) => (allSelected ? next.delete(id) : next.add(id)))
      return next
    })
  }

  // ——— Step 2 helpers ———
  // Single-select (radio): selecting a form replaces any previous selection.
  const toggleForm = (id) => {
    setSelectedForms(new Set([id]))
  }

  const toggleFormCat = (cat) => {
    setExpandedFormCats((prev) => {
      const next = new Set(prev)
      next.has(cat) ? next.delete(cat) : next.add(cat)
      return next
    })
  }

  // Flat form list: only forms associated with selected players, then
  // search + category filters, then A–Z / Z–A sort. Updates live.
  const visibleForms = useMemo(() => {
    const q = formSearch.trim().toLowerCase()
    let list = getFormsForPlayers([...selectedPlayers])
    if (q) list = list.filter((f) => f.name.toLowerCase().includes(q))
    if (formCategory !== 'All categories') list = list.filter((f) => f.category === formCategory)
    list = [...list].sort((a, b) => a.name.localeCompare(b.name))
    if (formSort === 'za') list.reverse()
    return list
  }, [formSearch, formCategory, formSort, selectedPlayers])

  // ——— step completion ———
  const step1Complete = selectedPlayers.size > 0
  const step2Complete = selectedForms.size > 0
  const dateLabel = useMemo(() => {
    if (datePreset && datePreset !== 'custom') {
      return dateRangePresets.find((p) => p.id === datePreset)?.label || ''
    }
    if (datePreset === 'custom' && customRange[0] && customRange[1]) {
      return `${customRange[0].format('D MMM YYYY')} – ${customRange[1].format('D MMM YYYY')}`
    }
    return ''
  }, [datePreset, customRange])
  const step3Complete = dateLabel.length > 0
  const canGenerate = step1Complete && step2Complete && step3Complete

  // ——— Summary size indicator (recalibrated for demo: player count is the
  //     primary driver — 8–11 players ≈ warning, 12 players = limit reached) ———
  const DATE_SCORE = { today: 1, 'last-7': 2, 'last-30': 3, 'last-6m': 4, 'last-2y': 5 }
  const summaryUsage = useMemo(() => {
    const playerScore = selectedPlayers.size * 8
    let dateScore = 0
    if (datePreset === 'custom') {
      dateScore = customRange[0] && customRange[1] ? 3 : 0 // Custom = 3 (default)
    } else if (datePreset) {
      dateScore = DATE_SCORE[datePreset] || 0
    }
    const formScore = selectedForms.size > 0 ? 2 : 0
    const total = playerScore + dateScore + formScore
    return Math.min(Math.round(total), 100)
  }, [selectedPlayers, datePreset, customRange, selectedForms])

  const hasAnySelection =
    selectedPlayers.size > 0 || selectedForms.size > 0 || !!datePreset
  const limitReached = summaryUsage >= 100
  const limitWarning = summaryUsage >= 70 && summaryUsage < 100
  const usageColor = limitReached ? '#d32f2f' : limitWarning ? '#f59e0b' : '#2e7d32'

  // ——— summaries for collapsed step headers ———
  const step1Summary = useMemo(() => {
    if (selectedPlayers.size === 0) return ''
    const names = [...selectedPlayers].map((id) => getPlayerById(id)?.name).filter(Boolean)
    return selectedPlayers.size === 1 ? names[0] : `${selectedPlayers.size} players selected`
  }, [selectedPlayers])

  const step2Summary = useMemo(() => {
    if (selectedForms.size === 0) return ''
    const names = [...selectedForms].map((id) => getFormById(id)?.name).filter(Boolean)
    return selectedForms.size === 1 ? names[0] : `${selectedForms.size} forms selected`
  }, [selectedForms])

  const goToStep = (step, requireComplete) => {
    if (requireComplete) setActiveStep(step)
  }

  const buildAutoTitle = useCallback(() => {
    const formName = selectedForms.size > 0
      ? (getSelectorFormById([...selectedForms][0])?.name || 'Summary')
      : 'Summary'
    const playerCount = selectedPlayers.size
    const dateStr =
      datePreset === 'today' ? 'Today'
      : datePreset === 'last-7' ? 'Last 7 days'
      : datePreset === 'last-30' ? 'Last 30 days'
      : datePreset === 'last-6m' ? 'Last 6 months'
      : datePreset === 'last-2y' ? 'Last 2 years'
      : datePreset === 'custom' ? 'Custom range'
      : 'All dates'
    return `${formName} — ${playerCount} player${playerCount !== 1 ? 's' : ''} — ${dateStr}`
  }, [selectedForms, selectedPlayers, datePreset])

  const handleGenerate = () => {
    setGenerating(true)
    setSummary(null)
    setSummaryTitleValue('')
    summaryTitleDefaultRef.current = ''
    // Reset any feedback from a previous summary
    setFeedbackType(null)
    setFeedbackSubmitted(false)
    setFeedbackModal(null)
    setFeedbackText('')
    // Simulate a longer async AI synthesis (5–10s)
    const delay = 5000 + Math.random() * 5000
    setTimeout(() => {
      setSummary(true)
      setGenerating(false)
      const autoTitle = buildAutoTitle()
      setSummaryTitleValue(autoTitle)
      summaryTitleDefaultRef.current = autoTitle
    }, delay)
  }

  const handleCopySummary = () => {
    // Full text of the generated summary currently displayed
    const text = [
      'Player response summary',
      '22 players · 2 forms · Last 30 days',
      '',
      'Athlete Medical Summary',
      'Concussion History: Significant history of concussion. Sustained a concussion in high school (2012) resulting in loss of consciousness and hospitalization for concussion on March 11, 2025.',
      'Musculoskeletal History: Right Low Back: History of imaging (X-ray, MRI, CT, or bone scan) performed on December 24, 2024 for chronic issues.',
      'Vaccination Status: Incomplete vaccination history — Mumps: Unknown, Pneumonia: Tetanus: No',
      '',
      'Recommendations',
      'Immediate Actions',
      '• Player should be immediately held from all contact and throwing activities.',
      '• Urgent comprehensive orthopedic evaluation of the right shoulder is required.',
      '• Urgent comprehensive neurological evaluation including a detailed concussion assessment is required.',
      'Diagnostic Next Steps',
      '• Obtain an MRI of the right shoulder to assess rotator cuff integrity and extent of injury.',
      '• Conduct a full neuropsychological assessment (e.g. ImPACT testing) and a thorough neurological examination.',
      '• Review medical records from the March 11, 2025 concussion hospitalization.',
    ].join('\n')
    if (navigator?.clipboard) {
      navigator.clipboard.writeText(text).catch(() => {})
    }
    setCopySnackbar(true)
  }

  const openFeedbackModal = (type) => {
    if (feedbackSubmitted && type === feedbackType) return
    if (feedbackModal === type) return
    setFeedbackText('')
    setFeedbackModal(type)
    if (feedbackSubmitted) {
      setFeedbackSubmitted(false)
      setFeedbackType(null)
    }
  }

  const closeFeedbackModal = () => {
    setFeedbackType(feedbackModal)
    setFeedbackSubmitted(true)
    setFeedbackModal(null)
    setFeedbackText('')
    setThanksSnackbar(true)
  }

  const submitFeedback = () => {
    setFeedbackType(feedbackModal)
    setFeedbackSubmitted(true)
    setFeedbackModal(null)
    setFeedbackText('')
    setThanksSnackbar(true)
  }

  const handleCopy = () => {
    if (!summary) return
    const text = [
      summary.title,
      summary.subtitle,
      '',
      ...summary.sections.flatMap((s) => [
        s.heading,
        ...(s.body ? [s.body] : []),
        ...(s.bullets ? s.bullets.map((b) => `• ${b}`) : []),
        '',
      ]),
    ].join('\n')
    if (navigator?.clipboard) {
      navigator.clipboard.writeText(text).then(() => {
        setCopied(true)
        setTimeout(() => setCopied(false), 1800)
      })
    }
  }

  const toggleNotifyChannel = (channel) => {
    setNotifyChannels((prev) => {
      const next = new Set(prev)
      next.has(channel) ? next.delete(channel) : next.add(channel)
      return next
    })
  }

  const toggleWeeklyDay = (day) => {
    setWeeklyDays((prev) => {
      const next = new Set(prev)
      next.has(day) ? next.delete(day) : next.add(day)
      return next
    })
  }

  const firstRunDate = schedStart ? schedStart.format('MMM D, YYYY') : 'today'
  const firstRunTime = schedStartTime ? schedStartTime.format('h:mm A') : '9:00 AM'
  const recurrenceDayName = schedStart ? schedStart.format('dddd') : 'Monday'

  const handleSchedule = () => {
    setScheduled(true)
  }

  // Quick-range chip → auto-populate the MUI date range picker
  const applyPreset = (presetId) => {
    setDatePreset(presetId)
    if (presetId === 'custom') return
    const end = dayjs()
    let start = end
    if (presetId === 'last-7') start = end.subtract(7, 'day')
    else if (presetId === 'last-30') start = end.subtract(30, 'day')
    else if (presetId === 'last-6m') start = end.subtract(6, 'month')
    else if (presetId === 'last-2y') start = end.subtract(2, 'year')
    setCustomRange([start, end])
  }

  const drawerTitle = summary || generating ? 'Player response summary' : 'Create AI summary'

  // Dynamic, prescriptive header for the generated summary (CHANGE 5)
  const summaryFormNames = [...selectedForms].map((id) => getSelectorFormById(id)?.name).filter(Boolean)
  const summaryPlayerNames = [...selectedPlayers].map((id) => getPlayerById(id)?.name).filter(Boolean)

  const renderTooltipList = (names) => (
    <Box sx={{ py: 0.25 }}>
      {names.map((n, i) => (
        <Box key={i} sx={{ whiteSpace: 'nowrap' }}>{n}</Box>
      ))}
    </Box>
  )

  const renderHeaderTitle = () => {
    if (!(summary && !generating)) {
      return <Typography sx={{ flex: 1, ...headerTitleSx }}>{drawerTitle}</Typography>
    }
    if (summaryFormNames.length === 0 && summaryPlayerNames.length === 0) {
      return <Typography sx={{ flex: 1, ...headerTitleSx }}>Player response summary</Typography>
    }
    const fFirst = summaryFormNames.slice(0, 2)
    const fRest = summaryFormNames.slice(2)
    const pFirst = summaryPlayerNames.slice(0, 2)
    const pRest = summaryPlayerNames.slice(2)
    return (
      <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 0.5, minWidth: 0 }}>
        <Typography component="span" sx={headerTitleSx}>
          Summary of {fFirst.join(', ')}
        </Typography>
        {fRest.length > 0 && (
          <Tooltip title={renderTooltipList(fRest)} arrow>
            <Chip size="small" label={`+${fRest.length} more`} sx={headerMoreChipSx} />
          </Tooltip>
        )}
        {summaryPlayerNames.length > 0 && (
          <Typography component="span" sx={headerTitleSx}>
            · {pFirst.join(', ')}
          </Typography>
        )}
        {pRest.length > 0 && (
          <Tooltip title={renderTooltipList(pRest)} arrow>
            <Chip size="small" label={`+${pRest.length} more`} sx={headerMoreChipSx} />
          </Tooltip>
        )}
      </Box>
    )
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Drawer
        anchor={isMobile ? 'bottom' : 'right'}
        open={open}
        onClose={onClose}
        ModalProps={{ keepMounted: true }}
        PaperProps={{
          sx: {
            width: isMobile ? '100vw' : 494,
            maxWidth: '100vw',
            height: isMobile ? '92vh' : '100vh',
            boxShadow: theme.shadows[16],
          },
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          {/* Header */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              px: 2.5,
              py: 2,
              borderBottom: '1px solid var(--color-border-primary)',
            }}
          >
            <AutoAwesomeOutlined sx={{ fontSize: 20, color: 'var(--color-primary)', flexShrink: 0 }} />
            {renderHeaderTitle()}
            <IconButton onClick={onClose} size="small" aria-label="Close" sx={{ flexShrink: 0 }}>
              <CloseOutlined fontSize="small" />
            </IconButton>
          </Box>

          {/* Body */}
          <Box sx={{ flex: 1, overflowY: 'auto' }}>
            {generating ? (
              /* LOADING STATE */
              <Box>
                <LinearProgress
                  sx={{
                    backgroundColor: 'var(--color-ai-purple-bg)',
                    '& .MuiLinearProgress-bar': { backgroundColor: 'var(--color-ai-purple)' },
                  }}
                />
                <Box
                  sx={{
                    px: 3,
                    py: 6,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center',
                    gap: 1.5,
                  }}
                >
                  <AutoAwesomeOutlined sx={{ fontSize: 48, color: 'var(--color-ai-purple)' }} />
                  <Typography sx={{ ...labelSx, fontWeight: 600, fontSize: 'var(--font-size-md)' }}>
                    Generating your summary…
                  </Typography>
                  <Typography sx={{ ...mutedSx, fontSize: '13px', maxWidth: 340, lineHeight: 1.6 }}>
                    This may take a moment, especially for large selections. You can close this
                    drawer and check back — tap the ✦ AI Summary button when you&apos;re ready to view
                    your results.
                  </Typography>
                  <MuiButton
                    variant="contained"
                    disableElevation
                    onClick={onClose}
                    sx={{ ...textBtnSx, mt: 1 }}
                  >
                    Close
                  </MuiButton>
                </Box>
              </Box>
            ) : summary ? (
              /* AI SUMMARY RESULT */
              <Box sx={{ p: 2.5 }}>

                {/* ── Summary title ── */}
                <TextField
                  fullWidth
                  variant="filled"
                  size="small"
                  label="Summary title"
                  value={summaryTitleValue}
                  onChange={(e) => setSummaryTitleValue(e.target.value)}
                  onBlur={() => {
                    if (!summaryTitleValue.trim()) {
                      setSummaryTitleValue(summaryTitleDefaultRef.current)
                    }
                  }}
                  error={!summaryTitleValue.trim()}
                  helperText={!summaryTitleValue.trim() ? 'Please give this summary a title' : ''}
                  sx={{ mb: 2 }}
                />

                <Box
                  sx={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 0.5,
                    px: 1,
                    py: 0.25,
                    borderRadius: 999,
                    bgcolor: 'var(--color-ai-purple-bg)',
                    mb: 1,
                  }}
                >
                  <AutoAwesomeOutlined sx={{ fontSize: 14, color: 'var(--color-ai-purple)' }} />
                  <Typography
                    sx={{
                      fontFamily: 'var(--font-family-primary)',
                      fontSize: 'var(--font-size-xs)',
                      fontWeight: 600,
                      color: 'var(--color-ai-purple)',
                    }}
                  >
                    AI generated
                  </Typography>
                </Box>
                <Typography sx={{ ...mutedSx, mb: 2 }}>22 players · 2 forms · Last 30 days</Typography>

                <Stack spacing={2.5}>
                  {/* Athlete Medical Summary */}
                  <Box>
                    <Typography sx={{ ...labelSx, fontWeight: 600, fontSize: 'var(--font-size-md)', mb: 1 }}>
                      Athlete Medical Summary
                    </Typography>
                    <Stack spacing={1.5}>
                      {[
                        {
                          type: 'info',
                          title: 'Concussion History',
                          body:
                            'Significant history of concussion. Sustained a concussion in high school (2012) resulting in loss of consciousness and hospitalization for concussion on March 11, 2025.',
                        },
                        {
                          type: 'info',
                          title: 'Musculoskeletal History',
                          body:
                            'Right Low Back: History of imaging (X-ray, MRI, CT, or bone scan) performed on December 24, 2024 for chronic issues.',
                        },
                        {
                          type: 'warn',
                          title: 'Vaccination Status',
                          body:
                            'Incomplete vaccination history — Mumps: Unknown, Pneumonia: Tetanus: No',
                        },
                      ].map((f, i) => (
                        <Box key={i} sx={{ display: 'flex', gap: 1 }}>
                          {f.type === 'warn' ? (
                            <WarningAmberOutlined sx={{ fontSize: 18, color: 'var(--color-warning)', mt: '2px', flexShrink: 0 }} />
                          ) : (
                            <InfoOutlined sx={{ fontSize: 18, color: 'var(--color-primary)', mt: '2px', flexShrink: 0 }} />
                          )}
                          <Box>
                            <Typography sx={{ ...labelSx, fontWeight: 600 }}>{f.title}</Typography>
                            <Typography sx={bulletSx}>{f.body}</Typography>
                          </Box>
                        </Box>
                      ))}
                    </Stack>
                  </Box>

                  {/* Recommendations */}
                  <Box>
                    <Typography sx={{ ...labelSx, fontWeight: 600, fontSize: 'var(--font-size-md)', mb: 1 }}>
                      Recommendations
                    </Typography>
                    <Typography sx={{ ...labelSx, fontWeight: 600, mb: 0.5 }}>Immediate Actions</Typography>
                    <Box component="ul" sx={{ m: 0, pl: 2.5, mb: 1.5 }}>
                      {[
                        'Player should be immediately held from all contact and throwing activities.',
                        'Urgent comprehensive orthopedic evaluation of the right shoulder is required.',
                        'Urgent comprehensive neurological evaluation including a detailed concussion assessment is required.',
                      ].map((t, i) => (
                        <Typography key={i} component="li" sx={bulletSx}>
                          {t}
                        </Typography>
                      ))}
                    </Box>
                    <Typography sx={{ ...labelSx, fontWeight: 600, mb: 0.5 }}>Diagnostic Next Steps</Typography>
                    <Box component="ul" sx={{ m: 0, pl: 2.5 }}>
                      {[
                        'Obtain an MRI of the right shoulder to assess rotator cuff integrity and extent of injury.',
                        'Conduct a full neuropsychological assessment (e.g. ImPACT testing) and a thorough neurological examination.',
                        'Review medical records from the March 11, 2025 concussion hospitalization.',
                      ].map((t, i) => (
                        <Typography key={i} component="li" sx={bulletSx}>
                          {t}
                        </Typography>
                      ))}
                    </Box>
                  </Box>

                  <Typography sx={{ ...mutedSx, fontStyle: 'italic', mt: 1 }}>
                    AI-generated summaries can contain mistakes. Review before acting on
                    clinical or performance decisions.
                  </Typography>
                </Stack>
              </Box>
            ) : (
              /* STEP FLOW */
              <Stack divider={<Divider />}>
                {/* Step 1 — Players */}
                <Box>
                  <StepHeader
                    index={1}
                    title="Select players"
                    complete={step1Complete && activeStep !== 1}
                    active={activeStep === 1}
                    summary={step1Summary}
                    onClick={() => setActiveStep(1)}
                  />
                  <Collapse in={activeStep === 1}>
                    <Box sx={{ px: 2, pb: 2 }}>
                      {!selectorOpen ? (
                        /* COLLAPSED TRIGGER FIELD */
                        <Box
                          onClick={() => setSelectorOpen(true)}
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 0.5,
                            minHeight: 48,
                            px: 1.5,
                            py: 1,
                            cursor: 'pointer',
                            bgcolor: 'var(--color-background-secondary)',
                            borderTopLeftRadius: 'var(--radius-sm)',
                            borderTopRightRadius: 'var(--radius-sm)',
                            borderBottom: '1px solid var(--color-border-primary)',
                            '&:hover': {
                              bgcolor: 'var(--color-background-tertiary)',
                              borderBottom: '1px solid var(--color-border-focus)',
                            },
                          }}
                        >
                          <Box sx={{ flex: 1, display: 'flex', flexWrap: 'wrap', gap: 0.5, minWidth: 0 }}>
                            {selectedPlayers.size === 0 ? (
                              <Typography
                                sx={{
                                  color: 'var(--color-text-muted)',
                                  fontFamily: 'var(--font-family-primary)',
                                  fontSize: 'var(--font-size-sm)',
                                }}
                              >
                                Select players…
                              </Typography>
                            ) : (
                              [...selectedPlayers].map((id) => {
                                const a = getPlayerById(id)
                                return a ? (
                                  <Chip
                                    key={id}
                                    size="small"
                                    label={a.name}
                                    onDelete={(e) => {
                                      e.stopPropagation()
                                      togglePlayer(id)
                                    }}
                                    sx={{
                                      fontFamily: 'var(--font-family-primary)',
                                      fontSize: 'var(--font-size-xs)',
                                      bgcolor: 'var(--color-background-tertiary)',
                                    }}
                                  />
                                ) : null
                              })
                            )}
                          </Box>
                          <ArrowDropDownOutlined sx={{ color: 'var(--color-text-secondary)' }} />
                        </Box>
                      ) : (
                        /* EXPANDED PANEL */
                        <Box
                          sx={{
                            bgcolor: 'var(--color-background-primary)',
                            border: '1px solid var(--color-border-primary)',
                            borderRadius: 'var(--radius-sm)',
                            p: 1.5,
                          }}
                        >
                          {/* Search row */}
                          <TextField
                            fullWidth
                            size="small"
                            variant="filled"
                            placeholder="Search"
                            value={playerSearch}
                            onChange={(e) => setPlayerSearch(e.target.value)}
                            sx={{ ...fieldStyles, mb: 1.5 }}
                            InputProps={{
                              endAdornment: (
                                <InputAdornment position="end">
                                  <IconButton
                                    size="small"
                                    onClick={() => setPlayerSearch('')}
                                    aria-label="Clear search"
                                  >
                                    <CloseOutlined fontSize="small" sx={{ color: 'var(--color-text-secondary)' }} />
                                  </IconButton>
                                </InputAdornment>
                              ),
                            }}
                          />

                          {/* Team + Sort dropdowns */}
                          <Box sx={{ display: 'flex', gap: 1, mb: 1.5 }}>
                            <FormControl size="small" variant="filled" sx={{ ...fieldStyles, flex: 1 }}>
                              <InputLabel
                                sx={{
                                  fontFamily: 'var(--font-family-primary)',
                                  fontSize: 'var(--font-size-sm)',
                                  color: 'var(--color-text-secondary)',
                                }}
                              >
                                Team
                              </InputLabel>
                              <Select
                                value={teamFilter}
                                label="Team"
                                onChange={(e) => setTeamFilter(e.target.value)}
                                sx={{ fontFamily: 'var(--font-family-primary)', fontSize: 'var(--font-size-sm)' }}
                              >
                                {selectorTeams.map((t) => (
                                  <MenuItem
                                    key={t}
                                    value={t}
                                    sx={{ fontFamily: 'var(--font-family-primary)', fontSize: 'var(--font-size-sm)' }}
                                  >
                                    {t}
                                  </MenuItem>
                                ))}
                              </Select>
                            </FormControl>
                            <FormControl size="small" variant="filled" sx={{ ...fieldStyles, flex: 1 }}>
                              <InputLabel
                                sx={{
                                  fontFamily: 'var(--font-family-primary)',
                                  fontSize: 'var(--font-size-sm)',
                                  color: 'var(--color-text-secondary)',
                                }}
                              >
                                Sort
                              </InputLabel>
                              <Select
                                value={sortOrder}
                                label="Sort"
                                onChange={(e) => setSortOrder(e.target.value)}
                                sx={{ fontFamily: 'var(--font-family-primary)', fontSize: 'var(--font-size-sm)' }}
                              >
                                <MenuItem value="az" sx={{ fontFamily: 'var(--font-family-primary)', fontSize: 'var(--font-size-sm)' }}>
                                  A–Z
                                </MenuItem>
                                <MenuItem value="za" sx={{ fontFamily: 'var(--font-family-primary)', fontSize: 'var(--font-size-sm)' }}>
                                  Z–A
                                </MenuItem>
                              </Select>
                            </FormControl>
                          </Box>

                          {/* Selected count chip */}
                          <Chip
                            label={`Selected (${selectedPlayers.size})`}
                            size="small"
                            sx={{
                              mb: 1.5,
                              bgcolor: 'var(--color-primary)',
                              color: 'var(--color-white)',
                              fontFamily: 'var(--font-family-primary)',
                              fontSize: 'var(--font-size-xs)',
                              fontWeight: 600,
                            }}
                          />

                          {/* List header row */}
                          <Box
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              mb: 0.5,
                            }}
                          >
                            <Typography sx={{ ...mutedSx, fontSize: '13px' }}>All players</Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.25 }}>
                              <Typography sx={{ ...mutedSx, fontSize: '13px' }}>Select all</Typography>
                              <Checkbox
                                size="small"
                                checked={allVisibleSelected}
                                indeterminate={!allVisibleSelected && someVisibleSelected}
                                onChange={toggleSelectAllVisible}
                                sx={checkboxSx}
                              />
                              <Divider orientation="vertical" flexItem sx={{ mx: 0.5, my: 0.75 }} />
                              <IconButton
                                size="small"
                                onClick={() => setAthleteListOpen((v) => !v)}
                                aria-label="Toggle player list"
                              >
                                {athleteListOpen ? (
                                  <ExpandLessOutlined fontSize="small" sx={{ color: 'var(--color-text-secondary)' }} />
                                ) : (
                                  <ExpandMoreOutlined fontSize="small" sx={{ color: 'var(--color-text-secondary)' }} />
                                )}
                              </IconButton>
                            </Box>
                          </Box>

                          <Divider />

                          {/* Athlete list — capped at 5 visible rows, internally scrollable */}
                          <Collapse in={athleteListOpen}>
                            <Box sx={{ maxHeight: 250, overflowY: 'auto' }}>
                              {visibleAthletes.length === 0 && (
                                <Typography sx={{ ...mutedSx, textAlign: 'center', py: 2 }}>
                                  No players found
                                </Typography>
                              )}
                              {visibleAthletes.map((a, i) => (
                                <Box key={a.id}>
                                  {i > 0 && <Divider />}
                                  <Box
                                    onClick={() => togglePlayer(a.id)}
                                    sx={{
                                      display: 'flex',
                                      alignItems: 'center',
                                      px: 0.5,
                                      py: 0.75,
                                      cursor: 'pointer',
                                      bgcolor: 'var(--color-background-primary)',
                                      '&:hover': { bgcolor: 'var(--color-background-hover)' },
                                    }}
                                  >
                                    <Checkbox
                                      size="small"
                                      checked={selectedPlayers.has(a.id)}
                                      sx={{ ...checkboxSx, mr: 0.5 }}
                                    />
                                    <Avatar
                                      sx={{
                                        width: 32,
                                        height: 32,
                                        mr: 1.25,
                                        fontSize: '14px',
                                        bgcolor: 'var(--color-border-primary)',
                                        color: 'var(--color-white)',
                                      }}
                                    >
                                      {a.name[0]}
                                    </Avatar>
                                    <Typography
                                      sx={{
                                        flex: 1,
                                        fontFamily: 'var(--font-family-primary)',
                                        fontSize: '14px',
                                        color: 'var(--color-text-primary)',
                                      }}
                                    >
                                      {a.name}
                                    </Typography>
                                    <Typography sx={{ ...mutedSx, fontSize: '13px' }}>
                                      {a.nationality}
                                    </Typography>
                                  </Box>
                                </Box>
                              ))}
                            </Box>
                          </Collapse>

                          <Divider />

                          {/* Panel footer — sticky so Done is always visible */}
                          <Box
                            sx={{
                              display: 'flex',
                              justifyContent: 'flex-end',
                              position: 'sticky',
                              bottom: 0,
                              bgcolor: 'var(--color-background-primary)',
                              pt: 1.5,
                            }}
                          >
                            <MuiButton
                              variant="contained"
                              size="small"
                              disableElevation
                              disabled={selectedPlayers.size === 0}
                              onClick={() => {
                                setSelectorOpen(false)
                                setActiveStep(2)
                              }}
                              sx={navyBtnSx}
                            >
                              Done
                            </MuiButton>
                          </Box>
                        </Box>
                      )}
                    </Box>
                  </Collapse>
                </Box>

                {/* Step 2 — Forms */}
                <Box>
                  <StepHeader
                    index={2}
                    title="Select forms"
                    complete={step2Complete && activeStep !== 2}
                    active={activeStep === 2}
                    summary={step2Summary}
                    onClick={() => goToStep(2, step1Complete)}
                  />
                  <Collapse in={activeStep === 2}>
                    <Box sx={{ px: 2, pb: 2 }}>
                      <TextField
                        fullWidth
                        size="small"
                        variant="filled"
                        placeholder="Search forms"
                        value={formSearch}
                        onChange={(e) => setFormSearch(e.target.value)}
                        sx={{ ...fieldStyles, mb: 1.5 }}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <SearchOutlined fontSize="small" sx={{ color: 'var(--color-primary)' }} />
                            </InputAdornment>
                          ),
                        }}
                      />

                      {/* Category + Sort dropdowns (match player selector Team/Sort) */}
                      <Box sx={{ display: 'flex', gap: 1, mb: 1.5 }}>
                        <FormControl size="small" variant="filled" sx={{ ...fieldStyles, flex: 1 }}>
                          <InputLabel
                            sx={{
                              fontFamily: 'var(--font-family-primary)',
                              fontSize: 'var(--font-size-sm)',
                              color: 'var(--color-text-secondary)',
                            }}
                          >
                            Category
                          </InputLabel>
                          <Select
                            value={formCategory}
                            label="Category"
                            onChange={(e) => setFormCategory(e.target.value)}
                            sx={{ fontFamily: 'var(--font-family-primary)', fontSize: 'var(--font-size-sm)' }}
                          >
                            {formCategories.map((c) => (
                              <MenuItem
                                key={c}
                                value={c}
                                sx={{ fontFamily: 'var(--font-family-primary)', fontSize: 'var(--font-size-sm)' }}
                              >
                                {c}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                        <FormControl size="small" variant="filled" sx={{ ...fieldStyles, flex: 1 }}>
                          <InputLabel
                            sx={{
                              fontFamily: 'var(--font-family-primary)',
                              fontSize: 'var(--font-size-sm)',
                              color: 'var(--color-text-secondary)',
                            }}
                          >
                            Sort
                          </InputLabel>
                          <Select
                            value={formSort}
                            label="Sort"
                            onChange={(e) => setFormSort(e.target.value)}
                            sx={{ fontFamily: 'var(--font-family-primary)', fontSize: 'var(--font-size-sm)' }}
                          >
                            <MenuItem value="az" sx={{ fontFamily: 'var(--font-family-primary)', fontSize: 'var(--font-size-sm)' }}>A–Z</MenuItem>
                            <MenuItem value="za" sx={{ fontFamily: 'var(--font-family-primary)', fontSize: 'var(--font-size-sm)' }}>Z–A</MenuItem>
                          </Select>
                        </FormControl>
                      </Box>

                      {/* Selected form chip — single select, shows the form name */}
                      <Chip
                        label={selectedForms.size ? (getFormById([...selectedForms][0])?.name || 'Form selected') : 'No form selected'}
                        size="small"
                        sx={{
                          mb: 1.5,
                          bgcolor: 'var(--color-primary)',
                          color: 'var(--color-white)',
                          fontFamily: 'var(--font-family-primary)',
                          fontSize: 'var(--font-size-xs)',
                          fontWeight: 600,
                        }}
                      />

                      {/* Flat form list — only forms associated with selected players */}
                      <Box
                        sx={{
                          border: '1px solid var(--color-border-secondary)',
                          borderRadius: 'var(--radius-sm)',
                          overflow: 'hidden',
                          maxHeight: 300,
                          overflowY: 'auto',
                        }}
                      >
                        <RadioGroup
                          value={[...selectedForms][0] || ''}
                          onChange={(e) => toggleForm(e.target.value)}
                          sx={{ display: 'block' }}
                        >
                        {visibleForms.length === 0 && (
                          <Typography sx={{ ...mutedSx, textAlign: 'center', py: 2 }}>
                            {selectedPlayers.size === 0
                              ? 'Select players first'
                              : 'No forms found'}
                          </Typography>
                        )}
                        {visibleForms.map((f, i) => {
                          const assoc = getPlayersForForm(f.id, [...selectedPlayers])
                          const firstTwo = assoc.slice(0, 2)
                          const rest = assoc.slice(2)
                          return (
                            <Box key={f.id}>
                              {i > 0 && <Divider />}
                              <Box
                                onClick={() => toggleForm(f.id)}
                                sx={{
                                  display: 'flex',
                                  alignItems: 'flex-start',
                                  px: 1,
                                  py: 0.75,
                                  cursor: 'pointer',
                                  '&:hover': { bgcolor: 'var(--color-background-hover)' },
                                }}
                              >
                                <Radio
                                  size="small"
                                  value={f.id}
                                  checked={selectedForms.has(f.id)}
                                  sx={{ ...checkboxSx, mr: 0.5, mt: '-2px' }}
                                />
                                <Box sx={{ flex: 1, minWidth: 0 }}>
                                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <Typography
                                      sx={{
                                        flex: 1,
                                        fontFamily: 'var(--font-family-primary)',
                                        fontSize: 'var(--font-size-sm)',
                                        color: 'var(--color-text-primary)',
                                      }}
                                    >
                                      {f.name}
                                    </Typography>
                                    <Chip
                                      size="small"
                                      label={f.category}
                                      sx={{
                                        height: 20,
                                        fontFamily: 'var(--font-family-primary)',
                                        fontSize: '11px',
                                        bgcolor: 'var(--color-background-secondary)',
                                        color: 'var(--color-text-secondary)',
                                        '& .MuiChip-label': { px: '8px' },
                                      }}
                                    />
                                  </Box>
                                  {assoc.length > 0 && (
                                    <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 0.5, mt: 0.25 }}>
                                      <Typography
                                        sx={{
                                          fontFamily: 'var(--font-family-primary)',
                                          fontSize: '12px',
                                          color: 'var(--color-text-secondary)',
                                        }}
                                      >
                                        {firstTwo.map((p) => p.name).join(' · ')}
                                      </Typography>
                                      {rest.length > 0 && (
                                        <Tooltip title={rest.map((p) => p.name).join(', ')} arrow>
                                          <Chip
                                            size="small"
                                            icon={<InfoOutlined sx={{ fontSize: 12 }} />}
                                            label={`+${rest.length} more`}
                                            onClick={(e) => e.stopPropagation()}
                                            sx={{
                                              height: 18,
                                              fontFamily: 'var(--font-family-primary)',
                                              fontSize: '11px',
                                              bgcolor: 'var(--color-background-secondary)',
                                              color: 'var(--color-text-secondary)',
                                              cursor: 'pointer',
                                              '& .MuiChip-label': { px: '6px' },
                                              '& .MuiChip-icon': { ml: '4px', color: 'inherit' },
                                            }}
                                          />
                                        </Tooltip>
                                      )}
                                    </Box>
                                  )}
                                </Box>
                              </Box>
                            </Box>
                          )
                        })}
                        </RadioGroup>
                      </Box>

                      {/* Done — right-aligned navy, matches the player selector */}
                      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                        <MuiButton
                          variant="contained"
                          size="small"
                          disableElevation
                          disabled={!step2Complete}
                          onClick={() => setActiveStep(3)}
                          sx={navyBtnSx}
                        >
                          Done
                        </MuiButton>
                      </Box>
                    </Box>
                  </Collapse>
                </Box>

                {/* Step 3 — Date range */}
                <Box>
                  <StepHeader
                    index={3}
                    title="Choose date range"
                    complete={step3Complete && activeStep !== 3}
                    active={activeStep === 3}
                    summary={dateLabel}
                    onClick={() => goToStep(3, step1Complete && step2Complete)}
                  />
                  <Collapse in={activeStep === 3}>
                    <Box sx={{ px: 2, pb: 2 }}>
                      {/* MUI date range picker */}
                      <DateRangePicker
                        value={customRange}
                        onChange={(v) => {
                          setCustomRange(v)
                          setDatePreset('custom')
                        }}
                        slotProps={{
                          textField: { size: 'small', variant: 'filled', fullWidth: true, sx: fieldStyles },
                        }}
                        localeText={{ start: 'From', end: 'To' }}
                      />

                      {/* Quick-range chips (auto-populate the picker above) */}
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75, mt: 1.5 }}>
                        {dateRangePresets.map((preset) => {
                          const selected = datePreset === preset.id
                          return (
                            <Chip
                              key={preset.id}
                              label={preset.label}
                              size="small"
                              onClick={() => applyPreset(preset.id)}
                              sx={{
                                fontFamily: 'var(--font-family-primary)',
                                fontSize: 'var(--font-size-xs)',
                                cursor: 'pointer',
                                bgcolor: selected ? 'var(--color-primary)' : 'var(--color-background-secondary)',
                                color: selected ? 'var(--color-white)' : 'var(--color-text-primary)',
                                '&:hover': {
                                  bgcolor: selected ? 'var(--color-primary-hover)' : 'var(--color-background-tertiary)',
                                },
                              }}
                            />
                          )
                        })}
                      </Box>

                      <MuiButton
                        variant="contained"
                        size="small"
                        disableElevation
                        disabled={!step3Complete}
                        onClick={() => setActiveStep(4)}
                        fullWidth
                        sx={{ ...navyBtnSx, mt: 2 }}
                      >
                        Done
                      </MuiButton>
                    </Box>
                  </Collapse>
                </Box>

              </Stack>
            )}
          </Box>

          {/* Summary size indicator — persistent above the footer in the step flow,
              shown once any selection has been made. */}
          {!generating && !summary && hasAnySelection && (
            <Box sx={{ px: 2.5, py: 1.75, borderTop: '1px solid var(--color-border-primary)' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.75 }}>
                <Typography
                  sx={{
                    fontFamily: 'var(--font-family-primary)',
                    fontSize: '13px',
                    fontWeight: 600,
                    color: 'var(--color-text-primary)',
                  }}
                >
                  Summary size
                </Typography>
                <Typography
                  sx={{
                    fontFamily: 'var(--font-family-primary)',
                    fontSize: '13px',
                    color: 'var(--color-text-secondary)',
                  }}
                >
                  {limitReached ? 'Limit reached' : `${summaryUsage}% of limit used`}
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={summaryUsage}
                sx={{
                  height: 6,
                  borderRadius: 3,
                  bgcolor: 'var(--color-background-tertiary)',
                  '& .MuiLinearProgress-bar': { backgroundColor: usageColor },
                }}
              />

              {limitWarning && (
                <Alert
                  severity="warning"
                  icon={false}
                  sx={{ mt: 1.25, py: 0.5, fontFamily: 'var(--font-family-primary)', fontSize: '12px' }}
                >
                  Your selection is getting large. To keep your summary focused, try narrowing the date range or reducing the number of players.
                  <Box sx={{ display: 'flex', gap: 2, mt: 0.5 }}>
                    <Link component="button" onClick={() => setActiveStep(3)} sx={suggestionLinkSx}>
                      Reduce date range ↑
                    </Link>
                    <Link component="button" onClick={() => { setActiveStep(1); setSelectorOpen(true) }} sx={suggestionLinkSx}>
                      Remove players ↑
                    </Link>
                  </Box>
                </Alert>
              )}

              {limitReached && (
                <Alert
                  severity="error"
                  icon={false}
                  sx={{ mt: 1.25, py: 0.5, fontFamily: 'var(--font-family-primary)', fontSize: '12px' }}
                >
                  You&apos;ve reached the summary limit. Please reduce your selection before generating.
                </Alert>
              )}

              {DEMO_MODE && (
                <Typography
                  sx={{
                    mt: 1,
                    fontFamily: 'var(--font-family-primary)',
                    fontSize: '11px',
                    fontStyle: 'italic',
                    color: 'var(--color-text-secondary)',
                  }}
                >
                  Demo: select 8+ players to see the warning state, 12 players to see the limit reached state.
                </Typography>
              )}
            </Box>
          )}

          {/* Footer — hidden during the loading state (Close lives in the body) */}
          {!generating && (
            summary ? (
              <Box sx={{ borderTop: '1px solid #e0e0e0', background: '#fff', pb: 10 }}>
                {/* Action bar */}
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    px: 2,
                    pt: 1.5,
                    pb: 1,
                  }}
                >
                  {/* Left: Copy */}
                  <Tooltip title="Copy">
                    <IconButton
                      size="small"
                      onClick={handleCopySummary}
                      sx={{ color: '#757575', '&:hover': { color: '#1a2744' } }}
                    >
                      <ContentCopyOutlined sx={{ fontSize: 20 }} />
                    </IconButton>
                  </Tooltip>

                  {/* Centre: label + thumbs */}
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <Typography
                      sx={{
                        fontFamily: 'var(--font-family-primary)',
                        fontSize: '13px',
                        color: '#9e9e9e',
                        mr: 0.5,
                      }}
                    >
                      {feedbackSubmitted ? 'Feedback received — thank you' : 'Was this helpful?'}
                    </Typography>
                    <Tooltip title="Good response">
                      <span>
                        <IconButton
                          size="small"
                          onClick={() => openFeedbackModal('up')}
                          sx={{ color: feedbackType === 'up' ? '#1a2744' : '#757575', '&:hover': { color: '#1a2744' } }}
                        >
                          {feedbackType === 'up'
                            ? <ThumbUp sx={{ fontSize: 20 }} />
                            : <ThumbUpOutlined sx={{ fontSize: 20 }} />}
                        </IconButton>
                      </span>
                    </Tooltip>
                    <Tooltip title="Bad response">
                      <span>
                        <IconButton
                          size="small"
                          onClick={() => openFeedbackModal('down')}
                          sx={{ color: feedbackType === 'down' ? '#1a2744' : '#757575', '&:hover': { color: '#1a2744' } }}
                        >
                          {feedbackType === 'down'
                            ? <ThumbDown sx={{ fontSize: 20 }} />
                            : <ThumbDownOutlined sx={{ fontSize: 20 }} />}
                        </IconButton>
                      </span>
                    </Tooltip>
                  </Box>

                  {/* Right: Regenerate */}
                  <Tooltip title="Regenerate">
                    <IconButton
                      size="small"
                      onClick={handleGenerate}
                      sx={{ color: '#757575', '&:hover': { color: '#1a2744' } }}
                    >
                      <RefreshOutlined sx={{ fontSize: 20 }} />
                    </IconButton>
                  </Tooltip>
                </Box>

                {/* Inline feedback — expands below action bar on thumbs click */}
                <Collapse in={feedbackModal !== null}>
                  <Box sx={{ px: 2, pb: 1.5 }}>
                    <Divider sx={{ mb: 1.5 }} />
                    <Typography
                      sx={{
                        fontFamily: 'var(--font-family-primary)',
                        fontSize: '13px',
                        fontWeight: 500,
                        color: 'var(--color-text-primary)',
                        mb: 1,
                      }}
                    >
                      {feedbackModal === 'down'
                        ? 'Sorry to hear that. Tell us more.'
                        : 'Glad it was useful. Tell us more.'}
                    </Typography>
                    <TextField
                      multiline
                      rows={3}
                      fullWidth
                      variant="filled"
                      size="small"
                      label={feedbackModal === 'down'
                        ? 'Tell us more about what you expected instead'
                        : "Anything else you'd like to tell us?"}
                      placeholder={feedbackModal === 'down'
                        ? 'Optional — your feedback helps us improve'
                        : 'Optional'}
                      value={feedbackText}
                      onChange={(e) => setFeedbackText(e.target.value)}
                      sx={{ mb: 1.5 }}
                    />
                    <Stack direction="row" spacing={1} justifyContent="flex-end">
                      <MuiButton
                        variant="contained"
                        size="small"
                        disableElevation
                        onClick={closeFeedbackModal}
                        sx={textBtnSx}
                      >
                        Skip
                      </MuiButton>
                      <MuiButton
                        variant="contained"
                        size="small"
                        disableElevation
                        onClick={submitFeedback}
                        sx={{
                          textTransform: 'none',
                          fontFamily: 'var(--font-family-primary)',
                          bgcolor: '#1a2744',
                          color: '#ffffff',
                          '&:hover': { bgcolor: '#263356' },
                        }}
                      >
                        Send feedback
                      </MuiButton>
                    </Stack>
                  </Box>
                </Collapse>
              </Box>
            ) : (
              <>
                <Divider />
                <Box sx={{ px: 2.5, py: 2 }}>
                  <Tooltip title={limitReached ? 'Reduce your selection to generate a summary' : ''}>
                    <span style={{ display: 'block', width: '100%' }}>
                      <Button
                        variant="primary"
                        size="medium"
                        disabled={!canGenerate || generating || limitReached}
                        onClick={handleGenerate}
                        style={{ width: '100%', justifyContent: 'center', fontWeight: 700 }}
                      >
                        <AutoAwesomeOutlined sx={{ fontSize: 16 }} />
                        Generate summary
                      </Button>
                    </span>
                  </Tooltip>
                </Box>
              </>
            )
          )}
        </Box>
      </Drawer>

      {/* V3 ADDITION — snackbars */}
      <Snackbar
        open={copySnackbar}
        autoHideDuration={3000}
        onClose={() => setCopySnackbar(false)}
        message="Summary copied to clipboard"
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />
      <Snackbar
        open={thanksSnackbar}
        autoHideDuration={3000}
        onClose={() => setThanksSnackbar(false)}
        message="Thanks for your feedback"
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />
    </LocalizationProvider>
  )
}

function PlayerRow({ player, checked, onToggle }) {
  return (
    <Box
      onClick={onToggle}
      sx={{
        display: 'flex',
        alignItems: 'center',
        px: 1.5,
        py: 0.75,
        cursor: 'pointer',
        '&:hover': { bgcolor: 'var(--color-background-hover)' },
      }}
    >
      <Checkbox size="small" checked={checked} sx={{ ...checkboxSx, mr: 0.5 }} />
      <Avatar
        sx={{
          width: 28,
          height: 28,
          mr: 1.25,
          fontSize: '11px',
          bgcolor: 'var(--color-background-tertiary)',
          color: 'var(--color-text-secondary)',
        }}
      >
        {player.initials}
      </Avatar>
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography
          sx={{
            fontFamily: 'var(--font-family-primary)',
            fontSize: 'var(--font-size-sm)',
            color: 'var(--color-text-primary)',
          }}
        >
          {player.name}
        </Typography>
        <Typography sx={mutedSx}>{player.position}</Typography>
      </Box>
      {player.status === 'injured' && (
        <Chip
          size="small"
          label="Injured"
          sx={{
            height: 18,
            fontFamily: 'var(--font-family-primary)',
            fontSize: '10px',
            bgcolor: 'var(--color-background-secondary)',
            color: 'var(--color-error)',
            '& .MuiChip-label': { px: '6px' },
          }}
        />
      )}
    </Box>
  )
}

PlayerRow.propTypes = {
  player: PropTypes.object,
  checked: PropTypes.bool,
  onToggle: PropTypes.func,
}

AiSummaryDrawer.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  initialSummary: PropTypes.bool,
}

export default AiSummaryDrawer
