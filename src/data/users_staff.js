// Staff and user accounts, generated. Emails use a reserved .example domain and phone numbers
// come from the UK range set aside for fiction (020 7946 0xxx), so neither can reach anyone.
import { fakerFor, namesFor } from './fake'
import { isoDate, isoDateTime } from './clock'
import { ORGANISATION, SQUAD_PLAN } from './club'

const squad = (id, role) => ({ squad_id: id, squad_name: SQUAD_PLAN.find((s) => s.id === id).name, role })

// Who the club employs, with what each role looks after.
const STAFF_PLAN = [
  {
    role: 'Head Coach', permission_group: 'Coaching Staff', department: 'Coaching', sex: 'male',
    squads: [squad(1, 'Head Coach')],
    qualifications: ['UEFA Pro License', 'Level 5 Coaching', 'Sports Psychology Certificate'],
    specializations: ['Tactical Analysis', 'Athlete Development', 'Team Management'],
  },
  {
    role: 'Assistant Coach', permission_group: 'Coaching Staff', department: 'Coaching', sex: 'female',
    squads: [squad(1, 'Assistant Coach')],
    qualifications: ['UEFA A License', 'Level 4 Coaching', 'Fitness Training Certificate'],
    specializations: ['Fitness Training', 'Recovery Programs', 'Youth Development'],
  },
  {
    role: 'Team Doctor', permission_group: 'Medical Staff', department: 'Medical', sex: 'female', title: 'Dr.',
    squads: [squad(1, 'Team Doctor'), squad(2, 'Team Doctor')],
    qualifications: ['MBChB Medicine', 'Diploma in Sports Medicine', 'FFSEM Fellowship'],
    specializations: ['Sports Medicine', 'Injury Prevention', 'Emergency Care'],
  },
  {
    role: 'Physiotherapist', permission_group: 'Medical Staff', department: 'Medical', sex: 'male',
    squads: [squad(1, 'Physiotherapist'), squad(4, 'Physiotherapist')],
    qualifications: ['BSc Physiotherapy', 'MSc Sports Rehabilitation', 'ACPSM Membership'],
    specializations: ['Injury Rehabilitation', 'Movement Analysis', 'Manual Therapy'],
  },
  {
    role: 'Strength & Conditioning Coach', permission_group: 'Coaching Staff', department: 'Performance', sex: 'male',
    squads: [squad(1, 'S&C Coach'), squad(2, 'S&C Coach')],
    qualifications: ['CSCS Certification', 'MSc Exercise Science', 'UKSCA Accreditation'],
    specializations: ['Strength Training', 'Power Development', 'Injury Prevention'],
  },
  {
    role: 'Sports Psychologist', permission_group: 'Medical Staff', department: 'Psychology', sex: 'female', title: 'Dr.',
    squads: [squad(1, 'Sports Psychologist')],
    qualifications: ['PhD Psychology', 'BPS Chartered Psychologist', 'BASES Accredited'],
    specializations: ['Performance Psychology', 'Mental Health', 'Team Dynamics'],
  },
  {
    role: 'Sports Nutritionist', permission_group: 'Medical Staff', department: 'Nutrition', sex: 'female',
    squads: [squad(1, 'Nutritionist'), squad(2, 'Nutritionist')],
    qualifications: ['MSc Sports Nutrition', 'Registered Dietitian', 'SENr Accredited'],
    specializations: ['Performance Nutrition', 'Recovery Nutrition', 'Supplementation'],
  },
  {
    role: 'Performance Analyst', permission_group: 'Analysis Staff', department: 'Analysis', sex: 'male',
    squads: [squad(1, 'Performance Analyst')],
    qualifications: ['BSc Sports Science', 'MSc Performance Analysis', 'ISPAS Certified'],
    specializations: ['Match Analysis', 'Athlete Tracking', 'Data Analytics'],
  },
  {
    role: 'Reserve Team Coach', permission_group: 'Coaching Staff', department: 'Coaching', sex: 'male',
    squads: [squad(2, 'Head Coach'), squad(3, 'Head Coach')],
    qualifications: ['UEFA B License', 'Level 3 Coaching', 'Youth Development'],
    specializations: ['Youth Development', 'Athlete Pathways', 'Tactical Training'],
  },
  {
    role: "Women's Team Coach", permission_group: 'Coaching Staff', department: 'Coaching', sex: 'female',
    squads: [squad(4, 'Head Coach')],
    qualifications: ['UEFA A License', 'Level 4 Coaching', 'Sports Science Diploma'],
    specializations: ['Tactical Training', 'Athlete Development', 'Set Pieces'],
  },
  {
    role: 'System Admin', permission_group: 'Administrators', department: 'IT', sex: 'male', isAdmin: true,
    squads: [],
    qualifications: ['BSc Computer Science', 'Systems Administration', 'Database Management'],
    specializations: ['System Management', 'Database Administration', 'Security'],
  },
]

const faker = fakerFor('staff')
const names = namesFor(faker, 'England')
const slug = (text) => text.toLowerCase().normalize('NFD').replace(/[^a-z]/g, '')

const staff = STAFF_PLAN.map((plan, index) => {
  const first = names.firstName(plan.sex)
  const last = names.lastName()
  const hiredDaysAgo = faker.number.int({ min: 200, max: 2600 })
  const lastLoginDaysAgo = faker.number.int({ min: 0, max: 3 })
  return {
    id: index + 1,
    username: `${slug(first)[0]}.${slug(last)}`,
    email: `${slug(first)}.${slug(last)}@${ORGANISATION.domain}`,
    firstname: plan.title ? `${plan.title} ${first}` : first,
    lastname: last,
    role: plan.role,
    permission_group: plan.permission_group,
    is_active: true,
    is_admin: Boolean(plan.isAdmin),
    organisation_id: ORGANISATION.id,
    organisation_name: ORGANISATION.name,
    department: plan.department,
    phone: `+44 20 7946 0${String(100 + index * 2).padStart(3, '0')}`,
    emergency_contact: `+44 20 7946 0${String(101 + index * 2).padStart(3, '0')}`,
    hire_date: isoDate(-hiredDaysAgo),
    qualifications: plan.qualifications,
    specializations: plan.specializations,
    squads: plan.squads,
    last_login: isoDateTime(-lastLoginDaysAgo, faker.number.int({ min: 7, max: 17 }), faker.helpers.arrayElement([0, 15, 30, 45])),
    created_at: isoDateTime(-hiredDaysAgo, 10),
    updated_at: isoDateTime(-lastLoginDaysAgo, 18),
  }
})

export const fullName = (person) => `${person.firstname} ${person.lastname}`

// The first member of staff with a role, such as staffWithRole('Team Doctor').
export const staffWithRole = (role) => staff.find((person) => person.role === role)

export default staff
