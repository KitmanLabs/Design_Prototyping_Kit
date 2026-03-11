import React, { useState, useMemo } from 'react'
import {
  Box,
  Typography,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  TextField,
  Avatar,
  Menu,
  MenuItem,
  Divider,
  Drawer,
  Modal,
  Switch,
  FormControlLabel,
  Collapse,
  Checkbox,
  InputAdornment,
  CircularProgress,
  Button,
  Chip,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material'
import {
  EditOutlined as EditIcon,
  CreateOutlined as ComposeIcon,
  Add as AddIcon,
  AttachFile as AttachFileIcon,
  SendOutlined as SendIcon,
  MoreVert as MoreVertIcon,
  Close as CloseIcon,
  Search as SearchIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  ChatBubbleOutline as ChatBubbleIcon,
  ArrowBack as ArrowBackIcon,
  Person as PersonIcon,
  DeleteOutlined as DeleteIcon,
  Archive as ArchiveIcon,
  Unarchive as UnarchiveIcon,
  PersonRemove as PersonRemoveIcon,
  Block as BlockIcon,
  Schedule as ScheduleIcon,
  AccessTime as AccessTimeIcon,
  KeyboardArrowDown as KeyboardArrowDownIcon
} from '@mui/icons-material'
import {
  currentUserId,
  mockUsers,
  mockSquads,
  mockPositions,
  getAllConversations,
  getMessagesForConversation,
  getUserById
} from '../../data/messaging'
import '../../styles/design-tokens.css'

const SIDEBAR_WIDTH = 280
const RIGHT_PANEL_WIDTH = 360

// Empty state illustration (CSS-based speech bubbles)
function EmptyStateIllustration() {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, py: 6 }}>
      <Box sx={{ position: 'relative', width: 80, height: 60 }}>
        <Box sx={{ position: 'absolute', top: 0, left: 8, width: 24, height: 20, borderRadius: '12px 12px 12px 4px', bgcolor: 'grey.200' }} />
        <Box sx={{ position: 'absolute', top: 12, left: 24, width: 28, height: 24, borderRadius: '14px 14px 14px 4px', border: '2px solid', borderColor: 'var(--color-primary)' }} />
        <Box sx={{ position: 'absolute', top: 28, left: 16, width: 32, height: 22, borderRadius: '11px 11px 4px 11px', bgcolor: 'grey.300', '&::after': { content: '"..."', fontSize: 10, position: 'absolute', left: 8, top: 6 } }} />
      </Box>
      <Typography variant="body2" color="text.secondary">No messages yet</Typography>
    </Box>
  )
}

export default function Messaging() {
  const [selectedId, setSelectedId] = useState('dm1')
  const [messages, setMessages] = useState(() => getMessagesForConversation('dm1'))
  const [inputValue, setInputValue] = useState('')
  const [loading, setLoading] = useState(false)
  const [anchorMenu, setAnchorMenu] = useState(null)
  const [messageMenuAnchor, setMessageMenuAnchor] = useState(null)
  const [messageMenuTarget, setMessageMenuTarget] = useState(null)
  const [editingMessageId, setEditingMessageId] = useState(null)
  const [editText, setEditText] = useState('')
  const [rightPanel, setRightPanel] = useState(null) // 'newDM' | 'newChannel' | 'channelSettings' | null
  const [channelMembersOpen, setChannelMembersOpen] = useState(false)
  const [newChannelStep, setNewChannelStep] = useState(1) // 1 = members, 2 = details
  const [newChannelMembers, setNewChannelMembers] = useState([])
  const [newChannelName, setNewChannelName] = useState('')
  const [newChannelDescription, setNewChannelDescription] = useState('')
  const [athletesCanSend, setAthletesCanSend] = useState(false)
  const [staffCanSend, setStaffCanSend] = useState(true)
  const [channelSettingsMuted, setChannelSettingsMuted] = useState(true)
  const [attachments, setAttachments] = useState([])
  const [conversations, setConversations] = useState(getAllConversations)
  const [showArchivedChannels, setShowArchivedChannels] = useState(false)
  const [showArchivedDMs, setShowArchivedDMs] = useState(false)
  const [managingMemberId, setManagingMemberId] = useState(null)
  const [memberMenuAnchor, setMemberMenuAnchor] = useState(null)
  const [showInactiveMembers, setShowInactiveMembers] = useState(true)
  const [scheduledMessages, setScheduledMessages] = useState([])
  const [scheduleDialogOpen, setScheduleDialogOpen] = useState(false)
  const [scheduleSendAnchor, setScheduleSendAnchor] = useState(null)
  const [scheduleDate, setScheduleDate] = useState('')
  const [scheduleTime, setScheduleTime] = useState('')
  const [viewScheduledOpen, setViewScheduledOpen] = useState(false)

  const selected = useMemo(() => conversations.find(c => c.id === selectedId), [conversations, selectedId])
  const isChannel = selected?.type === 'channel'

  const handleSelectConversation = (id) => {
    setSelectedId(id)
    setConversations(prev => prev.map(c => c.id === id ? { ...c, unreadCount: 0 } : c))
    setLoading(true)
    setMessages([])
    setTimeout(() => {
      setMessages(getMessagesForConversation(id))
      setLoading(false)
    }, 600)
    setRightPanel(null)
  }

  const handleSend = (scheduledTime = null) => {
    const text = (editingMessageId ? editText : inputValue).trim()
    if (!text && attachments.length === 0) return
    if (editingMessageId) {
      setMessages(prev => prev.map(m => m.id === editingMessageId ? { ...m, text } : m))
      setEditingMessageId(null)
      setEditText('')
    } else if (scheduledTime) {
      // Add to scheduled messages instead of sending immediately
      const newScheduled = {
        id: `sched-${Date.now()}`,
        conversationId: selectedId,
        conversationName: selected?.name || '',
        senderId: currentUserId,
        text,
        scheduledFor: scheduledTime,
        attachments: [...attachments],
        createdAt: new Date().toISOString()
      }
      setScheduledMessages(prev => [...prev, newScheduled])
      setInputValue('')
      setAttachments([])
    } else {
      setMessages(prev => [...prev, { id: `m-${Date.now()}`, senderId: currentUserId, text, timestamp: new Date().toISOString(), attachments: [...attachments] }])
      setInputValue('')
      setAttachments([])
    }
  }

  const handleDeleteMessage = (messageId) => {
    setMessages(prev => prev.filter(m => m.id !== messageId))
    setMessageMenuAnchor(null)
    setMessageMenuTarget(null)
  }

  const handleStartEditMessage = (msg) => {
    setMessageMenuAnchor(null)
    setMessageMenuTarget(null)
    setEditingMessageId(msg.id)
    setEditText(msg.text)
  }

  const handleCancelEdit = () => {
    setEditingMessageId(null)
    setEditText('')
  }

  const handleOpenMessageMenu = (e, msg) => {
    e.stopPropagation()
    setMessageMenuAnchor(e.currentTarget)
    setMessageMenuTarget(msg)
  }

  const handleAddChannel = () => setRightPanel('newChannel')
  const handleAddDM = () => setRightPanel('newDM')
  const handleOpenChannelSettings = () => { setRightPanel('channelSettings'); setAnchorMenu(null) }
  const handleViewMembers = () => { setChannelMembersOpen(true); setAnchorMenu(null) }
  const handleManageMembers = () => { setChannelMembersOpen(true); setAnchorMenu(null) }
  
  const handleArchiveChannel = () => {
    if (selected) {
      setConversations(prev => prev.map(c => c.id === selected.id ? { ...c, archived: true } : c))
      // Switch to first non-archived conversation
      const nextConversation = conversations.find(c => c.id !== selected.id && !c.archived)
      if (nextConversation) setSelectedId(nextConversation.id)
    }
    setAnchorMenu(null)
  }
  
  const handleUnarchiveChannel = () => {
    if (selected) {
      setConversations(prev => prev.map(c => c.id === selected.id ? { ...c, archived: false } : c))
    }
    setAnchorMenu(null)
  }
  
  const handleArchiveDM = () => {
    if (selected) {
      setConversations(prev => prev.map(c => c.id === selected.id ? { ...c, archived: true } : c))
      // Switch to first non-archived conversation
      const nextConversation = conversations.find(c => c.id !== selected.id && !c.archived)
      if (nextConversation) setSelectedId(nextConversation.id)
    }
    setAnchorMenu(null)
  }
  
  const handleUnarchiveDM = () => {
    if (selected) {
      setConversations(prev => prev.map(c => c.id === selected.id ? { ...c, archived: false } : c))
    }
    setAnchorMenu(null)
  }
  
  const handleOpenMemberMenu = (e, memberId) => {
    e.stopPropagation()
    setMemberMenuAnchor(e.currentTarget)
    setManagingMemberId(memberId)
  }
  
  const handleToggleMemberInactive = () => {
    if (selected && managingMemberId) {
      setConversations(prev => prev.map(c => {
        if (c.id === selected.id) {
          const inactiveMembers = c.inactiveMembers || []
          const isCurrentlyInactive = inactiveMembers.includes(managingMemberId)
          return {
            ...c,
            inactiveMembers: isCurrentlyInactive 
              ? inactiveMembers.filter(id => id !== managingMemberId)
              : [...inactiveMembers, managingMemberId]
          }
        }
        return c
      }))
    }
    setMemberMenuAnchor(null)
    setManagingMemberId(null)
  }
  
  const handleRemoveMember = () => {
    if (selected && managingMemberId) {
      setConversations(prev => prev.map(c => {
        if (c.id === selected.id) {
          return {
            ...c,
            memberIds: c.memberIds?.filter(id => id !== managingMemberId) || [],
            inactiveMembers: (c.inactiveMembers || []).filter(id => id !== managingMemberId)
          }
        }
        return c
      }))
    }
    setMemberMenuAnchor(null)
    setManagingMemberId(null)
  }

  const handleOpenScheduleSend = (e) => {
    setScheduleSendAnchor(e.currentTarget)
  }

  const handleScheduleSend = (option) => {
    setScheduleSendAnchor(null)
    const now = new Date()
    let scheduledTime

    switch (option) {
      case 'later-today':
        scheduledTime = new Date(now)
        scheduledTime.setHours(now.getHours() + 4)
        break
      case 'tomorrow-morning':
        scheduledTime = new Date(now)
        scheduledTime.setDate(now.getDate() + 1)
        scheduledTime.setHours(9, 0, 0, 0)
        break
      case 'tomorrow-afternoon':
        scheduledTime = new Date(now)
        scheduledTime.setDate(now.getDate() + 1)
        scheduledTime.setHours(13, 0, 0, 0)
        break
      case 'custom':
        setScheduleDialogOpen(true)
        return
      default:
        return
    }

    handleSend(scheduledTime.toISOString())
  }

  const handleCustomScheduleSend = () => {
    if (!scheduleDate || !scheduleTime) return
    const scheduledTime = new Date(`${scheduleDate}T${scheduleTime}`)
    handleSend(scheduledTime.toISOString())
    setScheduleDialogOpen(false)
    setScheduleDate('')
    setScheduleTime('')
  }

  const handleCancelScheduled = (id) => {
    setScheduledMessages(prev => prev.filter(m => m.id !== id))
  }

  const handleSendScheduledNow = (scheduled) => {
    setMessages(prev => [...prev, {
      id: `m-${Date.now()}`,
      senderId: scheduled.senderId,
      text: scheduled.text,
      timestamp: new Date().toISOString(),
      attachments: scheduled.attachments
    }])
    handleCancelScheduled(scheduled.id)
  }

  const formatScheduledTime = (isoString) => {
    const date = new Date(isoString)
    const now = new Date()
    const tomorrow = new Date(now)
    tomorrow.setDate(tomorrow.getDate() + 1)

    const timeStr = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

    if (date.toDateString() === now.toDateString()) {
      return `Today at ${timeStr}`
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return `Tomorrow at ${timeStr}`
    } else {
      return `${date.toLocaleDateString()} at ${timeStr}`
    }
  }

  const channelMembers = isChannel && selected ? selected.memberIds?.map(id => ({ ...getUserById(id), isAdmin: id === currentUserId })) : []

  const formatTime = (iso) => {
    const d = new Date(iso)
    const now = new Date()
    if (d.toDateString() === now.toDateString()) return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    const yesterday = new Date(now); yesterday.setDate(yesterday.getDate() - 1)
    if (d.toDateString() === yesterday.toDateString()) return 'Yesterday'
    return d.toLocaleDateString()
  }

  const toggleMember = (id) => {
    setNewChannelMembers(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])
  }

  const handleCreateChannelFromMembers = () => setNewChannelStep(2)
  const handleBackToMembers = () => setNewChannelStep(1)
  const handleCreateChannel = () => {
    const newCh = { id: `ch-${Date.now()}`, type: 'channel', name: newChannelName || 'New channel', description: newChannelDescription, memberIds: newChannelMembers, isPrivate: true, channelId: `CH${Math.random().toString(36).slice(2, 18)}`, muted: false, athletesCanSend, staffCanSend, lastActivity: new Date().toISOString() }
    setConversations(prev => [newCh, ...prev])
    setSelectedId(newCh.id)
    setMessages([])
    setRightPanel(null)
    setNewChannelStep(1)
    setNewChannelMembers([])
    setNewChannelName('')
    setNewChannelDescription('')
  }

  const handleStartDM = (userId) => {
    const existing = conversations.find(c => c.type === 'dm' && c.participantIds?.includes(userId))
    if (existing) { handleSelectConversation(existing.id); setRightPanel(null); return }
    const user = getUserById(userId)
    const newDm = { id: `dm-${Date.now()}`, type: 'dm', participantIds: [currentUserId, userId], name: user.name, lastActivity: new Date().toISOString() }
    setConversations(prev => [newDm, ...prev])
    setSelectedId(newDm.id)
    setMessages([])
    setRightPanel(null)
  }

  const handleAttachClick = () => {
    // Mock: add a placeholder attachment (no real file picker)
    setAttachments(prev => [...prev, { id: `att-${Date.now()}`, name: `file-${prev.length + 1}.pdf` }])
  }

  const removeAttachment = (id) => setAttachments(prev => prev.filter(a => a.id !== id))

  return (
    <Box sx={{ display: 'flex', height: '100%', overflow: 'hidden', bgcolor: 'var(--color-background-primary)' }}>
      {/* Left sidebar */}
      <Box sx={{ width: SIDEBAR_WIDTH, borderRight: '1px solid var(--color-border-primary)', display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
        <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--color-border-primary)' }}>
          <Typography variant="subtitle1" fontWeight={600}>All messages</Typography>
          <Box sx={{ display: 'flex', gap: 0.5 }}>
            {scheduledMessages.length > 0 && (
              <Tooltip title="View all scheduled messages">
                <IconButton size="small" onClick={() => setViewScheduledOpen(true)}>
                  <ScheduleIcon fontSize="small" />
                  {scheduledMessages.length > 0 && (
                    <Box component="span" sx={{ position: 'absolute', top: 4, right: 4, width: 8, height: 8, borderRadius: '50%', bgcolor: 'info.main' }} />
                  )}
                </IconButton>
              </Tooltip>
            )}
            <IconButton size="small" onClick={handleAddDM}><ComposeIcon /></IconButton>
          </Box>
        </Box>
        <Box sx={{ flex: 1, overflow: 'auto' }}>
          <Box sx={{ px: 2, py: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography variant="caption" color="text.secondary" fontWeight={600}>CHANNELS</Typography>
            <IconButton size="small" onClick={handleAddChannel}><AddIcon fontSize="small" /></IconButton>
          </Box>
          {conversations.filter(c => c.type === 'channel' && !c.archived).map((c) => (
            <ListItemButton key={c.id} selected={selectedId === c.id} onClick={() => handleSelectConversation(c.id)} sx={{ py: 1 }}>
              <ListItemIcon sx={{ minWidth: 36 }}><PersonIcon fontSize="small" /></ListItemIcon>
              <ListItemText primary={c.name} primaryTypographyProps={{ noWrap: true }} />
              {(c.unreadCount ?? 0) > 0 && (
                <Box component="span" sx={{ ml: 0.5, minWidth: 20, height: 20, borderRadius: '50%', bgcolor: 'var(--color-primary)', color: 'var(--color-white)', fontSize: 11, fontWeight: 600, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>{c.unreadCount > 99 ? '99+' : c.unreadCount}</Box>
              )}
            </ListItemButton>
          ))}
          
          {conversations.filter(c => c.type === 'channel' && c.archived).length > 0 && (
            <>
              <ListItemButton onClick={() => setShowArchivedChannels(!showArchivedChannels)} sx={{ px: 2, py: 1 }}>
                <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ flex: 1 }}>ARCHIVED CHANNELS</Typography>
                {showArchivedChannels ? <ExpandLessIcon fontSize="small" /> : <ExpandMoreIcon fontSize="small" />}
              </ListItemButton>
              <Collapse in={showArchivedChannels}>
                {conversations.filter(c => c.type === 'channel' && c.archived).map((c) => (
                  <ListItemButton key={c.id} selected={selectedId === c.id} onClick={() => handleSelectConversation(c.id)} sx={{ py: 1, pl: 3 }}>
                    <ListItemIcon sx={{ minWidth: 36 }}><ArchiveIcon fontSize="small" /></ListItemIcon>
                    <ListItemText primary={c.name} primaryTypographyProps={{ noWrap: true }} />
                    {(c.unreadCount ?? 0) > 0 && (
                      <Box component="span" sx={{ ml: 0.5, minWidth: 20, height: 20, borderRadius: '50%', bgcolor: 'var(--color-primary)', color: 'var(--color-white)', fontSize: 11, fontWeight: 600, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>{c.unreadCount > 99 ? '99+' : c.unreadCount}</Box>
                    )}
                  </ListItemButton>
                ))}
              </Collapse>
            </>
          )}
          <Box sx={{ px: 2, py: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography variant="caption" color="text.secondary" fontWeight={600}>DIRECT MESSAGES</Typography>
            <IconButton size="small" onClick={handleAddDM}><AddIcon fontSize="small" /></IconButton>
          </Box>
          {conversations.filter(c => c.type === 'dm' && !c.archived).map((c) => {
            const otherId = c.participantIds?.find(pid => pid !== currentUserId)
            const otherUser = otherId ? getUserById(otherId) : null
            return (
              <ListItemButton key={c.id} selected={selectedId === c.id} onClick={() => handleSelectConversation(c.id)} sx={{ py: 1 }}>
                <ListItemIcon sx={{ minWidth: 36 }}>
                  <Avatar src={otherUser?.avatarUrl} sx={{ width: 28, height: 28, bgcolor: 'grey.400', fontSize: 12 }}>{c.name.slice(0, 1)}</Avatar>
                </ListItemIcon>
                <ListItemText primary={c.name} primaryTypographyProps={{ noWrap: true }} />
                {(c.unreadCount ?? 0) > 0 && (
                  <Box component="span" sx={{ ml: 0.5, minWidth: 20, height: 20, borderRadius: '50%', bgcolor: 'var(--color-primary)', color: 'var(--color-white)', fontSize: 11, fontWeight: 600, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>{c.unreadCount > 99 ? '99+' : c.unreadCount}</Box>
                )}
              </ListItemButton>
            )
          })}
          
          {conversations.filter(c => c.type === 'dm' && c.archived).length > 0 && (
            <>
              <ListItemButton onClick={() => setShowArchivedDMs(!showArchivedDMs)} sx={{ px: 2, py: 1 }}>
                <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ flex: 1 }}>ARCHIVED CONVERSATIONS</Typography>
                {showArchivedDMs ? <ExpandLessIcon fontSize="small" /> : <ExpandMoreIcon fontSize="small" />}
              </ListItemButton>
              <Collapse in={showArchivedDMs}>
                {conversations.filter(c => c.type === 'dm' && c.archived).map((c) => {
                  const otherId = c.participantIds?.find(pid => pid !== currentUserId)
                  const otherUser = otherId ? getUserById(otherId) : null
                  return (
                    <ListItemButton key={c.id} selected={selectedId === c.id} onClick={() => handleSelectConversation(c.id)} sx={{ py: 1, pl: 3 }}>
                      <ListItemIcon sx={{ minWidth: 36 }}>
                        <Avatar src={otherUser?.avatarUrl} sx={{ width: 28, height: 28, bgcolor: 'grey.400', fontSize: 12 }}>{c.name.slice(0, 1)}</Avatar>
                      </ListItemIcon>
                      <ListItemText primary={c.name} primaryTypographyProps={{ noWrap: true }} />
                      {(c.unreadCount ?? 0) > 0 && (
                        <Box component="span" sx={{ ml: 0.5, minWidth: 20, height: 20, borderRadius: '50%', bgcolor: 'var(--color-primary)', color: 'var(--color-white)', fontSize: 11, fontWeight: 600, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>{c.unreadCount > 99 ? '99+' : c.unreadCount}</Box>
                      )}
                    </ListItemButton>
                  )
                })}
              </Collapse>
            </>
          )}
        </Box>
      </Box>

      {/* Center: chat */}
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {selected ? (
          <>
            <Box sx={{ p: 1.5, borderBottom: '1px solid var(--color-border-primary)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                {isChannel ? (
                  <Avatar sx={{ width: 32, height: 32, bgcolor: 'grey.400', fontSize: 14 }}>{selected.name.slice(0, 1)}</Avatar>
                ) : (() => {
                  const otherId = selected.participantIds?.find(pid => pid !== currentUserId)
                  const otherUser = otherId ? getUserById(otherId) : null
                  return <Avatar src={otherUser?.avatarUrl} sx={{ width: 32, height: 32, bgcolor: 'grey.400', fontSize: 14 }}>{selected.name.slice(0, 1)}</Avatar>
                })()}
                <Typography variant="subtitle2" fontWeight={600}>{selected.name}</Typography>
                <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>{formatTime(selected.lastActivity)}</Typography>
              </Box>
              <IconButton size="small" onClick={(e) => setAnchorMenu(e.currentTarget)}><MoreVertIcon /></IconButton>
            </Box>
            <Menu anchorEl={anchorMenu} open={Boolean(anchorMenu)} onClose={() => setAnchorMenu(null)}>
              {isChannel && <MenuItem onClick={handleOpenChannelSettings}>Channel Settings</MenuItem>}
              {isChannel && <MenuItem onClick={handleViewMembers}>View Members</MenuItem>}
              {isChannel && <MenuItem onClick={handleManageMembers}>Manage Members</MenuItem>}
              {isChannel && !selected?.archived && (
                <MenuItem onClick={handleArchiveChannel}>
                  Archive Channel
                </MenuItem>
              )}
              {isChannel && selected?.archived && (
                <MenuItem onClick={handleUnarchiveChannel}>
                  Unarchive Channel
                </MenuItem>
              )}
              {isChannel && <MenuItem>Leave Channel</MenuItem>}
              {!isChannel && !selected?.archived && (
                <MenuItem onClick={handleArchiveDM}>
                  Archive Conversation
                </MenuItem>
              )}
              {!isChannel && selected?.archived && (
                <MenuItem onClick={handleUnarchiveDM}>
                  Unarchive Conversation
                </MenuItem>
              )}
              {!isChannel && <MenuItem>View profile</MenuItem>}
            </Menu>

            <Box sx={{ flex: 1, overflow: 'auto', display: 'flex', flexDirection: 'column', p: 2 }}>
              {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flex: 1 }}><CircularProgress size={32} /></Box>
              ) : messages.length === 0 ? (
                <EmptyStateIllustration />
              ) : (
                <>
                  <Typography variant="caption" color="text.secondary" sx={{ alignSelf: 'flex-end', mb: 1 }}>Yesterday</Typography>
                  {messages.map((msg) => {
                    const sender = getUserById(msg.senderId)
                    const isOwn = msg.senderId === currentUserId
                    if (isChannel) {
                      return (
                        <Box key={msg.id} sx={{ display: 'flex', flexDirection: 'column', alignItems: isOwn ? 'flex-end' : 'flex-start', mb: 2 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                            <Avatar src={sender?.avatarUrl} sx={{ width: 24, height: 24, bgcolor: 'grey.400', fontSize: 11 }}>{sender?.name?.split(' ').map(n => n[0]).join('').slice(0, 2) || '?'}</Avatar>
                            <Typography variant="caption" fontWeight={600} color="text.primary">{sender?.name ?? 'Unknown'}</Typography>
                            <Typography variant="caption" color="text.secondary">{formatTime(msg.timestamp)}</Typography>
                          </Box>
                          {editingMessageId === msg.id ? (
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, width: '100%', maxWidth: '75%' }}>
                              <TextField size="small" fullWidth value={editText} onChange={(e) => setEditText(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()} />
                              <Box sx={{ display: 'flex', gap: 1 }}><IconButton size="small" onClick={handleSend}>Save</IconButton><IconButton size="small" onClick={handleCancelEdit}>Cancel</IconButton></Box>
                            </Box>
                          ) : (
                            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 0.5 }}>
                              <Box sx={{ bgcolor: isOwn ? 'var(--color-primary)' : 'grey.200', color: isOwn ? 'var(--color-white)' : 'text.primary', borderRadius: 2, px: 2, py: 1 }}>
                                <Typography variant="body2">{msg.text}</Typography>
                                {msg.attachments?.length > 0 && <Typography variant="caption" display="block" sx={{ mt: 0.5 }}>📎 {msg.attachments.length} file(s)</Typography>}
                              </Box>
                              {isOwn && (
                                <IconButton size="small" onClick={(e) => handleOpenMessageMenu(e, msg)}><MoreVertIcon fontSize="small" /></IconButton>
                              )}
                            </Box>
                          )}
                        </Box>
                      )
                    }
                    return (
                      <Box key={msg.id} sx={{ display: 'flex', justifyContent: isOwn ? 'flex-end' : 'flex-start', mb: 1.5 }}>
                        <Box sx={{ maxWidth: '75%', display: 'flex', alignItems: 'flex-start', gap: 0.5 }}>
                          {editingMessageId === msg.id ? (
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, width: '100%' }}>
                              <TextField size="small" fullWidth value={editText} onChange={(e) => setEditText(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()} />
                              <Box sx={{ display: 'flex', gap: 1 }}><IconButton size="small" onClick={handleSend}>Save</IconButton><IconButton size="small" onClick={handleCancelEdit}>Cancel</IconButton></Box>
                            </Box>
                          ) : (
                            <>
                              <Box sx={{ bgcolor: isOwn ? 'var(--color-primary)' : 'grey.200', color: isOwn ? 'var(--color-white)' : 'text.primary', borderRadius: 2, px: 2, py: 1, borderBottomRightRadius: isOwn ? 2 : 2, borderBottomLeftRadius: isOwn ? 2 : 4 }}>
                                <Typography variant="body2">{msg.text}</Typography>
                                {msg.attachments?.length > 0 && <Typography variant="caption" display="block" sx={{ mt: 0.5 }}>📎 {msg.attachments.length} file(s)</Typography>}
                                <Typography variant="caption" sx={{ opacity: 0.8 }}>{formatTime(msg.timestamp)}</Typography>
                              </Box>
                              {isOwn && (
                                <IconButton size="small" onClick={(e) => handleOpenMessageMenu(e, msg)}><MoreVertIcon fontSize="small" /></IconButton>
                              )}
                            </>
                          )}
                        </Box>
                      </Box>
                    )
                  })}
                </>
              )}
            </Box>

            <Menu anchorEl={messageMenuAnchor} open={Boolean(messageMenuAnchor)} onClose={() => { setMessageMenuAnchor(null); setMessageMenuTarget(null) }}>
              <MenuItem onClick={() => messageMenuTarget && handleStartEditMessage(messageMenuTarget)}><EditIcon fontSize="small" sx={{ mr: 1 }} /> Edit</MenuItem>
              <MenuItem onClick={() => messageMenuTarget && handleDeleteMessage(messageMenuTarget.id)}><DeleteIcon fontSize="small" sx={{ mr: 1 }} /> Delete</MenuItem>
            </Menu>

            <Box sx={{ p: 1.5, borderTop: '1px solid var(--color-border-primary)' }}>
              {attachments.length > 0 && (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 1 }}>
                  {attachments.map(a => (
                    <Box key={a.id} sx={{ display: 'flex', alignItems: 'center', gap: 0.5, bgcolor: 'grey.100', borderRadius: 1, px: 1, py: 0.5 }}>
                      <Typography variant="caption">{a.name}</Typography>
                      <IconButton size="small" onClick={() => removeAttachment(a.id)}><CloseIcon sx={{ fontSize: 14 }} /></IconButton>
                    </Box>
                  ))}
                </Box>
              )}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <IconButton size="small" onClick={handleAttachClick} title="Attach file"><AttachFileIcon /></IconButton>
                <TextField
                  fullWidth
                  size="small"
                  placeholder="Message channel"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSend())}
                  InputProps={{ sx: { borderRadius: 2, bgcolor: 'grey.50' } }}
                />
                <Tooltip title="Schedule send">
                  <IconButton 
                    size="small" 
                    onClick={handleOpenScheduleSend} 
                    disabled={!inputValue.trim() && attachments.length === 0}
                    sx={{ color: 'action.active' }}
                  >
                    <ScheduleIcon />
                  </IconButton>
                </Tooltip>
                <IconButton sx={{ color: 'var(--color-primary)' }} onClick={() => handleSend()} disabled={!inputValue.trim() && attachments.length === 0}><SendIcon /></IconButton>
              </Box>
              
              {scheduledMessages.filter(m => m.conversationId === selectedId).length > 0 && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1, pt: 1, borderTop: '1px solid var(--color-border-primary)' }}>
                  <AccessTimeIcon fontSize="small" sx={{ color: 'info.main' }} />
                  <Typography variant="caption" color="text.secondary">
                    {scheduledMessages.filter(m => m.conversationId === selectedId).length} scheduled message(s)
                  </Typography>
                  <Button size="small" onClick={() => setViewScheduledOpen(true)}>View</Button>
                </Box>
              )}
            </Box>
          </>
        ) : (
          <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'text.secondary' }}>
            <Typography variant="body2">Select a conversation</Typography>
          </Box>
        )}
      </Box>

      {/* Right panel: New DM / New channel / Channel settings */}
      <Drawer
        anchor="right"
        open={Boolean(rightPanel)}
        onClose={() => setRightPanel(null)}
        sx={{ '& .MuiDrawer-paper': { width: RIGHT_PANEL_WIDTH } }}
      >
        <Box sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
          {rightPanel === 'newDM' && (
            <>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h6">New direct message</Typography>
                <IconButton size="small" onClick={() => setRightPanel(null)}><CloseIcon /></IconButton>
              </Box>
              <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>CHANNEL MEMBERS</Typography>
              <TextField size="small" placeholder="Search" fullWidth InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon /></InputAdornment> }} sx={{ mb: 2 }} />
              <Box sx={{ flex: 1, overflow: 'auto' }}>
                {mockSquads.map((squad) => (
                  <Box key={squad.id} sx={{ mb: 1 }}>
                    <ListItemButton onClick={() => {}} sx={{ py: 0.5 }}>{squad.name}</ListItemButton>
                  </Box>
                ))}
                <Divider sx={{ my: 1 }} />
                {mockUsers.filter(u => u.id !== currentUserId).map((user) => (
                  <ListItemButton key={user.id} onClick={() => handleStartDM(user.id)} sx={{ py: 1 }}>
                    <ListItemIcon sx={{ minWidth: 36 }}><Avatar src={user.avatarUrl} sx={{ width: 28, height: 28, bgcolor: 'grey.400', fontSize: 12 }}>{user.name.slice(0, 1)}</Avatar></ListItemIcon>
                    <ListItemText primary={user.name} />
                  </ListItemButton>
                ))}
              </Box>
              <Box sx={{ mt: 2 }}><Typography variant="caption" color="text.secondary">Select a user to start a direct message.</Typography></Box>
            </>
          )}

          {rightPanel === 'newChannel' && (
            <>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h6">New private channel</Typography>
                <IconButton size="small" onClick={() => { setRightPanel(null); setNewChannelStep(1) }}><CloseIcon /></IconButton>
              </Box>
              {newChannelStep === 1 ? (
                <>
                  <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>CHANNEL MEMBERS</Typography>
                  <TextField size="small" placeholder="Search" fullWidth InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon /></InputAdornment> }} sx={{ mb: 2 }} />
                  <Box sx={{ flex: 1, overflow: 'auto' }}>
                    {mockSquads.map((s) => (
                      <ListItemButton key={s.id} sx={{ py: 0.5 }}>{s.name}</ListItemButton>
                    ))}
                    {mockPositions.map((pos) => (
                      <Box key={pos.id}>
                        <ListItemButton sx={{ py: 0.5 }}>{pos.name}</ListItemButton>
                        {pos.memberIds?.map((mid) => {
                          const u = getUserById(mid)
                          return (
                            <ListItemButton key={mid} dense onClick={() => toggleMember(mid)} sx={{ pl: 4 }}>
                              <Checkbox size="small" checked={newChannelMembers.includes(mid)} />
                              <ListItemText primary={u.name} />
                            </ListItemButton>
                          )
                        })}
                      </Box>
                    ))}
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                    <Typography component="button" variant="body2" onClick={() => setNewChannelMembers([])} sx={{ background: 'none', border: 'none', cursor: 'pointer', color: 'text.secondary' }}>Reset</Typography>
                    <IconButton onClick={handleCreateChannelFromMembers} sx={{ bgcolor: 'grey.900', color: 'white', '&:hover': { bgcolor: 'grey.800' } }}><ChatBubbleIcon /></IconButton>
                  </Box>
                </>
              ) : (
                <>
                  <IconButton size="small" onClick={handleBackToMembers} sx={{ mb: 1 }}><ArrowBackIcon /> Back</IconButton>
                  <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>CHANNEL DETAILS</Typography>
                  <TextField size="small" label="Channel name" fullWidth value={newChannelName} onChange={(e) => setNewChannelName(e.target.value)} sx={{ mb: 2 }} />
                  <TextField size="small" label="Description" fullWidth multiline value={newChannelDescription} onChange={(e) => setNewChannelDescription(e.target.value)} sx={{ mb: 2 }} />
                  <Typography variant="subtitle2" sx={{ mb: 1 }}>Privacy</Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>A private channel is only visible to the users invited to the channel.</Typography>
                  <Typography variant="subtitle2" sx={{ mb: 1 }}>Permissions</Typography>
                  <FormControlLabel control={<Switch checked={athletesCanSend} onChange={(e) => setAthletesCanSend(e.target.checked)} />} label="Athletes can send messages" sx={{ display: 'block', mb: 1 }} />
                  <FormControlLabel control={<Switch checked={staffCanSend} onChange={(e) => setStaffCanSend(e.target.checked)} />} label="Staff can send messages" sx={{ display: 'block', mb: 2 }} />
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Typography component="button" variant="body2" onClick={handleBackToMembers} sx={{ border: '1px solid', borderColor: 'grey.300', borderRadius: 1, px: 2, py: 1, cursor: 'pointer', bgcolor: 'transparent' }}>Back</Typography>
                    <Typography component="button" variant="body2" onClick={handleCreateChannel} sx={{ bgcolor: 'var(--color-primary)', color: 'var(--color-white)', borderRadius: 1, px: 2, py: 1, cursor: 'pointer', border: 'none' }}>Create Channel</Typography>
                  </Box>
                </>
              )}
            </>
          )}

          {rightPanel === 'channelSettings' && selected?.type === 'channel' && (
            <>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h6">Channel settings</Typography>
                <IconButton size="small" onClick={() => setRightPanel(null)}><CloseIcon /></IconButton>
              </Box>
              <Typography variant="body2" color="text.secondary">Channel ID: {selected.channelId || '—'}</Typography>
              <FormControlLabel control={<Switch checked={channelSettingsMuted} onChange={(e) => setChannelSettingsMuted(e.target.checked)} />} label="Mute notifications" sx={{ display: 'block', mt: 2 }} />
              <Box sx={{ mt: 2 }}>
                <Typography component="button" variant="body2" sx={{ border: '1px solid', borderColor: 'grey.300', borderRadius: 1, px: 2, py: 1, cursor: 'pointer' }}>Cancel</Typography>
              </Box>
            </>
          )}
        </Box>
      </Drawer>

      {/* Channel members modal */}
      <Modal open={channelMembersOpen} onClose={() => setChannelMembersOpen(false)}>
        <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 480, bgcolor: 'background.paper', borderRadius: 2, boxShadow: 24, p: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="h6">Manage channel members</Typography>
            <IconButton size="small" onClick={() => setChannelMembersOpen(false)}><CloseIcon /></IconButton>
          </Box>
          <FormControlLabel 
            control={<Switch checked={showInactiveMembers} onChange={(e) => setShowInactiveMembers(e.target.checked)} />} 
            label="Show inactive members" 
            sx={{ mb: 2 }} 
          />
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>MEMBERS</Typography>
          <Divider />
          <Box sx={{ maxHeight: 400, overflow: 'auto' }}>
            {channelMembers
              .filter(m => showInactiveMembers || !(selected?.inactiveMembers || []).includes(m.id))
              .map((m) => {
                const isInactive = (selected?.inactiveMembers || []).includes(m.id)
                return (
                  <Box key={m.id} sx={{ display: 'flex', alignItems: 'center', gap: 1, py: 1.5, borderBottom: '1px solid', borderColor: 'divider' }}>
                    <Avatar 
                      src={m.avatarUrl} 
                      sx={{ 
                        width: 32, 
                        height: 32, 
                        bgcolor: m.isAdmin ? 'var(--color-primary)' : 'grey.400', 
                        fontSize: 12,
                        opacity: isInactive ? 0.5 : 1
                      }}
                    >
                      {m.name?.slice(0, 1)}
                    </Avatar>
                    <ListItemText 
                      primary={m.name} 
                      secondary={m.isAdmin ? 'Channel admin' : (isInactive ? 'Inactive' : m.role)} 
                      primaryTypographyProps={{ sx: { opacity: isInactive ? 0.6 : 1 } }}
                      secondaryTypographyProps={{ sx: { color: isInactive ? 'warning.main' : undefined } }}
                    />
                    {!m.isAdmin && (
                      <IconButton size="small" onClick={(e) => handleOpenMemberMenu(e, m.id)}>
                        <MoreVertIcon fontSize="small" />
                      </IconButton>
                    )}
                  </Box>
                )
              })}
          </Box>
          {channelMembers.filter(m => (selected?.inactiveMembers || []).includes(m.id)).length > 0 && (
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 2 }}>
              {channelMembers.filter(m => (selected?.inactiveMembers || []).includes(m.id)).length} inactive member(s)
            </Typography>
          )}
        </Box>
      </Modal>
      
      {/* Member management menu */}
      <Menu 
        anchorEl={memberMenuAnchor} 
        open={Boolean(memberMenuAnchor)} 
        onClose={() => { setMemberMenuAnchor(null); setManagingMemberId(null) }}
      >
        <MenuItem onClick={handleToggleMemberInactive}>
          <BlockIcon fontSize="small" sx={{ mr: 1 }} /> 
          {managingMemberId && (selected?.inactiveMembers || []).includes(managingMemberId) ? 'Mark as Active' : 'Mark as Inactive'}
        </MenuItem>
        <MenuItem onClick={handleRemoveMember} sx={{ color: 'error.main' }}>
          <PersonRemoveIcon fontSize="small" sx={{ mr: 1 }} /> Remove from Channel
        </MenuItem>
      </Menu>
      
      {/* Schedule send menu */}
      <Menu 
        anchorEl={scheduleSendAnchor} 
        open={Boolean(scheduleSendAnchor)} 
        onClose={() => setScheduleSendAnchor(null)}
      >
        <MenuItem onClick={() => handleScheduleSend('later-today')}>
          <Box>
            <Typography variant="body2">Later today</Typography>
            <Typography variant="caption" color="text.secondary">
              {new Date(Date.now() + 4 * 60 * 60 * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </Typography>
          </Box>
        </MenuItem>
        <MenuItem onClick={() => handleScheduleSend('tomorrow-morning')}>
          <Box>
            <Typography variant="body2">Tomorrow morning</Typography>
            <Typography variant="caption" color="text.secondary">9:00 AM</Typography>
          </Box>
        </MenuItem>
        <MenuItem onClick={() => handleScheduleSend('tomorrow-afternoon')}>
          <Box>
            <Typography variant="body2">Tomorrow afternoon</Typography>
            <Typography variant="caption" color="text.secondary">1:00 PM</Typography>
          </Box>
        </MenuItem>
        <Divider />
        <MenuItem onClick={() => handleScheduleSend('custom')}>
          <AccessTimeIcon fontSize="small" sx={{ mr: 1 }} />
          Pick date & time
        </MenuItem>
      </Menu>
      
      {/* Custom schedule dialog */}
      <Dialog open={scheduleDialogOpen} onClose={() => setScheduleDialogOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle>Schedule send</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <TextField
              label="Date"
              type="date"
              value={scheduleDate}
              onChange={(e) => setScheduleDate(e.target.value)}
              fullWidth
              InputLabelProps={{ shrink: true }}
              inputProps={{ min: new Date().toISOString().split('T')[0] }}
            />
            <TextField
              label="Time"
              type="time"
              value={scheduleTime}
              onChange={(e) => setScheduleTime(e.target.value)}
              fullWidth
              InputLabelProps={{ shrink: true }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setScheduleDialogOpen(false)}>Cancel</Button>
          <Button 
            onClick={handleCustomScheduleSend} 
            variant="contained" 
            disabled={!scheduleDate || !scheduleTime}
          >
            Schedule send
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* View scheduled messages modal */}
      <Modal open={viewScheduledOpen} onClose={() => setViewScheduledOpen(false)}>
        <Box sx={{ 
          position: 'absolute', 
          top: '50%', 
          left: '50%', 
          transform: 'translate(-50%, -50%)', 
          width: 500, 
          maxHeight: '80vh',
          overflow: 'auto',
          bgcolor: 'background.paper', 
          borderRadius: 2, 
          boxShadow: 24, 
          p: 3 
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="h6">Scheduled messages</Typography>
            <IconButton size="small" onClick={() => setViewScheduledOpen(false)}><CloseIcon /></IconButton>
          </Box>
          
          {scheduledMessages.length === 0 ? (
            <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
              No scheduled messages
            </Typography>
          ) : (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {scheduledMessages
                .sort((a, b) => new Date(a.scheduledFor) - new Date(b.scheduledFor))
                .map((msg) => (
                  <Box 
                    key={msg.id} 
                    sx={{ 
                      p: 2, 
                      border: '1px solid', 
                      borderColor: 'divider', 
                      borderRadius: 2,
                      bgcolor: 'grey.50'
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 1 }}>
                      <Box sx={{ flex: 1 }}>
                        {selectedId !== msg.conversationId && (
                          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                            To: {msg.conversationName}
                          </Typography>
                        )}
                        <Chip 
                          icon={<ScheduleIcon />} 
                          label={formatScheduledTime(msg.scheduledFor)} 
                          size="small" 
                          color="info"
                          sx={{ mb: 1 }}
                        />
                        <Typography variant="body2" sx={{ mb: 1 }}>{msg.text}</Typography>
                        {msg.attachments?.length > 0 && (
                          <Typography variant="caption" color="text.secondary">
                            📎 {msg.attachments.length} attachment(s)
                          </Typography>
                        )}
                      </Box>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                      <Button 
                        size="small" 
                        variant="outlined"
                        onClick={() => {
                          // Switch to the conversation if needed
                          if (selectedId !== msg.conversationId) {
                            handleSelectConversation(msg.conversationId)
                          }
                          handleSendScheduledNow(msg)
                        }}
                      >
                        Send now
                      </Button>
                      <Button 
                        size="small" 
                        color="error"
                        onClick={() => handleCancelScheduled(msg.id)}
                      >
                        Cancel
                      </Button>
                    </Box>
                  </Box>
                ))}
            </Box>
          )}
        </Box>
      </Modal>
    </Box>
  )
}
