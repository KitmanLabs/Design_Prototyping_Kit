// Step 1: Share Setup Drawer — right-side drawer opened from the athlete grid.
import { useNavigate } from 'react-router-dom'
import { useShare } from '../context/ShareContext'
import { physicians, organizations, infoCategories, sharePermissions, shareDurations } from '../data/mockData'
import {
  Avatar,
  Button,
  IconButton,
  Field,
  SearchableSelect,
  TextField,
  Checkbox,
  SegmentedToggle,
  Select,
  DateField,
} from './ui'
import './ShareSetupDrawer.css'

export default function ShareSetupDrawer() {
  const { drawerOpen, config, closeDrawer, updateConfig } = useShare()
  const navigate = useNavigate()

  if (!drawerOpen || config.athletes.length === 0) return null

  const isBulk = config.athletes.length > 1
  const single = config.athletes[0]

  const toggleCategory = (cat) =>
    updateConfig({
      categories: { ...config.categories, [cat]: !config.categories[cat] },
    })

  const canContinue =
    config.physician &&
    config.organization &&
    Object.values(config.categories).some(Boolean) &&
    (config.duration !== 'custom' || config.customDate)

  const handleContinue = () => {
    closeDrawer()
    navigate('/prepare')
  }

  return (
    <>
      <div className="drawer-backdrop" onClick={closeDrawer} />
      <aside className="drawer" role="dialog" aria-label="Share medical record">
        <header className="drawer__header">
          <h2>Share medical record</h2>
          <IconButton icon="close" onClick={closeDrawer} aria-label="Close" />
        </header>

        <div className="drawer__body">
          <section className="drawer__section">
            <div className="drawer__athlete">
              {isBulk ? (
                <>
                  <div className="drawer__avatar-stack">
                    {config.athletes.slice(0, 4).map((a) => (
                      <Avatar key={a.id} name={a.name} size={32} />
                    ))}
                  </div>
                  <div>
                    <div className="drawer__athlete-name">
                      {config.athletes.length} players selected
                    </div>
                    <div className="drawer__athlete-meta">
                      {config.athletes.map((a) => a.name).join(', ')}
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <Avatar name={single.name} size={40} />
                  <div>
                    <div className="drawer__athlete-name">{single.name}</div>
                    <div className="drawer__athlete-meta">
                      {single.rosterPosition} · {single.squads[0]}
                    </div>
                  </div>
                </>
              )}
            </div>
          </section>

          <section className="drawer__section">
            <h3 className="drawer__section-title">Recipient</h3>
            <Field label="Physician">
              <SearchableSelect
                value={config.physician}
                onChange={(v) => updateConfig({ physician: v })}
                options={physicians}
                placeholder="Select physician"
              />
            </Field>
            <Field label="Organization">
              <SearchableSelect
                value={config.organization}
                onChange={(v) => updateConfig({ organization: v })}
                options={organizations}
                placeholder="Select organization"
              />
            </Field>
            <Field label="Reason for sharing" optional>
              <TextField
                value={config.reason}
                onChange={(v) => updateConfig({ reason: v })}
                placeholder="Add a short reason…"
                multiline
              />
            </Field>
          </section>

          <section className="drawer__section">
            <h3 className="drawer__section-title">Access</h3>
            <Field label="Permission">
              <SegmentedToggle
                value={config.permission}
                onChange={(v) => updateConfig({ permission: v })}
                options={sharePermissions}
              />
            </Field>
            <Field label="Share for">
              <Select
                value={config.duration}
                onChange={(v) => updateConfig({ duration: v, customDate: v === 'custom' ? config.customDate : '' })}
                options={shareDurations}
                placeholder="Select duration"
              />
            </Field>
            {config.duration === 'custom' && (
              <Field label="Until">
                <DateField
                  value={config.customDate}
                  onChange={(v) => updateConfig({ customDate: v })}
                  min={new Date().toISOString().slice(0, 10)}
                />
              </Field>
            )}
          </section>

          <section className="drawer__section">
            <h3 className="drawer__section-title">Information to include</h3>
            <div className="drawer__categories">
              {infoCategories.map((cat) => (
                <Checkbox
                  key={cat}
                  label={cat}
                  checked={config.categories[cat]}
                  onChange={() => toggleCategory(cat)}
                />
              ))}
            </div>
          </section>

          <section className="drawer__section">
            <h3 className="drawer__section-title">Comments</h3>
            <Checkbox
              label="Allow comments"
              sublabel="Recipient can add a comment per athlete"
              checked={config.allowComments}
              onChange={() => updateConfig({ allowComments: !config.allowComments })}
            />
          </section>
        </div>

        <footer className="drawer__footer">
          <Button variant="secondary" onClick={closeDrawer}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleContinue} disabled={!canContinue}>
            Continue
          </Button>
        </footer>
      </aside>
    </>
  )
}
