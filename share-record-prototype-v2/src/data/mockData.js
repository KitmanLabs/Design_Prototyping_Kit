// Mock data for the Share Record prototype. Placeholder only — swap for real data later.

// Club shown in the top navigation bar.
export const currentClub = { name: 'Riverside Raiders', initials: 'RR' }

// The demo share record the recipient view reads on load. Recipients reach
// this view via a fresh link (or after signing back in), which is a fresh
// page load — any in-progress sender-side ShareContext state is gone by
// then, so this view must not depend on it. This is the persisted stand-in.
export const sharedRecordConfig = { allowComments: true }

// Athlete roster shown on the Manage Athletes grid.
// Bio fields (dob, age, country, height) drive the Prepare Shared Record profile header.
// `status` drives the StatusChip; it is not shown in the grid.
export const athletes = [
  { id: 'a1', name: 'Ethan Carter', rosterPosition: 'Quarterback (QB)', roster: 'First Team', squads: ['First Team', 'Practice Squad'], labels: ['Veteran'], status: 'available', active: true, dob: '14 Mar 1998', age: 28, country: 'United States', height: `6'3"` },
  { id: 'a2', name: 'Mason Brooks', rosterPosition: 'Wide Receiver (WR)', roster: 'First Team', squads: ['First Team', 'Special Teams'], labels: ['Captain'], status: 'available', active: true, dob: '22 Jul 2000', age: 25, country: 'United States', height: `6'1"` },
  { id: 'a3', name: 'Noah Mitchell', rosterPosition: 'Running Back (RB)', roster: 'Offense', squads: ['Offense', 'Red Zone Unit'], labels: ['Rookie'], status: 'available', active: true, dob: '05 Nov 2001', age: 24, country: 'Canada', height: `5'11"` },
  { id: 'a4', name: 'Liam Walker', rosterPosition: 'Tight End (TE)', roster: 'First Team', squads: ['First Team'], labels: [], status: 'available', active: true, dob: '18 Jan 1999', age: 27, country: 'United States', height: `6'5"` },
  { id: 'a5', name: 'Jackson Reed', rosterPosition: 'Linebacker (LB)', roster: 'Defense', squads: ['Defense', 'Kick Coverage', 'Leadership Group'], labels: ['Starter'], status: 'available', active: true, dob: '30 Sep 1997', age: 28, country: 'United States', height: `6'2"` },
  { id: 'a6', name: 'Benjamin Hayes', rosterPosition: 'Cornerback (CB)', roster: 'Defense', squads: ['Defense', 'Special Teams'], labels: ['Injured Reserve'], status: 'unavailable', active: true, dob: '12 Feb 2002', age: 24, country: 'Jamaica', height: `5'10"` },
  { id: 'a7', name: 'Caleb Foster', rosterPosition: 'Safety (S)', roster: 'Defense', squads: ['Defense', 'Secondary Unit'], labels: ['Veteran'], status: 'available', active: true, dob: '08 Aug 1996', age: 29, country: 'United States', height: `6'0"` },
  { id: 'a8', name: 'Owen Parker', rosterPosition: 'Offensive Tackle (OT)', roster: 'Offensive Line', squads: ['Offensive Line', 'First Team'], labels: [], status: 'limited', active: true, dob: '25 Apr 1995', age: 31, country: 'United States', height: `6'6"` },
  { id: 'a9', name: 'Lucas Bennett', rosterPosition: 'Defensive End (DE)', roster: 'Defense', squads: ['Pass Rush Unit', 'Defense'], labels: ['Development'], status: 'available', active: true, dob: '03 Dec 2000', age: 25, country: 'Germany', height: `6'4"` },
  { id: 'a10', name: 'Logan Murphy', rosterPosition: 'Kicker (K)', roster: 'Special Teams', squads: ['Special Teams'], labels: ['Captain'], status: 'available', active: true, dob: '19 Jun 1994', age: 32, country: 'Ireland', height: `5'9"` },
  { id: 'a11', name: 'Dylan Cooper', rosterPosition: 'Long Snapper (LS)', roster: 'Special Teams', squads: ['Special Teams'], labels: [], status: 'available', active: true, dob: '27 Oct 1998', age: 27, country: 'United States', height: `6'1"` },
  { id: 'a12', name: 'Aiden Sullivan', rosterPosition: 'Fullback (FB)', roster: 'Offense', squads: ['Offense', 'Goal Line Package'], labels: ['Rookie'], status: 'available', active: true, dob: '15 Sep 2001', age: 24, country: 'Australia', height: `6'0"` },
]

// Distinct labels across the roster — used by the Labels filter.
export const allLabels = [...new Set(athletes.flatMap((a) => a.labels))].sort()

// Mock share history for the Manage Medical Record drawer (athleteId -> shares).
// `permission` matches a sharePermissions value; `duration` matches a shareDurations
// value ('custom' means `until` was hand-picked rather than computed from `date`).
export const shareHistory = {
  a1: [
    { id: 's1', physician: 'Dr. Emily Carter', organization: 'St. Vincent’s Sports Medicine', date: '12 May 2026', permission: 'view', duration: '30d', until: '11 Jun 2026' },
    { id: 's2', physician: 'Dr. James Whitfield', organization: 'Elite Performance Clinic', date: '02 Apr 2026', permission: 'notes', duration: '30d', until: '02 May 2026' },
  ],
  a2: [
    { id: 's3', physician: 'Dr. Priya Nair', organization: 'National Rehabilitation Institute', date: '28 Mar 2026', permission: 'view', duration: '30d', until: '27 Apr 2026' },
  ],
  a5: [
    { id: 's4', physician: 'Dr. Hannah Schmidt', organization: 'City General Hospital', date: '19 May 2026', permission: 'notes', duration: '30d', until: '18 Jun 2026' },
    { id: 's5', physician: 'Dr. Marco Rossi', organization: 'Apex Orthopaedics', date: '01 May 2026', permission: 'view', duration: '30d', until: '31 May 2026' },
    { id: 's6', physician: 'Dr. Emily Carter', organization: 'St. Vincent’s Sports Medicine', date: '15 Jan 2026', permission: 'view', duration: 'custom', until: '01 Mar 2026' },
  ],
}

// Permission levels offered in the Share Setup drawer and the Manage record edit panel.
export const sharePermissions = [
  { value: 'view', label: 'View only' },
  { value: 'notes', label: 'Can add notes' },
]

// "Share for" durations offered in the Share Setup drawer and the Manage record edit panel.
export const shareDurations = [
  { value: '3d', label: '3 days' },
  { value: '7d', label: '7 days' },
  { value: '30d', label: '30 days' },
  { value: 'custom', label: 'Custom' },
]

export const physicians = [
  'Dr. Emily Carter',
  'Dr. James Whitfield',
  'Dr. Priya Nair',
  'Dr. Liam O’Sullivan',
  'Dr. Hannah Schmidt',
  'Dr. Marco Rossi',
]

export const organizations = [
  'St. Vincent’s Sports Medicine',
  'Elite Performance Clinic',
  'National Rehabilitation Institute',
  'City General Hospital',
  'Apex Orthopaedics',
]

// Information categories offered in the Share Setup drawer (order matters).
export const infoCategories = [
  'Injury/Illness',
  'Clinical Notes',
  'Diagnostics',
  'Rehabilitation',
  'Medications',
  'Procedures',
  'Documents',
]

// Tab labels used in the Prepare Shared Record preview (drawer category -> tab label).
export const categoryTabLabels = {
  'Injury/Illness': 'Injury / Illness',
  'Clinical Notes': 'Notes',
  Diagnostics: 'Diagnostics',
  Rehabilitation: 'Rehabilitation',
  Medications: 'Medications',
  Procedures: 'Procedures',
  Documents: 'Documents',
}

// Sample records per category — rendered as cards in the preview tabs.
// `tag` renders as a chip; `icon` (Documents) renders a leading file icon.
export const sampleRecords = {
  'Injury/Illness': [
    { id: 'inj1', title: 'ACL tear — left knee', meta: 'Left knee · 12 May 2026', tag: 'Recovering' },
    { id: 'inj2', title: 'Ankle sprain (lateral)', meta: 'Left ankle · 03 Feb 2026', tag: 'Resolved' },
    { id: 'inj3', title: 'Lower back tightness', meta: 'Lumbar · 18 Jan 2026', tag: 'Monitoring' },
  ],
  'Clinical Notes': [
    { id: 'note1', title: 'Initial assessment', meta: 'Dr. Emily Carter · 12 May 2026' },
    { id: 'note2', title: 'MRI review', meta: 'Dr. James Whitfield · 19 May 2026' },
    { id: 'note3', title: 'Rehabilitation progress note', meta: 'Physio · 26 May 2026' },
  ],
  Diagnostics: [
    { id: 'diag1', title: 'MRI — left knee', meta: 'Imaging · 13 May 2026' },
    { id: 'diag2', title: 'Blood panel', meta: 'Lab · 20 Apr 2026' },
  ],
  Rehabilitation: [
    { id: 'rehab1', title: 'Phase 1 loading programme', meta: 'Physio · started 14 May 2026' },
    { id: 'rehab2', title: 'Return-to-run protocol', meta: 'Physio · started 22 May 2026' },
  ],
  Medications: [
    { id: 'med1', title: 'Ibuprofen 400mg', meta: 'Anti-inflammatory · twice daily · since 12 May 2026' },
    { id: 'med2', title: 'Vitamin D supplement', meta: 'Daily · ongoing' },
  ],
  Procedures: [
    { id: 'proc1', title: 'Arthroscopy — left knee', meta: 'Orthopaedics · 15 May 2026' },
  ],
  Documents: [
    { id: 'doc1', title: 'MRI report.pdf', meta: 'PDF · 1.2 MB · 13 May 2026', icon: 'picture_as_pdf' },
    { id: 'doc2', title: 'Consent form.pdf', meta: 'PDF · 240 KB · 12 May 2026', icon: 'description' },
  ],
}
