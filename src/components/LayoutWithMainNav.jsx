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
  CssBaseline
} from '@mui/material'
import {
  NotificationsOutlined
} from '@mui/icons-material'
import MainNavigation from './MainNavigation'
import { currentUser, availableSquads, pageTitles, pagesWithOwnHeader } from '../data/layout'
import '../styles/design-tokens.css'

function MedinahLayoutWithMainNav({ children }) {
  const location = useLocation()
  const navigate = useNavigate()
  const [isNavOpen, setIsNavOpen] = useState(false)
  const [currentSquad, setCurrentSquad] = useState(availableSquads[0])
  const [userMenuAnchor, setUserMenuAnchor] = useState(null)

  const getPageTitle = () => {
    if (location.pathname.startsWith('/forms')) return 'Forms'
    if (pageTitles[location.pathname]) return pageTitles[location.pathname]
    // A page under a section (an athlete's profile under /athletes) takes the section's title
    const section = Object.keys(pageTitles).find((path) => location.pathname.startsWith(`${path}/`))
    return section ? pageTitles[section] : 'Dashboard'
  }

  const handleNavToggle = () => {
    setIsNavOpen(!isNavOpen)
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

  // Pages with their own page header show the app bar title as a quieter section label
  const hasPageHeader = pagesWithOwnHeader.some(
    (path) => location.pathname === path || location.pathname.startsWith(`${path}/`)
  )

  return (
    <>
      <CssBaseline />
      <Box sx={{ display: 'flex', gap: 0, height: '100vh', bgcolor: 'var(--color-background-primary)' }}>
      {/* Main Navigation */}
      <MainNavigation 
        isOpen={isNavOpen}
        onToggle={handleNavToggle}
        variant="permanent"
      />
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
                fontWeight: hasPageHeader ? 500 : 600,
                fontSize: hasPageHeader ? '14px' : undefined,
                color: hasPageHeader ? 'var(--color-text-secondary)' : 'var(--color-text-primary)',
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
    </>
  )
}

export default MedinahLayoutWithMainNav