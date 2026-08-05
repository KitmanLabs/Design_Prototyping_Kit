import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box,
  Typography,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Tabs,
  Tab,
  Card,
  CardContent,
  Stack,
  Switch,
  TextField,
  FormControl,
  InputLabel,
  Select,
  Divider,
  Avatar,
  Tooltip,
} from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import DragIndicatorIcon from '@mui/icons-material/DragIndicator'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import LockIcon from '@mui/icons-material/Lock'
import EditIcon from '@mui/icons-material/Edit'
import VisibilityIcon from '@mui/icons-material/Visibility'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'
import DeleteIcon from '@mui/icons-material/Delete'
import AddIcon from '@mui/icons-material/Add'
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera'
import {
  useProfileConfig,
  nextId,
  Field,
  FieldType,
  Section,
} from '../profileConfig'

const DARK = '#1a2035'
const BLUE = '#1976d2'

const ProfileBuilder: React.FC = () => {
  const navigate = useNavigate()
  const { sections, setSections } = useProfileConfig()
  const [tab, setTab] = useState(0)
  const [activeSectionId, setActiveSectionId] = useState(sections[0]?.id ?? '')
  const [expandedFieldId, setExpandedFieldId] = useState<string | null>(null)
  const [addMenuAnchor, setAddMenuAnchor] = useState<null | HTMLElement>(null)

  const activeSection = sections.find((s) => s.id === activeSectionId) ?? sections[0]

  // ---- mutators -------------------------------------------------------------
  const updateField = (sectionId: string, fieldId: string, patch: Partial<Field>) => {
    setSections((prev) =>
      prev.map((s) =>
        s.id === sectionId
          ? { ...s, fields: s.fields.map((f) => (f.id === fieldId ? { ...f, ...patch } : f)) }
          : s,
      ),
    )
  }

  const deleteField = (sectionId: string, fieldId: string) => {
    setSections((prev) =>
      prev.map((s) =>
        s.id === sectionId ? { ...s, fields: s.fields.filter((f) => f.id !== fieldId) } : s,
      ),
    )
  }

  const addField = (sectionId: string) => {
    const id = nextId('field')
    setSections((prev) =>
      prev.map((s) =>
        s.id === sectionId
          ? {
              ...s,
              fields: [
                ...s.fields,
                { id, label: 'New field', type: 'text' as FieldType, tier: 3, mandatory: false, hidden: false },
              ],
            }
          : s,
      ),
    )
    setExpandedFieldId(id)
  }

  const addSection = () => {
    const id = nextId('section')
    const newSection: Section = { id, label: 'New section', locked: false, fields: [] }
    setSections((prev) => [...prev, newSection])
    setActiveSectionId(id)
  }

  const addOption = (sectionId: string, fieldId: string) => {
    setSections((prev) =>
      prev.map((s) =>
        s.id === sectionId
          ? {
              ...s,
              fields: s.fields.map((f) =>
                f.id === fieldId
                  ? { ...f, options: [...(f.options ?? []), { id: nextId('opt'), label: '' }] }
                  : f,
              ),
            }
          : s,
      ),
    )
  }

  const updateOption = (sectionId: string, fieldId: string, optId: string, label: string) => {
    setSections((prev) =>
      prev.map((s) =>
        s.id === sectionId
          ? {
              ...s,
              fields: s.fields.map((f) =>
                f.id === fieldId
                  ? { ...f, options: (f.options ?? []).map((o) => (o.id === optId ? { ...o, label } : o)) }
                  : f,
              ),
            }
          : s,
      ),
    )
  }

  const deleteOption = (sectionId: string, fieldId: string, optId: string) => {
    setSections((prev) =>
      prev.map((s) =>
        s.id === sectionId
          ? {
              ...s,
              fields: s.fields.map((f) =>
                f.id === fieldId ? { ...f, options: (f.options ?? []).filter((o) => o.id !== optId) } : f,
              ),
            }
          : s,
      ),
    )
  }

  // ---- field card -----------------------------------------------------------
  const renderFieldCard = (section: Section, field: Field) => {
    // Tier 1 locked card
    if (field.tier === 1) {
      return (
        <Card
          key={field.id}
          sx={{
            mb: 1,
            boxShadow: 'none',
            border: '1px solid #e0e0e0',
            borderRadius: 1,
            backgroundColor: '#fafafa',
            cursor: 'default',
          }}
        >
          <CardContent sx={{ py: 1, '&:last-child': { pb: 1 } }}>
            <Stack direction="row" alignItems="center" spacing={1}>
              <Typography sx={{ flex: 1, fontSize: '0.875rem', color: 'text.secondary' }}>
                {field.label}
              </Typography>
              <LockIcon sx={{ fontSize: 16, color: '#bdbdbd' }} />
            </Stack>
          </CardContent>
        </Card>
      )
    }

    const expanded = expandedFieldId === field.id

    if (!expanded) {
      return (
        <Card
          key={field.id}
          onClick={() => setExpandedFieldId(field.id)}
          sx={{
            mb: 1,
            boxShadow: 'none',
            border: '1px solid #e0e0e0',
            borderRadius: 1,
            cursor: 'pointer',
            '&:hover': { backgroundColor: '#fafafa' },
          }}
        >
          <CardContent sx={{ py: 1, '&:last-child': { pb: 1 } }}>
            <Stack direction="row" alignItems="center" spacing={1}>
              <DragIndicatorIcon sx={{ color: '#bdbdbd', fontSize: 20 }} />
              <Typography sx={{ flex: 1, fontSize: '0.875rem' }}>{field.label}</Typography>
              <Typography variant="caption" color="text.secondary">
                Mandatory
              </Typography>
              <Switch
                size="small"
                checked={field.mandatory}
                onClick={(e) => e.stopPropagation()}
                onChange={(e) => updateField(section.id, field.id, { mandatory: e.target.checked })}
              />
              <IconButton size="small" onClick={(e) => e.stopPropagation()}>
                <MoreVertIcon fontSize="small" />
              </IconButton>
              {field.tier === 2 && (
                <IconButton
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation()
                    updateField(section.id, field.id, { hidden: !field.hidden })
                  }}
                >
                  {field.hidden ? (
                    <VisibilityOffIcon fontSize="small" />
                  ) : (
                    <VisibilityIcon fontSize="small" />
                  )}
                </IconButton>
              )}
              {field.tier === 3 && (
                <IconButton
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation()
                    deleteField(section.id, field.id)
                  }}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              )}
            </Stack>
          </CardContent>
        </Card>
      )
    }

    // Expanded card
    return (
      <Card
        key={field.id}
        sx={{ mb: 1, border: '1px solid #1976d2', borderLeft: '3px solid #1976d2', borderRadius: 1 }}
      >
        <CardContent>
          <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
            <DragIndicatorIcon sx={{ color: '#bdbdbd', fontSize: 20 }} />
            <Typography sx={{ flex: 1, fontSize: '0.875rem', fontWeight: 600 }}>{field.label}</Typography>
            <IconButton size="small" onClick={() => setExpandedFieldId(null)}>
              <ExpandMoreIcon fontSize="small" />
            </IconButton>
          </Stack>
          <TextField
            fullWidth
            size="small"
            label="Field label"
            value={field.label}
            onChange={(e) => updateField(section.id, field.id, { label: e.target.value })}
            sx={{ mb: 2 }}
            autoFocus
          />
          <FormControl fullWidth size="small" sx={{ mb: 2 }}>
            <InputLabel>Field type</InputLabel>
            <Select
              label="Field type"
              value={field.type}
              onChange={(e) => updateField(section.id, field.id, { type: e.target.value as FieldType })}
            >
              <MenuItem value="text">Text</MenuItem>
              <MenuItem value="number">Number</MenuItem>
              <MenuItem value="date">Date</MenuItem>
              <MenuItem value="dropdown">Dropdown/Select</MenuItem>
            </Select>
          </FormControl>
          <TextField
            fullWidth
            size="small"
            label="Description"
            placeholder="Add a description..."
            multiline
            rows={2}
            sx={{ mb: 2 }}
          />
          {field.type === 'dropdown' && (
            <Box sx={{ mb: 1 }}>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
                Options
              </Typography>
              {(field.options ?? []).map((opt) => (
                <Stack key={opt.id} direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
                  <TextField
                    fullWidth
                    size="small"
                    value={opt.label}
                    placeholder="Option label"
                    onChange={(e) => updateOption(section.id, field.id, opt.id, e.target.value)}
                  />
                  <IconButton size="small" onClick={() => deleteOption(section.id, field.id, opt.id)}>
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Stack>
              ))}
              <Button
                size="small"
                variant="text"
                startIcon={<AddIcon />}
                onClick={() => addOption(section.id, field.id)}
              >
                Add option
              </Button>
            </Box>
          )}
        </CardContent>
      </Card>
    )
  }

  // ---- BUILD tab ------------------------------------------------------------
  const buildTab = (
    <Box
      sx={{
        display: 'flex',
        flex: 1,
        overflow: 'hidden',
        backgroundColor: 'white',
        borderRadius: 1,
      }}
    >
      {/* Menu panel */}
      <Box sx={{ width: 260, minWidth: 260, borderRight: '1px solid #e0e0e0', backgroundColor: 'white' }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography sx={{ fontWeight: 600, p: 2 }}>Menu</Typography>
          <Button
            size="small"
            variant="outlined"
            endIcon={<KeyboardArrowDownIcon />}
            sx={{ ml: 'auto', mr: 2 }}
            onClick={(e) => setAddMenuAnchor(e.currentTarget)}
          >
            Add
          </Button>
          <Menu anchorEl={addMenuAnchor} open={Boolean(addMenuAnchor)} onClose={() => setAddMenuAnchor(null)}>
            <MenuItem
              onClick={() => {
                addSection()
                setAddMenuAnchor(null)
              }}
            >
              Add section
            </MenuItem>
          </Menu>
        </Box>
        {sections.map((section) => {
          const isActive = section.id === activeSectionId
          if (section.locked) {
            return (
              <Box
                key={section.id}
                onClick={() => setActiveSectionId(section.id)}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  px: 1,
                  py: 0.75,
                  cursor: 'pointer',
                  borderRadius: 1,
                  mx: 1,
                  backgroundColor: isActive ? '#e8f0fe' : 'transparent',
                  '&:hover': { backgroundColor: isActive ? '#e8f0fe' : '#f5f5f5' },
                }}
              >
                <Tooltip title="This section cannot be edited or reordered">
                  <LockIcon sx={{ color: '#bdbdbd', fontSize: 20, mr: 1 }} />
                </Tooltip>
                <Typography sx={{ flex: 1, fontSize: '0.875rem' }}>{section.label}</Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary', mr: 1 }}>
                  {section.fields.length} fields
                </Typography>
                <IconButton size="small">
                  <ExpandMoreIcon fontSize="small" />
                </IconButton>
              </Box>
            )
          }
          return (
            <Box
              key={section.id}
              onClick={() => setActiveSectionId(section.id)}
              sx={{
                display: 'flex',
                alignItems: 'center',
                px: 1,
                py: 0.75,
                cursor: 'pointer',
                borderRadius: 1,
                mx: 1,
                backgroundColor: isActive ? '#e8f0fe' : 'transparent',
                '&:hover': { backgroundColor: isActive ? '#e8f0fe' : '#f5f5f5' },
              }}
            >
              <DragIndicatorIcon sx={{ color: '#bdbdbd', fontSize: 20, mr: 1 }} />
              <Typography sx={{ flex: 1, fontSize: '0.875rem' }}>{section.label}</Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary', mr: 1 }}>
                {section.fields.length} fields
              </Typography>
              <IconButton size="small">
                <MoreVertIcon fontSize="small" />
              </IconButton>
              <IconButton size="small">
                <ExpandMoreIcon fontSize="small" />
              </IconButton>
            </Box>
          )
        })}
      </Box>

      {/* Canvas */}
      <Box sx={{ flex: 1, p: 3, overflowY: 'auto', backgroundColor: 'white' }}>
        {activeSection && (
          <>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                {activeSection.label}
              </Typography>
              {!activeSection.locked && (
                <IconButton size="small" sx={{ ml: 1 }}>
                  <EditIcon fontSize="small" />
                </IconButton>
              )}
            </Box>
            <Divider sx={{ my: 1.5 }} />

            {activeSection.locked && (
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  mb: 3,
                  p: 2,
                  border: '1px solid #e0e0e0',
                  borderRadius: 1,
                  width: 160,
                }}
              >
                <Avatar sx={{ width: 80, height: 80, mb: 1 }} />
                <Button size="small" startIcon={<PhotoCameraIcon />} variant="text">
                  Upload photo
                </Button>
              </Box>
            )}

            {activeSection.fields.map((field) => renderFieldCard(activeSection, field))}

            {!activeSection.locked && (
              <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                <Button
                  variant="text"
                  startIcon={<AddIcon />}
                  size="small"
                  onClick={() => addField(activeSection.id)}
                >
                  Add field
                </Button>
                <Button variant="text" startIcon={<AddIcon />} size="small">
                  Add paragraph
                </Button>
                <Button variant="text" startIcon={<AddIcon />} size="small">
                  Add group
                </Button>
              </Box>
            )}
          </>
        )}
      </Box>
    </Box>
  )

  // ---- PREVIEW tab ----------------------------------------------------------
  const [previewSectionId, setPreviewSectionId] = useState(sections[0]?.id ?? '')
  const previewSection = sections.find((s) => s.id === previewSectionId) ?? sections[0]

  const previewTab = (
    <Box sx={{ display: 'flex', flex: 1, backgroundColor: 'white', borderRadius: 1 }}>
      <Box sx={{ width: 220, minWidth: 220, borderRight: '1px solid #e0e0e0', py: 2 }}>
        {sections.map((section) => {
          const active = section.id === previewSectionId
          return (
            <Typography
              key={section.id}
              onClick={() => setPreviewSectionId(section.id)}
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
      <Box sx={{ flex: 1, p: 3, overflowY: 'auto' }}>
        {previewSection && (
          <>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
              {previewSection.label}
            </Typography>
            <Divider sx={{ mb: 3 }} />
            <Stack spacing={2} sx={{ maxWidth: 480 }}>
              {previewSection.fields
                .filter((f) => f.tier === 1 || !f.hidden)
                .map((field) => {
                  const commonLabel = (
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                      {field.label}
                      {field.mandatory && <span style={{ color: '#d32f2f' }}> *</span>}
                    </Typography>
                  )
                  if (field.type === 'dropdown') {
                    return (
                      <Box key={field.id}>
                        {commonLabel}
                        <FormControl fullWidth size="small">
                          <Select value="" displayEmpty>
                            <MenuItem value="">Select...</MenuItem>
                            {(field.options ?? []).map((o) => (
                              <MenuItem key={o.id} value={o.label}>
                                {o.label}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </Box>
                    )
                  }
                  return (
                    <Box key={field.id}>
                      {commonLabel}
                      <TextField
                        fullWidth
                        size="small"
                        type={field.type === 'number' ? 'number' : field.type === 'date' ? 'date' : 'text'}
                        InputLabelProps={field.type === 'date' ? { shrink: true } : undefined}
                      />
                    </Box>
                  )
                })}
            </Stack>
          </>
        )}
      </Box>
    </Box>
  )

  return (
    <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', height: '100%', boxSizing: 'border-box' }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 1 }}>
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton onClick={() => navigate('/manage-athletes')}>
              <ArrowBackIcon />
            </IconButton>
            <Typography sx={{ display: 'inline', ml: 1 }}>Back to Manage Athletes</Typography>
          </Box>
          <Typography variant="h5" sx={{ fontWeight: 600, mt: 1 }}>
            Athlete Profile Builder
          </Typography>
        </Box>
        <Box sx={{ ml: 'auto' }}>
          <Button variant="contained" sx={{ backgroundColor: DARK }}>
            Save
          </Button>
        </Box>
      </Box>

      {/* Tabs */}
      <Tabs
        value={tab}
        onChange={(_, v) => setTab(v)}
        TabIndicatorProps={{ style: { backgroundColor: BLUE } }}
        sx={{ mb: 2 }}
      >
        <Tab label="Build" sx={{ color: tab === 0 ? BLUE : undefined, fontWeight: tab === 0 ? 600 : 400 }} />
        <Tab label="Preview" sx={{ color: tab === 1 ? BLUE : undefined, fontWeight: tab === 1 ? 600 : 400 }} />
      </Tabs>

      {/* Body */}
      <Box sx={{ flex: 1, overflow: 'hidden', display: 'flex' }}>{tab === 0 ? buildTab : previewTab}</Box>
    </Box>
  )
}

export default ProfileBuilder
