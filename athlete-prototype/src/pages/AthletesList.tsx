import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box,
  Typography,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Avatar,
  Chip,
} from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import { athletesList, Availability } from '../data/athletes'

const DARK = '#1a2035'

const availabilityStyles: Record<Availability, { backgroundColor: string; color: string }> = {
  Available: { backgroundColor: '#388e3c', color: 'white' },
  Unavailable: { backgroundColor: '#d32f2f', color: 'white' },
  'Available (Injured/Ill)': { backgroundColor: '#f57c00', color: 'white' },
}

const AthletesList: React.FC = () => {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [availability, setAvailability] = useState('All')
  const [position, setPosition] = useState('')

  const rows = athletesList.filter((a) => {
    const term = search.trim().toLowerCase()
    if (term && !`${a.firstName} ${a.lastName}`.toLowerCase().includes(term)) return false
    if (availability === 'Available' && a.availability !== 'Available') return false
    if (availability === 'Unavailable' && a.availability !== 'Unavailable') return false
    if (position && a.position !== position) return false
    return true
  })

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Typography variant="h5" sx={{ fontWeight: 600 }}>
          Athletes List
        </Typography>
        <Box sx={{ ml: 'auto', display: 'flex', gap: 1 }}>
          <Button variant="contained" sx={{ backgroundColor: DARK }}>
            Export CSV
          </Button>
          <Button variant="contained" sx={{ backgroundColor: DARK }}>
            Print
          </Button>
        </Box>
      </Box>

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
        <FormControl variant="standard" sx={{ minWidth: 160 }}>
          <InputLabel>Availability</InputLabel>
          <Select value={availability} onChange={(e) => setAvailability(e.target.value)}>
            <MenuItem value="All">All</MenuItem>
            <MenuItem value="Available">Available</MenuItem>
            <MenuItem value="Unavailable">Unavailable</MenuItem>
          </Select>
        </FormControl>
        <FormControl variant="standard" sx={{ minWidth: 160 }}>
          <InputLabel>Position</InputLabel>
          <Select value={position} onChange={(e) => setPosition(e.target.value)}>
            <MenuItem value="">All</MenuItem>
            <MenuItem value="Prop">Prop</MenuItem>
            <MenuItem value="Hooker">Hooker</MenuItem>
            <MenuItem value="Lock">Lock</MenuItem>
            <MenuItem value="Flanker">Flanker</MenuItem>
            <MenuItem value="Number 8">Number 8</MenuItem>
            <MenuItem value="Scrum-half">Scrum-half</MenuItem>
            <MenuItem value="Fly-half">Fly-half</MenuItem>
            <MenuItem value="Centre">Centre</MenuItem>
            <MenuItem value="Wing">Wing</MenuItem>
            <MenuItem value="Full-back">Full-back</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Data grid */}
      <Box sx={{ backgroundColor: 'white', borderRadius: 1 }}>
        <Table>
          <TableHead>
            <TableRow>
              {['', 'Full Name', 'Position', 'Availability'].map((h, i) => (
                <TableCell key={i} sx={{ fontWeight: 600, color: 'text.secondary', fontSize: '0.85rem' }}>
                  {h}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((a) => (
              <TableRow
                key={a.id}
                onClick={() => navigate(`/athletes/${a.id}`)}
                sx={{ '&:hover': { backgroundColor: '#f5f5f5', cursor: 'pointer' } }}
              >
                <TableCell sx={{ width: 56 }}>
                  <Avatar sx={{ width: 36, height: 36 }}>
                    {a.firstName[0]}
                    {a.lastName[0]}
                  </Avatar>
                </TableCell>
                <TableCell>
                  {a.firstName} {a.lastName}
                </TableCell>
                <TableCell>{a.position}</TableCell>
                <TableCell>
                  <Chip label={a.availability} size="small" sx={availabilityStyles[a.availability]} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>
    </Box>
  )
}

export default AthletesList
