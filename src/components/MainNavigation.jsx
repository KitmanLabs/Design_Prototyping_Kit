import React, { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Box, Drawer, Typography, Tooltip } from '@mui/material'
import {
  LocalHospitalOutlined,
  AnalyticsOutlined,
  PeopleOutlined,
  FitnessCenterOutlined,
  AssignmentOutlined,
  CalendarMonthOutlined,
  HistoryOutlined,
  SettingsOutlined,
  HelpOutlined,
  ChatOutlined,
} from '@mui/icons-material'
import '../styles/design-tokens.css'

const KitmanLogo = '/assets/logos/Kitman Labs base.png'

const ICON_WIDTH = 60
const PANEL_WIDTH = 240

// Items in the main icon sidebar
const MAIN_ITEMS = [
  { id: 'medical',   label: 'Medical',      icon: LocalHospitalOutlined,  path: '/medical' },
  { id: 'analysis',  label: 'Analysis',     icon: AnalyticsOutlined,      path: '/analysis' },
  { id: 'athletes',  label: 'Athletes',     icon: PeopleOutlined,         panel: 'athletes' },
  { id: 'workload',  label: 'Workload',     icon: FitnessCenterOutlined,  path: '/workloads' },
  { id: 'forms',     label: 'Forms',        icon: AssignmentOutlined,     path: '/forms' },
  { id: 'calendar',  label: 'Calendar',     icon: CalendarMonthOutlined,  path: '/planning' },
  { id: 'messages',  label: 'Messages',     icon: ChatOutlined,           path: '/messages' },
  { id: 'activity',  label: 'Activity log', icon: HistoryOutlined,        path: '/activity' },
]

const BOTTOM_ITEMS = [
  { id: 'help',  label: 'Help',  icon: HelpOutlined,     path: '/help' },
  { id: 'admin', label: 'Admin', icon: SettingsOutlined, panel: 'admin' },
]

const PANELS = {
  athletes: {
    title: 'Athletes',
    links: [
      { label: 'Athletes',            path: '/athlete' },
      { label: 'Availability',        path: '#' },
      { label: 'Availability report', path: '#' },
      { label: 'Screenings',          path: '#' },
    ],
  },
  admin: {
    title: 'Administration',
    links: [
      { label: 'Manage athletes',      path: '/manage-athletes' },
      { label: 'Manage staff users',   path: '#' },
      { label: 'Manage alerts',        path: '#' },
      { label: 'Manage games',         path: '#' },
      { label: 'Organisation settings',path: '#' },
      { label: 'Analytics',            path: '#' },
      { label: 'Order management',     path: '#' },
      { label: 'Exports',              path: '#' },
      { label: 'Imports',              path: '#' },
      { label: 'Stock management',     path: '#' },
      { label: 'Fixture management',   path: '#' },
      { label: 'Logic builder',        path: '#' },
      { label: 'Labels',               path: '#' },
      { label: 'Athlete groups',       path: '#' },
      { label: 'Email log',            path: '#' },
    ],
  },
}

// Determine which panel should be open for a given pathname
function getPanelFromPath(pathname) {
  if (pathname.startsWith('/manage-athletes') || pathname === '/settings') return 'admin'
  if (pathname === '/athlete' || pathname.startsWith('/athlete/')) return 'athletes'
  return null
}

// Is this icon currently "active" (route match or its panel is open)
function isIconActive(item, pathname, openPanel) {
  if (item.panel) return openPanel === item.panel
  if (item.path === '/forms') return pathname.startsWith('/forms')
  return pathname === item.path
}

// ─── Icon sidebar button ──────────────────────────────────────────────────────
function IconButton_({ item, active, onClick }) {
  const Icon = item.icon
  return (
    <Tooltip title={item.label} placement="right" arrow>
      <Box
        onClick={onClick}
        sx={{
          width: ICON_WIDTH,
          height: 44,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          position: 'relative',
          flexShrink: 0,
          backgroundColor: active ? 'rgba(255,255,255,0.12)' : 'transparent',
          '&:hover': { backgroundColor: active ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.07)' },
          '&::before': active ? {
            content: '""',
            position: 'absolute',
            left: 0,
            top: '25%',
            bottom: '25%',
            width: 3,
            backgroundColor: '#fff',
            borderRadius: '0 2px 2px 0',
          } : {},
        }}
      >
        <Icon sx={{ fontSize: 20, color: active ? '#fff' : 'rgba(255,255,255,0.65)' }} />
      </Box>
    </Tooltip>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function MainNavigation() {
  const location = useLocation()
  const navigate = useNavigate()

  const [openPanel, setOpenPanel] = useState(() => getPanelFromPath(location.pathname))

  // Keep panel in sync when the user navigates via URL
  useEffect(() => {
    const panel = getPanelFromPath(location.pathname)
    if (panel && panel !== openPanel) {
      setOpenPanel(panel)
    }
  }, [location.pathname]) // eslint-disable-line react-hooks/exhaustive-deps

  function handleIconClick(item) {
    if (item.panel) {
      setOpenPanel(prev => (prev === item.panel ? null : item.panel))
    } else if (item.path) {
      navigate(item.path)
    }
  }

  function handleLinkClick(path) {
    if (path && path !== '#') navigate(path)
  }

  const drawerWidth = openPanel ? ICON_WIDTH + PANEL_WIDTH : ICON_WIDTH
  const panelData = openPanel ? PANELS[openPanel] : null
  const pathname = location.pathname

  // ── Icon sidebar ────────────────────────────────────────────────────────────
  const iconSidebar = (
    <Box
      sx={{
        width: ICON_WIDTH,
        flexShrink: 0,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        // eslint-disable-next-line design-system/no-hardcoded-colors
        background: 'linear-gradient(180deg, #000 0%, #111 40%, #000 70%, #040037ff 90%, #040037ff 100%)',
        borderRight: openPanel ? '1px solid rgba(255,255,255,0.08)' : 'none',
      }}
    >
      {/* Logo */}
      <Box sx={{ height: 56, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <img src={KitmanLogo} alt="Kitman Labs" style={{ height: 28, width: 'auto', objectFit: 'contain' }} />
      </Box>

      {/* Main nav icons */}
      <Box sx={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', py: 0.5 }}>
        {MAIN_ITEMS.map(item => (
          <IconButton_
            key={item.id}
            item={item}
            active={isIconActive(item, pathname, openPanel)}
            onClick={() => handleIconClick(item)}
          />
        ))}
      </Box>

      {/* Bottom icons */}
      <Box sx={{ flexShrink: 0, pb: 1 }}>
        {BOTTOM_ITEMS.map(item => (
          <IconButton_
            key={item.id}
            item={item}
            active={isIconActive(item, pathname, openPanel)}
            onClick={() => handleIconClick(item)}
          />
        ))}
      </Box>
    </Box>
  )

  // ── Expanded panel ──────────────────────────────────────────────────────────
  const expandedPanel = panelData && (
    <Box
      sx={{
        width: PANEL_WIDTH,
        flexShrink: 0,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        // eslint-disable-next-line design-system/no-hardcoded-colors
        backgroundColor: '#1a2035',
        overflowY: 'auto',
      }}
    >
      {/* Panel title */}
      <Box sx={{ px: 2, pt: 2.5, pb: 1.5, flexShrink: 0 }}>
        <Typography
          sx={{
            color: 'rgba(255,255,255,0.5)',
            fontSize: 11,
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: 0.8,
          }}
        >
          {panelData.title}
        </Typography>
      </Box>

      {/* Panel links */}
      <Box sx={{ flex: 1, overflowY: 'auto' }}>
        {panelData.links.map(link => {
          const active = link.path !== '#' && pathname.startsWith(link.path)
          return (
            <Box
              key={link.label}
              onClick={() => handleLinkClick(link.path)}
              sx={{
                px: 2,
                py: 1,
                mx: 0.5,
                cursor: link.path !== '#' ? 'pointer' : 'default',
                backgroundColor: active ? '#1976d2' : 'transparent',
                borderRadius: 0,
                '&:hover': {
                  backgroundColor: active ? '#1976d2' : 'rgba(255,255,255,0.06)',
                },
                transition: 'background-color 0.12s',
              }}
            >
              <Typography
                sx={{
                  color: active ? '#fff' : 'rgba(255,255,255,0.75)',
                  fontWeight: active ? 600 : 400,
                  fontSize: 14,
                }}
              >
                {link.label}
              </Typography>
            </Box>
          )
        })}
      </Box>
    </Box>
  )

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          border: 'none',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'row',
          height: '100vh',
        },
      }}
    >
      {iconSidebar}
      {expandedPanel}
    </Drawer>
  )
}
