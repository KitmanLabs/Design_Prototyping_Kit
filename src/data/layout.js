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

// Paths and titles follow iP's side nav (kitman-frontend MainNav/resources/menuItems.js)
export const pageTitles = {
  '/dashboard': 'Dashboard',
  '/medical/rosters': 'Medical',
  '/analysis': 'Analysis',
  '/athletes': 'Athletes',
  '/workloads': 'Workloads',
  '/questionnaires': 'Forms',
  '/forms': 'Forms',
  '/forms/form_templates': 'Forms',
  '/forms/form_answers_sets': 'Forms',
  '/calendar': 'Calendar',
  '/messaging': 'Messaging',
  '/activity': 'Activity',
  '/administration': 'Administration',
  '/help': 'Help'
}

// Paths (and everything under them) whose pages render their own page header, usually a
// floorplan's PageHeader. The app bar shows their title as a quieter section label.
export const pagesWithOwnHeader = ['/calendar', '/forms', '/athletes']

// Earlier kit paths, redirected to the iP paths above
export const legacyRedirects = {
  '/medical': '/medical/rosters',
  '/athlete': '/athletes',
  '/planning': '/calendar',
  '/messages': '/messaging',
  '/settings': '/administration',
  '/medical-assessment': '/forms/medical-assessment/assignments'
}
