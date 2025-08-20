import React from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box,
  Paper,
  Typography,
  Tabs,
  Tab,
  Divider,
  Autocomplete,
  TextField,
  Link
} from '@mui/material'
import { ArrowDropDownOutlined } from '@mui/icons-material'
import { DataGrid, GridPagination, GridToolbar } from '@mui/x-data-grid'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import dayjs from 'dayjs'
import '../../styles/design-tokens.css'
import { Button, StatusChip, Icon, PlayerAvatar } from '../../components'

function a11yProps(index) {
  return {
    id: `form-responses-tab-${index}`,
    'aria-controls': `form-responses-tabpanel-${index}`
  }
}

function TabPanel(props) {
  const { children, value, index, ...other } = props
  if (value !== index) return null
  return (
    <Box
      role="tabpanel"
      id={`form-responses-tabpanel-${index}`}
      aria-labelledby={`form-responses-tab-${index}`}
      sx={{ pt: 2 }}
      {...other}
    >
      {children}
    </Box>
  )
}

function Screen02_FormResponses() {
  const navigate = useNavigate()
  const location = window?.history?.state?.usr || {}

  // Stubbed data for the grid; wire this to real data later
  const allForms = React.useMemo(() => ([
    { id: 378, name: 'Test - Toggle Switch', updatedAt: 'July 17, 2025 11:22 am' },
    { id: 364, name: 'RFU Exit Medical', updatedAt: 'May 20, 2025 11:49 am' },
    { id: 348, name: 'More than equal', updatedAt: 'April 09, 2025 9:57 am' },
    { id: 347, name: 'Hilly test', updatedAt: 'March 28, 2025 2:03 pm' },
    { id: 346, name: 'Form with conditional', updatedAt: 'March 21, 2025 12:18 pm' },
  ]), [])

  const [tabValue, setTabValue] = React.useState(
    location.initialTab === 'compliance' ? 2 : (location.initialTab === 'completed' ? 1 : 0)
  )
  const [selectedFormName, setSelectedFormName] = React.useState(null)
  const [paginationModel, setPaginationModel] = React.useState({ page: 0, pageSize: 25 })

  // Stubbed data for Completed tab based on the provided dump
  const completedRows = React.useMemo(() => ([
    { id: 467635, athleteName: 'Allan Santos Athlete', name: 'Test - Toggle Switch', productArea: 'Medical', category: 'Other', examiner: 'Bhuvan Bhatt', completionDate: 'Jul 17, 2025', status: 'Complete' },
    { id: 467105, athleteName: 'test', name: 'Test - Toggle Switch', productArea: 'Medical', category: 'Other', examiner: 'Bhuvan Bhatt', completionDate: 'Jul 17, 2025', status: 'Complete' },
    { id: 467101, athleteName: 'Allan Santos', name: 'Test - Toggle Switch', productArea: 'Medical', category: 'Other', examiner: 'Bhuvan Bhatt', completionDate: 'Jul 17, 2025', status: 'Complete' },
    { id: 467095, athleteName: 'Akanksha', name: 'Test - Toggle Switch', productArea: 'Medical', category: 'Other', examiner: 'Bhuvan Bhatt', completionDate: 'Jul 17, 2025', status: 'Complete' },
    { id: 467088, athleteName: 'Adam Conway', name: 'Test - Toggle Switch', productArea: 'Medical', category: 'Other', examiner: 'Bhuvan Bhatt', completionDate: 'Jul 17, 2025', status: 'Complete' },
    { id: 467087, athleteName: 'Adam Conway', name: 'General Medical', productArea: 'Medical', category: 'Other', examiner: 'Willian Gama', completionDate: 'Jul 2, 2025', status: 'Complete' },
    { id: 467083, athleteName: 'Adam Conway', name: 'General Medical', productArea: 'Medical', category: 'Other', examiner: 'Willian Gama', completionDate: 'Jul 2, 2025', status: 'Complete' },
    { id: 467079, athleteName: 'Adam Conway', name: 'Kiosk Test', productArea: 'Medical', category: 'Other', examiner: 'Adam Conway', completionDate: 'Jun 26, 2025', status: 'Complete' },
  ]), [])

  const [completedFormName, setCompletedFormName] = React.useState(null)

  const completedFilteredRows = React.useMemo(() => {
    if (!completedFormName) return completedRows
    return completedRows.filter(r => r.name.toLowerCase().includes(String(completedFormName).toLowerCase()))
  }, [completedRows, completedFormName])

  const filteredRows = React.useMemo(() => {
    if (!selectedFormName) return allForms
    return allForms.filter(f => f.name.toLowerCase().includes(String(selectedFormName).toLowerCase()))
  }, [allForms, selectedFormName])

  const columns = React.useMemo(() => ([
    {
      field: 'name',
      headerName: 'Template',
      flex: 1,
      minWidth: 360,
      sortable: true,
      headerClassName: 'grid-cell--pad-left',
      cellClassName: 'grid-cell--pad-left',
      renderCell: (params) => (
        <Typography component="span" variant="body2" sx={{ fontWeight: 600, color: 'var(--color-text-primary)' }}>
          <Link
            component="button"
            underline="none"
            onClick={(e) => {
              e.stopPropagation()
              navigate(`/forms/form_answers_sets/forms/${params.row.id}`)
            }}
            sx={{ color: 'var(--color-text-primary)' }}
          >
            {params.value}
          </Link>
        </Typography>
      )
    },
    {
      field: 'updatedAt',
      headerName: 'Last updated at',
      width: 260,
      sortable: true,
      headerClassName: 'grid-cell--pad-right',
      cellClassName: 'grid-cell--pad-right',
    },
  ]), [navigate])

  const completedColumns = React.useMemo(() => ([
    {
      field: 'athleteName',
      headerName: 'Athlete',
      minWidth: 220,
      flex: 1,
      headerClassName: 'grid-cell--pad-left',
      cellClassName: 'grid-cell--pad-left',
      renderCell: (params) => (
        <Typography component="span" variant="body2" sx={{ color: 'var(--color-text-primary)' }}>
              <Link
            component="button"
            underline="none"
            onClick={(e) => {
              e.stopPropagation()
                  navigate(`/forms/form_answers_sets/${params.row.id}`,{ state: { athleteName: params.row.athleteName } })
            }}
            sx={{ color: 'var(--color-text-primary)' }}
          >
            {params.value}
          </Link>
        </Typography>
      )
    },
    {
      field: 'name',
      headerName: 'Template',
      minWidth: 260,
      flex: 1,
      renderCell: (params) => (
        <Typography component="span" variant="body2" sx={{ color: 'var(--color-text-primary)', fontWeight: 600 }}>
          <Link
            component="button"
            underline="none"
            onClick={(e) => {
              e.stopPropagation()
              navigate(`/forms/form_answers_sets/${params.row.id}`,{ state: { athleteName: params.row.athleteName } })
            }}
            sx={{ color: 'var(--color-text-primary)' }}
          >
            {params.value}
          </Link>
        </Typography>
      )
    },
    { field: 'productArea', headerName: 'Product area', minWidth: 120 },
    { field: 'category', headerName: 'Category', minWidth: 120 },
    { field: 'examiner', headerName: 'Examiner', minWidth: 180 },
    { field: 'completionDate', headerName: 'Completed on', minWidth: 140 },
    {
      field: 'status',
      headerName: 'Status',
      minWidth: 120,
      renderCell: (params) => (
        <StatusChip status={params.value} type="success" />
      )
    },
    {
      field: 'actions',
      headerName: '',
      sortable: false,
      align: 'right',
      headerAlign: 'right',
      minWidth: 120,
      headerClassName: 'grid-cell--pad-right',
      cellClassName: 'grid-cell--pad-right',
      renderCell: (params) => (
        <Button
          size="small"
          variant="secondary"
          aria-label="Delete"
          onClick={(e) => {
            e.stopPropagation()
            // TODO: hook up real delete
            // eslint-disable-next-line no-console
            console.log('Delete clicked for', params.row.id)
          }}
        >
          <Icon icon="delete" size="medium" />
        </Button>
      )
    },
  ]), [navigate])

  // Compliance tab: group by player with collapsible sections
  // Prototype data set for compliance view: includes mixed statuses and timestamps
  const complianceRows = React.useMemo(() => ([
    { id: 500001, athleteName: 'Harry Anderson', name: 'Medical Exam', lastUpdated: '2025-01-10T10:15:00Z', status: 'Draft' },
    { id: 500002, athleteName: 'Harry Anderson', name: 'Ortho Exam', lastUpdated: '2025-01-10T10:15:00Z', status: 'Draft' },
    { id: 500003, athleteName: 'Harry Anderson', name: 'Medical History Form', lastUpdated: '2025-01-05T10:15:00Z', status: 'Complete' },
    { id: 500004, athleteName: 'Harry Anderson', name: 'Use & Disclosure/Release', lastUpdated: '2025-01-10T10:15:00Z', status: 'Not started' },
    { id: 500005, athleteName: 'Harry Anderson', name: 'Tryout Agreement', lastUpdated: '2025-01-10T10:15:00Z', status: 'Not started' },
    { id: 500006, athleteName: 'Harry Anderson', name: 'Notice of Privacy Practice', lastUpdated: '2025-01-10T10:15:00Z', status: 'Not started' },
    { id: 500007, athleteName: 'Harry Anderson', name: 'Prescription Pick up', lastUpdated: '2025-01-10T10:15:00Z', status: 'Not started' },
    { id: 500008, athleteName: 'Harry Anderson', name: 'Medical Update Release', lastUpdated: '2025-01-10T10:15:00Z', status: 'Not started' },

    { id: 500101, athleteName: 'Bill Bryson', name: 'Medical Exam', lastUpdated: '2025-01-10T10:15:00Z', status: 'Done' },
    { id: 500102, athleteName: 'Bill Bryson', name: 'Ortho Exam', lastUpdated: '2025-01-10T10:15:00Z', status: 'Complete' },
    { id: 500103, athleteName: 'Bill Bryson', name: 'Medical History Form', lastUpdated: '2025-01-05T10:15:00Z', status: 'Complete' },
    { id: 500104, athleteName: 'Bill Bryson', name: 'Use & Disclosure/Release', lastUpdated: '2025-01-10T10:15:00Z', status: 'Not started' },

    { id: 500201, athleteName: 'Elena Rodriguez', name: 'Medical Exam', lastUpdated: '2025-01-11T09:20:00Z', status: 'In progress' },
    { id: 500202, athleteName: 'Elena Rodriguez', name: 'Ortho Exam', lastUpdated: '2025-01-11T09:20:00Z', status: 'Not started' },
    { id: 500203, athleteName: 'Elena Rodriguez', name: 'Medical History Form', lastUpdated: '2025-01-09T13:00:00Z', status: 'Draft' },
  ]), [])

  const [selectedPlayer, setSelectedPlayer] = React.useState(null)
  const [complianceFormName, setComplianceFormName] = React.useState(null)
  const [selectedStatus, setSelectedStatus] = React.useState(null)
  const [startDate, setStartDate] = React.useState(null)
  const [endDate, setEndDate] = React.useState(null)

  const statusOptions = React.useMemo(() => ['Complete', 'Done', 'Draft', 'Not started', 'In progress'], [])

  const complianceFilteredRows = React.useMemo(() => {
    let rows = complianceRows
    if (selectedPlayer) rows = rows.filter(r => r.athleteName === selectedPlayer)
    if (complianceFormName) rows = rows.filter(r => r.name.toLowerCase().includes(String(complianceFormName).toLowerCase()))
    if (selectedStatus) rows = rows.filter(r => r.status === selectedStatus)
    if (startDate) rows = rows.filter(r => dayjs(r.lastUpdated).isAfter(dayjs(startDate).startOf('day')) || dayjs(r.lastUpdated).isSame(dayjs(startDate).startOf('day')))
    if (endDate) rows = rows.filter(r => dayjs(r.lastUpdated).isBefore(dayjs(endDate).endOf('day')) || dayjs(r.lastUpdated).isSame(dayjs(endDate).endOf('day')))
    return rows
  }, [complianceRows, selectedPlayer, complianceFormName, selectedStatus, startDate, endDate])

  const complianceGroups = React.useMemo(() => {
    const map = new Map()
    for (const row of complianceFilteredRows) {
      const list = map.get(row.athleteName) || []
      list.push(row)
      map.set(row.athleteName, list)
    }
    return Array.from(map.entries())
      .map(([athleteName, rows]) => ({ athleteName, rows }))
      .sort((a, b) => a.athleteName.localeCompare(b.athleteName))
  }, [complianceFilteredRows])

  const [expandedGroups, setExpandedGroups] = React.useState({})
  const toggleGroup = (athleteName) => {
    setExpandedGroups(prev => ({ ...prev, [athleteName]: !prev[athleteName] }))
  }
  const areAllExpanded = React.useMemo(() => {
    if (complianceGroups.length === 0) return false
    return complianceGroups.every(g => expandedGroups[g.athleteName])
  }, [complianceGroups, expandedGroups])
  const handleExpandCollapseAll = () => {
    if (areAllExpanded) {
      setExpandedGroups({})
    } else {
      const all = {}
      for (const g of complianceGroups) all[g.athleteName] = true
      setExpandedGroups(all)
    }
  }



  // Build grid rows (group header + children if expanded)
  const complianceGridRows = React.useMemo(() => {
    const rows = []
    for (const group of complianceGroups) {
      const complete = group.rows.filter(r => r.status === 'Complete').length
      const total = group.rows.length
      rows.push({
        id: `group-${group.athleteName}`,
        type: 'group',
        athleteName: group.athleteName,
        complete,
        total,
      })
      if (expandedGroups[group.athleteName]) {
        for (const r of group.rows) {
          rows.push({ ...r, type: 'child' })
        }
      }
    }
    return rows
  }, [complianceGroups, expandedGroups])

  const complianceColumns = React.useMemo(() => ([
    {
      field: 'item',
      headerName: 'Player / Form',
      flex: 1,
      minWidth: 320,
      sortable: false,
      headerClassName: 'grid-cell--pad-left',
      cellClassName: 'grid-cell--pad-left',
      renderCell: (params) => {
        const row = params.row
        if (row.type === 'group') {
          const isOpen = !!expandedGroups[row.athleteName]
          return (
            <Box onClick={() => toggleGroup(row.athleteName)} sx={{ display: 'flex', alignItems: 'center', gap: 1.5, cursor: 'pointer' }}>
              <Icon icon={isOpen ? 'expand_more' : 'chevron_right'} />
              <Typography variant="body2" sx={{ fontWeight: 600, color: 'var(--color-text-primary)' }}>
                {row.athleteName}
              </Typography>
            </Box>
          )
        }
        return (
          <Typography component="span" variant="body2" sx={{ color: 'var(--color-text-primary)', fontWeight: 600 }}>
            <Link
              component="button"
              underline="none"
              onClick={(e) => {
                e.stopPropagation()
                navigate(`/forms/form_answers_sets/${row.id}`, { state: { athleteName: row.athleteName } })
              }}
              sx={{ color: 'var(--color-text-primary)' }}
            >
              {row.name}
            </Link>
          </Typography>
        )
      }
    },
    {
      field: 'lastUpdated',
      headerName: 'Last updated',
      minWidth: 220,
      renderCell: (params) => {
        const row = params.row
        if (row.type === 'group') return null
        return (
          <Box sx={{ color: 'var(--color-text-primary)' }}>
            {dayjs(row.lastUpdated).format('MMMM D, YYYY [at] h:mm a')}
          </Box>
        )
      }
    },
    {
      field: 'status',
      headerName: 'Status',
      minWidth: 140,
      headerClassName: 'grid-cell--pad-right',
      cellClassName: 'grid-cell--pad-right',
      align: 'right',
      headerAlign: 'right',
      sortable: false,
      renderCell: (params) => {
        const row = params.row
        if (row.type === 'group') {
          return (
            <StatusChip status={`${row.complete}/${row.total}`} type="primary" />
          )
        }
        const type = row.status === 'Complete' || row.status === 'Done' ? 'success' : row.status === 'Draft' ? 'warning' : row.status === 'In progress' ? 'primary' : 'error'
        return <StatusChip status={row.status} type={type} />
      }
    }
  ]), [expandedGroups, navigate])

  return (
    <Box sx={{ py: 2, bgcolor: 'var(--color-background-primary)', height: '100%' }}>
      <Paper elevation={0} sx={{ borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
        <Box sx={{ px: 3, pt: 2, pb: 1 }}>
          <Typography variant="h5" sx={{ color: 'var(--color-text-primary)', fontWeight: 600 }}>
            Form responses
          </Typography>
        </Box>
        
        <Tabs
          value={tabValue}
          onChange={(_, v) => setTabValue(v)}
          aria-label="Form responses tabs"
          sx={{
            px: 3,
            pt: 1,
            minHeight: 44,
            borderBottom: '1px solid var(--color-border-primary)',
            '& .MuiTab-root': {
              minHeight: 44,
              textTransform: 'none',
              fontWeight: 600,
              color: 'var(--color-text-muted)'
            },
            '& .MuiTab-root.Mui-selected': {
              color: 'var(--color-text-primary)'
            },
            '& .MuiTabs-indicator': {
              backgroundColor: 'var(--color-primary)'
            }
          }}
        >
          <Tab label="Forms" {...a11yProps(0)} />
          <Tab label="Completed" {...a11yProps(1)} />
          <Tab label="Compliance" {...a11yProps(2)} />
        </Tabs>
        {/* Baseline handled via borderBottom on Tabs */}

        {/* Forms tab */}
        <TabPanel value={tabValue} index={0}>
          {/* Filters */}
          <Box sx={{ px: 3, pb: 1, display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
            <Autocomplete
              size="small"
              options={allForms.map(f => f.name)}
              value={selectedFormName}
              onChange={(_, v) => setSelectedFormName(v)}
              popupIcon={<ArrowDropDownOutlined fontSize="small" />}
              renderInput={(params) => (
                <TextField {...params} label="Form" variant="filled" />
              )}
              sx={{ minWidth: 280, maxWidth: 420 }}
            />
          </Box>

          {/* Grid */}
          <Box sx={{
            height: 560,
            width: '100%',
            '& .MuiDataGrid-root': { border: 'none' },
            '& .MuiDataGrid-columnHeaders': {
              backgroundColor: 'var(--color-background-primary)',
              '& .MuiDataGrid-columnHeaderTitle': { fontWeight: 600, fontSize: '14px' }
            },
            '& .MuiDataGrid-cell': {
              borderBottom: '1px solid var(--color-border-secondary)',
              display: 'flex',
              alignItems: 'center'
            },
            '& .MuiDataGrid-withBorderColor': {},
            // Internal 24px padding via first/last columns to keep full-bleed edges
            '& .grid-cell--pad-left': { pl: 3, paddingLeft: '24px !important' },
            '& .grid-cell--pad-right': { pr: 3, paddingRight: '24px !important' },
            '& .MuiDataGrid-footerContainer': { px: 3 },
          }}>
            <DataGrid
              rows={filteredRows}
              columns={columns}
              disableRowSelectionOnClick
              pagination
              paginationModel={paginationModel}
              onPaginationModelChange={setPaginationModel}
              pageSizeOptions={[25, 50, 100]}
              slots={{ pagination: GridPagination }}
            />
          </Box>
        </TabPanel>

        {/* Completed tab */}
        <TabPanel value={tabValue} index={1}>
          {/* Filters */}
          <Box sx={{ px: 3, pb: 1, display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
            <Autocomplete
              size="small"
              options={[...new Set(completedRows.map(r => r.name))]}
              value={completedFormName}
              onChange={(_, v) => setCompletedFormName(v)}
              popupIcon={<ArrowDropDownOutlined fontSize="small" />}
              renderInput={(params) => (
                <TextField {...params} label="Form" variant="filled" />
              )}
              sx={{ minWidth: 280, maxWidth: 420 }}
            />
          </Box>

          {/* Grid */}
          <Box sx={{
            height: 560,
            width: '100%',
            '& .MuiDataGrid-root': { border: 'none' },
            '& .MuiDataGrid-columnHeaders': {
              backgroundColor: 'var(--color-background-primary)',
              '& .MuiDataGrid-columnHeaderTitle': { fontWeight: 600, fontSize: '14px' }
            },
            '& .MuiDataGrid-cell': {
              borderBottom: '1px solid var(--color-border-secondary)',
              display: 'flex',
              alignItems: 'center'
            },
            '& .MuiDataGrid-withBorderColor': {},
            // Internal 24px padding via first/last columns to keep full-bleed edges
            '& .grid-cell--pad-left': { pl: 3, paddingLeft: '24px !important' },
            '& .grid-cell--pad-right': { pr: 3, paddingRight: '24px !important' },
            '& .MuiDataGrid-footerContainer': { px: 3 },
          }}>
            <DataGrid
              rows={completedFilteredRows}
              columns={completedColumns}
              disableRowSelectionOnClick
              onRowDoubleClick={(params) => navigate(`/forms/form_answers_sets/${params.row.id}`, { state: { athleteName: params.row.athleteName } })}
              pagination
              paginationModel={paginationModel}
              onPaginationModelChange={setPaginationModel}
              pageSizeOptions={[25, 50, 100]}
              slots={{ pagination: GridPagination }}
            />
          </Box>
        </TabPanel>

        {/* Compliance tab */}
        <TabPanel value={tabValue} index={2}>

          {/* Grid-styled list to match other tables */}
          <Box sx={{
            height: 560,
            width: '100%',
            '& .MuiDataGrid-root': { border: 'none' },
            '& .MuiDataGrid-columnHeaders': {
              backgroundColor: 'var(--color-background-primary)',
              '& .MuiDataGrid-columnHeaderTitle': { fontWeight: 600, fontSize: '14px' }
            },
            '& .MuiDataGrid-cell': {
              borderBottom: '1px solid var(--color-border-secondary)',
              display: 'flex',
              alignItems: 'center'
            },
            '& .grid-cell--pad-left': { pl: 3, paddingLeft: '24px !important' },
            '& .grid-cell--pad-right': { pr: 3, paddingRight: '24px !important' },
            '& .MuiDataGrid-footerContainer': { px: 3 },
          }}>
            <DataGrid
              rows={complianceGridRows}
              columns={complianceColumns}
              disableRowSelectionOnClick
              pagination
              paginationModel={paginationModel}
              onPaginationModelChange={setPaginationModel}
              pageSizeOptions={[25, 50, 100]}
              slots={{ pagination: GridPagination, toolbar: GridToolbar }}
              getRowClassName={(params) => params.row.type === 'group' ? 'compliance-group-row' : ''}
              sx={{
                // No background on group rows per design
                '& .MuiDataGrid-toolbarContainer': {
                  px: 3,
                  pb: 1,
                  borderBottom: '1px solid var(--color-border-primary)',
                  '& .MuiButton-root': {
                    color: 'var(--color-text-secondary)',
                    fontSize: 'var(--font-size-sm)',
                    fontWeight: 'var(--font-weight-medium)',
                    textTransform: 'none',
                    '&:hover': {
                      color: 'var(--color-text-primary)',
                      backgroundColor: 'var(--color-primary-light)'
                    }
                  }
                },
                // Fix positioning for Columns and Filters panels
                '& .MuiDataGrid-columnsPanel': {
                  position: 'absolute !important',
                  top: '44px !important',
                  left: '24px !important',
                  zIndex: 'var(--z-popover)'
                },
                '& .MuiDataGrid-filterPanel': {
                  position: 'absolute !important',
                  top: '44px !important',
                  left: '100px !important',
                  zIndex: 'var(--z-popover)'
                }
              }}
            />
          </Box>
        </TabPanel>
      </Paper>
    </Box>
  )
}

export default Screen02_FormResponses


