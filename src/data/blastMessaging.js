// Blast messaging mock data – LA Galaxy MLS context
// Sender persona: Academy Director, LA Galaxy

const av = (id) => `https://i.pravatar.cc/200?u=blast-${id}`

// ─── MLS Clubs ────────────────────────────────────────────────────────────────
// All 30 MLS clubs with simplified member counts for the picker
export const mlsClubs = [
  { id: 'atl',  name: 'Atlanta United FC',          abbr: 'ATL',  color: '#80000A', memberCount: 78 },
  { id: 'aus',  name: 'Austin FC',                  abbr: 'ATX',  color: '#00B140', memberCount: 62 },
  { id: 'mtl',  name: 'CF Montréal',                abbr: 'MTL',  color: '#003DA5', memberCount: 71 },
  { id: 'clt',  name: 'Charlotte FC',               abbr: 'CLT',  color: '#1A85C8', memberCount: 58 },
  { id: 'chi',  name: 'Chicago Fire FC',             abbr: 'CHI',  color: '#7A2433', memberCount: 65 },
  { id: 'col',  name: 'Colorado Rapids',             abbr: 'COL',  color: '#960A2C', memberCount: 60 },
  { id: 'clb',  name: 'Columbus Crew',               abbr: 'CLB',  color: '#FEF200', memberCount: 67 },
  { id: 'dc',   name: 'D.C. United',                 abbr: 'DC',   color: '#EF3E42', memberCount: 63 },
  { id: 'cin',  name: 'FC Cincinnati',               abbr: 'CIN',  color: '#003087', memberCount: 69 },
  { id: 'dal',  name: 'FC Dallas',                   abbr: 'DAL',  color: '#E81F3E', memberCount: 72 },
  { id: 'hou',  name: 'Houston Dynamo FC',           abbr: 'HOU',  color: '#F36F21', memberCount: 64 },
  { id: 'mia',  name: 'Inter Miami CF',              abbr: 'MIA',  color: '#F7B5CD', memberCount: 74 },
  { id: 'lag',  name: 'LA Galaxy',                   abbr: 'LA',   color: '#00245D', memberCount: 81 },
  { id: 'lafc', name: 'Los Angeles FC',              abbr: 'LAFC', color: '#C39E6D', memberCount: 76 },
  { id: 'min',  name: 'Minnesota United FC',         abbr: 'MIN',  color: '#8CD2F4', memberCount: 61 },
  { id: 'nsh',  name: 'Nashville SC',                abbr: 'NSH',  color: '#ECE83A', memberCount: 66 },
  { id: 'ne',   name: 'New England Revolution',      abbr: 'NE',   color: '#CE0E2D', memberCount: 68 },
  { id: 'nyc',  name: 'New York City FC',            abbr: 'NYC',  color: '#6CACE4', memberCount: 70 },
  { id: 'rbny', name: 'New York Red Bulls',          abbr: 'RBNY', color: '#ED1E36', memberCount: 73 },
  { id: 'orl',  name: 'Orlando City SC',             abbr: 'ORL',  color: '#612B9B', memberCount: 62 },
  { id: 'phi',  name: 'Philadelphia Union',          abbr: 'PHI',  color: '#071B2C', memberCount: 67 },
  { id: 'por',  name: 'Portland Timbers',            abbr: 'POR',  color: '#004812', memberCount: 69 },
  { id: 'rsl',  name: 'Real Salt Lake',              abbr: 'RSL',  color: '#B30838', memberCount: 63 },
  { id: 'sdc',  name: 'San Diego FC',                abbr: 'SD',   color: '#004C97', memberCount: 55 },
  { id: 'sj',   name: 'San Jose Earthquakes',        abbr: 'SJ',   color: '#0D4C92', memberCount: 61 },
  { id: 'sea',  name: 'Seattle Sounders FC',         abbr: 'SEA',  color: '#5D9732', memberCount: 75 },
  { id: 'skc',  name: 'Sporting Kansas City',        abbr: 'SKC',  color: '#93B4D9', memberCount: 64 },
  { id: 'stl',  name: 'St. Louis City SC',           abbr: 'STL',  color: '#EE3124', memberCount: 57 },
  { id: 'tor',  name: 'Toronto FC',                  abbr: 'TOR',  color: '#E31937', memberCount: 68 },
  { id: 'van',  name: 'Vancouver Whitecaps FC',      abbr: 'VAN',  color: '#00245D', memberCount: 65 },
]

// ─── Atlanta United FC – full club detail ──────────────────────────────────────
// Position-grouped players for the First Team (25 players)

const atlPlayers = {
  firstTeam: {
    Goalkeeper: [
      { id: 'atl-gk1', last: 'Guzan',        first: 'Brad',       nationality: 'USA',  status: 'Available' },
      { id: 'atl-gk2', last: 'Rios Novo',    first: 'Rocco',      nationality: 'ARG',  status: 'Available' },
      { id: 'atl-gk3', last: 'Shuttleworth', first: 'Bobby',      nationality: 'USA',  status: 'Available' },
    ],
    Defender: [
      { id: 'atl-df1', last: 'Robinson',     first: 'Miles',      nationality: 'USA',  status: 'Available' },
      { id: 'atl-df2', last: 'Lennon',       first: 'Brooks',     nationality: 'USA',  status: 'Available' },
      { id: 'atl-df3', last: 'Abram',        first: 'Luis',       nationality: 'PER',  status: 'Available' },
      { id: 'atl-df4', last: 'Sanchez Purata', first: 'Juan Jose', nationality: 'MEX', status: 'Available' },
      { id: 'atl-df5', last: 'Gregersen',    first: 'Stian',      nationality: 'NOR',  status: 'Available' },
      { id: 'atl-df6', last: 'Wiley',        first: 'Caleb',      nationality: 'USA',  status: 'Available' },
      { id: 'atl-df7', last: 'Jennings',     first: 'George',     nationality: 'TRI',  status: 'Available' },
      { id: 'atl-df8', last: 'Yow',          first: 'Jake',       nationality: 'USA',  status: 'Available' },
    ],
    Midfielder: [
      { id: 'atl-mf1', last: 'Almada',       first: 'Thiago',     nationality: 'ARG',  status: 'Available' },
      { id: 'atl-mf2', last: 'Moreno',       first: 'Marcelino',  nationality: 'ARG',  status: 'Available' },
      { id: 'atl-mf3', last: 'Hyndman',      first: 'Emerson',    nationality: 'USA',  status: 'Available' },
      { id: 'atl-mf4', last: 'Alonso',       first: 'Osvaldo',    nationality: 'CUB',  status: 'Available' },
      { id: 'atl-mf5', last: 'Abubakar',     first: 'Derrick',    nationality: 'USA',  status: 'Available' },
      { id: 'atl-mf6', last: 'Slimani',      first: 'Amar',       nationality: 'ALG',  status: 'Available' },
      { id: 'atl-mf7', last: 'McCann',       first: 'Caleb',      nationality: 'USA',  status: 'Available' },
      { id: 'atl-mf8', last: 'Lobjanidze',   first: 'Saba',       nationality: 'GEO',  status: 'Available' },
      { id: 'atl-mf9', last: 'Mueller',      first: 'Leon',       nationality: 'GER',  status: 'Available' },
    ],
    Forward: [
      { id: 'atl-fw1', last: 'Martinez',     first: 'Josef',      nationality: 'VEN',  status: 'Available' },
      { id: 'atl-fw2', last: 'Mulraney',     first: 'Jake',       nationality: 'SCO',  status: 'Available' },
      { id: 'atl-fw3', last: 'Rios',         first: 'Andy',       nationality: 'COL',  status: 'Available' },
      { id: 'atl-fw4', last: 'Chol',         first: 'Machop',     nationality: 'AUS',  status: 'Available' },
      { id: 'atl-fw5', last: 'Rossetto',     first: 'Alex',       nationality: 'USA',  status: 'Available' },
    ],
  },
}

// Simplified squads (no position breakdown, just counts)
const makeSimpleTeam = (prefix, count) => Array.from({ length: count }, (_, i) => ({
  id: `${prefix}-p${i + 1}`,
  last: `Player`,
  first: `${i + 1}`,
  nationality: 'USA',
  status: 'Available',
  positionGroup: ['Goalkeeper','Defender','Midfielder','Forward'][i % 4],
}))

const makeStaffSection = (prefix, names) => names.map((n, i) => ({
  id: `${prefix}-s${i + 1}`,
  last: n.split(', ')[0],
  first: n.split(', ')[1] || '',
  role: n,
  status: 'Available',
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
        Goalkeeper: makeSimpleTeam('atl2-gk', 2),
        Defender:   makeSimpleTeam('atl2-df', 7),
        Midfielder: makeSimpleTeam('atl2-mf', 8),
        Forward:    makeSimpleTeam('atl2-fw', 5),
      },
    },
    {
      id: 'atl-u19',
      name: 'Academy U-19',
      memberCount: 20,
      positions: {
        Goalkeeper: makeSimpleTeam('atlu19-gk', 2),
        Defender:   makeSimpleTeam('atlu19-df', 6),
        Midfielder: makeSimpleTeam('atlu19-mf', 7),
        Forward:    makeSimpleTeam('atlu19-fw', 5),
      },
    },
    {
      id: 'atl-u17',
      name: 'Academy U-17',
      memberCount: 20,
      positions: {
        Goalkeeper: makeSimpleTeam('atlu17-gk', 2),
        Defender:   makeSimpleTeam('atlu17-df', 6),
        Midfielder: makeSimpleTeam('atlu17-mf', 7),
        Forward:    makeSimpleTeam('atlu17-fw', 5),
      },
    },
    {
      id: 'atl-u15',
      name: 'Academy U-15',
      memberCount: 20,
      positions: {
        Goalkeeper: makeSimpleTeam('atlu15-gk', 2),
        Defender:   makeSimpleTeam('atlu15-df', 6),
        Midfielder: makeSimpleTeam('atlu15-mf', 7),
        Forward:    makeSimpleTeam('atlu15-fw', 5),
      },
    },
  ],
  staffSections: [
    { id: 'atl-coaching', name: 'Coaching', memberCount: 5 },
    { id: 'atl-medical',  name: 'Medical',  memberCount: 4 },
    { id: 'atl-sc',       name: 'S&C',      memberCount: 3 },
    { id: 'atl-admin',    name: 'Admin',    memberCount: 4 },
    { id: 'atl-ops',      name: 'Ops',      memberCount: 3 },
  ],
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
// Get all player IDs from a position map
export function getAllIdsInPositions(positions) {
  return Object.values(positions).flat().map(p => p.id)
}

export function getAllIdsInTeam(team) {
  return getAllIdsInPositions(team.positions)
}

// ─── Custom groups ─────────────────────────────────────────────────────────────
export const blastCustomGroups = [
  {
    id: 'cg1',
    name: 'Travelling Party — Away to Orlando',
    memberCount: 23,
    lastUsed: '2 days ago',
    reach: { total: 23, inApp: 21, email: 22, sms: 9 },
  },
  {
    id: 'cg2',
    name: 'First Team Set Piece Group',
    memberCount: 12,
    lastUsed: 'Last week',
    reach: { total: 12, inApp: 12, email: 11, sms: 5 },
  },
  {
    id: 'cg3',
    name: 'Academy U-15 Leadership Group',
    memberCount: 5,
    lastUsed: '3 weeks ago',
    reach: { total: 5, inApp: 4, email: 5, sms: 2 },
  },
  {
    id: 'cg4',
    name: 'All Club Contacts (LA Galaxy)',
    memberCount: 508,
    lastUsed: 'Last month',
    reach: { total: 508, inApp: 461, email: 492, sms: 284 },
  },
]

// ─── Reach computation ────────────────────────────────────────────────────────
// Each selected ID contributes to counts; we simulate channel availability
// by hashing the ID for consistent results

function hashId(id) {
  let h = 0
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0
  return h
}

export function computeReachFromIds(ids) {
  const total = ids.length
  let inApp = 0, email = 0, sms = 0
  for (const id of ids) {
    const h = hashId(id)
    if ((h % 10) < 9) inApp++   // 90% have app
    if ((h % 10) < 9) email++   // ~90% have email
    if ((h % 10) < 5) sms++     // ~50% have SMS
  }
  return { total, inApp, email, sms }
}

// ─── Sent blast messages (manage messages list) ────────────────────────────────
export const blastSentMessages = [
  {
    id: 'sent1',
    subject: 'Training cancelled — Thursday session',
    body: "Due to the weather forecast and pitch conditions at StubHub Center, Thursday's training session (3:30 PM) has been cancelled.",
    recipientLabel: 'U-15 · U-17 · 47 recipients',
    channels: ['inapp', 'email'],
    sentAt: '2026-05-12T14:30:00Z',
    sentBy: 'Sofia Chen',
    status: 'sent',
    reach: { total: 47, inApp: 43, email: 45, sms: 0 },
  },
  {
    id: 'sent2',
    subject: 'U-15 fixture update — pitch change',
    body: 'The U-15 home fixture against the Portland Timbers academy on Saturday (10:00 AM) has been moved from Pitch 3 to the indoor facility due to waterlogged turf.',
    recipientLabel: 'U-15 players + guardians · 60 recipients',
    channels: ['inapp', 'email'],
    sentAt: '2026-05-11T09:15:00Z',
    sentBy: 'Sofia Chen',
    status: 'sent',
    reach: { total: 60, inApp: 19, email: 53, sms: 0 },
  },
  {
    id: 'sched1',
    subject: 'Academy Awards Night — save the date',
    body: "You're invited to the LA Galaxy Academy end-of-season awards ceremony on Friday 30 May at 7:00 PM.",
    recipientLabel: 'All club contacts · 156 recipients',
    channels: ['inapp', 'email', 'sms'],
    scheduledFor: '2026-05-16T09:00:00Z',
    sentBy: 'Sofia Chen',
    status: 'scheduled',
    reach: { total: 156, inApp: 141, email: 149, sms: 88 },
  },
  {
    id: 'sent3',
    subject: 'Reminder: medical screenings this week',
    body: 'All U-15 and U-17 players must attend their scheduled pre-season medical screening this week.',
    recipientLabel: 'U-15 · U-17 · 45 recipients',
    channels: ['inapp', 'sms'],
    sentAt: '2026-05-08T10:00:00Z',
    sentBy: 'Sofia Chen',
    status: 'sent',
    reach: { total: 45, inApp: 41, email: 0, sms: 18 },
  },
]
