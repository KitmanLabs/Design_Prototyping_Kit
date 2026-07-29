import React, { useState } from 'react'
import {
  Box, Typography, Avatar, Divider, Radio, RadioGroup, FormControlLabel,
  TextField, InputAdornment, Checkbox, Menu, MenuItem, Snackbar, Alert,
} from '@mui/material'
import {
  CalendarTodayOutlined as CalendarIcon,
  KeyboardArrowDownOutlined as ArrowDownIcon,
  ArrowBackOutlined as BackIcon,
} from '@mui/icons-material'
import { useRoles, PERMISSIONS } from './RolesContext'
import { initials } from './staffData'

export default function StaffProfile({ staff, onBack }) {
  const { customRoles, systemRoleNames, getRolePermissions } = useRoles()

  const [status, setStatus] = useState(staff.status)
  const [role, setRole] = useState(staff.role)
  const [menuAnchor, setMenuAnchor] = useState(null)
  const [toast, setToast] = useState(false)

  const open = Boolean(menuAnchor)
  const activePermissions = new Set(getRolePermissions(role))

  const handleSelectRole = (name) => {
    setRole(name)
    setMenuAnchor(null)
  }

  const handleSave = () => {
    setToast(true)
  }

  // Three-column distribution of categories
  const categories = Object.entries(PERMISSIONS)
  const cols = [[], [], []]
  categories.forEach((entry, i) => cols[i % 3].push(entry))

  return (
    <Box sx={{ p: 4, pb: 10 }}>
      {/* Back */}
      <Box
        component="button"
        onClick={onBack}
        sx={{
          bgcolor: 'transparent', border: 'none', cursor: 'pointer', color: 'text.secondary',
          fontSize: 13, fontFamily: 'inherit', p: 0, mb: 2, display: 'flex', alignItems: 'center', gap: 0.5,
          '&:hover': { color: 'text.primary' },
        }}
      >
        <BackIcon sx={{ fontSize: 14 }} /> Back to Manage Staff Users
      </Box>

      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2.5, mb: 3 }}>
        <Avatar sx={{ width: 72, height: 72, bgcolor: 'grey.200', color: 'text.secondary', fontSize: 26, fontWeight: 700 }}>
          {initials(staff.name)}
        </Avatar>
        <Box>
          <Typography variant="h5" fontWeight={700}>{staff.name}</Typography>
          <Typography variant="body2" color="text.secondary">
            Username: <Box component="span" fontWeight={600} color="text.primary">{staff.username}</Box>
          </Typography>
        </Box>
      </Box>

      <Divider sx={{ mb: 3 }} />

      {/* Account */}
      <Typography variant="h6" fontWeight={700} sx={{ mb: 1.5 }}>Account</Typography>
      <Typography variant="body2" fontWeight={600} color="text.secondary" sx={{ mb: 1 }}>Status</Typography>
      <RadioGroup value={status} onChange={(e) => setStatus(e.target.value)}>
        <FormControlLabel value="Active" control={<Radio size="small" sx={{ '&.Mui-checked': { color: 'var(--color-primary)' } }} />} label="Active" />
        <FormControlLabel value="Inactive" control={<Radio size="small" sx={{ '&.Mui-checked': { color: 'var(--color-primary)' } }} />} label="Inactive" />
      </RadioGroup>

      <Divider sx={{ my: 3 }} />

      {/* Personal Details */}
      <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>Personal Details</Typography>
      <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 4, mb: 1, maxWidth: 900 }}>
        <Box>
          <Typography variant="body2" fontWeight={600} color="text.secondary" sx={{ mb: 0.75 }}>Date of birth</Typography>
          <TextField
            size="small" fullWidth placeholder="Nothing selected"
            sx={{ bgcolor: 'grey.100', borderRadius: 1, '& fieldset': { border: '1px solid var(--color-border-primary)' } }}
            InputProps={{ endAdornment: <InputAdornment position="end"><CalendarIcon sx={{ fontSize: 18, color: 'text.disabled' }} /></InputAdornment> }}
          />
        </Box>
        <Box>
          <Typography variant="body2" fontWeight={600} color="text.secondary" sx={{ mb: 0.75 }}>Mobile number</Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <TextField size="small" placeholder="Select a country..." sx={{ width: 160, '& fieldset': { borderColor: 'var(--color-border-primary)' } }} />
            <TextField size="small" fullWidth sx={{ bgcolor: 'grey.100', '& fieldset': { border: '1px solid var(--color-border-primary)' } }} />
          </Box>
          <FormControlLabel
            sx={{ mt: 1 }}
            control={<Checkbox size="small" sx={{ '&.Mui-checked': { color: 'var(--color-primary)' } }} />}
            label={<Typography variant="body2">Mobile number verified</Typography>}
          />
        </Box>
      </Box>

      <Divider sx={{ my: 3 }} />

      {/* Permissions */}
      <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>Permissions</Typography>

      {/* Role dropdown */}
      <Box
        onClick={(e) => setMenuAnchor(e.currentTarget)}
        sx={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          width: 480, px: 2, py: 1.25, mb: 3,
          border: '1px solid var(--color-border-primary)', borderRadius: 1,
          cursor: 'pointer', bgcolor: 'white',
          '&:hover': { borderColor: 'text.secondary' },
        }}
      >
        <Typography variant="body2">{role}</Typography>
        <ArrowDownIcon sx={{ fontSize: 20, color: 'text.secondary', transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.15s' }} />
      </Box>

      <Menu
        anchorEl={menuAnchor}
        open={open}
        onClose={() => setMenuAnchor(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
        PaperProps={{ sx: { width: 480, maxHeight: 420, mt: -0.5 } }}
      >
        {/* Custom roles section */}
        <Box sx={{ px: 2, py: 0.75, bgcolor: 'rgba(59,73,96,0.06)', borderBottom: '1px solid var(--color-border-primary)' }}>
          <Typography variant="caption" fontWeight={700} sx={{ color: 'var(--color-primary)', textTransform: 'uppercase', letterSpacing: 0.5, fontSize: 10 }}>
            Your organisation's custom roles
          </Typography>
        </Box>
        {customRoles.map((r) => (
          <MenuItem
            key={r.id}
            selected={role === r.name}
            onClick={() => handleSelectRole(r.name)}
            sx={{
              py: 1.25, px: 2, fontSize: 14,
              '&.Mui-selected': { bgcolor: '#0b1b3a', color: 'white', '&:hover': { bgcolor: '#0b1b3a' } },
            }}
          >
            {r.name}
          </MenuItem>
        ))}

        {/* System roles section */}
        <Box sx={{ px: 2, py: 0.75, bgcolor: 'grey.100', borderTop: '1px solid var(--color-border-primary)', borderBottom: '1px solid var(--color-border-primary)' }}>
          <Typography variant="caption" fontWeight={700} color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: 0.5, fontSize: 10 }}>
            System roles
          </Typography>
        </Box>
        {systemRoleNames.map((name) => (
          <MenuItem
            key={name}
            selected={role === name}
            onClick={() => handleSelectRole(name)}
            sx={{
              py: 1.25, px: 2, fontSize: 14,
              '&.Mui-selected': { bgcolor: '#0b1b3a', color: 'white', '&:hover': { bgcolor: '#0b1b3a' } },
            }}
          >
            {name}
          </MenuItem>
        ))}
      </Menu>

      {/* Permission grid — reflects selected role's permission set (read-only) */}
      <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 4, alignItems: 'start' }}>
        {cols.map((col, colIdx) => (
          <Box key={colIdx}>
            {col.map(([category, perms]) => (
              <Box key={category} sx={{ mb: 4 }}>
                <Typography variant="body2" fontWeight={700} sx={{ mb: 1.25 }}>{category}</Typography>
                {perms.map((perm) => {
                  const checked = activePermissions.has(perm)
                  return (
                    <Box key={perm} sx={{ display: 'flex', alignItems: 'center', gap: 1, py: 0.5 }}>
                      <Checkbox
                        size="small" checked={checked} disabled
                        sx={{
                          p: 0.25, flexShrink: 0,
                          '&.Mui-disabled': { color: checked ? 'var(--color-primary)' : 'action.disabled' },
                        }}
                      />
                      <Typography variant="body2" sx={{ fontSize: 13, color: checked ? 'text.primary' : 'text.disabled' }}>
                        {perm}
                      </Typography>
                    </Box>
                  )
                })}
              </Box>
            ))}
          </Box>
        ))}
      </Box>

      {/* Sticky save footer */}
      <Box sx={{
        position: 'sticky', bottom: 0, mt: 4, mx: -4, px: 4, py: 2,
        bgcolor: 'white', borderTop: '1px solid var(--color-border-primary)',
        display: 'flex', justifyContent: 'flex-end', gap: 1.5,
      }}>
        <Box
          component="button"
          onClick={onBack}
          sx={{
            px: 2.5, py: 0.875, bgcolor: 'transparent', border: '1px solid var(--color-border-primary)',
            borderRadius: 1, cursor: 'pointer', fontWeight: 600, fontSize: 14, color: 'text.secondary', fontFamily: 'inherit',
            '&:hover': { bgcolor: 'grey.50' },
          }}
        >
          Cancel
        </Box>
        <Box
          component="button"
          onClick={handleSave}
          sx={{
            px: 2.5, py: 0.875, bgcolor: 'var(--color-primary)', color: 'white', border: 'none',
            borderRadius: 1, cursor: 'pointer', fontWeight: 700, fontSize: 14, fontFamily: 'inherit',
            '&:hover': { opacity: 0.9 },
          }}
        >
          Save
        </Box>
      </Box>

      <Snackbar
        open={toast}
        autoHideDuration={4000}
        onClose={(_, reason) => { if (reason !== 'clickaway') setToast(false) }}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert severity="success" onClose={() => setToast(false)} sx={{ minWidth: 280 }}>
          Role updated successfully.
        </Alert>
      </Snackbar>
    </Box>
  )
}
