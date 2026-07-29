import React, { useState, useEffect, useMemo } from 'react'
import {
  Box,
  IconButton,
  TextField,
  InputAdornment,
  Checkbox,
  Chip,
  Divider,
  Button,
  Paper,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Link,
  Menu,
  Snackbar,
  Alert,
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import SearchIcon from '@mui/icons-material/Search'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'
import DragIndicatorIcon from '@mui/icons-material/DragIndicator'
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder'
import { ATHLETES, TEMPLATES, FIELD_GROUPS, FIELD_CATEGORY } from './data'

// Navy is the only active colour inside the drawer — no accent blue.
const NAVY = '#1D2635'
const FILL = '#F3F4F7'
const BORDER = '#D0D5DD'

const DEFAULT_FIELDS = ['Full name', 'Preferred name', 'Date of birth']
const CATEGORIES = FIELD_GROUPS.map((g) => g.category)

// Squad-grouped athletes for the Select Players dropdown.
const SQUAD_GROUPS = ATHLETES.reduce((acc, a) => {
  acc[a.squad] = acc[a.squad] || []
  acc[a.squad].push(a)
  return acc
}, {})

export default function ExportDrawer({ open, onClose }) {
  const [playersAnchor, setPlayersAnchor] = useState(null)
  const [selectedAthletes, setSelectedAthletes] = useState([])
  const [fieldMode, setFieldMode] = useState('choose')
  const [selectedFields, setSelectedFields] = useState(DEFAULT_FIELDS)
  const [fieldSearch, setFieldSearch] = useState('')
  const [category, setCategory] = useState('all')
  const [sort, setSort] = useState('az')
  const [templateId, setTemplateId] = useState('')
  const [templates, setTemplates] = useState(TEMPLATES)
  const [dragIndex, setDragIndex] = useState(null)
  const [showSaveTemplate, setShowSaveTemplate] = useState(false)
  const [templateName, setTemplateName] = useState('')
  const [toast, setToast] = useState(false)
  const [templateToast, setTemplateToast] = useState(false)

  useEffect(() => {
    if (open) {
      setPlayersAnchor(null)
      setSelectedAthletes([])
      setFieldMode('choose')
      setSelectedFields(DEFAULT_FIELDS)
      setFieldSearch('')
      setCategory('all')
      setSort('az')
      setTemplateId('')
      setTemplates(TEMPLATES)
      setDragIndex(null)
      setShowSaveTemplate(false)
      setTemplateName('')
    }
  }, [open])

  const toggleAthlete = (id) =>
    setSelectedAthletes((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))

  const selectAllSquad = (squad) => {
    const ids = SQUAD_GROUPS[squad].map((a) => a.id)
    const allIn = ids.every((id) => selectedAthletes.includes(id))
    setSelectedAthletes((prev) =>
      allIn ? prev.filter((id) => !ids.includes(id)) : [...new Set([...prev, ...ids])]
    )
  }

  const toggleField = (field) =>
    setSelectedFields((prev) => (prev.includes(field) ? prev.filter((f) => f !== field) : [...prev, field]))

  const removeField = (field) =>
    setSelectedFields((prev) => prev.filter((f) => f !== field))

  const handleDrop = (toIndex) => {
    if (dragIndex === null || dragIndex === toIndex) {
      setDragIndex(null)
      return
    }
    setSelectedFields((prev) => {
      const next = [...prev]
      const [moved] = next.splice(dragIndex, 1)
      next.splice(toIndex, 0, moved)
      return next
    })
    setDragIndex(null)
  }

  const saveTemplate = () => {
    const name = templateName.trim()
    if (!name) return
    const newId = Math.max(0, ...templates.map((t) => t.id)) + 1
    setTemplates((prev) => [...prev, { id: newId, name, fields: [...selectedFields] }])
    setShowSaveTemplate(false)
    setTemplateName('')
    setTemplateToast(true)
  }

  const applyTemplate = (id) => {
    setTemplateId(id)
    const t = templates.find((x) => x.id === id)
    if (t) setSelectedFields([...t.fields])
  }

  // Visible field groups: filter by category + search, sort fields per `sort`.
  const visibleGroups = useMemo(() => {
    const q = fieldSearch.trim().toLowerCase()
    return FIELD_GROUPS.filter((g) => category === 'all' || g.category === category)
      .map((g) => ({
        category: g.category,
        fields: g.fields
          .filter((f) => !q || f.toLowerCase().includes(q))
          .sort((a, b) => (sort === 'az' ? a.localeCompare(b) : b.localeCompare(a))),
      }))
      .filter((g) => g.fields.length > 0)
  }, [fieldSearch, category, sort])

  const handleExport = () => {
    setToast(true)
    setTimeout(() => {
      setToast(false)
      onClose()
    }, 1500)
  }

  const segBtnBase = { flex: 1, textTransform: 'none', boxShadow: 'none', '&:hover': { boxShadow: 'none' } }

  return (
    <>
      {/* Overlay */}
      <Box
        onClick={onClose}
        sx={{
          position: 'fixed',
          inset: 0,
          bgcolor: 'rgba(0,0,0,0.3)',
          opacity: open ? 1 : 0,
          visibility: open ? 'visible' : 'hidden',
          transition: 'opacity 0.25s ease',
          zIndex: 1200,
        }}
      />

      {/* Panel — flat, no shadow */}
      <Paper
        elevation={0}
        square
        sx={{
          position: 'fixed',
          top: 0,
          right: 0,
          height: '100vh',
          width: 440,
          maxWidth: '100vw',
          borderLeft: 1,
          borderColor: 'divider',
          transform: open ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 0.3s cubic-bezier(0.4,0,0.2,1)',
          zIndex: 1300,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 3, py: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 400, color: NAVY }}>Export Athlete Profiles</Typography>
          <IconButton disableRipple onClick={onClose} sx={{ color: NAVY, '&:hover': { bgcolor: 'transparent' } }}>
            <CloseIcon />
          </IconButton>
        </Box>
        <Divider />

        {/* Body */}
        <Box sx={{ flex: 1, overflow: 'auto', px: 3, py: 2 }}>
          {/* Select Players */}
          <Box
            onClick={(e) => setPlayersAnchor(e.currentTarget)}
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              bgcolor: FILL,
              borderRadius: '4px 4px 0 0',
              borderBottom: '1px solid rgba(0,0,0,0.42)',
              px: 1.5,
              py: 1.25,
              cursor: 'pointer',
            }}
          >
            <Typography fontSize={14} color="text.secondary">Select Players</Typography>
            <ArrowDropDownIcon sx={{ color: 'action.active' }} />
          </Box>

          <Menu
            anchorEl={playersAnchor}
            open={Boolean(playersAnchor)}
            onClose={() => setPlayersAnchor(null)}
            slotProps={{ paper: { sx: { width: 392, maxHeight: 360 } } }}
          >
            {Object.entries(SQUAD_GROUPS).map(([squad, athletes], gi) => (
              <Box key={squad}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 2, py: 1 }}>
                  <Typography variant="subtitle2" fontWeight={600} color={NAVY}>{squad}</Typography>
                  <Link
                    component="button"
                    underline="none"
                    onClick={() => selectAllSquad(squad)}
                    sx={{ display: 'flex', alignItems: 'center', color: NAVY, fontSize: 13, fontWeight: 500 }}
                  >
                    Select all
                    <ChevronRightIcon fontSize="small" />
                  </Link>
                </Box>
                {athletes.map((a) => (
                  <Box
                    key={a.id}
                    onClick={() => toggleAthlete(a.id)}
                    sx={{ display: 'flex', alignItems: 'center', gap: 1, px: 2, py: 0.5, cursor: 'pointer' }}
                  >
                    <Checkbox
                      size="small"
                      checked={selectedAthletes.includes(a.id)}
                      sx={{ p: 0.5, '&.Mui-checked': { color: NAVY } }}
                    />
                    <Box>
                      <Typography variant="body2">{a.name}</Typography>
                      <Typography fontSize={12} color="text.secondary">{a.position}</Typography>
                    </Box>
                  </Box>
                ))}
                {gi < Object.keys(SQUAD_GROUPS).length - 1 && <Divider sx={{ my: 0.5 }} />}
              </Box>
            ))}
          </Menu>

          <Box sx={{ mt: 1.5 }}>
            <Chip
              label={`Selected (${selectedAthletes.length})`}
              size="small"
              sx={{ bgcolor: NAVY, color: '#FFFFFF' }}
            />
          </Box>

          {/* Segmented control */}
          <Box sx={{ display: 'flex', mt: 2 }}>
            <Button
              disableElevation
              onClick={() => setFieldMode('choose')}
              sx={{
                ...segBtnBase,
                borderRadius: '4px 0 0 4px',
                bgcolor: fieldMode === 'choose' ? NAVY : '#FFFFFF',
                color: fieldMode === 'choose' ? '#FFFFFF' : '#555555',
                border: fieldMode === 'choose' ? 'none' : `1px solid ${BORDER}`,
                '&:hover': { bgcolor: fieldMode === 'choose' ? NAVY : '#FFFFFF', boxShadow: 'none' },
              }}
            >
              Choose fields
            </Button>
            <Button
              disableElevation
              onClick={() => setFieldMode('saved')}
              sx={{
                ...segBtnBase,
                borderRadius: '0 4px 4px 0',
                borderLeft: 'none',
                bgcolor: fieldMode === 'saved' ? NAVY : '#FFFFFF',
                color: fieldMode === 'saved' ? '#FFFFFF' : '#555555',
                border: fieldMode === 'saved' ? 'none' : `1px solid ${BORDER}`,
                '&:hover': { bgcolor: fieldMode === 'saved' ? NAVY : '#FFFFFF', boxShadow: 'none' },
              }}
            >
              Saved template
            </Button>
          </Box>

          {fieldMode === 'choose' ? (
            <>
              {/* Selected fields reorder zone — renders only when >=1 field is checked */}
              {selectedFields.length > 0 && (
                <Box sx={{ mt: 2, bgcolor: FILL, border: '1px solid #E0E2E6', borderRadius: '4px', px: 1.5, py: 1 }}>
                  <Typography variant="caption" sx={{ color: '#949BA6', textTransform: 'uppercase', display: 'block', mb: 1 }}>
                    Selected · drag to reorder
                  </Typography>
                  {selectedFields.map((field, idx) => (
                    <React.Fragment key={field}>
                      <Paper
                        elevation={0}
                        variant="outlined"
                        draggable
                        onDragStart={() => setDragIndex(idx)}
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={() => handleDrop(idx)}
                        onDragEnd={() => setDragIndex(null)}
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1,
                          px: 1,
                          py: 0.75,
                          cursor: 'grab',
                          opacity: dragIndex === idx ? 0.4 : 1,
                        }}
                      >
                        <DragIndicatorIcon fontSize="small" sx={{ color: '#949BA6' }} />
                        <Typography variant="caption" sx={{ color: '#949BA6', width: 16, textAlign: 'right' }}>
                          {idx + 1}
                        </Typography>
                        <Box sx={{ flex: 1, minWidth: 0 }}>
                          <Typography variant="body2" sx={{ color: NAVY }}>{field}</Typography>
                          <Typography variant="caption" sx={{ color: '#949BA6' }}>{FIELD_CATEGORY[field]}</Typography>
                        </Box>
                        <IconButton size="small" onClick={() => removeField(field)} sx={{ color: '#949BA6' }}>
                          <CloseIcon fontSize="small" />
                        </IconButton>
                      </Paper>
                      {idx < selectedFields.length - 1 && <Divider />}
                    </React.Fragment>
                  ))}
                </Box>
              )}

              {/* Save as template — appears in sync with the selected fields zone */}
              {selectedFields.length > 0 && (
                <Box sx={{ mt: 2 }}>
                  {!showSaveTemplate ? (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <BookmarkBorderIcon fontSize="small" sx={{ color: '#949BA6' }} />
                      <Button
                        variant="text"
                        onClick={() => setShowSaveTemplate(true)}
                        sx={{ color: '#949BA6', textTransform: 'none', padding: 0, minWidth: 0 }}
                      >
                        Save as template
                      </Button>
                    </Box>
                  ) : (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <BookmarkBorderIcon fontSize="small" sx={{ color: '#949BA6' }} />
                        <Typography variant="body2" sx={{ color: '#949BA6' }}>Save as template</Typography>
                      </Box>
                      <TextField
                        fullWidth
                        variant="filled"
                        size="small"
                        autoFocus
                        placeholder="e.g. Tour travel pack"
                        value={templateName}
                        onChange={(e) => setTemplateName(e.target.value)}
                        onKeyDown={(e) => { if (e.key === 'Enter') saveTemplate() }}
                      />
                      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                        <Button
                          variant="text"
                          onClick={() => { setShowSaveTemplate(false); setTemplateName('') }}
                          sx={{ color: '#949BA6', textTransform: 'none' }}
                        >
                          Cancel
                        </Button>
                        <Button
                          variant="contained"
                          disableElevation
                          disabled={!templateName.trim()}
                          onClick={saveTemplate}
                          sx={{ textTransform: 'none', backgroundColor: NAVY, color: '#fff', '&:hover': { backgroundColor: '#11161f' } }}
                        >
                          Save
                        </Button>
                      </Box>
                    </Box>
                  )}
                  <Divider sx={{ mt: 2 }} />
                </Box>
              )}

              {/* Search fields */}
              <TextField
                fullWidth
                variant="filled"
                size="small"
                placeholder="Search fields"
                value={fieldSearch}
                onChange={(e) => setFieldSearch(e.target.value)}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <SearchIcon fontSize="small" sx={{ color: 'action.active' }} />
                    </InputAdornment>
                  ),
                  sx: { bgcolor: FILL },
                }}
                sx={{ mt: 2 }}
              />

              {/* Categories + Sort */}
              <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                <FormControl fullWidth size="small">
                  <InputLabel>Categories</InputLabel>
                  <Select label="Categories" value={category} onChange={(e) => setCategory(e.target.value)}>
                    <MenuItem value="all">All categories</MenuItem>
                    {CATEGORIES.map((c) => (
                      <MenuItem key={c} value={c}>{c}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <FormControl fullWidth size="small">
                  <InputLabel>Sort</InputLabel>
                  <Select label="Sort" value={sort} onChange={(e) => setSort(e.target.value)}>
                    <MenuItem value="az">A-Z</MenuItem>
                    <MenuItem value="za">Z-A</MenuItem>
                  </Select>
                </FormControl>
              </Box>

              {/* Field checklist — flat, dividers between rows */}
              <Box sx={{ mt: 2 }}>
                {visibleGroups.map((group) => (
                  <Box key={group.category} sx={{ mb: 2 }}>
                    <Typography variant="subtitle2" color={NAVY} sx={{ fontWeight: 400, mb: 0.5 }}>
                      {group.category}
                    </Typography>
                    {group.fields.map((field) => (
                      <React.Fragment key={field}>
                        <Box
                          onClick={() => toggleField(field)}
                          sx={{ display: 'flex', alignItems: 'center', gap: 1, py: 0.5, cursor: 'pointer' }}
                        >
                          <Checkbox
                            size="small"
                            checked={selectedFields.includes(field)}
                            sx={{ p: 0.5, '&.Mui-checked': { color: NAVY } }}
                          />
                          <Typography variant="body2">{field}</Typography>
                        </Box>
                        <Divider />
                      </React.Fragment>
                    ))}
                  </Box>
                ))}
                {visibleGroups.length === 0 && (
                  <Typography variant="body2" color="text.secondary" textAlign="center" py={3}>
                    No fields match your search.
                  </Typography>
                )}
              </Box>
            </>
          ) : (
            /* Saved template */
            <Box sx={{ mt: 2 }}>
              <FormControl fullWidth size="small">
                <InputLabel>Template</InputLabel>
                <Select label="Template" value={templateId} onChange={(e) => applyTemplate(e.target.value)}>
                  {templates.map((t) => (
                    <MenuItem key={t.id} value={t.id}>{t.name} ({t.fields.length} fields)</MenuItem>
                  ))}
                </Select>
              </FormControl>

              {templateId !== '' && (
                <Box sx={{ mt: 2 }}>
                  {selectedFields.map((field) => (
                    <React.Fragment key={field}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, py: 0.5 }}>
                        <Checkbox size="small" checked disabled sx={{ p: 0.5, '&.Mui-checked': { color: NAVY } }} />
                        <Typography variant="body2">{field}</Typography>
                      </Box>
                      <Divider />
                    </React.Fragment>
                  ))}
                </Box>
              )}
            </Box>
          )}
        </Box>

        {/* Footer */}
        <Divider />
        <Box sx={{ px: 3, py: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Button variant="outlined" onClick={onClose} sx={{ textTransform: 'none', borderColor: BORDER, color: NAVY }}>
            Cancel
          </Button>
          <Button
            variant="contained"
            disableElevation
            onClick={handleExport}
            sx={{ textTransform: 'none', bgcolor: NAVY, '&:hover': { bgcolor: '#11161f' } }}
          >
            Export CSV
          </Button>
        </Box>
      </Paper>

      {/* Success toast */}
      <Snackbar open={toast} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }} sx={{ zIndex: 1400 }}>
        <Alert severity="success" variant="filled">
          ✓ Exported {selectedAthletes.length} athletes · {selectedFields.length} fields
        </Alert>
      </Snackbar>

      {/* Template saved toast */}
      <Snackbar
        open={templateToast}
        autoHideDuration={2500}
        onClose={() => setTemplateToast(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        sx={{ zIndex: 1400 }}
      >
        <Alert severity="success" variant="filled" onClose={() => setTemplateToast(false)}>
          Template saved
        </Alert>
      </Snackbar>
    </>
  )
}
