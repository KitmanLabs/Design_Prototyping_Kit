// Recipient view — what an external recipient sees after signing in. Read-only:
// a persistent preview banner + the reused multi-athlete accordion list. There
// are deliberately NO edit / approve / reject / share / back actions here.
import { athletes, infoCategories, currentClub, sharedRecordConfig } from '../data/mockData'
import MultiAthleteSharedView from '../components/MultiAthleteSharedView'
import Crest from '../components/Crest'
import './RecipientView.css'

// The shared bundle the recipient received (demo: first three athletes, all sections).
const sharedAthletes = athletes.slice(0, 3)

export default function RecipientView() {
  return (
    <div className="recipient">
      {/* Persistent read-only indicator — impossible to miss */}
      <div className="recipient__banner" role="status">
        <span className="material-icons-outlined">visibility</span>
        <span>
          You’re viewing a shared record <span className="recipient__banner-sep">·</span> Read-only
        </span>
      </div>

      {/* Minimal recipient header (no clinician nav) */}
      <header className="recipient__header">
        <div className="recipient__brand">
          <Crest size={26} />
          <span>NFL Medical</span>
        </div>
        <div className="recipient__shared-by">Shared by {currentClub.name}</div>
      </header>

      <main className="recipient__body">
        <h1 className="recipient__title">Shared player records</h1>
        <p className="recipient__subtitle">
          {sharedAthletes.length} players shared with you. Click a player to view their full record.
        </p>
        <MultiAthleteSharedView
          athletes={sharedAthletes}
          sections={infoCategories}
          allowComments={sharedRecordConfig.allowComments}
        />
      </main>
    </div>
  )
}
