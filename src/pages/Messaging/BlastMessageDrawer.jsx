import React, { useState, useMemo, useCallback, useRef, useEffect } from 'react'
import {
  Box,
  Typography,
  IconButton,
  Drawer,
  Dialog,
  TextField,
  Checkbox,
  InputAdornment,
  Collapse,
  Divider,
  Tooltip,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Popover,
  Menu,
  Snackbar,
  Slide,
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
  ChevronRightOutlined as ChevronRightIcon,
  AddOutlined as AddIcon,
  SearchOutlined as SearchIcon,
  FormatBoldOutlined as BoldIcon,
  FormatItalicOutlined as ItalicIcon,
  InsertLinkOutlined as LinkIcon,
  FormatListBulletedOutlined as BulletIcon,
  FolderOutlined as GroupIcon,
  FilterListOutlined as FilterListIcon,
  SwapVertOutlined as SortIcon,
  AttachFileOutlined as AttachFileIcon,
  InsertDriveFileOutlined as FileIcon,
} from '@mui/icons-material'
import {
  mlsClubs,
  getClubData,
  getCustomGroupsForClub,
  resolveGroupMembers,
  getAllClubContacts,
  computeReachFromIds,
} from '../../data/blastMessaging'

const DRAWER_WIDTH = 480
const SMS_SOFT_LIMIT = 160
const SMS_HARD_WARN = 320

// ─── Shared helpers ────────────────────────────────────────────────────────────

const AVATAR_GREYS = ['grey.300', 'grey.400', 'grey.300', 'grey.400', 'grey.300', 'grey.400']
const AVATAR_DARK = 'grey.600'

function formatFileSize(bytes) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function Avatar1({ last, size = 32 }) {
  const letter = (last || '?')[0].toUpperCase()
  const idx = (last || '').charCodeAt(0) % 6
  return (
    <Box sx={{
      width: size, height: size, borderRadius: '50%',
      bgcolor: AVATAR_GREYS[idx], color: 'white',
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
      bgcolor: AVATAR_DARK, color: 'white',
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
    inapp: { label: 'Broadcast Channel', icon: <AppIcon sx={{ fontSize: 15 }} /> },
    email: { label: 'Email',             icon: <MailIcon sx={{ fontSize: 15 }} /> },
    sms:   { label: 'SMS',               icon: <SmsIcon  sx={{ fontSize: 15 }} /> },
  }[channel]
  const missed = totalRecipients > 0 ? totalRecipients - reachCount : 0
  return (
    <Tooltip title={totalRecipients > 0 && missed > 0 ? `${missed} recipient${missed > 1 ? 's' : ''} not reachable` : ''} placement="top">
      <Box onClick={onToggle} sx={{
        display: 'inline-flex', alignItems: 'center', gap: 0.5,
        px: 1.5, py: 0.75, borderRadius: 5,
        bgcolor: selected ? 'var(--color-primary)' : 'var(--color-secondary)',
        cursor: 'pointer', userSelect: 'none', transition: 'all 0.12s',
        '&:hover': { filter: 'brightness(0.95)' },
      }}>
        <Box sx={{ color: selected ? 'white' : 'text.secondary' }}>{meta.icon}</Box>
        <Typography variant="body2" fontWeight={selected ? 600 : 400} color={selected ? 'white' : 'text.secondary'}>
          {meta.label}
        </Typography>
        {totalRecipients > 0 && (
          <Typography variant="caption" sx={{ color: selected ? 'rgba(255,255,255,0.75)' : 'text.disabled' }}>{reachCount}</Typography>
        )}
      </Box>
    </Tooltip>
  )
}

// ─── Formatting toolbar ────────────────────────────────────────────────────────
function FormattingToolbar({ bodyRef, body, onBodyChange, onAddAttachments }) {
  const [linkAnchor, setLinkAnchor] = useState(null)
  const [linkUrl, setLinkUrl] = useState('')
  const savedSel = useRef({ start: 0, end: 0 })
  const fileInputRef = useRef(null)

  const wrap = (pre, suf = pre) => {
    const el = bodyRef.current; if (!el) return
    const { selectionStart: s, selectionEnd: e } = el
    const sel = body.slice(s, e)
    const ins = sel ? `${pre}${sel}${suf}` : `${pre}${suf}`
    onBodyChange(body.slice(0, s) + ins + body.slice(e))
    requestAnimationFrame(() => { el.focus(); const p = sel ? s + pre.length + sel.length + suf.length : s + pre.length; el.setSelectionRange(p, p) })
  }

  const handleBullets = () => {
    const el = bodyRef.current; if (!el) return
    const { selectionStart: s, selectionEnd: e } = el
    const sel = body.slice(s, e) || '\n'
    const pref = sel.split('\n').map(l => l.startsWith('- ') ? l.slice(2) : `- ${l}`).join('\n')
    onBodyChange(body.slice(0, s) + (body.slice(s, e) ? pref : '- ') + body.slice(e))
    requestAnimationFrame(() => { el.focus(); el.setSelectionRange(s, s + pref.length) })
  }

  const handleLinkOpen = (ev) => {
    const el = bodyRef.current
    if (el) savedSel.current = { start: el.selectionStart, end: el.selectionEnd }
    setLinkAnchor(ev.currentTarget); setLinkUrl('')
  }

  const handleLinkInsert = () => {
    if (!linkUrl.trim()) { setLinkAnchor(null); return }
    const el = bodyRef.current
    const { start: s, end: e } = savedSel.current
    const sel = body.slice(s, e)
    const ins = sel ? `[${sel}](${linkUrl})` : linkUrl
    onBodyChange(body.slice(0, s) + ins + body.slice(e))
    setLinkAnchor(null); setLinkUrl('')
    requestAnimationFrame(() => { if (el) { el.focus(); el.setSelectionRange(s + ins.length, s + ins.length) } })
  }

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files)
    if (files.length > 0) onAddAttachments(files)
    e.target.value = ''
  }

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept=".jpg,.jpeg,.png,.gif,.pdf,.doc,.docx,.xls,.xlsx"
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />
      <Box sx={{ display: 'flex', alignItems: 'center', px: 0.75, py: 0.25, bgcolor: 'grey.50', border: '1px solid', borderColor: 'var(--color-border-primary)', borderBottom: 'none', borderRadius: '4px 4px 0 0' }}>
        <Tooltip title="Bold" placement="top"><IconButton size="small" onClick={() => wrap('**')} sx={{ color: 'text.secondary' }}><BoldIcon sx={{ fontSize: 16 }} /></IconButton></Tooltip>
        <Tooltip title="Italic" placement="top"><IconButton size="small" onClick={() => wrap('_')} sx={{ color: 'text.secondary' }}><ItalicIcon sx={{ fontSize: 16 }} /></IconButton></Tooltip>
        <Tooltip title="Insert link" placement="top"><IconButton size="small" onClick={handleLinkOpen} sx={{ color: 'text.secondary' }}><LinkIcon sx={{ fontSize: 16 }} /></IconButton></Tooltip>
        <Tooltip title="Bullet list" placement="top"><IconButton size="small" onClick={handleBullets} sx={{ color: 'text.secondary' }}><BulletIcon sx={{ fontSize: 16 }} /></IconButton></Tooltip>
        <Box sx={{ width: '1px', height: 16, bgcolor: 'var(--color-border-primary)', mx: 0.5, flexShrink: 0 }} />
        <Tooltip title="Attach file" placement="top"><IconButton size="small" onClick={() => fileInputRef.current?.click()} sx={{ color: 'text.secondary' }}><AttachFileIcon sx={{ fontSize: 16 }} /></IconButton></Tooltip>
      </Box>
      <Popover open={Boolean(linkAnchor)} anchorEl={linkAnchor} onClose={() => setLinkAnchor(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }} transformOrigin={{ vertical: 'top', horizontal: 'left' }}
        PaperProps={{ sx: { p: 1.5, display: 'flex', gap: 1, alignItems: 'center', boxShadow: 3 } }}>
        <TextField variant="filled" size="small" placeholder="Paste a URL…" value={linkUrl}
          onChange={(e) => setLinkUrl(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') handleLinkInsert() }}
          autoFocus sx={{ width: 240 }} />
        <Box component="button" onClick={handleLinkInsert} sx={{ px: 1.5, py: 0.625, bgcolor: 'var(--color-primary)', color: 'white', border: 'none', borderRadius: 1, cursor: 'pointer', fontWeight: 600, fontSize: 13, whiteSpace: 'nowrap' }}>
          Insert
        </Box>
      </Popover>
    </>
  )
}

// ─── Recipient section ─────────────────────────────────────────────────────────
const SORT_LABELS = { az: 'A–Z', za: 'Z–A', recent: 'Recent' }

function RecipientSection({ title, items, selectedIds, onToggle, onSelectAll, onClearAll, teams = [], getLabelText }) {
  const [expanded, setExpanded]         = useState(false)
  const [query, setQuery]               = useState('')
  const [teamFilter, setTeamFilter]     = useState('all')
  const [sortOrder, setSortOrder]       = useState('az')
  const [filterAnchorEl, setFilterAnchorEl] = useState(null)
  const [sortAnchorEl, setSortAnchorEl]     = useState(null)

  const selectedInSection = useMemo(() => items.filter(i => selectedIds.has(i.id)), [items, selectedIds])
  const hasSelections = selectedInSection.length > 0

  const filtered = useMemo(() => {
    let result = items
    if (teamFilter !== 'all') result = result.filter(i => i.teamId === teamFilter)
    if (query.trim()) {
      const q = query.toLowerCase()
      result = result.filter(i => `${i.first} ${i.last}`.toLowerCase().includes(q) || (getLabelText ? getLabelText(i) : '').toLowerCase().includes(q))
    }
    result = [...result]
    if (sortOrder === 'az') result.sort((a, b) => `${a.last} ${a.first}`.localeCompare(`${b.last} ${b.first}`))
    else if (sortOrder === 'za') result.sort((a, b) => `${b.last} ${b.first}`.localeCompare(`${a.last} ${a.first}`))
    return result
  }, [items, query, teamFilter, sortOrder, getLabelText])

  const allSel  = filtered.length > 0 && filtered.every(i => selectedIds.has(i.id))
  const someSel = filtered.some(i => selectedIds.has(i.id)) && !allSel

  const handleSelectAll = () => { if (allSel) onClearAll(filtered.map(i => i.id)); else onSelectAll(filtered.map(i => i.id)) }
  const handleOpen  = () => { setExpanded(true);  setQuery(''); setTeamFilter('all') }
  const handleDone  = () => setExpanded(false)

  const teamLabel = teamFilter === 'all' ? 'All teams' : (teams.find(t => t.id === teamFilter)?.name || 'Team')
  const filterActive = teamFilter !== 'all'

  return (
    <Box>
      <Typography variant="subtitle2" fontWeight={600} sx={{ px: 2.5, pt: 2, pb: 1 }}>{title}</Typography>

      {!expanded && (
        <Box sx={{ px: 2.5 }}>
          <Box onClick={handleOpen} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 1.5, py: 1.125, bgcolor: 'rgba(0,0,0,0.06)', borderRadius: '4px 4px 0 0', borderBottom: '1px solid rgba(0,0,0,0.42)', cursor: 'pointer', '&:hover': { bgcolor: 'rgba(0,0,0,0.09)' } }}>
            <Typography variant="body2" color="text.disabled">Search</Typography>
            <DropdownIcon sx={{ fontSize: 20, color: 'text.secondary' }} />
          </Box>
        </Box>
      )}

      <Collapse in={expanded}>
        <Box sx={{ px: 2.5 }}>
          <TextField variant="filled" size="small" fullWidth placeholder="Search" value={query} onChange={(e) => setQuery(e.target.value)} autoFocus
            InputProps={{ endAdornment: <InputAdornment position="end"><IconButton size="small" onClick={handleDone} edge="end"><CloseIcon sx={{ fontSize: 16 }} /></IconButton></InputAdornment> }} />

          {/* Filter + Sort row */}
          {teams.length > 1 && (
            <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
              {/* Filter control */}
              <Box
                onClick={(e) => setFilterAnchorEl(e.currentTarget)}
                sx={{
                  flex: 1, display: 'flex', alignItems: 'center', gap: 0.75, minWidth: 0,
                  px: 1.25, py: 0.625, border: '1px solid',
                  borderColor: filterActive ? 'var(--color-primary)' : 'rgba(0,0,0,0.23)',
                  borderRadius: 1, cursor: 'pointer', bgcolor: 'transparent',
                  '&:hover': { borderColor: filterActive ? 'var(--color-primary)' : 'rgba(0,0,0,0.87)' },
                }}
              >
                <FilterListIcon sx={{ fontSize: 15, color: filterActive ? 'var(--color-primary)' : 'text.secondary', flexShrink: 0 }} />
                <Typography variant="body2" sx={{ flex: 1, fontSize: 13, color: filterActive ? 'var(--color-primary)' : 'text.secondary', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{teamLabel}</Typography>
                <DropdownIcon sx={{ fontSize: 16, color: 'text.disabled', flexShrink: 0 }} />
              </Box>
              <Menu anchorEl={filterAnchorEl} open={Boolean(filterAnchorEl)} onClose={() => setFilterAnchorEl(null)}>
                <MenuItem selected={teamFilter === 'all'} onClick={() => { setTeamFilter('all'); setFilterAnchorEl(null) }}>All teams</MenuItem>
                {teams.map(t => (
                  <MenuItem key={t.id} selected={teamFilter === t.id} onClick={() => { setTeamFilter(t.id); setFilterAnchorEl(null) }}>{t.name}</MenuItem>
                ))}
              </Menu>

              {/* Sort control */}
              <Box
                onClick={(e) => setSortAnchorEl(e.currentTarget)}
                sx={{
                  display: 'flex', alignItems: 'center', gap: 0.75, flexShrink: 0,
                  px: 1.25, py: 0.625, border: '1px solid rgba(0,0,0,0.23)',
                  borderRadius: 1, cursor: 'pointer', bgcolor: 'transparent',
                  '&:hover': { borderColor: 'rgba(0,0,0,0.87)' },
                }}
              >
                <SortIcon sx={{ fontSize: 15, color: 'text.secondary', flexShrink: 0 }} />
                <Typography variant="body2" sx={{ fontSize: 13, color: 'text.secondary', whiteSpace: 'nowrap' }}>Sort: {SORT_LABELS[sortOrder]}</Typography>
                <DropdownIcon sx={{ fontSize: 16, color: 'text.disabled', flexShrink: 0 }} />
              </Box>
              <Menu anchorEl={sortAnchorEl} open={Boolean(sortAnchorEl)} onClose={() => setSortAnchorEl(null)}>
                <MenuItem selected={sortOrder === 'az'}     onClick={() => { setSortOrder('az');     setSortAnchorEl(null) }}>A–Z</MenuItem>
                <MenuItem selected={sortOrder === 'za'}     onClick={() => { setSortOrder('za');     setSortAnchorEl(null) }}>Z–A</MenuItem>
                <MenuItem selected={sortOrder === 'recent'} onClick={() => { setSortOrder('recent'); setSortAnchorEl(null) }}>Recently added</MenuItem>
              </Menu>
            </Box>
          )}

          <Box sx={{ display: 'flex', alignItems: 'center', mt: 1, mb: 1 }}>
            <Box sx={{ display: 'inline-flex', alignItems: 'center', px: 1.5, py: 0.375, borderRadius: 10, bgcolor: 'var(--color-primary)', color: 'white', fontSize: 12, fontWeight: 600 }}>
              Selected ({selectedInSection.length})
            </Box>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 2.5, py: 0.75, borderTop: '1px solid var(--color-border-primary)', borderBottom: '1px solid var(--color-border-primary)' }}>
          <Typography variant="caption" fontWeight={500} color="text.secondary">All {title.toLowerCase()}</Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Typography variant="caption" color="text.secondary" sx={{ cursor: 'pointer', '&:hover': { color: 'var(--color-primary)' } }} onClick={handleSelectAll}>Select all</Typography>
            <Checkbox size="small" checked={allSel} indeterminate={someSel} onChange={handleSelectAll} sx={{ p: 0.25, '&.Mui-checked': { color: 'var(--color-primary)' }, '&.MuiCheckbox-indeterminate': { color: 'var(--color-primary)' } }} />
            <Box component="span" sx={{ mx: 0.25, color: 'divider', userSelect: 'none' }}>|</Box>
            <IconButton size="small" onClick={handleDone} sx={{ p: 0.25 }}><CollapseIcon sx={{ fontSize: 16, color: 'text.secondary' }} /></IconButton>
          </Box>
        </Box>

        <Box sx={{ maxHeight: 240, overflow: 'auto' }}>
          {filtered.map((item) => {
            const checked = selectedIds.has(item.id)
            const label   = getLabelText ? getLabelText(item) : ''
            return (
              <Box key={item.id} onClick={() => onToggle(item.id)} sx={{ display: 'flex', alignItems: 'center', gap: 1.5, px: 2.5, py: 1.125, borderBottom: '1px solid var(--color-border-primary)', cursor: 'pointer', '&:hover': { bgcolor: 'rgba(0,0,0,0.03)' }, bgcolor: checked ? 'rgba(59,73,96,0.04)' : 'transparent' }}>
                <Checkbox size="small" checked={checked} onChange={() => onToggle(item.id)} onClick={(e) => e.stopPropagation()} sx={{ p: 0.25, flexShrink: 0, '&.Mui-checked': { color: 'var(--color-primary)' } }} />
                <Avatar1 last={item.last} size={28} />
                <Typography variant="body2">{item.first} {item.last}</Typography>
                {label && <Typography variant="caption" color="text.disabled" sx={{ ml: 'auto', flexShrink: 0 }}>{label}</Typography>}
              </Box>
            )
          })}
          {filtered.length === 0 && <Box sx={{ px: 2.5, py: 2 }}><Typography variant="body2" color="text.disabled">No results</Typography></Box>}
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', px: 2.5, py: 1.25, borderTop: '1px solid var(--color-border-primary)' }}>
          <Box component="button" onClick={handleDone} sx={{ px: 2, py: 0.625, bgcolor: selectedInSection.length > 0 ? 'var(--color-primary)' : 'grey.300', color: selectedInSection.length > 0 ? 'white' : 'text.disabled', border: 'none', borderRadius: 1, cursor: selectedInSection.length > 0 ? 'pointer' : 'default', fontSize: 13, fontWeight: 600 }}>Done</Box>
        </Box>
      </Collapse>

      {!expanded && hasSelections && (
        <Box sx={{ mt: 0.5 }}>
          {selectedInSection.map((item) => (
            <Box key={item.id} sx={{ display: 'flex', alignItems: 'center', gap: 1.5, px: 2.5, py: 1, borderTop: '1px solid var(--color-border-primary)' }}>
              <Avatar2 last={item.last} first={item.first} size={36} />
              <Typography variant="body2" fontWeight={500} sx={{ flex: 1 }}>{item.last}, {item.first}</Typography>
              <IconButton size="small" onClick={() => onToggle(item.id)} sx={{ color: 'text.disabled', '&:hover': { color: 'error.main' } }}><RemoveIcon sx={{ fontSize: 18 }} /></IconButton>
            </Box>
          ))}
          <Box sx={{ px: 2.5, pb: 1 }}>
            <Box component="span" onClick={handleOpen} sx={{ fontSize: 12, color: 'var(--color-primary)', cursor: 'pointer', fontWeight: 600 }}>+ Add more {title.toLowerCase()}</Box>
          </Box>
        </Box>
      )}
      <Divider />
    </Box>
  )
}

// ─── Custom groups section trigger ────────────────────────────────────────────
function CustomGroupsSection({ selectedCount, onNavigate }) {
  return (
    <Box>
      <Typography variant="subtitle2" fontWeight={600} sx={{ px: 2.5, pt: 2, pb: 1 }}>Custom groups</Typography>
      <Box sx={{ px: 2.5 }}>
        <Box onClick={onNavigate} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 1.5, py: 1.125, bgcolor: 'rgba(0,0,0,0.06)', borderRadius: '4px 4px 0 0', borderBottom: '1px solid rgba(0,0,0,0.42)', cursor: 'pointer', '&:hover': { bgcolor: 'rgba(0,0,0,0.09)' } }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <GroupIcon sx={{ fontSize: 16, color: selectedCount > 0 ? 'var(--color-primary)' : 'text.disabled' }} />
            <Typography variant="body2" color={selectedCount > 0 ? 'var(--color-primary)' : 'text.disabled'}>
              {selectedCount > 0 ? `${selectedCount} selected via groups` : 'Browse groups'}
            </Typography>
          </Box>
          <ChevronRightIcon sx={{ fontSize: 20, color: 'text.secondary' }} />
        </Box>
      </Box>
      <Divider sx={{ mt: 1 }} />
    </Box>
  )
}

// ─── Custom groups list view ───────────────────────────────────────────────────
function CustomGroupsListView({ groups, clubData, selectedGroupMemberIds, onToggleGroup, onDrillIn, onCreateNew, onBack, clubName }) {
  return (
    <Box>
      {/* Back */}
      <Box onClick={onBack} sx={{ display: 'flex', alignItems: 'center', gap: 0.5, px: 2.5, py: 1.25, borderBottom: '1px solid var(--color-border-primary)', bgcolor: 'grey.50', cursor: 'pointer', '&:hover': { bgcolor: 'grey.100' } }}>
        <BackIcon sx={{ fontSize: 18, color: 'var(--color-primary)' }} />
        <Typography variant="body2" fontWeight={600} color="var(--color-primary)">{clubName} / Custom groups</Typography>
      </Box>

      {/* Create button */}
      <Box sx={{ px: 2.5, py: 1.5, borderBottom: '1px solid var(--color-border-primary)' }}>
        <Box component="button" onClick={onCreateNew} sx={{ display: 'flex', alignItems: 'center', gap: 0.75, width: '100%', bgcolor: 'var(--color-secondary)', border: 'none', borderRadius: 1, px: 1.5, py: 0.875, cursor: 'pointer', fontFamily: 'inherit', '&:hover': { filter: 'brightness(0.95)' } }}>
          <AddIcon sx={{ fontSize: 16, color: 'var(--color-primary)' }} />
          <Typography variant="body2" fontWeight={600} color="var(--color-primary)">+ Create new custom group</Typography>
        </Box>
      </Box>

      {/* Group rows */}
      {groups.map((group) => {
        const members   = resolveGroupMembers(group, clubData)
        const memberIds = members.map(m => m.id)
        const selCount  = memberIds.filter(id => selectedGroupMemberIds.has(id)).length
        const allChk    = selCount > 0 && selCount >= memberIds.length
        const someChk   = selCount > 0 && !allChk
        return (
          <Box key={group.id} sx={{ display: 'flex', alignItems: 'center', px: 2, py: 1.25, borderBottom: '1px solid var(--color-border-primary)', '&:hover': { bgcolor: 'rgba(0,0,0,0.02)' } }}>
            <Checkbox
              size="small" checked={allChk} indeterminate={someChk}
              onClick={(e) => { e.stopPropagation(); onToggleGroup(group.id, memberIds) }}
              onChange={() => {}}
              sx={{ p: 0.25, mr: 1, flexShrink: 0, '&.Mui-checked': { color: 'var(--color-primary)' }, '&.MuiCheckbox-indeterminate': { color: 'var(--color-primary)' } }}
            />
            <Box onClick={() => onDrillIn(group.id)} sx={{ flex: 1, cursor: 'pointer', overflow: 'hidden', mr: 1 }}>
              <Typography variant="body2" fontWeight={500} noWrap>{group.name}</Typography>
              <Typography variant="caption" color="text.disabled">
                {group.memberCount} members · Used {group.lastUsed}
                {selCount > 0 && ` · ${selCount} selected`}
              </Typography>
            </Box>
            <Box onClick={() => onDrillIn(group.id)} sx={{ display: 'flex', alignItems: 'center', gap: 0.25, cursor: 'pointer', flexShrink: 0, color: 'var(--color-primary)', '&:hover': { opacity: 0.75 } }}>
              <Typography variant="caption" fontWeight={600} color="var(--color-primary)">Select all</Typography>
              <ChevronRightIcon sx={{ fontSize: 16 }} />
            </Box>
          </Box>
        )
      })}

      {groups.length === 0 && (
        <Box sx={{ px: 2.5, py: 3, textAlign: 'center' }}>
          <Typography variant="body2" color="text.disabled">No custom groups yet</Typography>
        </Box>
      )}
    </Box>
  )
}

// ─── Custom group members view ─────────────────────────────────────────────────
function CustomGroupMembersView({ group, members, selectedGroupMemberIds, onToggle, onSelectAll, onClearAll, onBack }) {
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    if (!query.trim()) return members
    const q = query.toLowerCase()
    return members.filter(m => `${m.first} ${m.last}`.toLowerCase().includes(q) || (m.affiliation || '').toLowerCase().includes(q))
  }, [members, query])

  const allSel  = filtered.length > 0 && filtered.every(m => selectedGroupMemberIds.has(m.id))
  const someSel = filtered.some(m => selectedGroupMemberIds.has(m.id)) && !allSel
  const selCount = members.filter(m => selectedGroupMemberIds.has(m.id)).length

  const handleSelectAll = () => { if (allSel) onClearAll(filtered.map(m => m.id)); else onSelectAll(filtered.map(m => m.id)) }

  return (
    <Box>
      {/* Back */}
      <Box onClick={onBack} sx={{ display: 'flex', alignItems: 'center', gap: 0.5, px: 2.5, py: 1.25, borderBottom: '1px solid var(--color-border-primary)', bgcolor: 'grey.50', cursor: 'pointer', '&:hover': { bgcolor: 'grey.100' } }}>
        <BackIcon sx={{ fontSize: 18, color: 'var(--color-primary)' }} />
        <Typography variant="body2" fontWeight={600} color="var(--color-primary)" noWrap sx={{ flex: 1 }}>{group.name}</Typography>
      </Box>

      {/* Search + selected pill */}
      <Box sx={{ px: 2.5, pt: 1.5, pb: 1 }}>
        <TextField variant="filled" size="small" fullWidth placeholder="Search members…" value={query} onChange={(e) => setQuery(e.target.value)}
          InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon sx={{ fontSize: 18, color: 'text.disabled' }} /></InputAdornment> }} />
        <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
          <Box sx={{ display: 'inline-flex', alignItems: 'center', px: 1.5, py: 0.375, borderRadius: 10, bgcolor: 'var(--color-primary)', color: 'white', fontSize: 12, fontWeight: 600 }}>
            Selected ({selCount})
          </Box>
        </Box>
      </Box>

      {/* Select-all header */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 2.5, py: 0.75, borderTop: '1px solid var(--color-border-primary)', borderBottom: '1px solid var(--color-border-primary)' }}>
        <Typography variant="caption" fontWeight={500} color="text.secondary">All members</Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <Typography variant="caption" color="text.secondary" sx={{ cursor: 'pointer', '&:hover': { color: 'var(--color-primary)' } }} onClick={handleSelectAll}>Select all</Typography>
          <Checkbox size="small" checked={allSel} indeterminate={someSel} onChange={handleSelectAll} sx={{ p: 0.25, '&.Mui-checked': { color: 'var(--color-primary)' }, '&.MuiCheckbox-indeterminate': { color: 'var(--color-primary)' } }} />
        </Box>
      </Box>

      {/* Members list */}
      <Box sx={{ maxHeight: 360, overflow: 'auto' }}>
        {filtered.map((member) => {
          const checked = selectedGroupMemberIds.has(member.id)
          return (
            <Box key={member.id} onClick={() => onToggle(member.id)} sx={{ display: 'flex', alignItems: 'center', gap: 1.5, px: 2.5, py: 1.125, borderBottom: '1px solid var(--color-border-primary)', cursor: 'pointer', '&:hover': { bgcolor: 'rgba(0,0,0,0.03)' }, bgcolor: checked ? 'rgba(59,73,96,0.04)' : 'transparent' }}>
              <Checkbox size="small" checked={checked} onChange={() => onToggle(member.id)} onClick={(e) => e.stopPropagation()} sx={{ p: 0.25, flexShrink: 0, '&.Mui-checked': { color: 'var(--color-primary)' } }} />
              <Avatar1 last={member.last} size={28} />
              <Typography variant="body2">{member.first} {member.last}</Typography>
              {member.affiliation && <Typography variant="caption" color="text.disabled" sx={{ ml: 'auto', flexShrink: 0 }}>{member.affiliation}</Typography>}
            </Box>
          )
        })}
        {filtered.length === 0 && <Box sx={{ px: 2.5, py: 2 }}><Typography variant="body2" color="text.disabled">No results</Typography></Box>}
      </Box>
    </Box>
  )
}

// ─── Create custom group modal ─────────────────────────────────────────────────
function CreateCustomGroupModal({ open, onClose, clubId, clubData, onCreateGroup }) {
  const [groupName,  setGroupName]  = useState('')
  const [search,     setSearch]     = useState('')
  const [teamFilter, setTeamFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState('all')
  const [selectedIds, setSelectedIds] = useState(new Set())

  const clubName = mlsClubs.find(c => c.id === clubId)?.name || clubId

  const allContacts = useMemo(() => getAllClubContacts(clubData), [clubData])

  const filtered = useMemo(() => {
    let result = allContacts
    if (teamFilter !== 'all') result = result.filter(c => c.teamId === teamFilter)
    if (typeFilter !== 'all') result = result.filter(c => c.contactType === typeFilter)
    if (search.trim()) {
      const q = search.toLowerCase()
      result = result.filter(c => `${c.first} ${c.last}`.toLowerCase().includes(q) || (c.affiliation || '').toLowerCase().includes(q))
    }
    return result
  }, [allContacts, teamFilter, typeFilter, search])

  const selectedContacts = useMemo(() => allContacts.filter(c => selectedIds.has(c.id)), [allContacts, selectedIds])

  const toggle = (id) => setSelectedIds(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n })
  const removeSelected = (id) => setSelectedIds(prev => { const n = new Set(prev); n.delete(id); return n })

  const allFilteredSel  = filtered.length > 0 && filtered.every(c => selectedIds.has(c.id))
  const someFilteredSel = filtered.some(c => selectedIds.has(c.id)) && !allFilteredSel
  const handleSelectAll = () => {
    if (allFilteredSel) setSelectedIds(prev => { const n = new Set(prev); filtered.forEach(c => n.delete(c.id)); return n })
    else setSelectedIds(prev => { const n = new Set(prev); filtered.forEach(c => n.add(c.id)); return n })
  }

  const handleCreate = () => {
    if (!groupName.trim() || selectedIds.size === 0) return
    onCreateGroup({
      id:          `local-${Date.now()}`,
      clubId,
      name:        groupName.trim(),
      memberCount: selectedIds.size,
      lastUsed:    'Just now',
      memberIds:   [...selectedIds],
    })
    setGroupName(''); setSearch(''); setTeamFilter('all'); setTypeFilter('all'); setSelectedIds(new Set())
  }

  const handleClose = () => {
    setGroupName(''); setSearch(''); setTeamFilter('all'); setTypeFilter('all'); setSelectedIds(new Set())
    onClose()
  }

  const canCreate = groupName.trim().length > 0 && selectedIds.size > 0

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth={false}
      PaperProps={{ sx: { width: 680, maxHeight: '90vh', display: 'flex', flexDirection: 'column' } }}
    >
      {/* Header */}
      <Box sx={{ px: 3, py: 2, borderBottom: '1px solid var(--color-border-primary)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
        <Typography variant="subtitle1" fontWeight={700}>Create custom group</Typography>
        <IconButton size="small" onClick={handleClose}><CloseIcon /></IconButton>
      </Box>

      {/* Body — 2-column */}
      <Box sx={{ display: 'flex', flex: 1, overflow: 'hidden' }}>

        {/* Left: search + filter + results */}
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', borderRight: '1px solid var(--color-border-primary)', overflow: 'hidden' }}>

          {/* Name + club inputs */}
          <Box sx={{ px: 2.5, pt: 2, pb: 1.5, borderBottom: '1px solid var(--color-border-primary)', flexShrink: 0 }}>
            <TextField variant="filled" size="small" fullWidth label="Group name"
              placeholder="e.g. Travelling Party — Away to Orlando"
              value={groupName} onChange={(e) => setGroupName(e.target.value)} sx={{ mb: 1.5 }} />
            <TextField variant="filled" size="small" fullWidth label="Club" value={clubName}
              disabled InputProps={{ readOnly: true }} />
          </Box>

          {/* Search + filters */}
          <Box sx={{ px: 2.5, pt: 1.5, pb: 1, flexShrink: 0 }}>
            <TextField variant="filled" size="small" fullWidth label="Add members" placeholder="Search across all contacts in this club"
              value={search} onChange={(e) => setSearch(e.target.value)}
              InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon sx={{ fontSize: 18, color: 'text.disabled' }} /></InputAdornment> }}
              sx={{ mb: 1 }} />
            <Box sx={{ display: 'flex', gap: 1 }}>
              <FormControl variant="filled" size="small" sx={{ flex: 1 }}>
                <InputLabel>Team</InputLabel>
                <Select value={teamFilter} onChange={(e) => setTeamFilter(e.target.value)}>
                  <MenuItem value="all">All teams</MenuItem>
                  {clubData.teams.map(t => <MenuItem key={t.id} value={t.id}>{t.name}</MenuItem>)}
                </Select>
              </FormControl>
              <FormControl variant="filled" size="small" sx={{ flex: 1 }}>
                <InputLabel>Type</InputLabel>
                <Select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
                  <MenuItem value="all">All types</MenuItem>
                  <MenuItem value="athlete">Athletes</MenuItem>
                  <MenuItem value="staff">Staff</MenuItem>
                  <MenuItem value="guardian">Guardians</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Box>

          {/* Select-all row */}
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 2.5, py: 0.75, borderTop: '1px solid var(--color-border-primary)', borderBottom: '1px solid var(--color-border-primary)', flexShrink: 0 }}>
            <Typography variant="caption" color="text.secondary">{filtered.length} contacts shown</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Typography variant="caption" color="text.secondary" sx={{ cursor: 'pointer', '&:hover': { color: 'var(--color-primary)' } }} onClick={handleSelectAll}>Select all</Typography>
              <Checkbox size="small" checked={allFilteredSel} indeterminate={someFilteredSel} onChange={handleSelectAll}
                sx={{ p: 0.25, '&.Mui-checked': { color: 'var(--color-primary)' }, '&.MuiCheckbox-indeterminate': { color: 'var(--color-primary)' } }} />
            </Box>
          </Box>

          {/* Results list */}
          <Box sx={{ flex: 1, overflow: 'auto' }}>
            {filtered.map((contact) => {
              const checked = selectedIds.has(contact.id)
              return (
                <Box key={contact.id} onClick={() => toggle(contact.id)} sx={{ display: 'flex', alignItems: 'center', gap: 1.5, px: 2.5, py: 1, borderBottom: '1px solid var(--color-border-primary)', cursor: 'pointer', '&:hover': { bgcolor: 'rgba(0,0,0,0.03)' }, bgcolor: checked ? 'rgba(59,73,96,0.04)' : 'transparent' }}>
                  <Checkbox size="small" checked={checked} onChange={() => toggle(contact.id)} onClick={(e) => e.stopPropagation()} sx={{ p: 0.25, flexShrink: 0, '&.Mui-checked': { color: 'var(--color-primary)' } }} />
                  <Avatar1 last={contact.last} size={26} />
                  <Typography variant="body2">{contact.first} {contact.last}</Typography>
                  {contact.affiliation && <Typography variant="caption" color="text.disabled" sx={{ ml: 'auto', flexShrink: 0 }}>{contact.affiliation}</Typography>}
                </Box>
              )
            })}
            {filtered.length === 0 && <Box sx={{ px: 2.5, py: 3, textAlign: 'center' }}><Typography variant="body2" color="text.disabled">No contacts match</Typography></Box>}
          </Box>
        </Box>

        {/* Right: selected members panel */}
        <Box sx={{ width: 220, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <Box sx={{ px: 2, py: 1.5, borderBottom: '1px solid var(--color-border-primary)', flexShrink: 0 }}>
            <Box sx={{ display: 'inline-flex', alignItems: 'center', px: 1.25, py: 0.375, borderRadius: 10, bgcolor: selectedIds.size > 0 ? 'var(--color-primary)' : 'grey.200', color: selectedIds.size > 0 ? 'white' : 'text.disabled', fontSize: 12, fontWeight: 600 }}>
              {selectedIds.size} member{selectedIds.size !== 1 ? 's' : ''} selected
            </Box>
          </Box>
          <Box sx={{ flex: 1, overflow: 'auto' }}>
            {selectedContacts.map((contact) => (
              <Box key={contact.id} sx={{ display: 'flex', alignItems: 'center', gap: 1, px: 1.5, py: 0.875, borderBottom: '1px solid var(--color-border-primary)' }}>
                <Avatar1 last={contact.last} size={24} />
                <Typography variant="caption" fontWeight={500} sx={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{contact.first} {contact.last}</Typography>
                <IconButton size="small" onClick={() => removeSelected(contact.id)} sx={{ p: 0.125, flexShrink: 0, color: 'text.disabled', '&:hover': { color: 'error.main' } }}>
                  <CloseIcon sx={{ fontSize: 14 }} />
                </IconButton>
              </Box>
            ))}
            {selectedIds.size === 0 && (
              <Box sx={{ px: 2, py: 3, textAlign: 'center' }}>
                <Typography variant="caption" color="text.disabled">Select contacts from the list</Typography>
              </Box>
            )}
          </Box>
        </Box>
      </Box>

      {/* Footer */}
      <Box sx={{ px: 3, py: 2, borderTop: '1px solid var(--color-border-primary)', display: 'flex', justifyContent: 'flex-end', gap: 1.5, flexShrink: 0 }}>
        <Box component="button" onClick={handleClose} sx={{ px: 2.5, py: 0.875, bgcolor: 'var(--color-secondary)', border: 'none', borderRadius: 1, cursor: 'pointer', fontWeight: 600, fontSize: 14, color: 'var(--color-primary)', fontFamily: 'inherit' }}>
          Cancel
        </Box>
        <Box component="button" onClick={handleCreate} disabled={!canCreate} sx={{ px: 2.5, py: 0.875, bgcolor: canCreate ? 'var(--color-primary)' : 'grey.300', color: canCreate ? 'white' : 'text.disabled', border: 'none', borderRadius: 1, cursor: canCreate ? 'pointer' : 'not-allowed', fontWeight: 700, fontSize: 14, fontFamily: 'inherit' }}>
          Create custom group
        </Box>
      </Box>
    </Dialog>
  )
}

// ─── Clubs list view ───────────────────────────────────────────────────────────
function ClubsListView({ allSelectedIds, onDrillIn, onToggleClub }) {
  const selectedCountForClub = useCallback((clubId) =>
    [...allSelectedIds].filter(id => id.startsWith(clubId + '-')).length,
  [allSelectedIds])

  const handleSelectAll = () => mlsClubs.forEach(club => { if (selectedCountForClub(club.id) === 0) onToggleClub(club.id) })
  const handleClearAll  = () => mlsClubs.forEach(club => { if (selectedCountForClub(club.id) > 0)  onToggleClub(club.id) })

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 2.5, py: 1.25, borderBottom: '1px solid var(--color-border-primary)', bgcolor: 'grey.50' }}>
        <Typography variant="subtitle2" fontWeight={600}>Clubs</Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <Typography variant="caption" color="text.secondary" sx={{ cursor: 'pointer', '&:hover': { color: 'var(--color-primary)' } }} onClick={handleSelectAll}>Select all</Typography>
          <Box component="span" sx={{ mx: 0.25, color: 'divider', userSelect: 'none' }}>|</Box>
          <Typography variant="caption" color="text.secondary" sx={{ cursor: 'pointer', '&:hover': { color: 'var(--color-primary)' } }} onClick={handleClearAll}>Clear</Typography>
        </Box>
      </Box>

      {mlsClubs.map((club) => {
        const selCount    = selectedCountForClub(club.id)
        const checked     = selCount > 0
        const indeterminate = selCount > 0 && selCount < club.memberCount
        return (
          <Box key={club.id} sx={{ display: 'flex', alignItems: 'center', px: 2, py: 0.875, borderBottom: '1px solid var(--color-border-primary)', '&:hover': { bgcolor: 'rgba(0,0,0,0.02)' } }}>
            <Checkbox size="small" checked={checked && !indeterminate} indeterminate={indeterminate}
              onClick={(e) => { e.stopPropagation(); onToggleClub(club.id) }} onChange={() => {}}
              sx={{ p: 0.25, mr: 1, flexShrink: 0, '&.Mui-checked': { color: 'var(--color-primary)' }, '&.MuiCheckbox-indeterminate': { color: 'var(--color-primary)' } }}
            />
            <Box onClick={() => onDrillIn(club.id)} sx={{ flex: 1, display: 'flex', alignItems: 'center', cursor: 'pointer', gap: 1 }}>
              <Typography variant="body2" sx={{ flex: 1 }}>{club.name}</Typography>
              <Typography variant="caption" color="text.disabled" sx={{ flexShrink: 0 }}>
                {selCount > 0 ? `${selCount} selected` : `${club.memberCount} members`}
              </Typography>
              <ChevronRightIcon sx={{ fontSize: 18, color: 'text.disabled', flexShrink: 0 }} />
            </Box>
          </Box>
        )
      })}
    </Box>
  )
}

// ─── Club detail view ──────────────────────────────────────────────────────────
function ClubDetailView({
  clubId, clubData,
  selectedStaffIds, selectedAthleteIds, selectedGuardianIds, selectedGroupMemberIds,
  onToggleStaff, onSelectAllStaff, onClearAllStaff,
  onToggleAthlete, onSelectAllAthletes, onClearAllAthletes,
  onToggleGuardian, onSelectAllGuardians, onClearAllGuardians,
  onToggleGroupMember, onSelectAllGroupMembers, onClearAllGroupMembers,
  localCustomGroups, onGroupCreated,
  onBack,
}) {
  const [groupsView,       setGroupsView]       = useState(null) // null | 'list' | { type:'members', groupId }
  const [showCreateModal,  setShowCreateModal]   = useState(false)

  const club = mlsClubs.find(c => c.id === clubId) || { name: clubId }

  const groups = useMemo(() => [
    ...getCustomGroupsForClub(clubId),
    ...localCustomGroups.filter(g => g.clubId === clubId),
  ], [clubId, localCustomGroups])

  // Guardian teams — only those that have guardian data
  const guardianTeams = useMemo(() => {
    const ids = new Set(clubData.guardians.map(g => g.teamId))
    return clubData.teams.filter(t => ids.has(t.id))
  }, [clubData])

  const handleToggleGroup = (groupId, memberIds) => {
    const anySelected = memberIds.some(id => selectedGroupMemberIds.has(id))
    if (anySelected) onClearAllGroupMembers(memberIds)
    else onSelectAllGroupMembers(memberIds)
  }

  const handleGroupCreated = (newGroup) => {
    onGroupCreated(newGroup)
    setShowCreateModal(false)
    onSelectAllGroupMembers(newGroup.memberIds || [])
    setGroupsView('list')
  }

  // ── Group members sub-view
  if (groupsView && groupsView !== 'list') {
    const group   = groups.find(g => g.id === groupsView.groupId)
    const members = group ? resolveGroupMembers(group, clubData) : []
    return (
      <>
        <CustomGroupMembersView
          group={group || { name: 'Group', id: groupsView.groupId }}
          members={members}
          selectedGroupMemberIds={selectedGroupMemberIds}
          onToggle={onToggleGroupMember}
          onSelectAll={onSelectAllGroupMembers}
          onClearAll={onClearAllGroupMembers}
          onBack={() => setGroupsView('list')}
        />
        <CreateCustomGroupModal open={showCreateModal} onClose={() => setShowCreateModal(false)}
          clubId={clubId} clubData={clubData} onCreateGroup={handleGroupCreated} />
      </>
    )
  }

  // ── Groups list sub-view
  if (groupsView === 'list') {
    return (
      <>
        <CustomGroupsListView
          groups={groups}
          clubData={clubData}
          selectedGroupMemberIds={selectedGroupMemberIds}
          onToggleGroup={handleToggleGroup}
          onDrillIn={(groupId) => setGroupsView({ type: 'members', groupId })}
          onCreateNew={() => setShowCreateModal(true)}
          onBack={() => setGroupsView(null)}
          clubName={club.name}
        />
        <CreateCustomGroupModal open={showCreateModal} onClose={() => setShowCreateModal(false)}
          clubId={clubId} clubData={clubData} onCreateGroup={handleGroupCreated} />
      </>
    )
  }

  // ── Default: all 4 sections
  return (
    <>
      {/* Back to clubs list */}
      <Box onClick={onBack} sx={{ display: 'flex', alignItems: 'center', gap: 0.5, px: 2.5, py: 1.25, borderBottom: '1px solid var(--color-border-primary)', bgcolor: 'grey.50', cursor: 'pointer', '&:hover': { bgcolor: 'grey.100' } }}>
        <BackIcon sx={{ fontSize: 18, color: 'var(--color-primary)' }} />
        <Typography variant="body2" fontWeight={600} color="var(--color-primary)">{club.name}</Typography>
      </Box>

      <RecipientSection title="Staff" items={clubData.staff} selectedIds={selectedStaffIds}
        teams={clubData.teams} getLabelText={(item) => item.role}
        onToggle={onToggleStaff} onSelectAll={onSelectAllStaff} onClearAll={onClearAllStaff} />

      <RecipientSection title="Athletes" items={clubData.athletes} selectedIds={selectedAthleteIds}
        teams={clubData.teams} getLabelText={(item) => item.positionGroup || item.nationality || ''}
        onToggle={onToggleAthlete} onSelectAll={onSelectAllAthletes} onClearAll={onClearAllAthletes} />

      <RecipientSection title="Guardians" items={clubData.guardians} selectedIds={selectedGuardianIds}
        teams={guardianTeams} getLabelText={(item) => `Parent of ${item.linkedPlayerFirst} ${item.linkedPlayerLast}`}
        onToggle={onToggleGuardian} onSelectAll={onSelectAllGuardians} onClearAll={onClearAllGuardians} />

      <CustomGroupsSection
        selectedCount={selectedGroupMemberIds.size}
        onNavigate={() => setGroupsView('list')}
      />

      <CreateCustomGroupModal open={showCreateModal} onClose={() => setShowCreateModal(false)}
        clubId={clubId} clubData={clubData} onCreateGroup={handleGroupCreated} />
    </>
  )
}

// ─── Schedule section ──────────────────────────────────────────────────────────
const REPEAT_OPTIONS = [
  { value: 'none',    label: 'Does not repeat' },
  { value: 'daily',   label: 'Daily' },
  { value: 'weekly',  label: 'Weekly' },
  { value: 'monthly', label: 'Monthly' },
]

function ScheduleSection({ title, onTitleChange, startDate, onStartDateChange, endDate, onEndDateChange, sendTime, onSendTimeChange, repeat, onRepeatChange }) {
  return (
    <Box>
      <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1.5 }}>Schedule</Typography>
      <TextField variant="filled" size="small" fullWidth label="Title" value={title} onChange={(e) => onTitleChange(e.target.value)} sx={{ mb: 1.5 }} />
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
        <TextField variant="filled" size="small" type="date" label="Start date" value={startDate} onChange={(e) => onStartDateChange(e.target.value)} InputLabelProps={{ shrink: true }} inputProps={{ min: new Date().toISOString().split('T')[0] }} sx={{ flex: 1 }} />
        <Typography variant="body2" color="text.disabled">—</Typography>
        <TextField variant="filled" size="small" type="date" label="End date" value={endDate} onChange={(e) => onEndDateChange(e.target.value)} InputLabelProps={{ shrink: true }} inputProps={{ min: startDate || new Date().toISOString().split('T')[0] }} sx={{ flex: 1 }} />
      </Box>
      <Box sx={{ display: 'flex', gap: 1 }}>
        <TextField variant="filled" size="small" type="time" label="Send time" value={sendTime} onChange={(e) => onSendTimeChange(e.target.value)} InputLabelProps={{ shrink: true }} sx={{ flex: 1 }} />
        <FormControl variant="filled" size="small" sx={{ flex: 1 }}>
          <InputLabel>Repeat</InputLabel>
          <Select value={repeat} onChange={(e) => onRepeatChange(e.target.value)}>
            {REPEAT_OPTIONS.map(opt => <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>)}
          </Select>
        </FormControl>
      </Box>
    </Box>
  )
}

// ─── Slide transition for snackbar ────────────────────────────────────────────
function SlideLeft(props) {
  return <Slide {...props} direction="left" />
}

// ─── Main drawer ───────────────────────────────────────────────────────────────
export default function BlastMessageDrawer({ open, onClose, onSent, sourceEvent, athletes = [], staff = [] }) {
  const [step,    setStep]    = useState('recipients')
  const [clubNav, setClubNav] = useState({ level: 'clubs', clubId: null })

  // ─── Event-launched mode (conditional on sourceEvent; standalone flow above is untouched) ──
  const [eventRecipientIds, setEventRecipientIds] = useState(new Set())
  const [eventToExpanded,   setEventToExpanded]   = useState(false)

  const [selectedStaffIds,       setSelectedStaffIds]       = useState(new Set())
  const [selectedAthleteIds,     setSelectedAthleteIds]     = useState(new Set())
  const [selectedGuardianIds,    setSelectedGuardianIds]    = useState(new Set())
  const [selectedGroupMemberIds, setSelectedGroupMemberIds] = useState(new Set())

  const [localCustomGroups, setLocalCustomGroups] = useState([])

  const [selectedChannels,      setSelectedChannels]      = useState(new Set(['inapp', 'email']))
  const [broadcastChannelName,  setBroadcastChannelName]  = useState('')
  const [subject,               setSubject]               = useState('')
  const [subjectError,          setSubjectError]          = useState(false)
  const [body,                  setBody]                  = useState('')
  const [attachments,           setAttachments]           = useState([])

  const [showConfirmModal,  setShowConfirmModal]  = useState(false)
  const [snackbar,          setSnackbar]          = useState({ open: false, cancelled: false, count: 0 })

  const [scheduleOpen,      setScheduleOpen]      = useState(false)
  const [scheduleTitle,     setScheduleTitle]     = useState('')
  const [scheduleStartDate, setScheduleStartDate] = useState('')
  const [scheduleEndDate,   setScheduleEndDate]   = useState('')
  const [scheduleSendTime,  setScheduleSendTime]  = useState('')
  const [scheduleRepeat,    setScheduleRepeat]    = useState('none')

  const bodyInputRef = useRef(null)

  // resolve the source event's attendees against the passed-in athlete/staff master lists
  const eventRecipients = useMemo(() => {
    if (!sourceEvent) return []
    const ep = sourceEvent.extendedProps || {}
    const athleteRefs = ep.selectedAthletes || ep.attendeeIds || ep.attendees || []
    const staffRefs = ep.selectedStaff || ep.staffIds || ep.staff || []
    const resolved = []
    athleteRefs.forEach(a => {
      const id = (a && typeof a === 'object') ? a.id : a
      const found = athletes.find(x => String(x.id) === String(id))
      if (found) resolved.push({ key: `athlete-${id}`, name: `${found.firstname} ${found.lastname}`, last: found.lastname, org: found.organisation_name || found.organisation_id })
    })
    staffRefs.forEach(s => {
      const id = (s && typeof s === 'object') ? s.id : s
      const found = staff.find(x => String(x.id) === String(id))
      if (found) resolved.push({ key: `staff-${id}`, name: `${found.firstname} ${found.lastname}`, last: found.lastname, org: found.organisation_name || found.organisation_id })
    })
    return resolved
  }, [sourceEvent, athletes, staff])

  const eventRecipientsByOrg = useMemo(() => {
    const orgs = new Set(eventRecipients.map(r => r.org))
    if (orgs.size <= 1) return null
    const groups = {}
    eventRecipients.forEach(r => { (groups[r.org] = groups[r.org] || []).push(r) })
    return groups
  }, [eventRecipients])

  // pre-populate + reset compose fields whenever a new source event is opened
  useEffect(() => {
    if (sourceEvent) {
      setEventRecipientIds(new Set(eventRecipients.map(r => r.key)))
      setEventToExpanded(false)
      setSubject(`Update: ${sourceEvent.title || ''}`)
      setBody('')
      setAttachments([])
      setSelectedChannels(new Set(['email']))
      setScheduleOpen(false); setScheduleTitle(''); setScheduleStartDate(''); setScheduleEndDate(''); setScheduleSendTime(''); setScheduleRepeat('none')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sourceEvent])

  const toggleEventRecipient = (key) => setEventRecipientIds(prev => { const n = new Set(prev); n.has(key) ? n.delete(key) : n.add(key); return n })
  const eventRecipientCount = eventRecipientIds.size
  const canSendEventMessage = eventRecipientCount > 0 && subject.trim().length > 0

  const handleEventModeSend = () => {
    if (!canSendEventMessage) return
    onSent && onSent({ subject, body, channels: ['email'], reach: { total: eventRecipientCount, email: eventRecipientCount } })
    onClose()
  }
  const handleEventModeSaveDraft = () => { onClose() }

  const allSelectedIds = useMemo(
    () => new Set([...selectedStaffIds, ...selectedAthleteIds, ...selectedGuardianIds, ...selectedGroupMemberIds]),
    [selectedStaffIds, selectedAthleteIds, selectedGuardianIds, selectedGroupMemberIds]
  )
  const totalSelected = allSelectedIds.size
  const reach = useMemo(() => computeReachFromIds([...allSelectedIds]), [allSelectedIds])

  const currentClubData = useMemo(
    () => (clubNav.clubId ? getClubData(clubNav.clubId) : null),
    [clubNav.clubId]
  )

  // Staff
  const toggleStaff     = useCallback((id) => setSelectedStaffIds(p => { const n = new Set(p); n.has(id) ? n.delete(id) : n.add(id); return n }), [])
  const selectAllStaff  = useCallback((ids) => setSelectedStaffIds(p => { const n = new Set(p); ids.forEach(id => n.add(id)); return n }), [])
  const clearAllStaff   = useCallback((ids) => setSelectedStaffIds(p => { const n = new Set(p); ids.forEach(id => n.delete(id)); return n }), [])

  // Athletes
  const toggleAthlete     = useCallback((id) => setSelectedAthleteIds(p => { const n = new Set(p); n.has(id) ? n.delete(id) : n.add(id); return n }), [])
  const selectAllAthletes = useCallback((ids) => setSelectedAthleteIds(p => { const n = new Set(p); ids.forEach(id => n.add(id)); return n }), [])
  const clearAllAthletes  = useCallback((ids) => setSelectedAthleteIds(p => { const n = new Set(p); ids.forEach(id => n.delete(id)); return n }), [])

  // Guardians
  const toggleGuardian     = useCallback((id) => setSelectedGuardianIds(p => { const n = new Set(p); n.has(id) ? n.delete(id) : n.add(id); return n }), [])
  const selectAllGuardians = useCallback((ids) => setSelectedGuardianIds(p => { const n = new Set(p); ids.forEach(id => n.add(id)); return n }), [])
  const clearAllGuardians  = useCallback((ids) => setSelectedGuardianIds(p => { const n = new Set(p); ids.forEach(id => n.delete(id)); return n }), [])

  // Group members
  const toggleGroupMember     = useCallback((id) => setSelectedGroupMemberIds(p => { const n = new Set(p); n.has(id) ? n.delete(id) : n.add(id); return n }), [])
  const selectAllGroupMembers = useCallback((ids) => setSelectedGroupMemberIds(p => { const n = new Set(p); ids.forEach(id => n.add(id)); return n }), [])
  const clearAllGroupMembers  = useCallback((ids) => setSelectedGroupMemberIds(p => { const n = new Set(p); ids.forEach(id => n.delete(id)); return n }), [])

  // Club checkbox toggle
  const handleToggleClub = useCallback((clubId) => {
    const data       = getClubData(clubId)
    const staffIds   = data.staff.map(i => i.id)
    const athIds     = data.athletes.map(i => i.id)
    const grdIds     = data.guardians.map(i => i.id)
    const anySelected = staffIds.some(id => selectedStaffIds.has(id)) || athIds.some(id => selectedAthleteIds.has(id)) || grdIds.some(id => selectedGuardianIds.has(id))
    if (anySelected) { clearAllStaff(staffIds); clearAllAthletes(athIds); clearAllGuardians(grdIds) }
    else             { selectAllStaff(staffIds); selectAllAthletes(athIds); selectAllGuardians(grdIds) }
  }, [selectedStaffIds, selectedAthleteIds, selectedGuardianIds, selectAllStaff, clearAllStaff, selectAllAthletes, clearAllAthletes, selectAllGuardians, clearAllGuardians])

  const handleToggleChannel = (ch) => setSelectedChannels(prev => { const n = new Set(prev); n.has(ch) ? n.delete(ch) : n.add(ch); return n })

  const handleAddAttachments = useCallback((files) => {
    setAttachments(prev => [...prev, ...files.map(f => ({ file: f, id: `${Date.now()}-${Math.random()}` }))])
  }, [])

  const handleRemoveAttachment = useCallback((id) => {
    setAttachments(prev => prev.filter(a => a.id !== id))
  }, [])

  // Opens the confirmation modal (after validating subject)
  const handleSendClick = () => {
    if (selectedChannels.has('email') && !subject.trim()) {
      setSubjectError(true)
      return
    }
    setSubjectError(false)
    setShowConfirmModal(true)
  }

  // Resets all drawer state and closes it
  const resetAndClose = useCallback(() => {
    setStep('recipients'); setClubNav({ level: 'clubs', clubId: null })
    setSelectedStaffIds(new Set()); setSelectedAthleteIds(new Set())
    setSelectedGuardianIds(new Set()); setSelectedGroupMemberIds(new Set())
    setLocalCustomGroups([])
    setSelectedChannels(new Set(['inapp', 'email']))
    setBroadcastChannelName(''); setSubject(''); setSubjectError(false); setBody(''); setAttachments([])
    setScheduleOpen(false); setScheduleTitle(''); setScheduleStartDate(''); setScheduleEndDate(''); setScheduleSendTime(''); setScheduleRepeat('none')
    setShowConfirmModal(false)
    onClose()
  }, [onClose])

  // Called from confirmation modal
  const handleConfirmSend = () => {
    const count = reach.total || totalSelected
    onSent && onSent({ subject, body, channels: [...selectedChannels], reach })
    resetAndClose()
    setSnackbar({ open: true, cancelled: false, count })
  }

  const handleClose = () => resetAndClose()

  const charCount      = body.length
  const showSmsCounter = selectedChannels.has('sms')
  const smsColor       = charCount > SMS_HARD_WARN ? 'error.main' : charCount > SMS_SOFT_LIMIT ? 'warning.main' : 'text.disabled'
  const smsSegments    = Math.ceil(charCount / SMS_SOFT_LIMIT) || 1
  const stepSubLabel   = step === 'recipients' ? '1. Select recipients' : '2. Compose message'

  // ─── Event-launched compose UI — no stepper, no recipient-selection screen ──
  if (sourceEvent) {
    const fieldUnderlineSx = {
      '& .MuiFilledInput-root': {
        borderRadius: '4px 4px 0 0', backgroundColor: '#F3F4F7', boxShadow: 'none',
        borderBottom: '1px solid #B3BAC5',
        '&.Mui-focused': { boxShadow: 'none', borderBottom: '2px solid #172B4D' },
      },
      '& .MuiFilledInput-input::placeholder': { color: '#5F7089', opacity: 1, fontStyle: 'normal', fontWeight: 400, fontSize: 16 },
    }
    return (
      <Dialog open={open} onClose={onClose} PaperProps={{ sx: {
        width: 890, maxWidth: '92vw', borderRadius: '8px',
        display: 'flex', flexDirection: 'column', maxHeight: '85vh',
      } }}>
        <Box sx={{ px: 3, py: 2.5, borderBottom: '1px solid #E8EAED', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
          <Typography sx={{ fontSize: 20, fontWeight: 700, color: '#172B4D' }}>New Broadcast Message</Typography>
          <IconButton size="small" onClick={onClose}><CloseIcon sx={{ fontSize: 22, color: '#5F7089' }} /></IconButton>
        </Box>

        <Box sx={{ flex: 1, overflowY: 'auto' }}>
        <Box sx={{ px: 3, py: 2, borderBottom: '1px solid #E8EAED' }}>
          <Typography sx={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.5px', color: '#5F7089', textTransform: 'uppercase' }}>To</Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
            <Typography sx={{ fontSize: 15, color: '#172B4D' }}>{eventRecipientCount} recipients</Typography>
            <IconButton size="small" onClick={() => setEventToExpanded(v => !v)}>
              {eventToExpanded ? <CollapseIcon sx={{ fontSize: 18, color: '#5F7089' }} /> : <DropdownIcon sx={{ fontSize: 18, color: '#5F7089' }} />}
            </IconButton>
          </Box>
          <Collapse in={eventToExpanded}>
            <Box sx={{ mt: 1 }}>
              {(eventRecipientsByOrg ? Object.entries(eventRecipientsByOrg) : [[null, eventRecipients]]).map(([org, list]) => (
                <Box key={org || 'all'} sx={{ mb: org ? 1 : 0 }}>
                  {org && (
                    <Typography sx={{ fontSize: 13, fontWeight: 700, color: '#5F7089', textTransform: 'uppercase', py: 0.75 }}>{org}</Typography>
                  )}
                  {list.map((r, i) => (
                    <React.Fragment key={r.key}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, height: 44 }}>
                        <Checkbox checked={eventRecipientIds.has(r.key)} onChange={() => toggleEventRecipient(r.key)} sx={{ color: '#B4B8C0', '&.Mui-checked': { color: '#3B4960' } }} />
                        <Avatar1 last={r.last} size={28} />
                        <Typography sx={{ fontSize: 15, color: '#172B4D' }}>{r.name}</Typography>
                      </Box>
                      {i < list.length - 1 && <Divider sx={{ borderColor: '#E8EAED' }} />}
                    </React.Fragment>
                  ))}
                </Box>
              ))}
            </Box>
          </Collapse>
        </Box>

        <Box sx={{ px: 3, py: 2, borderBottom: '1px solid #E8EAED', display: 'flex', alignItems: 'center', gap: 1 }}>
          <MailIcon sx={{ fontSize: 20, color: '#3B4960' }} />
          <Typography sx={{ fontSize: 15, fontWeight: 600, color: '#172B4D' }}>Send via Email</Typography>
          <Typography sx={{ fontSize: 14, color: '#5F7089' }}>{eventRecipientCount} recipients</Typography>
        </Box>

        <Box sx={{ px: 3, py: 2.5 }}>
          <TextField variant="filled" fullWidth placeholder="Subject *" value={subject} onChange={(e) => setSubject(e.target.value)}
            sx={{ mb: 2, ...fieldUnderlineSx }} />

          <Typography sx={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.5px', color: '#5F7089', textTransform: 'uppercase', mb: 1 }}>Body</Typography>
          <FormattingToolbar bodyRef={bodyInputRef} body={body} onBodyChange={setBody} onAddAttachments={handleAddAttachments} />
          <TextField variant="filled" fullWidth multiline minRows={8} placeholder="Write your message..." value={body}
            onChange={(e) => setBody(e.target.value)} inputRef={bodyInputRef}
            sx={{
              ...fieldUnderlineSx,
              '& .MuiFilledInput-root': { ...fieldUnderlineSx['& .MuiFilledInput-root'], minHeight: 200, alignItems: 'flex-start', borderRadius: '0 0 4px 4px' },
            }} />
          {attachments.length > 0 && (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75, mt: 1 }}>
              {attachments.map((att) => (
                <Box key={att.id} sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5, px: 1, py: 0.5, bgcolor: 'grey.100', borderRadius: 1, border: '1px solid var(--color-border-primary)' }}>
                  <FileIcon sx={{ fontSize: 14, color: 'text.secondary', flexShrink: 0 }} />
                  <Typography variant="caption" fontWeight={500} sx={{ maxWidth: 130, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{att.file.name}</Typography>
                  <Typography variant="caption" color="text.disabled" sx={{ flexShrink: 0 }}>{formatFileSize(att.file.size)}</Typography>
                  <IconButton size="small" onClick={() => handleRemoveAttachment(att.id)} sx={{ p: 0, ml: 0.25, flexShrink: 0, color: 'text.disabled', '&:hover': { color: 'error.main' } }}>
                    <CloseIcon sx={{ fontSize: 13 }} />
                  </IconButton>
                </Box>
              ))}
            </Box>
          )}
          <Typography sx={{ fontSize: 13, color: '#5F7089', mt: 1 }}>Maximum attachment size: 25MB</Typography>

          <Box sx={{ mt: 2 }}>
            {!scheduleOpen ? (
              <Box component="button" onClick={() => setScheduleOpen(true)} sx={{
                display: 'flex', alignItems: 'center', gap: 0.75, bgcolor: '#F3F4F7', border: 'none', borderRadius: '6px',
                height: 40, px: 2, cursor: 'pointer', color: '#3B4960', fontFamily: 'inherit', fontWeight: 600, fontSize: 15,
                textTransform: 'none', '&:hover': { bgcolor: '#E8EAED' },
              }}>
                <AddIcon sx={{ fontSize: 16 }} /> Add schedule
              </Box>
            ) : (
              <ScheduleSection
                title={scheduleTitle} onTitleChange={setScheduleTitle}
                startDate={scheduleStartDate} onStartDateChange={setScheduleStartDate}
                endDate={scheduleEndDate} onEndDateChange={setScheduleEndDate}
                sendTime={scheduleSendTime} onSendTimeChange={setScheduleSendTime}
                repeat={scheduleRepeat} onRepeatChange={setScheduleRepeat}
              />
            )}
          </Box>
        </Box>
        </Box>

        <Box sx={{ px: 3, py: 3, borderTop: '1px solid #E8EAED', display: 'flex', justifyContent: 'flex-end', gap: 2, flexShrink: 0 }}>
          <Box component="button" onClick={handleEventModeSaveDraft} sx={{
            background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontSize: 15, fontWeight: 600, color: '#3B4960',
          }}>
            Save draft
          </Box>
          <Box component="button" disabled={!canSendEventMessage} onClick={handleEventModeSend} sx={{
            height: 52, px: 3, borderRadius: '6px', border: 'none', fontFamily: 'inherit',
            cursor: canSendEventMessage ? 'pointer' : 'not-allowed',
            bgcolor: canSendEventMessage ? '#3B4960' : '#E8EAED', color: canSendEventMessage ? '#fff' : '#5F7089',
            fontSize: 16, fontWeight: 600, textTransform: 'none',
          }}>
            Send
          </Box>
        </Box>
      </Dialog>
    )
  }

  return (
    <>
    <Drawer anchor="right" open={open} onClose={handleClose}
      sx={{ '& .MuiDrawer-paper': { width: DRAWER_WIDTH, boxShadow: '-4px 0 24px rgba(0,0,0,0.1)' } }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>

        {/* Header */}
        <Box sx={{ px: 2.5, py: 1.75, borderBottom: '1px solid var(--color-border-primary)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {step === 'compose' && <IconButton size="small" onClick={() => setStep('recipients')} sx={{ mr: 0.5 }}><BackIcon fontSize="small" /></IconButton>}
            <Box>
              <Typography variant="subtitle1" fontWeight={700} sx={{ lineHeight: 1.2 }}>Broadcast message</Typography>
              <Typography variant="caption" color="text.secondary" sx={{ lineHeight: 1 }}>{stepSubLabel}</Typography>
            </Box>
          </Box>
          <IconButton size="small" onClick={handleClose}><CloseIcon /></IconButton>
        </Box>

        {/* ─── STEP 1 ─── */}
        {step === 'recipients' && (
          <>
            <Box sx={{ flex: 1, overflow: 'auto' }}>
              {clubNav.level === 'clubs' ? (
                <ClubsListView allSelectedIds={allSelectedIds} onDrillIn={(id) => setClubNav({ level: 'club', clubId: id })} onToggleClub={handleToggleClub} />
              ) : (
                currentClubData && (
                  <ClubDetailView
                    clubId={clubNav.clubId}
                    clubData={currentClubData}
                    selectedStaffIds={selectedStaffIds}
                    selectedAthleteIds={selectedAthleteIds}
                    selectedGuardianIds={selectedGuardianIds}
                    selectedGroupMemberIds={selectedGroupMemberIds}
                    onToggleStaff={toggleStaff}       onSelectAllStaff={selectAllStaff}       onClearAllStaff={clearAllStaff}
                    onToggleAthlete={toggleAthlete}   onSelectAllAthletes={selectAllAthletes} onClearAllAthletes={clearAllAthletes}
                    onToggleGuardian={toggleGuardian} onSelectAllGuardians={selectAllGuardians} onClearAllGuardians={clearAllGuardians}
                    onToggleGroupMember={toggleGroupMember} onSelectAllGroupMembers={selectAllGroupMembers} onClearAllGroupMembers={clearAllGroupMembers}
                    localCustomGroups={localCustomGroups}
                    onGroupCreated={(g) => setLocalCustomGroups(prev => [g, ...prev])}
                    onBack={() => setClubNav({ level: 'clubs', clubId: null })}
                  />
                )
              )}
            </Box>

            <Box sx={{ px: 2.5, py: 2, borderTop: '1px solid var(--color-border-primary)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
              {totalSelected > 0 ? <Typography variant="caption" color="text.secondary">{totalSelected} selected</Typography> : <Box />}
              <Box component="button" disabled={totalSelected === 0} onClick={() => setStep('compose')} sx={{ display: 'flex', alignItems: 'center', gap: 0.75, px: 2.5, py: 1, bgcolor: totalSelected > 0 ? 'var(--color-primary)' : 'grey.300', color: totalSelected > 0 ? 'white' : 'text.disabled', border: 'none', borderRadius: 1, cursor: totalSelected > 0 ? 'pointer' : 'not-allowed', fontWeight: 700, fontSize: 14 }}>
                Next <Box component="span" sx={{ fontSize: 16, lineHeight: 1 }}>&rsaquo;</Box>
              </Box>
            </Box>
          </>
        )}

        {/* ─── STEP 2 ─── */}
        {step === 'compose' && (
          <>
            <Box sx={{ flex: 1, overflow: 'auto' }}>
              {/* Recipient summary */}
              <Box sx={{ px: 2.5, pt: 2, pb: 1.5, borderBottom: '1px solid var(--color-border-primary)' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                  {selectedStaffIds.size > 0       && <Box sx={{ display: 'inline-flex', alignItems: 'center', px: 1.25, py: 0.375, bgcolor: 'grey.100', borderRadius: 10 }}><Typography variant="caption" fontWeight={600}>{selectedStaffIds.size} staff</Typography></Box>}
                  {selectedAthleteIds.size > 0     && <Box sx={{ display: 'inline-flex', alignItems: 'center', px: 1.25, py: 0.375, bgcolor: 'grey.100', borderRadius: 10 }}><Typography variant="caption" fontWeight={600}>{selectedAthleteIds.size} athletes</Typography></Box>}
                  {selectedGuardianIds.size > 0    && <Box sx={{ display: 'inline-flex', alignItems: 'center', px: 1.25, py: 0.375, bgcolor: 'grey.100', borderRadius: 10 }}><Typography variant="caption" fontWeight={600}>{selectedGuardianIds.size} guardians</Typography></Box>}
                  {selectedGroupMemberIds.size > 0 && <Box sx={{ display: 'inline-flex', alignItems: 'center', px: 1.25, py: 0.375, bgcolor: 'grey.100', borderRadius: 10 }}><Typography variant="caption" fontWeight={600}>{selectedGroupMemberIds.size} via groups</Typography></Box>}
                  <Box component="span" onClick={() => setStep('recipients')} sx={{ fontSize: 12, color: 'var(--color-primary)', cursor: 'pointer', fontWeight: 600, ml: 0.5 }}>Edit</Box>
                </Box>
              </Box>

              {/* Send via */}
              <Box sx={{ px: 2.5, py: 2, borderBottom: '1px solid var(--color-border-primary)' }}>
                <Typography variant="caption" fontWeight={700} color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: 0.5, display: 'block', mb: 1.25 }}>Send via</Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  {['inapp', 'email', 'sms'].map((ch) => (
                    <ChannelChip key={ch} channel={ch} selected={selectedChannels.has(ch)} onToggle={() => handleToggleChannel(ch)}
                      reachCount={ch === 'inapp' ? reach.inApp : ch === 'email' ? reach.email : reach.sms}
                      totalRecipients={reach.total} />
                  ))}
                </Box>
                {/* Broadcast channel name input */}
                {selectedChannels.has('inapp') && (
                  <TextField
                    variant="filled" size="small"
                    label="Channel name"
                    placeholder='e.g. "First Team Updates"'
                    value={broadcastChannelName}
                    onChange={(e) => setBroadcastChannelName(e.target.value)}
                    sx={{ mt: 1.5, width: '100%', maxWidth: 280 }}
                  />
                )}
                {reach.total > 0 && selectedChannels.size > 0 && (
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                    {reach.total} recipients
                    {selectedChannels.has('inapp')  && ` · ${reach.inApp} broadcast`}
                    {selectedChannels.has('email') && ` · ${reach.email} email`}
                    {selectedChannels.has('sms')   && ` · ${reach.sms} SMS`}
                  </Typography>
                )}
              </Box>

              {/* Message */}
              <Box sx={{ px: 2.5, py: 2 }}>
                <Typography variant="caption" fontWeight={700} color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: 0.5, display: 'block', mb: 1.25 }}>Message</Typography>
                {selectedChannels.has('email') && (
                  <TextField
                    variant="filled" size="small" fullWidth
                    label="Subject"
                    placeholder="Enter a subject line…"
                    value={subject}
                    onChange={(e) => { setSubject(e.target.value); if (subjectError && e.target.value.trim()) setSubjectError(false) }}
                    error={subjectError}
                    helperText={subjectError ? 'Subject is required for emails.' : ''}
                    sx={{ mb: 1.5 }}
                  />
                )}
                <Box>
                  <FormattingToolbar bodyRef={bodyInputRef} body={body} onBodyChange={setBody} onAddAttachments={handleAddAttachments} />
                  <TextField variant="filled" size="small" fullWidth multiline rows={5} label="Message" placeholder="Write your message here…"
                    value={body} onChange={(e) => setBody(e.target.value)} inputRef={bodyInputRef}
                    sx={{ '& .MuiFilledInput-root': { borderRadius: '0 0 4px 4px' } }} />
                </Box>
                {/* Attachment chips */}
                {attachments.length > 0 && (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75, mt: 1 }}>
                    {attachments.map((att) => (
                      <Box key={att.id} sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5, px: 1, py: 0.5, bgcolor: 'grey.100', borderRadius: 1, border: '1px solid var(--color-border-primary)' }}>
                        <FileIcon sx={{ fontSize: 14, color: 'text.secondary', flexShrink: 0 }} />
                        <Typography variant="caption" fontWeight={500} sx={{ maxWidth: 130, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{att.file.name}</Typography>
                        <Typography variant="caption" color="text.disabled" sx={{ flexShrink: 0 }}>{formatFileSize(att.file.size)}</Typography>
                        <IconButton size="small" onClick={() => handleRemoveAttachment(att.id)} sx={{ p: 0, ml: 0.25, flexShrink: 0, color: 'text.disabled', '&:hover': { color: 'error.main' } }}>
                          <CloseIcon sx={{ fontSize: 13 }} />
                        </IconButton>
                      </Box>
                    ))}
                  </Box>
                )}
                {showSmsCounter && (
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 0.75 }}>
                    <Typography variant="caption" sx={{ color: smsColor }}>{charCount} / {SMS_SOFT_LIMIT} characters{smsSegments > 1 && ` · ${smsSegments} parts`}</Typography>
                    {charCount > SMS_SOFT_LIMIT && <Typography variant="caption" color="warning.main">Message may be split</Typography>}
                  </Box>
                )}
              </Box>

              {/* Schedule */}
              <Box sx={{ px: 2.5, pb: 2.5 }}>
                <Divider sx={{ mb: 2 }} />
                {!scheduleOpen ? (
                  <Box component="button" onClick={() => setScheduleOpen(true)} sx={{ display: 'flex', alignItems: 'center', gap: 0.75, bgcolor: 'var(--color-secondary)', border: 'none', borderRadius: 1, px: 1.5, py: 0.875, cursor: 'pointer', color: 'var(--color-primary)', fontFamily: 'inherit', '&:hover': { filter: 'brightness(0.95)' } }}>
                    <AddIcon sx={{ fontSize: 16 }} />
                    <Typography variant="body2" fontWeight={600} color="var(--color-primary)">Add schedule</Typography>
                  </Box>
                ) : (
                  <ScheduleSection
                    title={scheduleTitle} onTitleChange={setScheduleTitle}
                    startDate={scheduleStartDate} onStartDateChange={setScheduleStartDate}
                    endDate={scheduleEndDate} onEndDateChange={setScheduleEndDate}
                    sendTime={scheduleSendTime} onSendTimeChange={setScheduleSendTime}
                    repeat={scheduleRepeat} onRepeatChange={setScheduleRepeat}
                  />
                )}
              </Box>
            </Box>

            {/* Footer */}
            <Box sx={{ px: 2.5, py: 2, borderTop: '1px solid var(--color-border-primary)', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 1.5, flexShrink: 0 }}>
              {!body.trim() && <Typography variant="caption" color="text.disabled">Write a message to send</Typography>}
              <Box component="button" disabled={!body.trim() || selectedChannels.size === 0} onClick={handleSendClick}
                sx={{ px: 2.5, py: 1, bgcolor: body.trim() && selectedChannels.size > 0 ? 'var(--color-primary)' : 'grey.300', color: body.trim() && selectedChannels.size > 0 ? 'white' : 'text.disabled', border: 'none', borderRadius: 1, cursor: body.trim() && selectedChannels.size > 0 ? 'pointer' : 'not-allowed', fontWeight: 700, fontSize: 14 }}>
                Send now
              </Box>
            </Box>
          </>
        )}
      </Box>
    </Drawer>

    {/* ─── Confirmation modal ─────────────────────────────────────────────── */}
    <Dialog
      open={showConfirmModal}
      onClose={() => setShowConfirmModal(false)}
      PaperProps={{ sx: { width: 400, borderRadius: 2 } }}
    >
      <Box sx={{ px: 3, pt: 3, pb: 1 }}>
        <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 1.5 }}>Send broadcast message?</Typography>
        <Typography variant="body2" color="text.secondary">
          Are you sure you want to send this broadcast message to{' '}
          <Box component="span" fontWeight={700} color="text.primary">{reach.total || totalSelected} people</Box>?
        </Typography>
      </Box>
      <Box sx={{ px: 3, py: 2.5, display: 'flex', justifyContent: 'flex-end', gap: 1.5 }}>
        <Box component="button" onClick={() => setShowConfirmModal(false)} sx={{ px: 2.5, py: 0.875, bgcolor: 'var(--color-secondary)', border: 'none', borderRadius: 1, cursor: 'pointer', fontWeight: 600, fontSize: 14, color: 'var(--color-primary)', fontFamily: 'inherit' }}>
          Cancel
        </Box>
        <Box component="button" onClick={handleConfirmSend} sx={{ px: 2.5, py: 0.875, bgcolor: 'var(--color-primary)', color: 'white', border: 'none', borderRadius: 1, cursor: 'pointer', fontWeight: 700, fontSize: 14, fontFamily: 'inherit' }}>
          Confirm and send
        </Box>
      </Box>
    </Dialog>

    {/* ─── Success snackbar ───────────────────────────────────────────────── */}
    <Snackbar
      open={snackbar.open}
      autoHideDuration={8000}
      onClose={(_, reason) => { if (reason !== 'clickaway') setSnackbar(s => ({ ...s, open: false })) }}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      TransitionComponent={SlideLeft}
    >
      <Box sx={{
        display: 'flex', alignItems: 'center', gap: 1.5,
        bgcolor: snackbar.cancelled ? 'grey.800' : '#1e6e3d',
        color: 'white', px: 2, py: 1.25, borderRadius: 1.5,
        boxShadow: '0 4px 16px rgba(0,0,0,0.2)', minWidth: 320, maxWidth: 440,
      }}>
        <CheckCircleIcon sx={{ fontSize: 20, flexShrink: 0, opacity: 0.9 }} />
        <Typography variant="body2" fontWeight={500} sx={{ flex: 1, color: 'white' }}>
          {snackbar.cancelled
            ? 'Broadcast message cancelled.'
            : <>Broadcast message sent to <Box component="span" fontWeight={700}>{snackbar.count} people</Box>.</>
          }
        </Typography>
        {!snackbar.cancelled && (
          <Box
            component="button"
            onClick={() => setSnackbar({ open: true, cancelled: true, count: snackbar.count })}
            sx={{ bgcolor: 'transparent', border: 'none', color: 'rgba(255,255,255,0.85)', fontWeight: 700, fontSize: 13, cursor: 'pointer', px: 0.5, py: 0, textDecoration: 'underline', fontFamily: 'inherit', flexShrink: 0, '&:hover': { color: 'white' } }}
          >
            Cancel
          </Box>
        )}
        <IconButton
          size="small"
          onClick={() => setSnackbar(s => ({ ...s, open: false }))}
          sx={{ color: 'rgba(255,255,255,0.7)', p: 0.25, flexShrink: 0, '&:hover': { color: 'white', bgcolor: 'rgba(255,255,255,0.1)' } }}
        >
          <CloseIcon sx={{ fontSize: 16 }} />
        </IconButton>
      </Box>
    </Snackbar>
    </>
  )
}
