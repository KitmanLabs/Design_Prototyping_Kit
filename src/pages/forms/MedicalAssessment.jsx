import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Paper, Typography, Autocomplete, TextField, MenuItem, IconButton } from '@mui/material';
import { Button, DataGrid, GridPagination } from 'playbook-components';
import { ArrowBackOutlined, ArrowDropDownOutlined } from '@mui/icons-material';
import { StatusChip, Icon } from '../../components';
import '../../styles/design-tokens.css';
import { medicalAssessmentRows as mockData } from '../../data/forms';

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
    { field: 'lastUpdated', headerName: 'Last Updated', flex: 1, valueFormatter: (value) => new Date(value).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) },
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
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, justifyContent: 'flex-end', width: '100%' }}>
            <Button
              disableElevation={true}
              variant="contained" color="secondary"
              size="small"
              style={{ fontWeight: 600, fontSize: 'var(--font-size-xs)', minWidth: 72 }}
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/forms/medical-assessment/fill/${params.row.id}`, {
                  state: {
                    athleteName: params.row.athlete,
                    formTitle: 'Medical Assessment',
                    isDraft: params.row.status === 'Draft'
                  }
                });
              }}
            >
              {isStarted ? 'Continue' : 'Start'}
            </Button>
            <IconButton 
              size="small" 
              sx={{ 
                color: 'var(--color-text-secondary)',
                visibility: isStarted ? 'visible' : 'hidden'
              }}
            >
              <Icon icon="delete" size="medium" />
            </IconButton>
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
            slotProps={{
              input: { sx: typographyStyles }
            }}
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
