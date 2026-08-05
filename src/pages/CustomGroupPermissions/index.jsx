import React, { useState, useEffect } from 'react'
import {
  Box,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  Dialog,
  IconButton,
  InputAdornment,
  Switch,
  Divider,
  Tabs,
  Tab,
  Tooltip,
  Menu,
  Snackbar,
  Alert,
} from '@mui/material'

import {
  StarOutlined as StarIcon,
  CloseOutlined as CloseIcon,
  SearchOutlined as SearchIcon,
  ArrowDropDownOutlined as DropdownArrowIcon,
  HelpOutlineOutlined as HelpIcon,
  AddOutlined as AddIcon,
  RemoveCircleOutlineOutlined as RemoveCircleIcon,
} from '@mui/icons-material'

// ─── Data ──────────────────────────────────────────────────────────────────────

const PERMISSIONS = {
  'Athlete Screening': [
    'Questionnaire Create',
    'Questionnaires Admin',
    'Questionnaire Comments',
    'Delete Form Submission',
  ],
  Medical: [
    'View Issues',
    'Issues Admin',
    'Manage Availability',
    'View Availability',
    'Medical Graphing',
    'Export Medical Data',
    'View Medical History',
    'Diagnostic Admin',
  ],
  Reporting: [
    'View Reports',
    'Create Reports',
    'Export Reports',
  ],
}

const ALL_PERMISSIONS = Object.values(PERMISSIONS).flat()

const SYSTEM_GROUPS = {
  'Account Admin': ALL_PERMISSIONS,
  Staff: ['Questionnaire Create', 'Questionnaire Comments', 'View Issues', 'View Availability'],
  Doctor: [
    'View Issues', 'Issues Admin', 'Manage Availability', 'View Availability',
    'Medical Graphing', 'View Medical History', 'Questionnaire Create', 'Questionnaire Comments',
  ],
  Psychologist: [
    'Questionnaire Create', 'Questionnaire Comments', 'View Issues', 'View Availability', 'View Medical History',
  ],
  'Athletic Trainer / Therapist': [
    'Questionnaire Create', 'Questionnaire Comments', 'View Issues', 'Issues Admin',
    'Manage Availability', 'View Availability', 'Medical Graphing', 'View Medical History',
  ],
  Coach: [
    'Questionnaire Create', 'Questionnaire Comments', 'View Issues', 'View Availability', 'View Reports',
  ],
}

const SYSTEM_ROLE_NAMES = Object.keys(SYSTEM_GROUPS)

const INITIAL_CUSTOM_GROUP = {
  id: 'custom-doctor-export',
  name: 'Doctor – Export Access',
  basedOn: 'Doctor',
  permissions: [...SYSTEM_GROUPS['Doctor'], 'Export Medical Data'],
  isNew: true,
}

function defaultGroupName(basedOn) {
  return basedOn ? `${basedOn} – Custom` : ''
}


// ─── Save as Custom Group modal ────────────────────────────────────────────────

const CATEGORY_TABS = ['All', ...Object.keys(PERMISSIONS)]

function SaveCustomGroupModal({ open, onClose, initialBasedOn, initialPermissions, isEditing, onConfirm }) {
  const [basedOn, setBasedOn] = useState(initialBasedOn || 'Account Admin')
  const [groupName, setGroupName] = useState(defaultGroupName(initialBasedOn || 'Account Admin'))
  const [nameManuallyEdited, setNameManuallyEdited] = useState(false)
  const [search, setSearch] = useState('')
  const [tabIndex, setTabIndex] = useState(0)
  const [applyToExisting, setApplyToExisting] = useState(false)
  const [selected, setSelected] = useState(() => new Set(initialPermissions || SYSTEM_GROUPS['Account Admin']))
  const [activityLog, setActivityLog] = useState([])
  // Snapshot of permissions at open time — used for diff in edit mode
  const [originalPermissions, setOriginalPermissions] = useState(() => new Set(initialPermissions || []))

  useEffect(() => {
    if (open) {
      const base = initialBasedOn || 'Account Admin'
      const perms = new Set(initialPermissions || SYSTEM_GROUPS[base] || [])
      setBasedOn(base)
      setGroupName(defaultGroupName(base))
      setNameManuallyEdited(false)
      setSelected(perms)
      setOriginalPermissions(new Set(perms))
      setSearch('')
      setTabIndex(0)
      setApplyToExisting(false)
      setActivityLog([])
    }
  }, [open])

  // When basedOn changes, update permissions and auto-name unless user edited it
  const handleBasedOnChange = (newRole) => {
    setBasedOn(newRole)
    const newSelected = new Set(SYSTEM_GROUPS[newRole] || [])
    setSelected(newSelected)
    setOriginalPermissions(new Set(newSelected))
    setTabIndex(0)
    if (!nameManuallyEdited) setGroupName(defaultGroupName(newRole))
  }

  const handleNameChange = (val) => {
    setGroupName(val)
    setNameManuallyEdited(true)
  }

  const activeTab = CATEGORY_TABS[tabIndex]

  const visibleCategories = Object.entries(PERMISSIONS).reduce((acc, [cat, perms]) => {
    if (activeTab !== 'All' && activeTab !== cat) return acc
    const filtered = search.trim()
      ? perms.filter(p => p.toLowerCase().includes(search.toLowerCase()))
      : perms
    if (filtered.length > 0) acc.push({ category: cat, perms: filtered })
    return acc
  }, [])

  const totalShown = visibleCategories.reduce((sum, { perms }) => sum + perms.length, 0)

  // Diff: compare current selected vs base role
  const basePermsForRole = new Set(SYSTEM_GROUPS[basedOn] || [])
  const newPerms = new Set(ALL_PERMISSIONS.filter(p => selected.has(p) && !basePermsForRole.has(p)))
  const addedVsBase = ALL_PERMISSIONS.filter(p => selected.has(p) && !basePermsForRole.has(p))
  const removedVsBase = ALL_PERMISSIONS.filter(p => !selected.has(p) && basePermsForRole.has(p))

  const toggle = (perm) => {
    setSelected(prev => {
      const n = new Set(prev)
      const adding = !n.has(perm)
      adding ? n.add(perm) : n.delete(perm)
      setActivityLog(log => [{ id: Date.now(), perm, action: adding ? 'added' : 'removed' }, ...log].slice(0, 50))
      return n
    })
  }

  const resolvedName = groupName.trim() || defaultGroupName(basedOn)

  const handleConfirm = () => {
    onConfirm({
      id: `custom-${Date.now()}`,
      name: resolvedName,
      basedOn,
      permissions: [...selected],
      isNew: true,
    })
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth={false}
      PaperProps={{ sx: { width: 760, maxHeight: '90vh', display: 'flex', flexDirection: 'column', borderRadius: 2 } }}
    >
      {/* Header */}
      <Box sx={{ px: 3, py: 2.5, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
        <Typography variant="subtitle1" fontWeight={700} sx={{ fontSize: 18 }}>Save as custom group</Typography>
        <IconButton size="small" onClick={onClose}><CloseIcon /></IconButton>
      </Box>

      {/* Based on (primary) + Group name row */}
      <Box sx={{ px: 3, pb: 2, display: 'flex', gap: 2, flexShrink: 0 }}>
        <FormControl variant="filled" size="small" sx={{ flex: 1 }}>
          <InputLabel>Based on *</InputLabel>
          <Select value={basedOn} onChange={(e) => handleBasedOnChange(e.target.value)}>
            {SYSTEM_ROLE_NAMES.map(role => (
              <MenuItem key={role} value={role}>{role}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField
          variant="filled"
          size="small"
          label="Group name (optional)"
          placeholder={defaultGroupName(basedOn)}
          value={groupName}
          onChange={(e) => handleNameChange(e.target.value)}
          sx={{ flex: 2 }}
        />
      </Box>

      {/* Body */}
      <Box sx={{ display: 'flex', flex: 1, overflow: 'hidden', borderTop: '1px solid var(--color-border-primary)' }}>
        {/* Left panel — dominant, primary working area */}
        <Box sx={{ flex: 3, display: 'flex', flexDirection: 'column', overflow: 'hidden', borderRight: '1px solid var(--color-border-primary)' }}>
          <Box sx={{ px: 2.5, pt: 1.5, pb: 1, flexShrink: 0 }}>
            <TextField
              variant="filled" size="small" fullWidth
              placeholder="Search permissions..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon sx={{ fontSize: 18, color: 'text.disabled' }} /></InputAdornment> }}
            />
          </Box>

          <Box sx={{ borderBottom: '1px solid var(--color-border-primary)', flexShrink: 0 }}>
            <Tabs
              value={tabIndex}
              onChange={(_, v) => setTabIndex(v)}
              variant="scrollable"
              scrollButtons={false}
              sx={{
                minHeight: 36,
                '& .MuiTab-root': { minHeight: 36, py: 0, px: 2, fontSize: 12, textTransform: 'none', color: 'text.secondary' },
                '& .Mui-selected': { color: 'var(--color-primary)', fontWeight: 600 },
                '& .MuiTabs-indicator': { bgcolor: 'var(--color-primary)' },
              }}
            >
              {CATEGORY_TABS.map(cat => <Tab key={cat} label={cat} />)}
            </Tabs>
          </Box>

          <Box sx={{ px: 2.5, pb: 0.75, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
            <Typography variant="caption" color="text.disabled">{totalShown} permissions shown</Typography>
            <Typography variant="caption" sx={{ fontWeight: 600, color: 'var(--color-primary)' }}>{selected.size} selected</Typography>
          </Box>

          <Box sx={{ flex: 1, overflow: 'auto' }}>
            {visibleCategories.map(({ category, perms }) => (
              <Box key={category}>
                <Box sx={{ px: 2.5, py: 0.75, borderBottom: '1px solid var(--color-border-primary)' }}>
                  <Typography variant="body2" fontWeight={600}>{category}</Typography>
                </Box>
                {perms.map((perm) => {
                  const isNewPerm = newPerms.has(perm)
                  const isChecked = selected.has(perm)
                  return (
                    <Box
                      key={perm}
                      onClick={() => toggle(perm)}
                      sx={{
                        display: 'flex', alignItems: 'center', gap: 1,
                        px: 2.5, py: 0.875, borderBottom: '1px solid var(--color-border-primary)',
                        cursor: 'pointer',
                        bgcolor: isChecked ? 'rgba(59,73,96,0.04)' : 'transparent',
                        '&:hover': { bgcolor: isChecked ? 'rgba(59,73,96,0.06)' : 'rgba(0,0,0,0.03)' },
                        '&:hover .remove-icon': { opacity: 1 },
                      }}
                    >
                      <Checkbox
                        size="small" checked={isChecked}
                        onChange={() => toggle(perm)} onClick={(e) => e.stopPropagation()}
                        sx={{ p: 0.25, flexShrink: 0, '&.Mui-checked': { color: 'var(--color-primary)' } }}
                      />
                      <Typography variant="body2" sx={{ flex: 1, color: isNewPerm && isChecked ? '#1d4ed8' : 'text.primary', fontWeight: isNewPerm ? 500 : 400 }}>
                        {perm}
                      </Typography>
                      {isNewPerm && isChecked && (
                        <Box sx={{ px: 0.75, py: 0.125, bgcolor: '#dbeafe', borderRadius: 0.5, flexShrink: 0 }}>
                          <Typography sx={{ fontSize: 10, fontWeight: 700, color: '#1d4ed8' }}>+ added</Typography>
                        </Box>
                      )}
                      {isChecked && (
                        <RemoveCircleIcon
                          className="remove-icon"
                          onClick={(e) => { e.stopPropagation(); toggle(perm) }}
                          sx={{ fontSize: 16, color: 'error.main', flexShrink: 0, opacity: 0, transition: 'opacity 0.1s', cursor: 'pointer' }}
                        />
                      )}
                    </Box>
                  )
                })}
              </Box>
            ))}
          </Box>

          {/* Apply to existing toggle */}
          <Box sx={{ px: 2.5, py: 1.5, borderTop: '1px solid var(--color-border-primary)', display: 'flex', alignItems: 'center', gap: 1.5, flexShrink: 0 }}>
            <Typography variant="body2" color="text.secondary" sx={{ flex: 1 }}>
              Also apply these permissions to existing staff with the{' '}
              <Box component="span" fontWeight={600} color="text.primary">{basedOn}</Box> role
            </Typography>
            <Switch
              size="small" checked={applyToExisting}
              onChange={(e) => setApplyToExisting(e.target.checked)}
              sx={{ flexShrink: 0, '& .Mui-checked': { color: 'var(--color-primary)' }, '& .Mui-checked + .MuiSwitch-track': { bgcolor: 'var(--color-primary)' } }}
            />
          </Box>
        </Box>

        {/* Right panel — diff (edit mode) or activity feed (create mode) */}
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', bgcolor: 'grey.50' }}>
          <Box sx={{ px: 2, py: 1.25, borderBottom: '1px solid var(--color-border-primary)', flexShrink: 0 }}>
            <Typography variant="caption" fontWeight={700} color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: 0.5, fontSize: 10 }}>
              {isEditing ? `Changes from ${basedOn}` : 'Recent changes'}
            </Typography>
          </Box>
          <Box sx={{ flex: 1, overflow: 'auto', px: 2, py: 1 }}>
            {isEditing ? (
              addedVsBase.length === 0 && removedVsBase.length === 0 ? (
                <Typography variant="caption" color="text.disabled" sx={{ display: 'block', mt: 1 }}>
                  No changes from the original {basedOn} role yet.
                </Typography>
              ) : (
                <>
                  {addedVsBase.map(perm => (
                    <Box key={perm} sx={{ display: 'flex', alignItems: 'baseline', gap: 0.75, py: 0.375 }}>
                      <Typography variant="caption" sx={{ fontWeight: 700, fontSize: 12, color: 'success.main', flexShrink: 0 }}>+</Typography>
                      <Typography variant="caption" sx={{ fontSize: 12, color: 'success.main', fontWeight: 500 }}>{perm}</Typography>
                    </Box>
                  ))}
                  {removedVsBase.map(perm => (
                    <Box key={perm} sx={{ display: 'flex', alignItems: 'baseline', gap: 0.75, py: 0.375 }}>
                      <Typography variant="caption" sx={{ fontWeight: 700, fontSize: 12, color: 'error.main', flexShrink: 0 }}>−</Typography>
                      <Typography variant="caption" sx={{ fontSize: 12, color: 'error.main', fontWeight: 500 }}>{perm}</Typography>
                    </Box>
                  ))}
                </>
              )
            ) : (
              activityLog.length === 0 ? (
                <Typography variant="caption" color="text.disabled" sx={{ display: 'block', mt: 1 }}>
                  Changes will appear here as you edit.
                </Typography>
              ) : (
                activityLog.map((entry) => (
                  <Box key={entry.id} sx={{ display: 'flex', alignItems: 'baseline', gap: 0.75, py: 0.5 }}>
                    <Typography variant="caption" sx={{ fontWeight: 700, fontSize: 12, flexShrink: 0, color: entry.action === 'added' ? 'success.main' : 'error.main' }}>
                      {entry.action === 'added' ? '✓' : '✗'}
                    </Typography>
                    <Typography variant="caption" sx={{ fontSize: 12, color: 'text.primary', lineHeight: 1.4 }}>
                      <Box component="span" fontWeight={500}>{entry.perm}</Box>
                      {' '}
                      <Box component="span" color="text.secondary">{entry.action}</Box>
                    </Typography>
                  </Box>
                ))
              )
            )}
          </Box>
        </Box>
      </Box>

      {/* Footer */}
      <Box sx={{ px: 3, py: 2, borderTop: '1px solid var(--color-border-primary)', display: 'flex', justifyContent: 'flex-end', gap: 1.5, flexShrink: 0 }}>
        <Box component="button" onClick={onClose} sx={{ px: 2.5, py: 0.875, bgcolor: 'transparent', border: '1px solid var(--color-border-primary)', borderRadius: 1, cursor: 'pointer', fontWeight: 600, fontSize: 14, color: 'text.secondary', fontFamily: 'inherit', '&:hover': { bgcolor: 'grey.50' } }}>
          Cancel
        </Box>
        <Box component="button" onClick={handleConfirm} sx={{ px: 2.5, py: 0.875, bgcolor: 'var(--color-primary)', color: 'white', border: 'none', borderRadius: 1, cursor: 'pointer', fontWeight: 700, fontSize: 14, fontFamily: 'inherit', '&:hover': { bgcolor: 'var(--color-primary-hover)' } }}>
          Create custom group
        </Box>
      </Box>
    </Dialog>
  )
}

// ─── Main page ─────────────────────────────────────────────────────────────────

export default function CustomGroupPermissionsV1() {
  const [groupMenuAnchor, setGroupMenuAnchor] = useState(null)
  const [customGroups, setCustomGroups] = useState([INITIAL_CUSTOM_GROUP])
  const groupOpen = Boolean(groupMenuAnchor)

  const [selectedGroup, setSelectedGroup] = useState('')
  const [extraPermissions, setExtraPermissions] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [modalEntryRole, setModalEntryRole] = useState(null)
  const [nonStandardAlert, setNonStandardAlert] = useState(false)
  const [justCreatedGroup, setJustCreatedGroup] = useState(null)

  // Toast state
  const [toast, setToast] = useState({ open: false, group: null })
  // Edit mode — reopens modal with existing group's data
  const [editingGroup, setEditingGroup] = useState(null)

  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName]   = useState('')
  const [email, setEmail]         = useState('')
  const [dob, setDob]             = useState('')
  const [language, setLanguage]   = useState('')

  const isCustomSelected = selectedGroup.startsWith('custom:')
  const customGroupId    = isCustomSelected ? selectedGroup.replace('custom:', '') : null
  const customGroupObj   = customGroupId ? customGroups.find(g => g.id === customGroupId) : null
  const systemRoleName   = !isCustomSelected ? selectedGroup : null
  const basePermissions  = systemRoleName ? (SYSTEM_GROUPS[systemRoleName] || []) : []
  const activePermissions = customGroupObj
    ? customGroupObj.permissions
    : [...basePermissions, ...extraPermissions]

  const showPermissionsSection = Boolean(selectedGroup)
  const showAddUniqueButton    = Boolean(systemRoleName && selectedGroup)

  const handleGroupSelect = (value) => {
    setSelectedGroup(value)
    setGroupMenuAnchor(null)
    setExtraPermissions([])
    setNonStandardAlert(false)
    setJustCreatedGroup(null)
  }

  const handleOpenModalFromRole = () => {
    setModalEntryRole(systemRoleName)
    setEditingGroup(null)
    setShowModal(true)
  }

  const handleOpenModalFromDropdown = () => {
    setGroupMenuAnchor(null)
    setModalEntryRole(null)
    setEditingGroup(null)
    setShowModal(true)
  }

  const handleNotNow = () => {
    setNonStandardAlert(true)
  }

  const handleModalConfirm = (newGroup) => {
    setCustomGroups(prev => [newGroup, ...prev])
    setJustCreatedGroup(newGroup.id)
    setSelectedGroup(`custom:${newGroup.id}`)
    setExtraPermissions([])
    setNonStandardAlert(false)
    setShowModal(false)
    setEditingGroup(null)
    setToast({ open: true, group: newGroup })
  }

  const handleEditGroup = (group) => {
    setEditingGroup(group)
    setModalEntryRole(group.basedOn)
    setShowModal(true)
    setToast({ open: false, group: null })
  }

  const handleViewGroup = (group) => {
    setSelectedGroup(`custom:${group.id}`)
    setGroupMenuAnchor(null)
    setToast({ open: false, group: null })
  }

  const handleEditConfirm = (updatedGroup) => {
    setCustomGroups(prev => prev.map(g => g.id === editingGroup.id ? { ...updatedGroup, id: editingGroup.id } : g))
    setShowModal(false)
    setEditingGroup(null)
  }

  const groupDisplayValue = () => {
    if (!selectedGroup) return ''
    if (isCustomSelected && customGroupObj) return customGroupObj.name
    return selectedGroup
  }

  const modalInitialBasedOn = editingGroup
    ? editingGroup.basedOn
    : (modalEntryRole || 'Account Admin')

  const modalInitialPermissions = editingGroup
    ? editingGroup.permissions
    : (modalEntryRole ? [...(SYSTEM_GROUPS[modalEntryRole] || []), ...extraPermissions] : null)

  return (
    <Box sx={{ p: 3, maxWidth: '66%' }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" fontWeight={700}>Add new staff member</Typography>
      </Box>

      <Box sx={{ bgcolor: 'white', border: '1px solid var(--color-border-primary)', borderRadius: 2, p: 3 }}>
        <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 2, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: 0.5, fontSize: 11 }}>
          User Details
        </Typography>
        <Divider sx={{ mb: 2.5 }} />

        {/* Row 1: First Name | Last Name | Email */}
        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 2, mb: 2 }}>
          <TextField variant="filled" size="small" label="First name" value={firstName} onChange={(e) => setFirstName(e.target.value)} fullWidth />
          <TextField variant="filled" size="small" label="Last name" value={lastName} onChange={(e) => setLastName(e.target.value)} fullWidth />
          <TextField variant="filled" size="small" label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} fullWidth />
        </Box>

        {/* Row 2: Date of birth | Group | Language */}
        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 2, mb: 3 }}>
          <TextField variant="filled" size="small" label="Date of birth" placeholder="Nothing selected" value={dob} onChange={(e) => setDob(e.target.value)} fullWidth />

          {/* Group — custom trigger */}
          <Box>
            <Box
              onClick={(e) => setGroupMenuAnchor(groupMenuAnchor ? null : e.currentTarget)}
              sx={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                px: 1.5, pt: selectedGroup ? '20px' : 1.375, pb: 0.875,
                bgcolor: 'rgba(0,0,0,0.06)', borderRadius: '4px 4px 0 0',
                borderBottom: groupOpen ? '2px solid var(--color-primary)' : '1px solid rgba(0,0,0,0.42)',
                cursor: 'pointer', minHeight: 48, position: 'relative',
                '&:hover': { bgcolor: 'rgba(0,0,0,0.09)' },
              }}
            >
              <Typography variant="caption" sx={{ position: 'absolute', top: 7, left: 12, color: groupOpen ? 'var(--color-primary)' : 'rgba(0,0,0,0.6)', fontSize: 12, pointerEvents: 'none' }}>
                Group
              </Typography>
              <Typography variant="body2" sx={{ color: selectedGroup ? 'text.primary' : 'transparent' }}>
                {groupDisplayValue() || ' '}
              </Typography>
              <DropdownArrowIcon sx={{ fontSize: 22, color: 'text.secondary', flexShrink: 0, transform: groupOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.15s' }} />
            </Box>
          </Box>

          <FormControl variant="filled" size="small" fullWidth>
            <InputLabel>Language</InputLabel>
            <Select value={language} onChange={(e) => setLanguage(e.target.value)}>
              <MenuItem value=""><em>Use organisation language setting</em></MenuItem>
              <MenuItem value="en">English</MenuItem>
              <MenuItem value="es">Spanish</MenuItem>
              <MenuItem value="fr">French</MenuItem>
              <MenuItem value="de">German</MenuItem>
              <MenuItem value="pt">Portuguese</MenuItem>
            </Select>
          </FormControl>
        </Box>

        {/* Group dropdown Menu */}
        <Menu
          anchorEl={groupMenuAnchor}
          open={groupOpen}
          onClose={() => setGroupMenuAnchor(null)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
          transformOrigin={{ vertical: 'top', horizontal: 'left' }}
          disableAutoFocusItem
          PaperProps={{ sx: { width: groupMenuAnchor?.offsetWidth || 280, maxHeight: 380 } }}
        >
          {/* Standard roles */}
          <Box sx={{ px: 2, py: 0.625, bgcolor: 'grey.100', borderBottom: '1px solid var(--color-border-primary)' }}>
            <Typography variant="caption" fontWeight={700} color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: 0.5, fontSize: 10 }}>
              Standard roles
            </Typography>
          </Box>
          {SYSTEM_ROLE_NAMES.map((role) => (
            <MenuItem key={role} onClick={() => handleGroupSelect(role)} selected={selectedGroup === role} sx={{ py: 1, px: 2 }}>
              <Typography variant="body2">{role}</Typography>
            </MenuItem>
          ))}

          {/* Custom groups */}
          {customGroups.length > 0 && [
            <Box key="custom-header" sx={{ px: 2, py: 0.625, bgcolor: 'grey.100', borderTop: '1px solid var(--color-border-primary)', borderBottom: '1px solid var(--color-border-primary)' }}>
              <Typography variant="caption" fontWeight={700} color="var(--color-primary)" sx={{ textTransform: 'uppercase', letterSpacing: 0.5, fontSize: 10 }}>
                Your custom groups
              </Typography>
            </Box>,
            ...customGroups.map((group) => (
              <MenuItem key={group.id} onClick={() => handleGroupSelect(`custom:${group.id}`)} selected={selectedGroup === `custom:${group.id}`} sx={{ py: 1, px: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: '100%' }}>
                  <StarIcon sx={{ fontSize: 14, color: 'var(--color-primary)', flexShrink: 0 }} />
                  <Typography variant="body2" sx={{ flex: 1, color: 'var(--color-primary)', fontWeight: 500 }}>{group.name}</Typography>
                  {(group.isNew || group.id === justCreatedGroup) && (
                    <Box sx={{ px: 0.75, py: 0.125, bgcolor: '#dbeafe', borderRadius: 0.5, fontSize: 10, fontWeight: 700, color: '#1d4ed8' }}>New</Box>
                  )}
                </Box>
              </MenuItem>
            )),
          ]}

          {/* Create custom group — bottom action */}
          <Box sx={{ borderTop: '1px solid var(--color-border-primary)', mt: 0.5 }}>
            <MenuItem onClick={handleOpenModalFromDropdown} sx={{ py: 1, px: 2, color: 'var(--color-primary)' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <AddIcon sx={{ fontSize: 16 }} />
                <Typography variant="body2" fontWeight={600} color="var(--color-primary)">Create custom group</Typography>
              </Box>
            </MenuItem>
          </Box>
        </Menu>

        {/* Permissions section */}
        {showPermissionsSection && (
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
              <Typography variant="subtitle2" fontWeight={700} sx={{ fontSize: 15 }}>Permissions</Typography>
              <Tooltip title="Permissions granted to this user" placement="right">
                <HelpIcon sx={{ fontSize: 16, color: 'text.disabled' }} />
              </Tooltip>
              {showAddUniqueButton && !nonStandardAlert && (
                <Box
                  component="button"
                  onClick={handleOpenModalFromRole}
                  sx={{
                    ml: 0.5, px: 1.5, py: 0.625,
                    bgcolor: 'transparent', border: '1px solid var(--color-primary)',
                    borderRadius: 1, cursor: 'pointer',
                    color: 'var(--color-primary)', fontWeight: 600, fontSize: 13,
                    fontFamily: 'inherit',
                    '&:hover': { bgcolor: 'rgba(59,73,96,0.06)' },
                  }}
                >
                  Add unique permission to group
                </Box>
              )}
              {isCustomSelected && customGroupObj && (
                <Box
                  component="button"
                  onClick={() => handleEditGroup(customGroupObj)}
                  sx={{
                    ml: 0.5, px: 1.5, py: 0.625,
                    bgcolor: 'transparent', border: '1px solid var(--color-border-primary)',
                    borderRadius: 1, cursor: 'pointer',
                    color: 'text.secondary', fontWeight: 600, fontSize: 13,
                    fontFamily: 'inherit',
                    '&:hover': { bgcolor: 'rgba(0,0,0,0.04)', borderColor: 'text.secondary' },
                  }}
                >
                  Edit permissions
                </Box>
              )}
            </Box>

            {/* Permissions two-column grid */}
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0, border: '1px solid var(--color-border-primary)', borderRadius: 1, overflow: 'hidden' }}>
              {Object.entries(PERMISSIONS).map(([category, perms]) => (
                <Box key={category}>
                  <Box sx={{ px: 2, py: 0.875, bgcolor: 'grey.50', borderBottom: '1px solid var(--color-border-primary)' }}>
                    <Typography variant="caption" fontWeight={600} color="text.secondary">{category}</Typography>
                  </Box>
                  {perms.map((perm) => {
                    const isActive = activePermissions.includes(perm)
                    const isExtra = extraPermissions.includes(perm)
                    return (
                      <Box
                        key={perm}
                        sx={{
                          display: 'flex', alignItems: 'center', gap: 1,
                          px: 2, py: 0.75, borderBottom: '1px solid var(--color-border-primary)',
                          bgcolor: isExtra ? 'rgba(29,78,216,0.04)' : 'transparent',
                        }}
                      >
                        <Checkbox size="small" checked={isActive} disabled
                          sx={{ p: 0.25, flexShrink: 0, '&.Mui-disabled': { color: isActive ? 'var(--color-primary)' : 'action.disabled' } }}
                        />
                        <Typography variant="body2" sx={{ flex: 1, fontSize: 13, color: isExtra ? '#1d4ed8' : isActive ? 'text.primary' : 'text.disabled' }}>
                          {perm}
                        </Typography>
                        {isExtra && (
                          <Typography variant="caption" sx={{ fontSize: 11, color: '#1d4ed8', fontWeight: 600, flexShrink: 0 }}>+ added</Typography>
                        )}
                      </Box>
                    )
                  })}
                </Box>
              ))}
            </Box>

            {/* Amber banner */}
            {nonStandardAlert && (
              <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 2, px: 2.5, py: 1.75, bgcolor: '#fffbeb', border: '1px solid #fcd34d', borderRadius: 1 }}>
                <StarIcon sx={{ fontSize: 18, color: '#d97706', flexShrink: 0 }} />
                <Box sx={{ flex: 1 }}>
                  <Typography variant="body2" fontWeight={600} sx={{ color: '#92400e', lineHeight: 1.3 }}>
                    You've added permissions not in the standard {systemRoleName} role.
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#b45309' }}>
                    Save this combination as a reusable custom group for future staff?
                  </Typography>
                </Box>
                <Box component="button" onClick={handleOpenModalFromRole}
                  sx={{ px: 2, py: 0.75, bgcolor: '#d97706', color: 'white', border: 'none', borderRadius: 1, cursor: 'pointer', fontWeight: 700, fontSize: 13, fontFamily: 'inherit', whiteSpace: 'nowrap', '&:hover': { bgcolor: '#b45309' } }}>
                  Save as custom group
                </Box>
                <Box component="button" onClick={() => setNonStandardAlert(false)}
                  sx={{ bgcolor: 'transparent', border: 'none', cursor: 'pointer', color: '#92400e', fontSize: 13, fontFamily: 'inherit', textDecoration: 'underline', whiteSpace: 'nowrap', '&:hover': { color: '#78350f' } }}>
                  Not now
                </Box>
              </Box>
            )}

            {showAddUniqueButton && !nonStandardAlert && (
              <Box sx={{ mt: 1.5 }}>
                <Box component="button" onClick={handleNotNow}
                  sx={{ bgcolor: 'transparent', border: 'none', cursor: 'pointer', color: 'text.secondary', fontSize: 13, fontFamily: 'inherit', p: 0, textDecoration: 'underline', '&:hover': { color: 'text.primary' } }}>
                  Not now
                </Box>
              </Box>
            )}
          </Box>
        )}

        <Divider sx={{ my: 3 }} />

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1.5 }}>
          <Box component="button" sx={{ px: 2.5, py: 0.875, bgcolor: 'var(--color-secondary)', border: 'none', borderRadius: 1, cursor: 'pointer', fontWeight: 600, fontSize: 14, color: 'var(--color-primary)', fontFamily: 'inherit', '&:hover': { bgcolor: 'var(--color-secondary-hover)' } }}>
            Cancel
          </Box>
          <Box component="button" sx={{ px: 2.5, py: 0.875, bgcolor: 'var(--color-primary)', color: 'white', border: 'none', borderRadius: 1, cursor: 'pointer', fontWeight: 700, fontSize: 14, fontFamily: 'inherit', '&:hover': { bgcolor: 'var(--color-primary-hover)' } }}>
            Add staff member
          </Box>
        </Box>
      </Box>

      {/* Modal */}
      {showModal && (
        <SaveCustomGroupModal
          open
          onClose={() => { setShowModal(false); setEditingGroup(null) }}
          initialBasedOn={modalInitialBasedOn}
          initialPermissions={modalInitialPermissions}
          isEditing={Boolean(editingGroup)}
          onConfirm={editingGroup ? handleEditConfirm : handleModalConfirm}
        />
      )}

      {/* Success toast */}
      <Snackbar
        open={toast.open}
        autoHideDuration={4000}
        onClose={(_, reason) => { if (reason !== 'clickaway') setToast(t => ({ ...t, open: false })) }}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert
          severity="success"
          onClose={() => setToast(t => ({ ...t, open: false }))}
          sx={{ minWidth: 280 }}
        >
          Custom group created successfully.
        </Alert>
      </Snackbar>
    </Box>
  )
}
