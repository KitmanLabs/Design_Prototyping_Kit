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
  TextField,
  FormControl,
  InputLabel,
  Select,
  Avatar,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Checkbox,
  Chip,
} from '@mui/material'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import SearchIcon from '@mui/icons-material/Search'
import { manageAthletes } from '../data/athletes'

const DARK = '#1a2035'
const DARK_HOVER = '#2d3a5c'
const BLUE = '#1976d2'

const ManageAthletes: React.FC = () => {
  const navigate = useNavigate()
  const [tab, setTab] = useState(0)
  const [search, setSearch] = useState('')
  const [position, setPosition] = useState('')
  const [squad, setSquad] = useState('International')
  const [labels, setLabels] = useState('')

  const [headerMenuAnchor, setHeaderMenuAnchor] = useState<null | HTMLElement>(null)
  const [rowMenuAnchor, setRowMenuAnchor] = useState<null | HTMLElement>(null)

  const handleClear = () => {
    setSearch('')
    setPosition('')
    setSquad('')
    setLabels('')
  }

  const rows = manageAthletes.filter((r) => {
    const term = search.trim().toLowerCase()
    if (!term) return true
    return `${r.firstName} ${r.lastName} ${r.username}`.toLowerCase().includes(term)
  })

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Typography variant="h5" sx={{ fontWeight: 600 }}>
          Manage Athletes
        </Typography>
        <Box sx={{ ml: 'auto', display: 'flex', gap: 1, alignItems: 'center' }}>
          <Button
            variant="contained"
            sx={{ backgroundColor: DARK, '&:hover': { backgroundColor: DARK_HOVER } }}
          >
            New Athlete
          </Button>
          <Button
            variant="contained"
            sx={{ backgroundColor: DARK, '&:hover': { backgroundColor: DARK_HOVER } }}
          >
            Upload Athletes
          </Button>
          <Button variant="outlined" sx={{ borderColor: DARK, color: DARK }}>
            Download csv
          </Button>
          <Button
            variant="outlined"
            endIcon={<KeyboardArrowDownIcon />}
            sx={{ borderColor: DARK, color: DARK }}
          >
            Download
          </Button>
          <IconButton onClick={(e) => setHeaderMenuAnchor(e.currentTarget)}>
            <MoreVertIcon />
          </IconButton>
          <Menu
            anchorEl={headerMenuAnchor}
            open={Boolean(headerMenuAnchor)}
            onClose={() => setHeaderMenuAnchor(null)}
          >
            <MenuItem onClick={() => setHeaderMenuAnchor(null)}>Export Template</MenuItem>
            <MenuItem
              onClick={() => {
                setHeaderMenuAnchor(null)
                navigate('/manage-athletes/profile-builder')
              }}
            >
              Athlete Profile Builder
            </MenuItem>
          </Menu>
        </Box>
      </Box>

      {/* Tabs */}
      <Tabs
        value={tab}
        onChange={(_, v) => setTab(v)}
        TabIndicatorProps={{ style: { backgroundColor: BLUE } }}
        sx={{ mb: 2 }}
      >
        <Tab label="Active" sx={{ color: tab === 0 ? BLUE : undefined, fontWeight: tab === 0 ? 600 : 400 }} />
        <Tab label="Inactive" sx={{ color: tab === 1 ? BLUE : undefined, fontWeight: tab === 1 ? 600 : 400 }} />
      </Tabs>

      {/* Filter bar */}
      <Box
        sx={{
          backgroundColor: 'white',
          p: 2,
          borderRadius: 1,
          mb: 2,
          display: 'flex',
          gap: 2,
          alignItems: 'flex-end',
        }}
      >
        <TextField
          variant="standard"
          label="Search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          InputProps={{ endAdornment: <SearchIcon /> }}
          sx={{ minWidth: 200 }}
        />
        <FormControl variant="standard" sx={{ minWidth: 140 }}>
          <InputLabel>Position</InputLabel>
          <Select value={position} onChange={(e) => setPosition(e.target.value)}>
            <MenuItem value="">All</MenuItem>
            <MenuItem value="Prop">Prop</MenuItem>
            <MenuItem value="Hooker">Hooker</MenuItem>
            <MenuItem value="Lock">Lock</MenuItem>
            <MenuItem value="Fly-half">Fly-half</MenuItem>
            <MenuItem value="Scrum-half">Scrum-half</MenuItem>
            <MenuItem value="Centre">Centre</MenuItem>
            <MenuItem value="Wing">Wing</MenuItem>
            <MenuItem value="Full-back">Full-back</MenuItem>
          </Select>
        </FormControl>
        <FormControl variant="standard" sx={{ minWidth: 140 }}>
          <InputLabel>Squad</InputLabel>
          <Select value={squad} onChange={(e) => setSquad(e.target.value)}>
            <MenuItem value="">All</MenuItem>
            <MenuItem value="International">Internatio...</MenuItem>
            <MenuItem value="Senior">Senior</MenuItem>
            <MenuItem value="Academy">Academy</MenuItem>
            <MenuItem value="Development">Development</MenuItem>
          </Select>
        </FormControl>
        <FormControl variant="standard" sx={{ minWidth: 140 }}>
          <InputLabel>Labels</InputLabel>
          <Select value={labels} onChange={(e) => setLabels(e.target.value)}>
            <MenuItem value="">All</MenuItem>
            <MenuItem value="Captain">Captain</MenuItem>
            <MenuItem value="Vice-captain">Vice-captain</MenuItem>
            <MenuItem value="Rookie">Rookie</MenuItem>
            <MenuItem value="Speedster">Speedster</MenuItem>
          </Select>
        </FormControl>
        <Button variant="text" sx={{ color: BLUE }} onClick={handleClear}>
          Clear
        </Button>
      </Box>

      {/* Data grid */}
      <Box sx={{ backgroundColor: 'white', borderRadius: 1 }}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: 'white' }}>
              <TableCell padding="checkbox">
                <Checkbox />
              </TableCell>
              {['Player', 'Username', 'Roster Position', 'Squads', 'Creation Date', 'Labels', ''].map((h, i) => (
                <TableCell key={i} sx={{ fontWeight: 600, color: 'text.secondary', fontSize: '0.85rem' }}>
                  {h}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow
                key={row.id}
                onClick={() => navigate(`/manage-athletes/${row.id}`)}
                sx={{ '&:hover': { backgroundColor: '#f5f5f5', cursor: 'pointer' } }}
              >
                <TableCell padding="checkbox" onClick={(e) => e.stopPropagation()}>
                  <Checkbox />
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Avatar sx={{ width: 32, height: 32 }}>
                      {row.firstName[0]}
                      {row.lastName[0]}
                    </Avatar>
                    <Typography variant="body2">
                      {row.firstName} {row.lastName}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>{row.username}</TableCell>
                <TableCell>{row.rosterPosition}</TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                    {row.squads.map((s) => (
                      <Chip key={s} label={s} size="small" variant="outlined" />
                    ))}
                  </Box>
                </TableCell>
                <TableCell>{row.creationDate}</TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                    {row.labels.map((l) => (
                      <Chip key={l} label={l} size="small" variant="outlined" />
                    ))}
                  </Box>
                </TableCell>
                <TableCell onClick={(e) => e.stopPropagation()}>
                  <IconButton onClick={(e) => setRowMenuAnchor(e.currentTarget)}>
                    <MoreVertIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <Menu anchorEl={rowMenuAnchor} open={Boolean(rowMenuAnchor)} onClose={() => setRowMenuAnchor(null)}>
          <MenuItem onClick={() => setRowMenuAnchor(null)}>View</MenuItem>
          <MenuItem onClick={() => setRowMenuAnchor(null)}>Edit</MenuItem>
          <MenuItem onClick={() => setRowMenuAnchor(null)}>Deactivate</MenuItem>
        </Menu>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 2 }}>
          <Typography variant="caption">Total Rows: 30 of 61</Typography>
        </Box>
      </Box>
    </Box>
  )
}

export default ManageAthletes
