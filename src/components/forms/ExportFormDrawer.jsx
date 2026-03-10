import React, { useState, useMemo, useEffect, useRef, useCallback } from 'react'
import PropTypes from 'prop-types'
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  Divider,
  Stack,
  Chip,
  TextField,
  FormControlLabel,
  Checkbox,
  Button,
  Switch,
  Avatar,
  Paper,
  Popper,
  Grow,
  useMediaQuery,
  InputAdornment,
  Snackbar,
  Slide
} from '@mui/material'
import { ClickAwayListener } from '@mui/base'
import {
  CloseOutlined,
  KeyboardArrowDownOutlined,
  ChevronLeftOutlined,
  ChevronRightOutlined,
  SyncOutlined
} from '@mui/icons-material'
import { useTheme } from '@mui/material/styles'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import '../../styles/design-tokens.css'

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

// Default export column fields
const DEFAULT_EXPORT_FIELDS = [
  { id: 'athleteName', label: 'Athlete name', checked: true },
  { id: 'formName', label: 'Form name', checked: true },
  { id: 'productArea', label: 'Product area', checked: true },
  { id: 'category', label: 'Category', checked: true },
  { id: 'completionDate', label: 'Completion date', checked: true },
  { id: 'status', label: 'Status', checked: true },
]

function ExportFormDrawer({
  open,
  onClose,
  onExport,
  athletes = [],
  exportFields = DEFAULT_EXPORT_FIELDS
}) {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

  // Selector state
  const [selectorOpen, setSelectorOpen] = useState(false)
  const [selectedIds, setSelectedIds] = useState(new Set())
  const [drillPath, setDrillPath] = useState([])
  const [autoSyncTeams, setAutoSyncTeams] = useState({})
  const selectorAnchorRef = useRef(null)

  // Snackbar state
  const [snackbarOpen, setSnackbarOpen] = useState(false)

  // Date range
  const [startDate, setStartDate] = useState(null)
  const [endDate, setEndDate] = useState(null)
  // Field checkboxes
  const [fields, setFields] = useState(exportFields.map(f => ({ ...f, checked: true })))

  // Group athletes by team
  const teamGroups = useMemo(() => {
    const grouped = {}
    athletes.forEach((athlete) => {
      const teamKey = athlete.team || athlete.squad || 'Unassigned'
      if (!grouped[teamKey]) {
        grouped[teamKey] = {
          key: teamKey,
          name: teamKey,
          status: 'Active',
          athletes: []
        }
      }
      grouped[teamKey].athletes.push({
        id: athlete.id,
        name: athlete.name || `${athlete.firstname || ''} ${athlete.lastname || ''}`.trim(),
        position: athlete.position || '—',
        avatar: athlete.avatar
      })
    })
    return Object.values(grouped)
  }, [athletes])

  // Current drill-down team
  const currentTeam = drillPath.length > 0 ? drillPath[drillPath.length - 1] : null

  // Reset state when drawer opens
  useEffect(() => {
    if (open) {
      setSelectedIds(new Set())
      setSelectorOpen(false)
      setDrillPath([])
      setAutoSyncTeams({})
      setStartDate(null)
      setEndDate(null)
      setFields(exportFields.map(f => ({ ...f, checked: true })))
    }
  }, [open, exportFields])

  // Reset selector state when it closes
  useEffect(() => {
    if (!selectorOpen) {
      setDrillPath([])
    }
  }, [selectorOpen])

  const handleClose = () => {
    onClose && onClose()
  }

  const handleExport = () => {
    const selectedAthletes = athletes.filter(a => selectedIds.has(a.id))
    const exportData = {
      athletes: selectedAthletes,
      startDate,
      endDate,
      fields: fields.filter(f => f.checked).map(f => f.id)
    }
    onExport && onExport(exportData)
    handleClose()
    setSnackbarOpen(true)
  }

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') return
    setSnackbarOpen(false)
  }

  // Slide transition from right
  const SlideTransition = (props) => {
    return <Slide {...props} direction="left" />
  }

  const handleFieldToggle = (fieldId) => {
    setFields(prev => prev.map(f => 
      f.id === fieldId ? { ...f, checked: !f.checked } : f
    ))
  }

  // Selector handlers
  const handleOpenSelector = () => setSelectorOpen(true)
  const handleCloseSelector = () => setSelectorOpen(false)
  const handleDone = () => {
    setSelectorOpen(false)
  }

  const handleToggleAthlete = (athleteId) => {
    setSelectedIds(prev => {
      const next = new Set(prev)
      if (next.has(athleteId)) {
        next.delete(athleteId)
      } else {
        next.add(athleteId)
      }
      return next
    })
  }

  const handleSelectAllTeam = useCallback((team) => {
    const teamAthleteIds = team.athletes.map(a => a.id)
    const allSelected = teamAthleteIds.every(id => selectedIds.has(id))
    
    setSelectedIds(prev => {
      const next = new Set(prev)
      if (allSelected) {
        teamAthleteIds.forEach(id => next.delete(id))
      } else {
        teamAthleteIds.forEach(id => next.add(id))
      }
      return next
    })
  }, [selectedIds])

  const handleAutoSyncToggle = (teamKey) => {
    setAutoSyncTeams(prev => ({
      ...prev,
      [teamKey]: !prev[teamKey]
    }))
  }

  const handleDrillDown = (team) => {
    setDrillPath(prev => [...prev, team])
  }

  const handleBack = () => {
    setDrillPath(prev => prev.slice(0, -1))
  }

  const handleClearSelection = () => {
    setSelectedIds(new Set())
  }

  // Get display text for trigger
  const triggerDisplayText = useMemo(() => {
    if (selectedIds.size === 0) return ''
    const selectedNames = athletes
      .filter(a => selectedIds.has(a.id))
      .map(a => a.name || `${a.firstname || ''} ${a.lastname || ''}`.trim())
      .slice(0, 3)
    if (selectedIds.size > 3) {
      return `${selectedNames.join(', ')} +${selectedIds.size - 3} more`
    }
    return selectedNames.join(', ')
  }, [selectedIds, athletes])

  // Team row component
  const TeamRow = ({ team }) => {
    const teamAthleteIds = team.athletes.map(a => a.id)
    const selectedCount = teamAthleteIds.filter(id => selectedIds.has(id)).length
    const allSelected = selectedCount === team.athletes.length && team.athletes.length > 0
    const isAutoSync = autoSyncTeams[team.key] || false

    return (
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          px: 2,
          py: 1.5,
          cursor: 'pointer',
          '&:hover': { bgcolor: 'action.hover' },
          borderBottom: '1px solid var(--color-border-secondary)'
        }}
        onClick={() => handleDrillDown(team)}
      >
        <Box sx={{ flex: 1 }}>
          <Typography
            variant="body2"
            sx={{
              fontFamily: 'var(--font-family-primary)',
              fontSize: 'var(--font-size-sm)',
              fontWeight: 'var(--font-weight-medium)',
              color: 'var(--color-text-primary)'
            }}
          >
            {team.name}
            {selectedCount > 0 && ` (${selectedCount})`}
          </Typography>
          <FormControlLabel
            control={
              <Switch
                size="small"
                checked={isAutoSync}
                onClick={(e) => {
                  e.stopPropagation()
                  handleAutoSyncToggle(team.key)
                }}
                sx={{
                  '& .MuiSwitch-switchBase.Mui-checked': {
                    color: 'var(--color-primary)'
                  },
                  '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                    backgroundColor: 'var(--color-primary)'
                  }
                }}
              />
            }
            label={
              <Typography
                sx={{
                  fontFamily: 'var(--font-family-primary)',
                  fontSize: 'var(--font-size-xs)',
                  color: 'var(--color-text-secondary)'
                }}
              >
                Auto-sync
              </Typography>
            }
            labelPlacement="end"
            onClick={(e) => e.stopPropagation()}
            sx={{ ml: -1, mt: 0.5 }}
          />
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Button
            size="small"
            variant="contained"
            onClick={(e) => {
              e.stopPropagation()
              handleSelectAllTeam(team)
            }}
            sx={{
              fontFamily: 'var(--font-family-primary)',
              fontSize: 'var(--font-size-xs)',
              textTransform: 'none',
              minWidth: 'auto',
              color: 'var(--color-primary)'
            }}
          >
            {allSelected ? 'Clear all' : 'Select all'}
          </Button>
          <ChevronRightOutlined fontSize="small" sx={{ color: 'var(--color-text-secondary)' }} />
        </Box>
      </Box>
    )
  }

  // Player row component
  const PlayerRow = ({ player }) => {
    const isSelected = selectedIds.has(player.id)
    const initials = player.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()

    return (
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          px: 2,
          py: 1,
          cursor: 'pointer',
          '&:hover': { bgcolor: 'action.hover' },
          borderBottom: '1px solid var(--color-border-secondary)'
        }}
        onClick={() => handleToggleAthlete(player.id)}
      >
        <Checkbox
          size="small"
          checked={isSelected}
          sx={{
            color: 'var(--color-text-secondary)',
            '&.Mui-checked': {
              color: 'var(--color-primary)'
            },
            mr: 1
          }}
        />
        <Avatar
          src={player.avatar}
          sx={{
            width: 32,
            height: 32,
            mr: 1.5,
            fontSize: 'var(--font-size-xs)',
            bgcolor: 'var(--color-background-tertiary)',
            color: 'var(--color-text-secondary)'
          }}
        >
          {initials}
        </Avatar>
        <Typography
          variant="body2"
          sx={{
            fontFamily: 'var(--font-family-primary)',
            fontSize: 'var(--font-size-sm)',
            color: 'var(--color-text-primary)'
          }}
        >
          {player.name}
        </Typography>
      </Box>
    )
  }

  // Selector content
  const renderSelectorContent = () => {
    const isAutoSyncActive = currentTeam && autoSyncTeams[currentTeam.key]

    return (
      <Box>
        {/* Header */}
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          px={2}
          pt={2}
          pb={1}
        >
          <Typography
            variant="h6"
            sx={{
              fontFamily: 'var(--font-family-primary)',
              fontSize: 'var(--font-size-md)',
              fontWeight: 600,
              color: 'var(--color-text-primary)'
            }}
          >
            Select Athletes
          </Typography>
          <IconButton size="small" onClick={handleCloseSelector}>
            <CloseOutlined fontSize="small" />
          </IconButton>
        </Box>

        {/* Drill-down header or Selected chip */}
        {currentTeam ? (
          <>
            {/* Back button row */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                px: 2,
                py: 1
              }}
            >
              <Button
                startIcon={<ChevronLeftOutlined fontSize="small" />}
                onClick={handleBack}
                size="small"
                sx={{
                  textTransform: 'none',
                  fontFamily: 'var(--font-family-primary)',
                  fontSize: 'var(--font-size-sm)',
                  color: 'var(--color-text-primary)',
                  ml: -1
                }}
              >
                Back
              </Button>
              <Box sx={{ textAlign: 'right' }}>
                <Typography
                  variant="body2"
                  sx={{
                    fontFamily: 'var(--font-family-primary)',
                    fontSize: 'var(--font-size-sm)',
                    color: 'var(--color-text-primary)'
                  }}
                >
                  {currentTeam.name}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    fontFamily: 'var(--font-family-primary)',
                    fontSize: 'var(--font-size-xs)',
                    color: 'var(--color-text-secondary)'
                  }}
                >
                  {currentTeam.status}
                </Typography>
              </Box>
            </Box>
            {/* Selected count + auto-sync indicator row */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                px: 2,
                pb: 1
              }}
            >
              <Chip
                size="small"
                variant="filled"
                disabled={selectedIds.size === 0}
                color="primary"
                label={`Selected (${selectedIds.size})`}
                onDelete={selectedIds.size > 0 ? handleClearSelection : undefined}
                deleteIcon={<CloseOutlined fontSize="small" />}
                sx={{
                  fontFamily: 'var(--font-family-primary)',
                  fontSize: 'var(--font-size-xs)'
                }}
              />
              {isAutoSyncActive && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <Typography
                    variant="caption"
                    sx={{
                      fontFamily: 'var(--font-family-primary)',
                      fontSize: 'var(--font-size-xs)',
                      color: 'var(--color-text-secondary)'
                    }}
                  >
                    Auto-syncing new players
                  </Typography>
                  <SyncOutlined fontSize="small" sx={{ color: 'var(--color-text-secondary)', fontSize: 16 }} />
                </Box>
              )}
            </Box>
          </>
        ) : (
          <Box px={2} pb={1}>
            <Chip
              size="small"
              variant="filled"
              disabled={selectedIds.size === 0}
              color="primary"
              label={`Selected (${selectedIds.size})`}
              onDelete={selectedIds.size > 0 ? handleClearSelection : undefined}
              deleteIcon={<CloseOutlined fontSize="small" />}
              sx={{
                fontFamily: 'var(--font-family-primary)',
                fontSize: 'var(--font-size-xs)'
              }}
            />
          </Box>
        )}

        <Divider />

        {/* List content */}
        <Box sx={{ maxHeight: 300, overflowY: 'auto' }}>
          {!currentTeam ? (
            // Team list view
            teamGroups.map(team => (
              <TeamRow key={team.key} team={team} />
            ))
          ) : (
            // Player list view
            currentTeam.athletes.map(player => (
              <PlayerRow key={player.id} player={player} />
            ))
          )}
          {!currentTeam && teamGroups.length === 0 && (
            <Typography
              variant="body2"
              sx={{
                textAlign: 'center',
                py: 3,
                color: 'var(--color-text-secondary)',
                fontFamily: 'var(--font-family-primary)'
              }}
            >
              No teams found
            </Typography>
          )}
        </Box>

        <Divider />

        {/* Footer */}
        <Box sx={{ p: 2, display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            variant="contained"
            size="small"
            onClick={handleDone}
            disabled={selectedIds.size === 0}
            sx={{
              backgroundColor: 'var(--color-primary)',
              color: 'var(--button-primary-color)',
              textTransform: 'none',
              fontFamily: 'var(--font-family-primary)',
              '&:hover': { backgroundColor: 'var(--color-primary-hover)' },
              '&.Mui-disabled': {
                backgroundColor: 'var(--color-background-tertiary)',
                color: 'var(--color-text-secondary)'
              }
            }}
          >
            Done
          </Button>
        </Box>
      </Box>
    )
  }

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
              Export
            </Typography>
            <IconButton onClick={handleClose} size="small" aria-label="Close">
              <CloseOutlined />
            </IconButton>
          </Box>

          {/* Body */}
          <Box sx={{ px: 3, py: 3, flex: 1, overflowY: 'auto' }}>
            <Stack spacing={3}>
              {/* Players Selector Trigger */}
              <Box ref={selectorAnchorRef}>
                <TextField
                  fullWidth
                  size="small"
                  variant="filled"
                  label="Players"
                  value={triggerDisplayText}
                  placeholder="Select players"
                  onClick={handleOpenSelector}
                  InputProps={{
                    readOnly: true,
                    endAdornment: (
                      <InputAdornment position="end">
                        <KeyboardArrowDownOutlined
                          fontSize="small"
                          sx={{ color: 'var(--color-text-secondary)' }}
                        />
                      </InputAdornment>
                    )
                  }}
                  sx={{
                    ...formFieldStyles,
                    cursor: 'pointer',
                    '& .MuiInputBase-input': {
                      ...formFieldStyles['& .MuiInputBase-input'],
                      cursor: 'pointer'
                    }
                  }}
                />
              </Box>

              {/* Athlete Selector Dropdown */}
              <Popper
                open={selectorOpen}
                anchorEl={selectorAnchorRef.current}
                placement="bottom-start"
                transition
                sx={{ zIndex: 1400 }}
                modifiers={[
                  {
                    name: 'offset',
                    options: {
                      offset: [0, 4]
                    }
                  }
                ]}
              >
                {({ TransitionProps }) => (
                  <Grow {...TransitionProps} timeout={200}>
                    <Paper
                      sx={{
                        width: selectorAnchorRef.current?.offsetWidth || 400,
                        boxShadow: theme.shadows[8],
                        borderRadius: 'var(--radius-md)'
                      }}
                    >
                      <ClickAwayListener onClickAway={handleCloseSelector}>
                        {renderSelectorContent()}
                      </ClickAwayListener>
                    </Paper>
                  </Grow>
                )}
              </Popper>

              {/* Date Range */}
              <Stack direction="row" spacing={2} alignItems="center">
                <DatePicker
                  label="Start date"
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
                <Typography
                  sx={{
                    color: 'var(--color-text-secondary)',
                    fontFamily: 'var(--font-family-primary)'
                  }}
                >
                  —
                </Typography>
                <DatePicker
                  label="End date"
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
              </Stack>

              {/* Show Fields Section */}
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
                  Show fields
                </Typography>

                <Stack spacing={1}>
                  {fields.map((field) => (
                    <FormControlLabel
                      key={field.id}
                      control={
                        <Checkbox
                          checked={field.checked}
                          onChange={() => handleFieldToggle(field.id)}
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
                            color: 'var(--color-text-primary)'
                          }}
                        >
                          {field.label}
                        </Typography>
                      }
                      sx={{
                        ml: 0,
                        '& .MuiCheckbox-root': {
                          py: 0.5
                        }
                      }}
                    />
                  ))}
                </Stack>
              </Box>
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
            <Stack direction="row" justifyContent="space-between" spacing={1.5}>
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
                onClick={handleExport}
              >
                Export
              </Button>
            </Stack>
          </Box>
        </Box>
      </Drawer>

      {/* Export Success Snackbar */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={2500}
        onClose={handleSnackbarClose}
        TransitionComponent={SlideTransition}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            // eslint-disable-next-line design-system/no-hardcoded-colors
            backgroundColor: 'var(--color-success, #28a745)',
            color: 'var(--color-white)',
            px: 2,
            py: 1.5,
            borderRadius: 'var(--radius-sm)',
            boxShadow: theme.shadows[6]
          }}
        >
          <Typography
            sx={{
              fontFamily: 'var(--font-family-primary)',
              fontSize: 'var(--font-size-sm)',
              fontWeight: 'var(--font-weight-medium)'
            }}
          >
            Export successful
          </Typography>
          <Button
            size="small"
            variant="contained"
            sx={{
              color: 'var(--color-white)',
              textTransform: 'none',
              fontFamily: 'var(--font-family-primary)',
              fontSize: 'var(--font-size-sm)',
              fontWeight: 'var(--font-weight-semibold)',
              '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' }
            }}
          >
            Export
          </Button>
        </Box>
      </Snackbar>
    </LocalizationProvider>
  )
}

ExportFormDrawer.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  onExport: PropTypes.func,
  athletes: PropTypes.array,
  exportFields: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      label: PropTypes.string,
      checked: PropTypes.bool
    })
  )
}

export default ExportFormDrawer
