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
  CircularProgress
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
  Person as PersonIcon
} from '@mui/icons-material'
import {
  currentUserId,
  mockUsers,
  mockSquads,
  mockPositions,
  getAllConversations,
  getMessagesForConversation,
  getUserById
} from './mockData'
import '../../styles/design-tokens.css'

const SIDEBAR_WIDTH = 280
const RIGHT_PANEL_WIDTH = 360

// Empty state illustration (CSS-based speech bubbles)
function EmptyStateIllustration() {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, py: 6 }}>
      <Box sx={{ position: 'relative', width: 80, height: 60 }}>
        <Box sx={{ position: 'absolute', top: 0, left: 8, width: 24, height: 20, borderRadius: '12px 12px 12px 4px', bgcolor: 'grey.200' }} />
        <Box sx={{ position: 'absolute', top: 12, left: 24, width: 28, height: 24, borderRadius: '14px 14px 14px 4px', border: '2px solid', borderColor: 'primary.main' }} />
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

  const selected = useMemo(() => conversations.find(c => c.id === selectedId), [conversations, selectedId])
  const isChannel = selected?.type === 'channel'

  const handleSelectConversation = (id) => {
    setSelectedId(id)
    setLoading(true)
    setMessages([])
    setTimeout(() => {
      setMessages(getMessagesForConversation(id))
      setLoading(false)
    }, 600)
    setRightPanel(null)
  }

  const handleSend = () => {
    const text = (editingMessageId ? editText : inputValue).trim()
    if (!text && attachments.length === 0) return
    if (editingMessageId) {
      setMessages(prev => prev.map(m => m.id === editingMessageId ? { ...m, text } : m))
      setEditingMessageId(null)
      setEditText('')
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
          <IconButton size="small" onClick={handleAddDM}><ComposeIcon /></IconButton>
        </Box>
        <Box sx={{ flex: 1, overflow: 'auto' }}>
          <Box sx={{ px: 2, py: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography variant="caption" color="text.secondary" fontWeight={600}>CHANNELS</Typography>
            <IconButton size="small" onClick={handleAddChannel}><AddIcon fontSize="small" /></IconButton>
          </Box>
          {conversations.filter(c => c.type === 'channel').map((c) => (
            <ListItemButton key={c.id} selected={selectedId === c.id} onClick={() => handleSelectConversation(c.id)} sx={{ py: 1 }}>
              <ListItemIcon sx={{ minWidth: 36 }}><PersonIcon fontSize="small" /></ListItemIcon>
              <ListItemText primary={c.name} primaryTypographyProps={{ noWrap: true }} />
            </ListItemButton>
          ))}
          <Box sx={{ px: 2, py: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography variant="caption" color="text.secondary" fontWeight={600}>DIRECT MESSAGES</Typography>
            <IconButton size="small" onClick={handleAddDM}><AddIcon fontSize="small" /></IconButton>
          </Box>
          {conversations.filter(c => c.type === 'dm').map((c) => (
            <ListItemButton key={c.id} selected={selectedId === c.id} onClick={() => handleSelectConversation(c.id)} sx={{ py: 1 }}>
              <ListItemIcon sx={{ minWidth: 36 }}><Avatar sx={{ width: 28, height: 28, bgcolor: 'grey.400', fontSize: 12 }}>{c.name.slice(0, 1)}</Avatar></ListItemIcon>
              <ListItemText primary={c.name} primaryTypographyProps={{ noWrap: true }} />
            </ListItemButton>
          ))}
        </Box>
      </Box>

      {/* Center: chat */}
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {selected ? (
          <>
            <Box sx={{ p: 1.5, borderBottom: '1px solid var(--color-border-primary)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Avatar sx={{ width: 32, height: 32, bgcolor: 'grey.400', fontSize: 14 }}>{selected.name.slice(0, 1)}</Avatar>
                <Typography variant="subtitle2" fontWeight={600}>{selected.name}</Typography>
                <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>{formatTime(selected.lastActivity)}</Typography>
              </Box>
              <IconButton size="small" onClick={(e) => setAnchorMenu(e.currentTarget)}><MoreVertIcon /></IconButton>
            </Box>
            <Menu anchorEl={anchorMenu} open={Boolean(anchorMenu)} onClose={() => setAnchorMenu(null)}>
              {isChannel && <MenuItem onClick={handleOpenChannelSettings}>Channel Settings</MenuItem>}
              {isChannel && <MenuItem onClick={handleViewMembers}>View Members</MenuItem>}
              {isChannel && <MenuItem onClick={handleManageMembers}>Manage Members</MenuItem>}
              {isChannel && <MenuItem>Leave Channel</MenuItem>}
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
                  {messages.map((msg) => (
                    <Box key={msg.id} sx={{ display: 'flex', justifyContent: msg.senderId === currentUserId ? 'flex-end' : 'flex-start', mb: 1.5 }}>
                      <Box sx={{ maxWidth: '75%', display: 'flex', alignItems: 'flex-start', gap: 0.5 }}>
                        {editingMessageId === msg.id ? (
                          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, width: '100%' }}>
                            <TextField size="small" fullWidth value={editText} onChange={(e) => setEditText(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()} />
                            <Box sx={{ display: 'flex', gap: 1 }}><IconButton size="small" onClick={handleSend}>Save</IconButton><IconButton size="small" onClick={handleCancelEdit}>Cancel</IconButton></Box>
                          </Box>
                        ) : (
                          <>
                            <Box sx={{ bgcolor: msg.senderId === currentUserId ? 'primary.main' : 'grey.200', color: msg.senderId === currentUserId ? 'white' : 'text.primary', borderRadius: 2, px: 2, py: 1, borderBottomRightRadius: msg.senderId === currentUserId ? 2 : 2, borderBottomLeftRadius: msg.senderId === currentUserId ? 2 : 4 }}>
                              <Typography variant="body2">{msg.text}</Typography>
                              {msg.attachments?.length > 0 && <Typography variant="caption" display="block" sx={{ mt: 0.5 }}>📎 {msg.attachments.length} file(s)</Typography>}
                              <Typography variant="caption" sx={{ opacity: 0.8 }}>{formatTime(msg.timestamp)}</Typography>
                            </Box>
                            {msg.senderId === currentUserId && (
                              <IconButton size="small" onClick={(e) => handleOpenMessageMenu(e, msg)}><MoreVertIcon fontSize="small" /></IconButton>
                            )}
                          </>
                        )}
                      </Box>
                    </Box>
                  ))}
                </>
              )}
            </Box>

            <Menu anchorEl={messageMenuAnchor} open={Boolean(messageMenuAnchor)} onClose={() => { setMessageMenuAnchor(null); setMessageMenuTarget(null) }}>
              <MenuItem onClick={() => messageMenuTarget && handleStartEditMessage(messageMenuTarget)}><EditIcon fontSize="small" sx={{ mr: 1 }} /> Edit</MenuItem>
              <MenuItem onClick={() => messageMenuTarget && handleDeleteMessage(messageMenuTarget.id)}>Delete</MenuItem>
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
                <IconButton color="primary" onClick={handleSend} disabled={!inputValue.trim() && attachments.length === 0}><SendIcon /></IconButton>
              </Box>
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
                    <ListItemIcon sx={{ minWidth: 36 }}><Avatar sx={{ width: 28, height: 28, bgcolor: 'grey.400', fontSize: 12 }}>{user.name.slice(0, 1)}</Avatar></ListItemIcon>
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
                    <Typography component="button" variant="body2" onClick={handleCreateChannel} sx={{ bgcolor: 'primary.main', color: 'white', borderRadius: 1, px: 2, py: 1, cursor: 'pointer', border: 'none' }}>Create Channel</Typography>
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
        <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, bgcolor: 'background.paper', borderRadius: 2, boxShadow: 24, p: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="h6">Channel members</Typography>
            <IconButton size="small" onClick={() => setChannelMembersOpen(false)}><CloseIcon /></IconButton>
          </Box>
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>Member</Typography>
          <Divider />
          {channelMembers.map((m) => (
            <Box key={m.id} sx={{ display: 'flex', alignItems: 'center', gap: 1, py: 1.5, borderBottom: '1px solid', borderColor: 'divider' }}>
              <Avatar sx={{ width: 32, height: 32, bgcolor: m.isAdmin ? 'primary.main' : 'grey.400', fontSize: 12 }}>{m.name?.slice(0, 1)}</Avatar>
              <ListItemText primary={m.name} secondary={m.isAdmin ? 'Channel admin' : null} />
            </Box>
          ))}
        </Box>
      </Modal>
    </Box>
  )
}
