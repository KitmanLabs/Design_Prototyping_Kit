// Sharing hub — central view of all athlete records shared externally.
import { useMemo, useState } from 'react'
import { shares as initialShares, recordTypes, permissions } from '../data/mockData'
import { Chip, IconButton, Select, TextField, Tooltip } from '../components/ui'
import Sidebar from '../components/Sidebar'
import EditShareDrawer from '../components/EditShareDrawer'
import './SharingHub.css'

const TABS = ['Active', 'Inactive']

function durationLabel(share) {
  if (share.ongoing) return 'Ongoing'
  if (share.daysLeft === 0) return 'Expired'
  return `${share.daysLeft} days left`
}

export default function SharingHub() {
  const [tab, setTab] = useState('Active')
  const [search, setSearch] = useState('')
  const [recordType, setRecordType] = useState('')
  const [permission, setPermission] = useState('')
  const [editingShare, setEditingShare] = useState(null)
  const [shares, setShares] = useState(initialShares)

  const rows = useMemo(() => {
    return shares.filter((s) => {
      if (tab === 'Active' ? !s.active : s.active) return false
      if (search && !s.player.toLowerCase().includes(search.toLowerCase()) && !s.organization.toLowerCase().includes(search.toLowerCase())) return false
      if (recordType && !s.sections.includes(recordType)) return false
      if (permission && s.permission !== permission) return false
      return true
    })
  }, [shares, tab, search, recordType, permission])

  const handleSaveEdit = (updates) => {
    setShares((prev) =>
      prev.map((s) =>
        s.id === editingShare.id
          ? {
              ...s,
              permission: updates.permission,
              ongoing: updates.duration === 'ongoing',
              daysLeft: updates.duration === 'ongoing' ? null : Number(updates.duration),
            }
          : s
      )
    )
  }

  return (
    <div className="hub">
      <Sidebar />
      <div className="hub__main">
        <div className="hub__topbar">
          <span className="material-icons-outlined hub__topbar-icon">share</span>
          <span className="hub__topbar-title">Sharing hub</span>
        </div>

        <div className="page">
          <div className="panel card">
            <div className="panel__header">
              <h1>Sharing hub</h1>
            </div>

            <div className="tabs">
              {TABS.map((t) => (
                <button
                  key={t}
                  className={`tab ${tab === t ? 'tab--active' : ''}`}
                  onClick={() => setTab(t)}
                >
                  {t}
                </button>
              ))}
            </div>

            <div className="filters">
              <div className="filters__control filters__control--search">
                <TextField value={search} onChange={setSearch} placeholder="Search player or organization" />
              </div>
              <div className="filters__control">
                <Select
                  value={recordType}
                  onChange={(v) => setRecordType(v === 'all' ? '' : v)}
                  options={[{ value: 'all', label: 'All record types' }, ...recordTypes.map((r) => ({ value: r, label: r }))]}
                  placeholder="Record type"
                />
              </div>
              <div className="filters__control">
                <Select
                  value={permission}
                  onChange={(v) => setPermission(v === 'all' ? '' : v)}
                  options={[{ value: 'all', label: 'All permissions' }, ...permissions.map((p) => ({ value: p, label: p }))]}
                  placeholder="Permission"
                />
              </div>
            </div>

            <div className="grid">
              <div className="grid__head">
                <div className="grid__cell grid__cell--player">Player</div>
                <div className="grid__cell grid__cell--sections">Shared sections</div>
                <div className="grid__cell">Organization</div>
                <div className="grid__cell">Comment</div>
                <div className="grid__cell">Duration</div>
                <div className="grid__cell">Permission</div>
                <div className="grid__cell grid__cell--actions" />
              </div>
              {rows.length === 0 && <div className="grid__empty">No shares to show.</div>}
              {rows.map((share) => (
                <div className="grid__row" key={share.id}>
                  <div className="grid__cell grid__cell--player">{share.player}</div>
                  <div className="grid__cell grid__cell--sections">
                    {share.sections.map((s) => (
                      <Chip key={s} label={s} />
                    ))}
                  </div>
                  <div className="grid__cell">{share.organization}</div>
                  <div className="grid__cell">
                    {share.comment && (
                      <Tooltip content={share.comment}>
                        <span className="comment-indicator">
                          <span className="material-icons-outlined comment-indicator__icon">chat_bubble_outline</span>
                          Comment received
                        </span>
                      </Tooltip>
                    )}
                  </div>
                  <div className="grid__cell">{durationLabel(share)}</div>
                  <div className="grid__cell">{share.permission}</div>
                  <div className="grid__cell grid__cell--actions">
                    <IconButton icon="edit" aria-label="Edit share" onClick={() => setEditingShare(share)} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {editingShare && (
        <EditShareDrawer
          share={editingShare}
          onClose={() => setEditingShare(null)}
          onSave={handleSaveEdit}
        />
      )}
    </div>
  )
}
