import React, { useState } from 'react';
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
  FormControlLabel,
  RadioGroup,
  Radio,
  Checkbox,
  Paper,
  Grid,
  InputAdornment,
} from '@mui/material';
import {
  Close,
  AttachFile,
  Person,
  CalendarToday,
} from '@mui/icons-material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import Button from './Button';

const AddEventSidebar = ({ open, onClose, onSave, athletes = [], staff = [] }) => {
  const [formData, setFormData] = useState({
    eventType: '',
    title: '',
    description: '',
    startDateTime: new Date(),
    duration: 60,
    timezone: 'Europe/Dublin',
    repeats: 'none',
    location: '',
    selectedAthletes: [],
    selectedStaff: [],
    staffVisibility: 'all',
    attachments: [],
  });

  const [errors, setErrors] = useState({});
  const [perSquadEvent, setPerSquadEvent] = useState(false);

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
      '&::placeholder': { color: 'var(--color-text-muted)', opacity: 1 },
    },
    '& .MuiSelect-select': {
      color: 'var(--color-text-primary)',
      fontSize: 'var(--font-size-sm)',
      fontWeight: 'var(--font-weight-medium)',
      fontFamily: 'var(--font-family-primary)',
    },
  };

  const eventTypes = [
    'Training Session',
    'Game',
    'Meeting',
    'Assessment',
    'Recovery Session',
    'Team Building',
    'Medical Check',
    'Other',
  ];

  const repeatOptions = [
    { value: 'none', label: "Doesn't repeat" },
    { value: 'daily', label: 'Daily' },
    { value: 'weekly', label: 'Weekly' },
    { value: 'monthly', label: 'Monthly' },
  ];

  const staffVisibilityOptions = [
    { value: 'all', label: 'All Staff' },
    { value: 'selected', label: 'Only Selected Staff' },
    { value: 'additional', label: 'Staff and Additional viewers' },
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleFileUpload = (event) => {
    const files = Array.from(event.target.files);
    setFormData(prev => ({ ...prev, attachments: [...prev.attachments, ...files] }));
  };

  const removeAttachment = (index) => {
    setFormData(prev => ({ ...prev, attachments: prev.attachments.filter((_, i) => i !== index) }));
  };

  const getEventTypeColor = (eventType) => {
    const colors = {
      'Training Session': 'var(--color-chart-1)',
      'Game': 'var(--color-chart-4)',
      'Meeting': 'var(--color-chart-2)',
      'Assessment': 'var(--color-chart-3)',
      'Recovery Session': 'var(--color-chart-5)',
      'Team Building': 'var(--color-chart-2)',
      'Medical Check': 'var(--color-chart-4)',
      'Other': 'var(--color-text-muted)',
    };
    return colors[eventType] || 'var(--color-text-muted)';
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.eventType) newErrors.eventType = 'Event type is required';
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.startDateTime) newErrors.startDateTime = 'Start date and time is required';
    if (formData.duration <= 0) newErrors.duration = 'Duration must be greater than 0';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validateForm()) return;
    const squadName = formData.selectedAthletes.length > 0
      ? (formData.selectedAthletes[0].squad_name || 'International Squad')
      : 'International Squad';
    const coachName = formData.selectedStaff.length > 0
      ? `${formData.selectedStaff[0].firstname} ${formData.selectedStaff[0].lastname}`
      : 'TBD';
    const newEvent = {
      id: Date.now().toString(),
      title: formData.title,
      start: formData.startDateTime.toISOString(),
      end: new Date(formData.startDateTime.getTime() + formData.duration * 60000).toISOString(),
      backgroundColor: getEventTypeColor(formData.eventType),
      borderColor: getEventTypeColor(formData.eventType),
      textColor: 'var(--color-white)',
      extendedProps: {
        eventType: formData.eventType.toUpperCase().replace(/ /g, '_'),
        description: formData.description,
        location: formData.location,
        duration: formData.duration,
        timezone: formData.timezone,
        repeats: formData.repeats,
        selectedAthletes: formData.selectedAthletes,
        selectedStaff: formData.selectedStaff,
        staffVisibility: formData.staffVisibility,
        attachments: formData.attachments,
        squad: squadName,
        coach: coachName,
      },
    };
    onSave(newEvent);
    onClose();
    setFormData({
      eventType: '',
      title: '',
      description: '',
      startDateTime: new Date(),
      duration: 60,
      timezone: 'Europe/Dublin',
      repeats: 'none',
      location: '',
      selectedAthletes: [],
      selectedStaff: [],
      staffVisibility: 'all',
      attachments: [],
    });
  };

  const getAthleteLabel = (a) => (a ? `${a.firstname || ''} ${a.lastname || ''}`.trim() || a.name : '');

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Drawer
        anchor="right"
        open={open}
        onClose={onClose}
        PaperProps={{ sx: { width: '480px', maxWidth: '90vw' } }}
      >
        <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--color-background-primary)' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '24px 24px 16px 24px', borderBottom: '1px solid var(--color-border-primary)' }}>
            <Typography variant="h6" sx={{ fontWeight: 600, color: 'var(--color-text-primary)' }}>
              New event
            </Typography>
            <IconButton onClick={onClose} size="small">
              <Close />
            </IconButton>
          </Box>

          <Box sx={{ flex: 1, overflow: 'auto', padding: '24px' }}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <FormControl fullWidth variant="filled" error={!!errors.eventType} sx={formFieldStyles}>
                  <InputLabel>Event type</InputLabel>
                  <Select
                    value={formData.eventType}
                    onChange={(e) => handleInputChange('eventType', e.target.value)}
                    label="Event type"
                  >
                    {eventTypes.map((type) => (
                      <MenuItem key={type} value={type}>{type}</MenuItem>
                    ))}
                  </Select>
                  {errors.eventType && (
                    <Typography variant="caption" color="error" sx={{ mt: 0.5 }}>{errors.eventType}</Typography>
                  )}
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  variant="filled"
                  label="Title"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  error={!!errors.title}
                  helperText={errors.title}
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
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  helperText={`${formData.description.length}/250 characters remaining`}
                  inputProps={{ maxLength: 250 }}
                  sx={formFieldStyles}
                />
              </Grid>

              <Grid item xs={12}>
                <DateTimePicker
                  label="Start date and time"
                  value={formData.startDateTime}
                  onChange={(newValue) => handleInputChange('startDateTime', newValue)}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      variant: 'filled',
                      error: !!errors.startDateTime,
                      helperText: errors.startDateTime,
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

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  variant="filled"
                  label="Duration"
                  type="number"
                  value={formData.duration}
                  onChange={(e) => handleInputChange('duration', parseInt(e.target.value, 10) || 0)}
                  error={!!errors.duration}
                  helperText={errors.duration || 'minutes'}
                  InputProps={{ endAdornment: <InputAdornment position="end">mins</InputAdornment> }}
                  sx={formFieldStyles}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl fullWidth variant="filled" sx={formFieldStyles}>
                  <InputLabel>Timezone</InputLabel>
                  <Select
                    value={formData.timezone}
                    onChange={(e) => handleInputChange('timezone', e.target.value)}
                    label="Timezone"
                  >
                    <MenuItem value="Europe/Dublin">Europe/Dublin</MenuItem>
                    <MenuItem value="UTC">UTC</MenuItem>
                    <MenuItem value="America/New_York">America/New_York</MenuItem>
                    <MenuItem value="Europe/London">Europe/London</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <FormControl fullWidth variant="filled" sx={formFieldStyles}>
                  <InputLabel>Repeats</InputLabel>
                  <Select
                    value={formData.repeats}
                    onChange={(e) => handleInputChange('repeats', e.target.value)}
                    label="Repeats"
                  >
                    {repeatOptions.map((opt) => (
                      <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  variant="filled"
                  label="Location"
                  value={formData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  placeholder="Search locations..."
                  sx={formFieldStyles}
                />
              </Grid>

              <Grid item xs={12}>
                <Autocomplete
                  multiple
                  options={athletes}
                  getOptionLabel={getAthleteLabel}
                  value={formData.selectedAthletes}
                  onChange={(event, newValue) => handleInputChange('selectedAthletes', newValue)}
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
                          '& .MuiChip-deleteIcon': { color: 'var(--color-text-secondary)' },
                        }}
                      />
                    ))
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      variant="filled"
                      label="Athletes"
                      placeholder="Select athletes..."
                      sx={formFieldStyles}
                    />
                  )}
                />
                <Box sx={{ mt: 1 }}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        size="small"
                        checked={perSquadEvent}
                        onChange={(e) => setPerSquadEvent(e.target.checked)}
                        sx={{ color: 'var(--color-text-secondary)', '&.Mui-checked': { color: 'var(--color-primary)' } }}
                      />
                    }
                    label={
                      <Typography variant="caption" sx={{ color: 'var(--color-text-secondary)' }}>
                        Show events only on this calendar
                      </Typography>
                    }
                    sx={{ m: 0 }}
                  />
                </Box>
              </Grid>

              <Grid item xs={12}>
                <Autocomplete
                  multiple
                  options={staff}
                  getOptionLabel={(option) => `${option.firstname} ${option.lastname} (${option.role})`}
                  value={formData.selectedStaff}
                  onChange={(event, newValue) => handleInputChange('selectedStaff', newValue)}
                  renderTags={(value, getTagProps) =>
                    value.map((option, index) => (
                      <Chip
                        key={option.id}
                        label={`${option.firstname} ${option.lastname}`}
                        {...getTagProps({ index })}
                        icon={<Person />}
                        sx={{
                          backgroundColor: 'var(--color-background-selected)',
                          color: 'var(--color-text-primary)',
                          '& .MuiChip-deleteIcon': { color: 'var(--color-text-secondary)' },
                        }}
                      />
                    ))
                  }
                  renderInput={(params) => (
                    <TextField {...params} variant="filled" label="Staff" placeholder="Select staff..." sx={formFieldStyles} />
                  )}
                />
              </Grid>

              <Grid item xs={12}>
                <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600, color: 'var(--color-text-primary)' }}>
                  Staff visibility
                </Typography>
                <RadioGroup
                  value={formData.staffVisibility}
                  onChange={(e) => handleInputChange('staffVisibility', e.target.value)}
                  sx={{
                    '& .MuiFormControlLabel-label': { color: 'var(--color-text-primary)' },
                    '& .MuiRadio-root': { color: 'var(--color-text-secondary)', '&.Mui-checked': { color: 'var(--color-primary)' } },
                  }}
                >
                  {staffVisibilityOptions.map((opt) => (
                    <FormControlLabel key={opt.value} value={opt.value} control={<Radio size="small" />} label={opt.label} />
                  ))}
                </RadioGroup>
              </Grid>

              <Grid item xs={12}>
                <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600, color: 'var(--color-text-primary)' }}>
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
                  onClick={() => document.getElementById('file-upload').click()}
                >
                  <AttachFile sx={{ fontSize: 32, color: 'var(--color-text-muted)', mb: 1 }} />
                  <Typography variant="body2" sx={{ color: 'var(--color-text-secondary)' }}>
                    Drag & Drop your files or browse
                  </Typography>
                </Paper>
                <input
                  id="file-upload"
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
                          '& .MuiChip-deleteIcon': { color: 'var(--color-text-secondary)' },
                        }}
                      />
                    ))}
                  </Box>
                )}
              </Grid>
            </Grid>
          </Box>

          <Box sx={{ padding: '16px 24px', borderTop: '1px solid var(--color-border-primary)', backgroundColor: '#ffffff' }}>
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

export default AddEventSidebar;
