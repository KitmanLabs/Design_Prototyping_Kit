import React, { useMemo, useState, useCallback } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import {
  Box,
  Paper,
  Typography,
  Tabs,
  Tab,
  TextField,
  InputAdornment,
  IconButton,
  Menu,
  MenuItem,
  Link,
  Autocomplete,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
  Drawer,
  Checkbox,
  List,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import { Button, DataGridPremium, GridPagination } from 'playbook-components'
import { PageHeader } from '../../floorplans'
import { resolveGridPrompt } from '../../utils/gridAiAssistant'
import { FORMS_AI_SUGGESTIONS, COMPLETED_FORMS_AI_SUGGESTIONS } from '../../data/gridAiSuggestions'
import { SearchOutlined, MoreVertOutlined, ArrowDropDownOutlined, KeyboardArrowDownOutlined, KeyboardArrowRightOutlined, CloseOutlined } from '@mui/icons-material'
import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment'
import { DateRangePicker, DatePicker, MultiInputDateRangeField } from '@mui/x-date-pickers-pro'
import moment from 'moment'
import '../../styles/design-tokens.css'
import { StatusChip, Icon } from '../../components'
import { dataGridStyles } from '../../components/dataGridStyles'
import AssignFormDrawer from '../../components/forms/AssignFormDrawer'
import CreateFormDrawer from '../../components/forms/CreateFormDrawer'
import EditScheduleDrawer from '../../components/forms/EditScheduleDrawer'
import ExportFormDrawer from '../../components/forms/ExportFormDrawer'
import NotificationDrawer from '../../components/forms/NotificationDrawer'
import athletesData from '../../data/athletes.json'
import formsTemplatesData from '../../data/forms_templates.json'
import { currentUser } from '../../data/layout'
import {
  IosShareOutlined,
  StickyNote2Outlined,
  ContentCopyOutlined,
  EditOutlined,
  DeleteOutlined,
  FileDownloadOutlined,
} from '@mui/icons-material'
import { completedRowsData, complianceRowsData, schedulingRowsData } from '../../data/forms'

import ListItemButton from '@mui/material/ListItemButton';

function a11yProps(index) {
  return {
    id: `forms-tab-${index}`,
    'aria-controls': `forms-tabpanel-${index}`
  }
}

function TabPanel({ children, value, index }) {
  if (value !== index) return null
  return (
    <Box
      role="tabpanel"
      id={`forms-tabpanel-${index}`}
      aria-labelledby={`forms-tab-${index}`}
      sx={{ pt: 0, flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}
    >
      {children}
    </Box>
  )
}

const typographyStyles = {
  fontFamily: 'var(--font-family-primary)',
  fontSize: 'var(--font-size-sm)',
  fontWeight: 'var(--font-weight-medium)'
}

const gridSx = {
  ...dataGridStyles,
  flex: 1,
  minHeight: 0,
  width: '100%'
}

const initialFormsFromData = (formsTemplatesData || []).map((r) => ({
  id: r.id,
  form: r.form,
  productArea: r.productArea,
  category: r.category,
  description: r.description || '',
  owner: r.owner,
  assignments: r.assignments ?? 0,
  lastUpdated: r.lastUpdated
}))

export default function FormsPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const locationState = location?.state || {}

  const [tabValue, setTabValue] = useState(
    locationState.initialTab === 'scheduling' ? 1 : (locationState.initialTab === 'completed' ? 2 : (locationState.initialTab === 'compliance' ? 3 : 0))
  )
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 25 })
  const [actionMenuAnchor, setActionMenuAnchor] = useState(null)
  const [actionRowId, setActionRowId] = useState(null)
  const [assignOpen, setAssignOpen] = useState(false)
  const [selectedFormName, setSelectedFormName] = useState('')
  const [selectedAthletes, setSelectedAthletes] = useState([])
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [exportOpen, setExportOpen] = useState(false)
  const [isNotificationDrawerOpen, setIsNotificationDrawerOpen] = useState(false)

  // Forms list: initial from JSON + newly created (add logic)
  const [formsList, setFormsList] = useState(initialFormsFromData)

  const handleCreateForm = useCallback((payload) => {
    const id = `new-${Date.now()}`
    const lastUpdated = moment().format('D MMM YYYY')
    setFormsList((prev) => [
      ...prev,
      {
        id,
        form: payload.title || 'Untitled form',
        productArea: 'General',
        category: payload.category || 'Other',
        description: payload.description || '',
        owner: currentUser?.name || 'Me',
        lastUpdated
      }
    ])
    setIsCreateOpen(false)
  }, [])

  // —— Forms tab ——
  const [searchForm, setSearchForm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')
  const formsRows = useMemo(() => {
    let rows = formsList.map((r) => ({
      ...r,
      description: r.description || '—'
    }))
    if (searchForm) {
      const q = searchForm.toLowerCase()
      rows = rows.filter((r) => (r.form || '').toLowerCase().includes(q))
    }
    if (categoryFilter) {
      rows = rows.filter((r) => (r.category || '').toLowerCase() === categoryFilter.toLowerCase())
    }
    return rows
  }, [formsList, searchForm, categoryFilter])

  const formsColumns = useMemo(() => [
    {
      field: 'form',
      headerName: 'Form',
      flex: 1,
      minWidth: 200,
      headerClassName: 'grid-cell--pad-left',
      cellClassName: 'grid-cell--pad-left',
      renderCell: (params) => (
        <Typography component="span" variant="body2" sx={{ fontWeight: 600, color: 'var(--color-text-primary)', fontFamily: 'var(--font-family-primary)', fontSize: 'var(--font-size-sm)' }}>
          <Link
            component="button"
            underline="none"
            onClick={(e) => {
              e.stopPropagation()
              navigate(`/forms/${params.row.id}/build`)
            }}
            sx={{ color: 'var(--color-primary)', '&:hover': { color: 'var(--color-primary-hover)' } }}
          >
            {params.value}
          </Link>
        </Typography>
      )
    },
    { field: 'productArea', headerName: 'Product area', width: 140 },
    { field: 'category', headerName: 'Category', width: 120 },
    {
      field: 'description',
      headerName: 'Description',
      flex: 1,
      minWidth: 200,
      renderCell: (params) => (
        <Typography variant="body2" sx={{ color: 'var(--color-text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontFamily: 'var(--font-family-primary)', fontSize: 'var(--font-size-sm)' }} title={params.value}>
          {params.value || '—'}
        </Typography>
      )
    },
    { field: 'owner', headerName: 'Owner', width: 180 },
    { field: 'assignments', headerName: 'Assignment', width: 120 },
    { field: 'lastUpdated', headerName: 'Last updated', width: 140, headerClassName: 'grid-cell--pad-right', cellClassName: 'grid-cell--pad-right' },
    {
      field: 'actions',
      headerName: '',
      sortable: false,
      filterable: false,
      width: 56,
      align: 'right',
      headerAlign: 'right',
      headerClassName: 'grid-cell--pad-right',
      cellClassName: 'grid-cell--pad-right',
      renderCell: (params) => (
        <IconButton
          aria-label="more"
          onClick={(e) => {
            e.stopPropagation()
            setActionMenuAnchor(e.currentTarget)
            setActionRowId(params.row.id)
          }}
          sx={{ color: 'var(--color-text-secondary)' }}
        >
          <MoreVertOutlined fontSize="small" />
        </IconButton>
      )
    }
  ], [navigate])

  const drawerAthletes = useMemo(
    () =>
      (athletesData || []).map((a) => ({
        id: String(a.id ?? `${a.firstname}-${a.lastname}`),
        name: `${a.firstname} ${a.lastname}`.trim(),
        position: a.position || a.position_group || '—',
        ageGroup: (a.squad_name && /U\d+/.test(a.squad_name)) ? (a.squad_name.match(/U\d+/)?.[0] || 'U21') : 'U21',
        status: a.availability_status === 'Injured' ? 'injured' : 'available',
        avatar: undefined,
        team: a.squad_name || 'Unassigned'
      })),
    []
  )

  // —— Completed tab ——
  const [completedAthlete, setCompletedAthlete] = useState(null)
  const [completedFormName, setCompletedFormName] = useState(null)
  const [completedStatus, setCompletedStatus] = useState(null)
  const [completedDateRange, setCompletedDateRange] = useState([null, null])

  const completedFilteredRows = useMemo(() => {
    let rows = completedRowsData
    if (completedAthlete) rows = rows.filter((r) => r.athleteName === completedAthlete)
    if (completedFormName) rows = rows.filter((r) => (r.formName || '').toLowerCase().includes(String(completedFormName).toLowerCase()))
    if (completedStatus) rows = rows.filter((r) => r.formStatus === completedStatus)
    const [start, end] = completedDateRange || [null, null]
    if (start) rows = rows.filter((r) => moment(r.completionDate).isAfter(moment(start).startOf('day')) || moment(r.completionDate).isSame(moment(start).startOf('day')))
    if (end) rows = rows.filter((r) => moment(r.completionDate).isBefore(moment(end).endOf('day')) || moment(r.completionDate).isSame(moment(end).endOf('day')))
    return rows
  }, [completedAthlete, completedFormName, completedStatus, completedDateRange])

  const completedColumns = useMemo(
    () => [
      {
        field: 'athleteName',
        headerName: 'Athlete',
        width: 160,
        headerClassName: 'grid-cell--pad-left',
        cellClassName: 'grid-cell--pad-left',
        renderCell: (params) => (
          <Link
            component="button"
            underline="none"
            onClick={(e) => {
              e.stopPropagation()
              navigate(`/forms/form_answers_sets/${params.row.id}`, { state: { athleteName: params.row.athleteName } })
            }}
            sx={{ color: 'var(--color-primary)', fontFamily: 'var(--font-family-primary)', fontSize: 'var(--font-size-sm)', '&:hover': { color: 'var(--color-primary-hover)' } }}
          >
            {params.value}
          </Link>
        )
      },
      {
        field: 'formName',
        headerName: 'Form name',
        flex: 1,
        minWidth: 180,
        renderCell: (params) => (
          <Link
            component="button"
            underline="none"
            onClick={(e) => {
              e.stopPropagation()
              navigate(`/forms/form_answers_sets/${params.row.id}`, { state: { athleteName: params.row.athleteName } })
            }}
            sx={{ color: 'var(--color-primary)', fontWeight: 600, fontFamily: 'var(--font-family-primary)', fontSize: 'var(--font-size-sm)', '&:hover': { color: 'var(--color-primary-hover)' } }}
          >
            {params.value}
          </Link>
        )
      },
      { field: 'productArea', headerName: 'Product area', width: 120 },
      { field: 'category', headerName: 'Category', width: 100 },
      { field: 'examiner', headerName: 'Examiner', width: 140 },
      { field: 'completionDate', headerName: 'Completion date', width: 130 },
      {
        field: 'formStatus',
        headerName: 'Form status',
        width: 110,
        renderCell: (params) => {
          const status = params.value
          const type = status === 'Complete' ? 'success' : status === 'In progress' ? 'warning' : 'error'
          return <StatusChip status={status} type={type} />
        }
      },
      {
        field: 'delete',
        headerName: '',
        sortable: false,
        width: 56,
        align: 'right',
        headerClassName: 'grid-cell--pad-right',
        cellClassName: 'grid-cell--pad-right',
        renderCell: (params) => (
          <IconButton
            aria-label="Delete"
            onClick={(e) => {
              e.stopPropagation()
            }}
            sx={{ color: 'var(--color-text-secondary)' }}
          >
            <Icon icon="delete" size="medium" />
          </IconButton>
        )
      }
    ],
    [navigate]
  )

  // —— Compliance tab ——
  const [complianceAthlete, setComplianceAthlete] = useState(null)
  const [complianceFormName, setComplianceFormName] = useState(null)
  const [complianceSquad, setComplianceSquad] = useState(null)
  const [complianceDateRange, setComplianceDateRange] = useState([null, null])
  const [expandedRows, setExpandedRows] = useState(new Set())

  const toggleRowExpansion = useCallback((rowId) => {
    setExpandedRows((prev) => {
      const next = new Set(prev)
      if (next.has(rowId)) {
        next.delete(rowId)
      } else {
        next.add(rowId)
      }
      return next
    })
  }, [])

  const complianceFilteredRows = useMemo(() => {
    let rows = complianceRowsData
    if (complianceAthlete) rows = rows.filter((r) => r.athleteName === complianceAthlete)
    if (complianceSquad) rows = rows.filter((r) => r.squad === complianceSquad)

    // Form name and date range apply to each athlete's forms; athletes with no matching forms drop out
    const formQuery = String(complianceFormName || '').trim().toLowerCase()
    const [start, end] = complianceDateRange || [null, null]
    const isInDateRange = (dateText) => {
      const date = moment(dateText, 'D MMM YYYY', true)
      if (!date.isValid()) return false
      if (start && date.isBefore(moment(start), 'day')) return false
      if (end && date.isAfter(moment(end), 'day')) return false
      return true
    }
    if (formQuery || start || end) {
      rows = rows
        .map((r) => ({
          ...r,
          subRows: (r.subRows || []).filter((sub) =>
            (!formQuery || (sub.formName || '').toLowerCase().includes(formQuery)) &&
            (!(start || end) || isInDateRange(sub.lastUpdated))
          ),
        }))
        .filter((r) => r.subRows.length > 0)
    }
    // Flatten rows with expanded sub-rows
    const flattenedRows = []
    rows.forEach((row) => {
      flattenedRows.push({ ...row, isParent: true, hasSubRows: row.subRows && row.subRows.length > 0 })
      if (expandedRows.has(row.id) && row.subRows) {
        row.subRows.forEach((subRow) => {
          flattenedRows.push({ ...subRow, isSubRow: true, parentId: row.id })
        })
      }
    })
    return flattenedRows
  }, [complianceAthlete, complianceFormName, complianceSquad, complianceDateRange, expandedRows])

  const complianceColumns = useMemo(
    () => [
      {
        field: 'expand',
        headerName: '',
        width: 48,
        sortable: false,
        filterable: false,
        disableColumnMenu: true,
        headerClassName: 'grid-cell--pad-left',
        cellClassName: 'grid-cell--pad-left',
        renderCell: (params) => {
          if (params.row.isSubRow) return null
          if (!params.row.hasSubRows) return <Box sx={{ width: 24 }} />
          const isExpanded = expandedRows.has(params.row.id)
          return (
            <IconButton
              onClick={(e) => {
                e.stopPropagation()
                toggleRowExpansion(params.row.id)
              }}
              sx={{
                p: 0.5,
                color: 'var(--color-text-secondary)',
                transition: 'transform 0.2s ease',
                transform: isExpanded ? 'rotate(0deg)' : 'rotate(0deg)',
                '&:hover': { color: 'var(--color-primary)' }
              }}
            >
              {isExpanded ? <KeyboardArrowDownOutlined fontSize="small" /> : <KeyboardArrowRightOutlined fontSize="small" />}
            </IconButton>
          )
        }
      },
      {
        field: 'athleteName',
        headerName: 'Athlete',
        flex: 1,
        minWidth: 260,
        renderCell: (params) => {
          if (params.row.isSubRow) {
            return (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, pl: 2 }}>
                <Typography variant="body2" sx={{ color: 'var(--color-text-primary)', fontFamily: 'var(--font-family-primary)', fontSize: 'var(--font-size-sm)' }}>
                  {params.row.formName}
                </Typography>
              </Box>
            )
          }
          return (
            <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', py: 0.5 }}>
              <Typography variant="body2" sx={{ fontWeight: 600, color: 'var(--color-text-primary)', fontFamily: 'var(--font-family-primary)', fontSize: 'var(--font-size-sm)', lineHeight: 1.4 }}>
                {params.row.athleteName}
              </Typography>
              <Typography variant="caption" sx={{ color: 'var(--color-text-secondary)', fontFamily: 'var(--font-family-primary)', fontSize: 'var(--font-size-xs)', lineHeight: 1.3 }}>
                {params.row.position}
              </Typography>
            </Box>
          )
        }
      },
      {
        field: 'lastUpdated',
        headerName: 'Last updated',
        minWidth: 160,
        renderCell: (params) => {
          if (params.row.isSubRow) {
            return (
              <Typography variant="body2" sx={{ color: 'var(--color-text-secondary)', fontFamily: 'var(--font-family-primary)', fontSize: 'var(--font-size-sm)' }}>
                {params.row.lastUpdated ?? '—'}
              </Typography>
            )
          }
          return params.row.lastUpdated ?? '—'
        }
      },
      {
        field: 'status',
        headerName: 'Status',
        minWidth: 120,
        headerClassName: 'grid-cell--pad-right',
        cellClassName: 'grid-cell--pad-right',
        renderCell: (params) => {
          if (params.row.isSubRow) {
            const status = params.row.status
            // Draft = orange/warning, Complete = green/success, Not Started = red/error
            const type = status === 'Complete' ? 'success' : status === 'Draft' ? 'warning' : 'error'
            return <StatusChip status={status} type={type} />
          }
          return (
            <StatusChip status={`${params.row.complete}/${params.row.total}`} type={params.row.complete === params.row.total ? 'success' : 'error'} />
          )
        }
      }
    ],
    [expandedRows, toggleRowExpansion]
  )

  // —— Scheduling Overview tab ——
  const [schedulingPlayerFilter, setSchedulingPlayerFilter] = useState(null)
  const [schedulingCategoryFilter, setSchedulingCategoryFilter] = useState(null)
  const [schedulingDateFilter, setSchedulingDateFilter] = useState(null)
  const [schedulingTimeRange, setSchedulingTimeRange] = useState('upcoming') // 'upcoming' | 'past'
  const [schedulingExpandedRows, setSchedulingExpandedRows] = useState(new Set())
  const [schedulingActionMenuAnchor, setSchedulingActionMenuAnchor] = useState(null)
  const [schedulingActionRowId, setSchedulingActionRowId] = useState(null)
  const [editScheduleOpen, setEditScheduleOpen] = useState(false)
  const [editingSchedule, setEditingSchedule] = useState(null)
  
  // Assigned Players drawer state
  const [assignedPlayersDrawerOpen, setAssignedPlayersDrawerOpen] = useState(false)
  const [assignedPlayersDrawerData, setAssignedPlayersDrawerData] = useState({ players: [], scheduleId: null })
  const [selectedAssignedPlayers, setSelectedAssignedPlayers] = useState([])

  const toggleSchedulingRowExpansion = useCallback((rowId) => {
    setSchedulingExpandedRows((prev) => {
      const next = new Set(prev)
      if (next.has(rowId)) {
        next.delete(rowId)
      } else {
        next.add(rowId)
      }
      return next
    })
  }, [])

  // Helper function to format date range
  const formatScheduleDateRange = (startDate, endDate) => {
    const start = moment(startDate)
    const end = moment(endDate)
    const startFormatted = start.format('MMMM D, YYYY, h:mm a')
    const endFormatted = end.format('MMMM D, YYYY')
    return `${startFormatted} – ${endFormatted}`
  }

  // Get unique players from scheduling data for filter
  const schedulingPlayerOptions = useMemo(() => {
    const allPlayers = new Set()
    schedulingRowsData.forEach((row) => {
      row.players.forEach((p) => allPlayers.add(p))
    })
    return [...allPlayers].sort()
  }, [])

  // Get unique categories from scheduling data for filter
  const schedulingCategoryOptions = useMemo(() => {
    return [...new Set(schedulingRowsData.map((r) => r.category))].sort()
  }, [])

  const schedulingFilteredRows = useMemo(() => {
    let rows = schedulingRowsData.filter((r) => {
      // Filter by upcoming/past
      if (schedulingTimeRange === 'upcoming' && !r.isUpcoming) return false
      if (schedulingTimeRange === 'past' && r.isUpcoming) return false
      return true
    })

    // Filter by player
    if (schedulingPlayerFilter) {
      rows = rows.filter((r) => r.players.includes(schedulingPlayerFilter))
    }

    // Filter by category
    if (schedulingCategoryFilter) {
      rows = rows.filter((r) => r.category === schedulingCategoryFilter)
    }

    // Filter by date
    if (schedulingDateFilter) {
      rows = rows.filter((r) => {
        const start = moment(r.startDate)
        const end = moment(r.endDate)
        const filterDate = moment(schedulingDateFilter)
        return filterDate.isBetween(start, end, 'day', '[]') || filterDate.isSame(start, 'day') || filterDate.isSame(end, 'day')
      })
    }

    // Flatten rows with expanded sub-rows (forms)
    const flattenedRows = []
    rows.forEach((row) => {
      flattenedRows.push({ ...row, isParent: true, hasSubRows: row.forms && row.forms.length > 0 })
      if (schedulingExpandedRows.has(row.id) && row.forms) {
        row.forms.forEach((form) => {
          flattenedRows.push({ ...form, isSubRow: true, parentId: row.id })
        })
      }
    })
    return flattenedRows
  }, [schedulingTimeRange, schedulingPlayerFilter, schedulingCategoryFilter, schedulingDateFilter, schedulingExpandedRows])

  // Render player names with tooltip
  const handleOpenAssignedPlayersDrawer = useCallback((players, scheduleId) => {
    setAssignedPlayersDrawerData({ players, scheduleId })
    setSelectedAssignedPlayers([...players]) // All players selected by default
    setAssignedPlayersDrawerOpen(true)
  }, [])

  const handleCloseAssignedPlayersDrawer = useCallback(() => {
    setAssignedPlayersDrawerOpen(false)
    setAssignedPlayersDrawerData({ players: [], scheduleId: null })
    setSelectedAssignedPlayers([])
  }, [])

  const handleToggleAssignedPlayer = useCallback((playerName) => {
    setSelectedAssignedPlayers((prev) =>
      prev.includes(playerName)
        ? prev.filter((p) => p !== playerName)
        : [...prev, playerName]
    )
  }, [])

  const handleSaveAssignedPlayers = useCallback(() => {
    // Handle save logic here - for now just log and close
     
    console.log('Saved assigned players:', selectedAssignedPlayers)
    handleCloseAssignedPlayersDrawer()
  }, [selectedAssignedPlayers, handleCloseAssignedPlayersDrawer])

  const schedulingColumns = useMemo(
    () => {
      const renderPlayersCell = (players, scheduleId) => {
        if (!players || players.length === 0) return '—'
        const displayCount = 3
        const displayPlayers = players.slice(0, displayCount)
        const remaining = players.length - displayCount
        
        // Tooltip shows first 20 players + count of remaining
        const tooltipDisplayCount = 20
        const tooltipPlayers = players.slice(0, tooltipDisplayCount)
        const tooltipRemaining = players.length - tooltipDisplayCount
        const tooltipText = tooltipPlayers.join(', ') + (tooltipRemaining > 0 ? `, +${tooltipRemaining} more` : '')

        return (
          <Tooltip 
            title={tooltipText} 
            arrow 
            placement="top"
            slotProps={{
              tooltip: {
                sx: {
                  maxWidth: 400,
                  fontFamily: 'var(--font-family-primary)',
                  fontSize: 'var(--font-size-xs)',
                  backgroundColor: 'var(--color-text-secondary)',
                  color: 'var(--color-white)'
                }
              },
              arrow: {
                sx: {
                  color: 'var(--color-text-secondary)'
                }
              }
            }}
          >
            <Box 
              sx={{ 
                display: 'flex',
                alignItems: 'center',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              }}
            >
              <Typography 
                variant="body2" 
                component="span"
                sx={{ 
                  color: 'var(--color-text-primary)', 
                  fontFamily: 'var(--font-family-primary)', 
                  fontSize: 'var(--font-size-sm)',
                }}
              >
                {displayPlayers.join(', ')}
              </Typography>
              {remaining > 0 && (
                <>
                  <Typography 
                    variant="body2" 
                    component="span"
                    sx={{ 
                      color: 'var(--color-text-primary)', 
                      fontFamily: 'var(--font-family-primary)', 
                      fontSize: 'var(--font-size-sm)',
                    }}
                  >
                    , …{' '}
                  </Typography>
                  <Typography 
                    variant="body2" 
                    component="span"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleOpenAssignedPlayersDrawer(players, scheduleId)
                    }}
                    sx={{ 
                      color: 'var(--color-primary)', 
                      fontFamily: 'var(--font-family-primary)', 
                      fontSize: 'var(--font-size-sm)',
                      cursor: 'pointer',
                      '&:hover': {
                        textDecoration: 'underline',
                      }
                    }}
                  >
                    +{remaining} more
                  </Typography>
                </>
              )}
            </Box>
          </Tooltip>
        )
      }

      return [
      {
        field: 'expand',
        headerName: '',
        width: 48,
        sortable: false,
        filterable: false,
        disableColumnMenu: true,
        headerClassName: 'grid-cell--pad-left',
        cellClassName: 'grid-cell--pad-left',
        renderCell: (params) => {
          if (params.row.isSubRow) return null
          if (!params.row.hasSubRows) return <Box sx={{ width: 24 }} />
          const isExpanded = schedulingExpandedRows.has(params.row.id)
          return (
            <IconButton
              onClick={(e) => {
                e.stopPropagation()
                toggleSchedulingRowExpansion(params.row.id)
              }}
              sx={{
                p: 0.5,
                color: 'var(--color-text-secondary)',
                transition: 'transform 0.2s ease',
                '&:hover': { color: 'var(--color-primary)' }
              }}
            >
              {isExpanded ? <KeyboardArrowDownOutlined fontSize="small" /> : <KeyboardArrowRightOutlined fontSize="small" />}
            </IconButton>
          )
        }
      },
      {
        field: 'schedule',
        headerName: 'Schedule',
        flex: 1,
        minWidth: 360,
        renderCell: (params) => {
          if (params.row.isSubRow) {
            return (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, pl: 2 }}>
                <Typography variant="body2" sx={{ color: 'var(--color-text-primary)', fontFamily: 'var(--font-family-primary)', fontSize: 'var(--font-size-sm)' }}>
                  {params.row.formName}
                </Typography>
              </Box>
            )
          }
          return (
            <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', py: 0.5 }}>
              <Typography variant="body2" sx={{ fontWeight: 600, color: 'var(--color-text-primary)', fontFamily: 'var(--font-family-primary)', fontSize: 'var(--font-size-sm)', lineHeight: 1.4 }}>
                {params.row.scheduleName}
              </Typography>
              <Typography variant="caption" sx={{ color: 'var(--color-text-secondary)', fontFamily: 'var(--font-family-primary)', fontSize: 'var(--font-size-xs)', lineHeight: 1.3 }}>
                {formatScheduleDateRange(params.row.startDate, params.row.endDate)}
              </Typography>
            </Box>
          )
        }
      },
      {
        field: 'players',
        headerName: 'Players',
        flex: 1,
        minWidth: 300,
        renderCell: (params) => {
          if (params.row.isSubRow) return null
          return renderPlayersCell(params.row.players, params.row.id)
        }
      },
      {
        field: 'actions',
        headerName: '',
        sortable: false,
        filterable: false,
        width: 56,
        align: 'right',
        headerAlign: 'right',
        headerClassName: 'grid-cell--pad-right',
        cellClassName: 'grid-cell--pad-right',
        renderCell: (params) => {
          if (params.row.isSubRow) return null
          return (
            <IconButton
              aria-label="more"
              onClick={(e) => {
                e.stopPropagation()
                setSchedulingActionMenuAnchor(e.currentTarget)
                setSchedulingActionRowId(params.row.id)
              }}
              sx={{ color: 'var(--color-text-secondary)' }}
            >
              <MoreVertOutlined fontSize="small" />
            </IconButton>
          )
        }
      }
    ]
    },
    [schedulingExpandedRows, toggleSchedulingRowExpansion, handleOpenAssignedPlayersDrawer]
  )

  return (
    <LocalizationProvider dateAdapter={AdapterMoment}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0, bgcolor: 'var(--color-background-primary)', height: '100%', fontFamily: 'var(--font-family-primary)' }}>
        <PageHeader
          title="Forms"
          primaryAction={{ id: 'create', label: 'Create form', onClick: () => setIsCreateOpen(true) }}
          moreActions={[{ id: 'notifications', label: 'Form notifications', onClick: () => setIsNotificationDrawerOpen(true) }]}
        />

        <Paper elevation={0} sx={{ borderRadius: 'var(--radius-md)', overflow: 'hidden', flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
          <Tabs
            value={tabValue}
            onChange={(_, v) => setTabValue(v)}
            aria-label="Forms tabs"
            sx={{
              px: 3,
              pt: 1,
              minHeight: 44,
              borderBottom: '1px solid var(--color-border-primary)',
              '& .MuiTab-root': {
                minHeight: 44,
                textTransform: 'none',
                fontWeight: 600,
                fontSize: 'var(--font-size-sm)',
                fontFamily: 'var(--font-family-primary)',
                color: 'var(--color-text-muted)'
              },
              '& .MuiTab-root.Mui-selected': { color: 'var(--color-primary)' },
              '& .MuiTabs-indicator': { backgroundColor: 'var(--color-primary)' }
            }}
          >
            <Tab label="Templates" {...a11yProps(0)} />
            <Tab label="Scheduling Overview" {...a11yProps(1)} />
            <Tab label="Completed" {...a11yProps(2)} />
            <Tab label="Compliance" {...a11yProps(3)} />
            <Tab label="Tryouts" {...a11yProps(4)} />
          </Tabs>

          {/* Templates tab */}
          <TabPanel value={tabValue} index={0}>
            <Box sx={{ px: 3, py: 1.5, display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap', flexShrink: 0 }}>
              <TextField
                size="small"
                variant="filled"
                placeholder="Search"
                value={searchForm}
                onChange={(e) => setSearchForm(e.target.value)}
                sx={{ minWidth: 260 }}
                slotProps={{
                  input: {
                    sx: typographyStyles,
                    endAdornment: (
                      <InputAdornment position="end">
                        <SearchOutlined fontSize="small" sx={{ color: 'var(--color-primary)' }} />
                      </InputAdornment>
                    )
                  }
                }}
              />
              <TextField
                select
                size="small"
                variant="filled"
                label="Category"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                sx={{ minWidth: 220 }}
                slotProps={{
                  input: { sx: typographyStyles }
                }}
              >
                <MenuItem value="">All</MenuItem>
                <MenuItem value="Other">Other</MenuItem>
                <MenuItem value="Wellbeing">Wellbeing</MenuItem>
                <MenuItem value="Medical">Medical</MenuItem>
              </TextField>
            </Box>
            <Box sx={{
              ...gridSx,
              '& .MuiDataGrid-row': {
                cursor: 'pointer',
                '&:hover': {
                  backgroundColor: 'var(--color-background-hover)'
                }
              }
            }}>
              <DataGridPremium
                rows={formsRows}
                columns={formsColumns}
                disableRowSelectionOnClick
                aiAssistant
                chartsIntegration
                onPrompt={resolveGridPrompt}
                aiAssistantSuggestions={FORMS_AI_SUGGESTIONS}
                allowAiAssistantDataSampling
                onRowClick={(params) => navigate(`/forms/${params.row.id}/assignments`)}
                pagination
                paginationModel={paginationModel}
                onPaginationModelChange={setPaginationModel}
                pageSizeOptions={[25, 50, 100]}
                slots={{ pagination: GridPagination }}
                slotProps={{ pagination: { showFirstButton: true, showLastButton: true } }}
                initialState={{ pagination: { paginationModel: { pageSize: 25 } } }}
              />
            </Box>
          </TabPanel>

          {/* Scheduling Overview tab */}
          <TabPanel value={tabValue} index={1}>
            <Box sx={{ px: 3, py: 1.5, display: 'flex', flexDirection: 'column', gap: 1.5, flexShrink: 0 }}>
              {/* Filters row */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
                <Autocomplete
                  size="small"
                  options={schedulingPlayerOptions}
                  value={schedulingPlayerFilter}
                  onChange={(_, v) => setSchedulingPlayerFilter(v)}
                  popupIcon={<ArrowDropDownOutlined fontSize="small" sx={{ color: 'var(--color-primary)' }} />}
                  renderInput={(params) => <TextField {...params} label="Players" variant="filled" />}
                  sx={{ minWidth: 200 }}
                />
                <TextField
                  select
                  size="small"
                  variant="filled"
                  label="Category"
                  value={schedulingCategoryFilter || ''}
                  onChange={(e) => setSchedulingCategoryFilter(e.target.value || null)}
                  sx={{ minWidth: 160 }}
                >
                  <MenuItem value="">All</MenuItem>
                  {schedulingCategoryOptions.map((cat) => (
                    <MenuItem key={cat} value={cat}>{cat}</MenuItem>
                  ))}
                </TextField>
                <DatePicker
                  label="Date"
                  value={schedulingDateFilter}
                  onChange={(newValue) => setSchedulingDateFilter(newValue)}
                  slotProps={{
                    textField: {
                      size: 'small',
                      variant: 'filled',
                      sx: { minWidth: 180 }
                    }
                  }}
                  sx={{
                    '& .MuiInputBase-root': { fontFamily: 'var(--font-family-primary)', fontSize: 'var(--font-size-sm)' },
                    '& .MuiIconButton-root': { color: 'var(--color-primary)' }
                  }}
                />
              </Box>
              {/* Upcoming / Past toggle */}
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <ToggleButtonGroup
                  value={schedulingTimeRange}
                  exclusive
                  onChange={(_, newValue) => {
                    if (newValue !== null) setSchedulingTimeRange(newValue)
                  }}
                  size="small"
                  aria-label="Filter by upcoming or past schedules"
                  sx={{
                    '& .MuiToggleButton-root': {
                      textTransform: 'none',
                      fontWeight: 600,
                      fontFamily: 'var(--font-family-primary)',
                      fontSize: 'var(--font-size-sm)',
                      px: 2.5,
                      py: 0.75,
                      border: '1px solid var(--color-border-primary)',
                      '&.Mui-selected': {
                        color: 'var(--color-white)',
                        backgroundColor: 'var(--color-primary)',
                        '&:hover': {
                          backgroundColor: 'var(--color-primary-hover)'
                        }
                      },
                      '&:not(.Mui-selected)': {
                        color: 'var(--color-text-secondary)',
                        backgroundColor: 'var(--color-background-secondary)',
                        '&:hover': {
                          backgroundColor: 'var(--color-background-hover)'
                        }
                      }
                    },
                    '& .MuiToggleButton-root:first-of-type': {
                      borderRadius: 'var(--radius-md) 0 0 var(--radius-md)'
                    },
                    '& .MuiToggleButton-root:last-of-type': {
                      borderRadius: '0 var(--radius-md) var(--radius-md) 0'
                    }
                  }}
                >
                  <ToggleButton value="upcoming">Upcoming</ToggleButton>
                  <ToggleButton value="past">Past</ToggleButton>
                </ToggleButtonGroup>
              </Box>
            </Box>
            <Box sx={{
              ...gridSx,
              '& .scheduling-sub-row': {
                backgroundColor: 'var(--color-background-secondary)',
                '&:hover': { backgroundColor: 'var(--color-background-hover)' }
              }
            }}>
              <DataGridPremium
                rows={schedulingFilteredRows}
                columns={schedulingColumns}
                disableRowSelectionOnClick
                pagination
                paginationModel={paginationModel}
                onPaginationModelChange={setPaginationModel}
                pageSizeOptions={[25, 50, 100]}
                slots={{ pagination: GridPagination }}
                slotProps={{ pagination: { showFirstButton: true, showLastButton: true } }}
                getRowClassName={(params) => params.row.isSubRow ? 'scheduling-sub-row' : ''}
                getRowHeight={(params) => params.model.isSubRow ? 44 : (params.model.isParent ? 64 : 52)}
              />
            </Box>
          </TabPanel>

          {/* Completed tab */}
          <TabPanel value={tabValue} index={2}>
            <Box sx={{ px: 3, py: 1.5, display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap', flexShrink: 0 }}>
              <Autocomplete
                size="small"
                options={[...new Set(completedRowsData.map((r) => r.athleteName))]}
                value={completedAthlete}
                onChange={(_, v) => setCompletedAthlete(v)}
                popupIcon={<ArrowDropDownOutlined fontSize="small" sx={{ color: 'var(--color-primary)' }} />}
                renderInput={(params) => <TextField {...params} label="Athletes" variant="filled" />}
                sx={{ minWidth: 200 }}
              />
              <TextField
                size="small"
                variant="filled"
                label="Form"
                placeholder="Form"
                value={completedFormName || ''}
                onChange={(e) => setCompletedFormName(e.target.value)}
                sx={{ minWidth: 180 }}
              />
              <TextField
                select
                size="small"
                variant="filled"
                label="Status"
                value={completedStatus || ''}
                onChange={(e) => setCompletedStatus(e.target.value)}
                sx={{ minWidth: 140 }}
              >
                <MenuItem value="">All</MenuItem>
                <MenuItem value="Complete">Complete</MenuItem>
                <MenuItem value="In progress">In progress</MenuItem>
                <MenuItem value="Not started">Not started</MenuItem>
              </TextField>
              <TextField select size="small" variant="filled" label="Category" sx={{ minWidth: 140 }}>
                <MenuItem value="">All</MenuItem>
                <MenuItem value="Other">Other</MenuItem>
              </TextField>
              <DateRangePicker
                slots={{ field: MultiInputDateRangeField }}
                value={completedDateRange}
                onChange={(newValue) => setCompletedDateRange(newValue)}
                slotProps={{
                  textField: {
                    size: 'small',
                    variant: 'filled',
                    sx: { minWidth: 260 },
                  }
                }}
                sx={{
                  '& .MuiInputBase-root': { fontFamily: 'var(--font-family-primary)', fontSize: 'var(--font-size-sm)' },
                  '& .MuiIconButton-root': { color: 'var(--color-primary)' }
                }}
              />
            </Box>
            <Box sx={gridSx}>
              <DataGridPremium
                rows={completedFilteredRows}
                columns={completedColumns}
                disableRowSelectionOnClick
                aiAssistant
                chartsIntegration
                onPrompt={resolveGridPrompt}
                aiAssistantSuggestions={COMPLETED_FORMS_AI_SUGGESTIONS}
                allowAiAssistantDataSampling
                pagination
                paginationModel={paginationModel}
                onPaginationModelChange={setPaginationModel}
                pageSizeOptions={[25, 50, 100]}
                slots={{ pagination: GridPagination }}
                slotProps={{ pagination: { showFirstButton: true, showLastButton: true } }}
              />
            </Box>
          </TabPanel>

          {/* Compliance tab */}
          <TabPanel value={tabValue} index={3}>
            <Box sx={{ px: 3, py: 1.5, display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap', flexShrink: 0 }}>
              <Autocomplete
                size="small"
                options={complianceRowsData.map((r) => r.athleteName)}
                value={complianceAthlete}
                onChange={(_, v) => setComplianceAthlete(v)}
                popupIcon={<ArrowDropDownOutlined fontSize="small" sx={{ color: 'var(--color-primary)' }} />}
                renderInput={(params) => <TextField {...params} label="Athletes" variant="filled" />}
                sx={{ minWidth: 200 }}
              />
              <TextField
                size="small"
                variant="filled"
                label="Form"
                value={complianceFormName || ''}
                onChange={(e) => setComplianceFormName(e.target.value)}
                sx={{ minWidth: 180 }}
              />
              <TextField
                select
                size="small"
                variant="filled"
                label="Squad"
                value={complianceSquad || ''}
                onChange={(e) => setComplianceSquad(e.target.value)}
                sx={{ minWidth: 160 }}
              >
                <MenuItem value="">All</MenuItem>
                {[...new Set(complianceRowsData.map((r) => r.squad).filter(Boolean))].map((squad) => (
                  <MenuItem key={squad} value={squad}>{squad}</MenuItem>
                ))}
              </TextField>
              <DateRangePicker
                slots={{ field: MultiInputDateRangeField }}
                value={complianceDateRange}
                onChange={(newValue) => setComplianceDateRange(newValue)}
                slotProps={{
                  textField: {
                    size: 'small',
                    variant: 'filled',
                    sx: { minWidth: 260 },
                  }
                }}
                sx={{
                  '& .MuiInputBase-root': { fontFamily: 'var(--font-family-primary)', fontSize: 'var(--font-size-sm)' },
                  '& .MuiIconButton-root': { color: 'var(--color-primary)' }
                }}
              />
            </Box>
            <Box sx={{
              ...gridSx,
              '& .compliance-sub-row': {
                backgroundColor: 'var(--color-background-secondary)',
                '&:hover': { backgroundColor: 'var(--color-background-hover)' }
              }
            }}>
              <DataGridPremium
                rows={complianceFilteredRows}
                columns={complianceColumns}
                disableRowSelectionOnClick
                pagination
                paginationModel={paginationModel}
                onPaginationModelChange={setPaginationModel}
                pageSizeOptions={[25, 50, 100]}
                slots={{ pagination: GridPagination }}
                slotProps={{ pagination: { showFirstButton: true, showLastButton: true } }}
                getRowClassName={(params) => params.row.isSubRow ? 'compliance-sub-row' : ''}
              />
            </Box>
          </TabPanel>

          {/* Tryouts tab */}
          <TabPanel value={tabValue} index={4}>
            <Box sx={{ px: 3, py: 3 }}>
              {/* Empty for now */}
            </Box>
          </TabPanel>
        </Paper>

        <Menu
          anchorEl={actionMenuAnchor}
          open={Boolean(actionMenuAnchor)}
          onClose={() => {
            setActionMenuAnchor(null)
            setActionRowId(null)
          }}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          transformOrigin={{ vertical: 'top', horizontal: 'right' }}
          slotProps={{ paper: {
            sx: {
              '& .MuiMenuItem-root': { 
                fontFamily: 'var(--font-family-primary)', 
                fontSize: 'var(--font-size-sm)',
                gap: 1
              }
            }
          } }}
        >
          <MenuItem
            onClick={() => {
              // Capture the form name before closing the menu
              const selectedForm = formsList.find((f) => f.id === actionRowId)
              setSelectedFormName(selectedForm?.form || '')
              setActionMenuAnchor(null)
              setAssignOpen(true)
              setActionRowId(null)
            }}
          >
            <IosShareOutlined fontSize="small" />
            Assign
          </MenuItem>
          <MenuItem
            onClick={() => {
              setActionMenuAnchor(null)
              if (actionRowId) navigate(`/forms/${actionRowId}/build`)
              setActionRowId(null)
            }}
          >
            <StickyNote2Outlined fontSize="small" />
            Start Form
          </MenuItem>
          <MenuItem
            onClick={() => {
              setActionMenuAnchor(null)
              setActionRowId(null)
            }}
          >
            <ContentCopyOutlined fontSize="small" />
            Duplicate
          </MenuItem>
          <MenuItem
            onClick={() => {
              setActionMenuAnchor(null)
              if (actionRowId) navigate(`/forms/${actionRowId}/build`)
              setActionRowId(null)
            }}
          >
            <EditOutlined fontSize="small" />
            Edit
          </MenuItem>
          <MenuItem
            onClick={() => {
              setActionMenuAnchor(null)
              setActionRowId(null)
            }}
          >
            <DeleteOutlined fontSize="small" />
            Delete
          </MenuItem>
          <MenuItem
            onClick={() => {
              setActionMenuAnchor(null)
              setExportOpen(true)
              setActionRowId(null)
            }}
          >
            <FileDownloadOutlined fontSize="small" />
            Export
          </MenuItem>
        </Menu>

        {/* Scheduling Overview action menu */}
        <Menu
          anchorEl={schedulingActionMenuAnchor}
          open={Boolean(schedulingActionMenuAnchor)}
          onClose={() => {
            setSchedulingActionMenuAnchor(null)
            setSchedulingActionRowId(null)
          }}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          transformOrigin={{ vertical: 'top', horizontal: 'right' }}
          slotProps={{ paper: {
            sx: {
              '& .MuiMenuItem-root': { 
                fontFamily: 'var(--font-family-primary)', 
                fontSize: 'var(--font-size-sm)',
                gap: 1
              }
            }
          } }}
        >
          {(() => {
            const currentSchedule = schedulingRowsData.find(r => r.id === schedulingActionRowId)
            const isPastSchedule = currentSchedule && !currentSchedule.isUpcoming
            return isPastSchedule ? null : (
              <MenuItem
                onClick={() => {
                  setEditingSchedule(currentSchedule)
                  setEditScheduleOpen(true)
                  setSchedulingActionMenuAnchor(null)
                  setSchedulingActionRowId(null)
                }}
              >
                <EditOutlined fontSize="small" />
                Edit Schedule
              </MenuItem>
            )
          })()}
          <MenuItem
            onClick={() => {
              setSchedulingActionMenuAnchor(null)
              setSchedulingActionRowId(null)
            }}
          >
            <ContentCopyOutlined fontSize="small" />
            Duplicate
          </MenuItem>
          <MenuItem
            onClick={() => {
              setSchedulingActionMenuAnchor(null)
              setSchedulingActionRowId(null)
            }}
          >
            <DeleteOutlined fontSize="small" />
            Delete
          </MenuItem>
        </Menu>

        <EditScheduleDrawer
          open={editScheduleOpen}
          onClose={() => {
            setEditScheduleOpen(false)
            setEditingSchedule(null)
          }}
          onSave={(data) => {
            // Handle save here
             
            console.log('Schedule saved:', data)
            setEditScheduleOpen(false)
            setEditingSchedule(null)
          }}
          schedule={editingSchedule}
          allPlayers={schedulingPlayerOptions}
        />

        {/* Assigned Players Drawer */}
        <Drawer
          anchor="right"
          open={assignedPlayersDrawerOpen}
          onClose={handleCloseAssignedPlayersDrawer}
          slotProps={{
            paper: {
              sx: {
                width: 400,
                maxWidth: '100vw',
                height: '100vh',
                display: 'flex',
                flexDirection: 'column'
              }
            }
          }}
        >
          {/* Header */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              px: 3,
              py: 2,
              borderBottom: '1px solid var(--color-border-primary)'
            }}
          >
            <Typography
              variant="h6"
              sx={{
                fontWeight: 600,
                fontFamily: 'var(--font-family-primary)',
                fontSize: 'var(--font-size-lg)',
                color: 'var(--color-text-primary)'
              }}
            >
              Assigned Players
            </Typography>
            <IconButton onClick={handleCloseAssignedPlayersDrawer} aria-label="Close">
              <CloseOutlined />
            </IconButton>
          </Box>

          {/* Body */}
          <Box sx={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
            {/* Selected count */}
            <Box sx={{ px: 3, py: 2, borderBottom: '1px solid var(--color-border-secondary)' }}>
              <Typography
                variant="body2"
                sx={{
                  fontWeight: 600,
                  fontFamily: 'var(--font-family-primary)',
                  fontSize: 'var(--font-size-sm)',
                  color: 'var(--color-text-primary)'
                }}
              >
                Selected {selectedAssignedPlayers.length}
              </Typography>
            </Box>

            {/* Player list with checkboxes */}
            <List sx={{ flex: 1, py: 0 }}>
              {assignedPlayersDrawerData.players.map((playerName) => (
                <ListItemButton
                  key={playerName}
                  dense
                  onClick={() => handleToggleAssignedPlayer(playerName)}
                  sx={{
                    px: 3,
                    py: 1,
                    '&:hover': {
                      backgroundColor: 'var(--color-background-hover)'
                    }
                  }}>
                  <ListItemIcon sx={{ minWidth: 40 }}>
                    <Checkbox
                      edge="start"
                      checked={selectedAssignedPlayers.includes(playerName)}
                      tabIndex={-1}
                      disableRipple
                      sx={{
                        color: 'var(--color-border-primary)',
                        '&.Mui-checked': {
                          color: 'var(--color-primary)'
                        }
                      }}
                    />
                  </ListItemIcon>
                  <ListItemText
                    primary={playerName}
                    slotProps={{
                      primary: {
                        sx: {
                          fontFamily: 'var(--font-family-primary)',
                          fontSize: 'var(--font-size-sm)',
                          color: 'var(--color-text-primary)'
                        }
                      }
                    }}
                  />
                </ListItemButton>
              ))}
            </List>
          </Box>

          {/* Footer */}
          <Box
            sx={{
              px: 3,
              py: 2,
              display: 'flex',
              justifyContent: 'flex-end',
              gap: 1.5,
              borderTop: '1px solid var(--color-border-primary)'
            }}
          >
            <Button
 disableElevation={true}
              variant="contained" color="secondary"
              onClick={handleCloseAssignedPlayersDrawer}
              sx={{
                borderColor: 'var(--color-border-primary)',
                color: 'var(--color-text-primary)',
                fontFamily: 'var(--font-family-primary)',
                fontSize: 'var(--font-size-sm)',
                fontWeight: 600,
                textTransform: 'none',
                '&:hover': {
                  borderColor: 'var(--color-border-focus)',
                  backgroundColor: 'var(--color-background-hover)'
                }
              }}
            >
              Cancel
            </Button>
            <Button
 disableElevation={true}
              variant="contained" color="primary"
              onClick={handleSaveAssignedPlayers}
              sx={{
                backgroundColor: 'var(--color-primary)',
                color: 'var(--color-white)',
                fontFamily: 'var(--font-family-primary)',
                fontSize: 'var(--font-size-sm)',
                fontWeight: 600,
                textTransform: 'none',
                '&:hover': {
                  backgroundColor: 'var(--color-primary-hover)'
                }
              }}
            >
              Save
            </Button>
          </Box>
        </Drawer>

        <AssignFormDrawer
          open={assignOpen}
          onClose={() => {
            setAssignOpen(false)
            setSelectedFormName('')
          }}
          formName={selectedFormName}
          athletes={drawerAthletes}
          selectedAthletes={selectedAthletes}
          onSubmit={(data) => {
            setSelectedAthletes(data.selectedAthletes)
            // Handle assignment submission here
             
            console.log('Form assignment:', data)
          }}
        />

        <CreateFormDrawer
          open={isCreateOpen}
          onClose={() => setIsCreateOpen(false)}
          onSubmit={handleCreateForm}
          categories={['Medical', 'Performance', 'Wellbeing', 'Other']}
        />

        <ExportFormDrawer
          open={exportOpen}
          onClose={() => setExportOpen(false)}
          athletes={drawerAthletes}
        />
        <NotificationDrawer
          open={isNotificationDrawerOpen}
          onClose={() => setIsNotificationDrawerOpen(false)}
        />
      </Box>
    </LocalizationProvider>
  );
}
