import React, { useState } from 'react'
import {
  Box,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Chip,
  Tabs,
  Tab,
  Typography,
  TextField,
  InputAdornment,
  Select,
  FormControl,
  InputLabel,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  TablePagination,
} from '@mui/material'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import SearchIcon from '@mui/icons-material/Search'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import { MANAGE_ATHLETE_ROWS } from './data'

const NAVY = '#1D2635'

export default function ManageAthletesPage({ onOpenExport }) {
  const [menuAnchor, setMenuAnchor] = useState(null)
  const [downloadAnchor, setDownloadAnchor] = useState(null)
  const [tab, setTab] = useState(0)
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [labels, setLabels] = useState('')

  const openExport = () => {
    setMenuAnchor(null)
    setDownloadAnchor(null)
    onOpenExport()
  }

  const rows = MANAGE_ATHLETE_ROWS.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)

  return (
    <Box>
      {/* Header + action bar */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h5" sx={{ color: NAVY, fontWeight: 400 }}>Manage Athletes</Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Button variant="contained" disableElevation sx={{ textTransform: 'none', whiteSpace: 'nowrap', backgroundColor: NAVY, color: '#fff', '&:hover': { backgroundColor: '#11161f' } }}>
            New Athlete
          </Button>
          <Button variant="outlined" color="inherit" sx={{ textTransform: 'none', whiteSpace: 'nowrap', borderColor: '#D0D5DD', color: NAVY }}>
            Upload Athletes
          </Button>
          <Button variant="outlined" color="inherit" sx={{ textTransform: 'none', whiteSpace: 'nowrap', borderColor: '#D0D5DD', color: NAVY }}>
            Download CSV
          </Button>
          <Button
            variant="outlined"
            color="inherit"
            endIcon={<KeyboardArrowDownIcon />}
            onClick={(e) => setDownloadAnchor(e.currentTarget)}
            sx={{ textTransform: 'none', whiteSpace: 'nowrap', borderColor: '#D0D5DD', color: NAVY }}
          >
            Download
          </Button>
          <IconButton onClick={(e) => setMenuAnchor(e.currentTarget)}>
            <MoreVertIcon />
          </IconButton>

          {/* Download dropdown */}
          <Menu anchorEl={downloadAnchor} open={Boolean(downloadAnchor)} onClose={() => setDownloadAnchor(null)}>
            <MenuItem onClick={openExport}>Export Athletes</MenuItem>
          </Menu>

          {/* Three-dot overflow menu */}
          <Menu anchorEl={menuAnchor} open={Boolean(menuAnchor)} onClose={() => setMenuAnchor(null)}>
            <MenuItem onClick={() => setMenuAnchor(null)}>Configure athlete profile</MenuItem>
            <MenuItem onClick={openExport}>Export Athletes</MenuItem>
          </Menu>
        </Box>
      </Box>

      {/* Active / Inactive tabs */}
      <Tabs
        value={tab}
        onChange={(e, v) => setTab(v)}
        TabIndicatorProps={{ sx: { backgroundColor: NAVY } }}
        sx={{ mb: 3, '& .MuiTab-root': { textTransform: 'none', color: 'text.secondary', '&.Mui-selected': { color: NAVY } } }}
      >
        <Tab label="Active" />
        <Tab label="Inactive" />
      </Tabs>

      {/* Filter row */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
        <TextField
          variant="filled"
          size="small"
          placeholder="Search"
          sx={{ width: 240 }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <SearchIcon fontSize="small" sx={{ color: 'action.active' }} />
              </InputAdornment>
            ),
          }}
        />
        <FormControl variant="filled" size="small" sx={{ width: 220 }}>
          <InputLabel>Labels</InputLabel>
          <Select label="Labels" value={labels} onChange={(e) => setLabels(e.target.value)}>
            <MenuItem value="">All labels</MenuItem>
            <MenuItem value="class-of-2026">Class Of 2026</MenuItem>
            <MenuItem value="this-is-a-chip">This is a chip</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Table */}
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>User name</TableCell>
              <TableCell>Roster Position</TableCell>
              <TableCell>Squads</TableCell>
              <TableCell>Creation</TableCell>
              <TableCell>Labels</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.id} hover sx={{ '&:hover': { backgroundColor: '#F5F5F5' } }}>
                <TableCell>
                  <Typography variant="body2">{row.userName}</Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">{row.rosterPosition}</Typography>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                    <Chip label={row.squads} variant="outlined" size="small" sx={{ maxWidth: 220 }} />
                    {row.squadsOverflow > 0 && (
                      <Chip label={`+${row.squadsOverflow}`} variant="outlined" size="small" />
                    )}
                  </Box>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">{row.creation}</Typography>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                    <Chip label={row.label} variant="filled" size="small" sx={{ backgroundColor: '#EAECF0', color: NAVY }} />
                    {row.labelsOverflow > 0 && (
                      <Chip label={`+${row.labelsOverflow}`} variant="filled" size="small" sx={{ backgroundColor: '#EAECF0', color: NAVY }} />
                    )}
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      <TablePagination
        component="div"
        count={MANAGE_ATHLETE_ROWS.length}
        page={page}
        onPageChange={(e, p) => setPage(p)}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={(e) => { setRowsPerPage(parseInt(e.target.value, 10)); setPage(0) }}
        rowsPerPageOptions={[10, 25]}
      />
    </Box>
  )
}
