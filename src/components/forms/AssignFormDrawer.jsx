import React, { useState, useMemo } from 'react'
import PropTypes from 'prop-types'
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  Divider,
  TextField,
  Button,
  Autocomplete,
  FormControl,
  FormControlLabel,
  RadioGroup,
  Radio,
  Stack,
  Chip,
  Select,
  MenuItem,
  InputLabel,
  useMediaQuery
} from '@mui/material'
import { CloseOutlined, DeleteOutline } from '@mui/icons-material'
import { useTheme } from '@mui/material/styles'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { TimePicker } from '@mui/x-date-pickers/TimePicker'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import '../../styles/design-tokens.css'

const TIMEZONES = [
  'Europe/Dublin',
  'UTC',
  'Europe/London',
  'America/New_York',
  'Europe/Paris',
  'Australia/Sydney',
]

const RESPONSES_PER_PLAYER_OPTIONS = [
  { value: 1, label: '1 response per player' },
  { value: 2, label: '2 responses per player' },
  { value: 3, label: '3 responses per player' },
  { value: 5, label: '5 responses per player' },
  { value: 10, label: '10 responses per player' },
  { value: -1, label: 'Unlimited responses' },
]

const formFieldStyles = {
  '& .MuiInputBase-root': {
    backgroundColor: 'var(--color-background-secondary)',
    borderRadius: 'var(--radius-sm)',
    '&:hover': { backgroundColor: 'var(--color-background-tertiary)' },
    '&.Mui-focused': { backgroundColor: 'var(--color-background-primary)' },
  },
  '& .MuiInputLabel-root': {
    color: 'var(--color-text-secondary)',
    fontSize: 'var(--font-size-sm)',
    fontWeight: 'var(--placeholder-font-weight)',
    fontFamily: 'var(--font-family-primary)',
    '&.Mui-focused': { color: 'var(--color-border-focus)' },
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
  },
}

function AssignFormDrawer({
  open,
  onClose,
  onSubmit,
  formName = '',
  athletes = [],
  selectedAthletes: initialSelectedAthletes = []
}) {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

  const [selectedAthletes, setSelectedAthletes] = useState(initialSelectedAthletes)
  const [assignmentType, setAssignmentType] = useState('always-available')
  
  // Schedule fields (for "One Time" option)
  const [scheduleTitle, setScheduleTitle] = useState('')
  const [startDate, setStartDate] = useState(new Date())
  const [endDate, setEndDate] = useState(null)
  const [startTime, setStartTime] = useState(null)
  const [timezone, setTimezone] = useState('Europe/Dublin')
  const [responsesPerPlayer, setResponsesPerPlayer] = useState(1)

  // Reset state when drawer opens
  React.useEffect(() => {
    if (open) {
      setSelectedAthletes(initialSelectedAthletes)
      setAssignmentType('always-available')
      setScheduleTitle('')
      setStartDate(new Date())
      setEndDate(null)
      setStartTime(null)
      setTimezone('Europe/Dublin')
      setResponsesPerPlayer(1)
    }
  }, [open, initialSelectedAthletes])

  const handleClose = () => {
    onClose && onClose()
  }

  const handleAssign = () => {
    const assignment = {
      formName,
      selectedAthletes,
      assignmentType
    }
    
    if (assignmentType === 'one-time') {
      assignment.schedule = {
        title: scheduleTitle,
        startDate,
        endDate,
        startTime,
        timezone,
        responsesPerPlayer
      }
    }
    
    onSubmit && onSubmit(assignment)
    handleClose()
  }

  const athleteOptions = useMemo(() => {
    return athletes.map((a) => ({
      id: a.id,
      name: a.name || `${a.firstname || ''} ${a.lastname || ''}`.trim(),
      position: a.position || '—'
    }))
  }, [athletes])

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Drawer
        anchor={isMobile ? 'bottom' : 'right'}
        open={open}
        onClose={handleClose}
        ModalProps={{ keepMounted: true }}
        PaperProps={{
          sx: {
            width: isMobile ? '100vw' : 480,
            maxWidth: '100vw',
            height: isMobile ? '90vh' : '100vh',
            boxShadow: theme.shadows[16],
            display: 'flex'
          }
        }}
      >
      <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', width: '100%' }}>
        {/* Header */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            px: 3,
            py: 2,
            borderBottom: '1px solid var(--color-border-primary)'
          }}
        >
          <Typography
            variant="h6"
            sx={{
              fontWeight: 600,
              fontFamily: 'var(--font-family-primary)',
              fontSize: 'var(--font-size-lg)',
              color: 'var(--color-text-primary)'
            }}
          >
            Form Assignment
          </Typography>
          <IconButton onClick={handleClose} size="small" aria-label="Close">
            <CloseOutlined />
          </IconButton>
        </Box>

        {/* Body */}
        <Box sx={{ px: 3, py: 3, flex: 1, overflowY: 'auto' }}>
          <Stack spacing={3}>
            {/* Form Selector */}
            <TextField
              fullWidth
              size="small"
              variant="filled"
              label="Form"
              value={formName}
              InputProps={{
                readOnly: true,
              }}
              sx={formFieldStyles}
            />

            {/* Player / Athlete Selector */}
            <Autocomplete
              multiple
              size="small"
              options={athleteOptions}
              value={selectedAthletes}
              onChange={(_, newValue) => setSelectedAthletes(newValue)}
              getOptionLabel={(option) => option.name || ''}
              isOptionEqualToValue={(option, value) => option.id === value.id}
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="filled"
                  label="Players / Athletes"
                  placeholder={selectedAthletes.length === 0 ? 'Select athletes' : ''}
                  sx={formFieldStyles}
                />
              )}
              renderTags={(value, getTagProps) =>
                value.map((option, index) => (
                  <Chip
                    key={option.id}
                    label={option.name}
                    size="small"
                    {...getTagProps({ index })}
                    sx={{
                      backgroundColor: 'var(--color-primary-light)',
                      color: 'var(--color-text-primary)',
                      fontFamily: 'var(--font-family-primary)',
                      fontSize: 'var(--font-size-xs)',
                      '& .MuiChip-deleteIcon': {
                        color: 'var(--color-text-secondary)',
                        '&:hover': { color: 'var(--color-text-primary)' }
                      }
                    }}
                  />
                ))
              }
              renderOption={(props, option) => (
                <Box
                  component="li"
                  {...props}
                  sx={{
                    fontFamily: 'var(--font-family-primary)',
                    fontSize: 'var(--font-size-sm)'
                  }}
                >
                  <Box>
                    <Typography
                      variant="body2"
                      sx={{
                        fontFamily: 'var(--font-family-primary)',
                        fontSize: 'var(--font-size-sm)',
                        color: 'var(--color-text-primary)'
                      }}
                    >
                      {option.name}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{
                        fontFamily: 'var(--font-family-primary)',
                        fontSize: 'var(--font-size-xs)',
                        color: 'var(--color-text-secondary)'
                      }}
                    >
                      {option.position}
                    </Typography>
                  </Box>
                </Box>
              )}
              PaperComponent={(props) => (
                <Box
                  {...props}
                  sx={{
                    '& .MuiAutocomplete-listbox': {
                      fontFamily: 'var(--font-family-primary)'
                    }
                  }}
                />
              )}
            />

            {/* Form Availability Section */}
            <Box>
              <Typography
                variant="body1"
                sx={{
                  fontFamily: 'var(--font-family-primary)',
                  fontSize: 'var(--font-size-sm)',
                  fontWeight: 'var(--font-weight-semibold)',
                  color: 'var(--color-text-primary)',
                  mb: 1.5
                }}
              >
                Form Availability
              </Typography>

              <FormControl component="fieldset">
                <RadioGroup
                  value={assignmentType}
                  onChange={(e) => setAssignmentType(e.target.value)}
                >
                  {/* Always Available Option */}
                  <Box sx={{ mb: 2 }}>
                    <FormControlLabel
                      value="always-available"
                      control={
                        <Radio
                          sx={{
                            color: 'var(--color-text-secondary)',
                            '&.Mui-checked': {
                              color: 'var(--color-primary)'
                            }
                          }}
                        />
                      }
                      label={
                        <Typography
                          sx={{
                            fontFamily: 'var(--font-family-primary)',
                            fontSize: 'var(--font-size-sm)',
                            fontWeight: 'var(--font-weight-medium)',
                            color: 'var(--color-text-primary)'
                          }}
                        >
                          Always Available
                        </Typography>
                      }
                      sx={{
                        alignItems: 'flex-start',
                        '& .MuiRadio-root': {
                          pt: 0
                        }
                      }}
                    />
                    <Typography
                      variant="body2"
                      sx={{
                        fontFamily: 'var(--font-family-primary)',
                        fontSize: 'var(--font-size-xs)',
                        color: 'var(--color-text-secondary)',
                        ml: 4,
                        mt: 0.5,
                        lineHeight: 1.5
                      }}
                    >
                      By default, this form stays visible to players. Use a schedule to set start date and end date.
                    </Typography>
                  </Box>

                  {/* One Time Option */}
                  <Box>
                    <FormControlLabel
                      value="one-time"
                      control={
                        <Radio
                          sx={{
                            color: 'var(--color-text-secondary)',
                            '&.Mui-checked': {
                              color: 'var(--color-primary)'
                            }
                          }}
                        />
                      }
                      label={
                        <Typography
                          sx={{
                            fontFamily: 'var(--font-family-primary)',
                            fontSize: 'var(--font-size-sm)',
                            fontWeight: 'var(--font-weight-medium)',
                            color: 'var(--color-text-primary)'
                          }}
                        >
                          One Time
                        </Typography>
                      }
                      sx={{
                        alignItems: 'flex-start',
                        '& .MuiRadio-root': {
                          pt: 0
                        }
                      }}
                    />
                  </Box>
                </RadioGroup>
              </FormControl>
            </Box>

            {/* Schedule Section - Only shown when "One Time" is selected */}
            {assignmentType === 'one-time' && (
              <>
                <Divider sx={{ my: 3 }} />
                <Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                    <Typography
                      variant="body1"
                      sx={{
                        fontFamily: 'var(--font-family-primary)',
                        fontSize: 'var(--font-size-sm)',
                        fontWeight: 'var(--font-weight-semibold)',
                        color: 'var(--color-text-primary)'
                      }}
                    >
                      Schedule
                    </Typography>
                    <IconButton
                      size="small"
                      onClick={() => {
                        setScheduleTitle('')
                        setStartDate(new Date())
                        setEndDate(null)
                        setStartTime(null)
                        setTimezone('Europe/Dublin')
                        setResponsesPerPlayer(1)
                      }}
                      aria-label="Delete schedule"
                      sx={{ color: 'var(--color-text-secondary)', '&:hover': { color: 'var(--color-error)' } }}
                    >
                      <DeleteOutline fontSize="small" />
                    </IconButton>
                  </Box>

                  <Stack spacing={2}>
                    {/* Schedule Title */}
                    <TextField
                      fullWidth
                      size="small"
                      variant="filled"
                      label="Schedule Title"
                      value={scheduleTitle}
                      onChange={(e) => setScheduleTitle(e.target.value)}
                      placeholder="Enter schedule name"
                      sx={formFieldStyles}
                    />

                    {/* Date Pickers */}
                    <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.5 }}>
                      <DatePicker
                        label="Start Date"
                        value={startDate}
                        onChange={(newValue) => setStartDate(newValue)}
                        slotProps={{
                          textField: {
                            size: 'small',
                            variant: 'filled',
                            sx: formFieldStyles
                          }
                        }}
                      />
                      <DatePicker
                        label="End Date"
                        value={endDate}
                        onChange={(newValue) => setEndDate(newValue)}
                        slotProps={{
                          textField: {
                            size: 'small',
                            variant: 'filled',
                            placeholder: 'Select end date',
                            sx: formFieldStyles
                          }
                        }}
                      />
                    </Box>

                    {/* Start Time Picker */}
                    <TimePicker
                      label="Start Time"
                      value={startTime}
                      onChange={(newValue) => setStartTime(newValue)}
                      slotProps={{
                        textField: {
                          size: 'small',
                          variant: 'filled',
                          sx: formFieldStyles
                        }
                      }}
                    />

                    {/* Timezone Selector */}
                    <FormControl size="small" variant="filled" sx={formFieldStyles}>
                      <InputLabel>Time Zone</InputLabel>
                      <Select
                        value={timezone}
                        onChange={(e) => setTimezone(e.target.value)}
                        label="Time Zone"
                      >
                        {TIMEZONES.map((tz) => (
                          <MenuItem key={tz} value={tz}>
                            {tz}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>

                    {/* Responses per Player Selector */}
                    <FormControl size="small" variant="filled" sx={formFieldStyles}>
                      <InputLabel>Responses per Player</InputLabel>
                      <Select
                        value={responsesPerPlayer}
                        onChange={(e) => setResponsesPerPlayer(e.target.value)}
                        label="Responses per Player"
                      >
                        {RESPONSES_PER_PLAYER_OPTIONS.map((option) => (
                          <MenuItem key={option.value} value={option.value}>
                            {option.label}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Stack>
                </Box>
              </>
            )}
          </Stack>
        </Box>

        {/* Footer */}
        <Divider />
        <Box
          sx={{
            px: 3,
            py: 2,
            position: 'sticky',
            bottom: 0,
            bgcolor: 'var(--color-background-primary)'
          }}
        >
          <Stack direction="row" justifyContent="flex-end" spacing={1.5}>
            <Button
              variant="contained"
              size="small"
              disableElevation
              sx={{
                backgroundColor: 'var(--button-secondary-bg)',
                color: 'var(--button-secondary-color)',
                textTransform: 'none',
                fontFamily: 'var(--font-family-primary)',
                '&:hover': { backgroundColor: 'var(--button-secondary-hover-bg)' }
              }}
              onClick={handleClose}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              size="small"
              disableElevation
              sx={{
                backgroundColor: 'var(--color-primary)',
                color: 'var(--button-primary-color)',
                textTransform: 'none',
                fontFamily: 'var(--font-family-primary)',
                '&:hover': { backgroundColor: 'var(--color-primary-hover)' }
              }}
              onClick={handleAssign}
            >
              Assign
            </Button>
          </Stack>
        </Box>
      </Box>
    </Drawer>
    </LocalizationProvider>
  )
}

AssignFormDrawer.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  onSubmit: PropTypes.func,
  formName: PropTypes.string,
  athletes: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      name: PropTypes.string,
      firstname: PropTypes.string,
      lastname: PropTypes.string,
      position: PropTypes.string
    })
  ),
  selectedAthletes: PropTypes.array
}

export default AssignFormDrawer
