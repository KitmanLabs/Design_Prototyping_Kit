import React, { useMemo, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  Box,
  Typography,
  Button,
  IconButton,
  Avatar,
  Tabs,
  Tab,
  Divider,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera'
import { useProfileConfig, Field } from '../profileConfig'
import { athletesList, athleteProfileValues, defaultProfileValues } from '../data/athletes'

const DARK = '#1a2035'
const BLUE = '#1976d2'

const AthleteProfile: React.FC = () => {
  const navigate = useNavigate()
  const { id = '1' } = useParams()
  const { sections } = useProfileConfig()

  const athlete = athletesList.find((a) => a.id === id)
  const baseValues = athleteProfileValues[id] ?? defaultProfileValues

  const [tab, setTab] = useState(0)
  const [editMode, setEditMode] = useState(false)
  const [activeSectionId, setActiveSectionId] = useState(sections[0]?.id ?? '')
  const [values, setValues] = useState<Record<string, string>>(baseValues)
  const [draft, setDraft] = useState<Record<string, string>>(baseValues)

  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({})

  const fullName = athlete
    ? `${athlete.firstName} ${athlete.lastName}`
    : `${values['f-firstname'] ?? ''} ${values['f-lastname'] ?? ''}`.trim()
  const position = athlete?.position ?? values['f-position'] ?? ''
  const initials = useMemo(() => {
    const parts = fullName.split(' ').filter(Boolean)
    return parts.map((p) => p[0]).slice(0, 2).join('')
  }, [fullName])

  const scrollToSection = (sectionId: string) => {
    setActiveSectionId(sectionId)
    sectionRefs.current[sectionId]?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const handleEdit = () => {
    setDraft(values)
    setEditMode(true)
  }
  const handleSave = () => {
    setValues(draft)
    setEditMode(false)
  }
  const handleCancel = () => {
    setDraft(values)
    setEditMode(false)
  }

  const visibleFields = (fields: Field[]) => fields.filter((f) => f.tier === 1 || !f.hidden)

  const renderValue = (field: Field) => {
    const v = values[field.id]
    return (
      <Grid item xs={6} key={field.id}>
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
          {field.label}
        </Typography>
        <Typography variant="body1">{v ? v : '—'}</Typography>
      </Grid>
    )
  }

  const renderEditInput = (field: Field) => {
    const v = draft[field.id] ?? ''
    const setVal = (val: string) => setDraft((prev) => ({ ...prev, [field.id]: val }))
    const label = (
      <>
        {field.label}
        {field.mandatory && <span style={{ color: '#d32f2f' }}> *</span>}
      </>
    )
    return (
      <Grid item xs={6} key={field.id}>
        {field.type === 'dropdown' ? (
          <FormControl fullWidth size="small">
            <InputLabel>{label}</InputLabel>
            <Select label={field.label} value={v} onChange={(e) => setVal(e.target.value)}>
              {(field.options ?? []).map((o) => (
                <MenuItem key={o.id} value={o.label}>
                  {o.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        ) : (
          <TextField
            fullWidth
            size="small"
            label={label}
            value={v}
            type={field.type === 'number' ? 'number' : field.type === 'date' ? 'date' : 'text'}
            InputLabelProps={field.type === 'date' ? { shrink: true } : undefined}
            onChange={(e) => setVal(e.target.value)}
          />
        )}
      </Grid>
    )
  }

  return (
    <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', height: '100%', boxSizing: 'border-box' }}>
      {/* Back link */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
        <IconButton onClick={() => navigate('/athletes')}>
          <ArrowBackIcon />
        </IconButton>
        <Typography sx={{ display: 'inline', ml: 1 }}>Back to Athletes</Typography>
      </Box>

      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Avatar sx={{ width: 80, height: 80 }}>{initials}</Avatar>
        <Box sx={{ ml: 2 }}>
          <Typography variant="h5">{fullName}</Typography>
          <Typography variant="subtitle1" color="text.secondary">
            {position}
          </Typography>
        </Box>
        <Box sx={{ ml: 'auto', display: 'flex', gap: 1, alignItems: 'center' }}>
          {!editMode && (
            <>
              <Button variant="contained" sx={{ backgroundColor: DARK }} onClick={handleEdit}>
                Edit
              </Button>
              <Button variant="text">Reset Password</Button>
            </>
          )}
          {editMode && (
            <>
              <Button variant="contained" sx={{ backgroundColor: DARK }} onClick={handleSave}>
                Save
              </Button>
              <Button variant="outlined" sx={{ borderColor: DARK, color: DARK }} onClick={handleCancel}>
                Cancel
              </Button>
            </>
          )}
        </Box>
      </Box>

      {/* Tabs */}
      <Tabs
        value={tab}
        onChange={(_, v) => setTab(v)}
        TabIndicatorProps={{ style: { backgroundColor: BLUE } }}
        sx={{ mb: 2 }}
      >
        <Tab label="Athlete Details" sx={{ color: tab === 0 ? BLUE : undefined, fontWeight: tab === 0 ? 600 : 400 }} />
        <Tab label="Emergency Contacts" />
        <Tab label="Third Party Settings" />
      </Tabs>

      {/* Body */}
      <Box sx={{ flex: 1, overflow: 'hidden', display: 'flex' }}>
        <Box sx={{ display: 'flex', flex: 1, backgroundColor: 'white', borderRadius: 1 }}>
          {/* Left section nav */}
          <Box sx={{ width: 220, minWidth: 220, borderRight: '1px solid #e0e0e0', py: 2 }}>
            {sections.map((section) => {
              const active = section.id === activeSectionId
              return (
                <Typography
                  key={section.id}
                  onClick={() => scrollToSection(section.id)}
                  sx={
                    active
                      ? {
                          borderLeft: '3px solid #1976d2',
                          pl: 1.5,
                          py: 0.75,
                          fontWeight: 600,
                          color: '#1976d2',
                          cursor: 'pointer',
                          display: 'block',
                        }
                      : {
                          pl: 2,
                          py: 0.75,
                          color: 'text.secondary',
                          cursor: 'pointer',
                          display: 'block',
                          '&:hover': { color: '#1976d2' },
                        }
                  }
                >
                  {section.label}
                </Typography>
              )
            })}
          </Box>

          {/* Right panel */}
          <Box sx={{ flex: 1, p: 3, overflowY: 'auto' }}>
            {sections.map((section) => (
              <Box
                key={section.id}
                ref={(el: HTMLDivElement | null) => (sectionRefs.current[section.id] = el)}
                sx={{ mb: 5 }}
              >
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                  {section.label}
                </Typography>
                <Divider sx={{ mb: 3 }} />

                {section.locked && (
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', mb: 3 }}>
                    <Avatar sx={{ width: 120, height: 120, mb: 2 }}>{initials}</Avatar>
                    {editMode && (
                      <Button size="small" startIcon={<PhotoCameraIcon />} variant="text">
                        Upload photo
                      </Button>
                    )}
                  </Box>
                )}

                <Grid container spacing={3}>
                  {visibleFields(section.fields).map((field) =>
                    editMode ? renderEditInput(field) : renderValue(field),
                  )}
                </Grid>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

export default AthleteProfile
