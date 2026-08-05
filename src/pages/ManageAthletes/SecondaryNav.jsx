import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Box, Typography } from '@mui/material'

const ADMIN_LINKS = [
  { label: 'Manage athletes', path: '/manage-athletes' },
  { label: 'Manage staff users', path: '#' },
  { label: 'Manage alerts', path: '#' },
  { label: 'Manage games', path: '#' },
  { label: 'Organisation settings', path: '#' },
  { label: 'Analytics', path: '#' },
  { label: 'Order management', path: '#' },
  { label: 'Exports', path: '#' },
  { label: 'Imports', path: '#' },
  { label: 'Stock management', path: '#' },
  { label: 'Fixture management', path: '#' },
  { label: 'Logic builder', path: '#' },
  { label: 'Labels', path: '#' },
  { label: 'Athlete groups', path: '#' },
  { label: 'Email log', path: '#' },
]

export default function SecondaryNav() {
  const navigate = useNavigate()
  const location = useLocation()

  function isActive(path) {
    if (path === '/manage-athletes') {
      return location.pathname.startsWith('/manage-athletes')
    }
    return location.pathname === path
  }

  return (
    <Box
      sx={{
        width: 240,
        flexShrink: 0,
        backgroundColor: '#1a2035',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        overflowY: 'auto',
      }}
    >
      <Box sx={{ px: 2, pt: 2.5, pb: 1.5 }}>
        <Typography
          variant="subtitle2"
          sx={{ color: 'rgba(255,255,255,0.5)', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.8 }}
        >
          Administration
        </Typography>
      </Box>

      {ADMIN_LINKS.map((link) => {
        const active = isActive(link.path)
        return (
          <Box
            key={link.label}
            onClick={() => { if (link.path !== '#') navigate(link.path) }}
            sx={{
              px: 2,
              py: 1,
              cursor: link.path !== '#' ? 'pointer' : 'default',
              backgroundColor: active ? '#1976d2' : 'transparent',
              borderRadius: 0,
              mx: 0.5,
              '&:hover': {
                backgroundColor: active ? '#1976d2' : 'rgba(255,255,255,0.06)',
              },
              transition: 'background-color 0.12s',
            }}
          >
            <Typography
              variant="body2"
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
  )
}
