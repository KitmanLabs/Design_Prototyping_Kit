// Step 1: Share Setup Drawer — right-side drawer opened from the athlete grid.
import { useNavigate } from 'react-router-dom'
import { useShare } from '../context/ShareContext'
import { physicians, organizations, infoCategories } from '../data/mockData'
import {
  Avatar,
  Button,
  IconButton,
  Field,
  SearchableSelect,
  TextField,
  Checkbox,
} from './ui'
import './ShareSetupDrawer.css'

export default function ShareSetupDrawer() {
  const { drawerOpen, config, closeDrawer, updateConfig } = useShare()
  const navigate = useNavigate()

  if (!drawerOpen || !config.athlete) return null

  const toggleCategory = (cat) =>
    updateConfig({
      categories: { ...config.categories, [cat]: !config.categories[cat] },
    })

  const canContinue =
    config.physician &&
    config.organization &&
    Object.values(config.categories).some(Boolean)

  const handleContinue = () => {
    closeDrawer()
    navigate('/prepare')
  }

  return (
    <>
      <div className="drawer-backdrop" onClick={closeDrawer} />
      <aside className="drawer" role="dialog" aria-label="Share record">
        <header className="drawer__header">
          <h2>Share record</h2>
          <IconButton icon="close" onClick={closeDrawer} aria-label="Close" />
        </header>

        <div className="drawer__body">
          <section className="drawer__section">
            <div className="drawer__athlete">
              <Avatar name={config.athlete.name} size={40} />
              <div>
                <div className="drawer__athlete-name">{config.athlete.name}</div>
                <div className="drawer__athlete-meta">
                  {config.athlete.rosterPosition} · {config.athlete.squads[0]}
                </div>
              </div>
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
