import React, { useState, useMemo } from 'react';
import {
  Box,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Checkbox,
  FormControlLabel,
  Autocomplete,
  InputAdornment,
} from '@mui/material';
import { ExpandMoreOutlined, ExpandLessOutlined, SearchOutlined, CloseOutlined } from '@mui/icons-material';
import '../styles/design-tokens.css';

const matchSearch = (label, term) => (label || '').toLowerCase().includes((term || '').toLowerCase());

const SESSION_TYPES = [
  'Agility',
  'Workout',
  "Academy rugby",
  'Catapult',
  "Club training",
  'Omegawave',
  "Player maker",
  'Rehab',
  'Speed',
];

const TYPE_OPTIONS = ["Squad sessions", "Individual sessions", 'Games', 'Events'];

const COMPETITION_OPTIONS = ["Kitman series"];

const OPPOSITION_OPTIONS = ['Dublin', 'Cork', 'Galway', 'Australia', "New zealand", 'Samoa'];

const SQUADS_MOCK = [
  '1st team',
  "Academy squad",
  'Academy team',
  "International squad",
  'Kitman Labs - Staff',
  "Kitman test squad",
  'Player view',
  'rob test',
];

const LOCATION_OPTIONS = ['Home', 'Away', 'Neutral'];

const SQUADS_VISIBLE_INITIAL = 8;

/** Same as Add Event modal – ensures identical look and feel */
const formFieldStyles = {
  '& .MuiInputBase-root': {
    backgroundColor: 'var(--color-background-secondary)',
    borderRadius: 'var(--radius-sm)',
    '&:hover': { backgroundColor: 'var(--color-background-tertiary)' },
    '&.Mui-focused': { backgroundColor: 'var(--color-background-primary)' },
    '&.Mui-disabled': { backgroundColor: 'var(--color-background-tertiary)' },
  },
  '& .MuiInputLabel-root': {
    color: 'var(--color-text-secondary)',
    fontSize: 'var(--font-size-sm)',
    fontWeight: 'var(--placeholder-font-weight)',
    fontFamily: 'var(--font-family-primary)',
    '&.Mui-focused': { color: 'var(--color-border-focus)' },
    '&.Mui-disabled': { color: 'var(--color-text-disabled)' },
  },
  '& .MuiFilledInput-root': {
    backgroundColor: 'var(--color-background-secondary)',
    borderRadius: 'var(--radius-sm)',
    '&:hover': { backgroundColor: 'var(--color-background-tertiary)' },
    '&.Mui-focused': { backgroundColor: 'var(--color-background-primary)' },
    '&:before': { borderBottom: '1px solid var(--color-border-primary)' },
    '&:hover:not(.Mui-disabled):before': { borderBottom: '1px solid var(--color-border-focus)' },
    '&.Mui-focused:after': { borderBottom: '2px solid var(--color-border-focus)' },
  },
  '& .MuiInputBase-input': {
    color: 'var(--color-text-primary)',
    fontSize: 'var(--font-size-sm)',
    fontWeight: 'var(--font-weight-medium)',
    fontFamily: 'var(--font-family-primary)',
    '&::placeholder': {
      color: 'var(--placeholder-color) !important',
      opacity: '1 !important',
      fontFamily: 'var(--placeholder-font-family) !important',
      fontSize: 'var(--placeholder-font-size) !important',
      fontWeight: 'var(--placeholder-font-weight) !important',
    },
  },
  '& .MuiSelect-select': {
    color: 'var(--color-text-primary)',
    fontSize: 'var(--font-size-sm)',
    fontWeight: 'var(--font-weight-medium)',
    fontFamily: 'var(--font-family-primary)',
  },
};

/**
 * Filters sidebar for calendar – matches Add Event modal MUI styles; dropdowns use portal so they are not clipped.
 */
const FiltersSidebar = ({
  onClose,
  selectedFilters,
  availableOptions,
  onFiltersChange,
  athletes = [],
  staff = [],
}) => {
  const [squadsExpanded, setSquadsExpanded] = useState(true);
  const [typesExpanded, setTypesExpanded] = useState(true);
  const [sessionsExpanded, setSessionsExpanded] = useState(true);
  const [gamesExpanded, setGamesExpanded] = useState(true);
  const [attendeesExpanded, setAttendeesExpanded] = useState(true);
  const [locationExpanded, setLocationExpanded] = useState(true);
  const [squadSearch, setSquadSearch] = useState('');
  const [locationSearch, setLocationSearch] = useState('');
  const [squadsShowMore, setSquadsShowMore] = useState(false);

  const squads = availableOptions.squads?.length > 0 ? availableOptions.squads : SQUADS_MOCK;
  const filteredSquads = useMemo(() => squads.filter(s => matchSearch(s, squadSearch)), [squads, squadSearch]);
  const visibleSquads = squadsShowMore ? filteredSquads : filteredSquads.slice(0, SQUADS_VISIBLE_INITIAL);
  const hasMoreSquads = filteredSquads.length > SQUADS_VISIBLE_INITIAL;

  const locations = availableOptions.locations?.length > 0 ? availableOptions.locations : LOCATION_OPTIONS;
  const filteredLocations = useMemo(
    () => locations.filter(l => matchSearch(l, locationSearch)),
    [locations, locationSearch]
  );
  const otherLocations = useMemo(
    () => filteredLocations.filter(l => !LOCATION_OPTIONS.includes(l)),
    [filteredLocations]
  );

  const staffOptions = useMemo(
    () => staff.map(s => ({ id: s.id, label: `${s.firstname} ${s.lastname}`.trim() })),
    [staff]
  );

  const athleteOptions = useMemo(() => {
    const list = [];
    athletes.forEach(a => {
      list.push({
        id: a.id,
        label: `${a.firstname} ${a.lastname}`.trim(),
        squad_name: (a.squad_name || 'Other').trim(),
      });
    });
    // Sort by squad_name to prevent duplicate headers in grouped Autocomplete
    return list.sort((a, b) => a.squad_name.localeCompare(b.squad_name));
  }, [athletes]);

  const toggleInArray = (arr, value) => (arr.includes(value) ? arr.filter(v => v !== value) : [...arr, value]);
  const setAll = (key, values) => onFiltersChange({ ...selectedFilters, [key]: values.slice() });
  const clearAll = (key) => onFiltersChange({ ...selectedFilters, [key]: [] });
  const handleToggle = (key, value) => onFiltersChange({ ...selectedFilters, [key]: toggleInArray(selectedFilters[key] || [], value) });

  const linkSx = {
    background: 'none',
    border: 'none',
    color: 'var(--color-text-secondary)',
    fontSize: 'var(--font-size-xs)',
    cursor: 'pointer',
    fontWeight: 'var(--font-weight-medium)',
    textDecoration: 'underline',
    padding: 0,
    minWidth: 0,
  };

  const FilterSection = ({
    title,
    count,
    expanded,
    onToggle,
    children,
    onSelectAll,
    onClearAll,
    showSearch = false,
    searchValue = '',
    onSearchChange = () => {},
    searchPlaceholder = 'Search',
    searchAfterChildren = false,
    showShowMore = false,
    showMoreExpanded = false,
    onShowMoreToggle = () => {},
    hasMoreSquads = false,
  }) => (
    <Box sx={{ borderBottom: '1px solid var(--color-border-primary)' }}>
      <Box
        onClick={onToggle}
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          py: 1.5,
          px: 2,
          cursor: 'pointer',
          backgroundColor: 'var(--color-background-primary)',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <Typography variant="body2" sx={{ fontWeight: 600, color: 'var(--color-text-primary)' }}>
            {title}
          </Typography>
          <Typography variant="body2" sx={{ color: 'var(--color-text-muted)' }}>{count}</Typography>
        </Box>
        {expanded ? <ExpandLessOutlined sx={{ fontSize: 20, color: 'var(--color-text-secondary)' }} /> : <ExpandMoreOutlined sx={{ fontSize: 20, color: 'var(--color-text-secondary)' }} />}
      </Box>

      {expanded && (
        <Box
          sx={{
            px: 2,
            pb: 2,
            '& .MuiFormControlLabel-root': {
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
            },
          }}
        >
          {showSearch && !searchAfterChildren && (
            <TextField
              fullWidth
              variant="filled"
              placeholder={searchPlaceholder}
              value={searchValue}
              onChange={(e) => onSearchChange(e.target.value)}
              size="small"
              sx={formFieldStyles}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <SearchOutlined sx={{ fontSize: 20, color: 'var(--color-text-secondary)' }} />
                  </InputAdornment>
                ),
              }}
            />
          )}

          {onSelectAll && onClearAll && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1, flexWrap: 'wrap' }}>
              <Box component="button" type="button" onClick={onSelectAll} sx={linkSx}>Select all</Box>
              <Typography variant="caption" sx={{ color: 'var(--color-text-disabled)' }}>|</Typography>
              <Box component="button" type="button" onClick={onClearAll} sx={linkSx}>Clear</Box>
            </Box>
          )}

          {children}

          {showSearch && searchAfterChildren && (
            <TextField
              fullWidth
              variant="filled"
              placeholder={searchPlaceholder}
              value={searchValue}
              onChange={(e) => onSearchChange(e.target.value)}
              size="small"
              sx={{ ...formFieldStyles, mt: 1 }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <SearchOutlined sx={{ fontSize: 20, color: 'var(--color-text-secondary)' }} />
                  </InputAdornment>
                ),
              }}
            />
          )}

          {showShowMore && hasMoreSquads && (
            <Box component="button" type="button" onClick={onShowMoreToggle} sx={{ ...linkSx, mt: 0.5 }}>
              {showMoreExpanded ? 'Show less' : 'Show more'}
            </Box>
          )}
        </Box>
      )}
    </Box>
  );

  const sessionsCount = (selectedFilters.sessions || []).length;
  const attendeesCount = (selectedFilters.attendeesAthletes || []).length + (selectedFilters.attendeesStaff || []).length;
  const gamesCount = [selectedFilters.gamesCompetition, selectedFilters.gamesOpposition].filter(Boolean).length;

  const sessionsSelected = selectedFilters.sessions || [];
  const staffSelected = (selectedFilters.attendeesStaff || []).map(id => staffOptions.find(s => s.id === id)).filter(Boolean);
  const athletesSelected = (selectedFilters.attendeesAthletes || []).map(id => athleteOptions.find(a => a.id === id)).filter(Boolean);

  return (
    <Box
      sx={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: 'var(--color-background-primary)',
        borderRight: '1px solid var(--color-border-primary)',
        overflow: 'hidden',
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 2, borderBottom: '1px solid var(--color-border-primary)' }}>
        <Typography variant="h6" sx={{ fontWeight: 600, color: 'var(--color-text-primary)', fontSize: 'var(--font-size-base)' }}>
          Filters
        </Typography>
        <IconButton onClick={onClose} size="small" sx={{ color: 'var(--color-text-secondary)' }}>
          <CloseOutlined />
        </IconButton>
      </Box>

      <Box sx={{ flex: 1, overflowY: 'auto', overflowX: 'hidden' }}>
        <FilterSection
          title="Squads"
          count={selectedFilters.squads?.length || 0}
          expanded={squadsExpanded}
          onToggle={() => setSquadsExpanded(!squadsExpanded)}
          onSelectAll={() => setAll('squads', squads)}
          onClearAll={() => clearAll('squads')}
          showSearch
          searchValue={squadSearch}
          onSearchChange={setSquadSearch}
          searchPlaceholder="Search"
          showShowMore
          showMoreExpanded={squadsShowMore}
          onShowMoreToggle={() => setSquadsShowMore(!squadsShowMore)}
          hasMoreSquads={hasMoreSquads}
        >
          {visibleSquads.map((item) => (
            <FormControlLabel
              key={item}
              control={
                <Checkbox
                  size="small"
                  checked={(selectedFilters.squads || []).includes(item)}
                  onChange={() => handleToggle('squads', item)}
                  sx={{ color: 'var(--color-text-secondary)', '&.Mui-checked': { color: 'var(--color-primary)' } }}
                />
              }
              label={<Typography variant="body2" sx={{ color: 'var(--color-text-primary)' }}>{item}</Typography>}
              sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', m: 0, mr: 0, mb: 0.25 }}
            />
          ))}
        </FilterSection>

        <FilterSection
          title="Types"
          count={selectedFilters.types?.length || 0}
          expanded={typesExpanded}
          onToggle={() => setTypesExpanded(!typesExpanded)}
          onSelectAll={() => setAll('types', TYPE_OPTIONS)}
          onClearAll={() => clearAll('types')}
          showSearch={false}
        >
          {TYPE_OPTIONS.map((item) => (
            <FormControlLabel
              key={item}
              control={
                <Checkbox
                  size="small"
                  checked={(selectedFilters.types || []).includes(item)}
                  onChange={() => handleToggle('types', item)}
                  sx={{ color: 'var(--color-text-secondary)', '&.Mui-checked': { color: 'var(--color-primary)' } }}
                />
              }
              label={<Typography variant="body2" sx={{ color: 'var(--color-text-primary)' }}>{item}</Typography>}
              sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', m: 0, mr: 0, mb: 0.25 }}
            />
          ))}
        </FilterSection>

        <FilterSection
          title="Sessions"
          count={sessionsCount}
          expanded={sessionsExpanded}
          onToggle={() => setSessionsExpanded(!sessionsExpanded)}
          showSearch={false}
        >
          <Autocomplete
            multiple
            size="small"
            options={SESSION_TYPES}
            value={sessionsSelected}
            onChange={(_, newValue) => onFiltersChange({ ...selectedFilters, sessions: newValue })}
            disableCloseOnSelect
            renderOption={(props, option, { selected }) => (
              <li {...props} key={option}>
                <Checkbox
                  size="small"
                  checked={selected}
                  sx={{ color: 'var(--color-text-secondary)', '&.Mui-checked': { color: 'var(--color-primary)' } }}
                />
                <Typography variant="body2" sx={{ ml: 0.5 }}>{option}</Typography>
              </li>
            )}
            renderInput={(params) => (
              <TextField
                {...params}
                variant="filled"
                placeholder="Search session types"
                sx={formFieldStyles}
              />
            )}
            componentsProps={{
              popper: {
                sx: { zIndex: 1300 },
              },
            }}
          />
        </FilterSection>

        <FilterSection
          title="Games"
          count={gamesCount}
          expanded={gamesExpanded}
          onToggle={() => setGamesExpanded(!gamesExpanded)}
          showSearch={false}
        >
          <FormControl fullWidth variant="filled" size="small" sx={{ ...formFieldStyles, mb: 1.5 }}>
            <InputLabel>Competition</InputLabel>
            <Select
              value={selectedFilters.gamesCompetition || ''}
              onChange={(e) => onFiltersChange({ ...selectedFilters, gamesCompetition: e.target.value || undefined })}
              label="Competition"
            >
              <MenuItem value="">Select competition</MenuItem>
              {COMPETITION_OPTIONS.map((o) => (
                <MenuItem key={o} value={o}>{o}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth variant="filled" size="small" sx={formFieldStyles}>
            <InputLabel>Opposition</InputLabel>
            <Select
              value={selectedFilters.gamesOpposition || ''}
              onChange={(e) => onFiltersChange({ ...selectedFilters, gamesOpposition: e.target.value || undefined })}
              label="Opposition"
            >
              <MenuItem value="">Select opposition</MenuItem>
              {OPPOSITION_OPTIONS.map((o) => (
                <MenuItem key={o} value={o}>{o}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </FilterSection>

        <FilterSection
          title="Attendees"
          count={attendeesCount}
          expanded={attendeesExpanded}
          onToggle={() => setAttendeesExpanded(!attendeesExpanded)}
          showSearch={false}
        >
          <Typography variant="caption" sx={{ color: 'var(--color-text-secondary)', display: 'block', mb: 0.5 }}>Athletes</Typography>
          <Autocomplete
            multiple
            size="small"
            options={athleteOptions}
            value={athletesSelected}
            onChange={(_, newValue) => onFiltersChange({ ...selectedFilters, attendeesAthletes: newValue.map(a => a.id) })}
            getOptionLabel={(opt) => (opt && opt.label) || ''}
            groupBy={(opt) => opt.squad_name || 'Other'}
            disableCloseOnSelect
            renderOption={(props, option, { selected }) => (
              <li {...props} key={option.id}>
                <Checkbox
                  size="small"
                  checked={selected}
                  sx={{ color: 'var(--color-text-secondary)', '&.Mui-checked': { color: 'var(--color-primary)' } }}
                />
                <Typography variant="body2" sx={{ ml: 0.5 }}>{option.label}</Typography>
              </li>
            )}
            renderInput={(params) => (
              <TextField
                {...params}
                variant="filled"
                placeholder="Search for athletes"
                sx={formFieldStyles}
              />
            )}
            componentsProps={{
              popper: {
                sx: { zIndex: 1300 },
              },
            }}
          />
          <Typography variant="caption" sx={{ color: 'var(--color-text-secondary)', display: 'block', mt: 1.5, mb: 0.5 }}>Staff</Typography>
          <Autocomplete
            multiple
            size="small"
            options={staffOptions}
            value={staffSelected}
            onChange={(_, newValue) => onFiltersChange({ ...selectedFilters, attendeesStaff: newValue.map(s => s.id) })}
            getOptionLabel={(opt) => (opt && opt.label) || ''}
            disableCloseOnSelect
            renderOption={(props, option, { selected }) => (
              <li {...props} key={option.id}>
                <Checkbox
                  size="small"
                  checked={selected}
                  sx={{ color: 'var(--color-text-secondary)', '&.Mui-checked': { color: 'var(--color-primary)' } }}
                />
                <Typography variant="body2" sx={{ ml: 0.5 }}>{option.label}</Typography>
              </li>
            )}
            renderInput={(params) => (
              <TextField
                {...params}
                variant="filled"
                placeholder="Search for staff"
                sx={formFieldStyles}
              />
            )}
            componentsProps={{
              popper: {
                sx: { zIndex: 1300 },
              },
            }}
          />
        </FilterSection>

        <FilterSection
          title="Location"
          count={(selectedFilters.locations || []).length}
          expanded={locationExpanded}
          onToggle={() => setLocationExpanded(!locationExpanded)}
          onSelectAll={() => setAll('locations', LOCATION_OPTIONS)}
          onClearAll={() => clearAll('locations')}
          showSearch
          searchValue={locationSearch}
          onSearchChange={setLocationSearch}
          searchPlaceholder="Search locations"
          searchAfterChildren
        >
          {LOCATION_OPTIONS.map((item) => (
            <FormControlLabel
              key={item}
              control={
                <Checkbox
                  size="small"
                  checked={(selectedFilters.locations || []).includes(item)}
                  onChange={() => handleToggle('locations', item)}
                  sx={{ color: 'var(--color-text-secondary)', '&.Mui-checked': { color: 'var(--color-primary)' } }}
                />
              }
              label={<Typography variant="body2" sx={{ color: 'var(--color-text-primary)' }}>{item}</Typography>}
              sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', m: 0, mr: 0, mb: 0.25 }}
            />
          ))}
          {otherLocations.length > 0 && (
            <Box sx={{ mt: 1 }}>
              <Typography variant="caption" sx={{ color: 'var(--color-text-secondary)', display: 'block', mb: 0.5 }}>Other locations</Typography>
              {otherLocations.map((item) => (
                <FormControlLabel
                  key={item}
                  control={
                    <Checkbox
                      size="small"
                      checked={(selectedFilters.locations || []).includes(item)}
                      onChange={() => handleToggle('locations', item)}
                      sx={{ color: 'var(--color-text-secondary)', '&.Mui-checked': { color: 'var(--color-primary)' } }}
                    />
                  }
                  label={<Typography variant="body2" sx={{ color: 'var(--color-text-primary)' }}>{item}</Typography>}
                  sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', m: 0, mr: 0, mb: 0.25 }}
                />
              ))}
            </Box>
          )}
        </FilterSection>
      </Box>
    </Box>
  );
};

export default FiltersSidebar;
