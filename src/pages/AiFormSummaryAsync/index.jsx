import React, { useState, useRef, useEffect } from 'react'
import {
  ThemeProvider,
  createTheme,
  Box,
  Typography,
  Avatar,
  Tabs,
  Tab,
  Button,
  Chip,
  IconButton,
  Drawer,
  Divider,
  CircularProgress,
  Skeleton,
  Badge,
  Snackbar,
  Alert,
  LinearProgress,
  Popover,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Fab,
  ToggleButtonGroup,
  ToggleButton,
  Stepper,
  Step,
  StepLabel,
  Checkbox,
  ListItemText,
  Tooltip,
} from '@mui/material'
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome'
import InfoIcon from '@mui/icons-material/Info'
import CloseIcon from '@mui/icons-material/Close'
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone'
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined'
import PeopleOutlineIcon from '@mui/icons-material/PeopleOutline'
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined'
import LocalHospitalOutlinedIcon from '@mui/icons-material/LocalHospitalOutlined'
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined'
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline'
import ChatIcon from '@mui/icons-material/Chat'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import ErrorIcon from '@mui/icons-material/Error'
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined'
import OpenInFullOutlinedIcon from '@mui/icons-material/OpenInFullOutlined'
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import SyncAltIcon from '@mui/icons-material/SyncAlt'
import WarningAmberIcon from '@mui/icons-material/WarningAmber'
import { keyframes } from '@mui/system'
import { aiSummary, playerOptions, formOptions } from '../../data/aiResponseSummary'

/* ─────────────────────────────────────────────────────────────────────────────
   AI Form Summary — Async Notification Flow prototype (Prototype 3)
   Demonstrates the async loading flow: generate → tooltip/banner → bell badge →
   notifications panel → summary panel.
   Toggle between "Banner" and "Row" notification styles.
───────────────────────────────────────────────────────────────────────────── */

const defaultTheme = createTheme()

const NAVY = '#1a2744'
const AI_BG = '#eeedfe'
const AI_TEXT = '#3c3489'
const PANEL_WIDTH = 420
const NOTIF_WIDTH = 420

const TABS = ['Forms', 'Scheduling overview', 'Completed', 'Compliance', 'Tryouts']

const SIDEBAR_ICONS = [
  { key: 'home', Icon: HomeOutlinedIcon },
  { key: 'athletes', Icon: PeopleOutlineIcon },
  { key: 'calendar', Icon: CalendarMonthOutlinedIcon },
  { key: 'medical', Icon: LocalHospitalOutlinedIcon },
  { key: 'forms', Icon: DescriptionOutlinedIcon, active: true },
  { key: 'messages', Icon: ChatBubbleOutlineIcon },
]

const shakeAnim = keyframes`
  0%   { transform: rotate(0deg); }
  15%  { transform: rotate(10deg); }
  30%  { transform: rotate(-8deg); }
  45%  { transform: rotate(6deg); }
  60%  { transform: rotate(-4deg); }
  75%  { transform: rotate(2deg); }
  90%  { transform: rotate(0deg); }
  100% { transform: rotate(0deg); }
`

const DRAWER_STEPS = ['Select players', 'Select forms', 'Date range']

const PLAYER_OPTIONS = playerOptions.slice(0, 8)
const FORM_OPTIONS = ['Medical Assessment', 'Preseason Assessment']

export default function AiFormSummaryAsync() {
  const [notifStyle, setNotifStyle] = useState('banner') // 'banner' | 'row'

  // Flow state
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [drawerStep, setDrawerStep] = useState(0)
  const [selectedPlayers, setSelectedPlayers] = useState([])
  const [selectedForms, setSelectedForms] = useState([])
  const [dateRange, setDateRange] = useState('last30')

  // Async states
  const [generationPhase, setGenerationPhase] = useState('idle') // idle | generating | ready
  const [snackOpen, setSnackOpen] = useState(false) // banner style tooltip
  const [bellAnimating, setBellAnimating] = useState(false)
  const [bellBadge, setBellBadge] = useState(0)
  const [rowBannerText, setRowBannerText] = useState('') // row style banner text

  // Panel states
  const [notifAnchor, setNotifAnchor] = useState(null)
  const [summaryOpen, setSummaryOpen] = useState(false)

  const bellRef = useRef(null)

  const handleGenerate = () => {
    setDrawerOpen(false)
    setGenerationPhase('generating')

    if (notifStyle === 'banner') {
      // Show snackbar tooltip
      setSnackOpen(true)
      setTimeout(() => {
        setSnackOpen(false)
        // After snack, wait a bit then badge the bell
        setTimeout(() => {
          setGenerationPhase('ready')
          setBellBadge(1)
          setBellAnimating(true)
          setTimeout(() => setBellAnimating(false), 800)
        }, 500)
      }, 5000)
    } else {
      // Row style — show banner immediately
      setRowBannerText('generating')
      setTimeout(() => {
        setGenerationPhase('ready')
        setRowBannerText('ready')
      }, 6000)
    }
  }

  const handleBellClick = (e) => {
    setNotifAnchor(e.currentTarget)
    setBellBadge(0)
  }

  const handleViewSummary = () => {
    setNotifAnchor(null)
    setSummaryOpen(true)
  }

  const handleRowBannerClick = () => {
    if (rowBannerText === 'ready') {
      setSummaryOpen(true)
    }
  }

  const notifOpen = Boolean(notifAnchor)

  return (
    <ThemeProvider theme={defaultTheme}>
      <Box sx={{ position: 'fixed', inset: 0, display: 'flex', bgcolor: '#f5f6f8' }}>
        {/* ── Sidebar ── */}
        <Sidebar />

        {/* ── Main column ── */}
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
          {/* Top bar */}
          <TopBar
            bellRef={bellRef}
            bellBadge={bellBadge}
            bellAnimating={bellAnimating}
            onBellClick={handleBellClick}
          />

          {/* Row-style banner (only shown in row mode when generating/ready) */}
          {notifStyle === 'row' && rowBannerText && (
            <RowBanner text={rowBannerText} onReady={handleRowBannerClick} />
          )}

          {/* Content */}
          <Box sx={{ flex: 1, overflowY: 'auto', px: 3, py: 3 }}>
            {/* Style toggle */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
              <Typography sx={{ fontSize: 13, color: 'text.secondary' }}>Notification style:</Typography>
              <ToggleButtonGroup
                value={notifStyle}
                exclusive
                size="small"
                onChange={(_, v) => {
                  if (!v) return
                  setNotifStyle(v)
                  // Reset flow when switching styles
                  setGenerationPhase('idle')
                  setSnackOpen(false)
                  setBellBadge(0)
                  setRowBannerText('')
                  setSummaryOpen(false)
                }}
                sx={{ '& .MuiToggleButton-root': { textTransform: 'none', fontSize: 13, px: 2 } }}
              >
                <ToggleButton value="banner">Banner</ToggleButton>
                <ToggleButton value="row">Row</ToggleButton>
              </ToggleButtonGroup>
            </Box>

            {/* Page title + action header */}
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
              <Typography sx={{ fontSize: 28, fontWeight: 500 }}>Forms</Typography>
              <Button
                variant="contained"
                size="small"
                disableElevation
                startIcon={<AutoAwesomeIcon sx={{ fontSize: 15 }} />}
                onClick={() => { setDrawerOpen(true); setDrawerStep(0) }}
                sx={{
                  bgcolor: AI_BG,
                  color: AI_TEXT,
                  fontWeight: 500,
                  fontSize: 13,
                  textTransform: 'none',
                  '&:hover': { bgcolor: '#e0dff8' },
                }}
              >
                AI Summary
              </Button>
            </Box>

            {/* Tab bar */}
            <Tabs
              value={0}
              sx={{ borderBottom: 1, borderColor: 'divider', mb: 3, minHeight: 44 }}
              TabIndicatorProps={{ sx: { bgcolor: NAVY } }}
            >
              {TABS.map((t) => (
                <Tab
                  key={t}
                  label={t}
                  disableRipple
                  sx={{
                    textTransform: 'none',
                    minHeight: 44,
                    fontSize: 14,
                    '&.Mui-selected': { color: NAVY, fontWeight: 500 },
                    '&:not(.Mui-selected)': { color: 'text.secondary' },
                  }}
                />
              ))}
            </Tabs>

            {/* Forms content placeholder */}
            <FormsContent />
          </Box>
        </Box>

        {/* ── Simplified 3-step drawer ── */}
        <AiSummaryDrawer
          open={drawerOpen}
          step={drawerStep}
          selectedPlayers={selectedPlayers}
          selectedForms={selectedForms}
          dateRange={dateRange}
          onStepChange={setDrawerStep}
          onPlayersChange={setSelectedPlayers}
          onFormsChange={setSelectedForms}
          onDateRangeChange={setDateRange}
          onClose={() => setDrawerOpen(false)}
          onGenerate={handleGenerate}
        />

        {/* ── Banner-style snackbar (generating notification) ── */}
        <Snackbar
          open={snackOpen}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
          sx={{ top: '80px !important' }}
        >
          <Alert
            icon={<AutoAwesomeIcon sx={{ fontSize: 16, color: AI_TEXT }} />}
            severity="info"
            sx={{
              bgcolor: AI_BG,
              color: AI_TEXT,
              border: `1px solid ${AI_TEXT}33`,
              fontSize: 13,
              alignItems: 'center',
              '& .MuiAlert-icon': { color: AI_TEXT },
            }}
          >
            Your AI summary may take a moment. We'll notify you when it's ready — check your notifications panel.
          </Alert>
        </Snackbar>

        {/* ── Notifications popover ── */}
        <NotificationsPopover
          anchor={notifAnchor}
          onClose={() => setNotifAnchor(null)}
          onViewSummary={handleViewSummary}
          summaryReady={generationPhase === 'ready'}
        />

        {/* ── Summary side panel ── */}
        <SummaryPanel open={summaryOpen} onClose={() => setSummaryOpen(false)} />

        {/* ── Intercom FAB ── */}
        <Fab
          size="medium"
          sx={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            zIndex: 9999,
            bgcolor: NAVY,
            '&:hover': { bgcolor: '#243460' },
          }}
        >
          <ChatIcon sx={{ color: '#fff', fontSize: 22 }} />
        </Fab>
      </Box>
    </ThemeProvider>
  )
}

/* ─── Sidebar ─────────────────────────────────────────────────────────────── */
function Sidebar() {
  return (
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
  )
}

/* ─── Top bar ─────────────────────────────────────────────────────────────── */
function TopBar({ bellRef, bellBadge, bellAnimating, onBellClick }) {
  return (
    <Box
      component="header"
      sx={{
        height: 56,
        flex: '0 0 56px',
        bgcolor: '#fff',
        borderBottom: '0.5px solid',
        borderColor: 'divider',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        px: 3,
      }}
    >
      <Typography sx={{ fontSize: 14, color: 'text.secondary' }}>Forms</Typography>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <IconButton size="small">
          <FileDownloadOutlinedIcon sx={{ fontSize: 20, color: 'text.secondary' }} />
        </IconButton>
        <IconButton size="small">
          <SettingsOutlinedIcon sx={{ fontSize: 20, color: 'text.secondary' }} />
        </IconButton>

        {/* Notification bell */}
        <IconButton
          ref={bellRef}
          size="small"
          onClick={onBellClick}
          sx={{
            animation: bellAnimating ? `${shakeAnim} 0.7s ease` : 'none',
          }}
        >
          <Badge badgeContent={bellBadge} color="error">
            <NotificationsNoneIcon sx={{ fontSize: 22, color: bellBadge > 0 ? NAVY : 'text.secondary' }} />
          </Badge>
        </IconButton>

        {/* Active roster selector */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 0.5,
            px: 1.5,
            py: 0.75,
            border: '0.5px solid',
            borderColor: 'divider',
            borderRadius: 1,
            cursor: 'pointer',
          }}
        >
          <Typography sx={{ fontSize: 13, color: 'text.primary' }}>Active roster</Typography>
          <ArrowForwardIcon sx={{ fontSize: 14, color: 'text.secondary', transform: 'rotate(90deg)' }} />
        </Box>

        <Avatar sx={{ width: 30, height: 30, bgcolor: NAVY, fontSize: 11 }}>DSM</Avatar>
      </Box>
    </Box>
  )
}

/* ─── Row-style banner ────────────────────────────────────────────────────── */
function RowBanner({ text, onReady }) {
  const isReady = text === 'ready'
  return (
    <Box
      onClick={isReady ? onReady : undefined}
      sx={{
        bgcolor: AI_BG,
        borderBottom: `1px solid ${AI_TEXT}33`,
        px: 3,
        py: 1.25,
        display: 'flex',
        alignItems: 'center',
        gap: 1.5,
        cursor: isReady ? 'pointer' : 'default',
        position: 'relative',
        overflow: 'hidden',
        '&:hover': isReady ? { bgcolor: '#e3e2fc' } : {},
      }}
    >
      <AutoAwesomeIcon sx={{ fontSize: 15, color: AI_TEXT, flexShrink: 0 }} />
      {isReady ? (
        <Typography sx={{ fontSize: 13, color: AI_TEXT, fontWeight: 500 }}>
          Your AI summary is ready — Medical Assessment, Preseason Assessment · 22 players · Last 30 days
          <Box component="span" sx={{ ml: 1, textDecoration: 'underline', cursor: 'pointer' }}>
            view it now →
          </Box>
        </Typography>
      ) : (
        <>
          <Typography sx={{ fontSize: 13, color: AI_TEXT }}>
            Your AI summary is generating — Medical Assessment, Preseason Assessment · 22 players · Last 30 days
          </Typography>
          <CircularProgress size={13} sx={{ color: AI_TEXT, ml: 'auto', flexShrink: 0 }} />
        </>
      )}
      {!isReady && (
        <LinearProgress
          sx={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: 2,
            bgcolor: `${AI_TEXT}22`,
            '& .MuiLinearProgress-bar': { bgcolor: AI_TEXT },
          }}
        />
      )}
    </Box>
  )
}

/* ─── Simplified 3-step drawer ───────────────────────────────────────────── */
function AiSummaryDrawer({
  open, step, selectedPlayers, selectedForms, dateRange,
  onStepChange, onPlayersChange, onFormsChange, onDateRangeChange,
  onClose, onGenerate,
}) {
  const togglePlayer = (p) => {
    onPlayersChange(
      selectedPlayers.includes(p)
        ? selectedPlayers.filter((x) => x !== p)
        : [...selectedPlayers, p]
    )
  }
  const toggleForm = (f) => {
    onFormsChange(
      selectedForms.includes(f)
        ? selectedForms.filter((x) => x !== f)
        : [...selectedForms, f]
    )
  }

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: { width: 420, display: 'flex', flexDirection: 'column' },
      }}
    >
      {/* Header */}
      <Box
        sx={{
          p: 2.5,
          borderBottom: '0.5px solid',
          borderColor: 'divider',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <AutoAwesomeIcon sx={{ fontSize: 18, color: AI_TEXT }} />
          <Typography sx={{ fontWeight: 500, fontSize: 16 }}>AI Summary</Typography>
          <Chip
            label="AI generated"
            size="small"
            sx={{ bgcolor: AI_BG, color: AI_TEXT, fontSize: 11, height: 20 }}
          />
        </Box>
        <IconButton size="small" onClick={onClose}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </Box>

      {/* Stepper */}
      <Box sx={{ px: 2.5, pt: 2.5 }}>
        <Stepper activeStep={step} sx={{ mb: 3 }}>
          {DRAWER_STEPS.map((label) => (
            <Step key={label}>
              <StepLabel
                sx={{
                  '& .MuiStepLabel-label': { fontSize: 12 },
                  '& .MuiStepIcon-root.Mui-active': { color: AI_TEXT },
                  '& .MuiStepIcon-root.Mui-completed': { color: AI_TEXT },
                }}
              >
                {label}
              </StepLabel>
            </Step>
          ))}
        </Stepper>
      </Box>

      {/* Step content */}
      <Box sx={{ flex: 1, overflowY: 'auto', px: 2.5, pb: 2 }}>
        {step === 0 && (
          <Box>
            <Typography sx={{ fontSize: 14, fontWeight: 500, mb: 1.5 }}>Select players</Typography>
            <Typography sx={{ fontSize: 12, color: 'text.secondary', mb: 2 }}>
              Choose the players to include in the AI summary.
            </Typography>
            {PLAYER_OPTIONS.map((p) => (
              <Box
                key={p}
                onClick={() => togglePlayer(p)}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  py: 1,
                  cursor: 'pointer',
                  borderBottom: '0.5px solid',
                  borderColor: 'divider',
                  '&:last-child': { borderBottom: 'none' },
                }}
              >
                <Checkbox
                  size="small"
                  checked={selectedPlayers.includes(p)}
                  sx={{ p: 0, color: AI_TEXT, '&.Mui-checked': { color: AI_TEXT } }}
                />
                <Avatar sx={{ width: 28, height: 28, bgcolor: NAVY, fontSize: 11 }}>
                  {p.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                </Avatar>
                <Typography sx={{ fontSize: 13 }}>{p}</Typography>
              </Box>
            ))}
          </Box>
        )}

        {step === 1 && (
          <Box>
            <Typography sx={{ fontSize: 14, fontWeight: 500, mb: 1.5 }}>Select forms</Typography>
            <Typography sx={{ fontSize: 12, color: 'text.secondary', mb: 2 }}>
              Choose which form types to summarise.
            </Typography>
            {FORM_OPTIONS.map((f) => (
              <Box
                key={f}
                onClick={() => toggleForm(f)}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  py: 1.25,
                  cursor: 'pointer',
                  borderBottom: '0.5px solid',
                  borderColor: 'divider',
                  '&:last-child': { borderBottom: 'none' },
                }}
              >
                <Checkbox
                  size="small"
                  checked={selectedForms.includes(f)}
                  sx={{ p: 0, color: AI_TEXT, '&.Mui-checked': { color: AI_TEXT } }}
                />
                <DescriptionOutlinedIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                <Typography sx={{ fontSize: 13 }}>{f}</Typography>
              </Box>
            ))}
          </Box>
        )}

        {step === 2 && (
          <Box>
            <Typography sx={{ fontSize: 14, fontWeight: 500, mb: 1.5 }}>Date range</Typography>
            <Typography sx={{ fontSize: 12, color: 'text.secondary', mb: 2 }}>
              Choose the date range for form responses to include.
            </Typography>
            {[
              { value: 'last7', label: 'Last 7 days' },
              { value: 'last30', label: 'Last 30 days' },
              { value: 'last90', label: 'Last 90 days' },
              { value: 'custom', label: 'Custom range' },
            ].map((opt) => (
              <Box
                key={opt.value}
                onClick={() => onDateRangeChange(opt.value)}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  py: 1.25,
                  cursor: 'pointer',
                  borderBottom: '0.5px solid',
                  borderColor: 'divider',
                  '&:last-child': { borderBottom: 'none' },
                }}
              >
                <Box
                  sx={{
                    width: 16,
                    height: 16,
                    borderRadius: '50%',
                    border: `2px solid ${dateRange === opt.value ? AI_TEXT : '#ccc'}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  {dateRange === opt.value && (
                    <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: AI_TEXT }} />
                  )}
                </Box>
                <Typography sx={{ fontSize: 13 }}>{opt.label}</Typography>
              </Box>
            ))}
          </Box>
        )}
      </Box>

      {/* Footer */}
      <Box
        sx={{
          p: 2.5,
          borderTop: '0.5px solid',
          borderColor: 'divider',
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        <Button
          variant="outlined"
          size="small"
          onClick={() => step > 0 ? onStepChange(step - 1) : onClose()}
          sx={{ textTransform: 'none', borderColor: 'divider', color: 'text.secondary' }}
        >
          {step === 0 ? 'Cancel' : 'Back'}
        </Button>
        {step < 2 ? (
          <Button
            variant="contained"
            size="small"
            disableElevation
            onClick={() => onStepChange(step + 1)}
            sx={{ textTransform: 'none', bgcolor: NAVY }}
          >
            Next
          </Button>
        ) : (
          <Button
            variant="contained"
            size="small"
            disableElevation
            startIcon={<AutoAwesomeIcon sx={{ fontSize: 14 }} />}
            onClick={onGenerate}
            sx={{ textTransform: 'none', bgcolor: AI_TEXT, '&:hover': { bgcolor: '#2e277a' } }}
          >
            Generate summary
          </Button>
        )}
      </Box>
    </Drawer>
  )
}

/* ─── Notifications popover ──────────────────────────────────────────────── */
function NotificationsPopover({ anchor, onClose, onViewSummary, summaryReady }) {
  const open = Boolean(anchor)

  return (
    <Popover
      open={open}
      anchorEl={anchor}
      onClose={onClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      PaperProps={{
        sx: {
          width: NOTIF_WIDTH,
          borderRadius: 2,
          border: '0.5px solid',
          borderColor: 'divider',
          boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
          overflow: 'hidden',
        },
      }}
    >
      {/* Panel header */}
      <Box
        sx={{
          px: 2.5,
          py: 2,
          borderBottom: '0.5px solid',
          borderColor: 'divider',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Typography sx={{ fontWeight: 500, fontSize: 15 }}>Notifications</Typography>
        <IconButton size="small" onClick={onClose}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </Box>

      {/* Row 1 — AI Summary (primary, emphasised) */}
      {summaryReady && (
        <Box
          sx={{
            px: 2.5,
            py: 2,
            borderBottom: '0.5px solid',
            borderColor: 'divider',
            bgcolor: `${AI_BG}88`,
            display: 'flex',
            alignItems: 'flex-start',
            gap: 1.5,
          }}
        >
          <Box
            sx={{
              width: 32,
              height: 32,
              borderRadius: '50%',
              bgcolor: AI_BG,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              mt: 0.25,
            }}
          >
            <AutoAwesomeIcon sx={{ fontSize: 16, color: AI_TEXT }} />
          </Box>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography sx={{ fontSize: 13, fontWeight: 500, mb: 0.25 }}>
              AI Summary ready — Medical Assessment, Preseason Assessment
            </Typography>
            <Typography sx={{ fontSize: 12, color: 'text.secondary' }}>
              22 players · Last 30 days · Just now
            </Typography>
          </Box>
          <Button
            variant="contained"
            size="small"
            disableElevation
            onClick={onViewSummary}
            sx={{
              textTransform: 'none',
              bgcolor: NAVY,
              fontSize: 12,
              flexShrink: 0,
              ml: 1,
              alignSelf: 'center',
              '&:hover': { bgcolor: '#243460' },
            }}
          >
            View summary
          </Button>
        </Box>
      )}

      {/* Row 2 — Export in progress */}
      <NotifRow
        icon={<CircularProgressIcon pct={20} />}
        title="Stephen Player Medical Export.zip"
        subtitle="Medical Export | 29 Apr 2025 11:23 | Exporting 20%"
        action={
          <Button
            variant="outlined"
            size="small"
            sx={{ textTransform: 'none', fontSize: 12, borderColor: 'divider', color: 'text.secondary' }}
          >
            Cancel export
          </Button>
        }
      />

      {/* Row 3 — Export ready */}
      <NotifRow
        icon={<CheckCircleIcon sx={{ fontSize: 22, color: '#2e7d32' }} />}
        title="Oura Mark Medical Export.zip"
        subtitle="Medical Export | 29 Apr 2025 11:23"
        action={
          <Button
            variant="contained"
            size="small"
            disableElevation
            sx={{ textTransform: 'none', fontSize: 12, bgcolor: NAVY, '&:hover': { bgcolor: '#243460' } }}
          >
            Download
          </Button>
        }
      />

      {/* Row 4 — Export error */}
      <NotifRow
        icon={<ErrorIcon sx={{ fontSize: 22, color: '#c62828' }} />}
        title="Noam Efergan Medical Export.zip"
        subtitle="Medical Export | 29 Apr 2025 11:23"
        action={
          <Button
            variant="outlined"
            size="small"
            sx={{ textTransform: 'none', fontSize: 12, borderColor: 'divider', color: 'text.secondary' }}
          >
            Troubleshoot
          </Button>
        }
      />

      {/* Row 5 — Export ready */}
      <NotifRow
        icon={<CheckCircleIcon sx={{ fontSize: 22, color: '#2e7d32' }} />}
        title="Joel Garmin Medical Export.zip"
        subtitle="Medical Export | 29 Apr 2025 11:23"
        action={
          <Button
            variant="contained"
            size="small"
            disableElevation
            sx={{ textTransform: 'none', fontSize: 12, bgcolor: NAVY, '&:hover': { bgcolor: '#243460' } }}
          >
            Download
          </Button>
        }
      />

      {/* Footer */}
      <Box
        sx={{
          px: 2.5,
          py: 1.5,
          borderTop: '0.5px solid',
          borderColor: 'divider',
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          cursor: 'pointer',
          '&:hover': { bgcolor: 'grey.50' },
        }}
      >
        <SyncAltIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
        <Typography sx={{ fontSize: 13, color: 'text.secondary' }}>Full export history</Typography>
      </Box>
    </Popover>
  )
}

function NotifRow({ icon, title, subtitle, action }) {
  return (
    <Box
      sx={{
        px: 2.5,
        py: 1.75,
        borderBottom: '0.5px solid',
        borderColor: 'divider',
        display: 'flex',
        alignItems: 'center',
        gap: 1.5,
      }}
    >
      <Box sx={{ width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        {icon}
      </Box>
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography sx={{ fontSize: 13, fontWeight: 400, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {title}
        </Typography>
        <Typography sx={{ fontSize: 12, color: 'text.secondary' }}>{subtitle}</Typography>
      </Box>
      <Box sx={{ flexShrink: 0, ml: 1 }}>{action}</Box>
    </Box>
  )
}

function CircularProgressIcon({ pct }) {
  return (
    <Box sx={{ position: 'relative', width: 22, height: 22 }}>
      <CircularProgress
        variant="determinate"
        value={100}
        size={22}
        thickness={4}
        sx={{ color: '#f5f5f5', position: 'absolute', top: 0, left: 0 }}
      />
      <CircularProgress
        variant="determinate"
        value={pct}
        size={22}
        thickness={4}
        sx={{ color: '#f59e0b', position: 'absolute', top: 0, left: 0 }}
      />
    </Box>
  )
}

/* ─── Summary side panel ──────────────────────────────────────────────────── */
function SummaryPanel({ open, onClose }) {
  return (
    <Drawer
      anchor="right"
      open={open}
      variant="temporary"
      onClose={onClose}
      PaperProps={{
        sx: {
          width: PANEL_WIDTH,
          display: 'flex',
          flexDirection: 'column',
        },
      }}
    >
      {/* Header */}
      <Box
        sx={{
          p: 2.5,
          borderBottom: '0.5px solid',
          borderColor: 'divider',
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
        }}
      >
        <Box>
          <Typography sx={{ fontWeight: 500, fontSize: 17 }}>Player response summary</Typography>
          <Chip
            icon={<AutoAwesomeIcon sx={{ fontSize: 13, color: `${AI_TEXT} !important` }} />}
            label="AI generated"
            size="small"
            sx={{ mt: 1, bgcolor: AI_BG, color: AI_TEXT, fontWeight: 500, fontSize: 11, height: 22 }}
          />
          <Typography sx={{ fontSize: 12, color: 'text.secondary', mt: 1 }}>
            22 players · 2 forms · Last 30 days
          </Typography>
        </Box>
        <IconButton size="small" onClick={onClose}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </Box>

      {/* Body */}
      <Box sx={{ flex: 1, overflowY: 'auto', p: 2.5 }}>
        <Typography sx={{ fontWeight: 500, fontSize: 15, mb: 2 }}>
          {aiSummary.sectionTitle}
        </Typography>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {aiSummary.findings.map((f, i) => (
            <Box key={f.title} sx={{ display: 'flex', gap: 1.25 }}>
              {i === 2 ? (
                <WarningAmberIcon sx={{ fontSize: 17, color: '#f59e0b', mt: '2px', flexShrink: 0 }} />
              ) : (
                <InfoIcon sx={{ fontSize: 17, color: AI_TEXT, mt: '2px', flexShrink: 0 }} />
              )}
              <Box>
                <Typography sx={{ fontSize: 13, fontWeight: 500 }}>{f.title}</Typography>
                <Typography sx={{ fontSize: 12, color: 'text.secondary', mt: 0.25, lineHeight: 1.6 }}>
                  {f.body}
                </Typography>
              </Box>
            </Box>
          ))}
        </Box>

        <Divider sx={{ my: 2.5 }} />

        <Typography sx={{ fontWeight: 500, fontSize: 15, mb: 1.5 }}>Recommendations</Typography>
        <RecoSection title="Immediate actions" items={aiSummary.recommendations.immediateActions} />
        <RecoSection title="Diagnostic next steps" items={aiSummary.recommendations.diagnosticNextSteps} />
      </Box>

      {/* Footer */}
      <Box
        sx={{
          p: 2.5,
          borderTop: '0.5px solid',
          borderColor: 'divider',
          display: 'flex',
          gap: 1.5,
        }}
      >
        <Button
          variant="outlined"
          size="small"
          fullWidth
          sx={{ textTransform: 'none', borderColor: 'divider', color: 'text.secondary' }}
        >
          Export PDF
        </Button>
        <Button
          variant="contained"
          size="small"
          disableElevation
          fullWidth
          startIcon={<AutoAwesomeIcon sx={{ fontSize: 13 }} />}
          sx={{
            textTransform: 'none',
            bgcolor: NAVY,
            '&:hover': { bgcolor: '#243460' },
          }}
        >
          Regenerate
        </Button>
      </Box>
    </Drawer>
  )
}

function RecoSection({ title, items }) {
  return (
    <Box sx={{ mt: 2 }}>
      <Typography sx={{ fontSize: 13, fontWeight: 500, mb: 1 }}>{title}</Typography>
      <Box component="ul" sx={{ m: 0, pl: 2.5, display: 'flex', flexDirection: 'column', gap: 0.75 }}>
        {items.map((item, i) => (
          <Typography key={i} component="li" sx={{ fontSize: 12, color: 'text.secondary', lineHeight: 1.6 }}>
            {item}
          </Typography>
        ))}
      </Box>
    </Box>
  )
}

/* ─── Forms content placeholder ──────────────────────────────────────────── */
function FormsContent() {
  const formRows = [
    { name: 'Medical Assessment', category: 'Medical', assigned: 22, completed: 18, due: 'Jun 20, 2026', status: 'Active' },
    { name: 'Preseason Assessment', category: 'Medical', assigned: 22, completed: 22, due: 'May 15, 2026', status: 'Complete' },
    { name: 'Wellness Check', category: 'General', assigned: 22, completed: 10, due: 'Jun 25, 2026', status: 'Active' },
    { name: 'Transfer Screening', category: 'Administrative', assigned: 5, completed: 3, due: 'Jun 30, 2026', status: 'Active' },
    { name: 'End of Season Survey', category: 'General', assigned: 22, completed: 0, due: 'Jul 10, 2026', status: 'Scheduled' },
  ]

  return (
    <Paper variant="outlined" sx={{ borderRadius: 2, overflow: 'hidden' }}>
      {/* Header row */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: '2fr 1fr 100px 100px 140px 100px',
          px: 2,
          py: 1.25,
          borderBottom: '0.5px solid',
          borderColor: 'divider',
          bgcolor: '#fafafa',
        }}
      >
        {['Form name', 'Category', 'Assigned', 'Completed', 'Due date', 'Status'].map((h) => (
          <Typography key={h} sx={{ fontSize: 12, fontWeight: 500, color: 'text.secondary' }}>
            {h}
          </Typography>
        ))}
      </Box>

      {formRows.map((row, i) => (
        <Box
          key={row.name}
          sx={{
            display: 'grid',
            gridTemplateColumns: '2fr 1fr 100px 100px 140px 100px',
            px: 2,
            py: 1.5,
            alignItems: 'center',
            borderBottom: i < formRows.length - 1 ? '0.5px solid' : 'none',
            borderColor: 'divider',
            '&:hover': { bgcolor: 'grey.50' },
          }}
        >
          <Typography sx={{ fontSize: 13, fontWeight: 500 }}>{row.name}</Typography>
          <Typography sx={{ fontSize: 13, color: 'text.secondary' }}>{row.category}</Typography>
          <Typography sx={{ fontSize: 13 }}>{row.assigned}</Typography>
          <Typography sx={{ fontSize: 13 }}>{row.completed}</Typography>
          <Typography sx={{ fontSize: 13, color: 'text.secondary' }}>{row.due}</Typography>
          <Chip
            label={row.status}
            size="small"
            sx={{
              fontSize: 11,
              height: 22,
              bgcolor:
                row.status === 'Complete' ? '#e8f5e9' :
                row.status === 'Active' ? '#e3f2fd' :
                '#f5f5f5',
              color:
                row.status === 'Complete' ? '#2e7d32' :
                row.status === 'Active' ? '#1565c0' :
                'text.secondary',
              width: 'fit-content',
            }}
          />
        </Box>
      ))}
    </Paper>
  )
}
