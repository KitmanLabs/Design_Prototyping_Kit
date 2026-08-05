// Mock data for the "AI Form Summary" prototype on the Forms > Responses tab.
// Self-contained — this prototype does not connect to the rest of the app's data.
// Per project conventions, all mock data / fixtures live in src/data/.

// ——— Dimension lists ———
export const playerOptions = [
  'Harry Anderson',
  'Bill Bryson',
  'Bernard William',
  'Eric Xavier',
  'Marcus Reed',
  'Tyrell Johnson',
  'Andre Coleman',
  'Devin Brooks',
  'Jamal Foster',
  'Carlos Mendez',
  "Liam O'Connor",
  'Nathan Pierce',
  'Owen Castle',
  'Isaac Bennett',
]

export const formOptions = [
  'Medical Assessment',
  'Preseason Assessment',
  'Training',
  'Transfer Screening',
  'End of Season Survey',
  'Wellness Check',
  'Psychological Health Check',
  'Strength Assessment',
]

export const productAreaOptions = [
  'Medical',
  'Training',
  'Assessment',
  'Rehabilitation',
  'Administrative',
]

export const examinerOptions = [
  'Malcolm Tucker',
  'Dr. Sarah Walker',
  'Coach Emily Davis',
  'Dr. Andrew Kim',
]

export const statusOptions = ['Complete', 'In Progress', 'Pending']

export const rosterOptions = ['Active Roster', 'Practice Squad', 'Injured Reserve']

const dates = [
  { iso: '2025-10-05', label: 'Oct 5, 2025' },
  { iso: '2025-10-22', label: 'Oct 22, 2025' },
  { iso: '2025-11-08', label: 'Nov 8, 2025' },
  { iso: '2025-11-19', label: 'Nov 19, 2025' },
  { iso: '2025-12-02', label: 'Dec 2, 2025' },
  { iso: '2025-12-18', label: 'Dec 18, 2025' },
  { iso: '2026-01-09', label: 'Jan 9, 2026' },
  { iso: '2026-01-22', label: 'Jan 22, 2026' },
  { iso: '2026-02-04', label: 'Feb 4, 2026' },
  { iso: '2026-02-17', label: 'Feb 17, 2026' },
]

// ——— Data grid rows ———
// First four rows preserve the original spec fixtures; the remainder are
// generated with deterministic modulo spread so every filter value matches
// multiple rows (≥ 3 per player, ≥ 4 per form / examiner / status / roster).
const fixedRows = [
  { player: 'Harry Anderson', formName: 'Medical Assessment', productArea: 'Medical', category: 'Medical', examiner: 'Malcolm Tucker', completion: 'Jan 31, 2026', date: '2026-01-31', status: 'Complete', roster: 'Active Roster' },
  { player: 'Bill Bryson', formName: 'Preseason Assessment', productArea: 'Medical', category: 'Medical', examiner: 'Malcolm Tucker', completion: 'Jan 31, 2026', date: '2026-01-31', status: 'Complete', roster: 'Active Roster' },
  { player: 'Bernard William', formName: 'Training', productArea: 'Medical', category: 'Medical', examiner: 'Malcolm Tucker', completion: 'Jan 31, 2026', date: '2026-01-31', status: 'In Progress', roster: 'Practice Squad' },
  { player: 'Eric Xavier', formName: 'Transfer Screening', productArea: 'Medical', category: 'Medical', examiner: 'Malcolm Tucker', completion: 'Jan 31, 2026', date: '2026-01-31', status: 'Complete', roster: 'Active Roster' },
]

const generatedRows = Array.from({ length: 32 }, (_, j) => {
  const d = dates[j % dates.length]
  return {
    player: playerOptions[j % playerOptions.length],
    formName: formOptions[j % formOptions.length],
    productArea: productAreaOptions[j % productAreaOptions.length],
    category: productAreaOptions[(j + 2) % productAreaOptions.length],
    examiner: examinerOptions[j % examinerOptions.length],
    completion: d.label,
    date: d.iso,
    status: statusOptions[j % statusOptions.length],
    roster: rosterOptions[j % rosterOptions.length],
  }
})

export const responseRows = [...fixedRows, ...generatedRows].map((r, i) => ({
  id: `r${i + 1}`,
  ...r,
}))

// ——— AI summary content (mocked) ———
// Structure mirrors the panel layout: findings, then recommendations split into
// "Immediate Actions" and "Diagnostic Next Steps".
export const aiSummary = {
  sectionTitle: 'Athlete Medical Summary',
  findings: [
    {
      title: 'Concussion History',
      body: 'Significant history of concussion. Sustained a concussion in high school (2012) resulting in loss of consciousness and hospitalization for concussion on March 11, 2025.',
    },
    {
      title: 'Musculoskeletal History',
      body: 'Right Low Back: History of imaging (X-ray, MRI, CT, or bone scan) performed on December 24, 2024 for chronic issues.',
    },
    {
      title: 'Vaccination Status',
      body: 'Incomplete vaccination history: Mumps: Unknown, Pneumonia: Tetanus: No',
    },
  ],
  recommendations: {
    immediateActions: [
      'Player should be immediately held from all contact and throwing activities.',
      'Urgent comprehensive orthopedic evaluation of the right shoulder is required.',
      'Urgent comprehensive neurological evaluation, including a detailed concussion assessment, is required.',
    ],
    diagnosticNextSteps: [
      'Obtain an MRI of the right shoulder to assess rotator cuff integrity and extent of injury.',
      'Conduct a full neuropsychological assessment (e.g., ImPACT testing) and a thorough neurological examination to evaluate sequelae of the recent concussion.',
      'Review medical records from the March 11, 2025 concussion hospitalization.',
    ],
  },
}
