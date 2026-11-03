// Mock data and option lists for the Forms pages and drawers (no backend).
// All mock data lives in src/data (see PROJECT_STANDARDS).

// Used by: pages/forms/FormsPage.jsx
export const completedRowsData = [
  { id: 467635, athleteName: 'Bhuvan Bhatt', formName: 'Test Signature Form', productArea: 'General', category: 'Other', examiner: 'Bhuvan Bhatt', completionDate: '31 Jan 2026', formStatus: 'Complete' },
  { id: 467634, athleteName: 'Akanksha', formName: 'Test - Toggle Switch', productArea: 'Medical', category: 'Other', examiner: 'Benny Gordon-admin-eu', completionDate: '30 Jan 2026', formStatus: 'Complete' },
  { id: 467633, athleteName: 'Benny Gordon', formName: 'Test - Toggle Switch', productArea: 'Medical', category: 'Other', examiner: 'Benny Gordon-admin-eu', completionDate: '26 Sep 2025', formStatus: 'In progress' },
  { id: 467632, athleteName: 'Marcus Johnson', formName: 'Daily Wellness Check', productArea: 'Performance', category: 'Wellbeing', examiner: 'Performance', completionDate: '24 Feb 2026', formStatus: 'Complete' },
  { id: 467631, athleteName: 'Elena Rodriguez', formName: 'Pre-Season Medical Screening', productArea: 'Medical', category: 'Medical', examiner: 'Dr. Sarah Mitchell', completionDate: '20 Feb 2026', formStatus: 'Not started' },
  { id: 467630, athleteName: 'David Chen', formName: 'Training Load Monitoring', productArea: 'Performance', category: 'Wellbeing', examiner: 'Performance', completionDate: '18 Feb 2026', formStatus: 'In progress' },
  { id: 467629, athleteName: 'James Wilson', formName: 'Scholarship Reviews', productArea: 'Medical', category: 'Other', examiner: 'Saar Byrne-admin-eu', completionDate: '15 Feb 2026', formStatus: 'Complete' },
  { id: 467628, athleteName: 'Emma Brown', formName: 'Consent and Data Release', productArea: 'General', category: 'Other', examiner: 'Sporting Operations', completionDate: '10 Feb 2026', formStatus: 'Not started' },
  { id: 467627, athleteName: 'Liam Davis', formName: 'Post-Game RPE', productArea: 'Performance', category: 'Other', examiner: 'Coaching', completionDate: '8 Feb 2026', formStatus: 'Complete' },
  { id: 467626, athleteName: 'Sophie Miller', formName: 'Concussion Protocol', productArea: 'Medical', category: 'Medical', examiner: 'Medical', completionDate: '5 Feb 2026', formStatus: 'Complete' }
]

// Used by: pages/forms/FormsPage.jsx
export const complianceRowsData = [
  { id: 'c-1', athleteName: 'Ethan Walker', position: 'Inside Centre', dob: '14 Mar 2001', complete: 3, total: 10, lastUpdated: '24 Feb 2026', subRows: [
    { id: 'c-1-sub-1', formName: 'Medical Exam', status: 'Complete', lastUpdated: '20 Feb 2026' },
    { id: 'c-1-sub-2', formName: 'Orthopedic Exam', status: 'Complete', lastUpdated: '18 Feb 2026' },
    { id: 'c-1-sub-3', formName: 'Medical History Form', status: 'Complete', lastUpdated: '15 Feb 2026' },
    { id: 'c-1-sub-4', formName: 'Medical Update', status: 'Draft', lastUpdated: '22 Feb 2026' },
    { id: 'c-1-sub-5', formName: 'Tryout Agreement', status: 'Not Started', lastUpdated: '—' },
    { id: 'c-1-sub-6', formName: 'Prescription Pickup', status: 'Not Started', lastUpdated: '—' },
    { id: 'c-1-sub-7', formName: 'Authorization for Release of, and Disclosure', status: 'Draft', lastUpdated: '21 Feb 2026' },
    { id: 'c-1-sub-8', formName: 'Authorization for the Use and Disclosure of Health Records', status: 'Not Started', lastUpdated: '—' },
    { id: 'c-1-sub-9', formName: 'Vision Exam', status: 'Not Started', lastUpdated: '—' },
    { id: 'c-1-sub-10', formName: 'State Waiver', status: 'Not Started', lastUpdated: '—' }
  ]},
  { id: 'c-2', athleteName: 'Ryan O\'Sullivan', position: 'Loosehead Prop', dob: '22 Sep 1998', complete: 2, total: 10, lastUpdated: '—', subRows: [
    { id: 'c-2-sub-1', formName: 'Medical Exam', status: 'Complete', lastUpdated: '10 Feb 2026' },
    { id: 'c-2-sub-2', formName: 'Orthopedic Exam', status: 'Draft', lastUpdated: '12 Feb 2026' },
    { id: 'c-2-sub-3', formName: 'Medical History Form', status: 'Complete', lastUpdated: '8 Feb 2026' },
    { id: 'c-2-sub-4', formName: 'Medical Update', status: 'Not Started', lastUpdated: '—' },
    { id: 'c-2-sub-5', formName: 'Tryout Agreement', status: 'Not Started', lastUpdated: '—' },
    { id: 'c-2-sub-6', formName: 'Prescription Pickup', status: 'Not Started', lastUpdated: '—' },
    { id: 'c-2-sub-7', formName: 'Authorization for Release of, and Disclosure', status: 'Not Started', lastUpdated: '—' },
    { id: 'c-2-sub-8', formName: 'Authorization for the Use and Disclosure of Health Records', status: 'Not Started', lastUpdated: '—' },
    { id: 'c-2-sub-9', formName: 'Vision Exam', status: 'Not Started', lastUpdated: '—' },
    { id: 'c-2-sub-10', formName: 'State Waiver', status: 'Not Started', lastUpdated: '—' }
  ]},
  { id: 'c-3', athleteName: 'Connor McCarthy', position: 'Wing', dob: '07 Jun 1996', complete: 5, total: 10, lastUpdated: '18 Jan 2026', subRows: [
    { id: 'c-3-sub-1', formName: 'Medical Exam', status: 'Complete', lastUpdated: '15 Jan 2026' },
    { id: 'c-3-sub-2', formName: 'Orthopedic Exam', status: 'Complete', lastUpdated: '16 Jan 2026' },
    { id: 'c-3-sub-3', formName: 'Medical History Form', status: 'Complete', lastUpdated: '14 Jan 2026' },
    { id: 'c-3-sub-4', formName: 'Medical Update', status: 'Complete', lastUpdated: '18 Jan 2026' },
    { id: 'c-3-sub-5', formName: 'Tryout Agreement', status: 'Complete', lastUpdated: '17 Jan 2026' },
    { id: 'c-3-sub-6', formName: 'Prescription Pickup', status: 'Draft', lastUpdated: '18 Jan 2026' },
    { id: 'c-3-sub-7', formName: 'Authorization for Release of, and Disclosure', status: 'Draft', lastUpdated: '18 Jan 2026' },
    { id: 'c-3-sub-8', formName: 'Authorization for the Use and Disclosure of Health Records', status: 'Not Started', lastUpdated: '—' },
    { id: 'c-3-sub-9', formName: 'Vision Exam', status: 'Not Started', lastUpdated: '—' },
    { id: 'c-3-sub-10', formName: 'State Waiver', status: 'Not Started', lastUpdated: '—' }
  ]},
  { id: 'c-4', athleteName: 'Finn Henderson', position: 'Fly Half', dob: '28 Nov 2003', complete: 0, total: 10, lastUpdated: '—', subRows: [
    { id: 'c-4-sub-1', formName: 'Medical Exam', status: 'Not Started', lastUpdated: '—' },
    { id: 'c-4-sub-2', formName: 'Orthopedic Exam', status: 'Not Started', lastUpdated: '—' },
    { id: 'c-4-sub-3', formName: 'Medical History Form', status: 'Not Started', lastUpdated: '—' },
    { id: 'c-4-sub-4', formName: 'Medical Update', status: 'Not Started', lastUpdated: '—' },
    { id: 'c-4-sub-5', formName: 'Tryout Agreement', status: 'Not Started', lastUpdated: '—' },
    { id: 'c-4-sub-6', formName: 'Prescription Pickup', status: 'Not Started', lastUpdated: '—' },
    { id: 'c-4-sub-7', formName: 'Authorization for Release of, and Disclosure', status: 'Not Started', lastUpdated: '—' },
    { id: 'c-4-sub-8', formName: 'Authorization for the Use and Disclosure of Health Records', status: 'Not Started', lastUpdated: '—' },
    { id: 'c-4-sub-9', formName: 'Vision Exam', status: 'Not Started', lastUpdated: '—' },
    { id: 'c-4-sub-10', formName: 'State Waiver', status: 'Not Started', lastUpdated: '—' }
  ]},
  { id: 'c-5', athleteName: 'Jack Morrison', position: 'Outside Centre', dob: '09 Apr 1999', complete: 4, total: 10, lastUpdated: '10 Feb 2026', subRows: [
    { id: 'c-5-sub-1', formName: 'Medical Exam', status: 'Complete', lastUpdated: '5 Feb 2026' },
    { id: 'c-5-sub-2', formName: 'Orthopedic Exam', status: 'Complete', lastUpdated: '6 Feb 2026' },
    { id: 'c-5-sub-3', formName: 'Medical History Form', status: 'Complete', lastUpdated: '4 Feb 2026' },
    { id: 'c-5-sub-4', formName: 'Medical Update', status: 'Complete', lastUpdated: '10 Feb 2026' },
    { id: 'c-5-sub-5', formName: 'Tryout Agreement', status: 'Draft', lastUpdated: '8 Feb 2026' },
    { id: 'c-5-sub-6', formName: 'Prescription Pickup', status: 'Draft', lastUpdated: '9 Feb 2026' },
    { id: 'c-5-sub-7', formName: 'Authorization for Release of, and Disclosure', status: 'Not Started', lastUpdated: '—' },
    { id: 'c-5-sub-8', formName: 'Authorization for the Use and Disclosure of Health Records', status: 'Not Started', lastUpdated: '—' },
    { id: 'c-5-sub-9', formName: 'Vision Exam', status: 'Not Started', lastUpdated: '—' },
    { id: 'c-5-sub-10', formName: 'State Waiver', status: 'Not Started', lastUpdated: '—' }
  ]},
  { id: 'c-6', athleteName: 'Marcus Thompson', position: 'Number 8', dob: '15 Jan 1997', complete: 8, total: 10, lastUpdated: '22 Feb 2026', subRows: [
    { id: 'c-6-sub-1', formName: 'Medical Exam', status: 'Complete', lastUpdated: '18 Feb 2026' },
    { id: 'c-6-sub-2', formName: 'Orthopedic Exam', status: 'Complete', lastUpdated: '19 Feb 2026' },
    { id: 'c-6-sub-3', formName: 'Medical History Form', status: 'Complete', lastUpdated: '17 Feb 2026' },
    { id: 'c-6-sub-4', formName: 'Medical Update', status: 'Complete', lastUpdated: '22 Feb 2026' },
    { id: 'c-6-sub-5', formName: 'Tryout Agreement', status: 'Complete', lastUpdated: '20 Feb 2026' },
    { id: 'c-6-sub-6', formName: 'Prescription Pickup', status: 'Complete', lastUpdated: '20 Feb 2026' },
    { id: 'c-6-sub-7', formName: 'Authorization for Release of, and Disclosure', status: 'Complete', lastUpdated: '21 Feb 2026' },
    { id: 'c-6-sub-8', formName: 'Authorization for the Use and Disclosure of Health Records', status: 'Complete', lastUpdated: '21 Feb 2026' },
    { id: 'c-6-sub-9', formName: 'Vision Exam', status: 'Draft', lastUpdated: '22 Feb 2026' },
    { id: 'c-6-sub-10', formName: 'State Waiver', status: 'Not Started', lastUpdated: '—' }
  ]},
  { id: 'c-7', athleteName: 'Sean Brennan', position: 'Scrum Half', dob: '18 Aug 1995', complete: 6, total: 10, lastUpdated: '20 Feb 2026', subRows: [
    { id: 'c-7-sub-1', formName: 'Medical Exam', status: 'Complete', lastUpdated: '15 Feb 2026' },
    { id: 'c-7-sub-2', formName: 'Orthopedic Exam', status: 'Complete', lastUpdated: '16 Feb 2026' },
    { id: 'c-7-sub-3', formName: 'Medical History Form', status: 'Complete', lastUpdated: '14 Feb 2026' },
    { id: 'c-7-sub-4', formName: 'Medical Update', status: 'Complete', lastUpdated: '20 Feb 2026' },
    { id: 'c-7-sub-5', formName: 'Tryout Agreement', status: 'Complete', lastUpdated: '18 Feb 2026' },
    { id: 'c-7-sub-6', formName: 'Prescription Pickup', status: 'Complete', lastUpdated: '19 Feb 2026' },
    { id: 'c-7-sub-7', formName: 'Authorization for Release of, and Disclosure', status: 'Draft', lastUpdated: '20 Feb 2026' },
    { id: 'c-7-sub-8', formName: 'Authorization for the Use and Disclosure of Health Records', status: 'Draft', lastUpdated: '20 Feb 2026' },
    { id: 'c-7-sub-9', formName: 'Vision Exam', status: 'Not Started', lastUpdated: '—' },
    { id: 'c-7-sub-10', formName: 'State Waiver', status: 'Not Started', lastUpdated: '—' }
  ]},
  { id: 'c-8', athleteName: 'Patrick Doyle', position: 'Hooker', dob: '03 Dec 2000', complete: 1, total: 10, lastUpdated: '15 Feb 2026', subRows: [
    { id: 'c-8-sub-1', formName: 'Medical Exam', status: 'Complete', lastUpdated: '15 Feb 2026' },
    { id: 'c-8-sub-2', formName: 'Orthopedic Exam', status: 'Draft', lastUpdated: '15 Feb 2026' },
    { id: 'c-8-sub-3', formName: 'Medical History Form', status: 'Not Started', lastUpdated: '—' },
    { id: 'c-8-sub-4', formName: 'Medical Update', status: 'Not Started', lastUpdated: '—' },
    { id: 'c-8-sub-5', formName: 'Tryout Agreement', status: 'Not Started', lastUpdated: '—' },
    { id: 'c-8-sub-6', formName: 'Prescription Pickup', status: 'Not Started', lastUpdated: '—' },
    { id: 'c-8-sub-7', formName: 'Authorization for Release of, and Disclosure', status: 'Not Started', lastUpdated: '—' },
    { id: 'c-8-sub-8', formName: 'Authorization for the Use and Disclosure of Health Records', status: 'Not Started', lastUpdated: '—' },
    { id: 'c-8-sub-9', formName: 'Vision Exam', status: 'Not Started', lastUpdated: '—' },
    { id: 'c-8-sub-10', formName: 'State Waiver', status: 'Not Started', lastUpdated: '—' }
  ]},
  { id: 'c-9', athleteName: 'Dylan Murphy', position: 'Fullback', dob: '27 Feb 2002', complete: 0, total: 10, lastUpdated: '—', subRows: [
    { id: 'c-9-sub-1', formName: 'Medical Exam', status: 'Not Started', lastUpdated: '—' },
    { id: 'c-9-sub-2', formName: 'Orthopedic Exam', status: 'Not Started', lastUpdated: '—' },
    { id: 'c-9-sub-3', formName: 'Medical History Form', status: 'Not Started', lastUpdated: '—' },
    { id: 'c-9-sub-4', formName: 'Medical Update', status: 'Not Started', lastUpdated: '—' },
    { id: 'c-9-sub-5', formName: 'Tryout Agreement', status: 'Not Started', lastUpdated: '—' },
    { id: 'c-9-sub-6', formName: 'Prescription Pickup', status: 'Not Started', lastUpdated: '—' },
    { id: 'c-9-sub-7', formName: 'Authorization for Release of, and Disclosure', status: 'Not Started', lastUpdated: '—' },
    { id: 'c-9-sub-8', formName: 'Authorization for the Use and Disclosure of Health Records', status: 'Not Started', lastUpdated: '—' },
    { id: 'c-9-sub-9', formName: 'Vision Exam', status: 'Not Started', lastUpdated: '—' },
    { id: 'c-9-sub-10', formName: 'State Waiver', status: 'Not Started', lastUpdated: '—' }
  ]},
  { id: 'c-10', athleteName: 'Liam O\'Brien', position: 'Lock', dob: '11 Jul 1994', complete: 10, total: 10, lastUpdated: '20 Feb 2026', subRows: [
    { id: 'c-10-sub-1', formName: 'Medical Exam', status: 'Complete', lastUpdated: '12 Feb 2026' },
    { id: 'c-10-sub-2', formName: 'Orthopedic Exam', status: 'Complete', lastUpdated: '13 Feb 2026' },
    { id: 'c-10-sub-3', formName: 'Medical History Form', status: 'Complete', lastUpdated: '11 Feb 2026' },
    { id: 'c-10-sub-4', formName: 'Medical Update', status: 'Complete', lastUpdated: '20 Feb 2026' },
    { id: 'c-10-sub-5', formName: 'Tryout Agreement', status: 'Complete', lastUpdated: '15 Feb 2026' },
    { id: 'c-10-sub-6', formName: 'Prescription Pickup', status: 'Complete', lastUpdated: '16 Feb 2026' },
    { id: 'c-10-sub-7', formName: 'Authorization for Release of, and Disclosure', status: 'Complete', lastUpdated: '17 Feb 2026' },
    { id: 'c-10-sub-8', formName: 'Authorization for the Use and Disclosure of Health Records', status: 'Complete', lastUpdated: '18 Feb 2026' },
    { id: 'c-10-sub-9', formName: 'Vision Exam', status: 'Complete', lastUpdated: '19 Feb 2026' },
    { id: 'c-10-sub-10', formName: 'State Waiver', status: 'Complete', lastUpdated: '20 Feb 2026' }
  ]}
]

// Used by: pages/forms/FormsPage.jsx
// Scheduling Overview mock data
export const schedulingRowsData = [
  {
    id: 's-1',
    scheduleName: 'Pre-Season Medical Screening',
    startDate: '2026-03-01T14:05:00',
    endDate: '2026-03-04T18:00:00',
    category: 'Medical',
    players: ['Michael Anderson', 'Bill Byerson', 'David Carter', 'Elena Rodriguez', 'James Wilson', 'Emma Brown', 'Liam Davis', 'Sophie Miller', 'Marcus Johnson', 'Ryan Thompson', 'Sarah Mitchell', 'Daniel Lee', 'Jessica Wang', 'Chris Evans', 'Amy Chen', 'Kevin O\'Brien', 'Laura Parker', 'Tom Harris', 'Rachel Green', 'Nick Adams', 'Olivia Turner', 'Jake Morrison', 'Megan Foster', 'Alex Reed', 'Hannah Cooper', 'Ben Walsh', 'Sara Kennedy', 'Mike Sullivan', 'Emily Scott', 'John Blake', 'Kate Murphy', 'Brian Hayes', 'Lisa Morgan', 'Steve Collins', 'Diana Ross', 'Paul White', 'Maria Garcia', 'George Brown', 'Nicole Taylor', 'Peter Jackson', 'Karen Lewis', 'Frank Moore', 'Linda Hall', 'Edward Young', 'Andrea King', 'Robert Wright', 'Jennifer Lopez', 'Thomas Baker', 'Michelle Clark', 'William Hill', 'Amanda Green', 'Christopher Lee', 'Catherine Adams', 'Timothy Brown', 'Samantha Jones', 'Joseph Martinez', 'Stephanie Robinson', 'Anthony Miller', 'Rebecca Wilson', 'Charles Taylor', 'Victoria Thompson', 'Mark Anderson', 'Elizabeth Davis', 'Matthew Garcia', 'Christina Martinez', 'Ryan Johnson', 'Ashley Williams', 'Joshua Brown', 'Lauren Moore', 'Brandon Jackson', 'Morgan White', 'Tyler Harris', 'Kayla Martin', 'Justin Thompson'],
    isUpcoming: true,
    forms: [
      { id: 's-1-f-1', formName: 'Medical Exam' },
      { id: 's-1-f-2', formName: 'Orthopedic Exam' },
      { id: 's-1-f-3', formName: 'Medical History Form' }
    ]
  },
  {
    id: 's-2',
    scheduleName: 'Weekly Wellness Check',
    startDate: '2026-03-05T09:00:00',
    endDate: '2026-03-05T17:00:00',
    category: 'Wellbeing',
    players: ['Ethan Walker', 'Connor McCarthy', 'Finn Henderson', 'Jack Morrison', 'Marcus Thompson', 'Sean Brennan', 'Patrick Doyle', 'Dylan Murphy'],
    isUpcoming: true,
    forms: [
      { id: 's-2-f-1', formName: 'Daily Wellness Check' }
    ]
  },
  {
    id: 's-3',
    scheduleName: 'Performance Evaluation Q1',
    startDate: '2026-03-10T08:00:00',
    endDate: '2026-03-15T18:00:00',
    category: 'Performance',
    players: ['Michael Anderson', 'Bill Byerson', 'David Carter', 'Elena Rodriguez', 'James Wilson', 'Emma Brown', 'Liam Davis', 'Sophie Miller', 'Marcus Johnson', 'Ryan Thompson', 'Sarah Mitchell', 'Daniel Lee', 'Jessica Wang', 'Chris Evans', 'Amy Chen'],
    isUpcoming: true,
    forms: [
      { id: 's-3-f-1', formName: 'Training Load Monitoring' },
      { id: 's-3-f-2', formName: 'Post-Game RPE' },
      { id: 's-3-f-3', formName: 'Performance Assessment' }
    ]
  },
  {
    id: 's-4',
    scheduleName: 'Concussion Protocol Review',
    startDate: '2026-03-20T10:00:00',
    endDate: '2026-03-22T16:00:00',
    category: 'Medical',
    players: ['Ethan Walker', 'Ryan O\'Sullivan', 'Connor McCarthy', 'Finn Henderson', 'Jack Morrison'],
    isUpcoming: true,
    forms: [
      { id: 's-4-f-1', formName: 'Concussion Protocol' },
      { id: 's-4-f-2', formName: 'Return to Play Assessment' }
    ]
  },
  {
    id: 's-5',
    scheduleName: 'End of Season Survey',
    startDate: '2026-04-01T09:00:00',
    endDate: '2026-04-07T18:00:00',
    category: 'Assessment',
    players: ['Michael Anderson', 'Bill Byerson', 'David Carter', 'Elena Rodriguez', 'James Wilson', 'Emma Brown', 'Liam Davis', 'Sophie Miller', 'Marcus Johnson', 'Ryan Thompson'],
    isUpcoming: true,
    forms: [
      { id: 's-5-f-1', formName: 'End of Season Survey' },
      { id: 's-5-f-2', formName: 'Season Feedback Form' }
    ]
  },
  // Past schedules
  {
    id: 's-6',
    scheduleName: 'January Health Check',
    startDate: '2026-01-15T14:05:00',
    endDate: '2026-01-18T17:00:00',
    category: 'Medical',
    players: ['Michael Anderson', 'Bill Byerson', 'David Carter', 'Elena Rodriguez', 'James Wilson', 'Emma Brown', 'Liam Davis', 'Sophie Miller', 'Marcus Johnson', 'Ryan Thompson', 'Sarah Mitchell', 'Daniel Lee'],
    isUpcoming: false,
    forms: [
      { id: 's-6-f-1', formName: 'Medical Exam' },
      { id: 's-6-f-2', formName: 'Medical History Form' }
    ]
  },
  {
    id: 's-7',
    scheduleName: 'Winter Training Assessment',
    startDate: '2026-02-01T08:00:00',
    endDate: '2026-02-05T18:00:00',
    category: 'Performance',
    players: ['Ethan Walker', 'Connor McCarthy', 'Finn Henderson', 'Jack Morrison', 'Marcus Thompson', 'Sean Brennan'],
    isUpcoming: false,
    forms: [
      { id: 's-7-f-1', formName: 'Training Load Monitoring' }
    ]
  },
  {
    id: 's-8',
    scheduleName: 'February Wellness Survey',
    startDate: '2026-02-10T09:00:00',
    endDate: '2026-02-12T17:00:00',
    category: 'Wellbeing',
    players: ['Michael Anderson', 'Bill Byerson', 'David Carter', 'Elena Rodriguez', 'James Wilson', 'Emma Brown', 'Liam Davis', 'Sophie Miller'],
    isUpcoming: false,
    forms: [
      { id: 's-8-f-1', formName: 'Daily Wellness Check' },
      { id: 's-8-f-2', formName: 'Mental Health Assessment' }
    ]
  },
  {
    id: 's-9',
    scheduleName: 'Pre-Season Compliance Forms',
    startDate: '2025-12-16T14:05:00',
    endDate: '2025-12-19T18:00:00',
    category: 'Compliance',
    players: ['Michael Anderson', 'Bill Byerson', 'David Carter', 'Elena Rodriguez', 'James Wilson', 'Emma Brown', 'Liam Davis', 'Sophie Miller', 'Marcus Johnson', 'Ryan Thompson', 'Sarah Mitchell', 'Daniel Lee', 'Jessica Wang', 'Chris Evans', 'Amy Chen', 'Kevin O\'Brien', 'Laura Parker', 'Tom Harris', 'Rachel Green', 'Nick Adams', 'Olivia Turner', 'Jake Morrison', 'Megan Foster', 'Alex Reed', 'Hannah Cooper', 'Ben Walsh', 'Sara Kennedy', 'Mike Sullivan', 'Emily Scott', 'John Blake', 'Kate Murphy', 'Brian Hayes', 'Lisa Morgan', 'Steve Collins', 'Diana Ross', 'Paul White', 'Maria Garcia', 'George Brown', 'Nicole Taylor', 'Peter Jackson', 'Karen Lewis', 'Frank Moore', 'Linda Hall', 'Edward Young', 'Andrea King', 'Robert Wright', 'Jennifer Lopez', 'Thomas Baker', 'Michelle Clark', 'William Hill', 'Amanda Green', 'Christopher Lee', 'Catherine Adams', 'Timothy Brown', 'Samantha Jones', 'Joseph Martinez', 'Stephanie Robinson', 'Anthony Miller', 'Rebecca Wilson', 'Charles Taylor', 'Victoria Thompson', 'Mark Anderson', 'Elizabeth Davis', 'Matthew Garcia', 'Christina Martinez', 'Ryan Johnson', 'Ashley Williams', 'Joshua Brown', 'Lauren Moore', 'Brandon Jackson', 'Morgan White', 'Tyler Harris', 'Kayla Martin', 'Justin Thompson'],
    isUpcoming: false,
    forms: [
      { id: 's-9-f-1', formName: 'Medical Exam' },
      { id: 's-9-f-2', formName: 'Orthopedic Exam' },
      { id: 's-9-f-3', formName: 'Medical History Form' }
    ]
  }
]

// Used by: pages/forms/FormFillPage.jsx
// Mock recent form summaries
export const mockRecentSummaries = [
  { id: 1, title: 'Nutritional Assessment and Dietary Planning', date: 'Sep 27, 2025' },
  { id: 2, title: 'Skill Development and Tactical Review', date: 'Sep 25, 2025' },
  { id: 3, title: 'Pre-Season Medical Screening', date: 'Sep 20, 2025' },
  { id: 4, title: 'Daily Wellness Check', date: 'Sep 18, 2025' },
  { id: 5, title: 'Post-Match Recovery Assessment', date: 'Sep 15, 2025' },
  { id: 6, title: 'Training Load Monitoring', date: 'Sep 12, 2025' },
  { id: 7, title: 'Mental Health and Wellbeing Check', date: 'Sep 10, 2025' }
]

// Used by: pages/forms/FormFillPage.jsx
// Mock detailed summary content for drill-down view
export const mockSummaryDetails = {
  1: {
    sections: [
      {
        title: 'Nutritional Overview',
        items: [
          {
            headline: 'Current Diet Assessment',
            content: 'Athlete maintains a balanced macronutrient intake with adequate protein (1.8g/kg body weight). Carbohydrate timing around training sessions is well-optimized for performance.'
          },
          {
            headline: 'Hydration Status',
            content: 'Consistent daily fluid intake of 3-4 liters. Pre and post-training hydration protocols are being followed effectively.'
          },
          {
            headline: 'Supplement Recommendations',
            content: 'Continue with current Vitamin D supplementation (2000 IU daily). Consider adding omega-3 fatty acids to support joint health and recovery.'
          }
        ]
      },
      {
        title: 'Recommendations',
        items: [
          {
            headline: 'Immediate Actions',
            content: 'Increase iron-rich food intake to address borderline ferritin levels. Schedule follow-up blood work in 4 weeks.'
          },
          {
            headline: 'Dietary Adjustments',
            content: 'Increase complex carbohydrate intake on high-intensity training days. Add pre-sleep casein protein to support overnight recovery.'
          }
        ]
      }
    ]
  },
  3: {
    sections: [
      {
        title: 'Athlete Medical Summary',
        items: [
          {
            headline: 'Concussion History',
            content: 'Significant history of concussion. Sustained a concussion in high school (2012) resulting in loss of consciousness and hospitalization. Recent hospitalization for concussion on March 11, 2025.'
          },
          {
            headline: 'Musculoskeletal History',
            content: 'Right Low Back: History of imaging (X-ray, MRI, CT, or bone scan) performed on December 24, 2024 for chronic issues.'
          },
          {
            headline: 'Vaccination Status',
            content: 'Incomplete vaccination history: Mumps: Unknown, Pneumonia: Tetanus: No'
          }
        ]
      },
      {
        title: 'Recommendations',
        items: [
          {
            headline: 'Immediate Actions',
            content: 'Player should be immediately held from all contact and throwing activities. Urgent comprehensive orthopedic evaluation of the right shoulder is required. Urgent comprehensive neurological evaluation, including a detailed concussion assessment, is required.'
          },
          {
            headline: 'Diagnostic Next Steps',
            content: 'Obtain an MRI of the right shoulder to assess rotator cuff integrity and extent of injury. Conduct a full neuropsychological assessment (e.g., ImPACT testing) and a thorough neurological examination to evaluate sequelae of the recent concussion. Review medical records from the March 11, 2025 hospitalization.'
          }
        ]
      }
    ]
  }
}

// Used by: pages/forms/MedicalAssessment.jsx
export const medicalAssessmentRows = [
  { id: 1, athlete: 'Jordan Smith', lastUpdated: '2026-02-24', status: 'Complete' },
  { id: 2, athlete: 'Alex Martinez', lastUpdated: '2026-02-23', status: 'Draft' },
  { id: 3, athlete: 'Liam Johnson', lastUpdated: '2026-02-22', status: 'Not Started' },
  { id: 4, athlete: 'Olivia Brown', lastUpdated: '2026-02-21', status: 'Complete' },
  { id: 5, athlete: 'Noah Jones', lastUpdated: '2026-02-20', status: 'Draft' },
  { id: 6, athlete: 'Emma Garcia', lastUpdated: '2026-02-19', status: 'Not Started' },
  { id: 7, athlete: 'William Davis', lastUpdated: '2026-02-18', status: 'Complete' },
  { id: 8, athlete: 'Sophia Rodriguez', lastUpdated: '2026-02-17', status: 'Draft' },
  { id: 9, athlete: 'James Wilson', lastUpdated: '2026-02-16', status: 'Not Started' },
  { id: 10, athlete: 'Isabella Moore', lastUpdated: '2026-02-15', status: 'Complete' },
  { id: 11, athlete: 'Benjamin Taylor', lastUpdated: '2026-02-14', status: 'Draft' },
  { id: 12, athlete: 'Mia Anderson', lastUpdated: '2026-02-13', status: 'Not Started' },
];

// Used by: components/forms/EditScheduleDrawer.jsx, components/forms/AssignFormDrawer.jsx
export const RESPONSES_PER_PLAYER_OPTIONS = [
  { value: 1, label: '1 response per player' },
  { value: 2, label: '2 responses per player' },
  { value: 3, label: '3 responses per player' },
  { value: 5, label: '5 responses per player' },
  { value: 10, label: '10 responses per player' },
  { value: -1, label: 'Unlimited responses' },
]

// Used by: components/forms/EditScheduleDrawer.jsx
// All available forms for selection
export const ALL_FORMS_OPTIONS = [
  { id: 'f-1', formName: 'Medical Exam' },
  { id: 'f-2', formName: 'Orthopedic Exam' },
  { id: 'f-3', formName: 'Medical History Form' },
  { id: 'f-4', formName: 'Daily Wellness Check' },
  { id: 'f-5', formName: 'Training Load Monitoring' },
  { id: 'f-6', formName: 'Post-Game RPE' },
  { id: 'f-7', formName: 'Performance Assessment' },
  { id: 'f-8', formName: 'Concussion Protocol' },
  { id: 'f-9', formName: 'Return to Play Assessment' },
  { id: 'f-10', formName: 'End of Season Survey' },
  { id: 'f-11', formName: 'Season Feedback Form' },
  { id: 'f-12', formName: 'Mental Health Assessment' },
]

// Used by: components/forms/AssignFormDrawer.jsx
export const TIMEZONES = [
  'Europe/Dublin',
  'UTC',
  'Europe/London',
  'America/New_York',
  'Europe/Paris',
  'Australia/Sydney',
]

// Used by: components/forms/AssignFormDrawer.jsx
// Mock teams for athlete grouping
export const MOCK_TEAMS = [
  { id: 1, name: 'First Team', status: 'active' },
  { id: 2, name: 'Reserve Team', status: 'active' },
  { id: 3, name: 'Academy U21', status: 'active' },
  { id: 4, name: 'Academy U18', status: 'active' },
  { id: 5, name: 'Munster NTS', status: 'active' },
  { id: 6, name: 'Club Ops', status: 'inactive' },
]

// Used by: components/forms/ExportFormDrawer.jsx
// Default export column fields
export const DEFAULT_EXPORT_FIELDS = [
  { id: 'athleteName', label: 'Athlete name', checked: true },
  { id: 'formName', label: 'Form name', checked: true },
  { id: 'productArea', label: 'Product area', checked: true },
  { id: 'category', label: 'Category', checked: true },
  { id: 'completionDate', label: 'Completion date', checked: true },
  { id: 'status', label: 'Status', checked: true },
]

// Used by: pages/forms/Screen02_FormResponses.jsx (allForms)
// Stubbed data for the grid; wire this to real data later
export const formResponseTemplates = [
  { id: 378, name: 'Test - Toggle Switch', updatedAt: 'July 17, 2025 11:22 am' },
  { id: 364, name: 'RFU Exit Medical', updatedAt: 'May 20, 2025 11:49 am' },
  { id: 348, name: 'More than equal', updatedAt: 'April 09, 2025 9:57 am' },
  { id: 347, name: 'Hilly test', updatedAt: 'March 28, 2025 2:03 pm' },
  { id: 346, name: 'Form with conditional', updatedAt: 'March 21, 2025 12:18 pm' },
]

// Used by: pages/forms/Screen02_FormResponses.jsx (completedRows)
// Stubbed data for Completed tab based on the provided dump
export const formResponseCompletedRows = [
  { id: 467635, athleteName: 'Allan Santos Athlete', name: 'Test - Toggle Switch', productArea: 'Medical', category: 'Other', examiner: 'Bhuvan Bhatt', completionDate: 'Jul 17, 2025', status: 'Complete' },
  { id: 467105, athleteName: 'test', name: 'Test - Toggle Switch', productArea: 'Medical', category: 'Other', examiner: 'Bhuvan Bhatt', completionDate: 'Jul 17, 2025', status: 'Complete' },
  { id: 467101, athleteName: 'Allan Santos', name: 'Test - Toggle Switch', productArea: 'Medical', category: 'Other', examiner: 'Bhuvan Bhatt', completionDate: 'Jul 17, 2025', status: 'Complete' },
  { id: 467095, athleteName: 'Akanksha', name: 'Test - Toggle Switch', productArea: 'Medical', category: 'Other', examiner: 'Bhuvan Bhatt', completionDate: 'Jul 17, 2025', status: 'Complete' },
  { id: 467088, athleteName: 'Adam Conway', name: 'Test - Toggle Switch', productArea: 'Medical', category: 'Other', examiner: 'Bhuvan Bhatt', completionDate: 'Jul 17, 2025', status: 'Complete' },
  { id: 467087, athleteName: 'Adam Conway', name: 'General Medical', productArea: 'Medical', category: 'Other', examiner: 'Willian Gama', completionDate: 'Jul 2, 2025', status: 'Complete' },
  { id: 467083, athleteName: 'Adam Conway', name: 'General Medical', productArea: 'Medical', category: 'Other', examiner: 'Willian Gama', completionDate: 'Jul 2, 2025', status: 'Complete' },
  { id: 467079, athleteName: 'Adam Conway', name: 'Kiosk Test', productArea: 'Medical', category: 'Other', examiner: 'Adam Conway', completionDate: 'Jun 26, 2025', status: 'Complete' },
]

// Used by: pages/forms/Screen02_FormResponses.jsx (complianceRows)
// Compliance tab: group by player with collapsible sections
// Prototype data set for compliance view: includes mixed statuses and timestamps
export const formResponseComplianceRows = [
  { id: 500001, athleteName: 'Harry Anderson', name: 'Medical Exam', lastUpdated: '2025-01-10T10:15:00Z', status: 'Draft' },
  { id: 500002, athleteName: 'Harry Anderson', name: 'Ortho Exam', lastUpdated: '2025-01-10T10:15:00Z', status: 'Draft' },
  { id: 500003, athleteName: 'Harry Anderson', name: 'Medical History Form', lastUpdated: '2025-01-05T10:15:00Z', status: 'Complete' },
  { id: 500004, athleteName: 'Harry Anderson', name: 'Use & Disclosure/Release', lastUpdated: '2025-01-10T10:15:00Z', status: 'Not started' },
  { id: 500005, athleteName: 'Harry Anderson', name: 'Tryout Agreement', lastUpdated: '2025-01-10T10:15:00Z', status: 'Not started' },
  { id: 500006, athleteName: 'Harry Anderson', name: 'Notice of Privacy Practice', lastUpdated: '2025-01-10T10:15:00Z', status: 'Not started' },
  { id: 500007, athleteName: 'Harry Anderson', name: 'Prescription Pick up', lastUpdated: '2025-01-10T10:15:00Z', status: 'Not started' },
  { id: 500008, athleteName: 'Harry Anderson', name: 'Medical Update Release', lastUpdated: '2025-01-10T10:15:00Z', status: 'Not started' },

  { id: 500101, athleteName: 'Bill Bryson', name: 'Medical Exam', lastUpdated: '2025-01-10T10:15:00Z', status: 'Done' },
  { id: 500102, athleteName: 'Bill Bryson', name: 'Ortho Exam', lastUpdated: '2025-01-10T10:15:00Z', status: 'Complete' },
  { id: 500103, athleteName: 'Bill Bryson', name: 'Medical History Form', lastUpdated: '2025-01-05T10:15:00Z', status: 'Complete' },
  { id: 500104, athleteName: 'Bill Bryson', name: 'Use & Disclosure/Release', lastUpdated: '2025-01-10T10:15:00Z', status: 'Not started' },

  { id: 500201, athleteName: 'Elena Rodriguez', name: 'Medical Exam', lastUpdated: '2025-01-11T09:20:00Z', status: 'In progress' },
  { id: 500202, athleteName: 'Elena Rodriguez', name: 'Ortho Exam', lastUpdated: '2025-01-11T09:20:00Z', status: 'Not started' },
  { id: 500203, athleteName: 'Elena Rodriguez', name: 'Medical History Form', lastUpdated: '2025-01-09T13:00:00Z', status: 'Draft' },
]

// Used by: pages/forms/Screen01_FormsHome.jsx (rows)
// Inline stub data to visually render the screen (no behavior)
export const formsHomeRows = [
  { id: 'f-001', title: 'Medical Assessment', category: 'Medical', type: 'Questionnaire', status: 'Active', owner: 'Performance', updated: 'Today 10:12', due: 'Today 18:00', recipients: 53, completion: 41 },
  { id: 'f-002', title: 'Preseason assessment', category: 'Training', type: 'Questionnaire', status: 'Scheduled', owner: 'Coaching', updated: 'Yesterday 16:40', due: 'Tomorrow 09:00', recipients: 53, completion: null },
  { id: 'f-003', title: 'End of season survey', category: 'Assessment', type: 'Questionnaire', status: 'Draft', owner: 'Medical', updated: 'Mon 14:20', due: null, recipients: 8, completion: null },
  { id: 'f-004', title: 'Training', category: 'Rehabilitation', type: 'Questionnaire', status: 'Draft', owner: 'Sporting Operations', updated: 'Today 09:30', due: null, recipients: 0, completion: null },
  { id: 'f-005', title: 'Transfer screening', category: 'Administrative', type: 'Questionnaire', status: 'Draft', owner: 'Medical', updated: 'Today 09:30', due: null, recipients: 0, completion: null },
]
