import React, { useState, useMemo } from 'react';
import {
  Box,
  Typography,
  TextField,
  MenuItem,
  InputAdornment,
  IconButton,
  Chip,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Button, DataGridPremium, TabBar } from 'playbook-components';
import { PageFrame, PageHeader, useToasts, useNavigationToast } from '../../floorplans';
import { resolveGridPrompt } from '../../utils/gridAiAssistant';
import { MEDICAL_ROSTER_AI_SUGGESTIONS } from '../../data/gridAiSuggestions';
import {
  SearchOutlined,
  MoreVertOutlined,
  WarningOutlined,
} from '@mui/icons-material';
import { PlayerAvatar, StatusChip } from '../../components';
import { dataGridStyles } from '../../components/dataGridStyles';
import athletesData from '../../data/athletes';
import injuriesData from '../../data/injuries_medical';
import { isoDate } from '../../data/clock';
import '../../styles/design-tokens.css';

// Typography styles matching FormsPage pattern
const typographyStyles = {
  fontFamily: 'var(--font-family-primary)',
  fontSize: 'var(--font-size-sm)',
  fontWeight: 'var(--font-weight-medium)'
};

const gridSx = {
  ...dataGridStyles,
  flex: 1,
  minHeight: 0,
  width: '100%'
};


// Tab panel component matching FormsPage pattern
function TabPanel({ children, value, index }) {
  if (value !== index) return null;
  return (
    <Box
      role="tabpanel"
      id={`tabpanel-medical-${index}`}
      aria-labelledby={`tab-medical-${index}`}
      sx={{ pt: 0, flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}
    >
      {children}
    </Box>
  );
}

// Generate mock medical roster data
const generateMedicalRosterData = () => {
  return athletesData.slice(0, 15).map((athlete, index) => {
    // The athlete's open injury, if any: the same records that make them unavailable elsewhere
    const injury = injuriesData.find((inj) => inj.athlete_id === athlete.id && inj.status !== 'Returned');

    // Generate mock data for other fields
    const cardiacStatuses = ['Outstanding', 'Complete', 'Pending'];
    const allergies = ['None', 'Penicillin', 'NSAIDs', 'None known', 'Latex'];
    const rosterTypes = ['Active', 'IR', 'PUP', 'NFI'];

    return {
      id: athlete.id,
      playerId: athlete.id,
      playerName: `${athlete.firstname} ${athlete.lastname}`,
      position: athlete.position,
      injuryDate: injury ? injury.occurrence_date : null,
      injuryName: injury ? injury.injury_type : null,
      injuryStatus: injury ? 'Out' : null,
      noteDate: isoDate(-(index % 3)),
      noteTitle: 'Morning wellness check',
      notePreview: `Notes for ${athlete.firstname} - all vitals normal`,
      cardiacScreening: cardiacStatuses[index % 3],
      allergies: allergies[index % 5],
      roster: rosterTypes[index % 4],
    };
  });
};

function MedicalPage() {
  const navigate = useNavigate();
  const { showToast, toasts } = useToasts();
  useNavigationToast(showToast);
  const [activeTab, setActiveTab] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeRosterFilter, setActiveRosterFilter] = useState('');
  const [positionFilter, setPositionFilter] = useState('');
  const [injuredFilter, setInjuredFilter] = useState('');

  const tabs = [
    'Team',
    'Notes',
    'Diagnostics',
    'Procedures',
    'Medical flags',
    'Shared players',
    'Past athletes',
    'Documents',
    "Coach's report",
    'Daily status report',
  ];

  const rosterData = useMemo(() => generateMedicalRosterData(), []);

  // Filter data based on search and filters
  const filteredData = useMemo(() => {
    return rosterData.filter((row) => {
      const matchesSearch =
        !searchQuery ||
        row.playerName.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesRoster =
        !activeRosterFilter || row.roster === activeRosterFilter;
      const matchesPosition =
        !positionFilter || row.position === positionFilter;
      const matchesInjured =
        !injuredFilter ||
        (injuredFilter === 'Yes' && row.injuryName) ||
        (injuredFilter === 'No' && !row.injuryName);

      return matchesSearch && matchesRoster && matchesPosition && matchesInjured;
    });
  }, [rosterData, searchQuery, activeRosterFilter, positionFilter, injuredFilter]);

  // Get unique positions for filter
  const positions = useMemo(() => {
    return [...new Set(athletesData.map((a) => a.position))].sort();
  }, []);

  // Status indicator component
  const StatusIndicator = ({ status }) => {
    const getColor = () => {
      switch (status) {
        case 'Out':
          return 'var(--color-error)';
        case 'Preliminary':
        case 'Full':
          return 'var(--color-success)';
        default:
          return 'var(--color-text-muted)';
      }
    };

    return (
      <Box
        sx={{
          width: 8,
          height: 8,
          borderRadius: '50%',
          backgroundColor: getColor(),
          display: 'inline-block',
          mr: 1,
        }}
      />
    );
  };

  const columns = [
    {
      field: 'player',
      headerName: 'Player',
      width: 200,
      headerClassName: 'grid-cell--pad-left',
      cellClassName: 'grid-cell--pad-left',
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <PlayerAvatar
            playerId={params.row.playerId}
            playerName={params.row.playerName}
            size="small"
          />
          <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <Typography
              variant="body2"
              sx={{
                fontWeight: 600,
                color: 'var(--color-text-primary)',
                fontFamily: 'var(--font-family-primary)',
                fontSize: 'var(--font-size-sm)',
                lineHeight: 1.4,
              }}
            >
              {params.row.playerName}
            </Typography>
            <Typography
              variant="caption"
              sx={{
                color: 'var(--color-text-secondary)',
                fontFamily: 'var(--font-family-primary)',
                fontSize: 'var(--font-size-xs)',
                lineHeight: 1.3,
              }}
            >
              {params.row.position}
            </Typography>
          </Box>
        </Box>
      ),
    },
    {
      field: 'openInjury',
      headerName: 'Open injury / illness',
      width: 200,
      renderCell: (params) => {
        if (!params.row.injuryName) {
          return (
            <Typography variant="body2" sx={{ color: 'var(--color-text-muted)', fontFamily: 'var(--font-family-primary)', fontSize: 'var(--font-size-sm)' }}>
              —
            </Typography>
          );
        }
        return (
          <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', py: 0.5 }}>
            <Typography variant="caption" sx={{ color: 'var(--color-text-secondary)', fontFamily: 'var(--font-family-primary)', fontSize: 'var(--font-size-xs)', lineHeight: 1.3 }}>
              {params.row.injuryDate}
            </Typography>
            <Typography
              variant="body2"
              sx={{
                fontWeight: 600,
                color: 'var(--color-text-primary)',
                fontFamily: 'var(--font-family-primary)',
                fontSize: 'var(--font-size-sm)',
                lineHeight: 1.4,
              }}
            >
              {params.row.injuryName}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <StatusIndicator status={params.row.injuryStatus} />
              <Typography variant="caption" sx={{ color: 'var(--color-text-secondary)', fontFamily: 'var(--font-family-primary)', fontSize: 'var(--font-size-xs)', lineHeight: 1.3 }}>
                {params.row.injuryStatus}
              </Typography>
            </Box>
          </Box>
        );
      },
    },
    {
      field: 'latestNote',
      headerName: 'Latest note',
      width: 250,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', py: 0.5 }}>
          <Typography variant="caption" sx={{ color: 'var(--color-text-secondary)', fontFamily: 'var(--font-family-primary)', fontSize: 'var(--font-size-xs)', lineHeight: 1.3 }}>
            {params.row.noteDate}
          </Typography>
          <Typography
            variant="body2"
            sx={{
              fontWeight: 600,
              color: 'var(--color-text-primary)',
              fontFamily: 'var(--font-family-primary)',
              fontSize: 'var(--font-size-sm)',
              lineHeight: 1.4,
            }}
          >
            {params.row.noteTitle}
          </Typography>
          <Typography
            variant="caption"
            sx={{
              color: 'var(--color-text-secondary)',
              fontFamily: 'var(--font-family-primary)',
              fontSize: 'var(--font-size-xs)',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              maxWidth: 230,
              display: 'block',
              lineHeight: 1.3,
            }}
          >
            {params.row.notePreview}
          </Typography>
        </Box>
      ),
    },
    {
      field: 'cardiacScreening',
      headerName: 'Cardiac screening',
      width: 160,
      renderCell: (params) => {
        const isOutstanding = params.row.cardiacScreening === 'Outstanding';
        return (
          <Chip
            label={params.row.cardiacScreening}
            icon={isOutstanding ? <WarningOutlined fontSize="small" /> : undefined}
            sx={{
              backgroundColor: isOutstanding
                ? 'var(--color-warning-light)'
                : 'var(--color-success-light)',
              color: isOutstanding
                ? 'var(--color-warning-dark)'
                : 'var(--color-success-dark)',
              fontWeight: 'var(--font-weight-medium)',
              fontFamily: 'var(--font-family-primary)',
              fontSize: 'var(--font-size-sm)',
              '& .MuiChip-icon': {
                color: 'var(--color-warning-dark)',
              },
            }}
          />
        );
      },
    },
    {
      field: 'allergies',
      headerName: 'Allergies',
      width: 130,
      renderCell: (params) => (
        <Typography variant="body2" sx={{ color: 'var(--color-text-primary)', fontFamily: 'var(--font-family-primary)', fontSize: 'var(--font-size-sm)' }}>
          {params.row.allergies}
        </Typography>
      ),
    },
    {
      field: 'roster',
      headerName: 'Roster',
      width: 100,
      renderCell: (params) => (
        <Typography variant="body2" sx={{ color: 'var(--color-text-primary)', fontFamily: 'var(--font-family-primary)', fontSize: 'var(--font-size-sm)' }}>
          {params.row.roster}
        </Typography>
      ),
    },
    {
      field: 'actions',
      headerName: '',
      width: 56,
      sortable: false,
      filterable: false,
      align: 'right',
      headerAlign: 'right',
      headerClassName: 'grid-cell--pad-right',
      cellClassName: 'grid-cell--pad-right',
      renderCell: () => (
        <IconButton sx={{ color: 'var(--color-text-secondary)' }}>
          <MoreVertOutlined fontSize="small" />
        </IconButton>
      ),
    },
  ];

  // Floorplan: Collection. The rosters tab is the reference; the other tabs are placeholders.
  const tabBarTabs = tabs.map((title, index) => ({ tabKey: `medical-${index}`, tabHash: index, title }));

  return (
    <PageFrame
      fill
      contentPadding={0}
      header={
        <PageHeader
          title="Medical"
          primaryAction={{ id: 'log-injury', label: 'Log injury', onClick: () => navigate('/medical/log-injury') }}
        />
      }
      tabs={<TabBar tabs={tabBarTabs} value={activeTab} onChange={setActiveTab} variant="scrollable" />}
    >
      {/* Tab Panels */}
      <TabPanel value={activeTab} index={0}>
        {/* Filter Row */}
        <Box sx={{ px: 3, py: 1.5, display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap', flexShrink: 0 }}>
          <TextField
            size="small"
            variant="filled"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
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
            label="Active roster"
            value={activeRosterFilter}
            onChange={(e) => setActiveRosterFilter(e.target.value)}
            sx={{ minWidth: 220 }}
            slotProps={{
              input: { sx: typographyStyles }
            }}
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="Active">Active</MenuItem>
            <MenuItem value="IR">IR</MenuItem>
            <MenuItem value="PUP">PUP</MenuItem>
            <MenuItem value="NFI">NFI</MenuItem>
          </TextField>
          <TextField
            select
            size="small"
            variant="filled"
            label="Roster position"
            value={positionFilter}
            onChange={(e) => setPositionFilter(e.target.value)}
            sx={{ minWidth: 220 }}
            slotProps={{
              input: { sx: typographyStyles }
            }}
          >
            <MenuItem value="">All</MenuItem>
            {positions.map((pos) => (
              <MenuItem key={pos} value={pos}>
                {pos}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            select
            size="small"
            variant="filled"
            label="Injured"
            value={injuredFilter}
            onChange={(e) => setInjuredFilter(e.target.value)}
            sx={{ minWidth: 220 }}
            slotProps={{
              input: { sx: typographyStyles }
            }}
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="Yes">Yes</MenuItem>
            <MenuItem value="No">No</MenuItem>
          </TextField>
          <Box sx={{ display: 'flex', gap: 1, ml: 'auto' }}>
            <Button disableElevation={true} variant="contained" color="primary">
              Add
            </Button>
            <Button disableElevation={true} variant="contained" color="secondary">
              Download
            </Button>
          </Box>
        </Box>

        {/* Data Grid */}
        <Box sx={{ ...gridSx, px: 3, pb: 3 }}>
          <Box
            sx={{
              height: 600,
              backgroundColor: 'var(--color-background-primary)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--color-border-primary)',
              overflow: 'hidden',
            }}
          >
            <DataGridPremium
              rows={filteredData}
              columns={columns}
              pageSize={10}
              pageSizeOptions={[10, 25, 50]}
              disableColumnMenu
              rowHeight={72}
              columnHeaderHeight={56}
              aiAssistant
              chartsIntegration
              onPrompt={resolveGridPrompt}
              aiAssistantSuggestions={MEDICAL_ROSTER_AI_SUGGESTIONS}
              // Mock data only: sends sample values with each prompt (see AthleteDataGrid)
              allowAiAssistantDataSampling
              sx={{
                // Shared styles come from gridSx on the wrapper; these are the Medical-only additions
                border: 'none',
                '& .MuiDataGrid-columnHeaders': {
                  borderBottom: '1px solid var(--color-border-primary)',
                  '& .MuiDataGrid-columnHeaderTitle': {
                    color: 'var(--color-text-secondary)',
                  },
                },
                '& .MuiDataGrid-row:hover': {
                  backgroundColor: 'var(--color-background-secondary)',
                },
                '& .MuiDataGrid-footerContainer': {
                  borderTop: '1px solid var(--color-border-primary)',
                },
              }}
            />
          </Box>
        </Box>
      </TabPanel>

      {/* Placeholder panels for other tabs */}
      {tabs.slice(1).map((tab, index) => (
        <TabPanel key={tab} value={activeTab} index={index + 1}>
          <Box sx={{ p: 3 }}>
            <Typography
              variant="body1"
              sx={{ color: 'var(--color-text-secondary)' }}
            >
              {tab} content coming soon...
            </Typography>
          </Box>
        </TabPanel>
      ))}
      {toasts}
    </PageFrame>
  );
}

export default MedicalPage;
