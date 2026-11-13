// Mock data for layout: current user, squads, page titles
// All app mock/constants live in src/data (see docs/reference/project-structure.md)
import { SQUAD_PLAN } from './club'
import { staffWithRole } from './users_staff'

// The signed-in user: the club's team doctor, from the generated staff
const doctor = staffWithRole('Team Doctor')
export const currentUser = {
  name: `${doctor.firstname} ${doctor.lastname}`,
  email: doctor.email,
  role: doctor.role,
  avatar: '👩‍⚕️'
}

export const availableSquads = SQUAD_PLAN.map(({ id, name, short }) => ({ id, name, short }))

// Earlier kit paths, redirected to the iP paths (kitman-frontend MainNav/resources/menuItems.js)
export const legacyRedirects = {
  '/medical': '/medical/rosters',
  '/athlete': '/athletes',
  '/planning': '/calendar',
  '/messages': '/messaging',
  '/settings': '/administration',
  '/medical-assessment': '/forms/medical-assessment/assignments'
}
