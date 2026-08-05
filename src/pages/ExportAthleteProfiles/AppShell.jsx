import React from 'react'
import { Box, Avatar, Tooltip, Typography, IconButton } from '@mui/material'
import BarChartIcon from '@mui/icons-material/BarChart'
import PeopleIcon from '@mui/icons-material/People'
import AddCircleIcon from '@mui/icons-material/AddCircle'
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter'
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth'
import ChatIcon from '@mui/icons-material/Chat'
import PhotoIcon from '@mui/icons-material/Photo'
import PersonIcon from '@mui/icons-material/Person'
import SettingsIcon from '@mui/icons-material/Settings'
import HelpOutlineIcon from '@mui/icons-material/HelpOutline'
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import PersonOutlineIcon from '@mui/icons-material/PersonOutline'
import { C } from './theme'

const NAVY_SIDEBAR = '#1A2133'
const GREY_ICON = '#949BA6'

const NAV_ICONS = [
  { Icon: AddCircleIcon, label: 'Add' },
  { Icon: BarChartIcon, label: 'Dashboard' },
  { Icon: PeopleIcon, label: 'Athletes' },
  { Icon: CalendarMonthIcon, label: 'Calendar' },
  { Icon: FitnessCenterIcon, label: 'Workloads' },
  { Icon: PhotoIcon, label: 'Media' },
  { Icon: ChatIcon, label: 'Messages' },
  { Icon: PersonIcon, label: 'Profile' },
  { Icon: SettingsIcon, label: 'Settings', active: true },
]

function Sidebar() {
  return (
    <Box
      sx={{
        width: 52,
        flexShrink: 0,
        bgcolor: NAVY_SIDEBAR,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        py: 1.25,
      }}
    >
      {/* K logo — white outlined circle */}
      <Avatar
        sx={{
          width: 32,
          height: 32,
          bgcolor: 'transparent',
          border: '1px solid #FFFFFF',
          color: '#FFFFFF',
          fontWeight: 800,
          fontSize: 15,
          mb: 2,
        }}
      >
        K
      </Avatar>

      {NAV_ICONS.map(({ Icon, label, active }) => (
        <Tooltip key={label} title={label} placement="right">
          <Box
            sx={{
              width: '100%',
              height: 44,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: active ? '#FFFFFF' : GREY_ICON,
              borderLeft: active ? `3px solid ${C.accent}` : '3px solid transparent',
              '&:hover': { color: '#FFFFFF' },
            }}
          >
            <Icon sx={{ fontSize: 22 }} />
          </Box>
        </Tooltip>
      ))}

      <Box sx={{ flex: 1 }} />

      <Box sx={{ width: 44, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: GREY_ICON, '&:hover': { color: '#FFFFFF' } }}>
        <HelpOutlineIcon sx={{ fontSize: 22 }} />
      </Box>
      <Box sx={{ width: 44, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: GREY_ICON, '&:hover': { color: '#FFFFFF' } }}>
        <KeyboardDoubleArrowRightIcon sx={{ fontSize: 22 }} />
      </Box>
    </Box>
  )
}

function TopBar() {
  return (
    <Box
      sx={{
        height: 56,
        flexShrink: 0,
        bgcolor: '#FFFFFF',
        borderBottom: 1,
        borderColor: 'divider',
        display: 'flex',
        alignItems: 'center',
        px: 2.5,
        gap: 1,
      }}
    >
      {/* Breadcrumb — flat inline Typography */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Typography variant="body2" color="text.secondary">Manage Athletes</Typography>
        <PersonOutlineIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
        <Typography variant="body2" color="text.secondary">Player list</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ letterSpacing: 2 }}>›  ›</Typography>
      </Box>

      <Box sx={{ flex: 1 }} />

      {/* Right: club name + avatar */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, cursor: 'pointer' }}>
        <Typography variant="body2" color="text.secondary">Club name</Typography>
        <KeyboardArrowDownIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
      </Box>
      <Avatar sx={{ width: 32, height: 32 }} src="https://i.pravatar.cc/64?img=47" alt="User" />
    </Box>
  )
}

export default function AppShell({ children }) {
  return (
    <Box sx={{ display: 'flex', height: '100vh', overflow: 'hidden', bgcolor: '#FFFFFF' }}>
      <Sidebar />
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <TopBar />
        <Box sx={{ flex: 1, overflow: 'auto', px: 4, py: 3 }}>{children}</Box>
      </Box>
    </Box>
  )
}
