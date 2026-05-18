import React, { useState, useMemo, useCallback } from 'react'
import {
  Box,
  Typography,
  IconButton,
  Drawer,
  Avatar,
  Checkbox,
  Divider,
  TextField,
  Menu,
  MenuItem,
  InputAdornment,
  Tooltip,
} from '@mui/material'
import {
  CloseOutlined as CloseIcon,
  ChevronRightOutlined as ChevronRightIcon,
  ChevronLeftOutlined as ChevronLeftIcon,
  SearchOutlined as SearchIcon,
  ArrowDropDownOutlined as ArrowDropDownIcon,
  CheckCircleOutlined as CheckCircleIcon,
  MailOutlined as MailIcon,
  SmsOutlined as SmsIcon,
  NotificationsOutlined as AppIcon,
  ScheduleOutlined as ScheduleIcon,
  FilterListOutlined as FilterListIcon,
  SortByAlphaOutlined as SortByAlphaIcon,
  AddOutlined as AddIcon,
  GroupOutlined as GroupIcon,
} from '@mui/icons-material'
import {
  mlsClubs,
  atlClubData,
  blastCustomGroups,
  getAllIdsInTeam,
  getAllIdsInPositions,
  computeReachFromIds,
} from '../../data/blastMessaging'

const DRAWER_WIDTH = 520
const SMS_SOFT_LIMIT = 160
const SMS_HARD_WARN = 320

const PICKER_MODES = [
  { value: 'squads',      label: 'Squads' },
  { value: 'freeAgents',  label: 'Free Agents' },
  { value: 'historical',  label: 'Historical Athletes' },
  { value: 'staff',       label: 'Staff' },
  { value: 'customGroups',label: 'Custom Groups' },
]

const POSITION_ORDER = ['Goalkeeper', 'Defender', 'Midfielder', 'Forward']

// ─── Shared styles ─────────────────────────────────────────────────────────────
const ROW_SX = {
  display: 'flex',
  alignItems: 'center',
  gap: 1,
  px: 2,
  py: 1.25,
  cursor: 'pointer',
  borderBottom: '1px solid',
  borderBottomColor: 'rgba(0,0,0,0.06)',
  transition: 'background 0.1s',
  '&:hover': { bgcolor: 'rgba(0,0,0,0.03)' },
  userSelect: 'none',
}

// MUI theme palette slots used for avatar backgrounds — no hardcoded hex
const AVATAR_SLOTS = [
  { bg: 'primary.50',   fg: 'primary.800'   },
  { bg: 'warning.50',   fg: 'warning.800'   },
  { bg: 'success.50',   fg: 'success.800'   },
  { bg: 'error.50',     fg: 'error.800'     },
  { bg: 'secondary.50', fg: 'secondary.800' },
  { bg: 'info.50',      fg: 'info.800'      },
]
// Fallback to grey shades when a palette slot doesn't exist in this theme
const AVATAR_BG_FALLBACK = ['grey.100','grey.200','grey.300','grey.100','grey.200','grey.300']
const AVATAR_FG_FALLBACK = ['grey.700','grey.800','grey.900','grey.700','grey.800','grey.900']

function InitialsAvatar({ last, first, size = 32 }) {
  const initials = `${(last || '')[0] || ''}${(first || '')[0] || ''}`.toUpperCase() || '?'
  const idx = (last || '').charCodeAt(0) % 6
  return (
    <Box sx={{
      width: size, height: size, borderRadius: '50%',
      bgcolor: AVATAR_BG_FALLBACK[idx],
      color: AVATAR_FG_FALLBACK[idx],
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: size * 0.38, fontWeight: 700, flexShrink: 0, letterSpacing: -0.5,
    }}>
      {initials}
    </Box>
  )
}

// Status pill — uses var(--color-success) token for Available
function StatusPill({ label }) {
  const styles = {
    Available: { bgcolor: 'success.50',  color: 'success.800' },
    Injured:   { bgcolor: 'warning.50',  color: 'warning.800' },
    Away:      { bgcolor: 'info.50',     color: 'info.800'    },
  }
  const s = styles[label] || styles.Available
  return (
    <Box sx={{
      px: 1, py: 0.25, borderRadius: 10, fontSize: 11, fontWeight: 600, whiteSpace: 'nowrap', flexShrink: 0,
      bgcolor: 'rgba(46,125,50,0.1)', color: 'var(--color-success)',
    }}>
      {label}
    </Box>
  )
}

// Indeterminate / checked checkbox (rounded style)
function RoundCheckbox({ checked, indeterminate, onChange, onClick }) {
  return (
    <Checkbox
      checked={checked}
      indeterminate={indeterminate}
      onChange={onChange}
      onClick={onClick}
      size="small"
      sx={{
        p: 0.5,
        color: 'rgba(0,0,0,0.25)',
        '& .MuiSvgIcon-root': { borderRadius: 4 },
        '&.Mui-checked': { color: 'var(--color-primary)' },
        '&.MuiCheckbox-indeterminate': { color: 'var(--color-primary)' },
      }}
    />
  )
}

// ─── Clubs level ──────────────────────────────────────────────────────────────
function ClubsList({ selectedIds, onDrillIn, onSelectAll, onClearAll, search }) {
  const filtered = useMemo(() => {
    if (!search.trim()) return mlsClubs
    const q = search.toLowerCase()
    return mlsClubs.filter(c => c.name.toLowerCase().includes(q))
  }, [search])

  const getClubIds = (club) => {
    // For the populated club (ATL), derive real IDs; others use synthetic IDs
    if (club.id === 'atl') {
      return atlClubData.teams.flatMap(t => getAllIdsInTeam(t))
    }
    // Synthetic IDs for other clubs
    return Array.from({ length: club.memberCount }, (_, i) => `${club.id}-member-${i}`)
  }

  return (
    <Box sx={{ flex: 1, overflow: 'auto' }}>
      {filtered.map((club) => {
        const ids = getClubIds(club)
        const selectedCount = ids.filter(id => selectedIds.has(id)).length
        const allSelected = selectedCount === ids.length && ids.length > 0
        const partial = selectedCount > 0 && !allSelected
        return (
          <Box key={club.id} sx={ROW_SX}>
            <RoundCheckbox
              checked={allSelected}
              indeterminate={partial}
              onChange={(e) => {
                e.stopPropagation()
                allSelected ? onClearAll(ids) : onSelectAll(ids)
              }}
              onClick={(e) => e.stopPropagation()}
            />
            {/* Club colour swatch */}
            <Box sx={{ width: 6, height: 32, borderRadius: 3, bgcolor: club.color, flexShrink: 0 }} />
            <Box
              sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}
              onClick={() => onDrillIn(club)}
            >
              <Box>
                <Typography variant="body2" fontWeight={500}>{club.name}</Typography>
                <Typography variant="caption" color="text.secondary">
                  {selectedCount > 0 ? `${selectedCount} selected · ` : ''}{club.memberCount} members
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                {selectedCount > 0 && (
                  <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: 'var(--color-primary)' }} />
                )}
                <ChevronRightIcon sx={{ fontSize: 18, color: 'text.disabled' }} />
              </Box>
            </Box>
          </Box>
        )
      })}
    </Box>
  )
}

// ─── Club detail level (Teams + Staff sections) ────────────────────────────────
function ClubDetailLevel({ club, selectedIds, onDrillInTeam, onSelectAllInTeam, onClearAllInTeam }) {
  // We only have full data for ATL; others show skeleton rows
  const isPopulated = club.id === 'atl'
  const clubData = isPopulated ? atlClubData : null

  if (!isPopulated) {
    return (
      <Box sx={{ flex: 1, overflow: 'auto' }}>
        <Box sx={{ px: 2, py: 1.5 }}>
          <Typography variant="caption" fontWeight={700} color="text.disabled" sx={{ textTransform: 'uppercase', letterSpacing: 0.5 }}>
            Teams
          </Typography>
        </Box>
        {['First Team', `${club.abbr} 2`, 'Academy U-19', 'Academy U-17', 'Academy U-15'].map((name) => (
          <Box key={name} sx={{ ...ROW_SX, pl: 3 }}>
            <RoundCheckbox checked={false} />
            <Typography variant="body2" sx={{ flex: 1 }}>{name}</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Typography variant="caption" color="text.disabled">— members</Typography>
              <ChevronRightIcon sx={{ fontSize: 18, color: 'text.disabled' }} />
            </Box>
          </Box>
        ))}
        <Box sx={{ px: 2, py: 1.5, mt: 1 }}>
          <Typography variant="caption" fontWeight={700} color="text.disabled" sx={{ textTransform: 'uppercase', letterSpacing: 0.5 }}>
            Staff
          </Typography>
        </Box>
        {['Coaching', 'Medical', 'S&C', 'Admin', 'Ops'].map((name) => (
          <Box key={name} sx={{ ...ROW_SX, pl: 3 }}>
            <RoundCheckbox checked={false} />
            <Typography variant="body2" sx={{ flex: 1 }}>{name}</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Typography variant="caption" color="text.disabled">— members</Typography>
              <ChevronRightIcon sx={{ fontSize: 18, color: 'text.disabled' }} />
            </Box>
          </Box>
        ))}
      </Box>
    )
  }

  return (
    <Box sx={{ flex: 1, overflow: 'auto' }}>
      {/* Teams section */}
      <Box sx={{ px: 2, py: 1.5 }}>
        <Typography variant="caption" fontWeight={700} color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: 0.5 }}>
          Teams
        </Typography>
      </Box>
      {clubData.teams.map((team) => {
        const ids = getAllIdsInTeam(team)
        const selectedCount = ids.filter(id => selectedIds.has(id)).length
        const allSelected = selectedCount === ids.length && ids.length > 0
        const partial = selectedCount > 0 && !allSelected
        return (
          <Box key={team.id} sx={ROW_SX}>
            <RoundCheckbox
              checked={allSelected}
              indeterminate={partial}
              onChange={(e) => {
                e.stopPropagation()
                allSelected ? onClearAllInTeam(ids) : onSelectAllInTeam(ids)
              }}
              onClick={(e) => e.stopPropagation()}
            />
            <Box
              sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}
              onClick={() => onDrillInTeam(team)}
            >
              <Box>
                <Typography variant="body2" fontWeight={500}>{team.name}</Typography>
                <Typography variant="caption" color="text.secondary">
                  {selectedCount > 0 ? `${selectedCount} selected · ` : ''}{team.memberCount} players
                  <Box component="span" sx={{ ml: 1, color: 'var(--color-primary)', fontWeight: 600, cursor: 'pointer' }}>
                    Select all &rsaquo;
                  </Box>
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                {selectedCount > 0 && (
                  <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: 'var(--color-primary)' }} />
                )}
                <ChevronRightIcon sx={{ fontSize: 18, color: 'text.disabled' }} />
              </Box>
            </Box>
          </Box>
        )
      })}

      {/* Staff section */}
      <Box sx={{ px: 2, py: 1.5, mt: 1 }}>
        <Typography variant="caption" fontWeight={700} color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: 0.5 }}>
          Staff
        </Typography>
      </Box>
      {clubData.staffSections.map((section) => {
        const ids = Array.from({ length: section.memberCount }, (_, i) => `${section.id}-m${i}`)
        const selectedCount = ids.filter(id => selectedIds.has(id)).length
        const allSelected = selectedCount === ids.length && ids.length > 0
        const partial = selectedCount > 0 && !allSelected
        return (
          <Box key={section.id} sx={ROW_SX}>
            <RoundCheckbox
              checked={allSelected}
              indeterminate={partial}
              onChange={(e) => {
                e.stopPropagation()
                allSelected ? onClearAllInTeam(ids) : onSelectAllInTeam(ids)
              }}
              onClick={(e) => e.stopPropagation()}
            />
            <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box>
                <Typography variant="body2" fontWeight={500}>{section.name}</Typography>
                <Typography variant="caption" color="text.secondary">
                  {selectedCount > 0 ? `${selectedCount} selected · ` : ''}{section.memberCount} members
                  <Box component="span" sx={{ ml: 1, color: 'var(--color-primary)', fontWeight: 600, cursor: 'pointer' }}>
                    Select all &rsaquo;
                  </Box>
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                {selectedCount > 0 && (
                  <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: 'var(--color-primary)' }} />
                )}
              </Box>
            </Box>
          </Box>
        )
      })}
    </Box>
  )
}

// ─── Team / position level ─────────────────────────────────────────────────────
function TeamPositionLevel({ team, selectedIds, onToggle, onSelectAllInPosition, onClearAllInPosition }) {
  return (
    <Box sx={{ flex: 1, overflow: 'auto' }}>
      {POSITION_ORDER.filter(pos => team.positions[pos]?.length > 0).map((pos) => {
        const players = team.positions[pos]
        const ids = players.map(p => p.id)
        const selectedCount = ids.filter(id => selectedIds.has(id)).length
        const allSelected = selectedCount === ids.length
        const partial = selectedCount > 0 && !allSelected

        return (
          <Box key={pos}>
            {/* Position group header */}
            <Box sx={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              px: 2, py: 0.75, bgcolor: 'grey.50',
              borderBottom: '1px solid rgba(0,0,0,0.06)',
              borderTop: '1px solid rgba(0,0,0,0.06)',
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <RoundCheckbox
                  checked={allSelected}
                  indeterminate={partial}
                  onChange={() => allSelected ? onClearAllInPosition(ids) : onSelectAllInPosition(ids)}
                  onClick={(e) => e.stopPropagation()}
                />
                <Typography variant="caption" fontWeight={700} color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: 0.5 }}>
                  {pos}
                </Typography>
                <Typography variant="caption" color="text.disabled">({players.length})</Typography>
              </Box>
              <Box
                component="span"
                onClick={() => allSelected ? onClearAllInPosition(ids) : onSelectAllInPosition(ids)}
                sx={{ fontSize: 12, color: 'var(--color-primary)', fontWeight: 600, cursor: 'pointer' }}
              >
                {allSelected ? 'Clear' : 'Select all'}
              </Box>
            </Box>

            {/* Aggregate row */}
            <Box sx={{ ...ROW_SX, pl: 2, bgcolor: 'rgba(59,73,96,0.03)' }}>
              <RoundCheckbox
                checked={allSelected}
                indeterminate={partial}
                onChange={() => allSelected ? onClearAllInPosition(ids) : onSelectAllInPosition(ids)}
                onClick={(e) => e.stopPropagation()}
              />
              <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography variant="body2" color="text.secondary" fontStyle="italic">
                  Aggregate ({pos})
                </Typography>
                <Typography variant="caption" color="text.disabled">
                  {selectedCount}/{players.length}
                </Typography>
              </Box>
            </Box>

            {/* Individual players */}
            {players.map((player) => {
              const isSelected = selectedIds.has(player.id)
              return (
                <Box
                  key={player.id}
                  onClick={() => onToggle(player.id)}
                  sx={{ ...ROW_SX, pl: 2 }}
                >
                  <RoundCheckbox checked={isSelected} onChange={() => onToggle(player.id)} onClick={(e) => e.stopPropagation()} />
                  <InitialsAvatar last={player.last} first={player.first} size={32} />
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography variant="body2" fontWeight={isSelected ? 600 : 400} noWrap>
                      {player.last}, {player.first}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">{player.positionGroup || pos}</Typography>
                  </Box>
                  <StatusPill label={player.status || 'Available'} />
                </Box>
              )
            })}
          </Box>
        )
      })}
    </Box>
  )
}

// ─── Custom groups level ───────────────────────────────────────────────────────
function CustomGroupsLevel({ selectedGroupIds, onToggleGroup }) {
  return (
    <Box sx={{ flex: 1, overflow: 'auto' }}>
      {/* Create new group */}
      <Box sx={{
        ...ROW_SX,
        color: 'var(--color-primary)',
        borderBottom: '2px solid rgba(0,0,0,0.06)',
        mb: 0.5,
      }}>
        <Box sx={{ width: 32, height: 32, borderRadius: '50%', border: '1.5px dashed', borderColor: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <AddIcon sx={{ fontSize: 16 }} />
        </Box>
        <Typography variant="body2" fontWeight={600} color="var(--color-primary)">Create new group</Typography>
      </Box>

      {blastCustomGroups.map((group) => {
        const selected = selectedGroupIds.has(group.id)
        return (
          <Box
            key={group.id}
            onClick={() => onToggleGroup(group)}
            sx={{
              ...ROW_SX,
              bgcolor: selected ? 'rgba(59,73,96,0.05)' : 'transparent',
            }}
          >
            <RoundCheckbox checked={selected} onChange={() => onToggleGroup(group)} onClick={(e) => e.stopPropagation()} />
            <Box sx={{ width: 32, height: 32, borderRadius: 1, bgcolor: selected ? 'var(--color-primary)' : 'grey.100', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <GroupIcon sx={{ fontSize: 16, color: selected ? 'white' : 'text.secondary' }} />
            </Box>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography variant="body2" fontWeight={500} noWrap>{group.name}</Typography>
              <Typography variant="caption" color="text.secondary">
                {group.memberCount} members · {group.lastUsed}
              </Typography>
            </Box>
          </Box>
        )
      })}
    </Box>
  )
}

// Stub for unbuilt modes
function StubLevel({ label }) {
  return (
    <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', py: 6, color: 'text.disabled' }}>
      <GroupIcon sx={{ fontSize: 40, opacity: 0.2, mb: 1.5 }} />
      <Typography variant="body2" color="text.secondary" fontWeight={500}>{label}</Typography>
      <Typography variant="caption" color="text.disabled" sx={{ mt: 0.5 }}>Coming soon</Typography>
    </Box>
  )
}

// ─── Channel toggle chip ──────────────────────────────────────────────────────
function ChannelChip({ channel, selected, onToggle, reachCount, totalRecipients }) {
  const meta = {
    inapp: { label: 'In-app', icon: <AppIcon sx={{ fontSize: 15 }} /> },
    email: { label: 'Email',  icon: <MailIcon sx={{ fontSize: 15 }} /> },
    sms:   { label: 'SMS',    icon: <SmsIcon  sx={{ fontSize: 15 }} /> },
  }[channel]

  const missed = totalRecipients > 0 ? totalRecipients - reachCount : 0

  return (
    <Tooltip
      title={totalRecipients > 0 && missed > 0 ? `${missed} recipient${missed > 1 ? 's' : ''} not reachable on this channel` : ''}
      placement="top"
    >
      <Box
        onClick={onToggle}
        sx={{
          display: 'inline-flex', alignItems: 'center', gap: 0.5,
          px: 1.5, py: 0.75, borderRadius: 5, border: '1.5px solid',
          borderColor: selected ? 'var(--color-primary)' : 'var(--color-border-primary)',
          bgcolor: selected ? 'rgba(59,73,96,0.08)' : 'transparent',
          cursor: 'pointer', transition: 'all 0.15s', userSelect: 'none',
          '&:hover': { borderColor: 'var(--color-primary)', bgcolor: 'rgba(59,73,96,0.05)' },
        }}
      >
        <Box sx={{ color: selected ? 'var(--color-primary)' : 'text.disabled' }}>{meta.icon}</Box>
        <Typography variant="body2" fontWeight={selected ? 600 : 400} color={selected ? 'var(--color-primary)' : 'text.secondary'}>
          {meta.label}
        </Typography>
        {totalRecipients > 0 && (
          <Typography variant="caption" sx={{ ml: 0.25, color: selected ? 'var(--color-primary)' : 'text.disabled' }}>
            {reachCount}
          </Typography>
        )}
      </Box>
    </Tooltip>
  )
}

// ─── Confirmation step ─────────────────────────────────────────────────────────
function ConfirmationStep({ reach, selectedChannels, scheduledFor, onClose }) {
  const wasScheduled = Boolean(scheduledFor)
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1, p: 4, textAlign: 'center' }}>
      <Box sx={{ width: 72, height: 72, borderRadius: '50%', bgcolor: 'rgba(59,73,96,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 3 }}>
        {wasScheduled
          ? <ScheduleIcon sx={{ fontSize: 36, color: 'var(--color-primary)' }} />
          : <CheckCircleIcon sx={{ fontSize: 36, color: 'var(--color-primary)' }} />
        }
      </Box>
      <Typography variant="h6" fontWeight={700} sx={{ mb: 1 }}>
        {wasScheduled ? 'Message scheduled' : 'Message sent'}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3, maxWidth: 280 }}>
        {wasScheduled
          ? `Delivery scheduled for ${new Date(scheduledFor).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}.`
          : `Delivered to ${reach.total} recipients across ${[...selectedChannels].length} channel${[...selectedChannels].length > 1 ? 's' : ''}.`
        }
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
  // Picker navigation state: { level: 'clubs' | 'club' | 'team', club?, team? }
  const [pickerNav, setPickerNav] = useState({ level: 'clubs' })
  const [pickerMode, setPickerMode] = useState('squads')
  const [modeMenuAnchor, setModeMenuAnchor] = useState(null)
  const [search, setSearch] = useState('')

  // Selection state — flat Set of IDs that persists across navigation
  const [selectedIds, setSelectedIds] = useState(new Set())
  // Custom group selections
  const [selectedGroupIds, setSelectedGroupIds] = useState(new Set())
  const [selectedGroupData, setSelectedGroupData] = useState([])

  // Channel state
  const [selectedChannels, setSelectedChannels] = useState(new Set(['inapp', 'email']))

  // Compose state
  const [subject, setSubject] = useState('')
  const [body, setBody] = useState('')

  // Flow
  const [step, setStep] = useState('compose') // 'compose' | 'confirmed'

  // ─── Reach computation ────────────────────────────────────────────────────
  const totalSelected = pickerMode === 'customGroups'
    ? selectedGroupData.reduce((acc, g) => acc + g.memberCount, 0)
    : selectedIds.size

  const reach = useMemo(() => {
    if (pickerMode === 'customGroups') {
      return selectedGroupData.reduce((acc, g) => ({
        total: acc.total + g.memberCount,
        inApp: acc.inApp + g.reach.inApp,
        email: acc.email + g.reach.email,
        sms:   acc.sms   + g.reach.sms,
      }), { total: 0, inApp: 0, email: 0, sms: 0 })
    }
    return computeReachFromIds([...selectedIds])
  }, [selectedIds, pickerMode, selectedGroupData])

  // ─── Picker handlers ──────────────────────────────────────────────────────
  const selectAll = useCallback((ids) => {
    setSelectedIds(prev => {
      const next = new Set(prev)
      ids.forEach(id => next.add(id))
      return next
    })
  }, [])

  const clearAll = useCallback((ids) => {
    setSelectedIds(prev => {
      const next = new Set(prev)
      ids.forEach(id => next.delete(id))
      return next
    })
  }, [])

  const toggleId = useCallback((id) => {
    setSelectedIds(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }, [])

  const toggleGroup = useCallback((group) => {
    setSelectedGroupIds(prev => {
      const next = new Set(prev)
      if (next.has(group.id)) {
        next.delete(group.id)
        setSelectedGroupData(d => d.filter(g => g.id !== group.id))
      } else {
        next.add(group.id)
        setSelectedGroupData(d => [...d, group])
      }
      return next
    })
  }, [])

  const handleToggleChannel = (ch) => {
    setSelectedChannels(prev => {
      const next = new Set(prev)
      next.has(ch) ? next.delete(ch) : next.add(ch)
      return next
    })
  }

  // ─── Navigation helpers ───────────────────────────────────────────────────
  const goBack = () => {
    if (pickerNav.level === 'team') setPickerNav({ level: 'club', club: pickerNav.club })
    else if (pickerNav.level === 'club') setPickerNav({ level: 'clubs' })
  }

  const selectAllVisible = () => {
    if (pickerNav.level === 'clubs') {
      const ids = mlsClubs.flatMap(c =>
        c.id === 'atl' ? atlClubData.teams.flatMap(t => getAllIdsInTeam(t))
                       : Array.from({ length: c.memberCount }, (_, i) => `${c.id}-member-${i}`)
      )
      selectAll(ids)
    } else if (pickerNav.level === 'club' && pickerNav.club?.id === 'atl') {
      const ids = atlClubData.teams.flatMap(t => getAllIdsInTeam(t))
      selectAll(ids)
    } else if (pickerNav.level === 'team') {
      selectAll(getAllIdsInTeam(pickerNav.team))
    }
  }

  const clearAllVisible = () => {
    if (pickerNav.level === 'clubs') {
      setSelectedIds(new Set())
    } else if (pickerNav.level === 'club' && pickerNav.club?.id === 'atl') {
      clearAll(atlClubData.teams.flatMap(t => getAllIdsInTeam(t)))
    } else if (pickerNav.level === 'team') {
      clearAll(getAllIdsInTeam(pickerNav.team))
    }
  }

  // ─── Confirm send ─────────────────────────────────────────────────────────
  const handleSend = () => {
    setStep('confirmed')
    onSent && onSent({ subject, body, channels: [...selectedChannels], reach })
  }

  // ─── Reset on close ───────────────────────────────────────────────────────
  const handleClose = () => {
    setStep('compose')
    setPickerNav({ level: 'clubs' })
    setPickerMode('squads')
    setSearch('')
    setSelectedIds(new Set())
    setSelectedGroupIds(new Set())
    setSelectedGroupData([])
    setSelectedChannels(new Set(['inapp', 'email']))
    setSubject('')
    setBody('')
    onClose()
  }

  // ─── Breadcrumb label ─────────────────────────────────────────────────────
  const breadcrumb = useMemo(() => {
    if (pickerNav.level === 'clubs') return null
    if (pickerNav.level === 'club') return pickerNav.club?.name || ''
    if (pickerNav.level === 'team') return `${pickerNav.club?.name} — ${pickerNav.team?.name}`
    return null
  }, [pickerNav])

  // SMS counter
  const charCount = body.length
  const showSmsCounter = selectedChannels.has('sms')
  const smsColor = charCount > SMS_HARD_WARN ? 'error.main' : charCount > SMS_SOFT_LIMIT ? 'warning.main' : 'text.disabled'
  const smsSegments = Math.ceil(charCount / SMS_SOFT_LIMIT) || 1

  const currentModeLabel = PICKER_MODES.find(m => m.value === pickerMode)?.label || 'Squads'

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={handleClose}
      sx={{ '& .MuiDrawer-paper': { width: DRAWER_WIDTH, boxShadow: '-4px 0 24px rgba(0,0,0,0.1)' } }}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', bgcolor: 'var(--color-background-primary)' }}>

        {/* ── Drawer chrome header ── */}
        <Box sx={{
          px: 2.5, py: 1.75,
          borderBottom: '1px solid var(--color-border-primary)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          flexShrink: 0,
        }}>
          <Box>
            <Typography variant="subtitle1" fontWeight={700} lineHeight={1.25}>
              New blast message at LA Galaxy
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.25 }}>
              <InitialsAvatar last="Chen" first="Sofia" size={20} />
              <Typography variant="caption" color="text.secondary">Sofia Chen</Typography>
            </Box>
          </Box>
          <IconButton size="small" onClick={handleClose}><CloseIcon /></IconButton>
        </Box>

        {/* ── CONFIRMATION ── */}
        {step === 'confirmed' && (
          <ConfirmationStep
            reach={reach}
            selectedChannels={selectedChannels}
            scheduledFor={null}
            onClose={handleClose}
          />
        )}

        {/* ── COMPOSE ── */}
        {step === 'compose' && (
          <Box sx={{ flex: 1, overflow: 'auto', display: 'flex', flexDirection: 'column' }}>

            {/* ═══ RECIPIENT PICKER SECTION ═══ */}
            <Box sx={{ display: 'flex', flexDirection: 'column', borderBottom: '1px solid var(--color-border-primary)', minHeight: 0, flex: '0 0 auto', maxHeight: 460 }}>

              {/* Picker top toolbar */}
              <Box sx={{ px: 2, pt: 1.5, pb: 1, display: 'flex', alignItems: 'center', gap: 1, flexShrink: 0 }}>
                {/* Mode button */}
                <Box
                  onClick={(e) => setModeMenuAnchor(e.currentTarget)}
                  sx={{
                    display: 'flex', alignItems: 'center', gap: 0.25,
                    px: 1.25, py: 0.625,
                    border: '1px solid var(--color-border-primary)', borderRadius: 1,
                    cursor: 'pointer', bgcolor: 'white', flexShrink: 0,
                    '&:hover': { bgcolor: 'grey.50' },
                  }}
                >
                  <Typography variant="body2" fontWeight={600}>{currentModeLabel}</Typography>
                  <ArrowDropDownIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                </Box>

                {/* Search */}
                <TextField
                  variant="filled"
                  size="small"
                  placeholder="Search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  InputProps={{
                    startAdornment: <InputAdornment position="start"><SearchIcon sx={{ fontSize: 16 }} /></InputAdornment>,
                    disableUnderline: false,
                  }}
                  sx={{ flex: 1, '& .MuiInputBase-root': { pt: 0.25, pb: 0.25 }, '& input': { py: 0.5, fontSize: 13 } }}
                />

                {/* Filter + Sort icons */}
                <Tooltip title="Filter"><IconButton size="small"><FilterListIcon sx={{ fontSize: 18 }} /></IconButton></Tooltip>
                <Tooltip title="Sort A–Z"><IconButton size="small"><SortByAlphaIcon sx={{ fontSize: 18 }} /></IconButton></Tooltip>
              </Box>

              {/* Selected pill */}
              <Box sx={{ px: 2, pb: 1, display: 'flex', alignItems: 'center', gap: 1, flexShrink: 0 }}>
                <Box sx={{
                  display: 'inline-flex', alignItems: 'center', gap: 0.75,
                  px: 1.5, py: 0.375,
                  borderRadius: 10,
                  bgcolor: totalSelected > 0 ? 'var(--color-primary)' : 'grey.100',
                  color: totalSelected > 0 ? 'white' : 'text.disabled',
                  fontSize: 12, fontWeight: 600,
                }}>
                  {totalSelected > 0 && <CheckCircleIcon sx={{ fontSize: 14 }} />}
                  Selected {totalSelected}
                </Box>
                {totalSelected > 0 && (
                  <Box
                    component="span"
                    onClick={() => { setSelectedIds(new Set()); setSelectedGroupIds(new Set()); setSelectedGroupData([]) }}
                    sx={{ fontSize: 12, color: 'text.secondary', cursor: 'pointer', '&:hover': { color: 'error.main' } }}
                  >
                    Clear all
                  </Box>
                )}
              </Box>

              {/* Picker inner header — breadcrumb / Select All + Clear (clubs level) */}
              {pickerMode === 'squads' && (
                <Box sx={{
                  px: 2, py: 1,
                  bgcolor: 'grey.50',
                  borderTop: '1px solid rgba(0,0,0,0.06)',
                  borderBottom: '1px solid rgba(0,0,0,0.06)',
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  flexShrink: 0,
                }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    {pickerNav.level !== 'clubs' && (
                      <IconButton size="small" onClick={goBack} sx={{ mr: 0.25, p: 0.25 }}>
                        <ChevronLeftIcon sx={{ fontSize: 18 }} />
                      </IconButton>
                    )}
                    <Typography variant="caption" fontWeight={700} color="text.secondary" noWrap sx={{ maxWidth: 240 }}>
                      {pickerNav.level === 'clubs' ? 'MLS Clubs' : breadcrumb}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', gap: 1.5 }}>
                    <Box component="span" onClick={selectAllVisible}
                      sx={{ fontSize: 12, color: 'var(--color-primary)', fontWeight: 600, cursor: 'pointer' }}>
                      Select All
                    </Box>
                    <Box component="span" onClick={clearAllVisible}
                      sx={{ fontSize: 12, color: 'text.secondary', cursor: 'pointer', '&:hover': { color: 'error.main' } }}>
                      Clear
                    </Box>
                  </Box>
                </Box>
              )}

              {/* Picker body — scrollable list */}
              <Box sx={{ flex: 1, overflow: 'auto', minHeight: 200 }}>
                {pickerMode === 'squads' && pickerNav.level === 'clubs' && (
                  <ClubsList
                    selectedIds={selectedIds}
                    onDrillIn={(club) => setPickerNav({ level: 'club', club })}
                    onSelectAll={selectAll}
                    onClearAll={clearAll}
                    search={search}
                  />
                )}
                {pickerMode === 'squads' && pickerNav.level === 'club' && (
                  <ClubDetailLevel
                    club={pickerNav.club}
                    selectedIds={selectedIds}
                    onDrillInTeam={(team) => setPickerNav({ level: 'team', club: pickerNav.club, team })}
                    onSelectAllInTeam={selectAll}
                    onClearAllInTeam={clearAll}
                  />
                )}
                {pickerMode === 'squads' && pickerNav.level === 'team' && (
                  <TeamPositionLevel
                    team={pickerNav.team}
                    selectedIds={selectedIds}
                    onToggle={toggleId}
                    onSelectAllInPosition={selectAll}
                    onClearAllInPosition={clearAll}
                  />
                )}
                {pickerMode === 'customGroups' && (
                  <CustomGroupsLevel
                    selectedGroupIds={selectedGroupIds}
                    onToggleGroup={toggleGroup}
                  />
                )}
                {(pickerMode === 'freeAgents' || pickerMode === 'historical' || pickerMode === 'staff') && (
                  <StubLevel label={currentModeLabel} />
                )}
              </Box>

              {/* Next > button */}
              {totalSelected > 0 && (
                <Box sx={{ px: 2, py: 1.25, borderTop: '1px solid rgba(0,0,0,0.08)', display: 'flex', justifyContent: 'flex-end', flexShrink: 0 }}>
                  <Box
                    component="button"
                    sx={{
                      px: 2.5, py: 0.875,
                      bgcolor: 'var(--color-primary)', color: 'white',
                      border: 'none', borderRadius: 1, cursor: 'pointer',
                      fontWeight: 700, fontSize: 13, display: 'flex', alignItems: 'center', gap: 0.5,
                    }}
                  >
                    Next &rsaquo;
                  </Box>
                </Box>
              )}
            </Box>

            {/* ═══ SEND VIA SECTION ═══ */}
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

            {/* ═══ MESSAGE SECTION ═══ */}
            <Box sx={{ px: 2.5, py: 2, flex: 1 }}>
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
                label="Message body"
                placeholder="Write your message here…"
                value={body}
                onChange={(e) => setBody(e.target.value)}
              />

              {showSmsCounter && (
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 0.75 }}>
                  <Typography variant="caption" sx={{ color: smsColor }}>
                    {charCount} / {SMS_SOFT_LIMIT} characters
                    {smsSegments > 1 && ` · ${smsSegments} parts`}
                  </Typography>
                  {charCount > SMS_SOFT_LIMIT && (
                    <Typography variant="caption" color="warning.main">
                      Message may be split
                    </Typography>
                  )}
                </Box>
              )}
            </Box>

            {/* ═══ FOOTER — reserved for scheduling controls ═══ */}
            <Box sx={{ px: 2.5, pt: 2, pb: 2.5, borderTop: '1px solid var(--color-border-primary)', flexShrink: 0, minHeight: 60 }}>
              {/* Scheduling controls will be added here in next iteration */}
            </Box>
          </Box>
        )}
      </Box>

      {/* Mode dropdown menu */}
      <Menu
        anchorEl={modeMenuAnchor}
        open={Boolean(modeMenuAnchor)}
        onClose={() => setModeMenuAnchor(null)}
        PaperProps={{ sx: { minWidth: 180 } }}
      >
        {PICKER_MODES.map((mode) => (
          <MenuItem
            key={mode.value}
            selected={pickerMode === mode.value}
            onClick={() => {
              setPickerMode(mode.value)
              setPickerNav({ level: 'clubs' })
              setSearch('')
              setModeMenuAnchor(null)
            }}
            sx={{ fontSize: 14, fontWeight: pickerMode === mode.value ? 600 : 400 }}
          >
            {mode.label}
          </MenuItem>
        ))}
      </Menu>
    </Drawer>
  )
}
