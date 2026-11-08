// Mock data for layout: current user, squads, page titles
// All app mock/constants live in src/data (see docs/reference/project-structure.md)

export const currentUser = {
  name: 'Dr. Sarah Mitchell',
  email: 'sarah.mitchell@example.com',
  role: 'Sports Medicine Director',
  avatar: '👩‍⚕️'
}

export const availableSquads = [
  { id: 1, name: 'First Team', short: 'FT' },
  { id: 2, name: 'Reserve Team', short: 'RES' },
  { id: 3, name: 'Academy U21', short: 'U21' },
  { id: 4, name: 'Academy U18', short: 'U18' }
]

// Earlier kit paths, redirected to the iP paths (kitman-frontend MainNav/resources/menuItems.js)
export const legacyRedirects = {
  '/medical': '/medical/rosters',
  '/athlete': '/athletes',
  '/planning': '/calendar',
  '/messages': '/messaging',
  '/settings': '/administration',
  '/medical-assessment': '/forms/medical-assessment/assignments'
}
