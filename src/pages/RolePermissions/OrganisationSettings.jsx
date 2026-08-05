import React, { useState } from 'react'
import {
  Box, Typography, Tabs, Tab, Chip, IconButton, Menu, MenuItem, Checkbox, Divider,
  Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions,
  Snackbar, Alert, Table, TableHead, TableBody, TableRow, TableCell, TableContainer, Paper,
  TextField, InputAdornment, FormControl, Select,
} from '@mui/material'
import {
  MoreVertOutlined as MoreVertIcon,
  EditOutlined as EditIcon,
  ArchiveOutlined as ArchiveIcon,
  ArrowBackOutlined as BackIcon,
  SearchOutlined as SearchIcon,
  CalendarTodayOutlined as CalendarIcon,
} from '@mui/icons-material'
import { useRoles, PERMISSIONS } from './RolesContext'

const ORG_TABS = ['Appearance', 'Workload', 'Security', 'Calendar', 'Notifications', 'Role Permissions']

function formatDate(str) {
  const d = new Date(str)
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

// ─── Three-dot row menu ────────────────────────────────────────────────────────

function RowMenu({ row, onEdit, onArchive }) {
  const [anchor, setAnchor] = useState(null)
  return (
    <>
      <IconButton size="small" onClick={(e) => { e.stopPropagation(); setAnchor(e.currentTarget) }}>
        <MoreVertIcon fontSize="small" />
      </IconButton>
      <Menu anchorEl={anchor} open={Boolean(anchor)} onClose={() => setAnchor(null)} onClick={(e) => e.stopPropagation()}>
        <MenuItem onClick={() => { setAnchor(null); onEdit(row) }}>
          <EditIcon fontSize="small" sx={{ mr: 1 }} /> Edit
        </MenuItem>
        {row.status === 'Active' && (
          <MenuItem onClick={() => { setAnchor(null); onArchive(row) }} sx={{ color: 'text.secondary' }}>
            <ArchiveIcon fontSize="small" sx={{ mr: 1 }} /> Archive
          </MenuItem>
        )}
      </Menu>
    </>
  )
}

// ─── Screen 1 — Role Permissions list ─────────────────────────────────────────

function RolePermissionsList({ rows, onEdit, onArchive }) {
  const [search, setSearch] = useState('')
  const [dateFrom, setDateFrom] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')

  const colSx = { fontWeight: 600, fontSize: 13, color: 'text.secondary', borderBottom: '2px solid var(--color-border-primary)', py: 1.25, px: 2 }
  const cellSx = { fontSize: 14, py: 1.25, px: 2, borderBottom: '1px solid var(--color-border-primary)' }

  const filteredRows = [...rows.filter(r => r.status === 'Active'), ...rows.filter(r => r.status === 'Archived')]
    .filter((row) => {
      const matchesSearch = search.trim() === '' ||
        row.name.toLowerCase().includes(search.toLowerCase()) ||
        row.basedOn.toLowerCase().includes(search.toLowerCase())
      const matchesDate = dateFrom === '' || row.lastModified >= dateFrom
      const matchesStatus = statusFilter === 'All' || row.status === statusFilter
      return matchesSearch && matchesDate && matchesStatus
    })

  return (
    <Box>
      {/* Filter bar */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
        <TextField
          size="small" placeholder="Search" value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ width: 280, bgcolor: 'grey.100', borderRadius: 1, '& fieldset': { border: 'none' } }}
          InputProps={{ endAdornment: <InputAdornment position="end"><SearchIcon sx={{ fontSize: 18, color: 'text.disabled' }} /></InputAdornment> }}
        />
        <TextField
          size="small" type="date" value={dateFrom}
          onChange={(e) => setDateFrom(e.target.value)}
          sx={{ width: 190, bgcolor: 'grey.100', borderRadius: 1, '& fieldset': { border: 'none' } }}
          InputProps={{ endAdornment: <InputAdornment position="end"><CalendarIcon sx={{ fontSize: 18, color: 'text.disabled' }} /></InputAdornment> }}
        />
        <FormControl size="small" sx={{ width: 160, bgcolor: 'grey.100', borderRadius: 1, '& fieldset': { border: 'none' } }}>
          <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <MenuItem value="All">All</MenuItem>
            <MenuItem value="Active">Active</MenuItem>
            <MenuItem value="Archived">Archived</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid var(--color-border-primary)', borderRadius: 1 }}>
        <Table size="small">
          <TableHead>
            <TableRow sx={{ bgcolor: 'grey.50' }}>
              <TableCell sx={colSx}>Role name</TableCell>
              <TableCell sx={colSx}>Based on</TableCell>
              <TableCell sx={colSx}>Status</TableCell>
              <TableCell sx={colSx}>Last modified</TableCell>
              <TableCell sx={{ ...colSx, width: 48 }} />
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredRows.map((row) => (
              <TableRow key={row.id} hover onClick={() => onEdit(row)} sx={{ cursor: 'pointer', opacity: row.status === 'Archived' ? 0.6 : 1 }}>
                <TableCell sx={cellSx}><Typography variant="body2" fontWeight={500}>{row.name}</Typography></TableCell>
                <TableCell sx={{ ...cellSx, color: 'text.secondary' }}>{row.basedOn}</TableCell>
                <TableCell sx={cellSx}>
                  <Chip
                    label={row.status} size="small"
                    sx={{
                      bgcolor: row.status === 'Active' ? 'rgba(16,185,129,0.12)' : 'rgba(0,0,0,0.08)',
                      color: row.status === 'Active' ? '#065f46' : 'text.secondary',
                      fontWeight: 600, fontSize: 12,
                    }}
                  />
                </TableCell>
                <TableCell sx={{ ...cellSx, color: 'text.secondary' }}>{formatDate(row.lastModified)}</TableCell>
                <TableCell sx={{ ...cellSx, p: 0.5 }} onClick={(e) => e.stopPropagation()}>
                  <RowMenu row={row} onEdit={onEdit} onArchive={onArchive} />
                </TableCell>
              </TableRow>
            ))}
            {filteredRows.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} sx={{ ...cellSx, textAlign: 'center', py: 4, color: 'text.secondary' }}>
                  No roles match the current filters.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  )
}

// ─── Permission grid — view (plain text) / edit (checkboxes) ───────────────────

function PermissionGrid({ permissions, isEditMode, onToggle, onSelectAll }) {
  const categories = Object.entries(PERMISSIONS)

  if (!isEditMode) {
    const enabledCategories = categories
      .map(([category, perms]) => ({ category, perms: perms.filter(p => permissions.has(p)) }))
      .filter(({ perms }) => perms.length > 0)
    const cols = [[], [], []]
    enabledCategories.forEach((entry, i) => { cols[i % 3].push(entry) })

    return (
      <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 4, alignItems: 'start' }}>
        {cols.map((col, colIdx) => (
          <Box key={colIdx}>
            {col.map(({ category, perms }) => (
              <Box key={category} sx={{ mb: 4 }}>
                <Typography variant="body2" fontWeight={700} sx={{ mb: 1.25 }}>{category}</Typography>
                {perms.map((perm) => (
                  <Typography key={perm} variant="body2" sx={{ fontSize: 13, py: 0.5, lineHeight: 1.4 }}>{perm}</Typography>
                ))}
              </Box>
            ))}
          </Box>
        ))}
      </Box>
    )
  }

  const cols = [[], [], []]
  categories.forEach((entry, i) => { cols[i % 3].push(entry) })

  return (
    <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 4, alignItems: 'start' }}>
      {cols.map((col, colIdx) => (
        <Box key={colIdx}>
          {col.map(([category, perms]) => {
            const allChecked = perms.every(p => permissions.has(p))
            return (
              <Box key={category} sx={{ mb: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
                  <Typography variant="body2" fontWeight={700}>{category}</Typography>
                  <Box component="button" onClick={() => onSelectAll(category, perms, allChecked)}
                    sx={{ bgcolor: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--color-primary)', fontSize: 13, fontWeight: 600, fontFamily: 'inherit', p: 0, '&:hover': { textDecoration: 'underline' } }}>
                    {allChecked ? 'Deselect all' : 'Select all'}
                  </Box>
                </Box>
                {perms.map((perm) => {
                  const checked = permissions.has(perm)
                  return (
                    <Box key={perm} onClick={() => onToggle(perm)}
                      sx={{ display: 'flex', alignItems: 'center', gap: 1, py: 0.625, cursor: 'pointer', borderRadius: 0.5, '&:hover': { bgcolor: 'rgba(0,0,0,0.03)' } }}>
                      <Checkbox size="small" checked={checked} onChange={() => onToggle(perm)} onClick={(e) => e.stopPropagation()}
                        sx={{ p: 0.25, flexShrink: 0, '&.Mui-checked': { color: 'var(--color-primary)' } }} />
                      <Typography variant="body2" sx={{ fontSize: 13 }}>{perm}</Typography>
                    </Box>
                  )
                })}
              </Box>
            )
          })}
        </Box>
      ))}
    </Box>
  )
}

// ─── Screen 2 — Role detail ────────────────────────────────────────────────────

function RoleDetail({ role, onBack }) {
  const { updateRolePermissions, archiveRole } = useRoles()
  const [isEditMode, setIsEditMode] = useState(false)
  const [permissions, setPermissions] = useState(() => new Set(role.permissions))
  const [editPermissions, setEditPermissions] = useState(null)
  const [toast, setToast] = useState(false)
  const [menuAnchor, setMenuAnchor] = useState(null)
  const [archiveDialogOpen, setArchiveDialogOpen] = useState(false)

  const activePermissions = isEditMode ? editPermissions : permissions

  const handleStartEdit = () => { setEditPermissions(new Set(permissions)); setIsEditMode(true) }
  const handleCancelEdit = () => { setEditPermissions(null); setIsEditMode(false) }

  const handleToggle = (perm) => {
    setEditPermissions(prev => { const n = new Set(prev); n.has(perm) ? n.delete(perm) : n.add(perm); return n })
  }
  const handleSelectAll = (category, perms, allChecked) => {
    setEditPermissions(prev => { const n = new Set(prev); perms.forEach(p => allChecked ? n.delete(p) : n.add(p)); return n })
  }
  const handleSave = () => {
    setPermissions(editPermissions)
    updateRolePermissions(role.id, [...editPermissions])
    setEditPermissions(null)
    setIsEditMode(false)
    setToast(true)
  }
  const handleConfirmArchive = () => { setArchiveDialogOpen(false); archiveRole(role.id); onBack() }

  return (
    <Box sx={{ pb: 12 }}>
      {/* Breadcrumb */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 2 }}>
        <Box component="button" onClick={onBack} sx={{ bgcolor: 'transparent', border: 'none', cursor: 'pointer', color: 'text.secondary', fontSize: 13, fontFamily: 'inherit', p: 0, display: 'flex', alignItems: 'center', gap: 0.5, '&:hover': { color: 'text.primary' } }}>
          <BackIcon sx={{ fontSize: 14 }} /> Organisation Settings
        </Box>
        <Typography variant="caption" color="text.disabled">/</Typography>
        <Box component="button" onClick={onBack} sx={{ bgcolor: 'transparent', border: 'none', cursor: 'pointer', color: 'text.secondary', fontSize: 13, fontFamily: 'inherit', p: 0, '&:hover': { color: 'text.primary' } }}>Role Permissions</Box>
        <Typography variant="caption" color="text.disabled">/</Typography>
        <Typography variant="caption" sx={{ fontSize: 13, color: 'text.primary' }}>{role.name}</Typography>
      </Box>

      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 0.75 }}>
        <Box>
          <Typography variant="h5" fontWeight={700} sx={{ mb: 0.5 }}>{role.name}</Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Chip label={`Based on: ${role.basedOn}`} size="small" sx={{ bgcolor: 'grey.100', color: 'text.secondary', fontSize: 12, fontWeight: 500 }} />
          </Box>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {!isEditMode && (
            <Box component="button" onClick={handleStartEdit}
              sx={{ px: 2, py: 0.75, bgcolor: 'transparent', border: '1px solid var(--color-border-primary)', borderRadius: 1, cursor: 'pointer', fontWeight: 600, fontSize: 13, color: 'text.primary', fontFamily: 'inherit', '&:hover': { bgcolor: 'grey.50', borderColor: 'text.secondary' } }}>
              Edit permissions
            </Box>
          )}
          <IconButton size="small" onClick={(e) => setMenuAnchor(e.currentTarget)}><MoreVertIcon fontSize="small" /></IconButton>
          <Menu anchorEl={menuAnchor} open={Boolean(menuAnchor)} onClose={() => setMenuAnchor(null)}>
            {role.status === 'Active' && (
              <MenuItem onClick={() => { setMenuAnchor(null); setArchiveDialogOpen(true) }} sx={{ color: 'text.secondary' }}><ArchiveIcon fontSize="small" sx={{ mr: 1 }} /> Archive role</MenuItem>
            )}
          </Menu>
        </Box>
      </Box>

      <Divider sx={{ my: 3 }} />

      <PermissionGrid permissions={activePermissions} isEditMode={isEditMode} onToggle={handleToggle} onSelectAll={handleSelectAll} />

      {isEditMode && (
        <Box sx={{ position: 'fixed', bottom: 0, left: 0, right: 0, bgcolor: 'white', borderTop: '1px solid var(--color-border-primary)', px: 4, py: 2, display: 'flex', justifyContent: 'flex-end', gap: 1.5, zIndex: 1200 }}>
          <Box component="button" onClick={handleCancelEdit} sx={{ px: 2.5, py: 0.875, bgcolor: 'transparent', border: '1px solid var(--color-border-primary)', borderRadius: 1, cursor: 'pointer', fontWeight: 600, fontSize: 14, color: 'text.secondary', fontFamily: 'inherit', '&:hover': { bgcolor: 'grey.50' } }}>Cancel</Box>
          <Box component="button" onClick={handleSave} sx={{ px: 2.5, py: 0.875, bgcolor: 'var(--color-primary)', color: 'white', border: 'none', borderRadius: 1, cursor: 'pointer', fontWeight: 700, fontSize: 14, fontFamily: 'inherit', '&:hover': { opacity: 0.9 } }}>Save changes</Box>
        </Box>
      )}

      <Snackbar open={toast} autoHideDuration={4000} onClose={(_, reason) => { if (reason !== 'clickaway') setToast(false) }} anchorOrigin={{ vertical: 'top', horizontal: 'right' }}>
        <Alert severity="success" onClose={() => setToast(false)} sx={{ minWidth: 280 }}>Role updated successfully.</Alert>
      </Snackbar>

      <Dialog open={archiveDialogOpen} onClose={() => setArchiveDialogOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>Archive role</DialogTitle>
        <DialogContent>
          <DialogContentText>Are you sure you want to archive <strong>{role.name}</strong>? Staff members currently using this role will not be affected, but the role will no longer be available to assign to new users.</DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5, gap: 1 }}>
          <Box component="button" onClick={() => setArchiveDialogOpen(false)} sx={{ px: 2, py: 0.75, bgcolor: 'transparent', border: '1px solid var(--color-border-primary)', borderRadius: 1, cursor: 'pointer', fontWeight: 600, fontSize: 14, color: 'text.secondary', fontFamily: 'inherit', '&:hover': { bgcolor: 'grey.50' } }}>Cancel</Box>
          <Box component="button" onClick={handleConfirmArchive} sx={{ px: 2, py: 0.75, bgcolor: 'var(--color-primary)', color: 'white', border: 'none', borderRadius: 1, cursor: 'pointer', fontWeight: 700, fontSize: 14, fontFamily: 'inherit', '&:hover': { opacity: 0.9 } }}>Archive role</Box>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

// ─── Organisation Settings shell ───────────────────────────────────────────────

export default function OrganisationSettings() {
  const { roles, archiveRole } = useRoles()
  const [tabIndex, setTabIndex] = useState(5)
  const [selectedRole, setSelectedRole] = useState(null)
  const [archiveTarget, setArchiveTarget] = useState(null)
  const [archiveDialogOpen, setArchiveDialogOpen] = useState(false)

  // keep selectedRole in sync with latest context data
  const liveSelectedRole = selectedRole ? roles.find(r => r.id === selectedRole.id) : null

  const handleConfirmArchive = () => {
    archiveRole(archiveTarget.id)
    setArchiveDialogOpen(false)
    setArchiveTarget(null)
  }

  const tabsEl = (value, onChange) => (
    <Tabs value={value} onChange={onChange}
      sx={{ mb: 3, borderBottom: '1px solid var(--color-border-primary)',
        '& .MuiTab-root': { textTransform: 'none', fontSize: 14, minHeight: 44, px: 2 },
        '& .Mui-selected': { color: 'var(--color-primary)', fontWeight: 600 },
        '& .MuiTabs-indicator': { bgcolor: 'var(--color-primary)' } }}>
      {ORG_TABS.map((t) => <Tab key={t} label={t} />)}
    </Tabs>
  )

  if (liveSelectedRole) {
    return (
      <Box sx={{ p: 4 }}>
        <Typography variant="h4" fontWeight={700} sx={{ mb: 3 }}>Organisation Settings</Typography>
        {tabsEl(5, (_, v) => { if (v !== 5) setSelectedRole(null) })}
        <RoleDetail role={liveSelectedRole} onBack={() => setSelectedRole(null)} />
      </Box>
    )
  }

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" fontWeight={700} sx={{ mb: 3 }}>Organisation Settings</Typography>
      {tabsEl(tabIndex, (_, v) => setTabIndex(v))}

      {tabIndex !== 5 && (
        <Box sx={{ py: 4, color: 'text.secondary' }}>
          <Typography variant="body2">{ORG_TABS[tabIndex]} settings — select the <strong>Role Permissions</strong> tab to continue.</Typography>
        </Box>
      )}

      {tabIndex === 5 && (
        <Box>
          <Box sx={{ mb: 2.5 }}>
            <Typography variant="h6" fontWeight={700} sx={{ mb: 0.25 }}>Role Permissions</Typography>
            <Typography variant="body2" color="text.secondary">Manage custom permission sets based on standard system roles.</Typography>
          </Box>
          <RolePermissionsList rows={roles} onEdit={setSelectedRole} onArchive={(r) => { setArchiveTarget(r); setArchiveDialogOpen(true) }} />
        </Box>
      )}

      <Dialog open={archiveDialogOpen} onClose={() => setArchiveDialogOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>Archive role</DialogTitle>
        <DialogContent>
          <DialogContentText>Are you sure you want to archive <strong>{archiveTarget?.name}</strong>? Staff members currently using this role will not be affected.</DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5, gap: 1 }}>
          <Box component="button" onClick={() => setArchiveDialogOpen(false)} sx={{ px: 2, py: 0.75, bgcolor: 'transparent', border: '1px solid var(--color-border-primary)', borderRadius: 1, cursor: 'pointer', fontWeight: 600, fontSize: 14, color: 'text.secondary', fontFamily: 'inherit', '&:hover': { bgcolor: 'grey.50' } }}>Cancel</Box>
          <Box component="button" onClick={handleConfirmArchive} sx={{ px: 2, py: 0.75, bgcolor: 'var(--color-primary)', color: 'white', border: 'none', borderRadius: 1, cursor: 'pointer', fontWeight: 700, fontSize: 14, fontFamily: 'inherit', '&:hover': { opacity: 0.9 } }}>Archive role</Box>
        </DialogActions>
      </Dialog>
    </Box>
  )
}
