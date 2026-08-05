// Manage Athletes — primary interface for viewing/managing athlete records.
// Entry point into the Share Record workflow (per-row menu → Share record).
import { useState, useEffect, useRef, useMemo } from 'react'
import { athletes, allLabels } from '../data/mockData'
import { useShare } from '../context/ShareContext'
import Layout from '../components/Layout'
import { Avatar, Button, IconButton, Chip, Tooltip, SearchableSelect } from '../components/ui'
import ManageMedicalRecordDrawer from '../components/ManageMedicalRecordDrawer'
import './ManageAthletes.css'

const SQUADS_VISIBLE = 2 // squad names shown before collapsing into a +N count

function SquadsCell({ squads }) {
  if (squads.length === 0) return <span className="grid__muted">—</span>
  const visible = squads.slice(0, SQUADS_VISIBLE)
  const overflow = squads.length - visible.length
  const text = visible.join(', ') + (overflow > 0 ? `, ` : '')
  if (overflow === 0) return <span>{text}</span>
  return (
    <span className="squads">
      {text}
      <Tooltip content={squads.join(', ')}>
        <span className="squads__more">+{overflow}</span>
      </Tooltip>
    </span>
  )
}

function RowMenu({ onShare, onManage }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  useEffect(() => {
    const onDoc = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', onDoc)
    return () => document.removeEventListener('mousedown', onDoc)
  }, [])
  return (
    <div className="row-menu" ref={ref}>
      <IconButton icon="more_vert" onClick={() => setOpen((o) => !o)} aria-label="Row actions" />
      {open && (
        <div className="row-menu__list">
          <button
            className="row-menu__item"
            onClick={() => {
              setOpen(false)
              onShare()
            }}
          >
            <span className="material-icons-outlined">share</span>
            Share medical record
          </button>
          <button
            className="row-menu__item"
            onClick={() => {
              setOpen(false)
              onManage()
            }}
          >
            <span className="material-icons-outlined">folder_shared</span>
            Manage medical record
          </button>
          <button className="row-menu__item row-menu__item--disabled" disabled>
            <span className="material-icons-outlined">edit</span>
            Edit player
          </button>
          <button className="row-menu__item row-menu__item--disabled" disabled>
            <span className="material-icons-outlined">visibility</span>
            View profile
          </button>
        </div>
      )}
    </div>
  )
}

// Page-level overflow menu — placeholder actions, not yet detailed.
function PageMoreMenu() {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  useEffect(() => {
    const onDoc = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', onDoc)
    return () => document.removeEventListener('mousedown', onDoc)
  }, [])
  return (
    <div className="row-menu" ref={ref}>
      <IconButton icon="more_vert" onClick={() => setOpen((o) => !o)} aria-label="More actions" />
      {open && (
        <div className="row-menu__list row-menu__list--right">
          <button className="row-menu__item row-menu__item--disabled" disabled>Import from template</button>
          <button className="row-menu__item row-menu__item--disabled" disabled>Bulk edit</button>
          <button className="row-menu__item row-menu__item--disabled" disabled>Archive selected</button>
        </div>
      )}
    </div>
  )
}

const TABS = ['Active', 'Inactive']

export default function ManageAthletes() {
  const { openDrawer } = useShare()
  const [tab, setTab] = useState('Active')
  const [search, setSearch] = useState('')
  const [labelFilter, setLabelFilter] = useState('')
  const [selectedIds, setSelectedIds] = useState([])
  const [managingAthlete, setManagingAthlete] = useState(null)

  const rows = useMemo(() => {
    return athletes.filter((a) => {
      if (tab === 'Active' ? !a.active : a.active) return false
      if (search && a.name !== search) return false
      if (labelFilter && !a.labels.includes(labelFilter)) return false
      return true
    })
  }, [tab, search, labelFilter])

  const allVisibleSelected = rows.length > 0 && rows.every((a) => selectedIds.includes(a.id))
  const someVisibleSelected = rows.some((a) => selectedIds.includes(a.id))

  const toggleRow = (id) =>
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    )

  const toggleAll = () =>
    setSelectedIds(allVisibleSelected ? [] : rows.map((a) => a.id))

  const clearSelection = () => setSelectedIds([])

  const handleBulkShare = () => {
    const selectedAthletes = athletes.filter((a) => selectedIds.includes(a.id))
    openDrawer(selectedAthletes)
  }

  return (
    <Layout crumbs={['Manage Players', 'Player list']} leadingIcon="groups">
      <div className="page">
        {/* Page header */}
        <div className="page__header">
          <h1>Manage players</h1>
          <div className="page__actions">
            <Button variant="primary">
              <span className="material-icons-outlined btn-icon">add</span>
              New player
            </Button>
            <Button variant="secondary">
              <span className="material-icons-outlined btn-icon">upload</span>
              Upload player
            </Button>
            <Button variant="secondary">
              <span className="material-icons-outlined btn-icon">description</span>
              Download CSV
            </Button>
            <Button variant="secondary">
              <span className="material-icons-outlined btn-icon">download</span>
              Download
            </Button>
            <PageMoreMenu />
          </div>
        </div>

        {/* Tabs */}
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

        {/* Filters */}
        <div className="filters">
          <div className="filters__control">
            <SearchableSelect
              value={search}
              onChange={(v) => setSearch(v === 'All players' ? '' : v)}
              options={['All players', ...athletes.map((a) => a.name)]}
              placeholder="Search"
            />
          </div>
          <div className="filters__control">
            <SearchableSelect
              value={labelFilter}
              onChange={(v) => setLabelFilter(v === 'All labels' ? '' : v)}
              options={['All labels', ...allLabels]}
              placeholder="Labels"
            />
          </div>
        </div>

        {/* Sticky bulk action bar — appears when one or more rows are selected */}
        {selectedIds.length > 0 && (
          <div className="bulk-bar">
            <span className="bulk-bar__count">{selectedIds.length} selected</span>
            <div className="bulk-bar__actions">
              <Button variant="secondary" onClick={clearSelection}>
                Clear
              </Button>
              <Button variant="primary" onClick={handleBulkShare}>
                <span className="material-icons-outlined btn-icon">share</span>
                Share medical records
              </Button>
            </div>
          </div>
        )}

        {/* Data grid */}
        <div className="grid card">
          <div className="grid__head">
            <div className="grid__cell grid__cell--check">
              <input
                type="checkbox"
                aria-label="Select all"
                checked={allVisibleSelected}
                ref={(el) => {
                  if (el) el.indeterminate = someVisibleSelected && !allVisibleSelected
                }}
                onChange={toggleAll}
              />
            </div>
            <div className="grid__cell grid__cell--name">Username</div>
            <div className="grid__cell">Roster position</div>
            <div className="grid__cell">Squads</div>
            <div className="grid__cell">Labels</div>
            <div className="grid__cell grid__cell--actions" />
          </div>
          {rows.length === 0 && (
            <div className="grid__empty">No players to show.</div>
          )}
          {rows.map((athlete) => (
            <div
              className={`grid__row ${selectedIds.includes(athlete.id) ? 'grid__row--selected' : ''}`}
              key={athlete.id}
            >
              <div className="grid__cell grid__cell--check">
                <input
                  type="checkbox"
                  aria-label={`Select ${athlete.name}`}
                  checked={selectedIds.includes(athlete.id)}
                  onChange={() => toggleRow(athlete.id)}
                />
              </div>
              <div className="grid__cell grid__cell--name">
                <Avatar name={athlete.name} size={32} />
                <span className="grid__name">{athlete.name}</span>
              </div>
              <div className="grid__cell">{athlete.rosterPosition}</div>
              <div className="grid__cell">
                <SquadsCell squads={athlete.squads} />
              </div>
              <div className="grid__cell grid__cell--labels">
                {athlete.labels.map((l) => (
                  <Chip key={l} label={l} />
                ))}
              </div>
              <div className="grid__cell grid__cell--actions">
                <RowMenu
                  onShare={() => openDrawer(athlete)}
                  onManage={() => setManagingAthlete(athlete)}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
      {managingAthlete && (
        <ManageMedicalRecordDrawer
          athlete={managingAthlete}
          onClose={() => setManagingAthlete(null)}
        />
      )}
    </Layout>
  )
}
