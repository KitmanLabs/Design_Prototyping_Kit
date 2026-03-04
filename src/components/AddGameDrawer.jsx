import React, { useState, useEffect } from 'react';
import {
  Drawer,
  Box,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Chip,
  Autocomplete,
  Checkbox,
  Paper,
  Grid,
  InputAdornment,
  Collapse,
  FormControlLabel,
  ToggleButtonGroup,
  ToggleButton,
} from '@mui/material';
import {
  Close,
  AttachFile,
  Person,
  CalendarToday,
  Schedule,
  ExpandMore,
  ExpandLess,
  Check,
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import Button from './Button';
import LocationPicker from './LocationPicker';
import savedLocationsData from '../data/saved_locations.json';

// Mock data – teams, opposition, competitions, venues, etc.
const MOCK_TEAMS = [
  { id: '1', name: 'First Team' },
  { id: '2', name: 'U21' },
  { id: '3', name: 'Reserves' },
  { id: '4', name: 'Academy' },
];

const MOCK_OPPOSITION = [
  'Arsenal FC',
  'Chelsea FC',
  'Liverpool FC',
  'Manchester United',
  'Manchester City',
  'Tottenham Hotspur',
  'Newcastle United',
  'Aston Villa',
  'Brighton & Hove Albion',
  'West Ham United',
];

const MOCK_COMPETITIONS = [
  'Premier League',
  'FA Cup',
  'Champions League',
  'Europa League',
  'League Cup',
  'Friendly',
  'International',
];

const MOCK_VENUES = [
  'Home Stadium',
  'Away',
  'Neutral venue',
  'Training ground',
  'Wembley Stadium',
  'Old Trafford',
];

const MOCK_LOCATIONS = [
  'Home Stadium',
  'Away',
  'Wembley Stadium',
  'Old Trafford',
  'Training Center A',
  'Training Center B',
];

const MOCK_TIMEZONES = [
  'Europe/Dublin',
  'UTC',
  'Europe/London',
  'America/New_York',
  'Europe/Paris',
  'Australia/Sydney',
];

const MOCK_SURFACE_TYPES = ['Pitch', 'Court', 'Track', 'Gymnasium', 'Pool', 'Field'];

const MOCK_SURFACE_QUALITY = ['Excellent', 'Good', 'Fair', 'Poor', 'New', 'Worn'];

const MOCK_WEATHER = [
  'Sunny',
  'Partly cloudy',
  'Overcast',
  'Rainy',
  'Snowy',
  'Windy',
  'Foggy',
];

const MOCK_REMINDER_EMAIL = [
  '1 hour before',
  '2 hours before',
  '1 day before',
  '2 days before',
  'Custom',
  'Never',
];

const MOCK_REMINDER_PUSH = [
  '15 minutes before',
  '30 minutes before',
  '1 hour before',
  'Custom',
  'Never',
];

const MOCK_REMINDER_TYPES = [
  'General',
  'Pre-game check-in',
  'Post-game feedback',
  'Injury update',
  'Custom',
];

const DESCRIPTION_MAX = 250;

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

const AddGameDrawer = ({ open, onClose, onSave, athletes = [], staff = [], editingEvent = null }) => {
  const [attendanceOpen, setAttendanceOpen] = useState(true);
  const [formData, setFormData] = useState({
    date: new Date(),
    startTime: new Date(new Date().setHours(15, 20, 0, 0)),
    duration: 80,
    timezone: 'Europe/Dublin',
    location: '',
    selectedAthletes: [],
    team: '',
    teamScore: '',
    opposition: '',
    oppositionScore: '',
    competition: '',
    roundNumber: '',
    venue: '',
    createTurnaroundMarker: true,
    turnaroundPrefix: '',
    surfaceType: '',
    surfaceQuality: '',
    weather: '',
    temperature: '',
    description: '',
    attachments: [],
    attachTitle: '',
    attachLink: '',
    notifyStaffBy: ['push'],
    notifyAthletesBy: [],
    reminderEmail: '',
    reminderPush: '',
    reminderType: '',
  });

  // Populate form when editing an existing game/match
  useEffect(() => {
    if (editingEvent) {
      const startDate = new Date(editingEvent.start);
      const endDate = new Date(editingEvent.end);
      const durationMinutes = Math.round((endDate - startDate) / 60000);

      setFormData({
        date: startDate,
        startTime: startDate,
        duration: durationMinutes,
        timezone: editingEvent.extendedProps?.timezone || 'Europe/Dublin',
        location: editingEvent.extendedProps?.location || '',
        selectedAthletes: editingEvent.extendedProps?.selectedAthletes || [],
        team: editingEvent.extendedProps?.team || '',
        teamScore: editingEvent.extendedProps?.teamScore || '',
        opposition: editingEvent.extendedProps?.opposition || '',
        oppositionScore: editingEvent.extendedProps?.oppositionScore || '',
        competition: editingEvent.extendedProps?.competition || '',
        roundNumber: editingEvent.extendedProps?.roundNumber || '',
        venue: editingEvent.extendedProps?.venue || '',
        createTurnaroundMarker: editingEvent.extendedProps?.createTurnaroundMarker !== undefined 
          ? editingEvent.extendedProps.createTurnaroundMarker 
          : true,
        turnaroundPrefix: editingEvent.extendedProps?.turnaroundPrefix || '',
        surfaceType: editingEvent.extendedProps?.surfaceType || '',
        surfaceQuality: editingEvent.extendedProps?.surfaceQuality || '',
        weather: editingEvent.extendedProps?.weather || '',
        temperature: editingEvent.extendedProps?.temperature || '',
        description: editingEvent.extendedProps?.description || '',
        attachments: editingEvent.extendedProps?.attachments || [],
        attachTitle: '',
        attachLink: '',
        notifyStaffBy: editingEvent.extendedProps?.notifyStaffBy || ['push'],
        notifyAthletesBy: editingEvent.extendedProps?.notifyAthletesBy || [],
        reminderEmail: editingEvent.extendedProps?.reminderEmail || '',
        reminderPush: editingEvent.extendedProps?.reminderPush || '',
        reminderType: editingEvent.extendedProps?.reminderType || '',
      });
    }
  }, [editingEvent]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleNotifyStaff = (_, newVal) => {
    if (newVal !== null) setFormData((prev) => ({ ...prev, notifyStaffBy: newVal }));
  };

  const handleNotifyAthletes = (_, newVal) => {
    if (newVal !== null) setFormData((prev) => ({ ...prev, notifyAthletesBy: newVal }));
  };

  const handleFileUpload = (event) => {
    const files = Array.from(event.target.files || []);
    setFormData((prev) => ({ ...prev, attachments: [...prev.attachments, ...files] }));
  };

  const removeAttachment = (index) => {
    setFormData((prev) => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index),
    }));
  };

  const handleAddLink = () => {
    if (!formData.attachTitle && !formData.attachLink) return;
    // In a real app would append to a links list; for mock we just clear
    setFormData((prev) => ({ ...prev, attachTitle: '', attachLink: '' }));
  };

  const getAthleteLabel = (a) =>
    a ? `${a.firstname || ''} ${a.lastname || ''}`.trim() || a.name : '';

  const handleSave = () => {
    const startDateTime = new Date(formData.date);
    startDateTime.setHours(
      formData.startTime.getHours(),
      formData.startTime.getMinutes(),
      0,
      0
    );
    const endDateTime = new Date(startDateTime.getTime() + formData.duration * 60000);
    const newGame = {
      id: `game-${Date.now()}`,
      title: formData.opposition ? `vs ${formData.opposition}` : 'New game',
      start: startDateTime.toISOString(),
      end: endDateTime.toISOString(),
      backgroundColor: 'var(--color-chart-4)',
      borderColor: 'var(--color-chart-4)',
      textColor: 'var(--color-white)',
      extendedProps: {
        eventType: 'GAME',
        squad: formData.team || 'First Team',
        location: formData.location,
        opposition: formData.opposition,
        competition: formData.competition,
        venue: formData.venue,
        teamScore: formData.teamScore,
        oppositionScore: formData.oppositionScore,
        selectedAthletes: formData.selectedAthletes,
        createTurnaroundMarker: formData.createTurnaroundMarker,
        turnaroundPrefix: formData.turnaroundPrefix,
        surfaceType: formData.surfaceType,
        surfaceQuality: formData.surfaceQuality,
        weather: formData.weather,
        temperature: formData.temperature,
        description: formData.description,
        attachments: formData.attachments,
        notifyStaffBy: formData.notifyStaffBy,
        notifyAthletesBy: formData.notifyAthletesBy,
        reminderEmail: formData.reminderEmail,
        reminderPush: formData.reminderPush,
        reminderType: formData.reminderType,
      },
    };
    onSave(newGame);
    onClose();
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Drawer
        anchor="right"
        open={open}
        onClose={onClose}
        PaperProps={{ sx: { width: '480px', maxWidth: '90vw' } }}
      >
        <Box
          sx={{
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: 'var(--color-background-primary)',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '24px 24px 16px 24px',
              borderBottom: '1px solid var(--color-border-primary)',
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 600, color: 'var(--color-text-primary)' }}>
              {editingEvent ? 'Edit game' : 'New game'}
            </Typography>
            <IconButton onClick={onClose} size="small">
              <Close />
            </IconButton>
          </Box>

          <Box sx={{ flex: 1, overflow: 'auto', padding: '24px' }}>
            <Grid container spacing={3}>
              {/* Date */}
              <Grid item xs={12}>
                <DatePicker
                  label="Date"
                  value={formData.date}
                  onChange={(newVal) => handleInputChange('date', newVal)}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      variant: 'filled',
                      InputLabelProps: { shrink: true },
                      InputProps: {
                        startAdornment: (
                          <InputAdornment position="start">
                            <CalendarToday fontSize="small" />
                          </InputAdornment>
                        ),
                      },
                      sx: formFieldStyles,
                    },
                  }}
                />
              </Grid>
              {/* Start time */}
              <Grid item xs={12}>
                <TimePicker
                  label="Start time"
                  value={formData.startTime}
                  onChange={(newVal) => handleInputChange('startTime', newVal)}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      variant: 'filled',
                      InputLabelProps: { shrink: true },
                      InputProps: {
                        startAdornment: (
                          <InputAdornment position="start">
                            <Schedule fontSize="small" />
                          </InputAdornment>
                        ),
                      },
                      sx: formFieldStyles,
                    },
                  }}
                />
              </Grid>
              {/* Duration */}
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  variant="filled"
                  label="Duration"
                  type="number"
                  value={formData.duration}
                  onChange={(e) =>
                    handleInputChange('duration', parseInt(e.target.value, 10) || 0)
                  }
                  InputLabelProps={{ shrink: true }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <Typography component="span" sx={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)' }}>
                          mins
                        </Typography>
                      </InputAdornment>
                    ),
                  }}
                  sx={formFieldStyles}
                />
              </Grid>
              {/* Timezone */}
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth variant="filled" sx={formFieldStyles}>
                  <InputLabel shrink>Timezone</InputLabel>
                  <Select
                    value={formData.timezone}
                    onChange={(e) => handleInputChange('timezone', e.target.value)}
                    label="Timezone"
                  >
                    {MOCK_TIMEZONES.map((tz) => (
                      <MenuItem key={tz} value={tz}>
                        {tz}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              {/* Location */}
              <Grid item xs={12}>
                <LocationPicker
                  value={formData.location}
                  onChange={(value) => handleInputChange('location', value)}
                  savedLocations={savedLocationsData}
                />
              </Grid>

              {/* Attendance (collapsible) */}
              <Grid item xs={12}>
                <Box
                  onClick={() => setAttendanceOpen(!attendanceOpen)}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                    mb: 1,
                  }}
                >
                  <Typography
                    variant="subtitle2"
                    sx={{ fontWeight: 600, color: 'var(--color-text-primary)' }}
                  >
                    Attendance
                  </Typography>
                  <IconButton size="small">
                    {attendanceOpen ? <ExpandLess /> : <ExpandMore />}
                  </IconButton>
                </Box>
                <Collapse in={attendanceOpen}>
                  <Autocomplete
                    multiple
                    options={athletes}
                    getOptionLabel={getAthleteLabel}
                    value={formData.selectedAthletes}
                    onChange={(event, newValue) =>
                      handleInputChange('selectedAthletes', newValue)
                    }
                    renderTags={(value, getTagProps) =>
                      value.map((option, index) => (
                        <Chip
                          key={option.id}
                          label={getAthleteLabel(option)}
                          {...getTagProps({ index })}
                          icon={<Person />}
                          sx={{
                            backgroundColor: 'var(--color-background-selected)',
                            color: 'var(--color-text-primary)',
                            '& .MuiChip-deleteIcon': {
                              color: 'var(--color-text-secondary)',
                            },
                          }}
                        />
                      ))
                    }
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        variant="filled"
                        label="Athletes"
                        placeholder="No athletes selected"
                        InputLabelProps={{ shrink: true }}
                        sx={formFieldStyles}
                      />
                    )}
                  />
                </Collapse>
              </Grid>

              {/* Game details: Team, Score, Opposition, Score, Competition */}
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth variant="filled" sx={formFieldStyles}>
                  <InputLabel shrink>Team</InputLabel>
                  <Select
                    value={formData.team}
                    onChange={(e) => handleInputChange('team', e.target.value)}
                    label="Team"
                    displayEmpty
                    renderValue={(v) => v || ''}
                  >
                    <MenuItem value="">
                      <em>Select team</em>
                    </MenuItem>
                    {MOCK_TEAMS.map((t) => (
                      <MenuItem key={t.id} value={t.name}>
                        {t.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  variant="filled"
                  label="Score"
                  value={formData.teamScore}
                  onChange={(e) => handleInputChange('teamScore', e.target.value)}
                  placeholder="—"
                  InputLabelProps={{ shrink: true }}
                  sx={formFieldStyles}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth variant="filled" sx={formFieldStyles}>
                  <InputLabel shrink>Opposition</InputLabel>
                  <Select
                    value={formData.opposition}
                    onChange={(e) => handleInputChange('opposition', e.target.value)}
                    label="Opposition"
                    displayEmpty
                    renderValue={(v) => v || ''}
                  >
                    <MenuItem value="">
                      <em>Select opposition</em>
                    </MenuItem>
                    {MOCK_OPPOSITION.map((opp) => (
                      <MenuItem key={opp} value={opp}>
                        {opp}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  variant="filled"
                  label="Score"
                  value={formData.oppositionScore}
                  onChange={(e) =>
                    handleInputChange('oppositionScore', e.target.value)
                  }
                  placeholder="—"
                  InputLabelProps={{ shrink: true }}
                  sx={formFieldStyles}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth variant="filled" sx={formFieldStyles}>
                  <InputLabel shrink>Competition</InputLabel>
                  <Select
                    value={formData.competition}
                    onChange={(e) =>
                      handleInputChange('competition', e.target.value)
                    }
                    label="Competition"
                    displayEmpty
                    renderValue={(v) => v || ''}
                  >
                    <MenuItem value="">
                      <em>Select competition</em>
                    </MenuItem>
                    {MOCK_COMPETITIONS.map((c) => (
                      <MenuItem key={c} value={c}>
                        {c}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              {/* Round number (optional), Venue */}
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  variant="filled"
                  label="Round number"
                  value={formData.roundNumber}
                  onChange={(e) =>
                    handleInputChange('roundNumber', e.target.value)
                  }
                  placeholder="Optional"
                  InputLabelProps={{ shrink: true }}
                  sx={formFieldStyles}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth variant="filled" sx={formFieldStyles}>
                  <InputLabel shrink>Venue</InputLabel>
                  <Select
                    value={formData.venue}
                    onChange={(e) => handleInputChange('venue', e.target.value)}
                    label="Venue"
                    displayEmpty
                    renderValue={(v) => v || ''}
                  >
                    <MenuItem value="">
                      <em>Select venue</em>
                    </MenuItem>
                    {MOCK_VENUES.map((v) => (
                      <MenuItem key={v} value={v}>
                        {v}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              {/* Turnaround marker */}
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Checkbox
                      size="small"
                      checked={formData.createTurnaroundMarker}
                      onChange={(e) =>
                        handleInputChange(
                          'createTurnaroundMarker',
                          e.target.checked
                        )
                      }
                      sx={{
                        color: 'var(--color-text-secondary)',
                        '&.Mui-checked': { color: 'var(--color-primary)' },
                      }}
                    />
                  }
                  label={
                    <Typography
                      variant="body2"
                      sx={{ color: 'var(--color-text-primary)' }}
                    >
                      Create turnaround marker
                    </Typography>
                  }
                />
                {formData.createTurnaroundMarker && (
                  <TextField
                    fullWidth
                    variant="filled"
                    label="Turnaround prefix"
                    value={formData.turnaroundPrefix}
                    onChange={(e) =>
                      handleInputChange('turnaroundPrefix', e.target.value)
                    }
                    placeholder="Enter prefix"
                    InputLabelProps={{ shrink: true }}
                    sx={{ ...formFieldStyles, mt: 1 }}
                  />
                )}
              </Grid>

              {/* Additional details (optional) */}
              <Grid item xs={12}>
                <Typography
                  variant="subtitle2"
                  sx={{
                    mb: 1,
                    fontWeight: 600,
                    color: 'var(--color-text-primary)',
                  }}
                >
                  Additional details{' '}
                  <Box component="span" sx={{ color: 'var(--color-text-secondary)', fontWeight: 400 }}>
                    (Optional)
                  </Box>
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <FormControl fullWidth variant="filled" sx={formFieldStyles}>
                      <InputLabel shrink>Surface type</InputLabel>
                      <Select
                        value={formData.surfaceType}
                        onChange={(e) =>
                          handleInputChange('surfaceType', e.target.value)
                        }
                        label="Surface type"
                        displayEmpty
                        renderValue={(v) => v || ''}
                      >
                        <MenuItem value="">
                          <em>Select</em>
                        </MenuItem>
                        {MOCK_SURFACE_TYPES.map((s) => (
                          <MenuItem key={s} value={s}>
                            {s}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={6}>
                    <FormControl fullWidth variant="filled" sx={formFieldStyles}>
                      <InputLabel shrink>Surface quality</InputLabel>
                      <Select
                        value={formData.surfaceQuality}
                        onChange={(e) =>
                          handleInputChange('surfaceQuality', e.target.value)
                        }
                        label="Surface quality"
                        displayEmpty
                        renderValue={(v) => v || ''}
                      >
                        <MenuItem value="">
                          <em>Select</em>
                        </MenuItem>
                        {MOCK_SURFACE_QUALITY.map((s) => (
                          <MenuItem key={s} value={s}>
                            {s}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={6}>
                    <FormControl fullWidth variant="filled" sx={formFieldStyles}>
                      <InputLabel shrink>Weather</InputLabel>
                      <Select
                        value={formData.weather}
                        onChange={(e) =>
                          handleInputChange('weather', e.target.value)
                        }
                        label="Weather"
                        displayEmpty
                        renderValue={(v) => v || ''}
                      >
                        <MenuItem value="">
                          <em>Select</em>
                        </MenuItem>
                        {MOCK_WEATHER.map((w) => (
                          <MenuItem key={w} value={w}>
                            {w}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      variant="filled"
                      label="Temperature"
                      value={formData.temperature}
                      onChange={(e) =>
                        handleInputChange('temperature', e.target.value)
                      }
                      placeholder="—"
                      InputLabelProps={{ shrink: true }}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">°C</InputAdornment>
                        ),
                      }}
                      sx={formFieldStyles}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      variant="filled"
                      label="Description"
                      multiline
                      rows={3}
                      value={formData.description}
                      onChange={(e) =>
                        handleInputChange('description', e.target.value)
                      }
                      helperText={`${DESCRIPTION_MAX - formData.description.length} characters remaining`}
                      inputProps={{ maxLength: DESCRIPTION_MAX }}
                      InputLabelProps={{ shrink: true }}
                      sx={formFieldStyles}
                    />
                  </Grid>
                </Grid>
              </Grid>

              {/* Attach */}
              <Grid item xs={12}>
                <Typography
                  variant="subtitle2"
                  sx={{ mb: 1, fontWeight: 600, color: 'var(--color-text-primary)' }}
                >
                  Attach
                </Typography>
                <Paper
                  variant="outlined"
                  sx={{
                    p: 2,
                    textAlign: 'center',
                    border: '2px dashed var(--color-border-primary)',
                    backgroundColor: 'var(--color-background-secondary)',
                    cursor: 'pointer',
                    '&:hover': { backgroundColor: 'var(--color-background-tertiary)' },
                  }}
                  onClick={() => document.getElementById('game-file-upload').click()}
                >
                  <AttachFile
                    sx={{ fontSize: 32, color: 'var(--color-text-muted)', mb: 1 }}
                  />
                  <Typography variant="body2" sx={{ color: 'var(--color-text-secondary)' }}>
                    Drag & Drop your files or browse
                  </Typography>
                </Paper>
                <input
                  id="game-file-upload"
                  type="file"
                  multiple
                  style={{ display: 'none' }}
                  onChange={handleFileUpload}
                />
                {formData.attachments.length > 0 && (
                  <Box sx={{ mt: 2 }}>
                    {formData.attachments.map((file, index) => (
                      <Chip
                        key={index}
                        label={file.name}
                        onDelete={() => removeAttachment(index)}
                        sx={{
                          mr: 1,
                          mb: 1,
                          backgroundColor: 'var(--color-background-selected)',
                          color: 'var(--color-text-primary)',
                          '& .MuiChip-deleteIcon': {
                            color: 'var(--color-text-secondary)',
                          },
                        }}
                      />
                    ))}
                  </Box>
                )}
                <Grid container spacing={2} sx={{ mt: 1 }}>
                  <Grid item xs={12} sm={5}>
                    <TextField
                      fullWidth
                      variant="filled"
                      label="Title"
                      value={formData.attachTitle}
                      onChange={(e) =>
                        handleInputChange('attachTitle', e.target.value)
                      }
                      InputLabelProps={{ shrink: true }}
                      sx={formFieldStyles}
                    />
                  </Grid>
                  <Grid item xs={12} sm={5}>
                    <TextField
                      fullWidth
                      variant="filled"
                      label="Link"
                      value={formData.attachLink}
                      onChange={(e) =>
                        handleInputChange('attachLink', e.target.value)
                      }
                      InputLabelProps={{ shrink: true }}
                      sx={formFieldStyles}
                    />
                  </Grid>
                  <Grid item xs={12} sm={2} sx={{ display: 'flex', alignItems: 'flex-end', pb: 0.5 }}>
                    <Button variant="primary" onClick={handleAddLink} style={{ width: '100%' }}>
                      Add
                    </Button>
                  </Grid>
                </Grid>
              </Grid>

              {/* Notifications */}
              <Grid item xs={12}>
                <Typography
                  variant="subtitle2"
                  sx={{ mb: 1, fontWeight: 600, color: 'var(--color-text-primary)' }}
                >
                  Notifications
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: 'var(--color-text-secondary)', mb: 0.5 }}
                >
                  Notify staff by
                </Typography>
                <ToggleButtonGroup
                  value={formData.notifyStaffBy}
                  onChange={handleNotifyStaff}
                  multiple
                  size="small"
                  sx={{
                    mb: 2,
                    '& .MuiToggleButton-root': {
                      textTransform: 'none',
                      fontSize: 'var(--font-size-sm)',
                      fontFamily: 'var(--font-family-primary)',
                      '&.Mui-selected': {
                        backgroundColor: 'var(--color-primary)',
                        color: 'var(--color-white)',
                        '&:hover': {
                          backgroundColor: 'var(--color-primary-hover)',
                        },
                      },
                    },
                  }}
                >
                  <ToggleButton value="email">
                    {formData.notifyStaffBy.includes('email') && (
                      <Check sx={{ fontSize: 16, mr: 0.5 }} />
                    )}
                    Email
                  </ToggleButton>
                  <ToggleButton value="push">
                    {formData.notifyStaffBy.includes('push') && (
                      <Check sx={{ fontSize: 16, mr: 0.5 }} />
                    )}
                    Push
                  </ToggleButton>
                </ToggleButtonGroup>
                <Typography
                  variant="body2"
                  sx={{ color: 'var(--color-text-secondary)', mb: 0.5 }}
                >
                  Notify athletes by
                </Typography>
                <ToggleButtonGroup
                  value={formData.notifyAthletesBy}
                  onChange={handleNotifyAthletes}
                  multiple
                  size="small"
                  sx={{
                    '& .MuiToggleButton-root': {
                      textTransform: 'none',
                      fontSize: 'var(--font-size-sm)',
                      fontFamily: 'var(--font-family-primary)',
                      '&.Mui-selected': {
                        backgroundColor: 'var(--color-primary)',
                        color: 'var(--color-white)',
                        '&:hover': {
                          backgroundColor: 'var(--color-primary-hover)',
                        },
                      },
                    },
                  }}
                >
                  <ToggleButton value="email">
                    {formData.notifyAthletesBy.includes('email') && (
                      <Check sx={{ fontSize: 16, mr: 0.5 }} />
                    )}
                    Email
                  </ToggleButton>
                  <ToggleButton value="push">
                    {formData.notifyAthletesBy.includes('push') && (
                      <Check sx={{ fontSize: 16, mr: 0.5 }} />
                    )}
                    Push
                  </ToggleButton>
                </ToggleButtonGroup>
              </Grid>

              {/* Reminders */}
              <Grid item xs={12}>
                <Typography
                  variant="subtitle2"
                  sx={{
                    mb: 1,
                    fontWeight: 600,
                    color: 'var(--color-text-primary)',
                    pt: 1,
                    borderTop: '1px solid var(--color-border-primary)',
                  }}
                >
                  Reminders
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <FormControl fullWidth variant="filled" sx={formFieldStyles}>
                      <InputLabel shrink>Email</InputLabel>
                      <Select
                        value={formData.reminderEmail}
                        onChange={(e) =>
                          handleInputChange('reminderEmail', e.target.value)
                        }
                        label="Email"
                        displayEmpty
                        renderValue={(v) => v || ''}
                      >
                        <MenuItem value="">
                          <em>Select</em>
                        </MenuItem>
                        {MOCK_REMINDER_EMAIL.map((r) => (
                          <MenuItem key={r} value={r}>
                            {r}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={6}>
                    <FormControl fullWidth variant="filled" sx={formFieldStyles}>
                      <InputLabel shrink>Push</InputLabel>
                      <Select
                        value={formData.reminderPush}
                        onChange={(e) =>
                          handleInputChange('reminderPush', e.target.value)
                        }
                        label="Push"
                        displayEmpty
                        renderValue={(v) => v || ''}
                      >
                        <MenuItem value="">
                          <em>Select</em>
                        </MenuItem>
                        {MOCK_REMINDER_PUSH.map((r) => (
                          <MenuItem key={r} value={r}>
                            {r}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12}>
                    <FormControl fullWidth variant="filled" sx={formFieldStyles}>
                      <InputLabel shrink>Reminder</InputLabel>
                      <Select
                        value={formData.reminderType}
                        onChange={(e) =>
                          handleInputChange('reminderType', e.target.value)
                        }
                        label="Reminder"
                        displayEmpty
                        renderValue={(v) => v || ''}
                      >
                        <MenuItem value="">
                          <em>Select</em>
                        </MenuItem>
                        {MOCK_REMINDER_TYPES.map((r) => (
                          <MenuItem key={r} value={r}>
                            {r}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Box>

          <Box
            sx={{
              padding: '16px 24px',
              borderTop: '1px solid var(--color-border-primary)',
              backgroundColor: 'var(--color-background-primary)',
            }}
          >
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'space-between' }}>
              <Button onClick={onClose} variant="secondary">
                Cancel
              </Button>
              <Button onClick={handleSave} variant="primary">
                Save
              </Button>
            </Box>
          </Box>
        </Box>
      </Drawer>
    </LocalizationProvider>
  );
};

export default AddGameDrawer;
