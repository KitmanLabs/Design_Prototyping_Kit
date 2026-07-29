import React, { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  Badge,
  Select,
  Popover,
  TextField,
  InputAdornment,
  Chip,
  CircularProgress,
  Divider,
  Snackbar,
  CssBaseline,
  Drawer,
  Stack,
} from '@mui/material'
import {
  NotificationsOutlined,
  AutoAwesomeOutlined,
  SearchOutlined,
  ArrowBackOutlined,
  CloseOutlined,
} from '@mui/icons-material'
import MainNavigation from './MainNavigation'
import AiSummaryDrawer from './forms/AiSummaryDrawer'
import { currentUser, availableSquads, pageTitles } from '../data/layout'
import '../styles/design-tokens.css'

const AI_SUMMARY_HISTORY = [
  {
    id: 1,
    title: 'Medical Assessment · Preseason Assessment',
    subtitle: '22 players · Last 30 days · Today, 09:00',
    status: 'ready',
  },
  {
    id: 2,
    title: 'Wellness Check · Psychological Health Check',
    subtitle: '14 players · Last 7 days · Yesterday, 14:30',
    status: 'ready',
  },
  {
    id: 3,
    title: 'End of Season Survey',
    subtitle: '8 players · Last 6 months · 12 Jun, 11:00',
    status: 'ready',
  },
  {
    id: 4,
    title: 'Strength Assessment · Training',
    subtitle: '6 players · Last 30 days · Generating…',
    status: 'generating',
  },
]

function MedinahLayoutWithMainNav({ children }) {
  const location = useLocation()
  const navigate = useNavigate()
  // Nav is self-contained; no open state needed here
  const [currentSquad, setCurrentSquad] = useState(availableSquads[0])
  const [userMenuAnchor, setUserMenuAnchor] = useState(null)
  const [aiAnchor, setAiAnchor] = useState(null)
  const [aiSearch, setAiSearch] = useState('')
  const [summaryDrawerOpen, setSummaryDrawerOpen] = useState(false)
  const [snackbarOpen, setSnackbarOpen] = useState(false)
  // V3-only: summaries drawer + inline detail view
  const [aiDrawerOpen, setAiDrawerOpen] = useState(false)
  const [aiDrawerSelectedItem, setAiDrawerSelectedItem] = useState(null)

  const handleAiHistoryClick = (item) => {
    setAiAnchor(null)
    if (item.status === 'ready') {
      setSummaryDrawerOpen(true)
    } else {
      setSnackbarOpen(true)
    }
  }

  const filteredAiHistory = AI_SUMMARY_HISTORY.filter((h) =>
    h.title.toLowerCase().includes(aiSearch.trim().toLowerCase())
  )

  const getPageTitle = () => {
    if (location.pathname.startsWith('/forms')) return 'Forms'
    return pageTitles[location.pathname] || 'Dashboard'
  }

  const handleUserMenuOpen = (event) => {
    setUserMenuAnchor(event.currentTarget)
  }

  const handleUserMenuClose = () => {
    setUserMenuAnchor(null)
  }

  const handleSquadChange = (event) => {
    const squad = availableSquads.find(s => s.id === event.target.value)
    setCurrentSquad(squad)
  }

  const isCalendarPage = location.pathname === '/planning'
  const isFormsPage = location.pathname.startsWith('/forms')
  const isV3Route = location.pathname === '/ai-summary-v3'

  return (
    <>
      <CssBaseline />
      <Box sx={{ display: 'flex', gap: 0, height: '100vh', bgcolor: 'var(--color-background-primary)' }}>
      {/* Main Navigation */}
      <MainNavigation />
      {/* Main Content Area */}
      <Box 
        component="main" 
        sx={{ 
          flexGrow: 1, 
          minWidth: 0,
          display: 'flex', 
          flexDirection: 'column',
          overflow: 'hidden'
        }}
      >
        {/* Top App Bar */}
        <AppBar 
          position="sticky" 
          elevation={1}
          sx={{ 
            bgcolor: 'var(--color-background-primary)',
            color: 'var(--color-text-primary)',
            borderBottom: '1px solid var(--color-border-primary)',
            boxShadow: 'var(--shadow-sm)'
          }}
        >
          <Toolbar sx={{ justifyContent: 'space-between' }}>
            {/* Page Title */}
            <Typography 
              variant="h6" 
              component="h1"
              sx={{ 
                fontWeight: (isCalendarPage || isFormsPage) ? 500 : 600,
                fontSize: (isCalendarPage || isFormsPage) ? '14px' : undefined,
                color: (isCalendarPage || isFormsPage) ? 'var(--color-text-secondary)' : 'var(--color-text-primary)',
                fontFamily: 'var(--font-family-primary)',
                textTransform: 'none'
              }}
            >
              {getPageTitle()}
            </Typography>

            {/* Right Side Actions */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              {/* Squad Selector */}
              <Select
                value={currentSquad.id}
                onChange={handleSquadChange}
                displayEmpty
                size="small"
                sx={{ 
                  fontSize: '14px',
                  minWidth: 160,
                  backgroundColor: 'var(--color-white)',
                  border: 'none',
                  boxShadow: 'none',
                  '& .MuiOutlinedInput-notchedOutline': {
                    border: 'none'
                  },
                  '& .MuiSelect-select': {
                    py: 1,
                    px: 2
                  }
                }}
              >
                {availableSquads.map(squad => (
                  <MenuItem key={squad.id} value={squad.id}>
                    {squad.name}
                  </MenuItem>
                ))}
              </Select>

              {/* Notifications */}
              <IconButton
                sx={{
                  color: 'var(--color-text-secondary)',
                  '&:hover': {
                    bgcolor: 'var(--color-overlay-surface)'
                  }
                }}
              >
                <Badge badgeContent={3} color="error">
                  <NotificationsOutlined />
                </Badge>
              </IconButton>

              {/* AI summaries */}
              <IconButton
                aria-label="AI summaries"
                onClick={(e) => isV3Route ? setAiDrawerOpen(true) : setAiAnchor(e.currentTarget)}
                sx={{
                  color: 'var(--color-text-secondary)',
                  '&:hover': { bgcolor: 'var(--color-overlay-surface)' },
                }}
              >
                <AutoAwesomeOutlined />
              </IconButton>

              <Popover
                open={Boolean(aiAnchor)}
                anchorEl={aiAnchor}
                onClose={() => setAiAnchor(null)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                slotProps={{ paper: { sx: { width: 360, mt: 1, borderRadius: 'var(--radius-md)' } } }}
              >
                <Box sx={{ px: 2, pt: 2, pb: 1 }}>
                  <Typography
                    sx={{
                      fontFamily: 'var(--font-family-primary)',
                      fontWeight: 600,
                      fontSize: 'var(--font-size-md)',
                      color: 'var(--color-text-primary)',
                      mb: 1.5,
                    }}
                  >
                    AI Summaries
                  </Typography>
                  <TextField
                    fullWidth
                    size="small"
                    variant="filled"
                    placeholder="Search summaries…"
                    value={aiSearch}
                    onChange={(e) => setAiSearch(e.target.value)}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <SearchOutlined fontSize="small" sx={{ color: 'var(--color-primary)' }} />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Box>
                <Divider />
                <Box sx={{ maxHeight: 360, overflowY: 'auto' }}>
                  {filteredAiHistory.length === 0 && (
                    <Typography
                      sx={{
                        textAlign: 'center',
                        py: 3,
                        color: 'var(--color-text-secondary)',
                        fontFamily: 'var(--font-family-primary)',
                        fontSize: 'var(--font-size-sm)',
                      }}
                    >
                      No summaries found
                    </Typography>
                  )}
                  {filteredAiHistory.map((item, i) => (
                    <Box key={item.id}>
                      {i > 0 && <Divider />}
                      <Box
                        onClick={() => handleAiHistoryClick(item)}
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1.25,
                          px: 2,
                          py: 1.25,
                          cursor: 'pointer',
                          '&:hover': { bgcolor: 'var(--color-background-hover)' },
                        }}
                      >
                        <AutoAwesomeOutlined
                          sx={{
                            fontSize: 18,
                            color: 'var(--color-ai-purple)',
                            flexShrink: 0,
                            ...(item.status === 'generating' && {
                              animation: 'aiPulse 1.4s ease-in-out infinite',
                              '@keyframes aiPulse': {
                                '0%, 100%': { opacity: 1 },
                                '50%': { opacity: 0.35 },
                              },
                            }),
                          }}
                        />
                        <Box sx={{ flex: 1, minWidth: 0 }}>
                          <Typography
                            sx={{
                              fontFamily: 'var(--font-family-primary)',
                              fontSize: 'var(--font-size-sm)',
                              fontWeight: 500,
                              color: 'var(--color-text-primary)',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                            }}
                          >
                            {item.title}
                          </Typography>
                          <Typography
                            sx={{
                              fontFamily: 'var(--font-family-primary)',
                              fontSize: 'var(--font-size-xs)',
                              color: 'var(--color-text-secondary)',
                            }}
                          >
                            {item.subtitle}
                          </Typography>
                        </Box>
                        {item.status === 'ready' ? (
                          <Chip
                            size="small"
                            label="Ready"
                            sx={{
                              height: 22,
                              fontFamily: 'var(--font-family-primary)',
                              fontSize: '11px',
                              fontWeight: 600,
                              bgcolor: 'var(--color-success)',
                              color: 'var(--color-white)',
                            }}
                          />
                        ) : (
                          <Chip
                            size="small"
                            icon={<CircularProgress size={12} sx={{ color: 'var(--color-white)' }} />}
                            label="Generating"
                            sx={{
                              height: 22,
                              fontFamily: 'var(--font-family-primary)',
                              fontSize: '11px',
                              fontWeight: 600,
                              bgcolor: 'var(--color-warning)',
                              color: 'var(--color-white)',
                              '& .MuiChip-icon': { ml: '6px' },
                            }}
                          />
                        )}
                      </Box>
                    </Box>
                  ))}
                </Box>
              </Popover>

              {/* User Menu */}
              <Avatar 
                onClick={handleUserMenuOpen}
                sx={{ 
                  width: 32, 
                  height: 32,
                  bgcolor: 'var(--color-primary)',
                  fontSize: '14px',
                  cursor: 'pointer',
                  '&:hover': {
                    bgcolor: 'var(--color-primary-hover)'
                  }
                }}
              >
                {currentUser.name.split(' ').map(n => n[0]).join('')}
              </Avatar>

              {/* User Dropdown Menu */}
              <Menu
                anchorEl={userMenuAnchor}
                open={Boolean(userMenuAnchor)}
                onClose={handleUserMenuClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
              >
                <MenuItem onClick={handleUserMenuClose}>Profile</MenuItem>
                <MenuItem onClick={handleUserMenuClose}>Settings</MenuItem>
                <MenuItem onClick={handleUserMenuClose}>Logout</MenuItem>
              </Menu>
            </Box>
          </Toolbar>
        </AppBar>

        {/* Page Content */}
        <Box 
          sx={{ 
            flex: 1, 
            overflow: 'auto',
            p: 0,
            minWidth: 0,
            bgcolor: 'var(--color-background-primary)'
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>

    {/* AI summary panel opened from the top-bar history — non-v3 routes only */}
    {!isV3Route && (
      <AiSummaryDrawer
        open={summaryDrawerOpen}
        initialSummary
        onClose={() => setSummaryDrawerOpen(false)}
      />
    )}

    {/* V3-only: summaries history as a Drawer with list → detail */}
    {isV3Route && (
      <Drawer
        anchor="right"
        open={aiDrawerOpen}
        onClose={() => { setAiDrawerOpen(false); setAiDrawerSelectedItem(null); setAiSearch('') }}
        PaperProps={{ sx: { width: 494, maxWidth: '100vw' } }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          {/* Header */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              px: 2.5,
              py: 2,
              borderBottom: '1px solid var(--color-border-primary)',
            }}
          >
            {aiDrawerSelectedItem ? (
              <IconButton
                size="small"
                onClick={() => setAiDrawerSelectedItem(null)}
                sx={{ mr: 0.5 }}
              >
                <ArrowBackOutlined fontSize="small" />
              </IconButton>
            ) : (
              <AutoAwesomeOutlined sx={{ fontSize: 20, color: 'var(--color-primary)', flexShrink: 0 }} />
            )}
            <Typography
              sx={{
                flex: 1,
                fontFamily: 'var(--font-family-primary)',
                fontWeight: 600,
                fontSize: 'var(--font-size-md)',
                color: 'var(--color-text-primary)',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {aiDrawerSelectedItem ? aiDrawerSelectedItem.title : 'AI Summaries'}
            </Typography>
            <IconButton
              size="small"
              onClick={() => { setAiDrawerOpen(false); setAiDrawerSelectedItem(null); setAiSearch('') }}
            >
              <CloseOutlined fontSize="small" />
            </IconButton>
          </Box>

          {aiDrawerSelectedItem ? (
            /* ── Detail view ── */
            <Box sx={{ flex: 1, overflowY: 'auto', p: 2.5 }}>
              {/* AI generated badge */}
              <Box
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 0.5,
                  px: 1,
                  py: 0.25,
                  borderRadius: 999,
                  bgcolor: 'rgba(124, 77, 255, 0.08)',
                  mb: 1,
                }}
              >
                <AutoAwesomeOutlined sx={{ fontSize: 14, color: '#7c4dff' }} />
                <Typography sx={{ fontFamily: 'var(--font-family-primary)', fontSize: '11px', fontWeight: 600, color: '#7c4dff' }}>
                  AI generated
                </Typography>
              </Box>
              <Typography sx={{ fontFamily: 'var(--font-family-primary)', fontSize: '13px', color: 'var(--color-text-secondary)', mb: 2 }}>
                {aiDrawerSelectedItem.subtitle}
              </Typography>

              <Stack spacing={2.5}>
                <Box>
                  <Typography sx={{ fontFamily: 'var(--font-family-primary)', fontWeight: 600, fontSize: '14px', mb: 1 }}>
                    Athlete Medical Summary
                  </Typography>
                  <Stack spacing={1.5}>
                    {[
                      { title: 'Concussion History', body: 'Significant history of concussion. Sustained a concussion in high school (2012) resulting in loss of consciousness and hospitalization for concussion on March 11, 2025.' },
                      { title: 'Musculoskeletal History', body: 'Right Low Back: History of imaging (X-ray, MRI, CT, or bone scan) performed on December 24, 2024 for chronic issues.' },
                      { title: 'Vaccination Status', body: 'Incomplete vaccination history — Mumps: Unknown, Pneumonia: Tetanus: No' },
                    ].map((f) => (
                      <Box key={f.title}>
                        <Typography sx={{ fontFamily: 'var(--font-family-primary)', fontWeight: 600, fontSize: '13px', mb: 0.25 }}>{f.title}</Typography>
                        <Typography sx={{ fontFamily: 'var(--font-family-primary)', fontSize: '13px', color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>{f.body}</Typography>
                      </Box>
                    ))}
                  </Stack>
                </Box>

                <Box>
                  <Typography sx={{ fontFamily: 'var(--font-family-primary)', fontWeight: 600, fontSize: '14px', mb: 1 }}>
                    Recommendations
                  </Typography>
                  <Typography sx={{ fontFamily: 'var(--font-family-primary)', fontWeight: 600, fontSize: '13px', mb: 0.5 }}>Immediate Actions</Typography>
                  <Box component="ul" sx={{ m: 0, pl: 2.5, mb: 1.5 }}>
                    {[
                      'Player should be immediately held from all contact and throwing activities.',
                      'Urgent comprehensive orthopedic evaluation of the right shoulder is required.',
                      'Urgent comprehensive neurological evaluation including a detailed concussion assessment is required.',
                    ].map((t) => (
                      <Typography key={t} component="li" sx={{ fontFamily: 'var(--font-family-primary)', fontSize: '13px', color: 'var(--color-text-secondary)', lineHeight: 1.7 }}>{t}</Typography>
                    ))}
                  </Box>
                  <Typography sx={{ fontFamily: 'var(--font-family-primary)', fontWeight: 600, fontSize: '13px', mb: 0.5 }}>Diagnostic Next Steps</Typography>
                  <Box component="ul" sx={{ m: 0, pl: 2.5 }}>
                    {[
                      'Obtain an MRI of the right shoulder to assess rotator cuff integrity and extent of injury.',
                      'Conduct a full neuropsychological assessment (e.g. ImPACT testing) and a thorough neurological examination.',
                      'Review medical records from the March 11, 2025 concussion hospitalization.',
                    ].map((t) => (
                      <Typography key={t} component="li" sx={{ fontFamily: 'var(--font-family-primary)', fontSize: '13px', color: 'var(--color-text-secondary)', lineHeight: 1.7 }}>{t}</Typography>
                    ))}
                  </Box>
                </Box>
              </Stack>
            </Box>
          ) : (
            /* ── List view ── */
            <>
              <Box sx={{ px: 2, pt: 2, pb: 1.5 }}>
                <TextField
                  fullWidth
                  size="small"
                  variant="filled"
                  placeholder="Search summaries…"
                  value={aiSearch}
                  onChange={(e) => setAiSearch(e.target.value)}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <SearchOutlined fontSize="small" sx={{ color: 'var(--color-primary)' }} />
                      </InputAdornment>
                    ),
                  }}
                />
              </Box>
              <Divider />
              <Box sx={{ flex: 1, overflowY: 'auto' }}>
                {filteredAiHistory.length === 0 && (
                  <Typography
                    sx={{
                      textAlign: 'center',
                      py: 3,
                      color: 'var(--color-text-secondary)',
                      fontFamily: 'var(--font-family-primary)',
                      fontSize: 'var(--font-size-sm)',
                    }}
                  >
                    No summaries found
                  </Typography>
                )}
                {filteredAiHistory.map((item, i) => (
                  <Box key={item.id}>
                    {i > 0 && <Divider />}
                    <Box
                      onClick={() => item.status === 'ready' ? setAiDrawerSelectedItem(item) : setSnackbarOpen(true)}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1.25,
                        px: 2,
                        py: 1.5,
                        cursor: 'pointer',
                        '&:hover': { bgcolor: 'var(--color-background-hover)' },
                      }}
                    >
                      <AutoAwesomeOutlined
                        sx={{
                          fontSize: 18,
                          color: 'var(--color-ai-purple)',
                          flexShrink: 0,
                          ...(item.status === 'generating' && {
                            animation: 'aiPulse 1.4s ease-in-out infinite',
                            '@keyframes aiPulse': {
                              '0%, 100%': { opacity: 1 },
                              '50%': { opacity: 0.35 },
                            },
                          }),
                        }}
                      />
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography
                          sx={{
                            fontFamily: 'var(--font-family-primary)',
                            fontSize: 'var(--font-size-sm)',
                            fontWeight: 500,
                            color: 'var(--color-text-primary)',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {item.title}
                        </Typography>
                        <Typography
                          sx={{
                            fontFamily: 'var(--font-family-primary)',
                            fontSize: 'var(--font-size-xs)',
                            color: 'var(--color-text-secondary)',
                          }}
                        >
                          {item.subtitle}
                        </Typography>
                      </Box>
                      {item.status === 'ready' ? (
                        <Chip
                          size="small"
                          label="Ready"
                          sx={{
                            height: 22,
                            fontFamily: 'var(--font-family-primary)',
                            fontSize: '11px',
                            fontWeight: 600,
                            bgcolor: 'var(--color-success)',
                            color: 'var(--color-white)',
                          }}
                        />
                      ) : (
                        <Chip
                          size="small"
                          icon={<CircularProgress size={12} sx={{ color: 'var(--color-white)' }} />}
                          label="Generating"
                          sx={{
                            height: 22,
                            fontFamily: 'var(--font-family-primary)',
                            fontSize: '11px',
                            fontWeight: 600,
                            bgcolor: 'var(--color-warning)',
                            color: 'var(--color-white)',
                            '& .MuiChip-icon': { ml: '6px' },
                          }}
                        />
                      )}
                    </Box>
                  </Box>
                ))}
              </Box>
            </>
          )}
        </Box>
      </Drawer>
    )}

    <Snackbar
      open={snackbarOpen}
      autoHideDuration={5000}
      onClose={() => setSnackbarOpen(false)}
      message="Your AI summary is still generating. Please check back in a few minutes — you'll see it here when it's ready."
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
    />
    </>
  )
}

export default MedinahLayoutWithMainNav