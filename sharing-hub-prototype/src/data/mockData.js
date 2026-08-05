// Mock data for the Sharing hub prototype — one entry per external share.

export const recordTypes = [
  'Medical record',
  'Rehab plan',
  'Performance report',
  'Wellness assessment',
]

export const permissions = ['View only', 'View + comment']

export const shareDurations = [
  { value: '7', label: '7 days' },
  { value: '14', label: '14 days' },
  { value: '30', label: '30 days' },
  { value: '90', label: '90 days' },
  { value: 'ongoing', label: 'Ongoing' },
]

export const shares = [
  {
    id: 1,
    player: 'Marcus Webb',
    sections: ['Medical record'],
    organization: 'St. Vincent Sports Clinic',
    daysLeft: 30,
    permission: 'View only',
    active: true,
  },
  {
    id: 2,
    player: 'Aiden Torres',
    sections: ['Rehab plan', 'Performance report'],
    organization: 'Dr. Helena Cho',
    daysLeft: 7,
    permission: 'View + comment',
    active: true,
  },
  {
    id: 3,
    player: 'Priya Nandakumar',
    sections: ['Wellness assessment'],
    organization: 'Riverside Physiotherapy',
    daysLeft: null,
    ongoing: true,
    permission: 'View only',
    active: true,
  },
  {
    id: 4,
    player: 'Callum Ferris',
    sections: ['Medical record', 'Rehab plan'],
    organization: 'Dr. Samuel Okafor',
    daysLeft: 14,
    permission: 'View + comment',
    active: true,
    comment:
      'Athlete continues to show good progress with the rehabilitation protocol. Recommend continuing the current exercise program with a gradual return to full training load over the next two weeks. Will reassess range of motion and strength metrics at the next follow-up.',
  },
  {
    id: 5,
    player: 'Naomi Delacroix',
    sections: ['Performance report'],
    organization: 'National Performance Institute',
    daysLeft: 0,
    permission: 'View only',
    active: false,
  },
  {
    id: 6,
    player: 'Tyrell Ansah',
    sections: ['Medical record'],
    organization: 'St. Vincent Sports Clinic',
    daysLeft: 0,
    permission: 'View + comment',
    active: false,
  },
]
