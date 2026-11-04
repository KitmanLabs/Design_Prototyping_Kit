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
  Grid,
  InputAdornment,
  Collapse,
  FormControlLabel,
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
  MOCK_GAME_TEAMS,
  MOCK_GAME_OPPOSITION,
  MOCK_GAME_COMPETITIONS,
  MOCK_GAME_VENUES,
  MOCK_GAME_TIMEZONES,
  MOCK_GAME_REMINDER_TYPES,
} from '../data/calendarEventOptions';
import { formFieldStyles } from './formFieldStyles';
import { EventAttachmentsFields, EventConditionsFields, EventRemindersSection } from './Calendar/EventDrawerFields';


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
              {editingEvent ? 'Edit game' : 'New game'}
            </Typography>
            <IconButton onClick={onClose}>
              <CloseOutlined />
            </IconButton>
          </Box>

          <Box sx={{ flex: 1, overflow: 'auto', padding: '24px' }}>
            <Grid container spacing={3}>
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
              {/* Start time */}
              <Grid size={12}>
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
              {/* Duration */}
              <Grid
                size={{
                  xs: 12,
                  sm: 6
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
                          <Typography component="span" sx={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)' }}>
                            mins
                          </Typography>
                        </InputAdornment>
                      ),
                    },

                    inputLabel: { shrink: true }
                  }} />
              </Grid>
              {/* Timezone */}
              <Grid
                size={{
                  xs: 12,
                  sm: 6
                }}>
                <FormControl fullWidth variant="filled" sx={formFieldStyles}>
                  <InputLabel shrink>Timezone</InputLabel>
                  <Select
                    value={formData.timezone}
                    onChange={(e) => handleInputChange('timezone', e.target.value)}
                    label="Timezone"
                  >
                    {MOCK_GAME_TIMEZONES.map((tz) => (
                      <MenuItem key={tz} value={tz}>
                        {tz}
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
                  <Autocomplete
                    multiple
                    options={athletes}
                    getOptionLabel={getAthleteLabel}
                    value={formData.selectedAthletes}
                    onChange={(event, newValue) =>
                      handleInputChange('selectedAthletes', newValue)
                    }
                    renderValue={(value, getItemProps) =>
                      value.map((option, index) => (
                        <Chip
                          key={option.id}
                          label={getAthleteLabel(option)}
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
                </Collapse>
              </Grid>

              {/* Game details: Team, Score, Opposition, Score, Competition */}
              <Grid
                size={{
                  xs: 12,
                  sm: 6
                }}>
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
                    {MOCK_GAME_TEAMS.map((t) => (
                      <MenuItem key={t.id} value={t.name}>
                        {t.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid
                size={{
                  xs: 12,
                  sm: 6
                }}>
                <TextField
                  fullWidth
                  variant="filled"
                  label="Score"
                  value={formData.teamScore}
                  onChange={(e) => handleInputChange('teamScore', e.target.value)}
                  placeholder="—"
                  sx={formFieldStyles}
                  slotProps={{
                    inputLabel: { shrink: true }
                  }}
                />
              </Grid>
              <Grid
                size={{
                  xs: 12,
                  sm: 6
                }}>
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
                    {MOCK_GAME_OPPOSITION.map((opp) => (
                      <MenuItem key={opp} value={opp}>
                        {opp}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid
                size={{
                  xs: 12,
                  sm: 6
                }}>
                <TextField
                  fullWidth
                  variant="filled"
                  label="Score"
                  value={formData.oppositionScore}
                  onChange={(e) =>
                    handleInputChange('oppositionScore', e.target.value)
                  }
                  placeholder="—"
                  sx={formFieldStyles}
                  slotProps={{
                    inputLabel: { shrink: true }
                  }}
                />
              </Grid>
              <Grid size={12}>
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
                    {MOCK_GAME_COMPETITIONS.map((c) => (
                      <MenuItem key={c} value={c}>
                        {c}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              {/* Round number (optional), Venue */}
              <Grid
                size={{
                  xs: 12,
                  sm: 6
                }}>
                <TextField
                  fullWidth
                  variant="filled"
                  label="Round number"
                  value={formData.roundNumber}
                  onChange={(e) =>
                    handleInputChange('roundNumber', e.target.value)
                  }
                  placeholder="Optional"
                  sx={formFieldStyles}
                  slotProps={{
                    inputLabel: { shrink: true }
                  }}
                />
              </Grid>
              <Grid
                size={{
                  xs: 12,
                  sm: 6
                }}>
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
                    {MOCK_GAME_VENUES.map((v) => (
                      <MenuItem key={v} value={v}>
                        {v}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              {/* Turnaround marker */}
              <Grid size={12}>
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
                    sx={{ ...formFieldStyles, mt: 1 }}
                    slotProps={{
                      inputLabel: { shrink: true }
                    }}
                  />
                )}
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
                  <Box component="span" sx={{ color: 'var(--color-text-secondary)', fontWeight: 400 }}>
                    (Optional)
                  </Box>
                </Typography>
                <Grid container spacing={2}>
                  <EventConditionsFields formData={formData} onInputChange={handleInputChange} />
                  <Grid size={12}>
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
                      sx={formFieldStyles}
                      slotProps={{
                        htmlInput: { maxLength: DESCRIPTION_MAX },
                        inputLabel: { shrink: true }
                      }} />
                  </Grid>
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
                  inputId="game-file-upload"
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

              <EventRemindersSection formData={formData} onInputChange={handleInputChange} reminderTypes={MOCK_GAME_REMINDER_TYPES} />
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

export default AddGameDrawer;
