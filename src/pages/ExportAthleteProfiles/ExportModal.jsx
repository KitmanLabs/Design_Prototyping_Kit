import React, { useState, useEffect, useMemo } from 'react'
import {
  Box,
  Grid,
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert,
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import SearchIcon from '@mui/icons-material/Search'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'
import DragIndicatorIcon from '@mui/icons-material/DragIndicator'
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder'
import TableRowsIcon from '@mui/icons-material/TableRows'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import { ATHLETES, TEMPLATES, FIELD_GROUPS, FIELD_CATEGORY } from './data'

// Navy is the only active colour inside the modal — no accent blue.
const NAVY = '#1D2635'
const FILL = '#F3F4F7'
const BORDER = '#D0D5DD'
const GREY = '#949BA6'

const DEFAULT_FIELDS = ['Full name', 'Preferred name', 'Date of birth']
const CATEGORIES = FIELD_GROUPS.map((g) => g.category)

const SQUAD_GROUPS = ATHLETES.reduce((acc, a) => {
  acc[a.squad] = acc[a.squad] || []
  acc[a.squad].push(a)
  return acc
}, {})

export default function ExportModal({ open, onClose }) {
  const [playersAnchor, setPlayersAnchor] = useState(null)
  const [selectedAthletes, setSelectedAthletes] = useState([])
  const [fieldMode, setFieldMode] = useState('choose')
  const [selectedFields, setSelectedFields] = useState(DEFAULT_FIELDS)
  const [fieldSearch, setFieldSearch] = useState('')
  const [category, setCategory] = useState('all')
  const [sort, setSort] = useState('az')
  const [templates, setTemplates] = useState(TEMPLATES)
  const [dragIndex, setDragIndex] = useState(null)
  const [showSaveTemplate, setShowSaveTemplate] = useState(false)
  const [templateName, setTemplateName] = useState('')
  const [toast, setToast] = useState(false)
  const [templateToast, setTemplateToast] = useState(false)
  const [templateUpdatedToast, setTemplateUpdatedToast] = useState(false)

  // Saved template tab state
  const [selectedTemplateId, setSelectedTemplateId] = useState(null)
  const [editingTemplateId, setEditingTemplateId] = useState(null)
  const [editTemplateName, setEditTemplateName] = useState('')
  const [originalFields, setOriginalFields] = useState([])
  const [editFieldSearch, setEditFieldSearch] = useState('')
  const [deleteConfirmId, setDeleteConfirmId] = useState(null)

  useEffect(() => {
    if (open) {
      setPlayersAnchor(null)
      setSelectedAthletes([])
      setFieldMode('choose')
      setSelectedFields(DEFAULT_FIELDS)
      setFieldSearch('')
      setCategory('all')
      setSort('az')
      setTemplates(TEMPLATES)
      setDragIndex(null)
      setShowSaveTemplate(false)
      setTemplateName('')
      setSelectedTemplateId(null)
      setEditingTemplateId(null)
      setEditTemplateName('')
      setOriginalFields([])
      setEditFieldSearch('')
      setDeleteConfirmId(null)
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

  const removeField = (field) => setSelectedFields((prev) => prev.filter((f) => f !== field))

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

  const deleteTemplate = (id) => {
    setTemplates((prev) => prev.filter((t) => t.id !== id))
    setDeleteConfirmId(null)
  }

  // Saved template tab handlers
  const selectTemplate = (t) => {
    if (editingTemplateId) return
    setSelectedTemplateId(t.id)
    setSelectedFields([...t.fields])
  }

  const startEdit = (t) => {
    setSelectedTemplateId(t.id)
    setSelectedFields([...t.fields])
    setOriginalFields([...t.fields])
    setEditingTemplateId(t.id)
    setEditTemplateName(t.name)
    setEditFieldSearch('')
  }

  const cancelEdit = () => {
    setSelectedFields([...originalFields])
    setEditingTemplateId(null)
    setEditTemplateName('')
    setOriginalFields([])
  }

  const saveEditTemplate = () => {
    const name = editTemplateName.trim()
    if (!name) return
    setTemplates((prev) =>
      prev.map((t) => (t.id === editingTemplateId ? { ...t, name, fields: [...selectedFields] } : t))
    )
    setEditingTemplateId(null)
    setEditTemplateName('')
    setOriginalFields([])
    setTemplateUpdatedToast(true)
  }

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

  const editVisibleGroups = useMemo(() => {
    const q = editFieldSearch.trim().toLowerCase()
    return FIELD_GROUPS.map((g) => ({
      category: g.category,
      fields: g.fields.filter((f) => !q || f.toLowerCase().includes(q)),
    })).filter((g) => g.fields.length > 0)
  }, [editFieldSearch])

  const handleExport = () => {
    setToast(true)
    setTimeout(() => {
      setToast(false)
      onClose()
    }, 1500)
  }

  const segBtnBase = { flex: 1, textTransform: 'none', boxShadow: 'none', '&:hover': { boxShadow: 'none' } }
  const hasFields = selectedFields.length > 0

  return (
    <>
      <Dialog
        open={open}
        onClose={onClose}
        maxWidth="md"
        fullWidth
        PaperProps={{ sx: { borderRadius: 2, minHeight: '80vh', display: 'flex', flexDirection: 'column' } }}
      >
        {/* Header */}
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', py: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 400, color: NAVY }}>Export Athlete Profiles</Typography>
          <IconButton disableRipple onClick={onClose} sx={{ color: NAVY, '&:hover': { bgcolor: 'transparent' } }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <Divider />

        {/* Body — fixed height, columns scroll internally */}
        <DialogContent sx={{ p: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden', flex: 1 }}>
          {/* Athlete selector — full width */}
          <Box sx={{ px: 3, py: 2, flexShrink: 0 }}>
            <Typography variant="subtitle2" sx={{ color: NAVY, mb: 1 }}>Athletes</Typography>
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
              slotProps={{ paper: { sx: { width: 420, maxHeight: 360 } } }}
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
                      <Checkbox size="small" checked={selectedAthletes.includes(a.id)} sx={{ p: 0.5, '&.Mui-checked': { color: NAVY } }} />
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

            {selectedAthletes.length > 0 && (
              <Box sx={{ mt: 1.5 }}>
                <Chip label={`Selected (${selectedAthletes.length})`} size="small" sx={{ bgcolor: NAVY, color: '#FFFFFF' }} />
              </Box>
            )}
          </Box>

          <Divider />

          {/* Two-column fields area */}
          <Grid container sx={{ flex: 1, minHeight: 0 }}>
            {/* Left column */}
            <Grid item xs={6} sx={{ height: '100%', display: 'flex', flexDirection: 'column', borderRight: 1, borderColor: 'divider', overflow: 'hidden' }}>
              <Box sx={{ px: 3, pt: 2, flexShrink: 0 }}>
                <Typography variant="subtitle2" sx={{ color: NAVY, mb: 1 }}>Fields</Typography>

                {/* Segmented control */}
                <Box sx={{ display: 'flex' }}>
                  <Button
                    disableElevation
                    onClick={() => { setFieldMode('choose'); setSelectedTemplateId(null); setEditingTemplateId(null) }}
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

                {fieldMode === 'choose' && (
                  <>
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
                  </>
                )}
              </Box>

              {/* Scrollable area */}
              <Box sx={{ flex: 1, minHeight: 0, overflowY: 'auto', px: 3, py: 2 }}>
                {fieldMode === 'choose' ? (
                  <>
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
                              <Checkbox size="small" checked={selectedFields.includes(field)} sx={{ p: 0.5, '&.Mui-checked': { color: NAVY } }} />
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
                  </>
                ) : (
                  /* Saved templates list */
                  <>
                    {templates.length === 0 && (
                      <Typography variant="body2" color="text.secondary" textAlign="center" py={3}>
                        No saved templates yet.
                      </Typography>
                    )}
                    {templates.map((t, idx) => (
                      <React.Fragment key={t.id}>
                        {editingTemplateId === t.id ? (
                          /* Edit mode — inline */
                          <Box sx={{ py: 1.5 }}>
                            <TextField
                              fullWidth
                              variant="filled"
                              size="small"
                              autoFocus
                              value={editTemplateName}
                              onChange={(e) => setEditTemplateName(e.target.value)}
                              onKeyDown={(e) => { if (e.key === 'Enter') saveEditTemplate() }}
                              sx={{ mb: 1.5 }}
                            />
                            <TextField
                              fullWidth
                              variant="filled"
                              size="small"
                              placeholder="Search fields"
                              value={editFieldSearch}
                              onChange={(e) => setEditFieldSearch(e.target.value)}
                              InputProps={{
                                endAdornment: (
                                  <InputAdornment position="end">
                                    <SearchIcon fontSize="small" sx={{ color: 'action.active' }} />
                                  </InputAdornment>
                                ),
                                sx: { bgcolor: FILL },
                              }}
                              sx={{ mb: 1.5 }}
                            />
                            {editVisibleGroups.map((group) => (
                              <Box key={group.category} sx={{ mb: 1.5 }}>
                                <Typography variant="caption" color={GREY} sx={{ textTransform: 'uppercase', display: 'block', mb: 0.5 }}>
                                  {group.category}
                                </Typography>
                                {group.fields.map((field) => (
                                  <React.Fragment key={field}>
                                    <Box
                                      onClick={() => toggleField(field)}
                                      sx={{ display: 'flex', alignItems: 'center', gap: 1, py: 0.5, cursor: 'pointer' }}
                                    >
                                      <Checkbox size="small" checked={selectedFields.includes(field)} sx={{ p: 0.5, '&.Mui-checked': { color: NAVY } }} />
                                      <Typography variant="body2">{field}</Typography>
                                    </Box>
                                    <Divider />
                                  </React.Fragment>
                                ))}
                              </Box>
                            ))}
                            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mt: 1 }}>
                              <Button variant="text" onClick={cancelEdit} sx={{ color: GREY, textTransform: 'none' }}>
                                Cancel
                              </Button>
                              <Button
                                variant="contained"
                                disableElevation
                                disabled={!editTemplateName.trim()}
                                onClick={saveEditTemplate}
                                sx={{ textTransform: 'none', backgroundColor: NAVY, color: '#fff', '&:hover': { backgroundColor: '#11161f' } }}
                              >
                                Save template
                              </Button>
                            </Box>
                          </Box>
                        ) : (
                          /* Flat selectable row */
                          <Box
                            onClick={() => selectTemplate(t)}
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 0.5,
                              py: 1,
                              pl: 1,
                              cursor: 'pointer',
                              bgcolor: selectedTemplateId === t.id ? FILL : 'transparent',
                              borderLeft: selectedTemplateId === t.id ? `3px solid ${NAVY}` : '3px solid transparent',
                            }}
                          >
                            <Box sx={{ flex: 1, minWidth: 0 }}>
                              <Typography variant="body2" sx={{ color: NAVY, fontWeight: 500 }}>{t.name}</Typography>
                              <Typography variant="caption" sx={{ color: GREY }}>
                                {selectedTemplateId === t.id ? selectedFields.length : t.fields.length} fields
                              </Typography>
                            </Box>
                            <IconButton size="small" sx={{ color: GREY }} onClick={(e) => { e.stopPropagation(); startEdit(t) }}>
                              <EditIcon fontSize="small" />
                            </IconButton>
                            <IconButton size="small" sx={{ color: GREY }} onClick={(e) => { e.stopPropagation(); setDeleteConfirmId(t.id) }}>
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Box>
                        )}
                        {idx < templates.length - 1 && <Divider />}
                      </React.Fragment>
                    ))}
                  </>
                )}
              </Box>
            </Grid>

            {/* Right column — column order + save as template */}
            <Grid item xs={6} sx={{ height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
              <Box sx={{ px: 3, pt: 2, flexShrink: 0 }}>
                <Typography variant="subtitle2" sx={{ color: NAVY }}>Column order</Typography>
                {hasFields && (
                  <Typography variant="caption" sx={{ color: GREY, textTransform: 'uppercase', display: 'block', mt: 0.5 }}>
                    Drag to reorder
                  </Typography>
                )}
              </Box>

              {/* Scrollable list / placeholder */}
              <Box sx={{ flex: 1, minHeight: 0, overflowY: 'auto', px: 3, py: 2 }}>
                {!hasFields ? (
                  <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
                    <TableRowsIcon sx={{ fontSize: 40, color: '#D7DAE0', mb: 1 }} />
                    <Typography variant="body2" sx={{ color: GREY }}>
                      Select fields on the left to build your export
                    </Typography>
                  </Box>
                ) : (
                  selectedFields.map((field, idx) => (
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
                        <DragIndicatorIcon fontSize="small" sx={{ color: GREY }} />
                        <Typography variant="caption" sx={{ color: GREY, width: 16, textAlign: 'right' }}>{idx + 1}</Typography>
                        <Box sx={{ flex: 1, minWidth: 0 }}>
                          <Typography variant="body2" sx={{ color: NAVY }}>{field}</Typography>
                          <Typography variant="caption" sx={{ color: GREY }}>{FIELD_CATEGORY[field]}</Typography>
                        </Box>
                        <IconButton size="small" onClick={() => removeField(field)} sx={{ color: GREY }}>
                          <CloseIcon fontSize="small" />
                        </IconButton>
                      </Paper>
                      {idx < selectedFields.length - 1 && <Divider />}
                    </React.Fragment>
                  ))
                )}
              </Box>

              {/* Save as template — pinned bottom */}
              {hasFields && (
                <Box sx={{ px: 3, py: 2, flexShrink: 0, borderTop: 1, borderColor: 'divider' }}>
                  {!showSaveTemplate ? (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <BookmarkBorderIcon fontSize="small" sx={{ color: GREY }} />
                      <Button variant="text" onClick={() => setShowSaveTemplate(true)} sx={{ color: GREY, textTransform: 'none', padding: 0, minWidth: 0 }}>
                        Save as template
                      </Button>
                    </Box>
                  ) : (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
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
                        <Button variant="text" onClick={() => { setShowSaveTemplate(false); setTemplateName('') }} sx={{ color: GREY, textTransform: 'none' }}>
                          Cancel
                        </Button>
                        <Button
                          variant="contained"
                          disableElevation
                          disabled={!templateName.trim()}
                          onClick={saveTemplate}
                          sx={{ textTransform: 'none', backgroundColor: NAVY, color: '#fff', '&:hover': { backgroundColor: '#11161f' } }}
                        >
                          Save template
                        </Button>
                      </Box>
                    </Box>
                  )}
                </Box>
              )}
            </Grid>
          </Grid>
        </DialogContent>

        <Divider />

        {/* Footer */}
        <DialogActions sx={{ px: 3, py: 2, justifyContent: 'space-between' }}>
          <Button variant="outlined" onClick={onClose} sx={{ textTransform: 'none', borderColor: BORDER, color: NAVY }}>
            Cancel
          </Button>
          <Button
            variant="contained"
            disableElevation
            disabled={selectedAthletes.length === 0 || selectedFields.length === 0}
            onClick={handleExport}
            sx={{ textTransform: 'none', backgroundColor: NAVY, color: '#fff', '&:hover': { backgroundColor: '#11161f' } }}
          >
            Export CSV
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete confirmation dialog */}
      <Dialog open={Boolean(deleteConfirmId)} onClose={() => setDeleteConfirmId(null)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ color: NAVY, fontWeight: 400 }}>Delete this template?</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary">This cannot be undone.</Typography>
        </DialogContent>
        <DialogActions>
          <Button variant="text" onClick={() => setDeleteConfirmId(null)} sx={{ color: GREY, textTransform: 'none' }}>
            Cancel
          </Button>
          <Button
            variant="contained"
            disableElevation
            onClick={() => deleteTemplate(deleteConfirmId)}
            sx={{ textTransform: 'none', backgroundColor: '#D32F2F', color: '#fff', '&:hover': { backgroundColor: '#b71c1c' } }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Export success toast */}
      <Snackbar open={toast} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }} sx={{ zIndex: 1400 }}>
        <Alert severity="success" variant="filled">
          Exported {selectedAthletes.length} athletes · {selectedFields.length} fields
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

      {/* Template updated toast */}
      <Snackbar
        open={templateUpdatedToast}
        autoHideDuration={2500}
        onClose={() => setTemplateUpdatedToast(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        sx={{ zIndex: 1400 }}
      >
        <Alert severity="success" variant="filled" onClose={() => setTemplateUpdatedToast(false)}>
          Template updated
        </Alert>
      </Snackbar>
    </>
  )
}
