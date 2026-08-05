import React, { useState } from 'react'
import {
  Box, Typography, Tabs, Tab, TextField, InputAdornment, Avatar, IconButton,
  Table, TableHead, TableBody, TableRow, TableCell,
} from '@mui/material'
import { SearchOutlined as SearchIcon, EditOutlined as EditIcon } from '@mui/icons-material'
import { STAFF, initials } from './staffData'

export default function ManageStaffUsers({ onOpenStaff }) {
  const [tab, setTab] = useState(0)
  const [search, setSearch] = useState('')

  const statusFilter = tab === 0 ? 'Active' : 'Inactive'
  const rows = STAFF.filter(s =>
    s.status === statusFilter &&
    (s.name.toLowerCase().includes(search.toLowerCase()) ||
     s.username.toLowerCase().includes(search.toLowerCase()) ||
     s.email.toLowerCase().includes(search.toLowerCase()))
  )

  const colSx = { fontWeight: 600, fontSize: 13, color: 'text.secondary', borderBottom: '1px solid var(--color-border-primary)', py: 1.5, px: 2 }
  const cellSx = { fontSize: 14, py: 1.5, px: 2, borderBottom: '1px solid var(--color-border-primary)', color: 'text.secondary' }

  return (
    <Box sx={{ p: 4 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4" fontWeight={700}>Manage Staff Users</Typography>
        <Box
          component="button"
          sx={{
            px: 2.5, py: 1, bgcolor: '#0b1b3a', color: 'white', border: 'none',
            borderRadius: 1, cursor: 'pointer', fontWeight: 600, fontSize: 14, fontFamily: 'inherit',
            '&:hover': { opacity: 0.9 },
            // eslint-disable-next-line design-system/no-hardcoded-colors
          }}
        >
          Create New User
        </Box>
      </Box>

      {/* Active / Inactive tabs */}
      <Tabs
        value={tab}
        onChange={(_, v) => setTab(v)}
        sx={{
          mb: 3, borderBottom: '1px solid var(--color-border-primary)',
          '& .MuiTab-root': { textTransform: 'none', fontSize: 15, minHeight: 44, px: 0, mr: 3 },
          '& .Mui-selected': { color: 'var(--color-primary)', fontWeight: 600 },
          '& .MuiTabs-indicator': { bgcolor: 'var(--color-primary)' },
        }}
      >
        <Tab label="Active" />
        <Tab label="Inactive" />
      </Tabs>

      <Box sx={{ border: '1px solid var(--color-border-primary)', borderRadius: 2, p: 3 }}>
        <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
          {statusFilter} users
        </Typography>

        <TextField
          size="small"
          placeholder="Search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ mb: 2, width: 320, bgcolor: 'grey.100', borderRadius: 1, '& fieldset': { border: 'none' } }}
          InputProps={{
            endAdornment: <InputAdornment position="end"><SearchIcon sx={{ fontSize: 18, color: 'text.disabled' }} /></InputAdornment>,
          }}
        />

        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell sx={colSx}>Staff name</TableCell>
              <TableCell sx={colSx}>Username</TableCell>
              <TableCell sx={colSx}>Role</TableCell>
              <TableCell sx={colSx}>Email</TableCell>
              <TableCell sx={colSx}>Creation Date</TableCell>
              <TableCell sx={{ ...colSx, width: 48 }} />
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((s) => (
              <TableRow
                key={s.id}
                hover
                onClick={() => onOpenStaff(s)}
                sx={{ cursor: 'pointer' }}
              >
                <TableCell sx={{ ...cellSx, color: 'text.primary' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Avatar sx={{ width: 30, height: 30, bgcolor: 'grey.200', color: 'text.secondary', fontSize: 11, fontWeight: 600 }}>
                      {initials(s.name)}
                    </Avatar>
                    <Typography variant="body2" fontWeight={600}>{s.name}</Typography>
                  </Box>
                </TableCell>
                <TableCell sx={cellSx}>{s.username}</TableCell>
                <TableCell sx={cellSx}>{s.role}</TableCell>
                <TableCell sx={cellSx}>{s.email}</TableCell>
                <TableCell sx={cellSx}>{s.created}</TableCell>
                <TableCell sx={{ ...cellSx, p: 0.5 }} onClick={(e) => e.stopPropagation()}>
                  <IconButton size="small" onClick={() => onOpenStaff(s)}>
                    <EditIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
            {rows.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} sx={{ ...cellSx, textAlign: 'center', py: 4 }}>
                  No {statusFilter.toLowerCase()} users found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Box>
    </Box>
  )
}
