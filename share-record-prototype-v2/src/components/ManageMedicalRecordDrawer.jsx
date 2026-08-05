// Manage Medical Record drawer — reuses Share Setup drawer pattern/styling.
// Lists who this athlete's record has been shared with; each entry can be
// edited (permission + duration) or revoked.
import { useState } from 'react'
import { shareHistory, sharePermissions, shareDurations } from '../data/mockData'
import { Avatar, Button, IconButton, ConfirmDialog, Field, SegmentedToggle, Select, DateField } from './ui'
import './ShareSetupDrawer.css'
import './ManageMedicalRecordDrawer.css'

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const DURATION_DAYS = { '3d': 3, '7d': 7, '30d': 30 }

// "14 Feb 2026" -> "2026-02-14" (for the native date input's value)
function toInputDate(display) {
  const [d, mon, y] = display.split(' ')
  const mi = MONTHS.indexOf(mon)
  return `${y}-${String(mi + 1).padStart(2, '0')}-${d.padStart(2, '0')}`
}

// "2026-02-14" -> "14 Feb 2026"
function toDisplayDate(input) {
  const [y, m, d] = input.split('-')
  return `${parseInt(d, 10)} ${MONTHS[parseInt(m, 10) - 1]} ${y}`
}

// Recomputes the "until" date from the share's original date + a duration,
// or returns the hand-picked custom date.
function computeUntil(duration, sinceDisplay, customInputDate) {
  if (duration === 'custom') return customInputDate ? toDisplayDate(customInputDate) : sinceDisplay
  const [d, mon, y] = sinceDisplay.split(' ')
  const dt = new Date(`${mon} ${d}, ${y}`)
  dt.setDate(dt.getDate() + DURATION_DAYS[duration])
  return `${dt.getDate()} ${MONTHS[dt.getMonth()]} ${dt.getFullYear()}`
}

const permissionLabel = (value) => sharePermissions.find((p) => p.value === value)?.label || value

export default function ManageMedicalRecordDrawer({ athlete, onClose }) {
  const [shares, setShares] = useState(() => shareHistory[athlete?.id] || [])
  const [pendingRevoke, setPendingRevoke] = useState(null)
  const [editingId, setEditingId] = useState(null)
  const [editDraft, setEditDraft] = useState(null)

  if (!athlete) return null

  const confirmRevoke = () => {
    setShares((prev) => prev.filter((s) => s.id !== pendingRevoke.id))
    setPendingRevoke(null)
  }

  const startEdit = (s) => {
    setEditingId(s.id)
    setEditDraft({
      permission: s.permission,
      duration: s.duration,
      customDate: s.duration === 'custom' ? toInputDate(s.until) : '',
    })
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditDraft(null)
  }

  const saveEdit = (s) => {
    setShares((prev) =>
      prev.map((row) =>
        row.id === s.id
          ? {
              ...row,
              permission: editDraft.permission,
              duration: editDraft.duration,
              until: computeUntil(editDraft.duration, row.date, editDraft.customDate),
            }
          : row
      )
    )
    cancelEdit()
  }

  return (
    <>
      <div className="drawer-backdrop" onClick={onClose} />
      <aside className="drawer" role="dialog" aria-label="Manage medical record">
        <header className="drawer__header">
          <h2>Manage medical record</h2>
          <IconButton icon="close" onClick={onClose} aria-label="Close" />
        </header>

        <div className="drawer__body">
          <section className="drawer__section">
            <div className="drawer__athlete">
              <Avatar name={athlete.name} size={40} />
              <div>
                <div className="drawer__athlete-name">{athlete.name}</div>
                <div className="drawer__athlete-meta">
                  {athlete.rosterPosition} · {athlete.squads[0]}
                </div>
              </div>
            </div>
          </section>

          <section className="drawer__section">
            <h3 className="drawer__section-title">Shared with</h3>
            {shares.length === 0 && (
              <div className="mmr-empty">No active shares for this player.</div>
            )}
            {shares.map((s) => (
              <div className="mmr-item" key={s.id}>
                <div className="mmr-row">
                  <div>
                    <div className="mmr-row__physician">
                      Shared with {s.physician} · {permissionLabel(s.permission)} · until {s.until}
                    </div>
                    <div className="mmr-row__meta">{s.organization} · Shared {s.date}</div>
                  </div>
                  <div className="mmr-row__actions">
                    <Button variant="secondary" onClick={() => startEdit(s)}>
                      Edit
                    </Button>
                    <Button variant="secondary" onClick={() => setPendingRevoke(s)}>
                      Revoke
                    </Button>
                  </div>
                </div>

                {editingId === s.id && (
                  <div className="mmr-edit">
                    <Field label="Permission">
                      <SegmentedToggle
                        value={editDraft.permission}
                        onChange={(v) => setEditDraft((d) => ({ ...d, permission: v }))}
                        options={sharePermissions}
                      />
                    </Field>
                    <Field label="Share for">
                      <Select
                        value={editDraft.duration}
                        onChange={(v) =>
                          setEditDraft((d) => ({ ...d, duration: v, customDate: v === 'custom' ? d.customDate : '' }))
                        }
                        options={shareDurations}
                        placeholder="Select duration"
                      />
                    </Field>
                    {editDraft.duration === 'custom' && (
                      <Field label="Until">
                        <DateField
                          value={editDraft.customDate}
                          onChange={(v) => setEditDraft((d) => ({ ...d, customDate: v }))}
                          min={new Date().toISOString().slice(0, 10)}
                        />
                      </Field>
                    )}
                    <div className="mmr-edit__actions">
                      <Button variant="secondary" onClick={cancelEdit}>
                        Cancel
                      </Button>
                      <Button
                        variant="primary"
                        onClick={() => saveEdit(s)}
                        disabled={editDraft.duration === 'custom' && !editDraft.customDate}
                      >
                        Save
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </section>
        </div>
      </aside>

      <ConfirmDialog
        open={!!pendingRevoke}
        title="Revoke access?"
        message={
          pendingRevoke &&
          `${pendingRevoke.physician} at ${pendingRevoke.organization} will no longer have access to ${athlete.name}'s shared medical record.`
        }
        confirmLabel="Revoke"
        onConfirm={confirmRevoke}
        onCancel={() => setPendingRevoke(null)}
      />
    </>
  )
}
