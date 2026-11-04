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
  Grid,
  InputAdornment,
  Collapse,
  ToggleButtonGroup,
  ToggleButton,
} from '@mui/material';
import {
  CloseOutlined,
  PersonOutlined,
  CalendarTodayOutlined,
  ScheduleOutlined,
  ExpandMoreOutlined,
  ExpandLessOutlined,
  CheckOutlined,
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { toMoment, withDate } from '../utils/pickerDates';
import { Button } from '../playbook-components';
import LocationPicker from './LocationPicker';
import savedLocationsData from '../data/saved_locations.json';
import {
  DESCRIPTION_MAX,
  MOCK_SESSION_TYPES,
  MOCK_SESSION_REPEAT_OPTIONS,
  MOCK_SESSION_TIMEZONES,
  MOCK_SESSION_GAME_DAY,
  MOCK_SESSION_REMINDER_TYPES,
} from '../data/calendarEventOptions';
import { formFieldStyles } from './formFieldStyles';
import { EventAttachmentsFields, EventConditionsFields, EventRemindersSection } from './Calendar/EventDrawerFields';


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
    <LocalizationProvider dateAdapter={AdapterMoment}>
      <Drawer
        anchor="right"
        open={open}
        onClose={onClose}
        slotProps={{
          paper: { sx: { width: '480px', maxWidth: '90vw' } }
        }}
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
            <IconButton onClick={onClose}>
              <CloseOutlined />
            </IconButton>
          </Box>

          <Box sx={{ flex: 1, overflow: 'auto', padding: '24px' }}>
            <Grid container spacing={3}>
              {/* Workload */}
              <Grid size={12}>
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
              <Grid size={12}>
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
              <Grid size={12}>
                <TextField
                  fullWidth
                  variant="filled"
                  label="Title"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  sx={formFieldStyles}
                  slotProps={{
                    inputLabel: { shrink: true }
                  }}
                />
              </Grid>

              {/* Date */}
              <Grid size={12}>
                <DatePicker
                  label="Date"
                  value={toMoment(formData.date)}
                  onChange={withDate((newVal) => handleInputChange('date', newVal))}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      variant: 'filled',
                      sx: formFieldStyles,

                      slotProps: {
                        inputLabel: { shrink: true },

                        input: {
                          startAdornment: (
                            <InputAdornment position="start">
                              <CalendarTodayOutlined fontSize="small" />
                            </InputAdornment>
                          ),
                        },
                      },
                    },
                  }}
                />
              </Grid>

              {/* Start time, Duration, Timezone */}
              <Grid
                size={{
                  xs: 12,
                  sm: 4
                }}>
                <TimePicker
                  label="Start time"
                  value={toMoment(formData.startTime)}
                  onChange={withDate((newVal) => handleInputChange('startTime', newVal))}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      variant: 'filled',
                      sx: formFieldStyles,

                      slotProps: {
                        inputLabel: { shrink: true },

                        input: {
                          startAdornment: (
                            <InputAdornment position="start">
                              <ScheduleOutlined fontSize="small" />
                            </InputAdornment>
                          ),
                        },
                      },
                    },
                  }}
                />
              </Grid>
              <Grid
                size={{
                  xs: 12,
                  sm: 4
                }}>
                <TextField
                  fullWidth
                  variant="filled"
                  label="Duration"
                  type="number"
                  value={formData.duration}
                  onChange={(e) =>
                    handleInputChange('duration', parseInt(e.target.value, 10) || 0)
                  }
                  sx={formFieldStyles}
                  slotProps={{
                    input: {
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
                    },

                    inputLabel: { shrink: true }
                  }} />
              </Grid>
              <Grid
                size={{
                  xs: 12,
                  sm: 4
                }}>
                <FormControl fullWidth variant="filled" sx={formFieldStyles}>
                  <InputLabel shrink>Timezone</InputLabel>
                  <Select
                    value={formData.timezone}
                    onChange={(e) => handleInputChange('timezone', e.target.value)}
                    label="Timezone"
                  >
                    {MOCK_SESSION_TIMEZONES.map((tz) => (
                      <MenuItem key={tz} value={tz}>
                        {tz}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              {/* Repeats */}
              <Grid size={12}>
                <FormControl fullWidth variant="filled" sx={formFieldStyles}>
                  <InputLabel shrink>Repeats</InputLabel>
                  <Select
                    value={formData.repeats}
                    onChange={(e) => handleInputChange('repeats', e.target.value)}
                    label="Repeats"
                  >
                    {MOCK_SESSION_REPEAT_OPTIONS.map((opt) => (
                      <MenuItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              {/* Location */}
              <Grid size={12}>
                <LocationPicker
                  value={formData.location}
                  onChange={(value) => handleInputChange('location', value)}
                  savedLocations={savedLocationsData}
                />
              </Grid>

              {/* Attendance (collapsible) */}
              <Grid size={12}>
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
                  <IconButton>
                    {attendanceOpen ? <ExpandLessOutlined /> : <ExpandMoreOutlined />}
                  </IconButton>
                </Box>
                <Collapse in={attendanceOpen}>
                  <Grid container spacing={2}>
                    <Grid size={12}>
                      <Autocomplete
                        multiple
                        options={athletes}
                        getOptionLabel={getAthleteLabel}
                        value={formData.selectedAthletes}
                        onChange={(_, newValue) =>
                          handleInputChange('selectedAthletes', newValue)
                        }
                        renderValue={(value, getItemProps) =>
                          value.map((option, index) => {
                            const { key, ...tagProps } = getItemProps({ index });
                            return (
                              <Chip
                                key={option.id}
                                label={getAthleteLabel(option)}
                                {...tagProps}
                                icon={<PersonOutlined />}
                                sx={{
                                  backgroundColor: 'var(--color-background-selected)',
                                  color: 'var(--color-text-primary)',
                                  '& .MuiChip-deleteIcon': {
                                    color: 'var(--color-text-secondary)',
                                  },
                                }}
                              />
                            );
                          })
                        }
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            variant="filled"
                            label="Athletes"
                            placeholder="No athletes selected"
                            sx={formFieldStyles}
                            slotProps={{
                              ...params.slotProps,
                              inputLabel: { shrink: true }
                            }}
                          />
                        )}
                      />
                    </Grid>
                    <Grid size={12}>
                      <Autocomplete
                        multiple
                        options={staff}
                        getOptionLabel={getStaffLabel}
                        value={formData.selectedStaff}
                        onChange={(_, newValue) =>
                          handleInputChange('selectedStaff', newValue)
                        }
                        renderValue={(value, getItemProps) =>
                          value.map((option, index) => (
                            <Chip
                              key={option.id}
                              label={getStaffLabel(option)}
                              {...getItemProps({ index })}
                              icon={<PersonOutlined />}
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
                            sx={formFieldStyles}
                            slotProps={{
                              ...params.slotProps,
                              inputLabel: { shrink: true }
                            }}
                          />
                        )}
                      />
                    </Grid>
                  </Grid>
                </Collapse>
              </Grid>

              {/* Description */}
              <Grid size={12}>
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
                  sx={formFieldStyles}
                  slotProps={{
                    htmlInput: { maxLength: DESCRIPTION_MAX }
                  }}
                />
              </Grid>

              {/* Additional details (optional) */}
              <Grid size={12}>
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
                  <Grid size={6}>
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
                        {MOCK_SESSION_GAME_DAY.map((g) => (
                          <MenuItem key={g} value={g}>
                            {g}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <EventConditionsFields formData={formData} onInputChange={handleInputChange} />
                </Grid>
              </Grid>

              {/* Attach */}
              <Grid size={12}>
                <Typography
                  variant="subtitle2"
                  sx={{ mb: 1, fontWeight: 600, color: 'var(--color-text-primary)' }}
                >
                  Attach
                </Typography>
                <EventAttachmentsFields
                  inputId="session-file-upload"
                  formData={formData}
                  onInputChange={handleInputChange}
                  onFileUpload={handleFileUpload}
                  onRemoveAttachment={removeAttachment}
                  onAddLink={handleAddLink}
                />
              </Grid>

              {/* Notifications */}
              <Grid size={12}>
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
                      <CheckOutlined sx={{ fontSize: 16, mr: 0.5 }} />
                    )}
                    Email
                  </ToggleButton>
                  <ToggleButton value="push">
                    {formData.notifyStaffBy.includes('push') && (
                      <CheckOutlined sx={{ fontSize: 16, mr: 0.5 }} />
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
                      <CheckOutlined sx={{ fontSize: 16, mr: 0.5 }} />
                    )}
                    Email
                  </ToggleButton>
                  <ToggleButton value="push">
                    {formData.notifyAthletesBy.includes('push') && (
                      <CheckOutlined sx={{ fontSize: 16, mr: 0.5 }} />
                    )}
                    Push
                  </ToggleButton>
                </ToggleButtonGroup>
              </Grid>

              <EventRemindersSection formData={formData} onInputChange={handleInputChange} reminderTypes={MOCK_SESSION_REMINDER_TYPES} />
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
              <Button disableElevation={true} onClick={onClose} variant="contained" color="secondary">
                Cancel
              </Button>
              <Button disableElevation={true} onClick={handleSave} variant="contained" color="primary">
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
