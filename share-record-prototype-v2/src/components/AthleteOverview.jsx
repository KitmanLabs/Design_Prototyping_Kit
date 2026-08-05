// Athlete Overview layout — the canonical profile structure (bio header + tabs +
// section cards). Used by Prepare Shared Record in read-only PREVIEW mode: only
// the categories selected in the Share Record drawer are passed in as `sections`,
// so deselected sections never render (no empty tabs).
import { useState, useEffect } from 'react'
import { Avatar, Chip, StatusChip, Field, TextField } from './ui'
import { sampleRecords, categoryTabLabels } from '../data/mockData'
import './AthleteOverview.css'

function BioField({ label, value }) {
  return (
    <div className="bio__field">
      <div className="bio__label">{label}</div>
      <div className="bio__value">{value}</div>
    </div>
  )
}

function RecordCard({ record }) {
  return (
    <div className="record card">
      {record.icon && (
        <span className="material-icons-outlined record__icon">{record.icon}</span>
      )}
      <div className="record__body">
        <div className="record__title">{record.title}</div>
        <div className="record__meta">{record.meta}</div>
      </div>
      {record.tag && <Chip label={record.tag} />}
    </div>
  )
}

export default function AthleteOverview({ athlete, sections, allowComments = false }) {
  const [activeTab, setActiveTab] = useState(sections[0])
  const [comment, setComment] = useState('')

  // Keep the active tab valid if the selected sections change.
  useEffect(() => {
    if (!sections.includes(activeTab)) setActiveTab(sections[0])
  }, [sections, activeTab])

  const records = sampleRecords[activeTab] || []

  return (
    <div className="overview">
      {/* Athlete header — always visible */}
      <div className="bio card">
        <div className="bio__identity">
          <Avatar name={athlete.name} size={64} />
          <div>
            <h2 className="bio__name">{athlete.name}</h2>
            <div className="bio__position">{athlete.rosterPosition}</div>
          </div>
          <div className="bio__status">
            <StatusChip status={athlete.status} />
          </div>
        </div>
        <div className="bio__fields">
          <BioField label="Date of birth" value={athlete.dob} />
          <BioField label="Age" value={athlete.age} />
          <BioField label="Country" value={athlete.country} />
          <BioField label="Height" value={athlete.height} />
          <BioField label="Roster position" value={athlete.rosterPosition} />
          <BioField label="Roster" value={athlete.roster} />
        </div>
      </div>

      {/* Tabs — only for selected sections */}
      <div className="overview__tabs">
        {sections.map((section) => (
          <button
            key={section}
            className={`overview__tab ${activeTab === section ? 'overview__tab--active' : ''}`}
            onClick={() => setActiveTab(section)}
          >
            {categoryTabLabels[section] || section}
          </button>
        ))}
      </div>

      {/* Active section content */}
      <div className="overview__panel">
        <h3 className="overview__panel-title">{categoryTabLabels[activeTab] || activeTab}</h3>
        <div className="overview__records">
          {records.length === 0 ? (
            <div className="overview__empty">No records in this section.</div>
          ) : (
            records.map((record) => <RecordCard key={record.id} record={record} />)
          )}
        </div>
      </div>

      {allowComments && (
        <div className="overview__comments card">
          <Field label="Comment">
            <TextField
              value={comment}
              onChange={setComment}
              placeholder="Add a comment about this athlete…"
              multiline
            />
          </Field>
        </div>
      )}
    </div>
  )
}
