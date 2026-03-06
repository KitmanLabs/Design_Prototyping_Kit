import React, { useState, useMemo, useEffect, useRef, useCallback } from 'react'
import PropTypes from 'prop-types'
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  Divider,
  TextField,
  Button,
  FormControl,
  Stack,
  Chip,
  Select,
  MenuItem,
  InputLabel,
  useMediaQuery,
  Switch,
  Avatar,
  Paper,
  Popper,
  Grow,
  InputAdornment,
  Checkbox,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@mui/material'
import { ClickAwayListener } from '@mui/base'
import { 
  CloseOutlined, 
  KeyboardArrowDownOutlined, 
  ChevronLeft, 
  ChevronRight, 
  SyncOutlined,
  AttachFileOutlined,
  FormatBoldOutlined,
  FormatItalicOutlined,
  FormatListBulletedOutlined,
  FormatListNumberedOutlined,
  ExpandMore,
  PersonOutlined
} from '@mui/icons-material'
import { useTheme } from '@mui/material/styles'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import '../../styles/design-tokens.css'

// Procedure type options
const PROCEDURE_TYPES = [
  'Surgery',
  'Injection',
  'Imaging',
  'Lab Work',
  'Physical Therapy',
  'Consultation',
  'Follow-up',
  'Other'
]

// Provider options
const PROVIDERS = [
  'Dr. Sarah Mitchell',
  'Dr. James Thompson',
  'Dr. Emily Chen',
  'Dr. Michael Brown',
  'Dr. Lisa Anderson',
  'Physical Therapy Team',
  'External Specialist'
]

// Reason options
const REASONS = [
  'Injury Treatment',
  'Preventive Care',
  'Post-Surgery Recovery',
  'Diagnostic Evaluation',
  'Performance Enhancement',
  'Rehabilitation',
  'Follow-up Assessment',
  'Other'
]

// Body area options
const BODY_AREAS = [
  'Head/Neck',
  'Shoulder',
  'Upper Arm',
  'Elbow',
  'Forearm/Wrist',
  'Hand/Fingers',
  'Chest/Trunk',
  'Upper Back',
  'Lower Back',
  'Hip/Groin',
  'Thigh',
  'Knee',
  'Lower Leg',
  'Ankle',
  'Foot/Toes',
  'Other'
]

// Mock injuries/illnesses for linking
const LINKED_CONDITIONS = [
  'ACL Tear - Left Knee',
  'Hamstring Strain - Right',
  'Concussion Protocol',
  'Ankle Sprain - Left',
  'Shoulder Impingement - Right',
  'Lower Back Pain',
  'None'
]

// Complication options
const COMPLICATION_OPTIONS = [
  'Infection',
  'Bleeding',
  'Nerve Damage',
  'Delayed Healing',
  'Adverse Reaction',
  'Swelling',
  'Pain Management Issues',
  'Other'
]

// Procedure description options
const PROCEDURE_DESCRIPTIONS = [
  'MRI Scan',
  'X-Ray',
  'Ultrasound',
  'CT Scan',
  'Arthroscopy',
  'Blood Test',
  'Cortisone Injection',
  'PRP Injection',
  'Physical Examination',
  'Other'
]

// Form field styles matching eForms pattern
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

// Default form data for a player
const getDefaultPlayerFormData = () => ({
  procedureOrderDate: null,
  procedureAppointmentDate: null,
  provider: '',
  procedureType: '',
  procedureDescription: '',
  reason: '',
  linkedCondition: '',
  bodyArea: '',
  complications: [],
  note: '',
  attachments: []
})

// Player Procedure Form Component - renders all fields for a single player
function PlayerProcedureForm({ playerId, formData, onFormChange }) {
  const handleFieldChange = (field, value) => {
    onFormChange(playerId, field, value)
  }

  const handleAddComplication = (complication) => {
    if (!formData.complications.includes(complication)) {
      handleFieldChange('complications', [...formData.complications, complication])
    }
  }

  const handleRemoveComplication = (complication) => {
    handleFieldChange('complications', formData.complications.filter(c => c !== complication))
  }

  const handleFileUpload = (event) => {
    const files = Array.from(event.target.files)
    handleFieldChange('attachments', [...formData.attachments, ...files])
  }

  const removeAttachment = (index) => {
    handleFieldChange('attachments', formData.attachments.filter((_, i) => i !== index))
  }

  const fileInputId = `procedure-file-upload-${playerId}`

  return (
    <Stack spacing={2.5}>
      {/* Date Pickers */}
      <DatePicker
        label="Procedure Order Date"
        value={formData.procedureOrderDate}
        onChange={(newValue) => handleFieldChange('procedureOrderDate', newValue)}
        slotProps={{
          textField: {
            fullWidth: true,
            size: 'small',
            variant: 'filled',
            sx: formFieldStyles
          }
        }}
      />

      <DatePicker
        label="Procedure Appointment Date"
        value={formData.procedureAppointmentDate}
        onChange={(newValue) => handleFieldChange('procedureAppointmentDate', newValue)}
        slotProps={{
          textField: {
            fullWidth: true,
            size: 'small',
            variant: 'filled',
            sx: formFieldStyles
          }
        }}
      />

      {/* Provider */}
      <FormControl fullWidth size="small" variant="filled" sx={formFieldStyles}>
        <InputLabel>Provider</InputLabel>
        <Select
          value={formData.provider}
          onChange={(e) => handleFieldChange('provider', e.target.value)}
          label="Provider"
        >
          {PROVIDERS.map((p) => (
            <MenuItem key={p} value={p}>
              {p}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Procedure Type */}
      <FormControl fullWidth size="small" variant="filled" sx={formFieldStyles}>
        <InputLabel>Procedure Type</InputLabel>
        <Select
          value={formData.procedureType}
          onChange={(e) => handleFieldChange('procedureType', e.target.value)}
          label="Procedure Type"
        >
          {PROCEDURE_TYPES.map((type) => (
            <MenuItem key={type} value={type}>
              {type}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Procedure Description */}
      <FormControl fullWidth size="small" variant="filled" sx={formFieldStyles}>
        <InputLabel>Procedure Description</InputLabel>
        <Select
          value={formData.procedureDescription}
          onChange={(e) => handleFieldChange('procedureDescription', e.target.value)}
          label="Procedure Description"
        >
          {PROCEDURE_DESCRIPTIONS.map((desc) => (
            <MenuItem key={desc} value={desc}>
              {desc}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Reason */}
      <FormControl fullWidth size="small" variant="filled" sx={formFieldStyles}>
        <InputLabel>Reason</InputLabel>
        <Select
          value={formData.reason}
          onChange={(e) => handleFieldChange('reason', e.target.value)}
          label="Reason"
        >
          {REASONS.map((r) => (
            <MenuItem key={r} value={r}>
              {r}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Linked Injury / Illness */}
      <FormControl fullWidth size="small" variant="filled" sx={formFieldStyles}>
        <InputLabel>Linked Injury / Illness</InputLabel>
        <Select
          value={formData.linkedCondition}
          onChange={(e) => handleFieldChange('linkedCondition', e.target.value)}
          label="Linked Injury / Illness"
        >
          {LINKED_CONDITIONS.map((condition) => (
            <MenuItem key={condition} value={condition}>
              {condition}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Body Area */}
      <FormControl fullWidth size="small" variant="filled" sx={formFieldStyles}>
        <InputLabel>Body Area</InputLabel>
        <Select
          value={formData.bodyArea}
          onChange={(e) => handleFieldChange('bodyArea', e.target.value)}
          label="Body Area"
        >
          {BODY_AREAS.map((area) => (
            <MenuItem key={area} value={area}>
              {area}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Complications Section */}
      <Box>
        <Typography
          variant="body2"
          sx={{
            fontFamily: 'var(--font-family-primary)',
            fontSize: 'var(--font-size-sm)',
            fontWeight: 'var(--font-weight-semibold)',
            color: 'var(--color-text-primary)',
            mb: 1
          }}
        >
          Complications
        </Typography>
        
        {/* Added complications */}
        {formData.complications.length > 0 && (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 1.5 }}>
            {formData.complications.map((comp) => (
              <Chip
                key={comp}
                label={comp}
                size="small"
                onDelete={() => handleRemoveComplication(comp)}
                sx={{
                  fontFamily: 'var(--font-family-primary)',
                  fontSize: 'var(--font-size-xs)',
                  backgroundColor: 'var(--color-background-selected)',
                  color: 'var(--color-text-primary)',
                  '& .MuiChip-deleteIcon': {
                    color: 'var(--color-text-secondary)',
                    '&:hover': { color: 'var(--color-error)' }
                  }
                }}
              />
            ))}
          </Box>
        )}

        {/* Add Complications dropdown */}
        <FormControl fullWidth size="small" variant="filled" sx={formFieldStyles}>
          <InputLabel>Add Complication</InputLabel>
          <Select
            value=""
            onChange={(e) => {
              if (e.target.value) {
                handleAddComplication(e.target.value)
              }
            }}
            label="Add Complication"
          >
            {COMPLICATION_OPTIONS.filter(c => !formData.complications.includes(c)).map((comp) => (
              <MenuItem key={comp} value={comp}>
                {comp}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {/* Note Section */}
      <Box>
        <Typography
          variant="body2"
          sx={{
            fontFamily: 'var(--font-family-primary)',
            fontSize: 'var(--font-size-sm)',
            fontWeight: 'var(--font-weight-semibold)',
            color: 'var(--color-text-primary)',
            mb: 1
          }}
        >
          Note
        </Typography>
        
        {/* Formatting toolbar */}
        <Box
          sx={{
            display: 'flex',
            gap: 0.5,
            mb: 1,
            p: 0.5,
            backgroundColor: 'var(--color-background-secondary)',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--color-border-primary)'
          }}
        >
          <IconButton size="small" sx={{ color: 'var(--color-text-secondary)' }}>
            <FormatBoldOutlined fontSize="small" />
          </IconButton>
          <IconButton size="small" sx={{ color: 'var(--color-text-secondary)' }}>
            <FormatItalicOutlined fontSize="small" />
          </IconButton>
          <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />
          <IconButton size="small" sx={{ color: 'var(--color-text-secondary)' }}>
            <FormatListBulletedOutlined fontSize="small" />
          </IconButton>
          <IconButton size="small" sx={{ color: 'var(--color-text-secondary)' }}>
            <FormatListNumberedOutlined fontSize="small" />
          </IconButton>
        </Box>

        <TextField
          fullWidth
          size="small"
          variant="filled"
          multiline
          rows={4}
          value={formData.note}
          onChange={(e) => handleFieldChange('note', e.target.value)}
          placeholder="Add notes about this procedure..."
          sx={formFieldStyles}
        />
      </Box>

      {/* Attach File Section */}
      <Box>
        <Typography
          variant="body2"
          sx={{
            fontFamily: 'var(--font-family-primary)',
            fontSize: 'var(--font-size-sm)',
            fontWeight: 'var(--font-weight-semibold)',
            color: 'var(--color-text-primary)',
            mb: 1
          }}
        >
          Attachments
        </Typography>

        {/* Attached files list */}
        {formData.attachments.length > 0 && (
          <Box sx={{ mb: 1.5 }}>
            {formData.attachments.map((file, index) => (
              <Chip
                key={index}
                label={file.name}
                size="small"
                onDelete={() => removeAttachment(index)}
                icon={<AttachFileOutlined fontSize="small" />}
                sx={{
                  mr: 1,
                  mb: 1,
                  fontFamily: 'var(--font-family-primary)',
                  fontSize: 'var(--font-size-xs)',
                  backgroundColor: 'var(--color-background-selected)',
                  color: 'var(--color-text-primary)',
                  '& .MuiChip-deleteIcon': {
                    color: 'var(--color-text-secondary)',
                    '&:hover': { color: 'var(--color-error)' }
                  }
                }}
              />
            ))}
          </Box>
        )}

        <Button
          variant="contained"
          size="small"
          disableElevation
          startIcon={<AttachFileOutlined fontSize="small" />}
          onClick={() => document.getElementById(fileInputId).click()}
          sx={{
            backgroundColor: 'var(--color-background-secondary)',
            color: 'var(--color-text-primary)',
            border: '1px solid var(--color-border-primary)',
            textTransform: 'none',
            fontFamily: 'var(--font-family-primary)',
            fontSize: 'var(--font-size-sm)',
            fontWeight: 'var(--font-weight-medium)',
            '&:hover': {
              backgroundColor: 'var(--color-background-tertiary)',
              border: '1px solid var(--color-border-focus)'
            }
          }}
        >
          Attach File
        </Button>
        <input
          id={fileInputId}
          type="file"
          multiple
          style={{ display: 'none' }}
          onChange={handleFileUpload}
        />
      </Box>
    </Stack>
  )
}

PlayerProcedureForm.propTypes = {
  playerId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  formData: PropTypes.object.isRequired,
  onFormChange: PropTypes.func.isRequired
}

function ProcedureDrawer({
  open,
  onClose,
  onSubmit,
  athletes = [],
  injuries = []
}) {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

  // Player selector state
  const [selectorOpen, setSelectorOpen] = useState(false)
  const [selectedIds, setSelectedIds] = useState(new Set())
  const [drillPath, setDrillPath] = useState([])
  const [autoSyncTeams, setAutoSyncTeams] = useState({})
  const selectorAnchorRef = useRef(null)

  // Per-player form data - keyed by player ID
  const [playerFormData, setPlayerFormData] = useState({})
  
  // Track which accordion is expanded (player ID or null)
  const [expandedAccordion, setExpandedAccordion] = useState(null)

  // Get selected athletes in order
  const selectedAthletes = useMemo(() => {
    return athletes.filter(a => selectedIds.has(a.id))
  }, [athletes, selectedIds])

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
      setPlayerFormData({})
      setExpandedAccordion(null)
    }
  }, [open])

  // Initialize form data for newly selected players and set first accordion expanded
  useEffect(() => {
    if (selectedIds.size > 0) {
      const newFormData = { ...playerFormData }
      let firstPlayerId = null
      
      selectedIds.forEach(id => {
        if (!newFormData[id]) {
          newFormData[id] = getDefaultPlayerFormData()
        }
        if (firstPlayerId === null) {
          firstPlayerId = id
        }
      })
      
      // Remove form data for deselected players
      Object.keys(newFormData).forEach(id => {
        const numId = Number(id)
        if (!selectedIds.has(numId) && !selectedIds.has(id)) {
          delete newFormData[id]
        }
      })
      
      setPlayerFormData(newFormData)
      
      // Set first player's accordion expanded if none is expanded or current is deselected
      if (expandedAccordion === null || (!selectedIds.has(expandedAccordion) && !selectedIds.has(Number(expandedAccordion)))) {
        setExpandedAccordion(firstPlayerId)
      }
    } else {
      setPlayerFormData({})
      setExpandedAccordion(null)
    }
  }, [selectedIds])

  // Reset selector state when it closes
  useEffect(() => {
    if (!selectorOpen) {
      setDrillPath([])
    }
  }, [selectorOpen])

  const handleClose = () => {
    onClose && onClose()
  }

  const handleSave = () => {
    // Collect all player procedures
    const procedures = selectedAthletes.map(athlete => ({
      athlete: {
        id: athlete.id,
        name: athlete.name || `${athlete.firstname || ''} ${athlete.lastname || ''}`.trim()
      },
      ...playerFormData[athlete.id]
    }))
    
    onSubmit && onSubmit({ procedures })
    handleClose()
  }

  // Handle form field changes for a specific player
  const handleFormChange = useCallback((playerId, field, value) => {
    setPlayerFormData(prev => ({
      ...prev,
      [playerId]: {
        ...prev[playerId],
        [field]: value
      }
    }))
  }, [])

  // Handle accordion expand/collapse
  const handleAccordionChange = (playerId) => (event, isExpanded) => {
    setExpandedAccordion(isExpanded ? playerId : null)
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

  // Get display text for player selector trigger
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

  // Check if any team has auto-sync enabled
  const isAutoSyncActive = Object.values(autoSyncTeams).some(v => v)

  // Get player name helper
  const getPlayerName = (athlete) => {
    return athlete.name || `${athlete.firstname || ''} ${athlete.lastname || ''}`.trim()
  }

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
              fontWeight: 'var(--font-weight-semibold)',
              fontSize: 'var(--font-size-sm)',
              color: 'var(--color-text-primary)'
            }}
          >
            {team.name}
          </Typography>
          <Typography
            variant="caption"
            sx={{
              fontFamily: 'var(--font-family-primary)',
              fontSize: 'var(--font-size-xs)',
              color: 'var(--color-text-secondary)'
            }}
          >
            {selectedCount}/{team.athletes.length} selected
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box
            onClick={(e) => {
              e.stopPropagation()
              handleAutoSyncToggle(team.key)
            }}
            sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}
          >
            <Switch
              size="small"
              checked={isAutoSync}
              sx={{
                '& .MuiSwitch-switchBase.Mui-checked': {
                  color: 'var(--color-primary)'
                },
                '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                  backgroundColor: 'var(--color-primary)'
                }
              }}
            />
            <SyncOutlined fontSize="small" sx={{ color: isAutoSync ? 'var(--color-primary)' : 'var(--color-text-secondary)', fontSize: 16 }} />
          </Box>
          <Checkbox
            size="small"
            checked={allSelected}
            indeterminate={selectedCount > 0 && selectedCount < team.athletes.length}
            onClick={(e) => {
              e.stopPropagation()
              handleSelectAllTeam(team)
            }}
            sx={{
              color: 'var(--color-text-secondary)',
              '&.Mui-checked': { color: 'var(--color-primary)' },
              '&.MuiCheckbox-indeterminate': { color: 'var(--color-primary)' }
            }}
          />
          <ChevronRight fontSize="small" sx={{ color: 'var(--color-text-secondary)' }} />
        </Box>
      </Box>
    )
  }

  // Player row component
  const PlayerRow = ({ player }) => {
    const isSelected = selectedIds.has(player.id)
    
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
        onClick={() => handleToggleAthlete(player.id)}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Avatar
            src={player.avatar}
            sx={{
              width: 32,
              height: 32,
              bgcolor: 'var(--color-background-tertiary)',
              fontSize: 'var(--font-size-xs)'
            }}
          >
            {player.name?.charAt(0) || '?'}
          </Avatar>
          <Box>
            <Typography
              variant="body2"
              sx={{
                fontFamily: 'var(--font-family-primary)',
                fontWeight: 'var(--font-weight-medium)',
                fontSize: 'var(--font-size-sm)',
                color: 'var(--color-text-primary)'
              }}
            >
              {player.name}
            </Typography>
            <Typography
              variant="caption"
              sx={{
                fontFamily: 'var(--font-family-primary)',
                fontSize: 'var(--font-size-xs)',
                color: 'var(--color-text-secondary)'
              }}
            >
              {player.position}
            </Typography>
          </Box>
        </Box>
        <Checkbox
          size="small"
          checked={isSelected}
          sx={{
            color: 'var(--color-text-secondary)',
            '&.Mui-checked': { color: 'var(--color-primary)' }
          }}
        />
      </Box>
    )
  }

  // Render selector content
  const renderSelectorContent = () => {
    return (
      <Box>
        {/* Header */}
        {currentTeam ? (
          <>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                px: 2,
                py: 1.5,
                borderBottom: '1px solid var(--color-border-secondary)'
              }}
            >
              <IconButton size="small" onClick={handleBack} sx={{ mr: 1 }}>
                <ChevronLeft fontSize="small" />
              </IconButton>
              <Box sx={{ flex: 1 }}>
                <Typography
                  variant="body2"
                  sx={{
                    fontFamily: 'var(--font-family-primary)',
                    fontWeight: 'var(--font-weight-semibold)',
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
          <Box px={2} pb={1} pt={1.5}>
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
            width: isMobile ? '100vw' : 520,
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
              Add Procedure
            </Typography>
            <IconButton onClick={handleClose} size="small" aria-label="Close">
              <CloseOutlined />
            </IconButton>
          </Box>

          {/* Body */}
          <Box sx={{ px: 3, py: 3, flex: 1, overflowY: 'auto' }}>
            <Stack spacing={2.5}>
              {/* Player Selector */}
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

              {/* Player Selector Dropdown */}
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

              {/* Player Accordions - shown when players are selected */}
              {selectedAthletes.length > 0 && (
                <Box sx={{ mt: 1 }}>
                  {/* Section header showing player count */}
                  <Box 
                    sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'space-between',
                      mb: 2
                    }}
                  >
                    <Typography
                      variant="body2"
                      sx={{
                        fontFamily: 'var(--font-family-primary)',
                        fontSize: 'var(--font-size-sm)',
                        fontWeight: 'var(--font-weight-semibold)',
                        color: 'var(--color-text-primary)'
                      }}
                    >
                      Procedure Details
                    </Typography>
                    <Chip
                      size="small"
                      icon={<PersonOutlined sx={{ fontSize: '14px !important' }} />}
                      label={`${selectedAthletes.length} player${selectedAthletes.length > 1 ? 's' : ''}`}
                      sx={{
                        fontFamily: 'var(--font-family-primary)',
                        fontSize: 'var(--font-size-xs)',
                        backgroundColor: 'var(--color-background-secondary)',
                        color: 'var(--color-text-secondary)',
                        '& .MuiChip-icon': {
                          color: 'var(--color-text-secondary)'
                        }
                      }}
                    />
                  </Box>

                  {/* Accordions Stack */}
                  <Box
                    sx={{
                      border: '1px solid var(--color-border-primary)',
                      borderRadius: 'var(--radius-md)',
                      overflow: 'hidden'
                    }}
                  >
                    {selectedAthletes.map((athlete, index) => {
                      const playerId = athlete.id
                      const playerName = getPlayerName(athlete)
                      const isExpanded = expandedAccordion === playerId
                      const isLast = index === selectedAthletes.length - 1

                      return (
                        <Accordion
                          key={playerId}
                          expanded={isExpanded}
                          onChange={handleAccordionChange(playerId)}
                          disableGutters
                          elevation={0}
                          sx={{
                            '&:before': { display: 'none' },
                            borderBottom: isLast ? 'none' : '1px solid var(--color-border-secondary)',
                            backgroundColor: isExpanded 
                              ? 'var(--color-background-primary)' 
                              : 'var(--color-background-secondary)',
                            transition: 'background-color 0.2s ease',
                            '&:hover': {
                              backgroundColor: isExpanded 
                                ? 'var(--color-background-primary)'
                                : 'var(--color-background-tertiary)'
                            }
                          }}
                        >
                          <AccordionSummary
                            expandIcon={
                              <ExpandMore 
                                sx={{ 
                                  color: 'var(--color-text-secondary)',
                                  transition: 'transform 0.2s ease'
                                }} 
                              />
                            }
                            sx={{
                              minHeight: 56,
                              px: 2,
                              '& .MuiAccordionSummary-content': {
                                my: 1.5,
                                alignItems: 'center'
                              }
                            }}
                          >
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flex: 1 }}>
                              <Avatar
                                src={athlete.avatar}
                                sx={{
                                  width: 36,
                                  height: 36,
                                  bgcolor: 'var(--color-primary)',
                                  fontSize: 'var(--font-size-sm)',
                                  fontWeight: 'var(--font-weight-semibold)'
                                }}
                              >
                                {playerName?.charAt(0) || '?'}
                              </Avatar>
                              <Box sx={{ flex: 1 }}>
                                <Typography
                                  variant="body2"
                                  sx={{
                                    fontFamily: 'var(--font-family-primary)',
                                    fontWeight: 'var(--font-weight-semibold)',
                                    fontSize: 'var(--font-size-sm)',
                                    color: 'var(--color-text-primary)'
                                  }}
                                >
                                  {playerName}
                                </Typography>
                                <Typography
                                  variant="caption"
                                  sx={{
                                    fontFamily: 'var(--font-family-primary)',
                                    fontSize: 'var(--font-size-xs)',
                                    color: 'var(--color-text-secondary)'
                                  }}
                                >
                                  {athlete.position || '—'}
                                </Typography>
                              </Box>
                              {/* Status indicator for collapsed accordions */}
                              {!isExpanded && playerFormData[playerId]?.procedureType && (
                                <Chip
                                  size="small"
                                  label={playerFormData[playerId].procedureType}
                                  sx={{
                                    fontFamily: 'var(--font-family-primary)',
                                    fontSize: 'var(--font-size-xs)',
                                    backgroundColor: 'var(--color-background-selected)',
                                    color: 'var(--color-text-secondary)',
                                    height: 24
                                  }}
                                />
                              )}
                            </Box>
                          </AccordionSummary>
                          <AccordionDetails
                            sx={{
                              px: 2,
                              pb: 3,
                              pt: 1,
                              backgroundColor: 'var(--color-background-primary)',
                              maxHeight: 'calc(100vh - 400px)',
                              overflowY: 'auto'
                            }}
                          >
                            {playerFormData[playerId] && (
                              <PlayerProcedureForm
                                playerId={playerId}
                                formData={playerFormData[playerId]}
                                onFormChange={handleFormChange}
                              />
                            )}
                          </AccordionDetails>
                        </Accordion>
                      )
                    })}
                  </Box>

                  {/* Visual hint for additional players when only one is expanded */}
                  {selectedAthletes.length > 1 && (
                    <Typography
                      variant="caption"
                      sx={{
                        display: 'block',
                        textAlign: 'center',
                        mt: 1.5,
                        fontFamily: 'var(--font-family-primary)',
                        fontSize: 'var(--font-size-xs)',
                        color: 'var(--color-text-muted)'
                      }}
                    >
                      Click on a player to expand their procedure details
                    </Typography>
                  )}
                </Box>
              )}

              {/* Empty state when no players selected */}
              {selectedAthletes.length === 0 && (
                <Box
                  sx={{
                    py: 4,
                    textAlign: 'center',
                    backgroundColor: 'var(--color-background-secondary)',
                    borderRadius: 'var(--radius-md)',
                    border: '1px dashed var(--color-border-primary)'
                  }}
                >
                  <PersonOutlined 
                    sx={{ 
                      fontSize: 40, 
                      color: 'var(--color-text-muted)',
                      mb: 1
                    }} 
                  />
                  <Typography
                    variant="body2"
                    sx={{
                      fontFamily: 'var(--font-family-primary)',
                      fontSize: 'var(--font-size-sm)',
                      color: 'var(--color-text-secondary)'
                    }}
                  >
                    Select one or more players to add procedure details
                  </Typography>
                </Box>
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
                disabled={selectedAthletes.length === 0}
                sx={{
                  backgroundColor: 'var(--color-primary)',
                  color: 'var(--button-primary-color)',
                  textTransform: 'none',
                  fontFamily: 'var(--font-family-primary)',
                  '&:hover': { backgroundColor: 'var(--color-primary-hover)' },
                  '&.Mui-disabled': {
                    backgroundColor: 'var(--color-background-tertiary)',
                    color: 'var(--color-text-muted)'
                  }
                }}
                onClick={handleSave}
              >
                Save
              </Button>
            </Stack>
          </Box>
        </Box>
      </Drawer>
    </LocalizationProvider>
  )
}

ProcedureDrawer.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  onSubmit: PropTypes.func,
  athletes: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      name: PropTypes.string,
      firstname: PropTypes.string,
      lastname: PropTypes.string,
      position: PropTypes.string,
      team: PropTypes.string,
      squad: PropTypes.string,
      avatar: PropTypes.string
    })
  ),
  injuries: PropTypes.array
}

export default ProcedureDrawer
