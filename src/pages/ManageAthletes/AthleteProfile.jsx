import React, { useState, useRef, useEffect } from 'react'
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
  Autocomplete,
  Chip,
} from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import PhotoCameraOutlinedIcon from '@mui/icons-material/PhotoCameraOutlined'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import athletesData from '../../data/athletes.json'
import { useProfileBuilder } from '../../context/ProfileBuilderContext'

// ─── Dummy profile data per field id ─────────────────────────────────────────

const DUMMY_VALUES = {
  'f-first-name': 'Herbert',
  'f-last-name': 'Austin',
  'f-position': 'Tight-head Prop',
  'f-squad': 'International Squad',
  'f-email': 'herbert.austin@kitmanlabs.com',
  'f-username': 'h.austin',
  'f-dob': '1995-03-14',
  'f-mobile': '+353 87 123 4567',
  'f-language': 'English',
  'f-height': '188',
  'f-country': 'Ireland',
  'f-display-name': 'H. Austin',
  'f-short-name': 'Austin',
  'f-squad-num': '3',
  'f-assoc-id': 'IRFU-00312',
  'f-ext-id': 'EXT-00312',
  'f-crm-id': 'CRM-00312',
  'f-nationality': 'Irish',
}

function getAthleteValues(id) {
  const athlete = athletesData.find((a) => String(a.id) === String(id))
  if (!athlete) return DUMMY_VALUES
  return {
    ...DUMMY_VALUES,
    'f-first-name': athlete.firstname || DUMMY_VALUES['f-first-name'],
    'f-last-name': athlete.lastname || DUMMY_VALUES['f-last-name'],
    'f-position': athlete.position || DUMMY_VALUES['f-position'],
    'f-squad': athlete.squad_name || DUMMY_VALUES['f-squad'],
    'f-email': athlete.email || DUMMY_VALUES['f-email'],
    'f-username': athlete.username || DUMMY_VALUES['f-username'],
    'f-dob': athlete.date_of_birth || DUMMY_VALUES['f-dob'],
    'f-mobile': athlete.mobile || DUMMY_VALUES['f-mobile'],
    'f-height': athlete.height ? String(athlete.height).replace('cm', '').trim() : DUMMY_VALUES['f-height'],
    'f-country': athlete.country || DUMMY_VALUES['f-country'],
    'f-nationality': athlete.nationality || DUMMY_VALUES['f-nationality'],
  }
}

// ─── Read-only field pair ─────────────────────────────────────────────────────

function FieldValue({ label, value, mandatory }) {
  return (
    <Box sx={{ mb: 2.5 }}>
      <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: 11, fontWeight: 500, display: 'block', mb: 0.25 }}>
        {label}{mandatory ? ' *' : ''}
      </Typography>
      <Typography variant="body1" sx={{ fontSize: 15 }}>
        {value || <span style={{ color: '#bbb' }}>—</span>}
      </Typography>
    </Box>
  )
}

// ─── Edit field ───────────────────────────────────────────────────────────────

function EditField({ field, value, onChange }) {
  const label = `${field.label}${field.mandatory ? ' *' : ''}`

  if (field.type === 'dropdown') {
    return (
      <FormControl fullWidth size="small" variant="filled" sx={{ mb: 2 }}>
        <InputLabel>{label}</InputLabel>
        <Select value={value || ''} onChange={(e) => onChange(e.target.value)}>
          <MenuItem value=""><em>None</em></MenuItem>
          {(field.options || []).map((o, i) => <MenuItem key={i} value={o}>{o}</MenuItem>)}
        </Select>
      </FormControl>
    )
  }

  if (field.id === 'f-squad') {
    return (
      <Autocomplete
        multiple
        size="small"
        options={['International Squad', 'International Squad (Primary)', 'Development Squad', 'Academy']}
        value={value ? [value] : []}
        onChange={(_, v) => onChange(v[v.length - 1] || '')}
        renderTags={(val, getTagProps) =>
          val.map((opt, idx) => <Chip key={idx} label={opt} size="small" {...getTagProps({ index: idx })} />)
        }
        renderInput={(params) => (
          <TextField {...params} variant="filled" label={label} size="small" sx={{ mb: 2 }} />
        )}
      />
    )
  }

  return (
    <TextField
      fullWidth
      size="small"
      variant="filled"
      label={label}
      type={field.type === 'date' ? 'date' : field.type === 'number' ? 'number' : 'text'}
      value={value || ''}
      onChange={(e) => onChange(e.target.value)}
      InputLabelProps={field.type === 'date' ? { shrink: true } : undefined}
      sx={{ mb: 2 }}
    />
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function AthleteProfile() {
  const navigate = useNavigate()
  const { id } = useParams()
  const { sections } = useProfileBuilder()

  const initialValues = getAthleteValues(id)
  const [formValues, setFormValues] = useState(initialValues)
  const [tabValue, setTabValue] = useState(0)
  const [editing, setEditing] = useState(false)
  const [activeSectionId, setActiveSectionId] = useState(sections[0]?.id)

  const athlete = athletesData.find((a) => String(a.id) === String(id))
  const firstName = formValues['f-first-name'] || 'Athlete'
  const lastName = formValues['f-last-name'] || ''
  const position = formValues['f-position'] || ''
  const squad = formValues['f-squad'] || ''

  const contentRef = useRef(null)
  const sectionRefs = useRef({})

  // Scroll to section on nav click
  function scrollToSection(sectionId) {
    setActiveSectionId(sectionId)
    const el = sectionRefs.current[sectionId]
    if (el && contentRef.current) {
      contentRef.current.scrollTo({ top: el.offsetTop - 16, behavior: 'smooth' })
    }
  }

  // Visible sections and fields (respect hidden state from builder)
  const visibleSections = sections.map((section) => ({
    ...section,
    fields: section.fields.filter((f) => !f.hidden),
  })).filter((section) => section.fields.length > 0)

  function handleSave() {
    setEditing(false)
  }

  function handleCancel() {
    setFormValues(initialValues)
    setEditing(false)
  }

  return (
    <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', backgroundColor: '#fff', height: '100%' }}>

        {/* ── Header ── */}
        <Box sx={{ px: 3, pt: 2.5, pb: 0, borderBottom: '1px solid #e0e0e0', flexShrink: 0 }}>
          {/* Back link */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <IconButton size="small" onClick={() => navigate('/manage-athletes')} sx={{ border: '1px solid #e0e0e0' }}>
              <ArrowBackIcon sx={{ fontSize: 16 }} />
            </IconButton>
            <Typography
              variant="body2"
              onClick={() => navigate('/manage-athletes')}
              sx={{ color: 'text.secondary', fontSize: 13, cursor: 'pointer', '&:hover': { color: 'text.primary' } }}
            >
              Back to manage athletes
            </Typography>
          </Box>

          {/* Profile header row */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2.5, mb: 2.5 }}>
            <Avatar
              sx={{
                width: 80, height: 80,
                backgroundColor: '#e3ecf9',
                color: '#1976d2',
                fontSize: 28,
                fontWeight: 700,
              }}
            >
              {firstName[0]}{lastName[0]}
            </Avatar>
            <Box sx={{ flex: 1 }}>
              <Typography variant="h5" sx={{ fontWeight: 700, fontSize: 22, lineHeight: 1.2 }}>
                {firstName} {lastName}
              </Typography>
              <Typography variant="subtitle1" color="text.secondary" sx={{ fontSize: 15 }}>
                {position}{squad ? ` · ${squad}` : ''}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
              <Button
                variant="text"
                size="small"
                sx={{ textTransform: 'none', color: 'text.secondary', fontSize: 14 }}
              >
                Reset password
              </Button>
              {editing ? (
                <>
                  <Button variant="outlined" size="small" disableElevation
                    onClick={handleCancel}
                    sx={{ textTransform: 'none', fontSize: 14, borderColor: '#d0d0d0', color: 'text.primary' }}>
                    Cancel
                  </Button>
                  <Button variant="contained" size="small" disableElevation
                    onClick={handleSave}
                    sx={{ textTransform: 'none', fontSize: 14, backgroundColor: '#1a2035', '&:hover': { backgroundColor: '#2a3045' } }}>
                    Save
                  </Button>
                </>
              ) : (
                <Button variant="contained" size="small" disableElevation
                  startIcon={<EditOutlinedIcon />}
                  onClick={() => setEditing(true)}
                  sx={{ textTransform: 'none', fontSize: 14, backgroundColor: '#1a2035', '&:hover': { backgroundColor: '#2a3045' } }}>
                  Edit
                </Button>
              )}
            </Box>
          </Box>

          {/* Tabs */}
          <Tabs
            value={tabValue}
            onChange={(_, v) => setTabValue(v)}
            TabIndicatorProps={{ style: { backgroundColor: '#1976d2' } }}
            sx={{
              minHeight: 40,
              '& .MuiTab-root': { textTransform: 'none', fontSize: 14, fontWeight: 500, minHeight: 40, mr: 1, color: 'text.secondary', px: 0 },
              '& .MuiTab-root.Mui-selected': { color: '#1976d2', fontWeight: 600 },
            }}
          >
            <Tab label="Athlete details" />
            <Tab label="Emergency contacts" />
            <Tab label="Third party settings" />
          </Tabs>
        </Box>

        {/* ── Athlete Details tab ── */}
        {tabValue === 0 && (
          <Box sx={{ display: 'flex', flex: 1, overflow: 'hidden' }}>

            {/* Section left nav */}
            <Box sx={{
              width: 220, flexShrink: 0, borderRight: '1px solid #e0e0e0',
              overflowY: 'auto', pt: 2, backgroundColor: '#fff',
            }}>
              {visibleSections.map((section) => {
                const active = activeSectionId === section.id
                return (
                  <Box
                    key={section.id}
                    onClick={() => scrollToSection(section.id)}
                    sx={{
                      px: 2, py: 1, cursor: 'pointer',
                      borderLeft: active ? '3px solid #1976d2' : '3px solid transparent',
                      backgroundColor: active ? 'rgba(25,118,210,0.05)' : 'transparent',
                      '&:hover': { backgroundColor: active ? 'rgba(25,118,210,0.05)' : 'rgba(0,0,0,0.02)' },
                    }}
                  >
                    <Typography sx={{ fontSize: 14, fontWeight: active ? 600 : 400, color: active ? '#1976d2' : 'text.primary' }}>
                      {section.label}
                    </Typography>
                  </Box>
                )
              })}
            </Box>

            {/* Content panel */}
            <Box ref={contentRef} sx={{ flex: 1, overflowY: 'auto', p: 3 }}>
              {visibleSections.map((section, sIdx) => (
                <Box
                  key={section.id}
                  ref={(el) => { sectionRefs.current[section.id] = el }}
                  sx={{ mb: 4 }}
                >
                  {/* Section header */}
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                    <Typography variant="h6" sx={{ fontWeight: 700, fontSize: 16 }}>{section.label}</Typography>
                    <Divider sx={{ flex: 1 }} />
                  </Box>

                  {/* Profile photo — first section only */}
                  {sIdx === 0 && (
                    <Box sx={{ mb: 3 }}>
                      {editing ? (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Avatar sx={{ width: 120, height: 120, backgroundColor: '#e3ecf9', color: '#1976d2', fontSize: 36, fontWeight: 700 }}>
                            {firstName[0]}{lastName[0]}
                          </Avatar>
                          <Box>
                            <Button size="small" variant="outlined" startIcon={<PhotoCameraOutlinedIcon />}
                              sx={{ textTransform: 'none', fontSize: 13, borderColor: '#ccc', color: 'text.secondary', display: 'block', mb: 0.5 }}>
                              Upload photo
                            </Button>
                            <Typography variant="caption" color="text.secondary">JPG or PNG, max 2MB</Typography>
                          </Box>
                        </Box>
                      ) : (
                        <Avatar sx={{ width: 120, height: 120, backgroundColor: '#e3ecf9', color: '#1976d2', fontSize: 36, fontWeight: 700 }}>
                          {firstName[0]}{lastName[0]}
                        </Avatar>
                      )}
                    </Box>
                  )}

                  {/* Fields */}
                  {editing ? (
                    <Grid container spacing={2}>
                      {section.fields.map((field) => (
                        <Grid item xs={6} key={field.id}>
                          <EditField
                            field={field}
                            value={formValues[field.id]}
                            onChange={(v) => setFormValues((prev) => ({ ...prev, [field.id]: v }))}
                          />
                        </Grid>
                      ))}
                    </Grid>
                  ) : (
                    <Grid container spacing={0}>
                      {section.fields.map((field) => (
                        <Grid item xs={6} key={field.id}>
                          <FieldValue
                            label={field.label}
                            value={formValues[field.id]}
                            mandatory={field.mandatory}
                          />
                        </Grid>
                      ))}
                    </Grid>
                  )}
                </Box>
              ))}
            </Box>
          </Box>
        )}

        {/* Emergency Contacts tab */}
        {tabValue === 1 && (
          <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Typography color="text.secondary">No emergency contacts added</Typography>
          </Box>
        )}

        {/* Third Party Settings tab */}
        {tabValue === 2 && (
          <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Typography color="text.secondary">No third party settings configured</Typography>
          </Box>
        )}
    </Box>
  )
}
