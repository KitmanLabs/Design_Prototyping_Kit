import React from 'react'
import {
  Box,
  Typography,
  Button as MuiButton,
  Tabs,
  Tab,
  Divider,
  IconButton,
  Tooltip,
  Switch,
  TextField,
  MenuItem,
  Menu,
  Collapse,
  Chip,
  Paper,
  FormControlLabel,
  FormGroup,
  FormControl,
  Select,
  InputLabel,
  Avatar,
} from '@mui/material'
import {
  ArrowBackOutlined,
  EditOutlined,
  LockOutlined,
  DragIndicatorOutlined,
  MoreVertOutlined,
  ExpandMoreOutlined,
  ExpandLessOutlined,
  AddOutlined,
  VisibilityOutlined,
  VisibilityOffOutlined,
  DeleteOutlined,
  PhotoCameraOutlined,
  KeyboardArrowDownOutlined,
} from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'

// ─── Constants ────────────────────────────────────────────────────────────────

const SIDEBAR_BG = '#1a2035'
const SIDEBAR_ITEM_HOVER = 'rgba(255,255,255,0.07)'
const SIDEBAR_ITEM_ACTIVE = 'rgba(255,255,255,0.12)'
const BRAND_BLUE = '#1976d2'
const BASE_SECTION_ID = 'base-section'

const FIELD_TYPES = [
  { value: 'text', label: 'Text' },
  { value: 'number', label: 'Number' },
  { value: 'date', label: 'Date' },
  { value: 'select', label: 'Dropdown / Select' },
]

// Tier 1 — locked base fields
const BASE_FIELDS = [
  { id: 'base-first-name', label: 'First name', type: 'text', tier: 1 },
  { id: 'base-last-name', label: 'Last name', type: 'text', tier: 1 },
  { id: 'base-position', label: 'Position', type: 'text', tier: 1 },
  { id: 'base-squad', label: 'Squad', type: 'text', tier: 1 },
  { id: 'base-email', label: 'Email address', type: 'text', tier: 1 },
  { id: 'base-username', label: 'Username', type: 'text', tier: 1 },
  { id: 'base-dob', label: 'Date of birth', type: 'date', tier: 1 },
  { id: 'base-mobile', label: 'Mobile number', type: 'text', tier: 1 },
  { id: 'base-language', label: 'Language', type: 'select', tier: 1 },
]

function makeId() {
  return `field-${Math.random().toString(36).slice(2, 9)}`
}

function makeSectionId() {
  return `section-${Math.random().toString(36).slice(2, 9)}`
}

function makeField(overrides = {}) {
  return {
    id: makeId(),
    label: 'Untitled field',
    type: 'text',
    required: false,
    hidden: false,
    description: '',
    options: [],
    optionStyle: 'dropdown',
    defaultValue: '',
    tier: 3,
    ...overrides,
  }
}

// Tier 2 — pre-configured optional fields
const TIER2_FIELDS = [
  makeField({ id: makeId(), label: 'Height (cm)', type: 'number', tier: 2 }),
  makeField({ id: makeId(), label: 'Country', type: 'select', tier: 2 }),
  makeField({ id: makeId(), label: 'Display name', type: 'text', tier: 2 }),
  makeField({ id: makeId(), label: 'Shortened name', type: 'text', tier: 2 }),
  makeField({ id: makeId(), label: 'Squad number', type: 'number', tier: 2 }),
  makeField({ id: makeId(), label: 'Association player ID', type: 'text', tier: 2 }),
  makeField({ id: makeId(), label: 'External ID', type: 'text', tier: 2 }),
  makeField({ id: makeId(), label: 'CRM ID', type: 'text', tier: 2 }),
  makeField({ id: makeId(), label: 'Nationality', type: 'select', tier: 2 }),
]

const INITIAL_SECTIONS = [
  {
    id: BASE_SECTION_ID,
    title: 'Essential info',
    tier: 1,
    collapsed: false,
    subsections: [
      {
        id: 'base-sub-1',
        title: 'Essential info',
        fields: BASE_FIELDS,
      },
    ],
  },
  {
    id: makeSectionId(),
    title: 'Additional info',
    tier: 2,
    collapsed: false,
    subsections: [
      {
        id: 'additional-sub-1',
        title: 'Additional info',
        fields: TIER2_FIELDS,
      },
    ],
  },
]

// ─── Helpers ──────────────────────────────────────────────────────────────────

function a11yProps(index) {
  return { id: `apb-tab-${index}`, 'aria-controls': `apb-tabpanel-${index}` }
}

function TabPanel({ children, value, index }) {
  return (
    <div role="tabpanel" hidden={value !== index} id={`apb-tabpanel-${index}`}>
      {value === index && children}
    </div>
  )
}

function countFields(section) {
  return section.subsections.reduce((acc, sub) => acc + sub.fields.length, 0)
}

// ─── InlineEdit ───────────────────────────────────────────────────────────────

function InlineEdit({ value, onChange, disabled, typographySx }) {
  const [editing, setEditing] = React.useState(false)
  const [draft, setDraft] = React.useState(value)
  const inputRef = React.useRef(null)

  React.useEffect(() => {
    if (editing && inputRef.current) inputRef.current.focus()
  }, [editing])

  function commit() {
    setEditing(false)
    const trimmed = draft.trim()
    if (trimmed && trimmed !== value) onChange(trimmed)
    else setDraft(value)
  }

  if (editing) {
    return (
      <TextField
        inputRef={inputRef}
        variant="filled"
        size="small"
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={commit}
        onKeyDown={(e) => {
          if (e.key === 'Enter') commit()
          if (e.key === 'Escape') { setEditing(false); setDraft(value) }
        }}
        sx={{ '& .MuiInput-root': { fontSize: 'inherit', fontWeight: 'inherit' } }}
        inputProps={{ style: { padding: '2px 4px' } }}
      />
    )
  }

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
      <Typography sx={{ ...typographySx }}>{value}</Typography>
      {!disabled && (
        <IconButton
          size="small"
          onClick={() => { setDraft(value); setEditing(true) }}
          sx={{ p: 0.25, color: 'var(--color-text-secondary)', '&:hover': { color: 'var(--color-primary)' } }}
        >
          <EditOutlined sx={{ fontSize: 14 }} />
        </IconButton>
      )}
    </Box>
  )
}

// ─── FieldCard ────────────────────────────────────────────────────────────────

function FieldCard({
  field,
  isExpanded,
  onToggleExpand,
  onUpdate,
  onRemove,
  dragHandleProps,
  autoFocusLabel,
}) {
  const [labelDraft, setLabelDraft] = React.useState(field.label)
  const labelInputRef = React.useRef(null)

  React.useEffect(() => {
    setLabelDraft(field.label)
  }, [field.label])

  React.useEffect(() => {
    if (isExpanded && autoFocusLabel && labelInputRef.current) {
      labelInputRef.current.focus()
      labelInputRef.current.select()
    }
  }, [isExpanded, autoFocusLabel])

  function commitLabel() {
    const trimmed = labelDraft.trim()
    if (trimmed && trimmed !== field.label) onUpdate({ ...field, label: trimmed })
    else setLabelDraft(field.label)
  }

  function addOption() {
    onUpdate({ ...field, options: [...field.options, { id: makeId(), label: 'Option ' + (field.options.length + 1) }] })
  }

  function updateOption(optId, val) {
    onUpdate({ ...field, options: field.options.map((o) => o.id === optId ? { ...o, label: val } : o) })
  }

  function removeOption(optId) {
    onUpdate({ ...field, options: field.options.filter((o) => o.id !== optId) })
  }

  // Tier 1 — locked, non-expandable
  if (field.tier === 1) {
    return (
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
          py: 1,
          px: 1.5,
          borderBottom: '1px solid var(--color-border-secondary)',
          backgroundColor: '#fff',
        }}
      >
        <LockOutlined sx={{ fontSize: 15, color: 'var(--color-text-disabled)', flexShrink: 0 }} />
        <Typography variant="body2" sx={{ flex: 1, color: 'var(--color-text-primary)' }}>
          {field.label}
        </Typography>
        <Chip
          label={FIELD_TYPES.find((t) => t.value === field.type)?.label || field.type}
          size="small"
          variant="outlined"
          sx={{ fontSize: 11, height: 20, borderColor: 'var(--color-border-secondary)', color: 'var(--color-text-secondary)' }}
        />
      </Box>
    )
  }

  const isHidden = field.hidden

  return (
    <Box
      sx={{
        border: '1px solid',
        borderColor: isExpanded ? BRAND_BLUE : 'var(--color-border-secondary)',
        borderRadius: 1,
        mb: 1,
        opacity: isHidden ? 0.45 : 1,
        overflow: 'hidden',
        boxShadow: isExpanded ? `inset 3px 0 0 ${BRAND_BLUE}` : 'none',
        backgroundColor: '#fff',
        transition: 'border-color 0.15s, box-shadow 0.15s',
        '&:hover': !isExpanded ? { borderColor: 'var(--color-border-primary)', boxShadow: '0 1px 4px rgba(0,0,0,0.08)' } : {},
        cursor: 'default',
      }}
    >
      {/* Card header */}
      <Box
        onClick={onToggleExpand}
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          px: 1.5,
          py: 1,
          cursor: 'pointer',
          backgroundColor: isExpanded ? 'rgba(25,118,210,0.04)' : 'transparent',
        }}
      >
        {/* Drag handle */}
        <Box
          {...dragHandleProps}
          onClick={(e) => e.stopPropagation()}
          sx={{ display: 'flex', alignItems: 'center', cursor: 'grab', color: 'var(--color-text-disabled)', flexShrink: 0, '&:active': { cursor: 'grabbing' } }}
        >
          <DragIndicatorOutlined sx={{ fontSize: 18 }} />
        </Box>

        {/* Label */}
        {isExpanded ? (
          <TextField
            inputRef={labelInputRef}
            variant="filled"
            size="small"
            value={labelDraft}
            onChange={(e) => setLabelDraft(e.target.value)}
            onBlur={commitLabel}
            onKeyDown={(e) => { if (e.key === 'Enter') commitLabel() }}
            onClick={(e) => e.stopPropagation()}
            sx={{ flex: 1, '& .MuiFilledInput-root': { fontSize: 13, py: 0.5, fontWeight: 500 } }}
            inputProps={{ style: { padding: '6px 8px' } }}
          />
        ) : (
          <Typography
            variant="body2"
            sx={{ flex: 1, fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: isHidden ? 'var(--color-text-secondary)' : 'var(--color-text-primary)' }}
          >
            {field.label}
          </Typography>
        )}

        {isHidden && (
          <Chip label="Hidden" size="small" sx={{ height: 18, fontSize: 11, backgroundColor: 'var(--color-border-secondary)', color: 'var(--color-text-secondary)', ml: 0.5 }} />
        )}

        {/* Mandatory toggle */}
        {!isHidden && (
          <Box onClick={(e) => e.stopPropagation()} sx={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
            <FormControlLabel
              control={
                <Switch
                  checked={field.required}
                  onChange={(e) => onUpdate({ ...field, required: e.target.checked })}
                  size="small"
                  sx={{
                    '& .MuiSwitch-track': { backgroundColor: 'var(--color-border-primary)', opacity: 1 },
                    '& .MuiSwitch-switchBase.Mui-checked': { color: '#fff' },
                    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { backgroundColor: 'var(--color-primary)', opacity: 1 },
                    '& .MuiSwitch-switchBase:hover': { backgroundColor: 'transparent' },
                  }}
                />
              }
              label={<Typography sx={{ fontSize: 11, color: 'var(--color-text-secondary)', userSelect: 'none' }}>Mandatory</Typography>}
              sx={{ mx: 0, mr: 0.5 }}
            />
          </Box>
        )}

        {/* Eye toggle (Tier 2) */}
        {field.tier === 2 && (
          <Tooltip title={isHidden ? 'Show field' : 'Hide field'}>
            <IconButton
              size="small"
              onClick={(e) => { e.stopPropagation(); onUpdate({ ...field, hidden: !field.hidden }) }}
              sx={{ color: isHidden ? 'var(--color-text-disabled)' : 'var(--color-text-secondary)', p: 0.5 }}
            >
              {isHidden ? <VisibilityOffOutlined sx={{ fontSize: 16 }} /> : <VisibilityOutlined sx={{ fontSize: 16 }} />}
            </IconButton>
          </Tooltip>
        )}

        {/* Delete (Tier 3) */}
        {field.tier === 3 && (
          <Tooltip title="Delete field">
            <IconButton
              size="small"
              onClick={(e) => { e.stopPropagation(); onRemove() }}
              sx={{ color: 'var(--color-text-secondary)', p: 0.5, '&:hover': { color: 'var(--color-error)' } }}
            >
              <DeleteOutlined sx={{ fontSize: 16 }} />
            </IconButton>
          </Tooltip>
        )}
      </Box>

      {/* Expanded body */}
      <Collapse in={isExpanded}>
        <Box
          sx={{ px: 2, pb: 2, pt: 1, backgroundColor: 'var(--color-surface-secondary, #fafafa)', borderTop: '1px solid var(--color-border-secondary)' }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Field type */}
          <FormControl variant="filled" size="small" sx={{ mb: 1.5, minWidth: 200 }}>
            <InputLabel sx={{ fontSize: 12 }}>Field type</InputLabel>
            <Select
              value={field.type}
              onChange={(e) => onUpdate({ ...field, type: e.target.value })}
              sx={{ fontSize: 13 }}
            >
              {FIELD_TYPES.map((t) => (
                <MenuItem key={t.value} value={t.value} sx={{ fontSize: 13 }}>{t.label}</MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Description */}
          <TextField
            variant="filled"
            size="small"
            fullWidth
            placeholder="Add a description..."
            value={field.description}
            onChange={(e) => onUpdate({ ...field, description: e.target.value })}
            sx={{ mb: 1.5, '& .MuiFilledInput-root': { fontSize: 13 } }}
          />

          {/* Options editor for select type */}
          {field.type === 'select' && (
            <Box>
              <Typography variant="caption" sx={{ fontWeight: 600, color: 'var(--color-text-secondary)', display: 'block', mb: 1 }}>
                Options
              </Typography>
              {field.options.map((opt) => (
                <Box key={opt.id} sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.75 }}>
                  <TextField
                    variant="filled"
                    size="small"
                    value={opt.label}
                    onChange={(e) => updateOption(opt.id, e.target.value)}
                    sx={{ flex: 1, '& .MuiFilledInput-root': { fontSize: 13 } }}
                    inputProps={{ style: { padding: '6px 10px' } }}
                  />
                  <IconButton size="small" onClick={() => removeOption(opt.id)} sx={{ color: 'var(--color-text-secondary)', '&:hover': { color: 'var(--color-error)' } }}>
                    <DeleteOutlined sx={{ fontSize: 15 }} />
                  </IconButton>
                </Box>
              ))}
              <MuiButton
                variant="outlined"
                size="small"
                startIcon={<AddOutlined />}
                onClick={addOption}
                sx={{ textTransform: 'none', fontSize: 12, borderColor: 'var(--color-border-primary)', color: 'var(--color-text-secondary)', mt: 0.5, mb: 1.5 }}
              >
                Add option
              </MuiButton>

              {/* Style selector */}
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <FormControl variant="filled" size="small" sx={{ minWidth: 140 }}>
                  <InputLabel sx={{ fontSize: 12 }}>Display style</InputLabel>
                  <Select
                    value={field.optionStyle || 'dropdown'}
                    onChange={(e) => onUpdate({ ...field, optionStyle: e.target.value })}
                    sx={{ fontSize: 13 }}
                  >
                    <MenuItem value="dropdown" sx={{ fontSize: 13 }}>Dropdown</MenuItem>
                    <MenuItem value="radio" sx={{ fontSize: 13 }}>Radio</MenuItem>
                  </Select>
                </FormControl>

                <FormControl variant="filled" size="small" sx={{ minWidth: 140 }}>
                  <InputLabel sx={{ fontSize: 12 }}>Default value</InputLabel>
                  <Select
                    value={field.defaultValue || ''}
                    onChange={(e) => onUpdate({ ...field, defaultValue: e.target.value })}
                    sx={{ fontSize: 13 }}
                  >
                    <MenuItem value="" sx={{ fontSize: 13 }}><em>None</em></MenuItem>
                    {field.options.map((opt) => (
                      <MenuItem key={opt.id} value={opt.id} sx={{ fontSize: 13 }}>{opt.label}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
            </Box>
          )}
        </Box>
      </Collapse>
    </Box>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function AthleteProfileBuilder() {
  const navigate = useNavigate()
  const [tabValue, setTabValue] = React.useState(0)
  const [sections, setSections] = React.useState(INITIAL_SECTIONS)
  const [selectedSectionId, setSelectedSectionId] = React.useState(INITIAL_SECTIONS[0].id)
  const [sectionMenuAnchor, setSectionMenuAnchor] = React.useState(null)
  const [sectionMenuTarget, setSectionMenuTarget] = React.useState(null)
  const [addMenuAnchor, setAddMenuAnchor] = React.useState(null)
  const [renamingSectionId, setRenamingSectionId] = React.useState(null)
  // { sectionId, subsectionId, fieldId } — one open per section/subsection
  const [expandedFields, setExpandedFields] = React.useState({})
  // fieldId that should get label auto-focus when newly added
  const [autoFocusFieldId, setAutoFocusFieldId] = React.useState(null)

  // Drag refs for sections and fields
  const dragSectionRef = React.useRef(null)
  const dragOverSectionRef = React.useRef(null)
  const dragFieldRef = React.useRef(null)
  const dragOverFieldRef = React.useRef(null)

  const selectedSection = sections.find((s) => s.id === selectedSectionId) || sections[0]

  // ── Expanded field helpers ────────────────────────────────────────────────

  function getExpandedKey(subsectionId) {
    return expandedFields[subsectionId] || null
  }

  function toggleFieldExpand(subsectionId, fieldId) {
    setExpandedFields((prev) => ({
      ...prev,
      [subsectionId]: prev[subsectionId] === fieldId ? null : fieldId,
    }))
  }

  // ── Section mutations ─────────────────────────────────────────────────────

  function addSection() {
    const newSection = {
      id: makeSectionId(),
      title: `New section`,
      tier: 3,
      collapsed: false,
      subsections: [
        {
          id: `${makeSectionId()}-sub`,
          title: 'New section',
          fields: [],
        },
      ],
    }
    setSections((prev) => [...prev, newSection])
    setSelectedSectionId(newSection.id)
    setAddMenuAnchor(null)
    // Trigger rename inline
    setTimeout(() => setRenamingSectionId(newSection.id), 50)
  }

  function renameSection(sectionId, newTitle) {
    setSections((prev) =>
      prev.map((s) =>
        s.id === sectionId
          ? { ...s, title: newTitle, subsections: s.subsections.map((sub, i) => i === 0 ? { ...sub, title: newTitle } : sub) }
          : s
      )
    )
  }

  function toggleCollapse(sectionId) {
    setSections((prev) =>
      prev.map((s) => (s.id === sectionId ? { ...s, collapsed: !s.collapsed } : s))
    )
  }

  function deleteSection(sectionId) {
    setSections((prev) => {
      const next = prev.filter((s) => s.id !== sectionId)
      if (selectedSectionId === sectionId) setSelectedSectionId(next[0]?.id)
      return next
    })
    setSectionMenuAnchor(null)
  }

  function duplicateSection(sectionId) {
    setSections((prev) => {
      const idx = prev.findIndex((s) => s.id === sectionId)
      const orig = prev[idx]
      const copy = {
        ...JSON.parse(JSON.stringify(orig)),
        id: makeSectionId(),
        title: `${orig.title} (copy)`,
        tier: Math.max(orig.tier, 3),
        subsections: orig.subsections.map((sub) => ({
          ...sub,
          id: makeSectionId(),
          fields: sub.fields.map((f) => ({ ...f, id: makeId(), tier: 3 })),
        })),
      }
      const next = [...prev]
      next.splice(idx + 1, 0, copy)
      return next
    })
    setSectionMenuAnchor(null)
  }

  // ── Field mutations ───────────────────────────────────────────────────────

  function addField(sectionId, subsectionId) {
    const newField = makeField({ tier: 3 })
    setSections((prev) =>
      prev.map((s) =>
        s.id === sectionId
          ? {
              ...s,
              subsections: s.subsections.map((sub) =>
                sub.id === subsectionId ? { ...sub, fields: [...sub.fields, newField] } : sub
              ),
            }
          : s
      )
    )
    setExpandedFields((prev) => ({ ...prev, [subsectionId]: newField.id }))
    setAutoFocusFieldId(newField.id)
  }

  function updateField(sectionId, subsectionId, updatedField) {
    setSections((prev) =>
      prev.map((s) =>
        s.id === sectionId
          ? {
              ...s,
              subsections: s.subsections.map((sub) =>
                sub.id === subsectionId
                  ? { ...sub, fields: sub.fields.map((f) => (f.id === updatedField.id ? updatedField : f)) }
                  : sub
              ),
            }
          : s
      )
    )
  }

  function removeField(sectionId, subsectionId, fieldId) {
    setSections((prev) =>
      prev.map((s) =>
        s.id === sectionId
          ? {
              ...s,
              subsections: s.subsections.map((sub) =>
                sub.id === subsectionId ? { ...sub, fields: sub.fields.filter((f) => f.id !== fieldId) } : sub
              ),
            }
          : s
      )
    )
  }

  function renameSubsection(sectionId, subsectionId, newTitle) {
    setSections((prev) =>
      prev.map((s) =>
        s.id === sectionId
          ? { ...s, subsections: s.subsections.map((sub) => sub.id === subsectionId ? { ...sub, title: newTitle } : sub) }
          : s
      )
    )
  }

  // ── Section drag-and-drop ─────────────────────────────────────────────────

  function handleSectionDragStart(e, sectionId) {
    const s = sections.find((sec) => sec.id === sectionId)
    if (s?.tier === 1) { e.preventDefault(); return }
    dragSectionRef.current = sectionId
    e.dataTransfer.effectAllowed = 'move'
  }

  function handleSectionDragOver(e, sectionId) {
    e.preventDefault()
    dragOverSectionRef.current = sectionId
  }

  function handleSectionDrop() {
    const from = dragSectionRef.current
    const to = dragOverSectionRef.current
    if (!from || !to || from === to) return
    setSections((prev) => {
      const next = [...prev]
      const fromIdx = next.findIndex((s) => s.id === from)
      const toIdx = next.findIndex((s) => s.id === to)
      if (next[fromIdx]?.tier === 1 || next[toIdx]?.tier === 1) return prev
      const [moved] = next.splice(fromIdx, 1)
      next.splice(toIdx, 0, moved)
      const baseIdx = next.findIndex((s) => s.tier === 1)
      if (baseIdx > 0) { const [base] = next.splice(baseIdx, 1); next.unshift(base) }
      return next
    })
    dragSectionRef.current = null
    dragOverSectionRef.current = null
  }

  // ── Field drag-and-drop ───────────────────────────────────────────────────

  function handleFieldDragStart(e, fieldId, sectionId, subsectionId) {
    dragFieldRef.current = { fieldId, sectionId, subsectionId }
    e.dataTransfer.effectAllowed = 'move'
  }

  function handleFieldDragOver(e, fieldId, sectionId, subsectionId) {
    e.preventDefault()
    dragOverFieldRef.current = { fieldId, sectionId, subsectionId }
  }

  function handleFieldDrop(sectionId, subsectionId) {
    const from = dragFieldRef.current
    const to = dragOverFieldRef.current
    if (!from || !to || from.fieldId === to.fieldId) return
    if (from.sectionId !== sectionId || from.subsectionId !== subsectionId) return
    setSections((prev) =>
      prev.map((s) =>
        s.id === sectionId
          ? {
              ...s,
              subsections: s.subsections.map((sub) => {
                if (sub.id !== subsectionId) return sub
                const fields = [...sub.fields]
                const fromIdx = fields.findIndex((f) => f.id === from.fieldId)
                const toIdx = fields.findIndex((f) => f.id === to.fieldId)
                if (fromIdx < 0 || toIdx < 0) return sub
                const [moved] = fields.splice(fromIdx, 1)
                fields.splice(toIdx, 0, moved)
                return { ...sub, fields }
              }),
            }
          : s
      )
    )
    dragFieldRef.current = null
    dragOverFieldRef.current = null
  }

  // ── Preview render ────────────────────────────────────────────────────────

  function renderPreviewField(field) {
    if (field.hidden) return null
    return (
      <Box key={field.id} sx={{ py: 1.5, borderBottom: '1px solid var(--color-border-secondary)' }}>
        <Typography variant="body2" sx={{ fontWeight: 500, mb: 0.75, color: 'var(--color-text-primary)' }}>
          {field.label}
          {field.required && <Typography component="span" sx={{ color: 'var(--color-error)', ml: 0.5 }}>*</Typography>}
        </Typography>
        {field.description && (
          <Typography variant="caption" sx={{ display: 'block', color: 'var(--color-text-secondary)', mb: 0.75 }}>{field.description}</Typography>
        )}
        <Box sx={{ maxWidth: 400 }}>
          {field.type === 'date' ? (
            <TextField variant="filled" size="small" fullWidth type="date" InputLabelProps={{ shrink: true }} />
          ) : field.type === 'number' ? (
            <TextField variant="filled" size="small" fullWidth type="number" placeholder="Enter number" />
          ) : field.type === 'select' ? (
            <TextField variant="filled" size="small" fullWidth select defaultValue="">
              <MenuItem value=""><em>Select…</em></MenuItem>
              {(field.options || []).map((o) => <MenuItem key={o.id} value={o.id}>{o.label}</MenuItem>)}
            </TextField>
          ) : (
            <TextField variant="filled" size="small" fullWidth placeholder="Enter text" />
          )}
        </Box>
      </Box>
    )
  }

  // ─── Render ───────────────────────────────────────────────────────────────

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden', backgroundColor: 'var(--color-surface-secondary, #f5f5f5)' }}>

      {/* Page header */}
      <Box sx={{ backgroundColor: '#fff', borderBottom: '1px solid var(--color-border-secondary)', px: 3, py: 1.5, display: 'flex', alignItems: 'center', gap: 2, flexShrink: 0 }}>
        <Box
          component="button"
          type="button"
          onClick={() => navigate(-1)}
          sx={{
            background: 'transparent',
            border: 'none',
            color: 'var(--color-text-secondary)',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 0.5,
            cursor: 'pointer',
            px: 0,
            fontSize: 13,
            '&:hover': { color: 'var(--color-text-primary)' },
          }}
        >
          <ArrowBackOutlined sx={{ fontSize: 16 }} />
          Back
        </Box>

        <Divider orientation="vertical" flexItem />

        <Box sx={{ flex: 1 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 600, lineHeight: 1.2 }}>
            Athlete profile form
          </Typography>
          <Typography variant="caption" sx={{ color: 'var(--color-text-secondary)' }}>
            Club admin settings
          </Typography>
        </Box>

        <MuiButton
          variant="contained"
          size="small"
          disableElevation
          sx={{
            backgroundColor: 'var(--color-primary)',
            color: '#fff',
            textTransform: 'none',
            fontWeight: 600,
            '&:hover': { backgroundColor: 'var(--color-primary-dark, #2d3a4f)' },
          }}
        >
          Save changes
        </MuiButton>
      </Box>

      {/* Tabs */}
      <Box sx={{ backgroundColor: '#fff', borderBottom: '1px solid var(--color-border-secondary)', px: 3, flexShrink: 0 }}>
        <Tabs
          value={tabValue}
          onChange={(_, v) => setTabValue(v)}
          sx={{
            minHeight: 40,
            '& .MuiTab-root': {
              color: 'var(--color-text-secondary)',
              textTransform: 'none',
              fontWeight: 500,
              fontSize: 14,
              minHeight: 40,
              py: 0,
            },
            '& .MuiTab-root.Mui-selected': { color: 'var(--color-primary)', fontWeight: 600 },
            '& .MuiTabs-indicator': { backgroundColor: 'var(--color-primary)' },
          }}
        >
          <Tab label="Build" {...a11yProps(0)} />
          <Tab label="Preview" {...a11yProps(1)} />
          <Tab label="Settings" {...a11yProps(2)} />
        </Tabs>
      </Box>

      {/* Builder body — takes remaining height */}
      <Box sx={{ flex: 1, overflow: 'hidden', display: 'flex' }}>

        {/* ── BUILD TAB ── */}
        <TabPanel value={tabValue} index={0}>
          <Box sx={{ display: 'flex', height: '100%', overflow: 'hidden' }}>

            {/* Left sidebar — dark navy */}
            <Box sx={{ width: 280, flexShrink: 0, backgroundColor: SIDEBAR_BG, display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>

              {/* Sidebar header */}
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 2, py: 1.5, borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 600, color: 'rgba(255,255,255,0.9)' }}>Menu</Typography>
                <MuiButton
                  variant="contained"
                  size="small"
                  disableElevation
                  endIcon={<KeyboardArrowDownOutlined sx={{ fontSize: 16 }} />}
                  onClick={(e) => setAddMenuAnchor(e.currentTarget)}
                  sx={{
                    backgroundColor: 'rgba(255,255,255,0.12)',
                    color: 'rgba(255,255,255,0.9)',
                    textTransform: 'none',
                    fontSize: 13,
                    fontWeight: 500,
                    '&:hover': { backgroundColor: 'rgba(255,255,255,0.2)' },
                  }}
                >
                  Add
                </MuiButton>
                <Menu anchorEl={addMenuAnchor} open={Boolean(addMenuAnchor)} onClose={() => setAddMenuAnchor(null)}>
                  <MenuItem onClick={addSection} sx={{ fontSize: 14 }}>Add section</MenuItem>
                </Menu>
              </Box>

              {/* Section list */}
              <Box sx={{ flex: 1, overflowY: 'auto' }}>
                {sections.map((section) => (
                  <Box
                    key={section.id}
                    draggable={section.tier !== 1}
                    onDragStart={(e) => handleSectionDragStart(e, section.id)}
                    onDragOver={(e) => handleSectionDragOver(e, section.id)}
                    onDrop={handleSectionDrop}
                  >
                    <Box
                      onClick={() => setSelectedSectionId(section.id)}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 0.5,
                        px: 1.5,
                        py: 1,
                        cursor: 'pointer',
                        backgroundColor: selectedSectionId === section.id ? SIDEBAR_ITEM_ACTIVE : 'transparent',
                        '&:hover': { backgroundColor: selectedSectionId === section.id ? SIDEBAR_ITEM_ACTIVE : SIDEBAR_ITEM_HOVER },
                        borderBottom: '1px solid rgba(255,255,255,0.06)',
                        transition: 'background-color 0.12s',
                      }}
                    >
                      {/* Drag handle / lock */}
                      {section.tier === 1 ? (
                        <LockOutlined sx={{ fontSize: 14, color: 'rgba(255,255,255,0.3)', flexShrink: 0 }} />
                      ) : (
                        <DragIndicatorOutlined sx={{ fontSize: 18, color: 'rgba(255,255,255,0.3)', flexShrink: 0, cursor: 'grab' }} />
                      )}

                      {/* Name */}
                      {renamingSectionId === section.id ? (
                        <TextField
                          variant="filled"
                          size="small"
                          defaultValue={section.title}
                          autoFocus
                          onBlur={(e) => { renameSection(section.id, e.target.value || section.title); setRenamingSectionId(null) }}
                          onKeyDown={(e) => { if (e.key === 'Enter') e.target.blur(); if (e.key === 'Escape') setRenamingSectionId(null) }}
                          onClick={(e) => e.stopPropagation()}
                          sx={{ flex: 1, '& .MuiInput-root': { fontSize: 13, color: '#fff' }, '& .MuiInput-root:before': { borderColor: 'rgba(255,255,255,0.4)' } }}
                          inputProps={{ style: { padding: '2px 4px', color: '#fff' } }}
                        />
                      ) : (
                        <Typography variant="body2" sx={{ flex: 1, fontWeight: selectedSectionId === section.id ? 600 : 400, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: 'rgba(255,255,255,0.88)', fontSize: 13 }}>
                          {section.title}
                        </Typography>
                      )}

                      {/* Item count */}
                      <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.4)', flexShrink: 0, fontSize: 11 }}>
                        {countFields(section)}
                      </Typography>

                      {/* Three-dot menu — non-locked only */}
                      {section.tier !== 1 && (
                        <IconButton
                          size="small"
                          onClick={(e) => { e.stopPropagation(); setSectionMenuAnchor(e.currentTarget); setSectionMenuTarget(section.id) }}
                          sx={{ flexShrink: 0, p: 0.25, color: 'rgba(255,255,255,0.4)', '&:hover': { color: 'rgba(255,255,255,0.9)' } }}
                        >
                          <MoreVertOutlined sx={{ fontSize: 16 }} />
                        </IconButton>
                      )}

                      {/* Collapse chevron */}
                      <IconButton
                        size="small"
                        onClick={(e) => { e.stopPropagation(); toggleCollapse(section.id) }}
                        sx={{ flexShrink: 0, p: 0.25, color: 'rgba(255,255,255,0.4)', '&:hover': { color: 'rgba(255,255,255,0.9)' } }}
                      >
                        {section.collapsed ? <ExpandMoreOutlined sx={{ fontSize: 16 }} /> : <ExpandLessOutlined sx={{ fontSize: 16 }} />}
                      </IconButton>
                    </Box>

                    {/* Subsections in collapse */}
                    <Collapse in={!section.collapsed}>
                      {section.subsections.map((sub) => (
                        <Box
                          key={sub.id}
                          onClick={() => setSelectedSectionId(section.id)}
                          sx={{ pl: 5, pr: 2, py: 0.75, cursor: 'pointer', borderBottom: '1px solid rgba(255,255,255,0.04)' }}
                        >
                          <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.45)', fontSize: 12 }}>
                            {sub.title}
                          </Typography>
                        </Box>
                      ))}
                    </Collapse>
                  </Box>
                ))}
              </Box>
            </Box>

            {/* Right canvas */}
            <Box sx={{ flex: 1, overflowY: 'auto', p: 3, backgroundColor: 'var(--color-surface-secondary, #f5f6f8)' }}>
              {selectedSection && selectedSection.subsections.map((sub) => (
                <Box key={sub.id} sx={{ mb: 4, maxWidth: 720 }}>

                  {/* Section title + pencil */}
                  <InlineEdit
                    value={selectedSection.title}
                    onChange={(v) => renameSection(selectedSection.id, v)}
                    disabled={selectedSection.tier === 1}
                    typographySx={{ fontSize: 20, fontWeight: 700, color: 'var(--color-text-primary)', lineHeight: 1.3 }}
                  />

                  {/* Sub-section title + pencil */}
                  <Box sx={{ mt: 0.5 }}>
                    <InlineEdit
                      value={sub.title}
                      onChange={(v) => renameSubsection(selectedSection.id, sub.id, v)}
                      disabled={selectedSection.tier === 1}
                      typographySx={{ fontSize: 13, color: 'var(--color-text-secondary)', fontWeight: 400 }}
                    />
                  </Box>

                  <Divider sx={{ my: 1.5 }} />

                  {/* Profile photo — only on base section */}
                  {selectedSection.tier === 1 && (
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', mb: 2.5 }}>
                      <Avatar
                        sx={{ width: 120, height: 120, backgroundColor: 'var(--color-border-secondary)', mb: 1 }}
                      >
                        <PhotoCameraOutlined sx={{ fontSize: 36, color: 'var(--color-text-disabled)' }} />
                      </Avatar>
                      <MuiButton
                        variant="outlined"
                        size="small"
                        startIcon={<PhotoCameraOutlined />}
                        sx={{ textTransform: 'none', fontSize: 12, borderColor: 'var(--color-border-primary)', color: 'var(--color-text-secondary)', pointerEvents: 'none', opacity: 0.7 }}
                      >
                        Upload photo
                      </MuiButton>
                    </Box>
                  )}

                  {/* Fields */}
                  <Box
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={() => handleFieldDrop(selectedSection.id, sub.id)}
                  >
                    {sub.fields.length === 0 && (
                      <Box sx={{ py: 4, textAlign: 'center', border: '2px dashed var(--color-border-secondary)', borderRadius: 1, mb: 2 }}>
                        <Typography variant="body2" sx={{ color: 'var(--color-text-secondary)' }}>
                          No fields yet. Use the buttons below to add fields.
                        </Typography>
                      </Box>
                    )}
                    {sub.fields.map((field) => (
                      <FieldCard
                        key={field.id}
                        field={field}
                        isExpanded={getExpandedKey(sub.id) === field.id}
                        onToggleExpand={() => toggleFieldExpand(sub.id, field.id)}
                        onUpdate={(updated) => updateField(selectedSection.id, sub.id, updated)}
                        onRemove={() => removeField(selectedSection.id, sub.id, field.id)}
                        autoFocusLabel={autoFocusFieldId === field.id}
                        dragHandleProps={{
                          draggable: field.tier !== 1,
                          onDragStart: (e) => handleFieldDragStart(e, field.id, selectedSection.id, sub.id),
                          onDragOver: (e) => handleFieldDragOver(e, field.id, selectedSection.id, sub.id),
                        }}
                      />
                    ))}
                  </Box>

                  {/* Action buttons */}
                  {selectedSection.tier !== 1 && (
                    <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                      {[
                        { label: 'Add field', onClick: () => addField(selectedSection.id, sub.id) },
                        { label: 'Add paragraph', onClick: () => {} },
                        { label: 'Add group', onClick: () => {} },
                      ].map(({ label, onClick }) => (
                        <MuiButton
                          key={label}
                          variant="outlined"
                          size="small"
                          startIcon={<AddOutlined />}
                          onClick={onClick}
                          sx={{ textTransform: 'none', fontSize: 13, borderColor: 'var(--color-border-primary)', color: 'var(--color-text-secondary)', backgroundColor: '#fff', '&:hover': { borderColor: 'var(--color-primary)', color: 'var(--color-primary)', backgroundColor: '#fff' } }}
                        >
                          {label}
                        </MuiButton>
                      ))}
                    </Box>
                  )}
                </Box>
              ))}
            </Box>
          </Box>
        </TabPanel>

        {/* ── PREVIEW TAB ── */}
        <TabPanel value={tabValue} index={1}>
          <Box sx={{ display: 'flex', height: '100%', overflow: 'hidden' }}>
            {/* Sidebar */}
            <Box sx={{ width: 280, flexShrink: 0, backgroundColor: SIDEBAR_BG, overflowY: 'auto' }}>
              {sections.map((section) => (
                <Box
                  key={section.id}
                  onClick={() => setSelectedSectionId(section.id)}
                  sx={{
                    px: 2,
                    py: 1,
                    cursor: 'pointer',
                    borderBottom: '1px solid rgba(255,255,255,0.06)',
                    backgroundColor: selectedSectionId === section.id ? SIDEBAR_ITEM_ACTIVE : 'transparent',
                    '&:hover': { backgroundColor: SIDEBAR_ITEM_HOVER },
                  }}
                >
                  <Typography variant="body2" sx={{ fontWeight: selectedSectionId === section.id ? 600 : 400, color: 'rgba(255,255,255,0.88)', fontSize: 13 }}>
                    {section.title}
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.4)', fontSize: 11 }}>
                    {countFields(section)} fields
                  </Typography>
                </Box>
              ))}
            </Box>

            {/* Preview canvas */}
            <Box sx={{ flex: 1, overflowY: 'auto', p: 3, backgroundColor: 'var(--color-surface-secondary, #f5f6f8)' }}>
              {selectedSection && (
                <Paper elevation={0} sx={{ maxWidth: 640, borderRadius: 2, border: '1px solid var(--color-border-secondary)', p: 3, backgroundColor: '#fff' }}>
                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>{selectedSection.title}</Typography>
                  <Divider sx={{ mb: 2 }} />

                  {selectedSection.tier === 1 && (
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', mb: 2 }}>
                      <Avatar sx={{ width: 96, height: 96, backgroundColor: 'var(--color-border-secondary)', mb: 1 }}>
                        <PhotoCameraOutlined sx={{ fontSize: 28, color: 'var(--color-text-disabled)' }} />
                      </Avatar>
                      <Typography variant="caption" sx={{ color: 'var(--color-text-secondary)' }}>Profile photo</Typography>
                    </Box>
                  )}

                  {selectedSection.subsections.map((sub) => (
                    <Box key={sub.id}>
                      {sub.fields.map((field) => renderPreviewField(field))}
                    </Box>
                  ))}
                </Paper>
              )}
            </Box>
          </Box>
        </TabPanel>

        {/* ── SETTINGS TAB ── */}
        <TabPanel value={tabValue} index={2}>
          <Box sx={{ display: 'flex', height: '100%', overflow: 'hidden' }}>
            {/* Sidebar */}
            <Box sx={{ width: 280, flexShrink: 0, backgroundColor: SIDEBAR_BG }} />

            {/* Settings canvas */}
            <Box sx={{ flex: 1, overflowY: 'auto', p: 3, backgroundColor: 'var(--color-surface-secondary, #f5f6f8)' }}>
              <Box sx={{ maxWidth: 560 }}>
                {[
                  {
                    title: 'Visibility',
                    fields: [
                      { label: 'Show profile to athlete', defaultChecked: false },
                      { label: 'Allow athlete to edit their own profile', defaultChecked: true },
                      { label: 'Allow coach to view full profile', defaultChecked: true },
                    ],
                  },
                  {
                    title: 'Access',
                    fields: [
                      { label: 'Club admins can edit all fields', defaultChecked: true },
                      { label: 'Medical staff can view hidden fields', defaultChecked: false },
                    ],
                  },
                ].map(({ title, fields }) => (
                  <Paper key={title} elevation={0} sx={{ border: '1px solid var(--color-border-secondary)', borderRadius: 2, p: 2, mb: 2, backgroundColor: '#fff' }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1.5 }}>{title}</Typography>
                    <FormGroup>
                      {fields.map(({ label, defaultChecked }) => (
                        <FormControlLabel
                          key={label}
                          control={
                            <Switch
                              defaultChecked={defaultChecked}
                              size="small"
                              sx={{
                                '& .MuiSwitch-track': { backgroundColor: 'var(--color-border-primary)', opacity: 1 },
                                '& .MuiSwitch-switchBase.Mui-checked': { color: '#fff' },
                                '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { backgroundColor: 'var(--color-primary)', opacity: 1 },
                                '& .MuiSwitch-switchBase:hover': { backgroundColor: 'transparent' },
                              }}
                            />
                          }
                          label={<Typography variant="body2">{label}</Typography>}
                        />
                      ))}
                    </FormGroup>
                  </Paper>
                ))}
              </Box>
            </Box>
          </Box>
        </TabPanel>
      </Box>

      {/* Section context menu */}
      <Menu anchorEl={sectionMenuAnchor} open={Boolean(sectionMenuAnchor)} onClose={() => setSectionMenuAnchor(null)}>
        <MenuItem onClick={() => { setRenamingSectionId(sectionMenuTarget); setSectionMenuAnchor(null) }} sx={{ fontSize: 14 }}>Rename</MenuItem>
        <MenuItem onClick={() => duplicateSection(sectionMenuTarget)} sx={{ fontSize: 14 }}>Duplicate</MenuItem>
        <Divider />
        <MenuItem onClick={() => deleteSection(sectionMenuTarget)} sx={{ fontSize: 14, color: 'var(--color-error)' }}>Delete</MenuItem>
      </Menu>
    </Box>
  )
}
