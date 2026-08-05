// Basic edit drawer for a share row — duration + permission only.
// Styling reused from the Share Setup Drawer pattern (share-record-prototype-v2).
import { useState } from 'react'
import { permissions, shareDurations } from '../data/mockData'
import { IconButton, Field, SegmentedToggle, Select, Button } from './ui'
import './EditShareDrawer.css'

export default function EditShareDrawer({ share, onClose, onSave }) {
  const [permission, setPermission] = useState(share.permission)
  const [duration, setDuration] = useState(share.ongoing ? 'ongoing' : String(share.daysLeft ?? '30'))

  const handleSave = () => {
    onSave({ permission, duration })
    onClose()
  }

  return (
    <>
      <div className="drawer-backdrop" onClick={onClose} />
      <aside className="drawer" role="dialog" aria-label="Edit share">
        <header className="drawer__header">
          <h2>Edit share</h2>
          <IconButton icon="close" onClick={onClose} aria-label="Close" />
        </header>

        <div className="drawer__body">
          <section className="drawer__section">
            <div className="drawer__player">
              <div className="drawer__player-name">{share.player}</div>
              <div className="drawer__player-meta">{share.organization}</div>
            </div>
          </section>

          <section className="drawer__section">
            <h3 className="drawer__section-title">Access</h3>
            <Field label="Permission">
              <SegmentedToggle value={permission} onChange={setPermission} options={permissions} />
            </Field>
            <Field label="Share for">
              <Select value={duration} onChange={setDuration} options={shareDurations} placeholder="Select duration" />
            </Field>
          </section>
        </div>

        <footer className="drawer__footer">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSave}>
            Save changes
          </Button>
        </footer>
      </aside>
    </>
  )
}
