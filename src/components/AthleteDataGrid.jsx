import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { Box, Typography, Chip } from '@mui/material';
import { DataGrid } from '../playbook-components';
// Toolbar parts have no Playbook equivalent, so they come from MUI X directly.
import {
  GridToolbarContainer,
  GridToolbarColumnsButton,
  GridToolbarFilterButton,
  GridToolbarDensitySelector,
  GridToolbarExport,
} from '@mui/x-data-grid';
import athletesData from '../data/athletes.json';
import '../styles/design-tokens.css';
import { dataGridStyles } from './dataGridStyles';

// MUI X v8+ requires toolbar subcomponents (quick filter, buttons) inside the grid's
// Toolbar context; GridToolbarContainer provides it, as in the Playbook DataGrid wrapper.
const CustomToolbar = React.forwardRef((props, ref) => {
  return (
    <GridToolbarContainer
      ref={ref}
      sx={{
        height: '56px',
        px: 2,
        borderBottom: '1px solid var(--color-border-primary)',
        backgroundColor: 'var(--color-background-secondary)',
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <Box sx={{ 
        display: 'flex', 
        gap: 2,
        '& .MuiButtonBase-root': {
          textTransform: 'none',
          fontSize: '0.875rem',
          fontWeight: 500,
          color: 'var(--color-text-primary)',
          minWidth: 'auto',
          padding: '4px',
          '&:hover': {
            backgroundColor: 'var(--color-background-tertiary)'
          }
        }
      }}>
        <GridToolbarColumnsButton />
        <GridToolbarFilterButton />
        <GridToolbarDensitySelector />
        <GridToolbarExport />
      </Box>
    </GridToolbarContainer>
  );
});

CustomToolbar.displayName = 'CustomToolbar';

const NoAthletesOverlay = () => (
  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
    <Typography variant="body2" sx={{ color: 'var(--color-text-secondary)' }}>
      There are no athletes
    </Typography>
  </Box>
);

/**
 * The athletes grid for the Athletes Collection. The page owns search, quick filters and
 * the selection bar (PageFrame); the grid keeps its column, filter, density and export tools.
 * onSelectionChange receives the selected athlete ids; pass onRowClick to open the Record.
 */
const AthleteDataGrid = ({ 
  data = athletesData, 
  height = 600,
  showToolbar = true,
  onSelectionChange,
  rowSelectionIds,
  ...props 
}) => {
  // Ensure data is always an array and filter out any null/undefined entries
  const safeData = useMemo(() => {
    if (!Array.isArray(data)) return [];
    return data.filter(row => row && typeof row === 'object' && row.id);
  }, [data]);
  const columns = useMemo(() => [
    {
      field: 'id',
      headerName: "Id",
      width: 70,
      type: 'number',
    },
    {
      field: 'name',
      headerName: 'Name',
      width: 180,
      valueGetter: (_value, row) => {
        if (!row || !row.firstname || !row.lastname) return '';
        return `${row.firstname} ${row.lastname}`;
      },
      filterable: true,
      groupable: false,
    },
    {
      field: 'position',
      headerName: 'Position',
      width: 120,
      filterable: true,
      groupable: true,
    },
    {
      field: 'position_group',
      headerName: "Position group",
      width: 130,
      filterable: true,
      groupable: true,
    },
    {
      field: 'squad_name',
      headerName: 'Squad',
      width: 130,
      filterable: true,
      groupable: true,
    },
    {
      field: 'availability_status',
      headerName: 'Status',
      width: 120,
      filterable: true,
      groupable: true,
      renderCell: (params) => (
        <Chip
          label={params.value}
          color={
            params.value === 'Available' ? 'success' :
            params.value === 'Injured' ? 'error' :
            'default'
          }
          variant={params.value === 'Available' ? 'filled' : 'outlined'}
        />
      ),
    },
    {
      field: 'performance_score',
      headerName: 'Performance',
      type: 'number',
      width: 110,
      filterable: true,
      valueFormatter: (value) => `${value}%`,
    },
    {
      field: 'fitness_level',
      headerName: 'Fitness',
      width: 120,
      filterable: true,
      groupable: true,
    },
    {
      field: 'injury_status',
      headerName: "Injury status",
      width: 150,
      filterable: true,
      groupable: true,
    },
    {
      field: 'training_load',
      headerName: "Training load",
      type: 'number',
      width: 130,
      filterable: true,
      valueFormatter: (value) => value ? value.toFixed(1) : '-',
    },
    {
      field: 'wellbeing_score',
      headerName: 'Wellbeing',
      type: 'number',
      width: 110,
      filterable: true,
      valueFormatter: (value) => value ? value.toFixed(1) : '-',
    },
    {
      field: 'last_assessment',
      headerName: "Last assessment",
      type: 'date',
      width: 140,
      valueGetter: (value) => value ? new Date(value) : null,
    }
  ], []);
  const containerStyles = {
    ...dataGridStyles,
    height,
    width: '100%',
  };

  return (
    <Box sx={containerStyles}>
      <DataGrid
        rows={safeData}
        columns={columns}
        checkboxSelection
        disableRowSelectionOnClick
        density="comfortable"
        disableRowSelectionExcludeModel
        {...(rowSelectionIds && { rowSelectionModel: { type: 'include', ids: new Set(rowSelectionIds) } })}
        onRowSelectionModelChange={(model) => onSelectionChange?.([...model.ids])}
        hideFooter
        // Passing slots replaces the Playbook wrapper's defaults, so the empty state is set here.
        slots={{ toolbar: CustomToolbar, noRowsOverlay: NoAthletesOverlay }}
        slotProps={{
          basePopper: {
            sx: {
              '& .MuiPaper-root': {
                boxShadow: 'var(--shadow-lg)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--color-border-primary)'
              }
            }
          },
        }}
        initialState={{
          columns: {
            columnVisibilityModel: {},
          },
        }}
        {...props}
        showToolbar={showToolbar} />
    </Box>
  );
};

AthleteDataGrid.propTypes = {
  data: PropTypes.array,
  height: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  showToolbar: PropTypes.bool,
  onSelectionChange: PropTypes.func,
  rowSelectionIds: PropTypes.array,
};

export default AthleteDataGrid;