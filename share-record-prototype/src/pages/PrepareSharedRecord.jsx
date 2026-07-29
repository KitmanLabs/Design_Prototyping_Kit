// Prepare Shared Record — a temporary, read-only PREVIEW of exactly what the
// recipient will receive. It reuses the Athlete Overview layout, filtered to the
// categories selected in the Share Record drawer. This is not an editing page.
import { useMemo, useState } from 'react'
import { useNavigate, Navigate } from 'react-router-dom'
import { useShare } from '../context/ShareContext'
import { infoCategories, sampleRecords } from '../data/mockData'
import AthleteOverview from '../components/AthleteOverview'
import Layout from '../components/Layout'
import { Button } from '../components/ui'
import './PrepareSharedRecord.css'

export default function PrepareSharedRecord() {
  const { config, openDrawer, resetConfig } = useShare()
  const navigate = useNavigate()
  const [sent, setSent] = useState(false)

  // Selected categories, in canonical order — drives tabs and the item count.
  const sections = useMemo(
    () => (config.athlete ? infoCategories.filter((c) => config.categories[c]) : []),
    [config]
  )

  const itemCount = useMemo(
    () => sections.reduce((total, c) => total + (sampleRecords[c]?.length || 0), 0),
    [sections]
  )

  if (!config.athlete) return <Navigate to="/" replace />

  // Back returns to the Share Record drawer to change recipient / included info.
  const handleBack = () => {
    openDrawer(config.athlete)
    navigate('/')
  }

  const handleDone = () => {
    resetConfig()
    navigate('/')
  }

  if (sent) {
    return (
      <Layout crumbs={['Manage Athletes', 'Share record']} leadingIcon="groups">
        <div className="prepare">
          <div className="sent card">
            <span className="material-icons-outlined sent__icon">check_circle</span>
            <h2>Record shared</h2>
            <p>
              {config.athlete.name}’s record ({itemCount} items) was shared with{' '}
              {config.physician}, {config.organization}.
            </p>
            <Button variant="primary" onClick={handleDone}>
              Back to manage athletes
            </Button>
          </div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout crumbs={['Manage Athletes', 'Share record']} leadingIcon="groups">
      <div className="prepare">
        {/* Persistent sharing-mode banner — slim, single row */}
        <div className="preview-banner">
          <div className="preview-banner__main">
            <span className="preview-banner__label">Sharing</span>
            <span className="preview-banner__value">
              {config.athlete.name} <span className="preview-banner__arrow">→</span>{' '}
              {config.physician}
            </span>
            <span className="preview-banner__sep">·</span>
            <span className="preview-banner__count">{itemCount} items</span>
          </div>
          <div className="preview-banner__actions">
            <Button variant="secondary" onClick={handleBack}>
              Back
            </Button>
            <Button variant="sharing" onClick={() => setSent(true)} disabled={itemCount === 0}>
              Share record
            </Button>
          </div>
        </div>

        {/* Reused Athlete Overview layout, filtered to selected sections */}
        <AthleteOverview athlete={config.athlete} sections={sections} />
      </div>
    </Layout>
  )
}
