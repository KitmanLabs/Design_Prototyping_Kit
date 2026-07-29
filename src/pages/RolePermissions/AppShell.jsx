import React, { useState } from 'react'
import { Box, Typography, Avatar, Tooltip } from '@mui/material'
import {
  BarChartOutlined,
  GroupsOutlined,
  AddBoxOutlined,
  SportsOutlined,
  AssignmentOutlined,
  CalendarMonthOutlined,
  InboxOutlined,
  ChatBubbleOutlineOutlined,
  MailOutlineOutlined,
  SettingsOutlined,
  FileDownloadOutlined,
  HelpOutlineOutlined,
  KeyboardDoubleArrowRightOutlined,
  KeyboardArrowDownOutlined,
} from '@mui/icons-material'

// eslint-disable-next-line design-system/no-hardcoded-colors
const NAVY_GRADIENT = 'linear-gradient(180deg, #0b1b3a 0%, #0a1730 50%, #0c1d3f 100%)'
// eslint-disable-next-line design-system/no-hardcoded-colors
const RED = '#d32f2f'

const SIDEBAR_ICONS = [
  BarChartOutlined, GroupsOutlined, AddBoxOutlined, SportsOutlined,
  AssignmentOutlined, CalendarMonthOutlined, InboxOutlined,
  ChatBubbleOutlineOutlined, MailOutlineOutlined,
]

const ADMIN_ITEMS = [
  'Manage Players', 'Manage Staff Users', 'Manage Games', 'Organisation Settings',
  'Exports', 'Stock Management', 'Labels', 'Player Groups',
]

export default function AppShell({ activeAdminItem, onAdminNavigate, children }) {
  const [adminOpen, setAdminOpen] = useState(false)

  return (
    <Box sx={{ display: 'flex', height: '100vh', overflow: 'hidden', bgcolor: 'white' }}>
      {/* Icon rail */}
      <Box sx={{
        width: 64, flexShrink: 0, background: NAVY_GRADIENT,
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        py: 1.5, gap: 0.5,
      }}>
        {/* NFL crest placeholder */}
        <Box sx={{
          width: 38, height: 38, borderRadius: '6px', bgcolor: 'white',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          mb: 1.5, fontWeight: 800, fontSize: 11, color: '#0b1b3a',
          // eslint-disable-next-line design-system/no-hardcoded-colors
          border: '1px solid #c8102e',
        }}>
          NFL
        </Box>

        {SIDEBAR_ICONS.map((Icon, i) => (
          <Box key={i} sx={{
            width: 40, height: 40, borderRadius: 1, display: 'flex',
            alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
            color: 'rgba(255,255,255,0.85)',
            '&:hover': { bgcolor: 'rgba(255,255,255,0.08)' },
          }}>
            <Icon sx={{ fontSize: 22 }} />
          </Box>
        ))}

        {/* Settings cog — toggles Administration panel */}
        <Tooltip title="Administration" placement="right">
          <Box
            onClick={() => setAdminOpen(o => !o)}
            sx={{
              width: 40, height: 40, borderRadius: 1, display: 'flex',
              alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
              color: 'white',
              bgcolor: adminOpen ? RED : 'transparent',
              '&:hover': { bgcolor: adminOpen ? RED : 'rgba(255,255,255,0.08)' },
            }}
          >
            <SettingsOutlined sx={{ fontSize: 22 }} />
          </Box>
        </Tooltip>

        <Box sx={{
          width: 40, height: 40, borderRadius: 1, display: 'flex',
          alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
          color: 'rgba(255,255,255,0.85)',
          '&:hover': { bgcolor: 'rgba(255,255,255,0.08)' },
        }}>
          <FileDownloadOutlined sx={{ fontSize: 22 }} />
        </Box>

        <Box sx={{ flex: 1 }} />

        <Box sx={{
          width: 40, height: 40, borderRadius: 1, display: 'flex',
          alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
          color: 'rgba(255,255,255,0.85)',
        }}>
          <HelpOutlineOutlined sx={{ fontSize: 22 }} />
        </Box>
        <Box sx={{
          width: 40, height: 40, borderRadius: 1, display: 'flex',
          alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
          color: 'rgba(255,255,255,0.85)',
        }}>
          <KeyboardDoubleArrowRightOutlined sx={{ fontSize: 22 }} />
        </Box>
      </Box>

      {/* Administration secondary panel */}
      {adminOpen && (
        <Box sx={{
          width: 300, flexShrink: 0, background: NAVY_GRADIENT,
          // eslint-disable-next-line design-system/no-hardcoded-colors
          borderLeft: '1px solid rgba(255,255,255,0.06)',
          color: 'white', py: 3, px: 0,
        }}>
          <Typography sx={{ px: 3, mb: 2, fontWeight: 700, fontSize: 22, color: 'white' }}>
            Administration
          </Typography>
          {ADMIN_ITEMS.map((item) => {
            const isActive = item === activeAdminItem
            return (
              <Box
                key={item}
                onClick={() => {
                  if (item === 'Manage Staff Users' || item === 'Organisation Settings') {
                    onAdminNavigate(item)
                  }
                }}
                sx={{
                  px: 3, py: 1.5, cursor: 'pointer',
                  bgcolor: isActive ? RED : 'transparent',
                  fontWeight: isActive ? 700 : 400,
                  fontSize: 16,
                  color: 'white',
                  '&:hover': { bgcolor: isActive ? RED : 'rgba(255,255,255,0.08)' },
                }}
              >
                {item}
              </Box>
            )
          })}
        </Box>
      )}

      {/* Main column */}
      <Box sx={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Top bar */}
        <Box sx={{
          height: 64, flexShrink: 0, borderBottom: '1px solid var(--color-border-primary)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 3,
          bgcolor: 'white',
        }}>
          <Box sx={{
            display: 'flex', alignItems: 'center', gap: 1,
            bgcolor: '#0b1b3a', color: 'white', px: 2, py: 0.75, borderRadius: 1,
            cursor: 'pointer', fontWeight: 600, fontSize: 14,
            // eslint-disable-next-line design-system/no-hardcoded-colors
          }}>
            Player list <KeyboardDoubleArrowRightOutlined sx={{ fontSize: 18 }} />
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{
              width: 26, height: 26, borderRadius: '4px', bgcolor: 'white',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: 800, fontSize: 9, color: '#0b1b3a',
              // eslint-disable-next-line design-system/no-hardcoded-colors
              border: '1px solid #c8102e',
            }}>NFL</Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, cursor: 'pointer' }}>
              <Typography sx={{ fontWeight: 600, fontSize: 15 }}>Active Roster</Typography>
              <KeyboardArrowDownOutlined sx={{ fontSize: 20, color: 'text.secondary' }} />
            </Box>
            <Avatar sx={{ width: 36, height: 36, bgcolor: 'grey.300', color: 'text.secondary', fontSize: 13, fontWeight: 600 }}>
              LV
            </Avatar>
          </Box>
        </Box>

        {/* Page content */}
        <Box sx={{ flex: 1, overflow: 'auto', bgcolor: 'white' }}>
          {children}
        </Box>
      </Box>
    </Box>
  )
}
