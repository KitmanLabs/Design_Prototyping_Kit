// Blast messaging mock data – LA Galaxy MLS context
// Sender persona: Academy Director, LA Galaxy

// ─── Hash helper (used by reach + stub generation) ────────────────────────────
function hashId(id) {
  let h = 0
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0
  return h
}

// ─── MLS Clubs ────────────────────────────────────────────────────────────────
export const mlsClubs = [
  { id: 'atl',  name: 'Atlanta United FC',          abbr: 'ATL',  memberCount: 78 },
  { id: 'aus',  name: 'Austin FC',                  abbr: 'ATX',  memberCount: 62 },
  { id: 'mtl',  name: 'CF Montréal',                abbr: 'MTL',  memberCount: 71 },
  { id: 'clt',  name: 'Charlotte FC',               abbr: 'CLT',  memberCount: 58 },
  { id: 'chi',  name: 'Chicago Fire FC',             abbr: 'CHI',  memberCount: 65 },
  { id: 'col',  name: 'Colorado Rapids',             abbr: 'COL',  memberCount: 60 },
  { id: 'clb',  name: 'Columbus Crew',               abbr: 'CLB',  memberCount: 67 },
  { id: 'dc',   name: 'D.C. United',                 abbr: 'DC',   memberCount: 63 },
  { id: 'cin',  name: 'FC Cincinnati',               abbr: 'CIN',  memberCount: 69 },
  { id: 'dal',  name: 'FC Dallas',                   abbr: 'DAL',  memberCount: 72 },
  { id: 'hou',  name: 'Houston Dynamo FC',           abbr: 'HOU',  memberCount: 64 },
  { id: 'mia',  name: 'Inter Miami CF',              abbr: 'MIA',  memberCount: 74 },
  { id: 'lag',  name: 'LA Galaxy',                   abbr: 'LA',   memberCount: 81 },
  { id: 'lafc', name: 'Los Angeles FC',              abbr: 'LAFC', memberCount: 76 },
  { id: 'min',  name: 'Minnesota United FC',         abbr: 'MIN',  memberCount: 61 },
  { id: 'nsh',  name: 'Nashville SC',                abbr: 'NSH',  memberCount: 66 },
  { id: 'ne',   name: 'New England Revolution',      abbr: 'NE',   memberCount: 68 },
  { id: 'nyc',  name: 'New York City FC',            abbr: 'NYC',  memberCount: 70 },
  { id: 'rbny', name: 'New York Red Bulls',          abbr: 'RBNY', memberCount: 73 },
  { id: 'orl',  name: 'Orlando City SC',             abbr: 'ORL',  memberCount: 62 },
  { id: 'phi',  name: 'Philadelphia Union',          abbr: 'PHI',  memberCount: 67 },
  { id: 'por',  name: 'Portland Timbers',            abbr: 'POR',  memberCount: 69 },
  { id: 'rsl',  name: 'Real Salt Lake',              abbr: 'RSL',  memberCount: 63 },
  { id: 'sdc',  name: 'San Diego FC',                abbr: 'SD',   memberCount: 55 },
  { id: 'sj',   name: 'San Jose Earthquakes',        abbr: 'SJ',   memberCount: 61 },
  { id: 'sea',  name: 'Seattle Sounders FC',         abbr: 'SEA',  memberCount: 75 },
  { id: 'skc',  name: 'Sporting Kansas City',        abbr: 'SKC',  memberCount: 64 },
  { id: 'stl',  name: 'St. Louis City SC',           abbr: 'STL',  memberCount: 57 },
  { id: 'tor',  name: 'Toronto FC',                  abbr: 'TOR',  memberCount: 68 },
  { id: 'van',  name: 'Vancouver Whitecaps FC',      abbr: 'VAN',  memberCount: 65 },
]

// ─── Atlanta United FC – full club detail ──────────────────────────────────────

const atlPlayers = {
  firstTeam: {
    Goalkeeper: [
      { id: 'atl-gk1', last: 'Guzan',          first: 'Brad',       nationality: 'USA', status: 'Available' },
      { id: 'atl-gk2', last: 'Rios Novo',       first: 'Rocco',      nationality: 'ARG', status: 'Available' },
      { id: 'atl-gk3', last: 'Shuttleworth',    first: 'Bobby',      nationality: 'USA', status: 'Available' },
    ],
    Defender: [
      { id: 'atl-df1', last: 'Robinson',        first: 'Miles',      nationality: 'USA', status: 'Available' },
      { id: 'atl-df2', last: 'Lennon',          first: 'Brooks',     nationality: 'USA', status: 'Available' },
      { id: 'atl-df3', last: 'Abram',           first: 'Luis',       nationality: 'PER', status: 'Available' },
      { id: 'atl-df4', last: 'Sanchez Purata',  first: 'Juan Jose',  nationality: 'MEX', status: 'Available' },
      { id: 'atl-df5', last: 'Gregersen',       first: 'Stian',      nationality: 'NOR', status: 'Available' },
      { id: 'atl-df6', last: 'Wiley',           first: 'Caleb',      nationality: 'USA', status: 'Available' },
      { id: 'atl-df7', last: 'Jennings',        first: 'George',     nationality: 'TRI', status: 'Available' },
      { id: 'atl-df8', last: 'Yow',             first: 'Jake',       nationality: 'USA', status: 'Available' },
    ],
    Midfielder: [
      { id: 'atl-mf1', last: 'Almada',          first: 'Thiago',     nationality: 'ARG', status: 'Available' },
      { id: 'atl-mf2', last: 'Moreno',          first: 'Marcelino',  nationality: 'ARG', status: 'Available' },
      { id: 'atl-mf3', last: 'Hyndman',         first: 'Emerson',    nationality: 'USA', status: 'Available' },
      { id: 'atl-mf4', last: 'Alonso',          first: 'Osvaldo',    nationality: 'CUB', status: 'Available' },
      { id: 'atl-mf5', last: 'Abubakar',        first: 'Derrick',    nationality: 'USA', status: 'Available' },
      { id: 'atl-mf6', last: 'Slimani',         first: 'Amar',       nationality: 'ALG', status: 'Available' },
      { id: 'atl-mf7', last: 'McCann',          first: 'Caleb',      nationality: 'USA', status: 'Available' },
      { id: 'atl-mf8', last: 'Lobjanidze',      first: 'Saba',       nationality: 'GEO', status: 'Available' },
      { id: 'atl-mf9', last: 'Mueller',         first: 'Leon',       nationality: 'GER', status: 'Available' },
    ],
    Forward: [
      { id: 'atl-fw1', last: 'Martinez',        first: 'Josef',      nationality: 'VEN', status: 'Available' },
      { id: 'atl-fw2', last: 'Mulraney',        first: 'Jake',       nationality: 'SCO', status: 'Available' },
      { id: 'atl-fw3', last: 'Rios',            first: 'Andy',       nationality: 'COL', status: 'Available' },
      { id: 'atl-fw4', last: 'Chol',            first: 'Machop',     nationality: 'AUS', status: 'Available' },
      { id: 'atl-fw5', last: 'Rossetto',        first: 'Alex',       nationality: 'USA', status: 'Available' },
    ],
  },
}

const makeSimpleTeam = (prefix, count) =>
  Array.from({ length: count }, (_, i) => ({
    id: `atl-${prefix}-p${i + 1}`,
    last: 'Player',
    first: `${i + 1}`,
    nationality: 'USA',
    status: 'Available',
    positionGroup: ['Goalkeeper', 'Defender', 'Midfielder', 'Forward'][i % 4],
  }))

export const atlClubData = {
  id: 'atl',
  name: 'Atlanta United FC',
  teams: [
    {
      id: 'atl-ft',
      name: 'First Team',
      memberCount: 25,
      positions: atlPlayers.firstTeam,
    },
    {
      id: 'atl-atl2',
      name: 'Atlanta United 2',
      memberCount: 22,
      positions: {
        Goalkeeper: makeSimpleTeam('u2-gk', 2),
        Defender:   makeSimpleTeam('u2-df', 7),
        Midfielder: makeSimpleTeam('u2-mf', 8),
        Forward:    makeSimpleTeam('u2-fw', 5),
      },
    },
    {
      id: 'atl-u19',
      name: 'Academy U-19',
      memberCount: 20,
      positions: {
        Goalkeeper: makeSimpleTeam('u19-gk', 2),
        Defender:   makeSimpleTeam('u19-df', 6),
        Midfielder: makeSimpleTeam('u19-mf', 7),
        Forward:    makeSimpleTeam('u19-fw', 5),
      },
    },
    {
      id: 'atl-u17',
      name: 'Academy U-17',
      memberCount: 20,
      positions: {
        Goalkeeper: makeSimpleTeam('u17-gk', 2),
        Defender:   makeSimpleTeam('u17-df', 6),
        Midfielder: makeSimpleTeam('u17-mf', 7),
        Forward:    makeSimpleTeam('u17-fw', 5),
      },
    },
    {
      id: 'atl-u15',
      name: 'Academy U-15',
      memberCount: 20,
      positions: {
        Goalkeeper: makeSimpleTeam('u15-gk', 2),
        Defender:   makeSimpleTeam('u15-df', 6),
        Midfielder: makeSimpleTeam('u15-mf', 7),
        Forward:    makeSimpleTeam('u15-fw', 5),
      },
    },
  ],
  staffSections: [
    { id: 'atl-coaching', name: 'Coaching',  memberCount: 4 },
    { id: 'atl-medical',  name: 'Medical',   memberCount: 4 },
    { id: 'atl-sc',       name: 'S&C',       memberCount: 2 },
    { id: 'atl-admin',    name: 'Admin',     memberCount: 2 },
  ],
}

// ─── Atlanta teams (flat list for filter dropdowns) ───────────────────────────
export const atlTeams = [
  { id: 'atl-ft',    name: 'First Team' },
  { id: 'atl-atl2',  name: 'Atlanta United 2' },
  { id: 'atl-u19',   name: 'Academy U-19' },
  { id: 'atl-u17',   name: 'Academy U-17' },
  { id: 'atl-u15',   name: 'Academy U-15' },
]

// ─── Named staff (Atlanta United FC) ─────────────────────────────────────────
// IDs follow atl- prefix convention for consistent selection counting
export const atlNamedStaff = [
  { id: 'atl-st1',  last: 'Pineda',        first: 'Gonzalo',   role: 'Head Coach',             teamId: 'atl-ft'    },
  { id: 'atl-st2',  last: 'Morais',        first: 'Renato',    role: 'Assistant Coach',         teamId: 'atl-ft'    },
  { id: 'atl-st3',  last: 'de la Torre',   first: 'Carlos',    role: 'Goalkeeper Coach',        teamId: 'atl-ft'    },
  { id: 'atl-st4',  last: 'Whitfield',     first: 'Damani',    role: 'Fitness Coach',           teamId: 'atl-ft'    },
  { id: 'atl-st5',  last: 'Patel',         first: 'Anaya',     role: 'Head Physiotherapist',    teamId: 'atl-ft'    },
  { id: 'atl-st6',  last: 'Nguyen',        first: 'Michael',   role: 'Team Physician',          teamId: 'atl-ft'    },
  { id: 'atl-st7',  last: 'Stevens',       first: 'Jordan',    role: 'Sports Scientist',        teamId: 'atl-atl2'  },
  { id: 'atl-st8',  last: 'Rodriguez',     first: 'Camila',    role: 'Nutritionist',            teamId: 'atl-atl2'  },
  { id: 'atl-st9',  last: 'Washington',    first: 'Derek',     role: 'Video Analyst',           teamId: 'atl-atl2'  },
  { id: 'atl-st10', last: 'Murphy',        first: 'Sean',      role: 'Kit Manager',             teamId: 'atl-atl2'  },
  { id: 'atl-st11', last: 'Chen',          first: 'Sofia',     role: 'Academy Director',        teamId: 'atl-u19'   },
  { id: 'atl-st12', last: 'Fitzgerald',    first: 'Tom',       role: 'Head of Academy',         teamId: 'atl-u19'   },
]

// ─── First team flat (backward compatibility) ─────────────────────────────────
export const atlFirstTeamFlat = [
  ...atlPlayers.firstTeam.Goalkeeper,
  ...atlPlayers.firstTeam.Defender,
  ...atlPlayers.firstTeam.Midfielder,
  ...atlPlayers.firstTeam.Forward,
]

// ─── All Atlanta athletes (all teams, with teamId) ────────────────────────────
// IDs are normalised so all start with "atl-" for consistent prefix-based selection counting
export const atlAllAthletes = atlClubData.teams.flatMap(team =>
  Object.values(team.positions).flat().map(player => ({
    ...player,
    id: player.id.startsWith('atl-') ? player.id : `atl-${player.id}`,
    teamId: team.id,
  }))
)

// ─── Atlanta guardians ────────────────────────────────────────────────────────
export const atlGuardians = [
  // U-17 guardians
  { id: 'atl-grd-1',  last: 'Obasi',       first: 'Adaeze',   linkedPlayerLast: 'Obasi',       linkedPlayerFirst: 'Kwame',    teamId: 'atl-u17' },
  { id: 'atl-grd-2',  last: 'Hernandez',   first: 'Maria',    linkedPlayerLast: 'Hernandez',   linkedPlayerFirst: 'Diego',    teamId: 'atl-u17' },
  { id: 'atl-grd-3',  last: 'Kim',         first: 'Jisoo',    linkedPlayerLast: 'Kim',         linkedPlayerFirst: 'Seongjun', teamId: 'atl-u17' },
  { id: 'atl-grd-4',  last: 'Tremblay',    first: 'Pierre',   linkedPlayerLast: 'Tremblay',    linkedPlayerFirst: 'Luc',      teamId: 'atl-u17' },
  { id: 'atl-grd-5',  last: 'Williams',    first: 'Sandra',   linkedPlayerLast: 'Williams',    linkedPlayerFirst: 'Jaylen',   teamId: 'atl-u17' },
  { id: 'atl-grd-6',  last: 'Okonkwo',     first: 'Emeka',    linkedPlayerLast: 'Okonkwo',     linkedPlayerFirst: 'Chidi',    teamId: 'atl-u17' },
  { id: 'atl-grd-7',  last: 'Santos',      first: 'Carlos',   linkedPlayerLast: 'Santos',      linkedPlayerFirst: 'Lucas',    teamId: 'atl-u17' },
  { id: 'atl-grd-8',  last: 'Patel',       first: 'Priya',    linkedPlayerLast: 'Patel',       linkedPlayerFirst: 'Aryan',    teamId: 'atl-u17' },
  { id: 'atl-grd-9',  last: 'Kowalski',    first: 'Anna',     linkedPlayerLast: 'Kowalski',    linkedPlayerFirst: 'Marek',    teamId: 'atl-u17' },
  { id: 'atl-grd-10', last: 'Johnson',     first: 'Marcus',   linkedPlayerLast: 'Johnson',     linkedPlayerFirst: 'Darius',   teamId: 'atl-u17' },
  // U-15 guardians
  { id: 'atl-grd-11', last: 'Nakamura',    first: 'Yuki',     linkedPlayerLast: 'Nakamura',    linkedPlayerFirst: 'Haruto',   teamId: 'atl-u15' },
  { id: 'atl-grd-12', last: 'Osei',        first: 'Kofi',     linkedPlayerLast: 'Osei',        linkedPlayerFirst: 'Kwabena',  teamId: 'atl-u15' },
  { id: 'atl-grd-13', last: 'Moreau',      first: 'Isabelle', linkedPlayerLast: 'Moreau',      linkedPlayerFirst: 'Théo',     teamId: 'atl-u15' },
  { id: 'atl-grd-14', last: 'Thompson',    first: 'Diane',    linkedPlayerLast: 'Thompson',    linkedPlayerFirst: 'Caleb',    teamId: 'atl-u15' },
  { id: 'atl-grd-15', last: 'Alvarez',     first: 'Roberto',  linkedPlayerLast: 'Alvarez',     linkedPlayerFirst: 'Mateo',    teamId: 'atl-u15' },
  { id: 'atl-grd-16', last: 'Eriksen',     first: 'Lars',     linkedPlayerLast: 'Eriksen',     linkedPlayerFirst: 'Mikkel',   teamId: 'atl-u15' },
  { id: 'atl-grd-17', last: 'Adeyemi',     first: 'Folake',   linkedPlayerLast: 'Adeyemi',     linkedPlayerFirst: 'Tunde',    teamId: 'atl-u15' },
  { id: 'atl-grd-18', last: 'Petrov',      first: 'Natasha',  linkedPlayerLast: 'Petrov',      linkedPlayerFirst: 'Alexei',   teamId: 'atl-u15' },
  { id: 'atl-grd-19', last: 'Washington',  first: 'Keisha',   linkedPlayerLast: 'Washington',  linkedPlayerFirst: 'Malik',    teamId: 'atl-u15' },
  { id: 'atl-grd-20', last: 'Fitzgerald',  first: 'Liam',     linkedPlayerLast: 'Fitzgerald',  linkedPlayerFirst: 'Ciarán',   teamId: 'atl-u15' },
]

// ─── Helpers ──────────────────────────────────────────────────────────────────
export function getAllIdsInPositions(positions) {
  return Object.values(positions).flat().map(p => p.id)
}

export function getAllIdsInTeam(team) {
  return getAllIdsInPositions(team.positions)
}

// ─── Custom groups ─────────────────────────────────────────────────────────────
// memberIds: array of contact IDs, or null = resolved dynamically to all club contacts
export const blastCustomGroups = [
  {
    id: 'cg1', clubId: 'atl',
    name: 'Travelling Party — Away to Orlando',
    memberCount: 23, lastUsed: '2 days ago',
    memberIds: [
      'atl-gk1', 'atl-gk2',
      'atl-df1', 'atl-df2', 'atl-df3', 'atl-df4', 'atl-df5', 'atl-df6', 'atl-df7', 'atl-df8',
      'atl-mf1', 'atl-mf2', 'atl-mf3', 'atl-mf4', 'atl-mf5', 'atl-mf6', 'atl-mf7', 'atl-mf8', 'atl-mf9',
      'atl-fw1', 'atl-fw2', 'atl-fw3',
      'atl-st1',
    ],
  },
  {
    id: 'cg2', clubId: 'atl',
    name: 'First Team Set Piece Group',
    memberCount: 12, lastUsed: 'Last week',
    memberIds: [
      'atl-df1', 'atl-df2', 'atl-df5', 'atl-df6',
      'atl-mf1', 'atl-mf2', 'atl-mf3', 'atl-mf7',
      'atl-fw1', 'atl-fw2', 'atl-fw4',
      'atl-st1',
    ],
  },
  {
    id: 'cg3', clubId: 'atl',
    name: 'Academy U-15 Leadership Group',
    memberCount: 5, lastUsed: '3 weeks ago',
    memberIds: [
      'atl-st11', 'atl-st12',
      'atl-u15-gk-p1', 'atl-u15-mf-p1', 'atl-u15-fw-p1',
    ],
  },
  {
    id: 'cg4', clubId: 'atl',
    name: 'All Club Contacts',
    memberCount: 508, lastUsed: 'Today',
    memberIds: null, // resolved to all available contacts in the club
  },
]

// ─── Club contacts helper ──────────────────────────────────────────────────────
// Returns all contacts in a club as a unified flat list with affiliation labels.
export function getAllClubContacts(clubData) {
  const teamMap = Object.fromEntries(clubData.teams.map(t => [t.id, t.name]))
  return [
    ...clubData.athletes.map(a => ({
      ...a,
      affiliation: teamMap[a.teamId] || 'Player',
      contactType: 'athlete',
    })),
    ...clubData.staff.map(s => ({
      ...s,
      affiliation: s.role,
      contactType: 'staff',
    })),
    ...clubData.guardians.map(g => ({
      ...g,
      affiliation: `Parent of ${g.linkedPlayerFirst} ${g.linkedPlayerLast}`,
      contactType: 'guardian',
    })),
  ]
}

// ─── Custom group accessors ────────────────────────────────────────────────────
// Returns pre-seeded groups for a club + any locally-created groups passed in.
export function getCustomGroupsForClub(clubId) {
  if (clubId === 'atl') return blastCustomGroups
  const seed = hashId(clubId)
  return [
    { id: `${clubId}-cg1`, clubId, name: 'Travelling Party', memberCount: 18 + (seed % 6), lastUsed: '3 days ago', memberIds: null },
    { id: `${clubId}-cg2`, clubId, name: 'First Team Group',  memberCount: 25 + (seed % 5), lastUsed: 'Last week',   memberIds: null },
  ]
}

// Resolves a group's memberIds to full contact objects with affiliation labels.
// If memberIds is null, returns all available contacts in the club.
export function resolveGroupMembers(group, clubData) {
  const all = getAllClubContacts(clubData)
  if (!group.memberIds) return all
  return group.memberIds.map(id => all.find(c => c.id === id)).filter(Boolean)
}

// ─── Reach computation ────────────────────────────────────────────────────────
export function computeReachFromIds(ids) {
  const total = ids.length
  let inApp = 0, email = 0, sms = 0
  for (const id of ids) {
    const h = hashId(id)
    if ((h % 10) < 9) inApp++
    if ((h % 10) < 9) email++
    if ((h % 10) < 5) sms++
  }
  return { total, inApp, email, sms }
}

// ─── Club data accessor ────────────────────────────────────────────────────────
// Returns { teams, athletes, staff, guardians } for any club.
// Atlanta returns real data; all other clubs return deterministic stubs.

const STUB_LAST_NAMES  = ['Anderson', 'Brown', 'Davis', 'Garcia', 'Harris', 'Jackson', 'Martinez', 'Miller', 'Taylor', 'Wilson']
const STUB_FIRST_NAMES = ['Alex', 'Blake', 'Casey', 'Drew', 'Evan', 'Jordan', 'Morgan', 'Quinn', 'Riley', 'Sam']
const STUB_ROLES       = ['Head Coach', 'Assistant Coach', 'GK Coach', 'Fitness Coach', 'Physiotherapist', 'Team Physician', 'Sports Scientist', 'Nutritionist', 'Video Analyst', 'Kit Manager', 'Academy Director', 'Head of Academy']

export function getClubData(clubId) {
  if (clubId === 'atl') {
    return {
      teams:     atlTeams,
      athletes:  atlAllAthletes,
      staff:     atlNamedStaff,
      guardians: atlGuardians,
    }
  }

  const seed  = hashId(clubId)
  const teams = [
    { id: `${clubId}-t1`, name: 'First Team' },
    { id: `${clubId}-t2`, name: 'Academy U-18' },
    { id: `${clubId}-t3`, name: 'Academy U-16' },
  ]

  const staff = Array.from({ length: 12 }, (_, i) => ({
    id:     `${clubId}-s${i + 1}`,
    last:   STUB_LAST_NAMES[(seed + i) % 10],
    first:  STUB_FIRST_NAMES[(seed + i * 3) % 10],
    role:   STUB_ROLES[i],
    status: 'Available',
    teamId: i < 6 ? teams[0].id : i < 10 ? teams[1].id : teams[2].id,
  }))

  const athletes = teams.flatMap((team, ti) =>
    Array.from({ length: 15 }, (_, i) => ({
      id:          `${clubId}-a-${ti}-${i}`,
      last:        STUB_LAST_NAMES[(seed + i + ti * 3) % 10],
      first:       STUB_FIRST_NAMES[(seed + i * 2 + ti) % 10],
      nationality: 'USA',
      status:      'Available',
      teamId:      team.id,
    }))
  )

  const guardians = Array.from({ length: 10 }, (_, i) => ({
    id:                 `${clubId}-g${i + 1}`,
    last:               STUB_LAST_NAMES[(seed + i * 4) % 10],
    first:              STUB_FIRST_NAMES[(seed + i * 6 + 1) % 10],
    linkedPlayerLast:   STUB_LAST_NAMES[(seed + i * 2 + 3) % 10],
    linkedPlayerFirst:  STUB_FIRST_NAMES[(seed + i * 5 + 2) % 10],
    status:             'Available',
    teamId:             teams[i % 2 === 0 ? 1 : 2].id,
  }))

  return { teams, athletes, staff, guardians }
}

// ─── Broadcast messages history (Upcoming + Past tabs) ───────────────────────
// Deterministic recipient name lists for tooltip rendering.
const SAMPLE_NAMES_LONG = [
  'Michael Anderson', 'Bill Bryson', 'David Carter', 'Sarah Mitchell', 'James Robinson',
  'Emma Thompson', 'Liam Walker', 'Olivia Hughes', 'Noah Bennett', 'Ava Murphy',
  'Ethan Wright', 'Sophia Reed', 'Lucas Patel', 'Mia Foster', 'Mason Cook',
  'Isabella Diaz', 'Logan Rivera', 'Charlotte Hayes', 'Aiden Russell', 'Amelia Powell',
  'Caleb Brooks', 'Harper Bailey', 'Owen Bell', 'Evelyn Ross', 'Henry Howard',
  'Abigail Long', 'Sebastian Ward', 'Emily Price', 'Jackson Sanders', 'Madison Reed',
]

const NAMES_FIRST_TEAM = [
  'Brad Guzan', 'Miles Robinson', 'Thiago Almada', 'Brooks Lennon', 'Caleb Wiley',
  'Josef Martinez', 'Marcelino Moreno', 'Saba Lobjanidze', 'Stian Gregersen', 'Luis Abram',
  'Juan Sanchez Purata', 'Emerson Hyndman', 'Osvaldo Alonso', 'Jake Mulraney', 'Andy Rios',
  'Bobby Shuttleworth', 'Rocco Rios Novo', 'George Jennings', 'Derrick Abubakar', 'Amar Slimani',
  'Caleb McCann', 'Leon Mueller', 'Machop Chol', 'Alex Rossetto', 'Jake Yow',
  'Coach Pineda', 'Coach Lattanzio', 'Coach Brockman',
]

const NAMES_U17_GUARDIANS = [
  'Sarah Mitchell', 'David Carter', 'Linda Bennett', 'James Robinson', 'Emma Thompson',
  'Maria Lopez', 'Daniel Brown', 'Rachel Green', 'Tom Walker', 'Karen Hughes',
  'Robert Patel', 'Jenny Cooper', 'Mike Fisher', 'Anna Reed', 'Paul Murphy',
  'Diane Foster', 'Steve Carter', 'Helen Wright', 'Jason Diaz', 'Carol Bell',
  'Andrew Bailey', 'Nicole Hayes', 'Greg Russell', 'Sandra Powell', 'Matt Brooks',
  'Jessica Ross', 'Brian Long', 'Tina Ward', 'Frank Price', 'Sue Sanders',
  'Mark Howard', 'Lisa Cook', 'Chris Reed', 'Wendy Rivera',
]

const NAMES_TRAVELLING = [
  'Brad Guzan', 'Miles Robinson', 'Thiago Almada', 'Brooks Lennon', 'Caleb Wiley',
  'Josef Martinez', 'Marcelino Moreno', 'Saba Lobjanidze', 'Stian Gregersen', 'Luis Abram',
  'Juan Sanchez Purata', 'Emerson Hyndman', 'Osvaldo Alonso', 'Coach Pineda',
  'Coach Lattanzio', 'Coach Brockman', 'Trainer Diaz', 'Physio Park', 'Kit Manager Lee',
  'Media Officer Cole', 'Doctor Patel', 'Team Manager Yates', 'Analyst Rivera',
]

const NAMES_HEAD_COACH = SAMPLE_NAMES_LONG.concat(
  ['Brad Guzan','Miles Robinson','Thiago Almada','Brooks Lennon','Caleb Wiley','Josef Martinez',
   'Marcelino Moreno','Saba Lobjanidze','Stian Gregersen','Luis Abram','Juan Sanchez Purata',
   'Emerson Hyndman','Osvaldo Alonso','Jake Mulraney','Andy Rios','Bobby Shuttleworth',
   'Rocco Rios Novo','George Jennings','Derrick Abubakar','Amar Slimani','Caleb McCann']
)

const NAMES_U15_GUARDIANS = [
  'Maria Lopez', 'Daniel Brown', 'Rachel Green', 'Tom Walker', 'Karen Hughes',
  'Robert Patel', 'Jenny Cooper', 'Mike Fisher', 'Anna Reed', 'Paul Murphy',
  'Diane Foster', 'Steve Carter', 'Helen Wright', 'Jason Diaz', 'Carol Bell',
  'Andrew Bailey', 'Nicole Hayes', 'Greg Russell', 'Sandra Powell', 'Matt Brooks',
  'Jessica Ross', 'Brian Long', 'Tina Ward', 'Frank Price', 'Sue Sanders',
  'Mark Howard', 'Lisa Cook', 'Chris Reed', 'Wendy Rivera', 'Adam Bennett',
  'Susan Walker', 'Kevin Hughes', 'Pamela Murphy', 'Roger Patel', 'Beth Cooper',
  'Donna Fisher', 'Ian Reed', 'Ellen Foster',
]

const NAMES_RECOVERY = [
  'Brad Guzan', 'Miles Robinson', 'Thiago Almada', 'Brooks Lennon', 'Caleb Wiley',
  'Josef Martinez', 'Marcelino Moreno', 'Saba Lobjanidze', 'Stian Gregersen', 'Luis Abram',
  'Juan Sanchez Purata', 'Emerson Hyndman', 'Osvaldo Alonso', 'Jake Mulraney', 'Andy Rios',
  'Bobby Shuttleworth', 'Rocco Rios Novo', 'George Jennings', 'Derrick Abubakar', 'Amar Slimani',
  'Caleb McCann', 'Leon Mueller', 'Machop Chol', 'Alex Rossetto', 'Jake Yow',
  'Coach Pineda', 'Coach Lattanzio', 'Trainer Diaz',
]

const NAMES_SC_UPDATE = [
  'Trainer Diaz', 'Physio Park', 'Coach Pineda', 'Coach Lattanzio', 'Coach Brockman',
  'Director Wilson', 'Analyst Rivera', 'Doctor Patel', 'Performance Lead Yates',
  'S&C Coach Adams', 'Nutritionist Long', 'Sports Scientist Reed',
]

// ─── Broadcast history rows ──────────────────────────────────────────────────
// scheduleType: 'immediate' | 'scheduled' | 'recurring'
// status:       'sent'      | 'scheduled' | 'recurring'  (used for chip)
export const blastSentMessages = [
  // ── Upcoming ────────────────────────────────────────────────────────────
  {
    id: 'up1',
    subject: 'Pre-season Welcome — First Team',
    body: 'Welcome back to the squad. Pre-season starts Monday — please review the schedule and bring full kit. Travel arrangements for the opening fixture will be confirmed next week.',
    recipientLabel: 'First Team · 28 recipients',
    recipientNames: NAMES_FIRST_TEAM.slice(0, 28),
    channels: ['inapp', 'email'],
    status: 'scheduled',
    scheduleType: 'scheduled',
    scheduledFor: '2026-06-02T08:00:00Z',
    sentBy: 'Sofia Chen',
    reach: { total: 28, inApp: 25, email: 27, sms: 0 },
  },
  {
    id: 'up2',
    subject: 'Academy U-17 Fixture Reminder',
    body: 'Friendly reminder for guardians: U-17 home fixture this Saturday at 11:00 AM. Please confirm attendance by Thursday evening.',
    recipientLabel: 'U-17 guardians · 34 recipients',
    recipientNames: NAMES_U17_GUARDIANS.slice(0, 34),
    channels: ['email'],
    status: 'recurring',
    scheduleType: 'recurring',
    scheduledFor: '2026-05-22T09:00:00Z',
    recurringPattern: 'Every Friday, 9:00 AM',
    sentBy: 'Sofia Chen',
    reach: { total: 34, inApp: 0, email: 33, sms: 0 },
  },
  {
    id: 'up3',
    subject: 'Travelling Party Kit Instructions',
    body: 'For the away fixture in Orlando: please arrive at the team hotel by 4:00 PM Friday. Bring travel kit, training gear, and recovery items. Full schedule attached.',
    recipientLabel: 'Travelling party · 23 recipients',
    recipientNames: NAMES_TRAVELLING.slice(0, 23),
    channels: ['email'],
    status: 'scheduled',
    scheduleType: 'scheduled',
    scheduledFor: '2026-05-28T15:00:00Z',
    sentBy: 'Sofia Chen',
    reach: { total: 23, inApp: 0, email: 22, sms: 0 },
  },
  // ── Past ────────────────────────────────────────────────────────────────
  {
    id: 'past1',
    subject: 'Head Coach Announcement',
    body: 'We are pleased to announce our new Head Coach effective from the upcoming pre-season. A full statement and welcome event details will follow.',
    recipientLabel: 'All club contacts · 508 recipients',
    recipientNames: NAMES_HEAD_COACH,
    channels: ['inapp', 'email'],
    status: 'sent',
    scheduleType: 'scheduled',
    scheduledFor: '2026-05-14T10:00:00Z',
    sentAt: '2026-05-14T10:00:00Z',
    sentBy: 'Sofia Chen',
    reach: { total: 508, inApp: 460, email: 495, sms: 0 },
  },
  {
    id: 'past2',
    subject: 'U-15 Fixture Location Change',
    body: 'Important update for guardians: the U-15 away fixture this Saturday has been moved from the original venue to the indoor training facility. Kick-off remains 10:00 AM.',
    recipientLabel: 'U-15 guardians · 38 recipients',
    recipientNames: NAMES_U15_GUARDIANS.slice(0, 38),
    channels: ['email'],
    status: 'sent',
    scheduleType: 'scheduled',
    scheduledFor: '2026-05-10T16:00:00Z',
    sentAt: '2026-05-10T16:00:00Z',
    sentBy: 'Sofia Chen',
    reach: { total: 38, inApp: 0, email: 37, sms: 0 },
  },
  {
    id: 'past3',
    subject: 'Recovery Session Reminder',
    body: 'Recovery session in the pool tomorrow morning at 8:30 AM. Bring swimwear and towel. Light breakfast available afterwards.',
    recipientLabel: 'First Team · 28 recipients',
    recipientNames: NAMES_RECOVERY,
    channels: ['inapp'],
    status: 'sent',
    scheduleType: 'scheduled',
    scheduledFor: '2026-05-07T18:00:00Z',
    sentAt: '2026-05-07T18:00:00Z',
    sentBy: 'Sofia Chen',
    reach: { total: 28, inApp: 27, email: 0, sms: 0 },
  },
  {
    id: 'past4',
    subject: 'Strength & Conditioning Update',
    body: 'Updated S&C protocol for this week is now available. Please review before tomorrow morning. Questions to me directly.',
    recipientLabel: 'S&C team · 12 recipients',
    recipientNames: NAMES_SC_UPDATE,
    channels: ['email'],
    status: 'sent',
    scheduleType: 'immediate',
    sentAt: '2026-05-05T11:42:00Z',
    sentBy: 'Sofia Chen',
    reach: { total: 12, inApp: 0, email: 12, sms: 0 },
  },
]
