// Options for the Athletes Collection and the athlete profile Record

// Quick filter chips on the Athletes page
export const availabilityFilters = [
  { key: 'Available', label: 'Available' },
  { key: 'Injured', label: 'Injured' },
]

// Header badge colour for each availability status
export const availabilityBadgeColors = {
  Available: 'success',
  Injured: 'error',
  Modified: 'warning',
}

// Tabs on the athlete profile
export const athleteProfileTabs = [
  { tabKey: 'overview', tabHash: '#overview', title: 'Overview' },
  { tabKey: 'medical', tabHash: '#medical', title: 'Medical' },
  { tabKey: 'wellbeing', tabHash: '#wellbeing', title: 'Wellbeing' },
]

export const positionOptions = ['Goalkeeper', 'Defender', 'Midfielder', 'Forward']
