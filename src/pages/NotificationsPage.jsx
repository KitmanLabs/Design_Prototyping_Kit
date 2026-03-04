import React, { useMemo, useState } from 'react'
import {
  Box,
  Paper,
  Typography,
  TextField,
  InputAdornment,
  MenuItem
} from '@mui/material'
import { SearchOutlined } from '@mui/icons-material'
import { DataGrid, GridPagination } from 'playbook-components'
import '../styles/design-tokens.css'

// Full notification data
const notificationsData = [
  {
    id: 1,
    title: 'Form submission received',
    description: 'Marcus Johnson submitted Daily Wellness Check',
    timestamp: 'Sep 27, 2025 · 2:45 PM',
    category: 'Submission',
    status: 'Unread'
  },
  {
    id: 2,
    title: 'Medical assessment due',
    description: 'Pre-Season Medical Screening deadline approaching for 5 athletes',
    timestamp: 'Sep 26, 2025 · 10:30 AM',
    category: 'Deadline',
    status: 'Unread'
  },
  {
    id: 3,
    title: 'Form updated',
    description: 'Training Load Monitoring form was modified by Performance team',
    timestamp: 'Sep 25, 2025 · 4:15 PM',
    category: 'Update',
    status: 'Read'
  },
  {
    id: 4,
    title: 'New form assigned',
    description: 'Concussion Protocol assigned to 12 athletes',
    timestamp: 'Sep 24, 2025 · 9:00 AM',
    category: 'Assignment',
    status: 'Read'
  },
  {
    id: 5,
    title: 'Compliance deadline',
    description: 'End of Season Survey submissions due in 3 days',
    timestamp: 'Sep 23, 2025 · 11:20 AM',
    category: 'Deadline',
    status: 'Unread'
  },
  {
    id: 6,
    title: 'Form submission received',
    description: 'Elena Rodriguez completed Pre-Season Medical Screening',
    timestamp: 'Sep 22, 2025 · 3:30 PM',
    category: 'Submission',
    status: 'Read'
  },
  {
    id: 7,
    title: 'Schedule created',
    description: 'Weekly Wellness Check schedule has been published',
    timestamp: 'Sep 21, 2025 · 8:00 AM',
    category: 'Schedule',
    status: 'Read'
  },
  {
    id: 8,
    title: 'Form template published',
    description: 'New Injury Assessment form is now available',
    timestamp: 'Sep 20, 2025 · 2:00 PM',
    category: 'Update',
    status: 'Read'
  },
  {
    id: 9,
    title: 'Overdue submission',
    description: 'David Chen has not completed Training Load Monitoring',
    timestamp: 'Sep 19, 2025 · 9:15 AM',
    category: 'Deadline',
    status: 'Unread'
  },
  {
    id: 10,
    title: 'Form submission received',
    description: 'James Wilson submitted Scholarship Reviews',
    timestamp: 'Sep 18, 2025 · 1:45 PM',
    category: 'Submission',
    status: 'Read'
  },
  {
    id: 11,
    title: 'New form assigned',
    description: 'Post-Game RPE assigned to 8 athletes after match',
    timestamp: 'Sep 17, 2025 · 6:30 PM',
    category: 'Assignment',
    status: 'Read'
  },
  {
    id: 12,
    title: 'Compliance reminder',
    description: 'Ethan Walker has 3 pending compliance forms',
    timestamp: 'Sep 16, 2025 · 10:00 AM',
    category: 'Deadline',
    status: 'Read'
  }
]

const typographyStyles = {
  fontFamily: 'var(--font-family-primary)',
  fontSize: 'var(--font-size-sm)',
  fontWeight: 'var(--font-weight-medium)'
}

const gridSx = {
  flex: 1,
  minHeight: 0,
  width: '100%',
  '& .MuiDataGrid-root': { border: 'none' },
  '& .MuiDataGrid-columnHeaders': {
    backgroundColor: 'var(--color-background-primary)',
    '& .MuiDataGrid-columnHeaderTitle': {
      fontWeight: 600,
      fontSize: 'var(--font-size-sm)',
      fontFamily: 'var(--font-family-primary)'
    }
  },
  '& .MuiDataGrid-cell': {
    borderBottom: '1px solid var(--color-border-secondary)',
    display: 'flex',
    alignItems: 'center',
    fontSize: 'var(--font-size-sm)',
    fontFamily: 'var(--font-family-primary)'
  },
  '& .grid-cell--pad-left': { pl: 3, paddingLeft: '24px !important' },
  '& .grid-cell--pad-right': { pr: 3, paddingRight: '24px !important' },
  '& .MuiDataGrid-footerContainer': { px: 3 }
}

export default function NotificationsPage() {
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 25 })
  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')

  const filteredRows = useMemo(() => {
    let rows = notificationsData
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      rows = rows.filter(
        (r) =>
          (r.title || '').toLowerCase().includes(q) ||
          (r.description || '').toLowerCase().includes(q)
      )
    }
    if (categoryFilter) {
      rows = rows.filter((r) => r.category === categoryFilter)
    }
    if (statusFilter) {
      rows = rows.filter((r) => r.status === statusFilter)
    }
    return rows
  }, [searchQuery, categoryFilter, statusFilter])

  const columns = useMemo(
    () => [
      {
        field: 'title',
        headerName: 'Title',
        width: 220,
        headerClassName: 'grid-cell--pad-left',
        cellClassName: 'grid-cell--pad-left',
        renderCell: (params) => (
          <Typography
            variant="body2"
            sx={{
              fontWeight: params.row.status === 'Unread' ? 700 : 500,
              color: 'var(--color-text-primary)',
              fontFamily: 'var(--font-family-primary)',
              fontSize: 'var(--font-size-sm)'
            }}
          >
            {params.value}
          </Typography>
        )
      },
      {
        field: 'description',
        headerName: 'Description',
        flex: 1,
        minWidth: 300,
        renderCell: (params) => (
          <Typography
            variant="body2"
            sx={{
              color: 'var(--color-text-secondary)',
              fontFamily: 'var(--font-family-primary)',
              fontSize: 'var(--font-size-sm)',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap'
            }}
            title={params.value}
          >
            {params.value}
          </Typography>
        )
      },
      {
        field: 'category',
        headerName: 'Category',
        width: 120,
        renderCell: (params) => (
          <Typography
            variant="body2"
            sx={{
              color: 'var(--color-text-secondary)',
              fontFamily: 'var(--font-family-primary)',
              fontSize: 'var(--font-size-sm)'
            }}
          >
            {params.value}
          </Typography>
        )
      },
      {
        field: 'timestamp',
        headerName: 'Date',
        width: 180,
        renderCell: (params) => (
          <Typography
            variant="body2"
            sx={{
              color: 'var(--color-text-muted)',
              fontFamily: 'var(--font-family-primary)',
              fontSize: 'var(--font-size-sm)'
            }}
          >
            {params.value}
          </Typography>
        )
      },
      {
        field: 'status',
        headerName: 'Status',
        width: 100,
        headerClassName: 'grid-cell--pad-right',
        cellClassName: 'grid-cell--pad-right',
        renderCell: (params) => (
          <Box
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              px: 1.5,
              py: 0.5,
              borderRadius: 'var(--radius-sm)',
              backgroundColor:
                params.value === 'Unread'
                  ? 'var(--color-primary-light)'
                  : 'var(--color-secondary)',
              color:
                params.value === 'Unread'
                  ? 'var(--color-primary)'
                  : 'var(--color-text-secondary)'
            }}
          >
            <Typography
              variant="body2"
              sx={{
                fontWeight: 500,
                fontFamily: 'var(--font-family-primary)',
                fontSize: 'var(--font-size-xs)'
              }}
            >
              {params.value}
            </Typography>
          </Box>
        )
      }
    ],
    []
  )

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 0,
        bgcolor: 'var(--color-background-primary)',
        height: '100%',
        fontFamily: 'var(--font-family-primary)'
      }}
    >
      {/* Page title */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 3, pt: 2, pb: 1 }}>
        <Typography
          variant="h5"
          sx={{
            fontWeight: 600,
            color: 'var(--color-text-primary)',
            fontFamily: 'var(--font-family-primary)',
            fontSize: 'var(--font-size-2xl)'
          }}
        >
          Notifications
        </Typography>
      </Box>

      <Paper
        elevation={0}
        sx={{
          borderRadius: 'var(--radius-md)',
          overflow: 'hidden',
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          minHeight: 0
        }}
      >
        {/* Filters row */}
        <Box sx={{ px: 3, py: 1.5, display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap', flexShrink: 0, borderBottom: '1px solid var(--color-border-primary)' }}>
          <TextField
            size="small"
            variant="filled"
            placeholder="Search notifications"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{ minWidth: 260 }}
            InputProps={{
              sx: typographyStyles,
              endAdornment: (
                <InputAdornment position="end">
                  <SearchOutlined fontSize="small" sx={{ color: 'var(--color-primary)' }} />
                </InputAdornment>
              )
            }}
          />
          <TextField
            select
            size="small"
            variant="filled"
            label="Category"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            sx={{ minWidth: 160 }}
            InputProps={{ sx: typographyStyles }}
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="Submission">Submission</MenuItem>
            <MenuItem value="Deadline">Deadline</MenuItem>
            <MenuItem value="Update">Update</MenuItem>
            <MenuItem value="Assignment">Assignment</MenuItem>
            <MenuItem value="Schedule">Schedule</MenuItem>
          </TextField>
          <TextField
            select
            size="small"
            variant="filled"
            label="Status"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            sx={{ minWidth: 140 }}
            InputProps={{ sx: typographyStyles }}
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="Unread">Unread</MenuItem>
            <MenuItem value="Read">Read</MenuItem>
          </TextField>
        </Box>

        {/* Data grid */}
        <Box
          sx={{
            ...gridSx,
            '& .MuiDataGrid-row': {
              cursor: 'pointer',
              '&:hover': {
                backgroundColor: 'var(--color-background-hover)'
              }
            }
          }}
        >
          <DataGrid
            rows={filteredRows}
            columns={columns}
            disableRowSelectionOnClick
            pagination
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
            pageSizeOptions={[25, 50, 100]}
            slots={{ pagination: GridPagination }}
            slotProps={{ pagination: { showFirstButton: true, showLastButton: true } }}
            initialState={{ pagination: { paginationModel: { pageSize: 25 } } }}
          />
        </Box>
      </Paper>
    </Box>
  )
}
