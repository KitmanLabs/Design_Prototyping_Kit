// Multi-athlete shared view — used when more than one athlete is shared together.
// A data grid, one row per athlete; clicking a name drills into that athlete's
// full Athlete Overview (back link returns to the grid).
import { useState } from 'react'
import { Avatar } from './ui'
import { sampleRecords } from '../data/mockData'
import AthleteOverview from './AthleteOverview'
import './MultiAthleteSharedView.css'

function athleteItemCount(sections) {
  return sections.reduce((total, c) => total + (sampleRecords[c]?.length || 0), 0)
}

export default function MultiAthleteSharedView({ athletes, sections, allowComments = false }) {
  const [selected, setSelected] = useState(null)

  if (selected) {
    return (
      <div className="msv-detail">
        <button className="msv-detail__back" onClick={() => setSelected(null)}>
          <span className="material-icons-outlined">arrow_back</span>
          Back to all players
        </button>
        <AthleteOverview athlete={selected} sections={sections} allowComments={allowComments} />
      </div>
    )
  }

  return (
    <div className="msv-grid card">
      <div className="msv-grid__head">
        <div className="msv-grid__cell msv-grid__cell--name">Player</div>
        <div className="msv-grid__cell">Roster position</div>
        <div className="msv-grid__cell msv-grid__cell--count">Items</div>
      </div>
      {athletes.map((athlete) => (
        <div
          className="msv-grid__row"
          key={athlete.id}
          role="button"
          tabIndex={0}
          onClick={() => setSelected(athlete)}
          onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && setSelected(athlete)}
        >
          <div className="msv-grid__cell msv-grid__cell--name">
            <Avatar name={athlete.name} size={32} />
            <span className="msv-grid__name">{athlete.name}</span>
          </div>
          <div className="msv-grid__cell">{athlete.rosterPosition}</div>
          <div className="msv-grid__cell msv-grid__cell--count">{athleteItemCount(sections)} items</div>
        </div>
      ))}
    </div>
  )
}
