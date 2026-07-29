import React, { useMemo, useState } from 'react'
import {
  ThemeProvider,
  createTheme,
  Box,
  Typography,
  Avatar,
  Tabs,
  Tab,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  ListItemText,
  TextField,
  InputAdornment,
  Toolbar,
  Button,
  Paper,
  Chip,
  IconButton,
  Drawer,
  Divider,
  CircularProgress,
  Skeleton,
  Badge,
} from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome'
import InfoIcon from '@mui/icons-material/Info'
import CloseIcon from '@mui/icons-material/Close'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone'
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined'
import PeopleOutlineIcon from '@mui/icons-material/PeopleOutline'
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined'
import LocalHospitalOutlinedIcon from '@mui/icons-material/LocalHospitalOutlined'
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined'
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline'
import {
  playerOptions,
  formOptions,
  rosterOptions,
  responseRows,
  aiSummary,
} from '../../data/aiResponseSummary'

/* ──────────────────────────────────────────────────────────────────────────
   "AI Form Summary" prototype — Forms > Responses tab.
   Inner UI uses MUI components on the MUI DEFAULT theme. The dark navy sidebar
   is intentionally left as bespoke chrome (not MUI-ified) per the brief.
   ────────────────────────────────────────────────────────────────────────── */

// MUI default theme — isolates this page from the app's global custom theme.
const defaultTheme = createTheme()

const NAVY = '#1a2744'
const AI_BG = '#eeedfe'
const AI_TEXT = '#3c3489'
const PANEL_WIDTH = 400

const SIDEBAR_ICONS = [
  { key: 'home', Icon: HomeOutlinedIcon },
  { key: 'athletes', Icon: PeopleOutlineIcon },
  { key: 'calendar', Icon: CalendarMonthOutlinedIcon },
  { key: 'medical', Icon: LocalHospitalOutlinedIcon },
  { key: 'forms', Icon: DescriptionOutlinedIcon, active: true },
  { key: 'messages', Icon: ChatBubbleOutlineIcon },
]

const TABS = ['Forms', 'Scheduling', 'Responses', 'Compliance', 'Try Outs']

const STATUS_COLOR = {
  Complete: 'success',
  'In Progress': 'warning',
  Pending: 'default',
}

export default function AiResponseSummaryV1() {
  const [filters, setFilters] = useState({
    players: [],
    forms: [],
    roster: '',
    from: '',
    to: '',
  })
  const [selected, setSelected] = useState([]) // array of row ids (DataGrid model)
  const [panelOpen, setPanelOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [team, setTeam] = useState('First Team') // top-bar selector (visual only)

  const setFilter = (key, val) => setFilters((f) => ({ ...f, [key]: val }))

  // Filters combine with AND logic, narrowing rows live.
  const filteredRows = useMemo(() => {
    return responseRows.filter((r) => {
      if (filters.players.length && !filters.players.includes(r.player)) return false
      if (filters.forms.length && !filters.forms.includes(r.formName)) return false
      if (filters.roster && r.roster !== filters.roster) return false
      if (filters.from && r.date < filters.from) return false
      if (filters.to && r.date > filters.to) return false
      return true
    })
  }, [filters])

  const selectedSet = useMemo(() => new Set(selected), [selected])
  const visibleIds = filteredRows.map((r) => r.id)
  const allVisibleChecked = visibleIds.length > 0 && visibleIds.every((id) => selectedSet.has(id))
  const someVisibleChecked = visibleIds.some((id) => selectedSet.has(id))

  const toggleAll = () => {
    if (allVisibleChecked) {
      setSelected((prev) => prev.filter((id) => !visibleIds.includes(id)))
    } else {
      setSelected((prev) => Array.from(new Set([...prev, ...visibleIds])))
    }
  }

  const handleGenerate = () => {
    setPanelOpen(true)
    setLoading(true)
    setTimeout(() => setLoading(false), 1600)
  }

  const selectionActive = selected.length > 0

  const columns = useMemo(
    () => [
      { field: 'player', headerName: 'Player', flex: 1.3, minWidth: 150 },
      { field: 'formName', headerName: 'Form Name', flex: 1.5, minWidth: 170 },
      { field: 'productArea', headerName: 'Product Area', flex: 1, minWidth: 130 },
      { field: 'category', headerName: 'Category', flex: 1, minWidth: 120 },
      { field: 'examiner', headerName: 'Examiner', flex: 1.2, minWidth: 150 },
      { field: 'completion', headerName: 'Completion', flex: 1, minWidth: 120 },
      {
        field: 'status',
        headerName: 'Form Status',
        flex: 1,
        minWidth: 140,
        sortable: true,
        renderCell: (params) => (
          <Chip
            label={params.value}
            size="small"
            color={STATUS_COLOR[params.value] || 'default'}
            variant={params.value === 'Complete' ? 'filled' : 'outlined'}
          />
        ),
      },
      {
        field: 'actions',
        headerName: '',
        width: 52,
        sortable: false,
        filterable: false,
        disableColumnMenu: true,
        align: 'center',
        renderCell: () => (
          <IconButton size="small" aria-label="Row actions">
            <MoreVertIcon fontSize="small" />
          </IconButton>
        ),
      },
    ],
    []
  )

  return (
    <ThemeProvider theme={defaultTheme}>
      <Box sx={{ position: 'fixed', inset: 0, display: 'flex', bgcolor: '#f5f6f8' }}>
        {/* ─── Bespoke navy sidebar (left unchanged, not MUI-ified) ─── */}
        <Box
          component="nav"
          sx={{
            width: 52,
            flex: '0 0 52px',
            bgcolor: NAVY,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            pt: 1.5,
            gap: 0.5,
          }}
        >
          <Box
            sx={{
              width: 28,
              height: 28,
              borderRadius: 1.5,
              bgcolor: '#fff',
              color: NAVY,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 500,
              fontSize: 13,
              mb: 1.25,
            }}
          >
            K
          </Box>
          {SIDEBAR_ICONS.map(({ key, Icon, active }) => (
            <Box
              key={key}
              title={key}
              sx={{
                width: 36,
                height: 36,
                borderRadius: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: active ? '#fff' : 'rgba(255,255,255,0.55)',
                bgcolor: active ? 'rgba(255,255,255,0.14)' : 'transparent',
                cursor: 'pointer',
              }}
            >
              <Icon sx={{ fontSize: 20 }} />
            </Box>
          ))}
        </Box>

        {/* ─── Main column ─── */}
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
          {/* Top bar */}
          <Box
            component="header"
            sx={{
              height: 64,
              flex: '0 0 64px',
              bgcolor: '#fff',
              borderBottom: '0.5px solid',
              borderColor: 'divider',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              px: 3,
            }}
          >
            <Typography sx={{ fontSize: 15, color: 'text.secondary' }}>Forms</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              {/* Club / team selector (filled) */}
              <FormControl variant="filled" size="small" sx={{ minWidth: 180 }}>
                <Select
                  value={team}
                  onChange={(e) => setTeam(e.target.value)}
                  disableUnderline
                  sx={{ borderRadius: 1, '& .MuiSelect-select': { py: 1.25, fontSize: 15 } }}
                >
                  <MenuItem value="First Team">First Team</MenuItem>
                  <MenuItem value="Reserves">Reserves</MenuItem>
                  <MenuItem value="Academy">Academy</MenuItem>
                </Select>
              </FormControl>
              {/* Notification bell with red badge */}
              <IconButton size="large">
                <Badge badgeContent={3} color="error">
                  <NotificationsNoneIcon />
                </Badge>
              </IconButton>
              {/* User avatar */}
              <Avatar sx={{ width: 40, height: 40, bgcolor: NAVY, fontSize: 14 }}>DSM</Avatar>
            </Box>
          </Box>

          {/* Content (Drawer overlays this region) */}
          <Box sx={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
            <Box sx={{ height: '100%', overflowY: 'auto', px: 3, py: 3, pb: 6 }}>
              {/* Page title */}
              <Typography sx={{ fontSize: 28, fontWeight: 500, mb: 2 }}>Forms</Typography>

              {/* Tab bar */}
              <Tabs
                value={2}
                sx={{ borderBottom: 1, borderColor: 'divider', mb: 3, minHeight: 48 }}
                TabIndicatorProps={{ sx: { bgcolor: NAVY } }}
              >
                {TABS.map((t) => (
                  <Tab
                    key={t}
                    label={t}
                    disableRipple
                    sx={{
                      textTransform: 'none',
                      minHeight: 48,
                      fontSize: 15,
                      '&.Mui-selected': { color: NAVY, fontWeight: 500 },
                    }}
                  />
                ))}
              </Tabs>

              {/* Filter bar */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap', mb: 3 }}>
                <FormControl variant="filled" size="small" sx={{ minWidth: 200 }}>
                  <InputLabel id="players-label">Players</InputLabel>
                  <Select
                    labelId="players-label"
                    label="Players"
                    multiple
                    value={filters.players}
                    onChange={(e) => setFilter('players', e.target.value)}
                    renderValue={(sel) => (sel.length === 1 ? sel[0] : `${sel.length} selected`)}
                  >
                    {playerOptions.map((o) => (
                      <MenuItem key={o} value={o}>
                        <Checkbox size="small" checked={filters.players.includes(o)} />
                        <ListItemText primary={o} />
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <FormControl variant="filled" size="small" sx={{ minWidth: 200 }}>
                  <InputLabel id="form-label">Form</InputLabel>
                  <Select
                    labelId="form-label"
                    label="Form"
                    multiple
                    value={filters.forms}
                    onChange={(e) => setFilter('forms', e.target.value)}
                    renderValue={(sel) => (sel.length === 1 ? sel[0] : `${sel.length} selected`)}
                  >
                    {formOptions.map((o) => (
                      <MenuItem key={o} value={o}>
                        <Checkbox size="small" checked={filters.forms.includes(o)} />
                        <ListItemText primary={o} />
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <FormControl variant="filled" size="small" sx={{ minWidth: 200 }}>
                  <InputLabel id="roster-label">Roster</InputLabel>
                  <Select
                    labelId="roster-label"
                    label="Roster"
                    value={filters.roster}
                    onChange={(e) => setFilter('roster', e.target.value)}
                  >
                    <MenuItem value="">
                      <em>All rosters</em>
                    </MenuItem>
                    {rosterOptions.map((o) => (
                      <MenuItem key={o} value={o}>
                        {o}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <TextField
                    variant="filled"
                    size="small"
                    type="date"
                    label="Start date"
                    InputLabelProps={{ shrink: true }}
                    value={filters.from}
                    onChange={(e) => setFilter('from', e.target.value)}
                    sx={{ width: 200 }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <CalendarTodayIcon sx={{ fontSize: 16 }} />
                        </InputAdornment>
                      ),
                    }}
                  />
                  <Typography color="text.disabled">–</Typography>
                  <TextField
                    variant="filled"
                    size="small"
                    type="date"
                    label="End date"
                    InputLabelProps={{ shrink: true }}
                    value={filters.to}
                    onChange={(e) => setFilter('to', e.target.value)}
                    sx={{ width: 200 }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <CalendarTodayIcon sx={{ fontSize: 16 }} />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Box>
              </Box>

              {/* Grid card */}
              <Paper variant="outlined" sx={{ borderRadius: 3, overflow: 'hidden' }}>
                {/* Bulk action bar — appears in the column-header band when rows are selected */}
                {selectionActive && (
                  <Toolbar
                    variant="dense"
                    disableGutters
                    sx={{
                      px: 2,
                      minHeight: 52,
                      bgcolor: 'grey.100',
                      borderBottom: '0.5px solid',
                      borderColor: 'divider',
                      display: 'flex',
                      justifyContent: 'space-between',
                      gap: 2,
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Checkbox
                        size="small"
                        checked={allVisibleChecked}
                        indeterminate={!allVisibleChecked && someVisibleChecked}
                        onChange={toggleAll}
                      />
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {selected.length} selected
                      </Typography>
                    </Box>
                    <Button
                      variant="outlined"
                      color="secondary"
                      size="small"
                      startIcon={<AutoAwesomeIcon />}
                      onClick={handleGenerate}
                      sx={{ textTransform: 'none', color: AI_TEXT, borderColor: AI_TEXT }}
                    >
                      AI Summary
                    </Button>
                  </Toolbar>
                )}

                <DataGrid
                  rows={filteredRows}
                  columns={columns}
                  checkboxSelection
                  disableRowSelectionOnClick
                  keepNonExistentRowsSelected
                  rowSelectionModel={selected}
                  onRowSelectionModelChange={(model) => setSelected(model)}
                  pagination
                  pageSizeOptions={[5, 10, 25]}
                  initialState={{ pagination: { paginationModel: { pageSize: 5, page: 0 } } }}
                  autoHeight
                  rowHeight={56}
                  columnHeaderHeight={52}
                  sx={{
                    border: 'none',
                    fontSize: 14,
                    '& .MuiDataGrid-columnHeaders': selectionActive ? { display: 'none' } : {},
                    '& .MuiDataGrid-cell': { fontSize: 14, py: 1 },
                    '& .MuiDataGrid-columnHeaderTitle': { fontWeight: 500, fontSize: 13 },
                    '& .MuiDataGrid-cell:focus, & .MuiDataGrid-cell:focus-within': { outline: 'none' },
                    '& .MuiDataGrid-columnHeader:focus, & .MuiDataGrid-columnHeader:focus-within': {
                      outline: 'none',
                    },
                  }}
                />
              </Paper>
            </Box>

            {/* Summary panel — MUI Drawer, persistent so it overlays without a
                backdrop and the filter bar stays interactive. */}
            <Drawer
              anchor="right"
              open={panelOpen}
              variant="temporary"
              hideBackdrop
              disableEnforceFocus
              disableScrollLock
              onClose={() => setPanelOpen(false)}
              ModalProps={{ keepMounted: true }}
              sx={{
                // Non-modal: let clicks pass through everywhere except the paper,
                // so the filter bar stays interactive while the panel is open.
                pointerEvents: 'none',
                '& .MuiDrawer-paper': {
                  pointerEvents: 'auto',
                  width: PANEL_WIDTH,
                  top: 64,
                  height: 'calc(100% - 64px)',
                  borderLeft: '0.5px solid',
                  borderColor: 'divider',
                },
              }}
            >
              {/* Header */}
              <Box
                sx={{
                  p: 2,
                  borderBottom: '0.5px solid',
                  borderColor: 'divider',
                  display: 'flex',
                  alignItems: 'flex-start',
                  justifyContent: 'space-between',
                  gap: 1.5,
                }}
              >
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 500 }}>
                    Player response summary
                  </Typography>
                  <Chip
                    icon={<AutoAwesomeIcon sx={{ fontSize: 14, color: `${AI_TEXT} !important` }} />}
                    label="AI generated"
                    size="small"
                    sx={{ mt: 1, bgcolor: AI_BG, color: AI_TEXT, fontWeight: 500, '& .MuiChip-label': { fontSize: 11 } }}
                  />
                </Box>
                <IconButton aria-label="Close summary" onClick={() => setPanelOpen(false)} size="small">
                  <CloseIcon />
                </IconButton>
              </Box>

              {/* Body */}
              <Box sx={{ flex: 1, overflowY: 'auto', p: 2 }}>
                {loading ? (
                  <LoadingState />
                ) : (
                  <>
                    <Typography variant="h6" sx={{ fontWeight: 500, mb: 1.5 }}>
                      {aiSummary.sectionTitle}
                    </Typography>

                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      {aiSummary.findings.map((f) => (
                        <Box key={f.title} sx={{ display: 'flex', gap: 1.25 }}>
                          <InfoIcon sx={{ fontSize: 18, color: AI_TEXT, mt: '1px' }} />
                          <Box>
                            <Typography sx={{ fontSize: 13, fontWeight: 500 }}>{f.title}</Typography>
                            <Typography sx={{ fontSize: 12, color: 'text.secondary', mt: 0.25, lineHeight: 1.5 }}>
                              {f.body}
                            </Typography>
                          </Box>
                        </Box>
                      ))}
                    </Box>

                    <Divider sx={{ my: 2.5 }} />

                    <Typography variant="h6" sx={{ fontWeight: 500, mb: 1.5 }}>
                      Recommendations
                    </Typography>

                    <RecoSubSection title="Immediate Actions" items={aiSummary.recommendations.immediateActions} />
                    <RecoSubSection title="Diagnostic Next Steps" items={aiSummary.recommendations.diagnosticNextSteps} />
                  </>
                )}
              </Box>
            </Drawer>
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  )
}

function RecoSubSection({ title, items }) {
  return (
    <Box sx={{ mt: 2 }}>
      <Typography sx={{ fontSize: 13, fontWeight: 500, mb: 1 }}>{title}</Typography>
      <Box component="ul" sx={{ m: 0, pl: 2.5, display: 'flex', flexDirection: 'column', gap: 0.75 }}>
        {items.map((it, i) => (
          <Typography key={i} component="li" sx={{ fontSize: 12, color: 'text.secondary', lineHeight: 1.5 }}>
            {it}
          </Typography>
        ))}
      </Box>
    </Box>
  )
}

function LoadingState() {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, color: AI_TEXT }}>
        <CircularProgress size={16} sx={{ color: AI_TEXT }} />
        <Typography sx={{ fontSize: 13 }}>Generating summary…</Typography>
      </Box>
      {[0, 1, 2].map((i) => (
        <Box key={i} sx={{ display: 'flex', flexDirection: 'column', gap: 0.75 }}>
          <Skeleton variant="text" width="45%" height={16} />
          <Skeleton variant="text" width="100%" height={12} />
          <Skeleton variant="text" width="85%" height={12} />
        </Box>
      ))}
    </Box>
  )
}
