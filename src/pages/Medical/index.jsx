import React, { useState, useMemo } from 'react';
import {
  Box,
  Typography,
  Tabs,
  Tab,
  TextField,
  MenuItem,
  InputAdornment,
  IconButton,
  Chip,
  Menu,
} from '@mui/material';
import { DataGrid } from 'playbook-components';
import {
  SearchOutlined,
  MoreVertOutlined,
  WarningOutlined,
  ArrowDropDown,
} from '@mui/icons-material';
import { Button, PlayerAvatar, StatusChip } from '../../components';
import ProcedureDrawer from './ProcedureDrawer';
import athletesData from '../../data/athletes.json';
import injuriesData from '../../data/injuries_medical.json';
import '../../styles/design-tokens.css';

// Typography styles matching FormsPage pattern
const typographyStyles = {
  fontFamily: 'var(--font-family-primary)',
  fontSize: 'var(--font-size-sm)',
  fontWeight: 'var(--font-weight-medium)'
};

// Grid styling matching FormsPage pattern
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

// Accessibility helper for tabs
function a11yProps(index) {
  return {
    id: `medical-tab-${index}`,
    'aria-controls': `medical-tabpanel-${index}`
  };
}

// Tab panel component matching FormsPage pattern
function TabPanel({ children, value, index }) {
  if (value !== index) return null;
  return (
    <Box
      role="tabpanel"
      id={`medical-tabpanel-${index}`}
      aria-labelledby={`medical-tab-${index}`}
      sx={{ pt: 0, flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}
    >
      {children}
    </Box>
  );
}

// Generate mock medical roster data
const generateMedicalRosterData = () => {
  return athletesData.slice(0, 15).map((athlete, index) => {
    // Find injury for this athlete
    const injury = injuriesData.find((inj) => inj.athlete_id === athlete.id);

    // Generate mock data for other fields
    const statuses = ['Out', 'Preliminary', 'Full'];
    const cardiacStatuses = ['Outstanding', 'Complete', 'Pending'];
    const allergies = ['None', 'Penicillin', 'NSAIDs', 'None Known', 'Latex'];
    const rosterTypes = ['Active', 'IR', 'PUP', 'NFI'];

    return {
      id: athlete.id,
      playerId: athlete.id,
      playerName: `${athlete.firstname} ${athlete.lastname}`,
      position: athlete.position,
      injuryDate: injury ? injury.occurrence_date : null,
      injuryName: injury ? injury.injury_type : null,
      injuryStatus: injury ? statuses[index % 3] : null,
      noteDate: '2024-01-15',
      noteTitle: 'Morning wellness check',
      notePreview: `Notes for ${athlete.firstname} - all vitals normal`,
      cardiacScreening: cardiacStatuses[index % 3],
      allergies: allergies[index % 5],
      roster: rosterTypes[index % 4],
    };
  });
};

function MedicalPage() {
  const [activeTab, setActiveTab] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeRosterFilter, setActiveRosterFilter] = useState('');
  const [positionFilter, setPositionFilter] = useState('');
  const [injuredFilter, setInjuredFilter] = useState('');
  
  // Menu anchor states
  const [addMenuAnchor, setAddMenuAnchor] = useState(null);
  const [downloadMenuAnchor, setDownloadMenuAnchor] = useState(null);
  
  // Procedure drawer state
  const [procedureDrawerOpen, setProcedureDrawerOpen] = useState(false);

  // Menu handlers
  const handleAddMenuClick = (event) => {
    setAddMenuAnchor(event.currentTarget);
  };

  const handleAddMenuClose = () => {
    setAddMenuAnchor(null);
  };

  const handleAddMenuItemClick = (type) => {
    handleAddMenuClose();
    if (type === 'procedure') {
      setProcedureDrawerOpen(true);
    } else {
      // Handle other add actions
      console.log('Add:', type);
    }
  };

  const handleProcedureDrawerClose = () => {
    setProcedureDrawerOpen(false);
  };

  const handleProcedureSubmit = (procedureData) => {
    console.log('Procedure submitted:', procedureData);
    // Handle procedure submission
    setProcedureDrawerOpen(false);
  };

  const handleDownloadMenuClick = (event) => {
    setDownloadMenuAnchor(event.currentTarget);
  };

  const handleDownloadMenuClose = () => {
    setDownloadMenuAnchor(null);
  };

  const handleDownloadMenuItemClick = (type) => {
    handleDownloadMenuClose();
    // Handle download action based on type
    console.log('Download:', type);
  };

  const tabs = [
    'Roster',
    'Notes',
    'Diagnostics',
    'Procedures',
    'Medical Flags',
    'Shared Players',
    'Past Players',
    'Documents',
    "Coach's Report",
    'Daily Status Report',
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
            size="small"
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
        <IconButton size="small" sx={{ color: 'var(--color-text-secondary)' }}>
          <MoreVertOutlined fontSize="small" />
        </IconButton>
      ),
    },
  ];

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Page Header */}
      <Box sx={{ px: 3, pt: 3, pb: 2 }}>
        <Typography
          variant="h5"
          sx={{
            fontWeight: 'var(--font-weight-semibold)',
            color: 'var(--color-text-primary)',
            fontFamily: 'var(--font-family-primary)',
          }}
        >
          Medical
        </Typography>
      </Box>

      {/* Tab Navigation */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', px: 3 }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          aria-label="medical tabs"
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            '& .MuiTab-root': {
              textTransform: 'none',
              fontWeight: 'var(--font-weight-medium)',
              fontSize: 'var(--font-size-sm)',
              color: 'var(--color-text-secondary)',
              minHeight: 48,
              '&.Mui-selected': {
                color: 'var(--color-primary)',
              },
            },
            '& .MuiTabs-indicator': {
              backgroundColor: 'var(--color-primary)',
            },
          }}
        >
          {tabs.map((tab, index) => (
            <Tab key={tab} label={tab} {...a11yProps(index)} />
          ))}
        </Tabs>
      </Box>

      {/* Tab Panels */}
      <TabPanel value={activeTab} index={0}>
        {/* Section Header Row */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            px: 3,
            py: 2,
          }}
        >
          <Typography
            variant="h6"
            sx={{
              fontWeight: 'var(--font-weight-semibold)',
              color: 'var(--color-text-primary)',
              fontFamily: 'var(--font-family-primary)',
            }}
          >
            Roster
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button variant="primary" size="small" onClick={handleAddMenuClick}>
              Add
              <ArrowDropDown sx={{ fontSize: '16px', marginLeft: '4px' }} />
            </Button>
            <Button variant="secondary" size="small" onClick={handleDownloadMenuClick}>
              Download
              <ArrowDropDown sx={{ fontSize: '16px', marginLeft: '4px' }} />
            </Button>
          </Box>
        </Box>

        {/* Filter Row */}
        <Box sx={{ px: 3, py: 1.5, display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap', flexShrink: 0 }}>
          <TextField
            size="small"
            variant="filled"
            placeholder="Search"
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
            label="Active roster"
            value={activeRosterFilter}
            onChange={(e) => setActiveRosterFilter(e.target.value)}
            sx={{ minWidth: 220 }}
            InputProps={{ sx: typographyStyles }}
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
            InputProps={{ sx: typographyStyles }}
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
            InputProps={{ sx: typographyStyles }}
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="Yes">Yes</MenuItem>
            <MenuItem value="No">No</MenuItem>
          </TextField>
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
            <DataGrid
              rows={filteredData}
              columns={columns}
              pageSize={10}
              rowsPerPageOptions={[10, 25, 50]}
              disableSelectionOnClick
              disableColumnMenu
              rowHeight={72}
              headerHeight={56}
              sx={{
                border: 'none',
                '& .MuiDataGrid-columnHeaders': {
                  backgroundColor: 'var(--color-background-primary)',
                  borderBottom: '1px solid var(--color-border-primary)',
                  '& .MuiDataGrid-columnHeaderTitle': {
                    fontWeight: 600,
                    fontSize: 'var(--font-size-sm)',
                    fontFamily: 'var(--font-family-primary)',
                    color: 'var(--color-text-secondary)',
                  },
                },
                '& .MuiDataGrid-cell': {
                  borderBottom: '1px solid var(--color-border-secondary)',
                  display: 'flex',
                  alignItems: 'center',
                  fontSize: 'var(--font-size-sm)',
                  fontFamily: 'var(--font-family-primary)',
                },
                '& .grid-cell--pad-left': { pl: 3, paddingLeft: '24px !important' },
                '& .grid-cell--pad-right': { pr: 3, paddingRight: '24px !important' },
                '& .MuiDataGrid-row:hover': {
                  backgroundColor: 'var(--color-background-secondary)',
                },
                '& .MuiDataGrid-footerContainer': {
                  borderTop: '1px solid var(--color-border-primary)',
                  px: 3,
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

      {/* Add Menu */}
      <Menu
        anchorEl={addMenuAnchor}
        open={Boolean(addMenuAnchor)}
        onClose={handleAddMenuClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        PaperProps={{
          sx: {
            mt: 1,
            minWidth: 160,
            boxShadow: 'var(--shadow-lg)',
            borderRadius: 'var(--radius-sm)',
            '& .MuiMenuItem-root': {
              fontFamily: 'var(--font-family-primary)',
              fontSize: 'var(--font-size-sm)',
              fontWeight: 'var(--font-weight-medium)',
              color: 'var(--color-text-primary)',
              padding: '10px 16px',
              '&:hover': {
                backgroundColor: 'var(--color-background-secondary)',
              },
            },
          },
        }}
      >
        <MenuItem onClick={() => handleAddMenuItemClick('injury')}>Injury</MenuItem>
        <MenuItem onClick={() => handleAddMenuItemClick('illness')}>Illness</MenuItem>
        <MenuItem onClick={() => handleAddMenuItemClick('note')}>Note</MenuItem>
        <MenuItem onClick={() => handleAddMenuItemClick('diagnostic')}>Diagnostic</MenuItem>
        <MenuItem onClick={() => handleAddMenuItemClick('file')}>File</MenuItem>
        <MenuItem onClick={() => handleAddMenuItemClick('allergy')}>Allergy</MenuItem>
        <MenuItem onClick={() => handleAddMenuItemClick('chronic-condition')}>Chronic condition</MenuItem>
        <MenuItem onClick={() => handleAddMenuItemClick('medical-alert')}>Medical alert</MenuItem>
        <MenuItem onClick={() => handleAddMenuItemClick('procedure')}>Procedure</MenuItem>
        <MenuItem onClick={() => handleAddMenuItemClick('vaccination')}>Vaccination</MenuItem>
      </Menu>

      {/* Download Menu */}
      <Menu
        anchorEl={downloadMenuAnchor}
        open={Boolean(downloadMenuAnchor)}
        onClose={handleDownloadMenuClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        PaperProps={{
          sx: {
            mt: 1,
            minWidth: 160,
            boxShadow: 'var(--shadow-lg)',
            borderRadius: 'var(--radius-sm)',
            '& .MuiMenuItem-root': {
              fontFamily: 'var(--font-family-primary)',
              fontSize: 'var(--font-size-sm)',
              fontWeight: 'var(--font-weight-medium)',
              color: 'var(--color-text-primary)',
              padding: '10px 16px',
              '&:hover': {
                backgroundColor: 'var(--color-background-secondary)',
              },
            },
          },
        }}
      >
        <MenuItem onClick={() => handleDownloadMenuItemClick('pdf')}>Export as PDF</MenuItem>
        <MenuItem onClick={() => handleDownloadMenuItemClick('csv')}>Export as CSV</MenuItem>
        <MenuItem onClick={() => handleDownloadMenuItemClick('excel')}>Export as Excel</MenuItem>
      </Menu>

      {/* Procedure Drawer */}
      <ProcedureDrawer
        open={procedureDrawerOpen}
        onClose={handleProcedureDrawerClose}
        onSubmit={handleProcedureSubmit}
        athletes={athletesData}
        injuries={injuriesData}
      />
    </Box>
  );
}

export default MedicalPage;
