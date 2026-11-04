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

export const pageTitles = {
  '/dashboard': 'Dashboard',
  '/medical': 'Medical',
  '/analysis': 'Analysis',
  '/athlete': 'Athletes',
  '/workloads': 'Workload',
  '/questionnaires': 'Forms',
  '/forms': 'Forms',
  '/forms/form_templates': 'Forms',
  '/forms/form_answers_sets': 'Forms',
  '/planning': 'Calendar',
  '/messages': 'All messages',
  '/activity': 'Activity log',
  '/settings': 'Admin',
  '/help': 'Help'
}
