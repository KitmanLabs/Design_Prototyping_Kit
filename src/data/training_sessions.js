// The last week of training sessions, generated around the First Team's game days.
import { fakerFor } from './fake'
import { day, isoDateTime } from './clock'
import { SQUAD_PLAN } from './club'
import athletes from './athletes'
import games from './games_matches'
import { fullName, staffWithRole } from './users_staff'

const faker = fakerFor('training')

const SESSION_TYPES = [
  {
    session_type: 'Strength Training', workload_type: 'Resistance', location: 'Gym A', surface_type: 'Gym Floor', intensity: 'High', duration: 90, rpe: [7, 8.5], coach: 'Strength & Conditioning Coach',
    exercises: [
      { name: 'Back Squat', sets: 4, reps: 8, weight: '80-85kg', rest: '90s' },
      { name: 'Romanian Deadlift', sets: 3, reps: 8, weight: '70-75kg', rest: '90s' },
      { name: 'Nordic Curl', sets: 3, reps: 6, weight: 'Bodyweight', rest: '60s' },
    ],
    note: 'Good session. Athletes showed improvement in squat depth.',
  },
  {
    session_type: 'Technical Skills', workload_type: 'Technical', location: 'Training Field 1', surface_type: 'Natural Grass', intensity: 'Medium', duration: 75, rpe: [5.5, 7], coach: 'Assistant Coach',
    exercises: [
      { name: 'Rondo 5v2', sets: 4, reps: 1, weight: '-', rest: '60s' },
      { name: 'Passing Patterns', sets: 3, reps: 1, weight: '-', rest: '90s' },
    ],
    note: 'Focus on first touch, showing improvement.',
  },
  {
    session_type: 'Tactical Training', workload_type: 'Tactical', location: 'Training Field 2', surface_type: 'Natural Grass', intensity: 'Medium', duration: 90, rpe: [6, 7.5], coach: 'Head Coach',
    exercises: [
      { name: 'Pressing Shape 11v11', sets: 3, reps: 1, weight: '-', rest: '120s' },
      { name: 'Set Pieces', sets: 2, reps: 1, weight: '-', rest: '60s' },
    ],
    note: 'Good tactical understanding of the pressing triggers.',
  },
  {
    session_type: 'Recovery', workload_type: 'Recovery', location: 'Recovery Centre', surface_type: 'Mats', intensity: 'Low', duration: 45, rpe: [2.5, 4], coach: 'Physiotherapist',
    exercises: [
      { name: 'Mobility Circuit', sets: 2, reps: 1, weight: '-', rest: '30s' },
      { name: 'Pool Session', sets: 1, reps: 1, weight: '-', rest: '-' },
    ],
    note: 'Recovery session the day after the game. Good participation.',
  },
  {
    session_type: 'Match Preparation', workload_type: 'Tactical', location: 'Main Stadium', surface_type: 'Natural Grass', intensity: 'Medium', duration: 60, rpe: [5, 6.5], coach: 'Head Coach',
    exercises: [
      { name: 'Activation', sets: 1, reps: 1, weight: '-', rest: '-' },
      { name: 'Unit Shape Walkthrough', sets: 2, reps: 1, weight: '-', rest: '60s' },
    ],
    note: 'Final preparation before the game. The group looks sharp.',
  },
]

const gameDays = games.map((g) => g.date)
const daysFromGame = (date, direction) => {
  const candidates = gameDays
    .map((g) => direction * date.diff(g, 'days'))
    .filter((d) => d >= 0)
  return candidates.length ? Math.min(...candidates) : null
}

const sessions = []
for (let offset = -1; offset >= -9 && sessions.length < 6; offset--) {
  const date = day(offset)
  if (gameDays.includes(date.format('YYYY-MM-DD'))) continue
  const after = daysFromGame(date, 1)
  const before = daysFromGame(date, -1)
  const type = after === 1 ? SESSION_TYPES[3] : before === 1 ? SESSION_TYPES[4] : SESSION_TYPES[sessions.length % 3]
  const squad = sessions.length % 3 === 2 ? SQUAD_PLAN[1] : SQUAD_PLAN[0]
  const squadSize = athletes.filter((a) => a.squad_id === squad.id).length
  const available = athletes.filter((a) => a.squad_id === squad.id && a.availability_status === 'Available').length
  const rpe = faker.number.float({ min: type.rpe[0], max: type.rpe[1], fractionDigits: 1 })
  sessions.push({
    id: sessions.length + 1,
    date: date.format('YYYY-MM-DD'),
    session_type: type.session_type,
    duration: type.duration,
    squad_id: squad.id,
    squad_name: squad.name,
    organisation_id: 1,
    intensity: type.intensity,
    workload_type: type.workload_type,
    average_workload: Math.round(rpe * 9) / 10,
    status: 'Completed',
    attendance: available - faker.number.int({ min: 0, max: 1 }),
    max_attendance: squadSize,
    location: type.location,
    coach: fullName(staffWithRole(squad.id === 2 && type.coach === 'Head Coach' ? 'Reserve Team Coach' : type.coach)),
    session_rpe: rpe,
    weather_condition: type.surface_type === 'Natural Grass' ? faker.helpers.arrayElement(['Sunny', 'Cloudy', 'Overcast', 'Light Rain']) : 'Indoor',
    surface_type: type.surface_type,
    game_day_plus: after,
    game_day_minus: before,
    exercises: type.exercises,
    notes: type.note,
    created_at: isoDateTime(offset, 8),
    updated_at: isoDateTime(offset, 10, 30),
  })
}

export default sessions
