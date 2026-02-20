import React from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Box, Paper, Typography, Autocomplete, TextField, Link } from '@mui/material'
import { ArrowDropDownOutlined } from '@mui/icons-material'
import { DataGrid, GridPagination } from '@mui/x-data-grid'
import '../../styles/design-tokens.css'
import { Button, Icon, StatusChip } from '../../components'
import { athletesSimple } from '../../data'

// Map of known form ids to names for display only
const FORM_TITLES = {
  378: 'Test - Toggle Switch',
  364: 'RFU Exit Medical',
  348: 'More than equal',
  347: 'Hilly test',
  346: 'Form with conditional'
}

function Screen03_FormResponsesForTemplate() {
  const navigate = useNavigate()
  const { formId } = useParams()

  const formTitle = React.useMemo(() => FORM_TITLES[Number(formId)] || `Form ${formId}`,[formId])

  // Dummy assignment: choose a subset of athletes as the ones assigned this form
  const assignedAthletes = React.useMemo(() => {
    // Take first 12 athletes to simulate assignment
    return athletesSimple.slice(0, 12).map(a => a.name)
  }, [])

  // Build a dummy responses dataset for the selected form
  const allResponses = React.useMemo(() => {
    const statuses = ['Not started', 'In progress', 'Complete', 'Done']
    return assignedAthletes.map((name, idx) => ({
      id: `${formId}-${idx + 1}`,
      athleteName: name,
      lastUpdated: idx % 3 === 0 ? '—' : new Date(2025, 6, 23, 17, 22).toLocaleString(),
      status: statuses[idx % statuses.length]
    }))
  }, [assignedAthletes, formId])

  const [selectedAthlete, setSelectedAthlete] = React.useState(null)
  const [selectedStatus, setSelectedStatus] = React.useState(null)
  const [paginationModel, setPaginationModel] = React.useState({ page: 0, pageSize: 25 })

  const filteredRows = React.useMemo(() => {
    return allResponses.filter(row => {
      const athleteOk = !selectedAthlete || row.athleteName === selectedAthlete
      const statusOk = !selectedStatus || row.status === selectedStatus
      return athleteOk && statusOk
    })
  }, [allResponses, selectedAthlete, selectedStatus])

  const columns = React.useMemo(() => ([
    {
      field: 'athleteName',
      headerName: 'Name',
      minWidth: 240,
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
              navigate(`/forms/form_answers_sets/${params.row.id}`, { state: { athleteName: params.row.athleteName } })
            }}
            sx={{ color: 'var(--color-text-primary)' }}
          >
            {params.value}
          </Link>
        </Typography>
      )
    },
    {
      field: 'lastUpdated',
      headerName: 'Last updated',
      minWidth: 260
    },
    {
      field: 'status',
      headerName: 'Status',
      minWidth: 160,
      renderCell: (params) => (
        <StatusChip status={params.value} type={params.value === 'Complete' || params.value === 'Done' ? 'success' : params.value === 'In progress' ? 'primary' : 'default'} />
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
      renderCell: () => (
        <Button size="small" variant="secondary">Start</Button>
      )
    }
  ]), [navigate])

  return (
    <Box sx={{ py: 2, bgcolor: 'var(--color-background-primary)', height: '100%' }}>
      <Paper elevation={0} sx={{ borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
        <Box sx={{ px: 3, pt: 2, pb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
          <Button variant="secondary" size="small" aria-label="Back" onClick={() => navigate('/forms/form_answers_sets')}>
            <Icon icon="arrow_back" />
          </Button>
          <Typography variant="h5" sx={{ color: 'var(--color-text-primary)', fontWeight: 600 }}>
            {formTitle}
          </Typography>
        </Box>

        {/* Filters */}
        <Box sx={{ px: 3, pb: 1, display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
          <Autocomplete
            size="small"
            options={assignedAthletes}
            value={selectedAthlete}
            onChange={(_, v) => setSelectedAthlete(v)}
            popupIcon={<ArrowDropDownOutlined fontSize="small" />}
            renderInput={(params) => (
              <TextField {...params} label="Athlete" variant="filled" />
            )}
            sx={{ minWidth: 280, maxWidth: 420 }}
          />

          <Autocomplete
            size="small"
            options={["Not started", "In progress", "Complete", "Done"]}
            value={selectedStatus}
            onChange={(_, v) => setSelectedStatus(v)}
            popupIcon={<ArrowDropDownOutlined fontSize="small" />}
            renderInput={(params) => (
              <TextField {...params} label="Status" variant="filled" />
            )}
            sx={{ minWidth: 220, maxWidth: 320 }}
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
      </Paper>
    </Box>
  )
}

export default Screen03_FormResponsesForTemplate


