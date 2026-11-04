import React, { useMemo, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import {
  Box,
  TabBar,
  TextField,
  MenuItem,
  List,
  ListItem,
  ListItemText,
  DataGrid,
} from '../playbook-components'
import { StatusChip } from '../components'
import { dataGridStyles } from '../components/dataGridStyles'
import {
  PageFrame,
  PageHeader,
  PageState,
  RecordLayout,
  RecordSection,
  RecordFields,
  RecordNavigation,
  useToasts,
  useNavigationToast,
} from '../floorplans'
import athletesData from '../data/athletes.json'
import injuriesData from '../data/injuries_medical.json'
import wellbeingData from '../data/questionnaires_wellbeing.json'
import { availableSquads } from '../data/layout'
import { athleteProfileTabs, availabilityBadgeColors, positionOptions } from '../data/athleteViews'

// Floorplan: Record. Everything about one athlete, with section-level editing on the
// Overview tab and a timeline in the supporting pane.

const fullName = (athlete) => `${athlete.firstname} ${athlete.lastname}`

const injuryColumns = [
  { field: 'injury_type', headerName: 'Injury', flex: 1, minWidth: 160 },
  { field: 'body_part', headerName: 'Body part', width: 130, valueGetter: (value, row) => `${row.side} ${value.toLowerCase()}` },
  { field: 'occurrence_date', headerName: 'Date', width: 120 },
  { field: 'days_lost', headerName: 'Days lost', type: 'number', width: 100 },
  {
    field: 'status',
    headerName: 'Status',
    width: 130,
    renderCell: ({ value }) => <StatusChip status={value} type={value === 'Returned' ? 'success' : 'warning'} />,
  },
]

const wellbeingColumns = [
  { field: 'questionnaire_type', headerName: 'Questionnaire', flex: 1, minWidth: 160 },
  { field: 'questionnaire_date', headerName: 'Date', width: 120 },
  { field: 'overall_score', headerName: 'Score', type: 'number', width: 100 },
  { field: 'status', headerName: 'Status', width: 130 },
]

// Recent events for the supporting pane, newest first
function buildTimeline(athlete, injuries, questionnaires) {
  const events = [
    ...injuries.map((injury) => ({ id: `injury-${injury.id}`, date: injury.occurrence_date, title: injury.injury_type, detail: `Injury · ${injury.status}` })),
    ...questionnaires.map((q) => ({ id: `q-${q.id}`, date: q.questionnaire_date, title: q.questionnaire_type, detail: `Questionnaire · score ${q.overall_score}` })),
    athlete.last_assessment && { id: 'assessment', date: athlete.last_assessment, title: 'Assessment', detail: athlete.fitness_level },
  ].filter(Boolean)
  return events.sort((a, b) => b.date.localeCompare(a.date))
}

function AthleteProfile() {
  const { athleteId } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const { showToast, toasts } = useToasts()
  useNavigationToast(showToast)
  const [tab, setTab] = useState(location.state?.initialTab || '#overview')

  // Edits made in this session, keyed by athlete id, so they survive tab and record changes
  const [edits, setEdits] = useState({})
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState({})
  const [saving, setSaving] = useState(false)

  const id = Number(athleteId)
  const baseAthlete = athletesData.find((a) => a.id === id)
  const athlete = baseAthlete && { ...baseAthlete, ...edits[id] }

  const collectionIds = location.state?.collectionIds || athletesData.map((a) => a.id)
  const position = collectionIds.indexOf(id)
  const goTo = (offset) => {
    setEditing(false)
    navigate(`/athletes/${collectionIds[position + offset]}`, { state: location.state, replace: true })
  }

  const injuries = useMemo(() => injuriesData.filter((i) => i.athlete_id === id), [id])
  const questionnaires = useMemo(() => wellbeingData.filter((q) => q.athlete_id === id), [id])

  if (!athlete) {
    return (
      <PageFrame header={<PageHeader title="Athlete not found" onBackClick={() => navigate('/athletes')} />}>
        <PageState
          kind="noResults"
          title="This athlete doesn't exist"
          description="They may have been removed, or the link is wrong."
          action={{ label: 'Go to athletes', onClick: () => navigate('/athletes') }}
        />
      </PageFrame>
    )
  }

  const notInPrototype = (title) => () =>
    showToast({ title, description: 'This prototype does not include it yet.', status: 'info' })

  const startEditing = () => {
    setDraft({ position: athlete.position, squad_name: athlete.squad_name, height: athlete.height, weight: athlete.weight })
    setEditing(true)
  }

  const save = () => {
    setSaving(true)
    // A short delay stands in for the request, so the Save button shows its loading state
    setTimeout(() => {
      setEdits((current) => ({ ...current, [id]: { ...current[id], ...draft } }))
      setSaving(false)
      setEditing(false)
      showToast({ title: 'Profile updated' })
    }, 600)
  }

  const setField = (field) => (event) => setDraft((current) => ({ ...current, [field]: event.target.value }))

  const overview = (
    <RecordLayout
      asideTitle="Timeline"
      aside={
        <List dense disablePadding>
          {buildTimeline(athlete, injuries, questionnaires).map((event) => (
            <ListItem key={event.id} disableGutters>
              <ListItemText primary={event.title} secondary={`${event.date} · ${event.detail}`} />
            </ListItem>
          ))}
        </List>
      }
    >
      <RecordSection
        title="Profile"
        isEditing={editing}
        onEdit={startEditing}
        onCancel={() => setEditing(false)}
        onSave={save}
        saving={saving}
      >
        {editing ? (
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
            <TextField variant="filled" select label="Position" value={draft.position} onChange={setField('position')}>
              {positionOptions.map((option) => <MenuItem key={option} value={option}>{option}</MenuItem>)}
            </TextField>
            <TextField variant="filled" select label="Squad" value={draft.squad_name} onChange={setField('squad_name')}>
              {availableSquads.map((squad) => <MenuItem key={squad.id} value={squad.name}>{squad.name}</MenuItem>)}
            </TextField>
            <TextField variant="filled" label="Height" value={draft.height} onChange={setField('height')} />
            <TextField variant="filled" label="Weight" value={draft.weight} onChange={setField('weight')} />
          </Box>
        ) : (
          <RecordFields
            fields={[
              { id: 'position', label: 'Position', value: athlete.position },
              { id: 'squad', label: 'Squad', value: athlete.squad_name },
              { id: 'height', label: 'Height', value: athlete.height },
              { id: 'weight', label: 'Weight', value: athlete.weight },
              { id: 'dob', label: 'Date of birth', value: athlete.date_of_birth },
              { id: 'country', label: 'Country', value: athlete.country },
            ]}
          />
        )}
      </RecordSection>

      <RecordSection title="Availability">
        <RecordFields
          fields={[
            { id: 'status', label: 'Status', value: athlete.availability_status },
            { id: 'injury', label: 'Injury status', value: athlete.injury_status },
            { id: 'rtp', label: 'Expected return', value: athlete.rtp_date },
            { id: 'assessment', label: 'Last assessment', value: athlete.last_assessment },
          ]}
        />
      </RecordSection>

      <RecordSection title="Performance">
        <RecordFields
          fields={[
            { id: 'performance', label: 'Performance score', value: `${athlete.performance_score}%` },
            { id: 'fitness', label: 'Fitness', value: athlete.fitness_level },
            { id: 'load', label: 'Training load', value: athlete.training_load?.toFixed(1) },
            { id: 'wellbeing', label: 'Wellbeing score', value: athlete.wellbeing_score?.toFixed(1) },
          ]}
        />
      </RecordSection>
    </RecordLayout>
  )

  const grid = (rows, columns, emptyTitle) =>
    rows.length === 0 ? (
      <PageState kind="empty" title={emptyTitle} />
    ) : (
      <Box sx={{ ...dataGridStyles, bgcolor: 'var(--color-white)', border: '1px solid var(--color-border-primary)', borderRadius: 'var(--radius-md)' }}>
        <DataGrid rows={rows} columns={columns} hideFooter autoHeight disableRowSelectionOnClick />
      </Box>
    )

  const content = {
    '#overview': overview,
    '#medical': grid(injuries, injuryColumns, 'No injuries recorded'),
    '#wellbeing': grid(questionnaires, wellbeingColumns, 'No questionnaires completed'),
  }[tab]

  const availabilityColor = availabilityBadgeColors[athlete.availability_status] || 'default'

  return (
    <PageFrame
      maxContentWidth={1440}
      header={
        <PageHeader
          title={fullName(athlete)}
          onBackClick={() => navigate('/athletes')}
          listItems={[
            { id: 'position', label: 'Position', value: athlete.position },
            { id: 'squad', label: 'Squad', value: athlete.squad_name },
            { id: 'age', label: 'Age', value: String(athlete.age) },
            { id: 'country', label: 'Country', value: athlete.country },
          ]}
          badges={[{ id: 'availability', label: athlete.availability_status, color: availabilityColor }]}
          primaryAction={{ id: 'log-injury', label: 'Log injury', onClick: () => navigate(`/medical/log-injury?athleteId=${id}`) }}
          moreActions={[
            { id: 'assign', label: 'Assign form', onClick: notInPrototype('Assign form') },
            { id: 'archive', label: 'Archive athlete', onClick: notInPrototype('Archive athlete') },
          ]}
        />
      }
      tabs={
        <Box sx={{ display: 'flex', alignItems: 'center', '& #TabBarRoot': { flex: 1, minWidth: 0 } }}>
          <TabBar tabs={athleteProfileTabs} value={tab} onChange={setTab} />
          <RecordNavigation
            noun="athlete"
            position={position}
            total={collectionIds.length}
            onPrevious={() => goTo(-1)}
            onNext={() => goTo(1)}
          />
        </Box>
      }
    >
      {content}
      {toasts}
    </PageFrame>
  )
}

export default AthleteProfile
