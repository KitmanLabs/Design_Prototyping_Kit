import React, { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useProfileBuilder } from '../../context/ProfileBuilderContext'
import {
  Box,
  Typography,
  Button,
  IconButton,
  Tooltip,
  Menu,
  MenuItem,
  Tabs,
  Tab,
  Divider,
  Card,
  CardContent,
  Stack,
  Switch,
  FormControlLabel,
  TextField,
  Select,
  InputLabel,
  FormControl,
  Avatar,
  Chip,
  Collapse,
} from '@mui/material'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import DragIndicatorIcon from '@mui/icons-material/DragIndicator'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import ExpandMoreOutlinedIcon from '@mui/icons-material/ExpandMoreOutlined'
import ExpandLessOutlinedIcon from '@mui/icons-material/ExpandLessOutlined'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined'
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined'
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined'
import AddIcon from '@mui/icons-material/Add'
import PhotoCameraOutlinedIcon from '@mui/icons-material/PhotoCameraOutlined'
import CheckIcon from '@mui/icons-material/Check'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
} from '@dnd-kit/core'
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
  arrayMove,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

// ─── Constants ────────────────────────────────────────────────────────────────

const BRAND_BLUE = '#1976d2'
const NAVY = '#1a2035'

const FIELD_TYPE_OPTIONS = [
  { value: 'text', label: 'Text' },
  { value: 'number', label: 'Number' },
  { value: 'date', label: 'Date' },
  { value: 'dropdown', label: 'Dropdown / Select' },
]

// ─── Helpers ──────────────────────────────────────────────────────────────────

function uid() {
  return Math.random().toString(36).slice(2, 10)
}

function makeField(overrides = {}) {
  return {
    id: uid(),
    label: 'Untitled field',
    type: 'text',
    tier: 3,
    mandatory: false,
    hidden: false,
    options: [],
    optionStyle: 'dropdown',
    defaultValue: '',
    description: '',
    ...overrides,
  }
}

// ─── Initial State ────────────────────────────────────────────────────────────

const INITIAL_SECTIONS = [
  {
    id: 'essential-info',
    label: 'Essential info',
    locked: true,
    collapsed: false,
    fields: [
      makeField({ id: 'f-first-name', label: 'First name', type: 'text', tier: 1 }),
      makeField({ id: 'f-last-name', label: 'Last name', type: 'text', tier: 1 }),
      makeField({ id: 'f-position', label: 'Position', type: 'text', tier: 1 }),
      makeField({ id: 'f-squad', label: 'Squad', type: 'text', tier: 1 }),
      makeField({ id: 'f-email', label: 'Email address', type: 'text', tier: 1 }),
      makeField({ id: 'f-username', label: 'Username', type: 'text', tier: 1 }),
      makeField({ id: 'f-dob', label: 'Date of birth', type: 'date', tier: 1 }),
      makeField({ id: 'f-mobile', label: 'Mobile number', type: 'text', tier: 1 }),
      makeField({ id: 'f-language', label: 'Language', type: 'dropdown', tier: 1, options: [] }),
    ],
  },
  {
    id: 'additional-info',
    label: 'Additional info',
    locked: false,
    collapsed: false,
    fields: [
      makeField({ id: 'f-height', label: 'Height (cm)', type: 'number', tier: 2 }),
      makeField({ id: 'f-country', label: 'Country', type: 'dropdown', tier: 2, options: [] }),
      makeField({ id: 'f-display-name', label: 'Display name', type: 'text', tier: 2 }),
      makeField({ id: 'f-short-name', label: 'Shortened name', type: 'text', tier: 2 }),
      makeField({ id: 'f-squad-num', label: 'Squad number', type: 'number', tier: 2 }),
      makeField({ id: 'f-assoc-id', label: 'Association player ID', type: 'text', tier: 2 }),
      makeField({ id: 'f-ext-id', label: 'External ID', type: 'text', tier: 2 }),
      makeField({ id: 'f-crm-id', label: 'CRM ID', type: 'text', tier: 2 }),
      makeField({ id: 'f-nationality', label: 'Nationality', type: 'dropdown', tier: 2, options: [] }),
    ],
  },
]

// ─── FieldCard ────────────────────────────────────────────────────────────────

function FieldCard({ field, isExpanded, onToggle, onUpdate, onDelete, onToggleVisibility, dragHandleProps }) {
  const labelInputRef = useRef(null)

  React.useEffect(() => {
    if (isExpanded && field.tier === 3 && labelInputRef.current) {
      labelInputRef.current.focus()
      labelInputRef.current.select()
    }
  }, [isExpanded, field.tier])

  // Tier 1 — locked
  if (field.tier === 1) {
    return (
      <Card elevation={0} sx={{ mb: 0.75, backgroundColor: '#fafafa', border: '1px solid #ebebeb', borderRadius: 1 }}>
        <CardContent sx={{ py: '10px !important', px: 2 }}>
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Typography variant="body2" sx={{ fontWeight: 500, fontSize: 14 }}>{field.label}</Typography>
            <LockOutlinedIcon sx={{ fontSize: 15, color: 'text.disabled' }} />
          </Stack>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card
      elevation={0}
      sx={{
        mb: 0.75,
        cursor: 'pointer',
        border: isExpanded ? `1px solid ${BRAND_BLUE}` : '1px solid #e0e0e0',
        borderLeft: isExpanded ? `3px solid ${BRAND_BLUE}` : '1px solid #e0e0e0',
        backgroundColor: '#fff',
        opacity: field.hidden ? 0.5 : 1,
        borderRadius: 1,
        transition: 'border-color 0.15s',
      }}
      onClick={onToggle}
    >
      <CardContent sx={{ py: '10px !important', px: 1.5 }}>
        <Stack direction="row" alignItems="center" spacing={0.5}>
          {/* Drag handle */}
          <Box
            {...dragHandleProps}
            onClick={(e) => e.stopPropagation()}
            sx={{ cursor: 'grab', color: 'text.disabled', display: 'flex', '&:active': { cursor: 'grabbing' } }}
          >
            <DragIndicatorIcon sx={{ fontSize: 18 }} />
          </Box>

          <Typography variant="body2" sx={{ flex: 1, fontWeight: 500, fontSize: 14, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {field.label}
          </Typography>

          {field.hidden && <Chip label="Hidden" size="small" sx={{ height: 18, fontSize: 10 }} />}

          <Box onClick={(e) => e.stopPropagation()} sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <FormControlLabel
              control={
                <Switch
                  size="small"
                  checked={field.mandatory}
                  onChange={(e) => onUpdate({ ...field, mandatory: e.target.checked })}
                />
              }
              label={<Typography sx={{ fontSize: 12, color: 'text.secondary' }}>Mandatory</Typography>}
              sx={{ mx: 0 }}
            />

            {field.tier === 2 && (
              <Tooltip title={field.hidden ? 'Show field' : 'Hide field'}>
                <IconButton size="small" onClick={() => onToggleVisibility()}>
                  {field.hidden
                    ? <VisibilityOffOutlinedIcon sx={{ fontSize: 16 }} />
                    : <VisibilityOutlinedIcon sx={{ fontSize: 16 }} />}
                </IconButton>
              </Tooltip>
            )}

            {field.tier === 3 && (
              <Tooltip title="Delete field">
                <IconButton size="small" onClick={() => onDelete()} sx={{ '&:hover': { color: 'error.main' } }}>
                  <DeleteOutlinedIcon sx={{ fontSize: 16 }} />
                </IconButton>
              </Tooltip>
            )}
          </Box>
        </Stack>

        {/* Expanded body */}
        <Collapse in={isExpanded} onClick={(e) => e.stopPropagation()}>
          <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            <TextField inputRef={labelInputRef} fullWidth size="small" variant="filled" label="Field label"
              value={field.label} onChange={(e) => onUpdate({ ...field, label: e.target.value })}
              onClick={(e) => e.stopPropagation()} />

            <FormControl fullWidth size="small" variant="filled">
              <InputLabel>Field type</InputLabel>
              <Select value={field.type} onChange={(e) => onUpdate({ ...field, type: e.target.value })}
                onClick={(e) => e.stopPropagation()}>
                {FIELD_TYPE_OPTIONS.map((o) => <MenuItem key={o.value} value={o.value}>{o.label}</MenuItem>)}
              </Select>
            </FormControl>

            <TextField fullWidth size="small" variant="filled" label="Description" placeholder="Add a description..."
              multiline rows={2} value={field.description || ''}
              onChange={(e) => onUpdate({ ...field, description: e.target.value })}
              onClick={(e) => e.stopPropagation()} />

            {field.type === 'dropdown' && (
              <Box sx={{ pl: 1.5, borderLeft: '2px solid #e0e0e0' }}>
                <Typography variant="caption" sx={{ fontWeight: 600, color: 'text.secondary', display: 'block', mb: 1 }}>Options</Typography>
                {(field.options || []).map((opt, idx) => (
                  <Stack key={idx} direction="row" alignItems="center" spacing={1} sx={{ mb: 0.75 }}>
                    <TextField size="small" variant="filled" value={opt}
                      onChange={(e) => { const opts = [...field.options]; opts[idx] = e.target.value; onUpdate({ ...field, options: opts }) }}
                      sx={{ flex: 1 }} onClick={(e) => e.stopPropagation()} />
                    <IconButton size="small"
                      onClick={(e) => { e.stopPropagation(); onUpdate({ ...field, options: field.options.filter((_, i) => i !== idx) }) }}
                      sx={{ '&:hover': { color: 'error.main' } }}>
                      <DeleteOutlinedIcon sx={{ fontSize: 15 }} />
                    </IconButton>
                  </Stack>
                ))}
                <Button size="small" startIcon={<AddIcon />}
                  onClick={(e) => { e.stopPropagation(); onUpdate({ ...field, options: [...(field.options || []), ''] }) }}
                  sx={{ textTransform: 'none', fontSize: 12 }}>
                  Add option
                </Button>
                <Stack direction="row" spacing={1.5} sx={{ mt: 1 }}>
                  <FormControl size="small" variant="filled" sx={{ minWidth: 120 }}>
                    <InputLabel sx={{ fontSize: 12 }}>Style</InputLabel>
                    <Select value={field.optionStyle || 'dropdown'} onClick={(e) => e.stopPropagation()}
                      onChange={(e) => onUpdate({ ...field, optionStyle: e.target.value })}>
                      <MenuItem value="dropdown">Dropdown</MenuItem>
                      <MenuItem value="radio">Radio</MenuItem>
                    </Select>
                  </FormControl>
                  <FormControl size="small" variant="filled" sx={{ minWidth: 140 }}>
                    <InputLabel sx={{ fontSize: 12 }}>Default value</InputLabel>
                    <Select value={field.defaultValue || ''} onClick={(e) => e.stopPropagation()}
                      onChange={(e) => onUpdate({ ...field, defaultValue: e.target.value })}>
                      <MenuItem value=""><em>None</em></MenuItem>
                      {(field.options || []).map((opt, idx) => <MenuItem key={idx} value={opt}>{opt}</MenuItem>)}
                    </Select>
                  </FormControl>
                </Stack>
              </Box>
            )}
          </Box>
        </Collapse>
      </CardContent>
    </Card>
  )
}

// ─── SortableFieldCard ────────────────────────────────────────────────────────

function SortableFieldCard(props) {
  const { field } = props
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: field.id,
    disabled: field.tier === 1,
  })
  return (
    <Box ref={setNodeRef} style={{ transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.4 : 1 }}>
      <FieldCard {...props} dragHandleProps={{ ...attributes, ...listeners }} />
    </Box>
  )
}

// ─── SectionRow (sidebar) ─────────────────────────────────────────────────────

function SectionRow({ section, isActive, onClick, onMenuOpen, onToggleCollapse, dragHandleProps }) {
  return (
    <Box
      onClick={onClick}
      sx={{
        display: 'flex',
        alignItems: 'center',
        px: 1.5,
        py: 1,
        cursor: 'pointer',
        borderBottom: '1px solid #ebebeb',
        backgroundColor: isActive ? 'rgba(25, 118, 210, 0.08)' : 'transparent',
        '&:hover': { backgroundColor: isActive ? 'rgba(25, 118, 210, 0.08)' : 'rgba(0,0,0,0.03)' },
        transition: 'background-color 0.12s',
      }}
    >
      {section.locked ? (
        <LockOutlinedIcon sx={{ fontSize: 16, color: 'text.disabled', mr: 1, flexShrink: 0 }} />
      ) : (
        <Box {...dragHandleProps} onClick={(e) => e.stopPropagation()}
          sx={{ cursor: 'grab', color: 'text.disabled', mr: 0.5, display: 'flex', '&:active': { cursor: 'grabbing' } }}>
          <DragIndicatorIcon sx={{ fontSize: 18 }} />
        </Box>
      )}

      <Typography
        variant="body2"
        sx={{
          flex: 1,
          fontWeight: isActive ? 600 : 400,
          fontSize: 14,
          color: isActive ? BRAND_BLUE : 'text.primary',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}
      >
        {section.label}
      </Typography>

      <Typography variant="caption" sx={{ color: 'text.disabled', fontSize: 12, mx: 0.5, flexShrink: 0 }}>
        {section.fields.length}
      </Typography>

      {!section.locked && (
        <IconButton size="small"
          onClick={(e) => { e.stopPropagation(); onMenuOpen(e, section.id) }}
          sx={{ p: 0.25, color: 'text.disabled', '&:hover': { color: 'text.primary' } }}>
          <MoreVertIcon sx={{ fontSize: 16 }} />
        </IconButton>
      )}

      <IconButton size="small"
        onClick={(e) => { e.stopPropagation(); onToggleCollapse(section.id) }}
        sx={{ p: 0.25, color: 'text.disabled', '&:hover': { color: 'text.primary' } }}>
        {section.collapsed ? <ExpandMoreOutlinedIcon sx={{ fontSize: 16 }} /> : <ExpandLessOutlinedIcon sx={{ fontSize: 16 }} />}
      </IconButton>
    </Box>
  )
}

function SortableSectionRow({ section, isActive, onClick, onMenuOpen, onToggleCollapse }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: section.id, disabled: section.locked,
  })
  return (
    <Box ref={setNodeRef} style={{ transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.5 : 1 }}>
      <SectionRow section={section} isActive={isActive} onClick={onClick} onMenuOpen={onMenuOpen}
        onToggleCollapse={onToggleCollapse} dragHandleProps={{ ...attributes, ...listeners }} />
    </Box>
  )
}

// ─── InlineEditTitle ──────────────────────────────────────────────────────────

function InlineEditTitle({ value, onChange, variant = 'h6', disabled }) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(value)
  const inputRef = useRef(null)

  React.useEffect(() => { if (editing && inputRef.current) inputRef.current.focus() }, [editing])

  function commit() {
    setEditing(false)
    const trimmed = draft.trim()
    if (trimmed && trimmed !== value) onChange(trimmed)
    else setDraft(value)
  }

  if (editing) {
    return (
      <TextField inputRef={inputRef} variant="filled" size="small" value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={commit}
        onKeyDown={(e) => { if (e.key === 'Enter') commit(); if (e.key === 'Escape') { setEditing(false); setDraft(value) } }}
        sx={{ '& .MuiInput-root': { fontWeight: 700, fontSize: variant === 'h6' ? 20 : 14 } }} />
    )
  }

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
      <Typography variant={variant} sx={{ fontWeight: variant === 'h6' ? 700 : 600, fontSize: variant === 'h6' ? 20 : 15 }}>
        {value}
      </Typography>
      {!disabled && (
        <IconButton size="small" onClick={() => { setDraft(value); setEditing(true) }} sx={{ p: 0.25 }}>
          <EditOutlinedIcon sx={{ fontSize: 15, color: 'text.secondary' }} />
        </IconButton>
      )}
    </Box>
  )
}

// ─── Preview ──────────────────────────────────────────────────────────────────

function PreviewField({ field }) {
  if (field.hidden) return null

  const commonProps = {
    fullWidth: true,
    size: 'small',
    variant: 'filled',
    label: field.label,
    disabled: true,
    sx: { mb: 1.5 },
  }

  if (field.type === 'dropdown') {
    return (
      <FormControl fullWidth size="small" variant="filled" disabled sx={{ mb: 1.5 }}>
        <InputLabel>{field.label}</InputLabel>
        <Select value="">
          {(field.options || []).map((o, i) => <MenuItem key={i} value={o}>{o}</MenuItem>)}
        </Select>
      </FormControl>
    )
  }

  if (field.type === 'date') return <TextField {...commonProps} type="date" InputLabelProps={{ shrink: true }} />
  if (field.type === 'number') return <TextField {...commonProps} type="number" />
  return <TextField {...commonProps} />
}

function PreviewPanel({ sections }) {
  const [previewSectionId, setPreviewSectionId] = useState(sections[0]?.id)
  const previewSection = sections.find((s) => s.id === previewSectionId) || sections[0]
  const visibleFields = (previewSection?.fields || []).filter((f) => !f.hidden)

  return (
    <Box sx={{ display: 'flex', flex: 1, overflow: 'hidden', backgroundColor: '#f5f6f8' }}>
      {/* Preview nav */}
      <Box sx={{ width: 240, flexShrink: 0, backgroundColor: '#fff', borderRight: '1px solid #e0e0e0', overflowY: 'auto', pt: 2 }}>
        <Typography variant="caption" sx={{ px: 2, fontWeight: 600, color: 'text.secondary', textTransform: 'uppercase', fontSize: 11, letterSpacing: 0.5, display: 'block', mb: 1 }}>
          Sections
        </Typography>
        {sections.map((s) => (
          <Box
            key={s.id}
            onClick={() => setPreviewSectionId(s.id)}
            sx={{
              px: 2, py: 1.25, cursor: 'pointer', fontSize: 14, fontWeight: s.id === previewSectionId ? 600 : 400,
              color: s.id === previewSectionId ? BRAND_BLUE : 'text.primary',
              backgroundColor: s.id === previewSectionId ? 'rgba(25,118,210,0.06)' : 'transparent',
              borderLeft: s.id === previewSectionId ? `3px solid ${BRAND_BLUE}` : '3px solid transparent',
              '&:hover': { backgroundColor: 'rgba(0,0,0,0.03)' },
              transition: 'all 0.12s',
            }}
          >
            <Typography sx={{ fontSize: 14, fontWeight: 'inherit', color: 'inherit' }}>{s.label}</Typography>
            <Typography variant="caption" sx={{ color: 'text.disabled', fontSize: 11 }}>
              {s.fields.filter((f) => !f.hidden).length} field{s.fields.filter((f) => !f.hidden).length !== 1 ? 's' : ''}
            </Typography>
          </Box>
        ))}
      </Box>

      {/* Preview canvas */}
      <Box sx={{ flex: 1, overflowY: 'auto', p: 4 }}>
        <Box sx={{ maxWidth: 560 }}>
          {/* Profile photo for essential info */}
          {previewSection?.locked && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
              <Avatar sx={{ width: 72, height: 72, backgroundColor: '#e0e0e0' }} />
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>Athlete name</Typography>
                <Typography variant="body2" color="text.secondary">Profile preview</Typography>
              </Box>
            </Box>
          )}

          <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5, fontSize: 18 }}>{previewSection?.label}</Typography>
          <Divider sx={{ mb: 3 }} />

          {visibleFields.length === 0 ? (
            <Typography color="text.secondary" sx={{ py: 4, textAlign: 'center' }}>No visible fields in this section.</Typography>
          ) : (
            visibleFields.map((field) => <PreviewField key={field.id} field={field} />)
          )}
        </Box>
      </Box>
    </Box>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function ProfileBuilder() {
  const navigate = useNavigate()

  const { sections, setSections } = useProfileBuilder()
  const [activeSectionId, setActiveSectionId] = useState(sections[0]?.id)
  const [tabValue, setTabValue] = useState(0)
  const [expandedFields, setExpandedFields] = useState({})
  const [sectionMenu, setSectionMenu] = useState({ anchor: null, sectionId: null })
  const [addMenuAnchor, setAddMenuAnchor] = useState(null)
  const [activeFieldId, setActiveFieldId] = useState(null)
  const [activeSectionDragId, setActiveSectionDragId] = useState(null)

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }))
  const activeSection = sections.find((s) => s.id === activeSectionId) || sections[0]

  // ── Section mutations ────────────────────────────────────────────────────────

  function addSection() {
    const s = { id: uid(), label: 'New section', locked: false, collapsed: false, fields: [] }
    setSections((prev) => [...prev, s])
    setActiveSectionId(s.id)
    setAddMenuAnchor(null)
  }

  function renameSection(sectionId, newLabel) {
    setSections((prev) => prev.map((s) => s.id === sectionId ? { ...s, label: newLabel } : s))
  }

  function deleteSection(sectionId) {
    setSections((prev) => {
      const next = prev.filter((s) => s.id !== sectionId)
      if (activeSectionId === sectionId) setActiveSectionId(next[0]?.id)
      return next
    })
    setSectionMenu({ anchor: null, sectionId: null })
  }

  function toggleCollapse(sectionId) {
    setSections((prev) => prev.map((s) => s.id === sectionId ? { ...s, collapsed: !s.collapsed } : s))
  }

  // ── Field mutations ──────────────────────────────────────────────────────────

  function addField(sectionId) {
    const f = makeField({ tier: 3 })
    setSections((prev) => prev.map((s) => s.id === sectionId ? { ...s, fields: [...s.fields, f] } : s))
    setExpandedFields((prev) => ({ ...prev, [sectionId]: f.id }))
  }

  function updateField(sectionId, updated) {
    setSections((prev) => prev.map((s) =>
      s.id === sectionId ? { ...s, fields: s.fields.map((f) => f.id === updated.id ? updated : f) } : s
    ))
  }

  function deleteField(sectionId, fieldId) {
    setSections((prev) => prev.map((s) => s.id === sectionId ? { ...s, fields: s.fields.filter((f) => f.id !== fieldId) } : s))
    setExpandedFields((prev) => ({ ...prev, [sectionId]: prev[sectionId] === fieldId ? null : prev[sectionId] }))
  }

  function toggleFieldVisibility(sectionId, fieldId) {
    setSections((prev) => prev.map((s) =>
      s.id === sectionId ? { ...s, fields: s.fields.map((f) => f.id === fieldId ? { ...f, hidden: !f.hidden } : f) } : s
    ))
  }

  function toggleFieldExpand(sectionId, fieldId) {
    setExpandedFields((prev) => ({ ...prev, [sectionId]: prev[sectionId] === fieldId ? null : fieldId }))
  }

  // ── DnD ─────────────────────────────────────────────────────────────────────

  function handleDragStart({ active }) {
    if (sections.some((s) => s.id === active.id)) setActiveSectionDragId(active.id)
    else setActiveFieldId(active.id)
  }

  function handleDragEnd({ active, over }) {
    setActiveFieldId(null)
    setActiveSectionDragId(null)
    if (!over || active.id === over.id) return

    if (sections.some((s) => s.id === active.id)) {
      setSections((prev) => {
        const oi = prev.findIndex((s) => s.id === active.id)
        const ni = prev.findIndex((s) => s.id === over.id)
        if (prev[oi].locked || prev[ni].locked) return prev
        const moved = arrayMove(prev, oi, ni)
        const li = moved.findIndex((s) => s.locked)
        if (li > 0) { const [l] = moved.splice(li, 1); moved.unshift(l) }
        return moved
      })
      return
    }

    setSections((prev) => prev.map((section) => {
      const oi = section.fields.findIndex((f) => f.id === active.id)
      if (oi === -1) return section
      const ni = section.fields.findIndex((f) => f.id === over.id)
      if (ni === -1) return section
      return { ...section, fields: arrayMove(section.fields, oi, ni) }
    }))
  }

  const draggableSectionIds = sections.filter((s) => !s.locked).map((s) => s.id)

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden', backgroundColor: '#fff' }}>

      {/* ── Page header ── */}
      <Box sx={{
        backgroundColor: '#fff', borderBottom: '1px solid #e0e0e0',
        px: 3, py: 1.5, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0,
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <IconButton size="small" onClick={() => navigate('/manage-athletes')} sx={{ border: '1px solid #e0e0e0' }}>
            <ArrowBackIcon sx={{ fontSize: 18 }} />
          </IconButton>
          <Box>
            <Typography
              variant="body2"
              onClick={() => navigate('/manage-athletes')}
              sx={{ color: 'text.secondary', fontSize: 12, cursor: 'pointer', lineHeight: 1, mb: 0.25, '&:hover': { color: 'text.primary' } }}
            >
              Back to manage athletes
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 700, fontSize: 20, lineHeight: 1.2 }}>Athlete profile builder</Typography>
          </Box>
        </Box>
        <Button variant="contained" size="small" disableElevation startIcon={<CheckIcon />}
          sx={{ backgroundColor: NAVY, color: '#fff', textTransform: 'none', fontWeight: 600, '&:hover': { backgroundColor: '#2a3045' } }}>
          Save
        </Button>
      </Box>

      {/* ── Tabs ── */}
      <Box sx={{ backgroundColor: '#fff', borderBottom: '1px solid #e0e0e0', px: 3, flexShrink: 0 }}>
        <Tabs value={tabValue} onChange={(_, v) => setTabValue(v)}
          TabIndicatorProps={{ style: { backgroundColor: NAVY } }}
          sx={{
            minHeight: 44,
            '& .MuiTab-root': { textTransform: 'none', fontWeight: 500, fontSize: 15, minHeight: 44, color: 'text.secondary', mr: 1 },
            '& .MuiTab-root.Mui-selected': { color: NAVY, fontWeight: 600 },
          }}>
          <Tab label="Build" />
          <Tab label="Preview" />
        </Tabs>
      </Box>

      {/* ── Build tab ── */}
      {tabValue === 0 && (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
          <Box sx={{ display: 'flex', flex: 1, overflow: 'hidden' }}>

            {/* ── SIDEBAR (light) ── */}
            <Box sx={{ width: 280, flexShrink: 0, backgroundColor: '#f5f5f5', borderRight: '1px solid #e0e0e0', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
              {/* Sidebar header */}
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 2, py: 1.5, borderBottom: '1px solid #e0e0e0', flexShrink: 0 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 600, fontSize: 14, color: 'text.primary' }}>Menu</Typography>
                <Button size="small" endIcon={<KeyboardArrowDownIcon />} onClick={(e) => setAddMenuAnchor(e.currentTarget)}
                  sx={{ textTransform: 'none', fontSize: 13, color: 'text.primary', backgroundColor: '#e8e8e8', '&:hover': { backgroundColor: '#ddd' } }}>
                  Add
                </Button>
                <Menu anchorEl={addMenuAnchor} open={Boolean(addMenuAnchor)} onClose={() => setAddMenuAnchor(null)}>
                  <MenuItem onClick={addSection} sx={{ fontSize: 14 }}>Add section</MenuItem>
                </Menu>
              </Box>

              {/* Section list */}
              <Box sx={{ flex: 1, overflowY: 'auto' }}>
                {sections.filter((s) => s.locked).map((section) => (
                  <SectionRow key={section.id} section={section} isActive={activeSectionId === section.id}
                    onClick={() => setActiveSectionId(section.id)} onMenuOpen={() => {}}
                    onToggleCollapse={toggleCollapse} dragHandleProps={{}} />
                ))}
                <SortableContext items={draggableSectionIds} strategy={verticalListSortingStrategy}>
                  {sections.filter((s) => !s.locked).map((section) => (
                    <SortableSectionRow key={section.id} section={section} isActive={activeSectionId === section.id}
                      onClick={() => setActiveSectionId(section.id)}
                      onMenuOpen={(e, id) => setSectionMenu({ anchor: e.currentTarget, sectionId: id })}
                      onToggleCollapse={toggleCollapse} />
                  ))}
                </SortableContext>
              </Box>
            </Box>

            {/* ── CANVAS ── */}
            <Box sx={{ flex: 1, overflowY: 'auto', p: 3, backgroundColor: '#f9f9f9' }}>
              <Box sx={{ maxWidth: 680, backgroundColor: '#fff', borderRadius: 1, border: '1px solid #e0e0e0', p: 3 }}>

                {/* Section title */}
                <InlineEditTitle value={activeSection.label} onChange={(v) => renameSection(activeSection.id, v)}
                  disabled={activeSection.locked} variant="h6" />

                {/* Sub-section */}
                <Box sx={{ mt: 0.5, mb: 1 }}>
                  <InlineEditTitle value={`${activeSection.label} – sub-section`} onChange={() => {}}
                    disabled={true} variant="subtitle2" />
                </Box>
                <Divider sx={{ mb: 2.5 }} />

                {/* Profile photo — Essential Info only */}
                {activeSection.locked && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                    <Avatar sx={{ width: 80, height: 80, backgroundColor: '#e0e0e0' }} />
                    <Button size="small" variant="outlined" startIcon={<PhotoCameraOutlinedIcon />}
                      sx={{ textTransform: 'none', fontSize: 12, borderColor: '#ccc', color: 'text.secondary' }} disabled>
                      Upload photo
                    </Button>
                  </Box>
                )}

                {/* Fields */}
                <SortableContext items={activeSection.fields.filter((f) => f.tier !== 1).map((f) => f.id)} strategy={verticalListSortingStrategy}>
                  {activeSection.fields.length === 0 && (
                    <Box sx={{ py: 5, textAlign: 'center', border: '2px dashed #e0e0e0', borderRadius: 1, mb: 2 }}>
                      <Typography variant="body2" color="text.secondary">No fields yet. Click "Add field" below to get started.</Typography>
                    </Box>
                  )}
                  {activeSection.fields.map((field) => (
                    <SortableFieldCard key={field.id} field={field} sectionId={activeSection.id}
                      isExpanded={expandedFields[activeSection.id] === field.id}
                      onToggle={() => toggleFieldExpand(activeSection.id, field.id)}
                      onUpdate={(u) => updateField(activeSection.id, u)}
                      onDelete={() => deleteField(activeSection.id, field.id)}
                      onToggleVisibility={() => toggleFieldVisibility(activeSection.id, field.id)} />
                  ))}
                </SortableContext>

                {!activeSection.locked && (
                  <Box sx={{ display: 'flex', gap: 1, mt: 2, pt: 2, borderTop: '1px solid #f0f0f0', flexWrap: 'wrap' }}>
                    {[
                      { label: 'Add field', onClick: () => addField(activeSection.id) },
                      { label: 'Add paragraph', onClick: () => {} },
                      { label: 'Add group', onClick: () => {} },
                    ].map(({ label, onClick }) => (
                      <Button key={label} size="small" startIcon={<AddIcon />} onClick={onClick}
                        sx={{ textTransform: 'none', fontSize: 13, color: 'text.secondary', '&:hover': { color: BRAND_BLUE, backgroundColor: 'rgba(25,118,210,0.04)' } }}>
                        {label}
                      </Button>
                    ))}
                  </Box>
                )}
              </Box>
            </Box>
          </Box>

          <DragOverlay>
            {activeFieldId && (
              <Box sx={{ backgroundColor: '#fff', border: '1px solid #bdbdbd', borderRadius: 1, px: 2, py: 1, boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}>
                <Typography variant="body2">{sections.flatMap((s) => s.fields).find((f) => f.id === activeFieldId)?.label}</Typography>
              </Box>
            )}
            {activeSectionDragId && (
              <Box sx={{ backgroundColor: '#f0f0f0', borderRadius: 1, px: 2, py: 1, border: '1px solid #ccc' }}>
                <Typography variant="body2">{sections.find((s) => s.id === activeSectionDragId)?.label}</Typography>
              </Box>
            )}
          </DragOverlay>
        </DndContext>
      )}

      {/* ── Preview tab ── */}
      {tabValue === 1 && <PreviewPanel sections={sections} />}

      {/* Section context menu */}
      <Menu anchorEl={sectionMenu.anchor} open={Boolean(sectionMenu.anchor)} onClose={() => setSectionMenu({ anchor: null, sectionId: null })}>
        <MenuItem onClick={() => setSectionMenu({ anchor: null, sectionId: null })} sx={{ fontSize: 14 }}>Rename</MenuItem>
        <Divider />
        <MenuItem onClick={() => deleteSection(sectionMenu.sectionId)} sx={{ fontSize: 14, color: 'error.main' }}>Delete</MenuItem>
      </Menu>
    </Box>
  )
}
