import React, { useState, useMemo, useCallback } from 'react'
import {
  Box,
  Typography,
  IconButton,
  Drawer,
  TextField,
  Checkbox,
  InputAdornment,
  Collapse,
  Divider,
  Tooltip,
} from '@mui/material'
import {
  CloseOutlined as CloseIcon,
  ArrowDropDownOutlined as DropdownIcon,
  ExpandLessOutlined as CollapseIcon,
  RemoveCircleOutlineOutlined as RemoveIcon,
  CheckCircleOutlined as CheckCircleIcon,
  MailOutlined as MailIcon,
  SmsOutlined as SmsIcon,
  NotificationsOutlined as AppIcon,
  ChevronLeftOutlined as BackIcon,
  ScheduleOutlined as ScheduleIcon,
  AddOutlined as AddIcon,
} from '@mui/icons-material'
import {
  atlNamedStaff,
  atlFirstTeamFlat,
  computeReachFromIds,
} from '../../data/blastMessaging'

const DRAWER_WIDTH = 480
const SMS_SOFT_LIMIT = 160
const SMS_HARD_WARN = 320

// ─── Shared helpers ────────────────────────────────────────────────────────────

// Deterministic grey shade for avatar background based on first letter
const AVATAR_GREYS = ['grey.300', 'grey.400', 'grey.300', 'grey.400', 'grey.300', 'grey.400']
const AVATAR_DARK = 'grey.600'

function Avatar1({ last, size = 32 }) {
  const letter = (last || '?')[0].toUpperCase()
  const idx = (last || '').charCodeAt(0) % 6
  return (
    <Box sx={{
      width: size, height: size, borderRadius: '50%',
      bgcolor: AVATAR_GREYS[idx],
      color: 'white',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: size * 0.42, fontWeight: 700, flexShrink: 0,
    }}>
      {letter}
    </Box>
  )
}

function Avatar2({ last, first, size = 36 }) {
  const initials = `${(last || '')[0] || ''}${(first || '')[0] || ''}`.toUpperCase()
  return (
    <Box sx={{
      width: size, height: size, borderRadius: '50%',
      bgcolor: AVATAR_DARK,
      color: 'white',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: size * 0.36, fontWeight: 700, flexShrink: 0, letterSpacing: -0.5,
    }}>
      {initials}
    </Box>
  )
}

// ─── Channel chip ──────────────────────────────────────────────────────────────
function ChannelChip({ channel, selected, onToggle, reachCount, totalRecipients }) {
  const meta = {
    inapp: { label: 'In-app', icon: <AppIcon sx={{ fontSize: 15 }} /> },
    email: { label: 'Email',  icon: <MailIcon sx={{ fontSize: 15 }} /> },
    sms:   { label: 'SMS',    icon: <SmsIcon  sx={{ fontSize: 15 }} /> },
  }[channel]
  const missed = totalRecipients > 0 ? totalRecipients - reachCount : 0
  return (
    <Tooltip
      title={totalRecipients > 0 && missed > 0 ? `${missed} recipient${missed > 1 ? 's' : ''} not reachable` : ''}
      placement="top"
    >
      <Box
        onClick={onToggle}
        sx={{
          display: 'inline-flex', alignItems: 'center', gap: 0.5,
          px: 1.5, py: 0.75, borderRadius: 5, border: '1.5px solid',
          borderColor: selected ? 'var(--color-primary)' : 'var(--color-border-primary)',
          bgcolor: selected ? 'rgba(59,73,96,0.08)' : 'transparent',
          cursor: 'pointer', userSelect: 'none', transition: 'all 0.12s',
          '&:hover': { borderColor: 'var(--color-primary)' },
        }}
      >
        <Box sx={{ color: selected ? 'var(--color-primary)' : 'text.disabled' }}>{meta.icon}</Box>
        <Typography variant="body2" fontWeight={selected ? 600 : 400}
          color={selected ? 'var(--color-primary)' : 'text.secondary'}>
          {meta.label}
        </Typography>
        {totalRecipients > 0 && (
          <Typography variant="caption" sx={{ color: selected ? 'var(--color-primary)' : 'text.disabled' }}>
            {reachCount}
          </Typography>
        )}
      </Box>
    </Tooltip>
  )
}

// ─── Recipient section (Staff OR Athletes) ─────────────────────────────────────
// Matches screenshot pattern:
//  - Collapsed/empty: section label + filled "Search" dropdown
//  - Expanded: search input, "Selected (N)" pill, select-all header, list, Done btn
//  - Has selections (collapsed): selected items as dark-avatar rows with remove btn
function RecipientSection({ title, items, selectedIds, onToggle, onSelectAll, onClearAll }) {
  const [expanded, setExpanded] = useState(false)
  const [query, setQuery] = useState('')

  const selectedInSection = useMemo(
    () => items.filter(i => selectedIds.has(i.id)),
    [items, selectedIds]
  )
  const hasSelections = selectedInSection.length > 0

  const filtered = useMemo(() => {
    if (!query.trim()) return items
    const q = query.toLowerCase()
    return items.filter(i =>
      `${i.first} ${i.last}`.toLowerCase().includes(q) ||
      (i.role || i.positionGroup || '').toLowerCase().includes(q)
    )
  }, [items, query])

  const allFilteredSelected = filtered.length > 0 && filtered.every(i => selectedIds.has(i.id))
  const someFilteredSelected = filtered.some(i => selectedIds.has(i.id)) && !allFilteredSelected

  const handleSelectAll = () => {
    if (allFilteredSelected) onClearAll(filtered.map(i => i.id))
    else onSelectAll(filtered.map(i => i.id))
  }

  const handleOpen = () => { setExpanded(true); setQuery('') }
  const handleDone = () => setExpanded(false)

  return (
    <Box sx={{ mb: 0 }}>
      {/* Section title */}
      <Typography variant="subtitle2" fontWeight={600} sx={{ px: 2.5, pt: 2, pb: 1 }}>
        {title}
      </Typography>

      {/* Search / dropdown trigger — always visible */}
      {!expanded && (
        <Box sx={{ px: 2.5 }}>
          <Box
            onClick={handleOpen}
            sx={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              px: 1.5, py: 1.125,
              bgcolor: 'rgba(0,0,0,0.06)', borderRadius: '4px 4px 0 0',
              borderBottom: '1px solid rgba(0,0,0,0.42)',
              cursor: 'pointer',
              '&:hover': { bgcolor: 'rgba(0,0,0,0.09)' },
            }}
          >
            <Typography variant="body2" color="text.disabled">Search</Typography>
            <DropdownIcon sx={{ fontSize: 20, color: 'text.secondary' }} />
          </Box>
        </Box>
      )}

      {/* Expanded state */}
      <Collapse in={expanded}>
        <Box sx={{ px: 2.5 }}>
          {/* Search input */}
          <Box sx={{ position: 'relative' }}>
            <TextField
              variant="filled"
              size="small"
              fullWidth
              placeholder="Search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              autoFocus
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton size="small" onClick={handleDone} edge="end">
                      <CloseIcon sx={{ fontSize: 16 }} />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Box>

          {/* Selected pill */}
          <Box sx={{ display: 'flex', alignItems: 'center', mt: 1, mb: 1 }}>
            <Box sx={{
              display: 'inline-flex', alignItems: 'center',
              px: 1.5, py: 0.375, borderRadius: 10,
              bgcolor: 'var(--color-primary)', color: 'white',
              fontSize: 12, fontWeight: 600,
            }}>
              Selected ({selectedInSection.length})
            </Box>
          </Box>
        </Box>

        {/* Select all header */}
        <Box sx={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          px: 2.5, py: 0.75,
          borderTop: '1px solid var(--color-border-primary)',
          borderBottom: '1px solid var(--color-border-primary)',
        }}>
          <Typography variant="caption" fontWeight={500} color="text.secondary">
            All {title.toLowerCase()}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ cursor: 'pointer', '&:hover': { color: 'var(--color-primary)' } }}
              onClick={handleSelectAll}
            >
              Select all
            </Typography>
            <Checkbox
              size="small"
              checked={allFilteredSelected}
              indeterminate={someFilteredSelected}
              onChange={handleSelectAll}
              sx={{ p: 0.25, '&.Mui-checked': { color: 'var(--color-primary)' }, '&.MuiCheckbox-indeterminate': { color: 'var(--color-primary)' } }}
            />
            <Box component="span" sx={{ mx: 0.25, color: 'divider', userSelect: 'none' }}>|</Box>
            <IconButton size="small" onClick={handleDone} sx={{ p: 0.25 }}>
              <CollapseIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
            </IconButton>
          </Box>
        </Box>

        {/* List */}
        <Box sx={{ maxHeight: 240, overflow: 'auto' }}>
          {filtered.map((item) => {
            const checked = selectedIds.has(item.id)
            return (
              <Box
                key={item.id}
                onClick={() => onToggle(item.id)}
                sx={{
                  display: 'flex', alignItems: 'center', gap: 1.5,
                  px: 2.5, py: 1.125,
                  borderBottom: '1px solid var(--color-border-primary)',
                  cursor: 'pointer',
                  '&:hover': { bgcolor: 'rgba(0,0,0,0.03)' },
                  bgcolor: checked ? 'rgba(59,73,96,0.04)' : 'transparent',
                }}
              >
                <Checkbox
                  size="small"
                  checked={checked}
                  onChange={() => onToggle(item.id)}
                  onClick={(e) => e.stopPropagation()}
                  sx={{ p: 0.25, flexShrink: 0, '&.Mui-checked': { color: 'var(--color-primary)' } }}
                />
                <Avatar1 last={item.last} size={28} />
                <Typography variant="body2">
                  {item.first} {item.last}
                </Typography>
                {item.role && (
                  <Typography variant="caption" color="text.disabled" sx={{ ml: 'auto', flexShrink: 0 }}>
                    {item.role}
                  </Typography>
                )}
              </Box>
            )
          })}
          {filtered.length === 0 && (
            <Box sx={{ px: 2.5, py: 2 }}>
              <Typography variant="body2" color="text.disabled">No results</Typography>
            </Box>
          )}
        </Box>

        {/* Done button */}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', px: 2.5, py: 1.25, borderTop: '1px solid var(--color-border-primary)' }}>
          <Box
            component="button"
            onClick={handleDone}
            sx={{
              px: 2, py: 0.625,
              bgcolor: selectedInSection.length > 0 ? 'var(--color-primary)' : 'grey.300',
              color: selectedInSection.length > 0 ? 'white' : 'text.disabled',
              border: 'none', borderRadius: 1,
              cursor: selectedInSection.length > 0 ? 'pointer' : 'default',
              fontSize: 13, fontWeight: 600,
            }}
          >
            Done
          </Box>
        </Box>
      </Collapse>

      {/* Selected items (collapsed, has selections) */}
      {!expanded && hasSelections && (
        <Box sx={{ mt: 0.5 }}>
          {selectedInSection.map((item) => (
            <Box
              key={item.id}
              sx={{
                display: 'flex', alignItems: 'center', gap: 1.5,
                px: 2.5, py: 1,
                borderTop: '1px solid var(--color-border-primary)',
              }}
            >
              <Avatar2 last={item.last} first={item.first} size={36} />
              <Typography variant="body2" fontWeight={500} sx={{ flex: 1 }}>
                {item.last}, {item.first}
              </Typography>
              <IconButton
                size="small"
                onClick={() => onToggle(item.id)}
                sx={{ color: 'text.disabled', '&:hover': { color: 'error.main' } }}
              >
                <RemoveIcon sx={{ fontSize: 18 }} />
              </IconButton>
            </Box>
          ))}
          {/* "Edit" affordance — re-opens the picker */}
          <Box sx={{ px: 2.5, pb: 1 }}>
            <Box
              component="span"
              onClick={handleOpen}
              sx={{ fontSize: 12, color: 'var(--color-primary)', cursor: 'pointer', fontWeight: 600 }}
            >
              + Add more {title.toLowerCase()}
            </Box>
          </Box>
        </Box>
      )}

      <Divider />
    </Box>
  )
}

// ─── Schedule section ──────────────────────────────────────────────────────────
function ScheduleSection({ title, onTitleChange, startDate, onStartDateChange, endDate, onEndDateChange }) {
  return (
    <Box>
      <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1.5 }}>
        Schedule
      </Typography>
      <TextField
        variant="filled"
        size="small"
        fullWidth
        label="Title"
        value={title}
        onChange={(e) => onTitleChange(e.target.value)}
        sx={{ mb: 1.5 }}
      />
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <TextField
          variant="filled"
          size="small"
          type="date"
          label="Start date"
          value={startDate}
          onChange={(e) => onStartDateChange(e.target.value)}
          InputLabelProps={{ shrink: true }}
          inputProps={{ min: new Date().toISOString().split('T')[0] }}
          sx={{ flex: 1 }}
        />
        <Typography variant="body2" color="text.disabled">—</Typography>
        <TextField
          variant="filled"
          size="small"
          type="date"
          label="End date"
          value={endDate}
          onChange={(e) => onEndDateChange(e.target.value)}
          InputLabelProps={{ shrink: true }}
          inputProps={{ min: startDate || new Date().toISOString().split('T')[0] }}
          sx={{ flex: 1 }}
        />
      </Box>
    </Box>
  )
}

// ─── Confirmation step ─────────────────────────────────────────────────────────
function ConfirmationStep({ reach, selectedChannels, onClose }) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1, p: 4, textAlign: 'center' }}>
      <Box sx={{ width: 72, height: 72, borderRadius: '50%', bgcolor: 'rgba(59,73,96,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 3 }}>
        <CheckCircleIcon sx={{ fontSize: 36, color: 'var(--color-primary)' }} />
      </Box>
      <Typography variant="h6" fontWeight={700} sx={{ mb: 1 }}>Message sent</Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3, maxWidth: 260 }}>
        Delivered to {reach.total} recipients across {[...selectedChannels].length} channel{[...selectedChannels].length > 1 ? 's' : ''}.
      </Typography>
      <Box sx={{ display: 'flex', gap: 3, mb: 3 }}>
        {selectedChannels.has('inapp') && reach.inApp > 0 && (
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h6" fontWeight={700} color="var(--color-primary)">{reach.inApp}</Typography>
            <Typography variant="caption" color="text.secondary">In-app</Typography>
          </Box>
        )}
        {selectedChannels.has('email') && reach.email > 0 && (
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h6" fontWeight={700} color="var(--color-primary)">{reach.email}</Typography>
            <Typography variant="caption" color="text.secondary">Email</Typography>
          </Box>
        )}
        {selectedChannels.has('sms') && reach.sms > 0 && (
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h6" fontWeight={700} color="var(--color-primary)">{reach.sms}</Typography>
            <Typography variant="caption" color="text.secondary">SMS</Typography>
          </Box>
        )}
      </Box>
      <Box component="button" onClick={onClose}
        sx={{ px: 3, py: 1, bgcolor: 'var(--color-primary)', color: 'white', border: 'none', borderRadius: 1, cursor: 'pointer', fontWeight: 600, fontSize: 14 }}>
        Done
      </Box>
    </Box>
  )
}

// ─── Main drawer ───────────────────────────────────────────────────────────────
export default function BlastMessageDrawer({ open, onClose, onSent }) {
  // ── Step: 'recipients' | 'compose' | 'confirmed'
  const [step, setStep] = useState('recipients')

  // ── Recipient state
  const [selectedStaffIds, setSelectedStaffIds] = useState(new Set())
  const [selectedAthleteIds, setSelectedAthleteIds] = useState(new Set())

  // ── Channel state (persists from step 1 → 2)
  const [selectedChannels, setSelectedChannels] = useState(new Set(['inapp', 'email']))

  // ── Compose state
  const [subject, setSubject] = useState('')
  const [body, setBody] = useState('')

  // ── Schedule state
  const [scheduleOpen, setScheduleOpen] = useState(false)
  const [scheduleTitle, setScheduleTitle] = useState('')
  const [scheduleStartDate, setScheduleStartDate] = useState('')
  const [scheduleEndDate, setScheduleEndDate] = useState('')

  // ── Computed
  const allSelectedIds = useMemo(
    () => new Set([...selectedStaffIds, ...selectedAthleteIds]),
    [selectedStaffIds, selectedAthleteIds]
  )
  const totalSelected = allSelectedIds.size
  const reach = useMemo(() => computeReachFromIds([...allSelectedIds]), [allSelectedIds])

  // ── Handlers: staff
  const toggleStaff = useCallback((id) => {
    setSelectedStaffIds(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n })
  }, [])
  const selectAllStaff = useCallback((ids) => {
    setSelectedStaffIds(prev => { const n = new Set(prev); ids.forEach(id => n.add(id)); return n })
  }, [])
  const clearAllStaff = useCallback((ids) => {
    setSelectedStaffIds(prev => { const n = new Set(prev); ids.forEach(id => n.delete(id)); return n })
  }, [])

  // ── Handlers: athletes
  const toggleAthlete = useCallback((id) => {
    setSelectedAthleteIds(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n })
  }, [])
  const selectAllAthletes = useCallback((ids) => {
    setSelectedAthleteIds(prev => { const n = new Set(prev); ids.forEach(id => n.add(id)); return n })
  }, [])
  const clearAllAthletes = useCallback((ids) => {
    setSelectedAthleteIds(prev => { const n = new Set(prev); ids.forEach(id => n.delete(id)); return n })
  }, [])

  const handleToggleChannel = (ch) => {
    setSelectedChannels(prev => { const n = new Set(prev); n.has(ch) ? n.delete(ch) : n.add(ch); return n })
  }

  // ── Send
  const handleSend = () => {
    setStep('confirmed')
    onSent && onSent({ subject, body, channels: [...selectedChannels], reach })
  }

  // ── Reset
  const handleClose = () => {
    setStep('recipients')
    setSelectedStaffIds(new Set())
    setSelectedAthleteIds(new Set())
    setSelectedChannels(new Set(['inapp', 'email']))
    setSubject('')
    setBody('')
    setScheduleOpen(false)
    setScheduleTitle('')
    setScheduleStartDate('')
    setScheduleEndDate('')
    onClose()
  }

  const charCount = body.length
  const showSmsCounter = selectedChannels.has('sms')
  const smsColor = charCount > SMS_HARD_WARN ? 'error.main' : charCount > SMS_SOFT_LIMIT ? 'warning.main' : 'text.disabled'
  const smsSegments = Math.ceil(charCount / SMS_SOFT_LIMIT) || 1

  // Step labels
  const stepLabel = step === 'recipients' ? '1. Select recipients' : step === 'compose' ? '2. Compose message' : 'Message sent'

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={handleClose}
      sx={{ '& .MuiDrawer-paper': { width: DRAWER_WIDTH, boxShadow: '-4px 0 24px rgba(0,0,0,0.1)' } }}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>

        {/* ── Chrome header ── */}
        <Box sx={{
          px: 2.5, py: 1.75,
          borderBottom: '1px solid var(--color-border-primary)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          flexShrink: 0,
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {step === 'compose' && (
              <IconButton size="small" onClick={() => setStep('recipients')} sx={{ mr: 0.5 }}>
                <BackIcon fontSize="small" />
              </IconButton>
            )}
            <Typography variant="subtitle1" fontWeight={700}>{stepLabel}</Typography>
          </Box>
          <IconButton size="small" onClick={handleClose}><CloseIcon /></IconButton>
        </Box>

        {/* ── CONFIRMATION ── */}
        {step === 'confirmed' && (
          <ConfirmationStep reach={reach} selectedChannels={selectedChannels} onClose={handleClose} />
        )}

        {/* ══════════════════════════════════════════════
            STEP 1 — SELECT RECIPIENTS
            ══════════════════════════════════════════════ */}
        {step === 'recipients' && (
          <>
            <Box sx={{ flex: 1, overflow: 'auto' }}>
              <RecipientSection
                title="Staff"
                items={atlNamedStaff}
                selectedIds={selectedStaffIds}
                onToggle={toggleStaff}
                onSelectAll={selectAllStaff}
                onClearAll={clearAllStaff}
              />
              <RecipientSection
                title="Athletes"
                items={atlFirstTeamFlat}
                selectedIds={selectedAthleteIds}
                onToggle={toggleAthlete}
                onSelectAll={selectAllAthletes}
                onClearAll={clearAllAthletes}
              />
            </Box>

            {/* Footer */}
            <Box sx={{
              px: 2.5, py: 2,
              borderTop: '1px solid var(--color-border-primary)',
              display: 'flex', alignItems: 'center', justifyContent: 'flex-end',
              flexShrink: 0,
            }}>
              <Box
                component="button"
                disabled={totalSelected === 0}
                onClick={() => setStep('compose')}
                sx={{
                  display: 'flex', alignItems: 'center', gap: 0.75,
                  px: 2.5, py: 1,
                  bgcolor: totalSelected > 0 ? 'var(--color-primary)' : 'grey.300',
                  color: totalSelected > 0 ? 'white' : 'text.disabled',
                  border: 'none', borderRadius: 1,
                  cursor: totalSelected > 0 ? 'pointer' : 'not-allowed',
                  fontWeight: 700, fontSize: 14,
                }}
              >
                Next
                <Box component="span" sx={{ fontSize: 16, lineHeight: 1 }}>&rsaquo;</Box>
              </Box>
            </Box>
          </>
        )}

        {/* ══════════════════════════════════════════════
            STEP 2 — COMPOSE
            ══════════════════════════════════════════════ */}
        {step === 'compose' && (
          <>
            <Box sx={{ flex: 1, overflow: 'auto' }}>

              {/* Recipients summary */}
              <Box sx={{ px: 2.5, pt: 2, pb: 1.5, borderBottom: '1px solid var(--color-border-primary)' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                  {selectedStaffIds.size > 0 && (
                    <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5, px: 1.25, py: 0.375, bgcolor: 'grey.100', borderRadius: 10 }}>
                      <Typography variant="caption" fontWeight={600}>{selectedStaffIds.size} staff</Typography>
                    </Box>
                  )}
                  {selectedAthleteIds.size > 0 && (
                    <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5, px: 1.25, py: 0.375, bgcolor: 'grey.100', borderRadius: 10 }}>
                      <Typography variant="caption" fontWeight={600}>{selectedAthleteIds.size} athletes</Typography>
                    </Box>
                  )}
                  <Box
                    component="span"
                    onClick={() => setStep('recipients')}
                    sx={{ fontSize: 12, color: 'var(--color-primary)', cursor: 'pointer', fontWeight: 600, ml: 0.5 }}
                  >
                    Edit
                  </Box>
                </Box>
              </Box>

              {/* Send via */}
              <Box sx={{ px: 2.5, py: 2, borderBottom: '1px solid var(--color-border-primary)' }}>
                <Typography variant="caption" fontWeight={700} color="text.secondary"
                  sx={{ textTransform: 'uppercase', letterSpacing: 0.5, display: 'block', mb: 1.25 }}>
                  Send via
                </Typography>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  {['inapp', 'email', 'sms'].map((ch) => (
                    <ChannelChip
                      key={ch}
                      channel={ch}
                      selected={selectedChannels.has(ch)}
                      onToggle={() => handleToggleChannel(ch)}
                      reachCount={ch === 'inapp' ? reach.inApp : ch === 'email' ? reach.email : reach.sms}
                      totalRecipients={reach.total}
                    />
                  ))}
                </Box>
                {reach.total > 0 && selectedChannels.size > 0 && (
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                    {reach.total} recipients
                    {selectedChannels.has('inapp')  && ` · ${reach.inApp} in-app`}
                    {selectedChannels.has('email') && ` · ${reach.email} email`}
                    {selectedChannels.has('sms')   && ` · ${reach.sms} SMS`}
                  </Typography>
                )}
              </Box>

              {/* Message */}
              <Box sx={{ px: 2.5, py: 2 }}>
                <Typography variant="caption" fontWeight={700} color="text.secondary"
                  sx={{ textTransform: 'uppercase', letterSpacing: 0.5, display: 'block', mb: 1.25 }}>
                  Message
                </Typography>

                {selectedChannels.has('email') && (
                  <TextField
                    variant="filled"
                    size="small"
                    fullWidth
                    label="Subject"
                    placeholder="Enter a subject line…"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    sx={{ mb: 1.5 }}
                  />
                )}

                <TextField
                  variant="filled"
                  size="small"
                  fullWidth
                  multiline
                  rows={5}
                  label="Message"
                  placeholder="Write your message here…"
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                />

                {showSmsCounter && (
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 0.75 }}>
                    <Typography variant="caption" sx={{ color: smsColor }}>
                      {charCount} / {SMS_SOFT_LIMIT} characters
                      {smsSegments > 1 && ` · ${smsSegments} parts`}
                    </Typography>
                    {charCount > SMS_SOFT_LIMIT && (
                      <Typography variant="caption" color="warning.main">Message may be split</Typography>
                    )}
                  </Box>
                )}
              </Box>

              {/* Add schedule */}
              <Box sx={{ px: 2.5, pb: 2.5 }}>
                <Divider sx={{ mb: 2 }} />
                {!scheduleOpen ? (
                  <Box
                    component="button"
                    onClick={() => setScheduleOpen(true)}
                    sx={{
                      display: 'flex', alignItems: 'center', gap: 0.75,
                      background: 'none', border: '1px dashed',
                      borderColor: 'var(--color-border-primary)',
                      borderRadius: 1, px: 1.5, py: 0.875,
                      cursor: 'pointer', color: 'text.secondary', width: '100%',
                      '&:hover': { borderColor: 'var(--color-primary)', color: 'var(--color-primary)' },
                    }}
                  >
                    <AddIcon sx={{ fontSize: 16 }} />
                    <Typography variant="body2" fontWeight={500}>Add schedule</Typography>
                  </Box>
                ) : (
                  <ScheduleSection
                    title={scheduleTitle}
                    onTitleChange={setScheduleTitle}
                    startDate={scheduleStartDate}
                    onStartDateChange={setScheduleStartDate}
                    endDate={scheduleEndDate}
                    onEndDateChange={setScheduleEndDate}
                  />
                )}
              </Box>
            </Box>

            {/* Footer */}
            <Box sx={{
              px: 2.5, py: 2,
              borderTop: '1px solid var(--color-border-primary)',
              display: 'flex', alignItems: 'center', justifyContent: 'flex-end',
              gap: 1.5, flexShrink: 0,
            }}>
              {!body.trim() && (
                <Typography variant="caption" color="text.disabled">Write a message to send</Typography>
              )}
              <Box
                component="button"
                disabled={!body.trim() || selectedChannels.size === 0}
                onClick={handleSend}
                sx={{
                  px: 2.5, py: 1,
                  bgcolor: body.trim() && selectedChannels.size > 0 ? 'var(--color-primary)' : 'grey.300',
                  color: body.trim() && selectedChannels.size > 0 ? 'white' : 'text.disabled',
                  border: 'none', borderRadius: 1,
                  cursor: body.trim() && selectedChannels.size > 0 ? 'pointer' : 'not-allowed',
                  fontWeight: 700, fontSize: 14,
                }}
              >
                Send now
              </Box>
            </Box>
          </>
        )}
      </Box>
    </Drawer>
  )
}
