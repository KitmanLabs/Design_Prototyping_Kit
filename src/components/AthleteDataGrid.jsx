import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { Box, Typography, Chip } from '@mui/material';
import { DeleteOutlined, ArchiveOutlined } from '@mui/icons-material';
import { DataGridPremium } from '../playbook-components';
import athletesData from '../data/athletes.json';
import { ATHLETES_AI_SUGGESTIONS } from '../data/gridAiSuggestions';
import { resolveGridPrompt } from '../utils/gridAiAssistant';
import '../styles/design-tokens.css';
import { dataGridStyles } from './dataGridStyles';

const NoAthletesOverlay = () => (
  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
    <Typography variant="body2" sx={{ color: 'var(--color-text-secondary)' }}>
      There are no athletes
    </Typography>
  </Box>
);

const columns = [
  {
    field: 'id',
    headerName: 'Id',
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
  },
  {
    field: 'position',
    headerName: 'Position',
    width: 120,
  },
  {
    field: 'position_group',
    headerName: 'Position group',
    width: 130,
  },
  {
    field: 'squad_name',
    headerName: 'Squad',
    width: 130,
  },
  {
    field: 'availability_status',
    headerName: 'Status',
    width: 120,
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
    valueFormatter: (value) => `${value}%`,
  },
  {
    field: 'fitness_level',
    headerName: 'Fitness',
    width: 120,
  },
  {
    field: 'injury_status',
    headerName: 'Injury status',
    width: 150,
  },
  {
    field: 'training_load',
    headerName: 'Training load',
    type: 'number',
    width: 130,
    valueFormatter: (value) => value ? value.toFixed(1) : '-',
  },
  {
    field: 'wellbeing_score',
    headerName: 'Wellbeing',
    type: 'number',
    width: 110,
    valueFormatter: (value) => value ? value.toFixed(1) : '-',
  },
  {
    field: 'last_assessment',
    headerName: 'Last assessment',
    type: 'date',
    width: 140,
    valueGetter: (value) => value ? new Date(value) : null,
  },
];

// Athletes in a Playbook DataGridPremium: the standard toolbar (columns, filters, density,
// export, search) and the AI Assistant. Search stays in the grid toolbar, next to the AI
// Assistant.
//
// Selection: on a floorplan page, pass onSelectionChange (and rowSelectionIds to control it)
// and let PageFrame's selection bar hold the bulk actions, as on every Collection. Without
// it, onBulkAction gives the grid its own bulk actions bar instead.
const AthleteDataGrid = ({
  data = athletesData,
  height = 600,
  onBulkAction,
  onSelectionChange,
  rowSelectionIds,
  ...props
}) => {
  // Ensure data is always an array and filter out any null/undefined entries
  const safeData = useMemo(() => {
    if (!Array.isArray(data)) return [];
    return data.filter(row => row && typeof row === 'object' && row.id);
  }, [data]);

  const bulkActions = useMemo(() => onSelectionChange ? undefined : [
    {
      key: 'archive',
      label: 'Archive',
      icon: <ArchiveOutlined fontSize="small" />,
      onAction: (selectedIds) => onBulkAction?.('archive', selectedIds),
    },
    {
      key: 'delete',
      label: 'Delete',
      icon: <DeleteOutlined fontSize="small" />,
      onAction: (selectedIds) => onBulkAction?.('delete', selectedIds),
    },
  ], [onBulkAction, onSelectionChange]);

  return (
    <Box sx={{ ...dataGridStyles, height, width: '100%' }}>
      <DataGridPremium
        rows={safeData}
        columns={columns}
        density="comfortable"
        checkboxSelection
        bulkActions={bulkActions}
        {...(rowSelectionIds && { rowSelectionModel: rowSelectionIds })}
        {...(onSelectionChange && { onRowSelectionModelChange: (model) => onSelectionChange([...model.ids]) })}
        slots={{ noRowsOverlay: NoAthletesOverlay }}
        aiAssistant
        chartsIntegration
        onPrompt={resolveGridPrompt}
        aiAssistantSuggestions={ATHLETES_AI_SUGGESTIONS}
        // Sends a few sample values per column with each prompt, so Claude can match words like
        // "injured" to the data. Fine for mock data; in iP this would send real athlete data.
        allowAiAssistantDataSampling
        {...props}
      />
    </Box>
  );
};

AthleteDataGrid.propTypes = {
  data: PropTypes.array,
  height: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  onBulkAction: PropTypes.func,
  onSelectionChange: PropTypes.func,
  rowSelectionIds: PropTypes.array,
};

export default AthleteDataGrid;
