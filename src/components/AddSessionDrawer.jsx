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
  Paper,
  Grid,
  InputAdornment,
  Collapse,
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

// Mock data – session types, locations, etc.
const MOCK_SESSION_TYPES = [
  'Strength Training',
  'Cardio Training',
  'Tactical',
  'Recovery',
  'Technical',
  'Conditioning',
  'Warm-up',
  'Cool-down',
  'Other',
];

const MOCK_REPEAT_OPTIONS = [
  { value: 'none', label: "Doesn't repeat" },
  { value: 'daily', label: 'Daily' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'monthly', label: 'Monthly' },
];

const MOCK_LOCATIONS = [
  'Home Stadium',
  'Away',
  'Wembley Stadium',
  'Old Trafford',
  'Training Center A',
  'Training Center B',
  'Gym A',
  'Training Field 1',
];

const MOCK_TIMEZONES = [
  'Europe/Dublin',
  'UTC',
  'Europe/London',
  'America/New_York',
  'Europe/Paris',
  'Australia/Sydney',
];

const MOCK_GAME_DAY = [
  '-3',
  '-2',
  '-1',
  '0',
  '+1',
  '+2',
  '+3',
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
  'Pre-session check-in',
  'Post-session feedback',
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

const AddSessionDrawer = ({ open, onClose, onSave, athletes = [], staff = [], editingEvent = null }) => {
  const [attendanceOpen, setAttendanceOpen] = useState(true);
  const [formData, setFormData] = useState({
    workload: 'squad',
    sessionType: '',
    title: '',
    date: new Date(),
    startTime: new Date(new Date().setHours(15, 33, 0, 0)),
    duration: 60,
    timezone: 'Europe/Dublin',
    repeats: 'none',
    location: '',
    selectedAthletes: [],
    selectedStaff: [],
    description: '',
    gameDayPlusMinus: '',
    surfaceType: '',
    surfaceQuality: '',
    weather: '',
    temperature: '',
    attachments: [],
    attachTitle: '',
    attachLink: '',
    notifyStaffBy: ['push'],
    notifyAthletesBy: [],
    reminderEmail: '',
    reminderPush: '',
    reminderType: '',
  });

  // Populate form when editing an existing session
  useEffect(() => {
    if (editingEvent) {
      const startDate = new Date(editingEvent.start);
      const endDate = new Date(editingEvent.end);
      const durationMinutes = Math.round((endDate - startDate) / 60000);

      setFormData({
        workload: editingEvent.extendedProps?.workload || 'squad',
        sessionType: editingEvent.extendedProps?.sessionType || '',
        title: editingEvent.title || '',
        date: startDate,
        startTime: startDate,
        duration: durationMinutes,
        timezone: editingEvent.extendedProps?.timezone || 'Europe/Dublin',
        repeats: editingEvent.extendedProps?.repeats || 'none',
        location: editingEvent.extendedProps?.location || '',
        selectedAthletes: editingEvent.extendedProps?.selectedAthletes || [],
        selectedStaff: editingEvent.extendedProps?.selectedStaff || [],
        description: editingEvent.extendedProps?.description || '',
        gameDayPlusMinus: editingEvent.extendedProps?.gameDayPlusMinus || '',
        surfaceType: editingEvent.extendedProps?.surfaceType || '',
        surfaceQuality: editingEvent.extendedProps?.surfaceQuality || '',
        weather: editingEvent.extendedProps?.weather || '',
        temperature: editingEvent.extendedProps?.temperature || '',
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
    setFormData((prev) => ({ ...prev, attachTitle: '', attachLink: '' }));
  };

  const getAthleteLabel = (a) =>
    a ? `${a.firstname || ''} ${a.lastname || ''}`.trim() || a.name : '';

  const getStaffLabel = (s) =>
    s ? `${s.firstname || ''} ${s.lastname || ''}`.trim() : '';

  const handleSave = () => {
    const startDateTime = new Date(formData.date);
    startDateTime.setHours(
      formData.startTime.getHours(),
      formData.startTime.getMinutes(),
      0,
      0
    );
    const endDateTime = new Date(startDateTime.getTime() + formData.duration * 60000);
    const newSession = {
      id: `session-${Date.now()}`,
      title: formData.title || 'New session',
      start: startDateTime.toISOString(),
      end: endDateTime.toISOString(),
      backgroundColor: 'var(--color-chart-1)',
      borderColor: 'var(--color-chart-1)',
      textColor: 'var(--color-white)',
      extendedProps: {
        eventType: 'TRAINING_SESSION',
        workload: formData.workload,
        sessionType: formData.sessionType,
        location: formData.location,
        timezone: formData.timezone,
        repeats: formData.repeats,
        selectedAthletes: formData.selectedAthletes,
        selectedStaff: formData.selectedStaff,
        description: formData.description,
        gameDayPlusMinus: formData.gameDayPlusMinus,
        surfaceType: formData.surfaceType,
        surfaceQuality: formData.surfaceQuality,
        weather: formData.weather,
        temperature: formData.temperature,
        attachments: formData.attachments,
        notifyStaffBy: formData.notifyStaffBy,
        notifyAthletesBy: formData.notifyAthletesBy,
        reminderEmail: formData.reminderEmail,
        reminderPush: formData.reminderPush,
        reminderType: formData.reminderType,
      },
    };
    onSave(newSession);
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
              {editingEvent ? 'Edit session' : 'New session'}
            </Typography>
            <IconButton onClick={onClose} size="small">
              <Close />
            </IconButton>
          </Box>

          <Box sx={{ flex: 1, overflow: 'auto', padding: '24px' }}>
            <Grid container spacing={3}>
              {/* Workload */}
              <Grid item xs={12}>
                <Typography
                  variant="body2"
                  sx={{ color: 'var(--color-text-secondary)', mb: 0.5 }}
                >
                  Workload
                </Typography>
                <ToggleButtonGroup
                  value={formData.workload}
                  exclusive
                  onChange={(_, v) => v != null && handleInputChange('workload', v)}
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
                  <ToggleButton value="squad">Squad loading</ToggleButton>
                  <ToggleButton value="individual">Individual loading</ToggleButton>
                </ToggleButtonGroup>
              </Grid>

              {/* Session type */}
              <Grid item xs={12}>
                <FormControl fullWidth variant="filled" sx={formFieldStyles}>
                  <InputLabel shrink>Session type</InputLabel>
                  <Select
                    value={formData.sessionType}
                    onChange={(e) => handleInputChange('sessionType', e.target.value)}
                    label="Session type"
                    displayEmpty
                    renderValue={(v) => v || ''}
                  >
                    <MenuItem value="">
                      <em>Select session type</em>
                    </MenuItem>
                    {MOCK_SESSION_TYPES.map((s) => (
                      <MenuItem key={s} value={s}>
                        {s}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              {/* Title */}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  variant="filled"
                  label="Title"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  InputLabelProps={{ shrink: true }}
                  sx={formFieldStyles}
                />
              </Grid>

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

              {/* Start time, Duration, Timezone */}
              <Grid item xs={12} sm={4}>
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
              <Grid item xs={12} sm={4}>
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
                        <Typography
                          component="span"
                          sx={{
                            fontSize: 'var(--font-size-xs)',
                            color: 'var(--color-text-secondary)',
                          }}
                        >
                          mins
                        </Typography>
                      </InputAdornment>
                    ),
                  }}
                  sx={formFieldStyles}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
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

              {/* Repeats */}
              <Grid item xs={12}>
                <FormControl fullWidth variant="filled" sx={formFieldStyles}>
                  <InputLabel shrink>Repeats</InputLabel>
                  <Select
                    value={formData.repeats}
                    onChange={(e) => handleInputChange('repeats', e.target.value)}
                    label="Repeats"
                  >
                    {MOCK_REPEAT_OPTIONS.map((opt) => (
                      <MenuItem key={opt.value} value={opt.value}>
                        {opt.label}
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
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <Autocomplete
                        multiple
                        options={athletes}
                        getOptionLabel={getAthleteLabel}
                        value={formData.selectedAthletes}
                        onChange={(_, newValue) =>
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
                    </Grid>
                    <Grid item xs={12}>
                      <Autocomplete
                        multiple
                        options={staff}
                        getOptionLabel={getStaffLabel}
                        value={formData.selectedStaff}
                        onChange={(_, newValue) =>
                          handleInputChange('selectedStaff', newValue)
                        }
                        renderTags={(value, getTagProps) =>
                          value.map((option, index) => (
                            <Chip
                              key={option.id}
                              label={getStaffLabel(option)}
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
                            label="Staff"
                            placeholder="No staff selected"
                            InputLabelProps={{ shrink: true }}
                            sx={formFieldStyles}
                          />
                        )}
                      />
                    </Grid>
                  </Grid>
                </Collapse>
              </Grid>

              {/* Description */}
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                  <Typography variant="body2" sx={{ color: 'var(--color-text-secondary)', fontWeight: 600 }}>
                    Description
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'var(--color-text-secondary)' }}>
                    Optional
                  </Typography>
                </Box>
                <TextField
                  fullWidth
                  variant="filled"
                  label=""
                  multiline
                  rows={3}
                  placeholder="Add description..."
                  value={formData.description}
                  onChange={(e) =>
                    handleInputChange('description', e.target.value)
                  }
                  helperText={`${DESCRIPTION_MAX - formData.description.length} characters remaining`}
                  inputProps={{ maxLength: DESCRIPTION_MAX }}
                  sx={formFieldStyles}
                />
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
                  <Box
                    component="span"
                    sx={{ color: 'var(--color-text-secondary)', fontWeight: 400 }}
                  >
                    (Optional)
                  </Box>
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <FormControl fullWidth variant="filled" sx={formFieldStyles}>
                      <InputLabel shrink>Game day +/-</InputLabel>
                      <Select
                        value={formData.gameDayPlusMinus}
                        onChange={(e) =>
                          handleInputChange('gameDayPlusMinus', e.target.value)
                        }
                        label="Game day +/-"
                        displayEmpty
                        renderValue={(v) => v || ''}
                      >
                        <MenuItem value="">
                          <em>Select</em>
                        </MenuItem>
                        {MOCK_GAME_DAY.map((g) => (
                          <MenuItem key={g} value={g}>
                            {g}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
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
                  onClick={() =>
                    document.getElementById('session-file-upload').click()
                  }
                >
                  <AttachFile
                    sx={{ fontSize: 32, color: 'var(--color-text-muted)', mb: 1 }}
                  />
                  <Typography variant="body2" sx={{ color: 'var(--color-text-secondary)' }}>
                    Drag & Drop your files or browse
                  </Typography>
                </Paper>
                <input
                  id="session-file-upload"
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
                  <Grid
                    item
                    xs={12}
                    sm={2}
                    sx={{ display: 'flex', alignItems: 'flex-end', pb: 0.5 }}
                  >
                    <Button
                      variant="primary"
                      onClick={handleAddLink}
                      style={{ width: '100%' }}
                    >
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

export default AddSessionDrawer;
