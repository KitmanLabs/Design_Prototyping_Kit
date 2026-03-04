import React from 'react'
import PropTypes from 'prop-types'
import { useNavigate } from 'react-router-dom'
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  Divider,
  List,
  ListItem,
  ListItemText,
  useMediaQuery
} from '@mui/material'
import { CloseOutlined } from '@mui/icons-material'
import { useTheme } from '@mui/material/styles'
import { Button } from '../../components'
import '../../styles/design-tokens.css'

// Sample notification data
const sampleNotifications = [
  {
    id: 1,
    title: 'Form submission received',
    description: 'Marcus Johnson submitted Daily Wellness Check',
    timestamp: 'Sep 27, 2025 · 2:45 PM'
  },
  {
    id: 2,
    title: 'Medical assessment due',
    description: 'Pre-Season Medical Screening deadline approaching for 5 athletes',
    timestamp: 'Sep 26, 2025 · 10:30 AM'
  },
  {
    id: 3,
    title: 'Form updated',
    description: 'Training Load Monitoring form was modified by Performance team',
    timestamp: 'Sep 25, 2025 · 4:15 PM'
  },
  {
    id: 4,
    title: 'New form assigned',
    description: 'Concussion Protocol assigned to 12 athletes',
    timestamp: 'Sep 24, 2025 · 9:00 AM'
  },
  {
    id: 5,
    title: 'Compliance deadline',
    description: 'End of Season Survey submissions due in 3 days',
    timestamp: 'Sep 23, 2025 · 11:20 AM'
  }
]

function NotificationDrawer({ open, onClose, notifications = sampleNotifications }) {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const navigate = useNavigate()

  const handleClose = () => {
    onClose && onClose()
  }

  const handleViewAll = () => {
    handleClose()
    navigate('/notifications')
  }

  return (
    <Drawer
      anchor={isMobile ? 'bottom' : 'right'}
      open={open}
      onClose={handleClose}
      ModalProps={{ keepMounted: true }}
      PaperProps={{
        sx: {
          width: isMobile ? '100vw' : 400,
          maxWidth: '100vw',
          height: isMobile ? '90vh' : '100vh',
          boxShadow: theme.shadows[16],
          display: 'flex'
        }
      }}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', width: '100%' }}>
        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 3, py: 1.5 }}>
          <Typography 
            variant="h6" 
            sx={{ 
              fontWeight: 600, 
              fontFamily: 'var(--font-family-primary)', 
              fontSize: 'var(--font-size-lg)', 
              color: 'var(--color-text-primary)' 
            }}
          >
            Notifications
          </Typography>
          <IconButton onClick={handleClose} size="small" aria-label="Close">
            <CloseOutlined />
          </IconButton>
        </Box>
        <Divider />

        {/* Body */}
        <Box sx={{ flex: 1, overflowY: 'auto' }}>
          <List sx={{ py: 0 }}>
            {notifications.map((notification, index) => (
              <React.Fragment key={notification.id}>
                <ListItem
                  sx={{
                    px: 3,
                    py: 2,
                    cursor: 'pointer',
                    '&:hover': {
                      backgroundColor: 'var(--color-background-secondary)'
                    }
                  }}
                >
                  <ListItemText
                    primary={
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: 600,
                          color: 'var(--color-text-primary)',
                          fontFamily: 'var(--font-family-primary)',
                          fontSize: 'var(--font-size-sm)',
                          mb: 0.5
                        }}
                      >
                        {notification.title}
                      </Typography>
                    }
                    secondary={
                      <Box>
                        <Typography
                          variant="body2"
                          sx={{
                            color: 'var(--color-text-secondary)',
                            fontFamily: 'var(--font-family-primary)',
                            fontSize: 'var(--font-size-sm)',
                            mb: 0.5,
                            lineHeight: 1.4
                          }}
                        >
                          {notification.description}
                        </Typography>
                        <Typography
                          variant="caption"
                          sx={{
                            color: 'var(--color-text-muted)',
                            fontFamily: 'var(--font-family-primary)',
                            fontSize: 'var(--font-size-xs)'
                          }}
                        >
                          {notification.timestamp}
                        </Typography>
                      </Box>
                    }
                  />
                </ListItem>
                {index < notifications.length - 1 && (
                  <Divider sx={{ borderColor: 'var(--color-border-secondary)' }} />
                )}
              </React.Fragment>
            ))}
          </List>
        </Box>

        {/* Footer */}
        <Divider />
        <Box sx={{ px: 3, py: 2, position: 'sticky', bottom: 0, bgcolor: 'var(--color-background-primary)' }}>
          <Button
            variant="secondary"
            size="medium"
            onClick={handleViewAll}
            style={{ 
              width: '100%',
              fontFamily: 'var(--font-family-primary)',
              fontSize: 'var(--font-size-sm)'
            }}
          >
            View all notifications
          </Button>
        </Box>
      </Box>
    </Drawer>
  )
}

NotificationDrawer.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  notifications: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    timestamp: PropTypes.string.isRequired
  }))
}

export default NotificationDrawer
