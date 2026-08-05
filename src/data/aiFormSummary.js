// Mock data + helpers for the "AI Form Summary" feature on the Forms page.
// Per project conventions, all mock data / fixtures live in src/data/.

import athletesData from './athletes.json'
import formsTemplatesData from './forms_templates.json'

// ——— Players, grouped into roster buckets ———
// Maps the raw athletes fixture into the shape the picker needs.
const toPlayer = (a) => ({
  id: String(a.id),
  name: `${a.firstname} ${a.lastname}`.trim(),
  initials: a.alias || `${a.firstname?.[0] || ''}${a.lastname?.[0] || ''}`.toUpperCase(),
  position: a.position || a.position_group || '—',
  status: a.availability_status === 'Injured' ? 'injured' : 'available',
})

const allPlayers = (athletesData || []).map(toPlayer)
const byId = (id) => (athletesData || []).find((a) => String(a.id) === String(id))

// Roster groups, modelled on NFL roster structure.
// "Active Roster" is the live, auto-synced group.
export const rosterGroups = [
  {
    id: 'active-roster',
    name: 'Active Roster',
    autoSync: true,
    playerIds: (athletesData || [])
      .filter((a) => a.is_active && a.availability_status !== 'Injured' && a.squad_name === 'First Team')
      .map((a) => String(a.id)),
  },
  {
    id: 'practice-squad',
    name: 'Practice Squad',
    autoSync: false,
    playerIds: (athletesData || [])
      .filter((a) => a.squad_name === 'Reserve Team')
      .map((a) => String(a.id)),
  },
  {
    id: 'injured-reserve',
    name: 'Injured Reserve',
    autoSync: false,
    playerIds: (athletesData || [])
      .filter((a) => a.availability_status === 'Injured')
      .map((a) => String(a.id)),
  },
].filter((g) => g.playerIds.length > 0)

// ——— Step 1 athlete selector roster ———
export const selectorTeams = ['All teams', 'First Team', 'Reserve Team']

export const selectorAthletes = [
  { id: 'sa-1', name: 'Luis Abram', nationality: 'PER', team: 'First Team' },
  { id: 'sa-2', name: 'Derrick Abubakar', nationality: 'USA', team: 'Reserve Team' },
  { id: 'sa-3', name: 'Thiago Almada', nationality: 'ARG', team: 'First Team' },
  { id: 'sa-4', name: 'Osvaldo Alonso', nationality: 'CUB', team: 'Reserve Team' },
  { id: 'sa-5', name: 'Machop Chol', nationality: 'AUS', team: 'First Team' },
  { id: 'sa-6', name: 'Harry Anderson', nationality: 'USA', team: 'Reserve Team' },
  { id: 'sa-7', name: 'Bill Bryson', nationality: 'GBR', team: 'First Team' },
  { id: 'sa-8', name: 'Bernard William', nationality: 'USA', team: 'Reserve Team' },
  { id: 'sa-9', name: 'Eric Xavier', nationality: 'BRA', team: 'First Team' },
  { id: 'sa-10', name: 'Marcus Johnson', nationality: 'USA', team: 'First Team' },
  { id: 'sa-11', name: 'Jordan Peters', nationality: 'CAN', team: 'Reserve Team' },
  { id: 'sa-12', name: 'Darius Webb', nationality: 'USA', team: 'First Team' },
  { id: 'sa-13', name: 'Kofi Mensah', nationality: 'GHA', team: 'Reserve Team' },
  { id: 'sa-14', name: 'Luca Rossi', nationality: 'ITA', team: 'First Team' },
  { id: 'sa-15', name: 'Ahmed Hassan', nationality: 'EGY', team: 'Reserve Team' },
  { id: 'sa-16', name: "Ryan O'Brien", nationality: 'IRL', team: 'First Team' },
]

export const getPlayerById = (id) =>
  allPlayers.find((p) => p.id === String(id)) || selectorAthletes.find((a) => a.id === id)
export const searchPlayers = (query) => {
  const q = (query || '').trim().toLowerCase()
  if (!q) return allPlayers
  return allPlayers.filter((p) => p.name.toLowerCase().includes(q))
}
export { allPlayers }

// ——— Forms, grouped by category ———
export const formGroups = (() => {
  const groups = {}
  ;(formsTemplatesData || []).forEach((f) => {
    const cat = f.category || f.productArea || 'Other'
    if (!groups[cat]) groups[cat] = []
    groups[cat].push({ id: f.id, name: f.form, category: cat, description: f.description })
  })
  return Object.entries(groups).map(([category, forms]) => ({ category, forms }))
})()

export const allForms = (formsTemplatesData || []).map((f) => ({
  id: f.id,
  name: f.form,
  category: f.category || f.productArea || 'Other',
  description: f.description,
}))

export const getFormById = (id) => allForms.find((f) => f.id === String(id))

// ——— Date range presets ———
export const dateRangePresets = [
  { id: 'today', label: 'Today' },
  { id: 'last-7', label: 'Last 7 days' },
  { id: 'last-30', label: 'Last 30 days' },
  { id: 'last-6m', label: 'Last 6 months' },
  { id: 'last-2y', label: 'Last 2 years' },
  { id: 'custom', label: 'Custom' },
]

// ——— Form selector: canonical forms + categories (Step 2) ———
export const formCategories = [
  'All categories',
  'Medical',
  'Training',
  'Assessment',
  'Rehabilitation',
  'Wellness',
  'Administrative',
]

export const selectorForms = [
  { id: 'medical-assessment', name: 'Medical Assessment', category: 'Medical' },
  { id: 'preseason-assessment', name: 'Preseason Assessment', category: 'Assessment' },
  { id: 'training', name: 'Training', category: 'Training' },
  { id: 'end-of-season-survey', name: 'End of Season Survey', category: 'Assessment' },
  { id: 'transfer-screening', name: 'Transfer Screening', category: 'Medical' },
  { id: 'wellness-check', name: 'Wellness Check', category: 'Wellness' },
  { id: 'psychological-health-check', name: 'Psychological Health Check', category: 'Wellness' },
  { id: 'strength-assessment', name: 'Strength Assessment', category: 'Assessment' },
]

const formNameToId = Object.fromEntries(selectorForms.map((f) => [f.name, f.id]))

// Player ↔ form associations (by player name → form names).
const playerFormNames = {
  'Harry Anderson': ['Medical Assessment', 'Preseason Assessment'],
  'Bill Bryson': ['Medical Assessment', 'Training'],
  'Bernard William': ['Preseason Assessment', 'End of Season Survey'],
  'Eric Xavier': ['Transfer Screening', 'Medical Assessment'],
  'Marcus Johnson': ['Training', 'Wellness Check'],
  'Jordan Peters': ['Medical Assessment', 'Psychological Health Check'],
  'Darius Webb': ['End of Season Survey', 'Strength Assessment'],
  'Kofi Mensah': ['Medical Assessment', 'Transfer Screening'],
  'Luca Rossi': ['Preseason Assessment', 'Training'],
  'Ahmed Hassan': ['Wellness Check', 'Medical Assessment'],
  "Ryan O'Brien": ['Strength Assessment', 'Preseason Assessment'],
  'Thiago Almada': ['Transfer Screening', 'End of Season Survey'],
  'Osvaldo Alonso': ['Medical Assessment', 'Training'],
  'Machop Chol': ['Psychological Health Check', 'Wellness Check'],
  'Derrick Abubakar': ['Medical Assessment', 'Preseason Assessment'],
  'Luis Abram': ['Training', 'Strength Assessment'],
}

// Map each player id → array of form ids they're associated with.
export const playerFormMap = (() => {
  const map = {}
  selectorAthletes.forEach((a) => {
    map[a.id] = (playerFormNames[a.name] || []).map((n) => formNameToId[n]).filter(Boolean)
  })
  return map
})()

// Forms associated with at least one of the selected players.
export const getFormsForPlayers = (selectedPlayerIds = []) => {
  if (!selectedPlayerIds.length) return []
  const ids = new Set()
  selectedPlayerIds.forEach((pid) => (playerFormMap[pid] || []).forEach((fid) => ids.add(fid)))
  return selectorForms.filter((f) => ids.has(f.id))
}

// Players associated with a form. Pass selectedPlayerIds to limit to the selection.
export const getPlayersForForm = (formId, selectedPlayerIds = null) => {
  let players = selectorAthletes.filter((a) => (playerFormMap[a.id] || []).includes(formId))
  if (selectedPlayerIds) {
    const sel = new Set(selectedPlayerIds)
    players = players.filter((a) => sel.has(a.id))
  }
  return players
}

export const getSelectorFormById = (id) => selectorForms.find((f) => f.id === id)

// ——— Mock AI summary generator ———
// Produces a deterministic, plausible-looking synthesis from the selection so
// the prototype reads convincingly without a backend.
export function generateMockSummary({ playerIds = [], formIds = [], dateLabel = 'the selected period' }) {
  const players = playerIds.map(getPlayerById).filter(Boolean)
  const forms = formIds.map(getFormById).filter(Boolean)
  const responseCount = Math.max(players.length * forms.length, players.length, forms.length)

  const playerPhrase =
    players.length === 1
      ? players[0].name
      : `${players.length} players`
  const formPhrase =
    forms.length === 1 ? forms[0].name : `${forms.length} forms`

  const injured = players.filter((p) => p.status === 'injured')

  const sections = []

  sections.push({
    heading: 'Overview',
    body: `Synthesised ${responseCount} response${responseCount === 1 ? '' : 's'} across ${formPhrase.toLowerCase()} for ${playerPhrase} over ${dateLabel}. Overall completion and engagement were strong, with no critical flags requiring immediate escalation.`,
  })

  sections.push({
    heading: 'Key themes',
    bullets: [
      'Sleep quality trended slightly downward mid-week, recovering after the scheduled rest day.',
      'Self-reported soreness clustered around the lower body, consistent with the current training block.',
      'Hydration and nutrition adherence remained high across the group.',
    ],
  })

  if (injured.length > 0) {
    sections.push({
      heading: 'Attention required',
      bullets: injured.map(
        (p) => `${p.name} (${p.position}) reported ongoing discomfort — recommend follow-up with medical staff.`
      ),
    })
  }

  sections.push({
    heading: 'Recommended actions',
    bullets: [
      'Review load management for players reporting elevated fatigue.',
      'Schedule a brief check-in with athletes flagged above.',
      'Continue monitoring wellness trends into next week.',
    ],
  })

  return {
    title: 'AI form summary',
    subtitle: `${playerPhrase} · ${formPhrase} · ${dateLabel}`,
    responseCount,
    sections,
    sources: forms.map((f) => f.name),
  }
}
