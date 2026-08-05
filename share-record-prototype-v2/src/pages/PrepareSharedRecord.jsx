// Prepare Shared Record — a temporary, read-only PREVIEW of exactly what the
// recipient will receive, filtered to the categories selected in the drawer.
//  - single athlete  -> reuse the Athlete Overview layout (header block + tabs)
//  - multiple athletes (bulk) -> alternate accordion list view
// Sharing navigates back to the roster and raises a top-right snackbar.
import { useMemo } from 'react'
import { useNavigate, Navigate } from 'react-router-dom'
import { useShare } from '../context/ShareContext'
import { infoCategories, sampleRecords } from '../data/mockData'
import AthleteOverview from '../components/AthleteOverview'
import MultiAthleteSharedView from '../components/MultiAthleteSharedView'
import Layout from '../components/Layout'
import { Button } from '../components/ui'
import './PrepareSharedRecord.css'

export default function PrepareSharedRecord() {
  const { config, openDrawer, completeShare, showSnackbar } = useShare()
  const navigate = useNavigate()

  const athletes = config.athletes
  const isBulk = athletes.length > 1

  // Selected categories, in canonical order — drives tabs/sections and counts.
  const sections = useMemo(
    () => (athletes.length ? infoCategories.filter((c) => config.categories[c]) : []),
    [athletes, config.categories]
  )

  // Items per athlete, and total across everyone being shared.
  const perAthlete = useMemo(
    () => sections.reduce((total, c) => total + (sampleRecords[c]?.length || 0), 0),
    [sections]
  )
  const itemCount = perAthlete * athletes.length

  if (athletes.length === 0) return <Navigate to="/" replace />

  // Back returns to the Share Record drawer to change recipient / included info.
  const handleBack = () => {
    openDrawer(athletes)
    navigate('/')
  }

  // Share sends, confirms via a top-right snackbar, and returns to the roster.
  const handleShare = () => {
    completeShare()
    showSnackbar('Record shared')
    navigate('/')
  }

  const sharingLabel = isBulk ? `${athletes.length} players` : athletes[0].name

  return (
    <Layout crumbs={['Manage Players', 'Share medical record']} leadingIcon="groups">
      <div className="prepare">
        {/* Persistent sharing-mode banner — slim, single row */}
        <div className="preview-banner">
          <div className="preview-banner__main">
            <span className="preview-banner__label">Sharing</span>
            <span className="preview-banner__value">
              {sharingLabel} <span className="preview-banner__arrow">→</span>{' '}
              {config.physician}
            </span>
            <span className="preview-banner__sep">·</span>
            <span className="preview-banner__count">{itemCount} items</span>
          </div>
          <div className="preview-banner__actions">
            <Button variant="secondary" onClick={handleBack}>
              Back
            </Button>
            <Button variant="sharing" onClick={handleShare} disabled={itemCount === 0}>
              Share medical record
            </Button>
          </div>
        </div>

        {isBulk ? (
          <MultiAthleteSharedView athletes={athletes} sections={sections} />
        ) : (
          <AthleteOverview athlete={athletes[0]} sections={sections} />
        )}
      </div>
    </Layout>
  )
}
