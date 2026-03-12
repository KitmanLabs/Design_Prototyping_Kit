import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Paper, Typography, Autocomplete, TextField, MenuItem, IconButton } from '@mui/material';
import { DataGrid, GridPagination } from 'playbook-components';
import { ArrowBackOutlined, ArrowDropDownOutlined } from '@mui/icons-material';
import { Button, StatusChip, Icon } from '../../components';
import '../../styles/design-tokens.css';

const mockData = [
  { id: 1, athlete: 'Jordan Smith', lastUpdated: '2026-02-24', status: 'Complete' },
  { id: 2, athlete: 'Alex Martinez', lastUpdated: '2026-02-23', status: 'Draft' },
  { id: 3, athlete: 'Liam Johnson', lastUpdated: '2026-02-22', status: 'Not Started' },
  { id: 4, athlete: 'Olivia Brown', lastUpdated: '2026-02-21', status: 'Complete' },
  { id: 5, athlete: 'Noah Jones', lastUpdated: '2026-02-20', status: 'Draft' },
  { id: 6, athlete: 'Emma Garcia', lastUpdated: '2026-02-19', status: 'Not Started' },
  { id: 7, athlete: 'William Davis', lastUpdated: '2026-02-18', status: 'Complete' },
  { id: 8, athlete: 'Sophia Rodriguez', lastUpdated: '2026-02-17', status: 'Draft' },
  { id: 9, athlete: 'James Wilson', lastUpdated: '2026-02-16', status: 'Not Started' },
  { id: 10, athlete: 'Isabella Moore', lastUpdated: '2026-02-15', status: 'Complete' },
  { id: 11, athlete: 'Benjamin Taylor', lastUpdated: '2026-02-14', status: 'Draft' },
  { id: 12, athlete: 'Mia Anderson', lastUpdated: '2026-02-13', status: 'Not Started' },
];

const typographyStyles = {
  fontFamily: 'var(--font-family-primary)',
  fontSize: 'var(--font-size-sm)',
  fontWeight: 'var(--font-weight-medium)'
};

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
};


const MedicalAssessment = () => {
  const navigate = useNavigate();

  const columns = [
    { field: 'athlete', headerName: 'Athlete', flex: 1, headerClassName: 'grid-cell--pad-left', cellClassName: 'grid-cell--pad-left' },
    { field: 'lastUpdated', headerName: 'Last Updated', flex: 1, valueFormatter: (params) => new Date(params.value).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) },
    {
      field: 'status',
      headerName: 'Status',
      flex: 1,
      renderCell: (params) => {
        let type;
        switch (params.value) {
          case 'Complete':
            type = 'success';
            break;
          case 'Draft':
            type = 'warning';
            break;
          case 'Not Started':
            type = 'error';
            break;
          default:
            type = 'default';
        }
        return <StatusChip status={params.value} type={type} />;
      },
    },
    {
      field: 'actions',
      headerName: 'Actions',
      flex: 1,
      headerClassName: 'grid-cell--pad-right',
      cellClassName: 'grid-cell--pad-right',
      align: 'right',
      headerAlign: 'right',
      sortable: false,
      renderCell: (params) => {
        const isStarted = params.row.status === 'Draft' || params.row.status === 'Complete';
        return (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, justifyContent: 'flex-end' }}>
            <Button
              variant={'secondary'}
              size="small"
              style={{ fontWeight: 600, fontSize: 'var(--font-size-xs)' }}
              onClick={() => navigate(`/form-fill/${params.row.id}`, {
                state: {
                  athleteName: params.row.athlete,
                  formTitle: 'Medical Assessment'
                }
              })}
            >
              {isStarted ? 'Continue' : 'Start'}
            </Button>
            {isStarted && (
              <IconButton size="small" sx={{ color: 'var(--color-text-secondary)' }}>
                <Icon icon="delete" size="medium" />
              </IconButton>
            )}
          </Box>
        );
      },
    },
  ];

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0, bgcolor: 'var(--color-background-primary)', height: '100%', fontFamily: 'var(--font-family-primary)' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', px: 3, pt: 2, pb: 1 }}>
        <IconButton onClick={() => navigate(-1)} sx={{ mr: 1, color: 'var(--color-text-primary)' }}>
          <ArrowBackOutlined />
        </IconButton>
        <Typography variant="h5" sx={{ fontWeight: 600, color: 'var(--color-text-primary)', fontFamily: 'var(--font-family-primary)', fontSize: 'var(--font-size-2xl)' }}>
          Medical Assessment
        </Typography>
      </Box>

      <Paper elevation={0} sx={{ borderRadius: 'var(--radius-md)', overflow: 'hidden', flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0, margin: '0 24px 24px' }}>
        <Box sx={{ px: 3, py: 1.5, display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap', flexShrink: 0, borderBottom: '1px solid var(--color-border-primary)' }}>
          <Autocomplete
            size="small"
            options={[...new Set(mockData.map(d => d.athlete))]}
            popupIcon={<ArrowDropDownOutlined fontSize="small" sx={{ color: 'var(--color-primary)' }} />}
            renderInput={(params) => <TextField {...params} label="Athlete" variant="filled" />}
            sx={{ minWidth: 220 }}
          />
          <TextField
            select
            size="small"
            variant="filled"
            label="Status"
            defaultValue=""
            sx={{ minWidth: 220 }}
            InputProps={{ sx: typographyStyles }}
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="Complete">Complete</MenuItem>
            <MenuItem value="Draft">Draft</MenuItem>
            <MenuItem value="Not Started">Not Started</MenuItem>
          </TextField>
        </Box>
        <Box sx={gridSx}>
          <DataGrid
            rows={mockData}
            columns={columns}
            disableRowSelectionOnClick
            pagination
            pageSizeOptions={[10, 25, 50]}
            initialState={{
              pagination: {
                paginationModel: { pageSize: 10 },
              },
            }}
            slots={{ pagination: GridPagination }}
            slotProps={{ pagination: { showFirstButton: true, showLastButton: true } }}
          />
        </Box>
      </Paper>
    </Box>
  );
};

export default MedicalAssessment;
