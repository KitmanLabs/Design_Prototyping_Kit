import React, { useState, useEffect } from 'react'
import {
  Box,
  Typography,
  IconButton,
  Drawer,
  Dialog,
  TextField,
  Tooltip,
  Chip,
  Divider,
} from '@mui/material'
import {
  CloseOutlined as CloseIcon,
  EditOutlined as EditIcon,
  MailOutlined as MailIcon,
  SmsOutlined as SmsIcon,
  NotificationsOutlined as AppIcon,
  PeopleAltOutlined as PeopleIcon,
  ScheduleOutlined as ScheduleIcon,
  RepeatOutlined as RepeatIcon,
  CheckCircleOutlined as CheckCircleIcon,
} from '@mui/icons-material'

const DRAWER_WIDTH = 480

const CHANNEL_META = {
  inapp: { label: 'Broadcast Channel', icon: <AppIcon sx={{ fontSize: 15 }} /> },
  email: { label: 'Email',             icon: <MailIcon sx={{ fontSize: 15 }} /> },
  sms:   { label: 'SMS',               icon: <SmsIcon sx={{ fontSize: 15 }} /> },
}

function formatDateTime(iso) {
  if (!iso) return ''
  return new Date(iso).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })
}

function ChannelPill({ ch, selected }) {
  const meta = CHANNEL_META[ch]
  if (!meta) return null
  return (
    <Box sx={{
      display: 'inline-flex', alignItems: 'center', gap: 0.5,
      px: 1.5, py: 0.75, borderRadius: 5,
      bgcolor: selected ? 'var(--color-primary)' : 'var(--color-secondary)',
      userSelect: 'none',
    }}>
      <Box sx={{ color: selected ? 'white' : 'text.secondary' }}>{meta.icon}</Box>
      <Typography variant="body2" fontWeight={selected ? 600 : 400} color={selected ? 'white' : 'text.secondary'}>
        {meta.label}
      </Typography>
    </Box>
  )
}

export default function BroadcastDetailDrawer({ open, mode, broadcast, onClose, onSave, onSwitchToEdit }) {
  // mode: 'view' | 'edit'
  // For recurring broadcasts in edit mode, broadcast carries `editScope: 'one' | 'all'`
  const [subject,  setSubject]  = useState('')
  const [body,     setBody]     = useState('')
  const [channels, setChannels] = useState([])
  const [channelName,    setChannelName]    = useState('')
  const [scheduledFor,   setScheduledFor]   = useState('')
  const [recurringPattern, setRecurringPattern] = useState('')

  useEffect(() => {
    if (broadcast) {
      setSubject(broadcast.subject || '')
      setBody(broadcast.body || '')
      setChannels(broadcast.channels || [])
      setChannelName(broadcast.channelName || '')
      setScheduledFor(broadcast.scheduledFor || broadcast.sentAt || '')
      setRecurringPattern(broadcast.recurringPattern || '')
    }
  }, [broadcast])

  if (!broadcast) return null

  const isView = mode === 'view'
  const isEdit = mode === 'edit'
  const isRecurring = broadcast.scheduleType === 'recurring'
  const isImmediate = broadcast.scheduleType === 'immediate'

  const toggleChannel = (ch) => {
    if (isView) return
    setChannels(prev => prev.includes(ch) ? prev.filter(c => c !== ch) : [...prev, ch])
  }

  const handleSave = () => {
    onSave && onSave({
      ...broadcast,
      subject, body, channels,
      scheduledFor,
      recurringPattern,
    })
  }

  const handleDiscard = () => onClose()

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      sx={{ '& .MuiDrawer-paper': { width: DRAWER_WIDTH, boxShadow: '-4px 0 24px rgba(0,0,0,0.1)' } }}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>

        {/* Header */}
        <Box sx={{ px: 2.5, py: 1.75, borderBottom: '1px solid var(--color-border-primary)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flex: 1, minWidth: 0 }}>
            <Box sx={{ minWidth: 0, flex: 1 }}>
              <Typography variant="subtitle1" fontWeight={700} sx={{ lineHeight: 1.2 }} noWrap>
                Broadcast message
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mt: 0.25 }}>
                {isView ? (
                  <Chip
                    size="small"
                    icon={<CheckCircleIcon sx={{ fontSize: 14 }} />}
                    label="Sent"
                    sx={{
                      height: 20, fontSize: 11, fontWeight: 600,
                      bgcolor: 'rgba(46,125,50,0.12)', color: '#1e6e3d',
                      '& .MuiChip-icon': { color: '#1e6e3d' },
                    }}
                  />
                ) : (
                  <Chip
                    size="small"
                    icon={<EditIcon sx={{ fontSize: 14 }} />}
                    label="Edit mode"
                    sx={{
                      height: 20, fontSize: 11, fontWeight: 600,
                      bgcolor: 'rgba(59,73,96,0.12)', color: 'var(--color-primary)',
                      '& .MuiChip-icon': { color: 'var(--color-primary)' },
                    }}
                  />
                )}
                {isRecurring && isEdit && broadcast.editScope && (
                  <Typography variant="caption" color="text.secondary">
                    {broadcast.editScope === 'one' ? 'This occurrence only' : 'All occurrences'}
                  </Typography>
                )}
              </Box>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            {isView && (
              <Tooltip title="This message has already been sent and cannot be edited">
                <Box component="span">
                  <Box
                    component="button"
                    disabled
                    onClick={onSwitchToEdit}
                    sx={{
                      display: 'inline-flex', alignItems: 'center', gap: 0.5,
                      bgcolor: 'grey.200', color: 'text.disabled',
                      border: 'none', borderRadius: 1, px: 1.5, py: 0.625,
                      fontWeight: 600, fontSize: 13, fontFamily: 'inherit',
                      cursor: 'not-allowed',
                    }}
                  >
                    <EditIcon sx={{ fontSize: 16 }} />
                    Edit
                  </Box>
                </Box>
              </Tooltip>
            )}
            <IconButton size="small" onClick={onClose}><CloseIcon /></IconButton>
          </Box>
        </Box>

        {/* Body */}
        <Box sx={{ flex: 1, overflow: 'auto' }}>

          {/* Recipients summary */}
          <Box sx={{ px: 2.5, py: 2, borderBottom: '1px solid var(--color-border-primary)' }}>
            <Typography variant="caption" fontWeight={700} color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: 0.5, display: 'block', mb: 1 }}>
              Recipients
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <PeopleIcon sx={{ fontSize: 18, color: 'var(--color-primary)' }} />
              <Typography variant="body2" fontWeight={500}>{broadcast.recipientLabel}</Typography>
            </Box>
            {(broadcast.recipientNames || []).length > 0 && (
              <Typography variant="caption" color="text.disabled" sx={{ display: 'block', mt: 0.75 }}>
                {broadcast.recipientNames.slice(0, 8).join(', ')}
                {broadcast.recipientNames.length > 8 && `, +${broadcast.recipientNames.length - 8} more`}
              </Typography>
            )}
          </Box>

          {/* Schedule */}
          <Box sx={{ px: 2.5, py: 2, borderBottom: '1px solid var(--color-border-primary)' }}>
            <Typography variant="caption" fontWeight={700} color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: 0.5, display: 'block', mb: 1 }}>
              Schedule
            </Typography>
            {isImmediate ? (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <ScheduleIcon sx={{ fontSize: 18, color: 'text.disabled' }} />
                <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>Sent immediately</Typography>
              </Box>
            ) : isRecurring ? (
              <>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.75 }}>
                  <RepeatIcon sx={{ fontSize: 18, color: 'var(--color-primary)' }} />
                  <Typography variant="body2" fontWeight={500}>{recurringPattern || broadcast.recurringPattern}</Typography>
                </Box>
                <Typography variant="caption" color="text.secondary">
                  Next occurrence: {formatDateTime(broadcast.scheduledFor)}
                </Typography>
              </>
            ) : (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <ScheduleIcon sx={{ fontSize: 18, color: 'var(--color-primary)' }} />
                <Typography variant="body2" fontWeight={500}>{formatDateTime(scheduledFor)}</Typography>
              </Box>
            )}
            {isEdit && !isImmediate && (
              <TextField
                variant="filled" size="small" fullWidth type="datetime-local"
                label={isRecurring ? 'Next occurrence' : 'Scheduled date & time'}
                value={scheduledFor ? new Date(scheduledFor).toISOString().slice(0, 16) : ''}
                onChange={(e) => setScheduledFor(e.target.value ? new Date(e.target.value).toISOString() : '')}
                InputLabelProps={{ shrink: true }}
                sx={{ mt: 1.5 }}
              />
            )}
            {isEdit && isRecurring && (
              <TextField
                variant="filled" size="small" fullWidth label="Recurrence"
                value={recurringPattern}
                onChange={(e) => setRecurringPattern(e.target.value)}
                sx={{ mt: 1 }}
              />
            )}
          </Box>

          {/* Channels */}
          <Box sx={{ px: 2.5, py: 2, borderBottom: '1px solid var(--color-border-primary)' }}>
            <Typography variant="caption" fontWeight={700} color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: 0.5, display: 'block', mb: 1.25 }}>
              Channels
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', opacity: isView ? 0.9 : 1, pointerEvents: isView ? 'none' : 'auto' }}>
              {['inapp', 'email', 'sms'].map((ch) => (
                <Box key={ch} onClick={() => toggleChannel(ch)} sx={{ cursor: isView ? 'default' : 'pointer' }}>
                  <ChannelPill ch={ch} selected={channels.includes(ch)} />
                </Box>
              ))}
            </Box>
          </Box>

          {/* Message */}
          <Box sx={{ px: 2.5, py: 2 }}>
            <Typography variant="caption" fontWeight={700} color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: 0.5, display: 'block', mb: 1.25 }}>
              Message
            </Typography>
            {(channels.includes('email') || isView) && (
              <TextField
                variant="filled" size="small" fullWidth label="Subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                disabled={isView}
                sx={{ mb: 1.5 }}
              />
            )}
            <TextField
              variant="filled" size="small" fullWidth multiline rows={6}
              label="Message"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              disabled={isView}
            />
            {isView && (
              <Typography variant="caption" color="text.disabled" sx={{ display: 'block', mt: 1 }}>
                Sent by {broadcast.sentBy || '—'} · {formatDateTime(broadcast.sentAt)}
              </Typography>
            )}
          </Box>
        </Box>

        {/* Footer (edit mode only) */}
        {isEdit && (
          <Box sx={{ px: 2.5, py: 2, borderTop: '1px solid var(--color-border-primary)', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 1.5, flexShrink: 0 }}>
            <Box component="button" onClick={handleDiscard} sx={{ px: 2.5, py: 0.875, bgcolor: 'var(--color-secondary)', border: 'none', borderRadius: 1, cursor: 'pointer', fontWeight: 600, fontSize: 14, color: 'var(--color-primary)', fontFamily: 'inherit' }}>
              Discard changes
            </Box>
            <Box component="button" onClick={handleSave} sx={{ px: 2.5, py: 0.875, bgcolor: 'var(--color-primary)', color: 'white', border: 'none', borderRadius: 1, cursor: 'pointer', fontWeight: 700, fontSize: 14, fontFamily: 'inherit' }}>
              Save changes
            </Box>
          </Box>
        )}
      </Box>
    </Drawer>
  )
}

// ─── Recurring edit scope modal ────────────────────────────────────────────
export function RecurringEditScopeDialog({ open, onChoose, onClose }) {
  return (
    <Dialog open={open} onClose={onClose} PaperProps={{ sx: { width: 380, borderRadius: 2 } }}>
      <Box sx={{ px: 3, pt: 3, pb: 1 }}>
        <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 1 }}>Edit recurring broadcast</Typography>
        <Typography variant="body2" color="text.secondary">
          Edit this occurrence only, or all future occurrences?
        </Typography>
      </Box>
      <Divider sx={{ mt: 1 }} />
      <Box
        component="button"
        onClick={() => onChoose('one')}
        sx={{
          width: '100%', textAlign: 'left', bgcolor: 'transparent',
          border: 'none', cursor: 'pointer', px: 3, py: 1.75,
          fontFamily: 'inherit', borderBottom: '1px solid var(--color-border-primary)',
          '&:hover': { bgcolor: 'rgba(59,73,96,0.04)' },
        }}
      >
        <Typography variant="body2" fontWeight={600}>This occurrence</Typography>
        <Typography variant="caption" color="text.secondary">Only this single send. The recurring series continues unchanged.</Typography>
      </Box>
      <Box
        component="button"
        onClick={() => onChoose('all')}
        sx={{
          width: '100%', textAlign: 'left', bgcolor: 'transparent',
          border: 'none', cursor: 'pointer', px: 3, py: 1.75,
          fontFamily: 'inherit',
          '&:hover': { bgcolor: 'rgba(59,73,96,0.04)' },
        }}
      >
        <Typography variant="body2" fontWeight={600}>All occurrences</Typography>
        <Typography variant="caption" color="text.secondary">Apply changes to every future occurrence of this series.</Typography>
      </Box>
      <Box sx={{ px: 3, py: 1.5, display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid var(--color-border-primary)' }}>
        <Box component="button" onClick={onClose} sx={{ bgcolor: 'transparent', border: 'none', color: 'text.secondary', fontWeight: 600, fontSize: 13, cursor: 'pointer', fontFamily: 'inherit', px: 1.5, py: 0.5 }}>
          Cancel
        </Box>
      </Box>
    </Dialog>
  )
}
