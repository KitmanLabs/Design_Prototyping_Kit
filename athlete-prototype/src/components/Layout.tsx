import React, { useState } from 'react'
import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import {
  Box,
  Typography,
  List,
  ListItemButton,
  ListItemText,
  Tooltip,
  IconButton,
  ClickAwayListener,
} from '@mui/material'
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined'
import PeopleOutlinedIcon from '@mui/icons-material/PeopleOutlined'
import LocalHospitalOutlinedIcon from '@mui/icons-material/LocalHospitalOutlined'
import SpeedOutlinedIcon from '@mui/icons-material/SpeedOutlined'
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined'
import StorageOutlinedIcon from '@mui/icons-material/StorageOutlined'
import ChatBubbleOutlineOutlinedIcon from '@mui/icons-material/ChatBubbleOutlineOutlined'
import CollectionsOutlinedIcon from '@mui/icons-material/CollectionsOutlined'
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined'
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined'

const RAIL_BG = '#1a2035'
const ACTIVE_BLUE = '#1976d2'

interface NavLink {
  label: string
  route?: string
}

interface PanelDef {
  key: string
  title: string
  links: NavLink[]
}

const PANELS: Record<string, PanelDef> = {
  athletes: {
    key: 'athletes',
    title: 'Athletes',
    links: [
      { label: 'Athletes', route: '/athletes' },
      { label: 'Availability' },
      { label: 'Availability Report' },
      { label: 'Screenings' },
    ],
  },
  settings: {
    key: 'settings',
    title: 'Administration',
    links: [
      { label: 'Manage Athletes', route: '/manage-athletes' },
      { label: 'Manage Staff Users' },
      { label: 'Manage Alerts' },
      { label: 'Manage Games' },
      { label: 'Organization Settings' },
      { label: 'Analytics' },
      { label: 'Order Management' },
      { label: 'Exports' },
      { label: 'Imports' },
      { label: 'Stock Management' },
      { label: 'Fixture Management' },
      { label: 'Logic Builder' },
      { label: 'Labels' },
      { label: 'Athlete Groups' },
      { label: 'Email Log' },
    ],
  },
}

const topIcons: { key: string; panel?: string; Icon: typeof DashboardOutlinedIcon }[] = [
  { key: 'dashboard', Icon: DashboardOutlinedIcon },
  { key: 'athletes', panel: 'athletes', Icon: PeopleOutlinedIcon },
  { key: 'medical', Icon: LocalHospitalOutlinedIcon },
  { key: 'performance', Icon: SpeedOutlinedIcon },
  { key: 'calendar', Icon: CalendarMonthOutlinedIcon },
  { key: 'database', Icon: StorageOutlinedIcon },
  { key: 'chat', Icon: ChatBubbleOutlineOutlinedIcon },
  { key: 'gallery', Icon: CollectionsOutlinedIcon },
  { key: 'person', Icon: PersonOutlineOutlinedIcon },
]

const Layout: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [openPanel, setOpenPanel] = useState<string | null>(null)

  // Which rail icon should appear active based on the current route.
  const activeIconKey = (() => {
    if (location.pathname.startsWith('/manage-athletes')) return 'settings'
    if (location.pathname.startsWith('/athletes')) return 'athletes'
    return null
  })()

  const handleIconClick = (panelKey?: string) => {
    if (!panelKey) {
      setOpenPanel(null)
      return
    }
    setOpenPanel((prev) => (prev === panelKey ? null : panelKey))
  }

  const isLinkActive = (route?: string) => !!route && location.pathname === route

  const panel = openPanel ? PANELS[openPanel] : null

  const railButton = (
    active: boolean,
    Icon: typeof DashboardOutlinedIcon,
    onClick: () => void,
    key: string,
  ) => (
    <Box
      key={key}
      onClick={onClick}
      sx={{
        width: 44,
        height: 44,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 1,
        cursor: 'pointer',
        mb: 0.5,
        backgroundColor: active ? ACTIVE_BLUE : 'transparent',
        '&:hover': { backgroundColor: active ? ACTIVE_BLUE : 'rgba(255,255,255,0.1)' },
      }}
    >
      <Icon sx={{ color: 'white', opacity: active ? 1 : 0.7 }} />
    </Box>
  )

  return (
    <Box sx={{ display: 'flex', height: '100vh', width: '100vw', overflow: 'hidden' }}>
      {/* Sidebar 1 — icon rail */}
      <Box
        sx={{
          width: 60,
          minWidth: 60,
          backgroundColor: RAIL_BG,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          py: 1,
          zIndex: 3,
        }}
      >
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          {topIcons.map(({ key, panel: panelKey, Icon }) =>
            railButton(
              openPanel === panelKey || (openPanel === null && activeIconKey === panelKey),
              Icon,
              () => handleIconClick(panelKey),
              key,
            ),
          )}
        </Box>
        {railButton(
          openPanel === 'settings',
          SettingsOutlinedIcon,
          () => handleIconClick('settings'),
          'settings',
        )}
      </Box>

      {/* Sidebar 2 — nav panel */}
      {panel && (
        <ClickAwayListener onClickAway={() => setOpenPanel(null)}>
          <Box
            sx={{
              width: 220,
              minWidth: 220,
              backgroundColor: RAIL_BG,
              height: '100%',
              zIndex: 2,
            }}
          >
            <Typography sx={{ color: 'white', fontWeight: 'bold', p: 2, fontSize: '0.9rem' }}>
              {panel.title}
            </Typography>
            <List sx={{ py: 0 }}>
              {panel.links.map((link) => {
                const active = isLinkActive(link.route)
                return (
                  <ListItemButton
                    key={link.label}
                    onClick={() => {
                      if (link.route) navigate(link.route)
                      setOpenPanel(null)
                    }}
                    sx={
                      active
                        ? {
                            backgroundColor: ACTIVE_BLUE,
                            color: 'white',
                            borderRadius: 1,
                            mx: 1,
                            pl: 2,
                            py: 0.75,
                            '&:hover': { backgroundColor: ACTIVE_BLUE },
                          }
                        : {
                            color: 'rgba(255,255,255,0.7)',
                            pl: 2,
                            py: 0.75,
                          }
                    }
                  >
                    <ListItemText
                      primary={link.label}
                      primaryTypographyProps={{ fontSize: '0.85rem' }}
                    />
                  </ListItemButton>
                )
              })}
            </List>
          </Box>
        </ClickAwayListener>
      )}

      {/* Main content area */}
      <Box
        sx={{
          flex: 1,
          height: '100%',
          backgroundColor: '#f5f5f5',
          overflow: 'auto',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Outlet />
      </Box>
    </Box>
  )
}

export default Layout
