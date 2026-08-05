import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Typography,
  Snackbar,
  Alert,
  TextField,
  Select,
  FormControl,
  InputAdornment,
  Tabs,
  Tab,
} from '@mui/material'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import SearchIcon from '@mui/icons-material/Search'
import { AthleteDataGrid } from '../../components'
import athletesData from '../../data/athletes.json'

// ─── Row actions menu ─────────────────────────────────────────────────────────

function RowActionsMenu({ athleteId, onAction }) {
  const [anchor, setAnchor] = useState(null)
  return (
    <>
      <IconButton
        size="small"
        onClick={(e) => { e.stopPropagation(); setAnchor(e.currentTarget) }}
        sx={{ p: 0.5 }}
      >
        <MoreVertIcon sx={{ fontSize: 18 }} />
      </IconButton>
      <Menu
        anchorEl={anchor}
        open={Boolean(anchor)}
        onClose={() => setAnchor(null)}
        onClick={(e) => e.stopPropagation()}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MenuItem onClick={() => { setAnchor(null); onAction('view', athleteId) }} sx={{ fontSize: 14 }}>View profile</MenuItem>
        <MenuItem onClick={() => { setAnchor(null); onAction('edit', athleteId) }} sx={{ fontSize: 14 }}>Edit</MenuItem>
        <MenuItem onClick={() => { setAnchor(null); onAction('deactivate', athleteId) }} sx={{ fontSize: 14, color: 'error.main' }}>Deactivate</MenuItem>
      </Menu>
    </>
  )
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function ManageAthletes() {
  const navigate = useNavigate()
  const [headerMenuAnchor, setHeaderMenuAnchor] = useState(null)
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' })
  const [activeTab, setActiveTab] = useState(0)
  const [positionFilter, setPositionFilter] = useState('')
  const [squadFilter, setSquadFilter] = useState('International Squad')
  const [labelsFilter, setLabelsFilter] = useState('')
  const [searchFilter, setSearchFilter] = useState('')

  function handleRowAction(action, athleteId) {
    if (action === 'view') navigate(`/manage-athletes/${athleteId}`)
    else if (action === 'edit') navigate(`/manage-athletes/${athleteId}`)
    else if (action === 'deactivate') setSnackbar({ open: true, message: 'Athlete deactivated', severity: 'warning' })
  }

  function handleRowClick(params) {
    navigate(`/manage-athletes/${params.id}`)
  }

  const handleBulkAction = (action, selectedRows) => {
    const count = selectedRows.length
    const messages = {
      view: `Viewing ${count} selected athlete${count > 1 ? 's' : ''}`,
      email: `Sending email to ${count} athlete${count > 1 ? 's' : ''}`,
      group: `Creating group from ${count} athlete${count > 1 ? 's' : ''}`,
      export: `Exporting ${count} athlete${count > 1 ? 's' : ''} to spreadsheet`,
      assessment: `Scheduling assessment for ${count} athlete${count > 1 ? 's' : ''}`,
      remove: `Removing ${count} athlete${count > 1 ? 's' : ''} from system`,
    }
    setSnackbar({ open: true, message: messages[action] || `Action: ${action}`, severity: action === 'remove' ? 'warning' : 'success' })
  }

  return (
    <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', backgroundColor: '#fff' }}>
        <Box sx={{ p: 3, pb: 0, flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

          {/* Page header */}
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2.5, flexShrink: 0 }}>
            <Typography variant="h5" sx={{ fontWeight: 600, fontSize: 22 }}>Manage athletes</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Button variant="contained" size="small" disableElevation
                sx={{ backgroundColor: '#1a2035', color: '#fff', textTransform: 'none', fontWeight: 600, fontSize: 14, px: 2, '&:hover': { backgroundColor: '#2a3045' } }}>
                New athlete
              </Button>
              <Button variant="contained" size="small" disableElevation
                sx={{ backgroundColor: '#1a2035', color: '#fff', textTransform: 'none', fontWeight: 600, fontSize: 14, px: 2, '&:hover': { backgroundColor: '#2a3045' } }}>
                Upload athletes
              </Button>
              <Button variant="outlined" size="small"
                sx={{ textTransform: 'none', fontSize: 14, px: 2, borderColor: '#d0d0d0', color: 'text.primary', '&:hover': { borderColor: '#aaa', backgroundColor: 'transparent' } }}>
                Download csv
              </Button>
              <Button variant="outlined" size="small" endIcon={<span style={{ fontSize: 12 }}>▾</span>}
                sx={{ textTransform: 'none', fontSize: 14, px: 2, borderColor: '#d0d0d0', color: 'text.primary', '&:hover': { borderColor: '#aaa', backgroundColor: 'transparent' } }}>
                Download
              </Button>
              <IconButton size="small" onClick={(e) => setHeaderMenuAnchor(e.currentTarget)}
                sx={{ border: '1px solid #d0d0d0', borderRadius: 1 }}>
                <MoreVertIcon fontSize="small" />
              </IconButton>
              <Menu anchorEl={headerMenuAnchor} open={Boolean(headerMenuAnchor)} onClose={() => setHeaderMenuAnchor(null)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}>
                <MenuItem onClick={() => { setHeaderMenuAnchor(null); navigate('/manage-athletes/profile-builder') }} sx={{ fontSize: 14, fontWeight: 600 }}>
                  Athlete profile builder
                </MenuItem>
              </Menu>
            </Box>
          </Box>

          {/* Active / Inactive tabs */}
          <Tabs value={activeTab} onChange={(_, v) => setActiveTab(v)}
            sx={{
              minHeight: 42, borderBottom: '1px solid #e0e0e0', flexShrink: 0,
              '& .MuiTab-root': { textTransform: 'none', fontSize: 15, fontWeight: 500, minHeight: 42, color: 'text.secondary', px: 0, mr: 3 },
              '& .MuiTab-root.Mui-selected': { color: 'text.primary', fontWeight: 600 },
              '& .MuiTabs-indicator': { backgroundColor: 'text.primary' },
            }}>
            <Tab label="Active" />
            <Tab label="Inactive" />
          </Tabs>

          {/* Filter bar */}
          <Box sx={{ display: 'flex', alignItems: 'stretch', backgroundColor: '#f5f5f5', border: '1px solid #e0e0e0', borderTop: 'none', flexShrink: 0 }}>
            <Box sx={{ flex: '0 0 220px', borderRight: '1px solid #e0e0e0', px: 2, py: 1.25 }}>
              <TextField variant="filled" placeholder="Search" value={searchFilter} onChange={(e) => setSearchFilter(e.target.value)} fullWidth
                InputProps={{ endAdornment: <InputAdornment position="end"><SearchIcon sx={{ fontSize: 18, color: 'text.secondary' }} /></InputAdornment> }}
                sx={{ '& .MuiInput-root': { fontSize: 15 } }} />
            </Box>
            <Box sx={{ flex: '0 0 160px', borderRight: '1px solid #e0e0e0', px: 2, py: 1.25 }}>
              <FormControl fullWidth variant="filled">
                <Select value={positionFilter} onChange={(e) => setPositionFilter(e.target.value)} displayEmpty sx={{ fontSize: 15 }}
                  renderValue={(v) => v || <span style={{ color: '#888', fontSize: 15 }}>Position</span>}>
                  <MenuItem value=""><em>All positions</em></MenuItem>
                  {['Hooker', 'Tight-head Prop', 'Loose-head Prop', 'Second Row', 'Outside Center', 'Forward', 'Midfielder', 'Defender'].map((p) => (
                    <MenuItem key={p} value={p}>{p}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
            <Box sx={{ flex: '0 0 220px', borderRight: '1px solid #e0e0e0', px: 2, py: 1.25 }}>
              <FormControl fullWidth variant="filled">
                <Select value={squadFilter} onChange={(e) => setSquadFilter(e.target.value)} displayEmpty sx={{ fontSize: 15 }}
                  renderValue={(v) => v
                    ? <Box><Typography sx={{ fontSize: 11, color: 'text.secondary', lineHeight: 1 }}>Squad</Typography><Typography sx={{ fontSize: 15, lineHeight: 1.3 }}>{v.length > 16 ? v.slice(0, 16) + '...' : v}</Typography></Box>
                    : <span style={{ color: '#888', fontSize: 15 }}>Squad</span>}>
                  <MenuItem value=""><em>All squads</em></MenuItem>
                  {['International Squad', 'International Squad (Primary)', 'Development Squad'].map((s) => (
                    <MenuItem key={s} value={s}>{s}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
            <Box sx={{ flex: '0 0 160px', borderRight: '1px solid #e0e0e0', px: 2, py: 1.25 }}>
              <FormControl fullWidth variant="filled">
                <Select value={labelsFilter} onChange={(e) => setLabelsFilter(e.target.value)} displayEmpty sx={{ fontSize: 15 }}
                  renderValue={(v) => v || <span style={{ color: '#888', fontSize: 15 }}>Labels</span>}>
                  <MenuItem value=""><em>All labels</em></MenuItem>
                  <MenuItem value="Class Of 2026">Class Of 2026</MenuItem>
                </Select>
              </FormControl>
            </Box>
            <Box sx={{ px: 2, display: 'flex', alignItems: 'center' }}>
              <Typography sx={{ fontSize: 15, color: 'text.secondary', cursor: 'pointer', '&:hover': { color: 'text.primary' } }}
                onClick={() => { setSearchFilter(''); setPositionFilter(''); setSquadFilter('International Squad'); setLabelsFilter('') }}>
                Clear
              </Typography>
            </Box>
          </Box>

          {/* Data grid */}
          <Box sx={{ flex: 1, border: '1px solid #e0e0e0', borderTop: 'none', overflow: 'hidden' }}>
            <AthleteDataGrid
              data={athletesData}
              height="100%"
              showToolbar={false}
              groupingEnabled={true}
              onBulkAction={handleBulkAction}
              onRowClick={handleRowClick}
              sx={{
                '& .MuiDataGrid-row': { cursor: 'pointer' },
                '& .MuiDataGrid-row:hover': { backgroundColor: '#f5f5f5' },
              }}
            />
          </Box>
        </Box>

      <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })}>{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  )
}
