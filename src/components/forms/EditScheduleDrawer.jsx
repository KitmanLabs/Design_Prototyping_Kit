import React, { useState, useMemo, useEffect } from 'react'
import PropTypes from 'prop-types'
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  TextField,
  Button,
  Autocomplete,
  Stack,
  Chip,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  useMediaQuery,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions
} from '@mui/material'
import { CloseOutlined } from '@mui/icons-material'
import { useTheme } from '@mui/material/styles'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { TimePicker } from '@mui/x-date-pickers/TimePicker'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import dayjs from 'dayjs'
import '../../styles/design-tokens.css'

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

// All available forms for selection
const ALL_FORMS_OPTIONS = [
  { id: 'f-1', formName: 'Medical Exam' },
  { id: 'f-2', formName: 'Orthopedic Exam' },
  { id: 'f-3', formName: 'Medical History Form' },
  { id: 'f-4', formName: 'Daily Wellness Check' },
  { id: 'f-5', formName: 'Training Load Monitoring' },
  { id: 'f-6', formName: 'Post-Game RPE' },
  { id: 'f-7', formName: 'Performance Assessment' },
  { id: 'f-8', formName: 'Concussion Protocol' },
  { id: 'f-9', formName: 'Return to Play Assessment' },
  { id: 'f-10', formName: 'End of Season Survey' },
  { id: 'f-11', formName: 'Season Feedback Form' },
  { id: 'f-12', formName: 'Mental Health Assessment' },
]

function EditScheduleDrawer({
  open,
  onClose,
  onSave,
  schedule = null,
  allPlayers = []
}) {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

  // Form state
  const [selectedForms, setSelectedForms] = useState([])
  const [selectedPlayers, setSelectedPlayers] = useState([])
  const [scheduleTitle, setScheduleTitle] = useState('')
  const [startDate, setStartDate] = useState(null)
  const [endDate, setEndDate] = useState(null)
  const [startTime, setStartTime] = useState(null)
  const [responsesPerPlayer, setResponsesPerPlayer] = useState(1)
  const [confirmModalOpen, setConfirmModalOpen] = useState(false)

  // Reset state when drawer opens with a schedule
  useEffect(() => {
    if (open && schedule) {
      // Map schedule forms to the format expected by Autocomplete
      const formObjects = (schedule.forms || []).map(f => ({
        id: f.id,
        formName: f.formName
      }))
      setSelectedForms(formObjects)
      
      // Map players to objects
      const playerObjects = (schedule.players || []).map(name => ({
        id: name,
        name: name
      }))
      setSelectedPlayers(playerObjects)
      
      setScheduleTitle(schedule.scheduleName || '')
      setStartDate(schedule.startDate ? dayjs(schedule.startDate) : null)
      setEndDate(schedule.endDate ? dayjs(schedule.endDate) : null)
      setStartTime(schedule.startDate ? dayjs(schedule.startDate) : null)
      setResponsesPerPlayer(1) // Default since not stored in mock data
    }
  }, [open, schedule])

  const handleClose = () => {
    onClose && onClose()
  }

  const handleSaveClick = () => {
    setConfirmModalOpen(true)
  }

  const handleConfirmSave = () => {
    setConfirmModalOpen(false)
    const updatedSchedule = {
      id: schedule?.id,
      scheduleName: scheduleTitle,
      forms: selectedForms,
      players: selectedPlayers.map(p => p.name),
      startDate: startDate ? startDate.toISOString() : null,
      endDate: endDate ? endDate.toISOString() : null,
      startTime: startTime ? startTime.format('HH:mm') : null,
      responsesPerPlayer
    }
    onSave && onSave(updatedSchedule)
  }

  // Convert all players to options format
  const playerOptions = useMemo(() => {
    return allPlayers.map(name => ({
      id: name,
      name: name
    }))
  }, [allPlayers])

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
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
              {/* Forms Selector */}
              <Autocomplete
                multiple
                size="small"
                options={ALL_FORMS_OPTIONS}
                value={selectedForms}
                onChange={(_, newValue) => setSelectedForms(newValue)}
                getOptionLabel={(option) => option.formName || ''}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant="filled"
                    label="Forms"
                    placeholder={selectedForms.length === 0 ? 'Select forms' : ''}
                    sx={formFieldStyles}
                  />
                )}
                renderTags={(value, getTagProps) => {
                  const maxVisible = 3
                  const visibleTags = value.slice(0, maxVisible)
                  const moreCount = value.length - maxVisible
                  
                  return (
                    <>
                      {visibleTags.map((option, index) => (
                        <Chip
                          key={option.id}
                          label={option.formName}
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
                      ))}
                      {moreCount > 0 && (
                        <Chip
                          label={`+${moreCount} more`}
                          size="small"
                          sx={{
                            backgroundColor: 'var(--color-background-tertiary)',
                            color: 'var(--color-text-secondary)',
                            fontFamily: 'var(--font-family-primary)',
                            fontSize: 'var(--font-size-xs)',
                          }}
                        />
                      )}
                    </>
                  )
                }}
                renderOption={(props, option) => (
                  <Box
                    component="li"
                    {...props}
                    sx={{
                      fontFamily: 'var(--font-family-primary)',
                      fontSize: 'var(--font-size-sm)'
                    }}
                  >
                    {option.formName}
                  </Box>
                )}
              />

              {/* Player / Athlete Selector */}
              <Autocomplete
                multiple
                size="small"
                options={playerOptions}
                value={selectedPlayers}
                onChange={(_, newValue) => setSelectedPlayers(newValue)}
                getOptionLabel={(option) => option.name || ''}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant="filled"
                    label="Players / Athletes"
                    placeholder={selectedPlayers.length === 0 ? 'Select athletes' : ''}
                    sx={formFieldStyles}
                  />
                )}
                renderTags={(value, getTagProps) => {
                  const maxVisible = 3
                  const visibleTags = value.slice(0, maxVisible)
                  const moreCount = value.length - maxVisible
                  
                  return (
                    <>
                      {visibleTags.map((option, index) => (
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
                      ))}
                      {moreCount > 0 && (
                        <Chip
                          label={`+${moreCount} more`}
                          size="small"
                          sx={{
                            backgroundColor: 'var(--color-background-tertiary)',
                            color: 'var(--color-text-secondary)',
                            fontFamily: 'var(--font-family-primary)',
                            fontSize: 'var(--font-size-xs)',
                          }}
                        />
                      )}
                    </>
                  )
                }}
                renderOption={(props, option) => (
                  <Box
                    component="li"
                    {...props}
                    sx={{
                      fontFamily: 'var(--font-family-primary)',
                      fontSize: 'var(--font-size-sm)'
                    }}
                  >
                    {option.name}
                  </Box>
                )}
              />

              {/* Schedule Section */}
              <Box>
                <Typography
                  variant="body1"
                  sx={{
                    fontFamily: 'var(--font-family-primary)',
                    fontSize: 'var(--font-size-sm)',
                    fontWeight: 'var(--font-weight-semibold)',
                    color: 'var(--color-text-primary)',
                    mb: 2
                  }}
                >
                  Schedule
                </Typography>

                <Stack spacing={2}>
                  {/* Schedule Title */}
                  <TextField
                    fullWidth
                    size="small"
                    variant="filled"
                    label="Schedule Title"
                    value={scheduleTitle}
                    onChange={(e) => setScheduleTitle(e.target.value)}
                    sx={formFieldStyles}
                  />

                  {/* Date Pickers */}
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <DatePicker
                      label="Start Date"
                      value={startDate}
                      onChange={(newValue) => setStartDate(newValue)}
                      slotProps={{
                        textField: {
                          size: 'small',
                          variant: 'filled',
                          fullWidth: true,
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
                          fullWidth: true,
                          sx: formFieldStyles
                        }
                      }}
                    />
                  </Box>

                  {/* Start Time */}
                  <TimePicker
                    label="Start Time"
                    value={startTime}
                    onChange={(newValue) => setStartTime(newValue)}
                    slotProps={{
                      textField: {
                        size: 'small',
                        variant: 'filled',
                        fullWidth: true,
                        sx: formFieldStyles
                      }
                    }}
                  />

                  {/* Responses per Player */}
                  <FormControl fullWidth size="small" variant="filled">
                    <InputLabel 
                      sx={{
                        color: 'var(--color-text-secondary)',
                        fontSize: 'var(--font-size-sm)',
                        fontFamily: 'var(--font-family-primary)',
                        '&.Mui-focused': { color: 'var(--color-border-focus)' }
                      }}
                    >
                      Responses per Player
                    </InputLabel>
                    <Select
                      value={responsesPerPlayer}
                      onChange={(e) => setResponsesPerPlayer(e.target.value)}
                      sx={{
                        backgroundColor: 'var(--color-background-secondary)',
                        borderRadius: 'var(--radius-sm)',
                        '&:hover': { backgroundColor: 'var(--color-background-tertiary)' },
                        '&.Mui-focused': { backgroundColor: 'var(--color-background-primary)' },
                        '& .MuiSelect-select': {
                          color: 'var(--color-text-primary)',
                          fontSize: 'var(--font-size-sm)',
                          fontFamily: 'var(--font-family-primary)'
                        }
                      }}
                    >
                      {RESPONSES_PER_PLAYER_OPTIONS.map((option) => (
                        <MenuItem 
                          key={option.value} 
                          value={option.value}
                          sx={{
                            fontFamily: 'var(--font-family-primary)',
                            fontSize: 'var(--font-size-sm)'
                          }}
                        >
                          {option.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Stack>
              </Box>
            </Stack>
          </Box>

          {/* Footer */}
          <Box
            sx={{
              px: 3,
              py: 2,
              display: 'flex',
              justifyContent: 'flex-end',
              gap: 1.5,
              borderTop: '1px solid var(--color-border-primary)'
            }}
          >
            <Button
              variant="contained"
              onClick={handleClose}
              sx={{
                borderColor: 'var(--color-border-primary)',
                color: 'var(--color-text-primary)',
                fontFamily: 'var(--font-family-primary)',
                fontSize: 'var(--font-size-sm)',
                fontWeight: 600,
                textTransform: 'none',
                '&:hover': {
                  borderColor: 'var(--color-border-focus)',
                  backgroundColor: 'var(--color-background-hover)'
                }
              }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={handleSaveClick}
              sx={{
                backgroundColor: 'var(--color-primary)',
                color: 'var(--color-white)',
                fontFamily: 'var(--font-family-primary)',
                fontSize: 'var(--font-size-sm)',
                fontWeight: 600,
                textTransform: 'none',
                '&:hover': {
                  backgroundColor: 'var(--color-primary-hover)'
                }
              }}
            >
              Save
            </Button>
          </Box>
        </Box>
        {/* Save Confirmation Modal */}
        <Dialog
          open={confirmModalOpen}
          onClose={() => setConfirmModalOpen(false)}
          aria-labelledby="confirm-save-dialog-title"
          aria-describedby="confirm-save-dialog-description"
          PaperProps={{
            sx: {
              borderRadius: 'var(--radius-md)',
              padding: 1
            }
          }}
        >
          <DialogTitle
            id="confirm-save-dialog-title"
            sx={{
              fontFamily: 'var(--font-family-primary)',
              fontSize: 'var(--font-size-lg)',
              fontWeight: 600,
              color: 'var(--color-text-primary)'
            }}
          >
            Update Assignment
          </DialogTitle>
          <DialogContent>
            <DialogContentText
              id="confirm-save-dialog-description"
              sx={{
                fontFamily: 'var(--font-family-primary)',
                fontSize: 'var(--font-size-sm)',
                color: 'var(--color-text-secondary)'
              }}
            >
              Are you sure you want to update this assignment? Changes will apply to future deliveries only. Past and in-progress won&apos;t be affected.
            </DialogContentText>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
            <Button
              onClick={() => setConfirmModalOpen(false)}
              variant="contained"
              sx={{
                borderColor: 'var(--color-border-primary)',
                color: 'var(--color-text-primary)',
                fontFamily: 'var(--font-family-primary)',
                fontSize: 'var(--font-size-sm)',
                fontWeight: 600,
                textTransform: 'none',
                '&:hover': {
                  borderColor: 'var(--color-border-focus)',
                  backgroundColor: 'var(--color-background-hover)'
                }
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirmSave}
              variant="contained"
              autoFocus
              sx={{
                backgroundColor: 'var(--color-primary)',
                color: 'var(--color-white)',
                fontFamily: 'var(--font-family-primary)',
                fontSize: 'var(--font-size-sm)',
                fontWeight: 600,
                textTransform: 'none',
                '&:hover': {
                  backgroundColor: 'var(--color-primary-hover)'
                }
              }}
            >
              Continue
            </Button>
          </DialogActions>
        </Dialog>      </Drawer>
    </LocalizationProvider>
  )
}

EditScheduleDrawer.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  schedule: PropTypes.shape({
    id: PropTypes.string,
    scheduleName: PropTypes.string,
    forms: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.string,
      formName: PropTypes.string
    })),
    players: PropTypes.arrayOf(PropTypes.string),
    startDate: PropTypes.string,
    endDate: PropTypes.string
  }),
  allPlayers: PropTypes.arrayOf(PropTypes.string)
}

export default EditScheduleDrawer
