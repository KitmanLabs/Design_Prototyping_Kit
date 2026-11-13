// Injuries and medical records, generated. athletes.js reads these, so availability always agrees.
// Each record's availability is what it means for the athlete today, using the injury form's values:
// - Unavailable: open, and the athlete is out until the return-to-play date (currentInjuries)
// - Modified: open, but minor, so the athlete trains and plays through it (playingThrough)
// - Available: resolved. Some resolved in the last RETURNING_DAYS, so the athlete is returning.
import { fakerFor } from './fake'
import { isoDate, isoDateTime } from './clock'
import roster, { athleteName } from './roster'
import { fullName, staffWithRole } from './users_staff'

const INJURY_TYPES = [
  {
    injury_type: 'Knee Strain', osics_code: 'KNES01', body_part: 'Knee', body_region: 'Lower Limb',
    pathology: 'Joint/Ligament', mechanism: 'Non-contact', days: [10, 28], sided: true,
    note: 'Grade 1 MCL strain sustained during training. Progressing with physiotherapy.',
  },
  {
    injury_type: 'Hamstring Strain', osics_code: 'THPS01', body_part: 'Hamstring', body_region: 'Lower Limb',
    pathology: 'Muscle/Tendon', mechanism: 'Sprint', days: [14, 35], sided: true,
    note: 'Grade 2 hamstring strain. Progressive loading program under way.',
  },
  {
    injury_type: 'Ankle Sprain', osics_code: 'AKLS01', body_part: 'Ankle', body_region: 'Lower Limb',
    pathology: 'Joint/Ligament', mechanism: 'Contact', days: [7, 21], sided: true,
    note: 'Grade 1 lateral ankle sprain. Early mobilisation.',
  },
  {
    injury_type: 'Concussion', osics_code: 'HCON01', body_part: 'Head', body_region: 'Head/Neck',
    pathology: 'Central/Peripheral Nervous System', mechanism: 'Contact', days: [10, 21], sided: false,
    note: 'Sport-related concussion. Following the graduated return-to-play protocol.',
  },
  {
    injury_type: 'Groin Strain', osics_code: 'HIPS01', body_part: 'Groin', body_region: 'Lower Limb',
    pathology: 'Muscle/Tendon', mechanism: 'Non-contact', days: [10, 24], sided: true,
    note: 'Adductor strain. Eccentric strengthening program.',
  },
]

// Minor injuries an athlete trains and plays through: open, with no days lost.
const PLAYING_THROUGH_TYPES = [
  {
    injury_type: 'Thigh Contusion', osics_code: 'TQHX01', body_part: 'Thigh', body_region: 'Lower Limb',
    pathology: 'Contusion', mechanism: 'Contact', days: [0, 0], sided: true,
    note: 'Dead leg from a collision in training. Training fully, checked daily.',
  },
  {
    injury_type: 'Ankle Sprain', osics_code: 'AKLS01', body_part: 'Ankle', body_region: 'Lower Limb',
    pathology: 'Joint/Ligament', mechanism: 'Non-contact', days: [0, 0], sided: true,
    note: 'Mild lateral ankle sprain. Training with strapping.',
  },
]

// An athlete whose injury resolved this many days ago or fewer is returning from it.
export const RETURNING_DAYS = 14

const severity = (days) => (days < 14 ? 'Minor' : days <= 28 ? 'Moderate' : 'Major')

const faker = fakerFor('injuries')
const clinicians = [staffWithRole('Team Doctor'), staffWithRole('Physiotherapist')]

// About one athlete in eight is injured now; about one in five had an injury this season.
const shuffled = faker.helpers.shuffle(roster)
const current = shuffled.slice(0, Math.max(2, Math.round(roster.length / 8)))
const resolved = shuffled.slice(current.length, current.length + Math.round(roster.length / 5))

// Every squad also has one athlete back from an injury and one playing through a minor one, so
// iP's returning and injured statuses show in any squad, and all four show in the First Team.
const taken = new Set([...current, ...resolved].map((athlete) => athlete.id))
const pick = (squadId) => {
  const athlete = shuffled.find((a) => a.squad_id === squadId && !taken.has(a.id))
  if (athlete) taken.add(athlete.id)
  return athlete
}
const squadIds = [...new Set(roster.map((athlete) => athlete.squad_id))]
const returning = squadIds.map(pick).filter(Boolean)
const playing = squadIds.map(pick).filter(Boolean)

// kind: 'current' (out now), 'resolved' (back a while), 'returning' (back within RETURNING_DAYS)
// or 'playing' (playing through). Current and resolved records are made first, so the other two
// kinds never change them.
function injury(athlete, kind) {
  const isCurrent = kind === 'current'
  const type = faker.helpers.arrayElement(kind === 'playing' ? PLAYING_THROUGH_TYPES : INJURY_TYPES)
  const daysLost = faker.number.int({ min: type.days[0], max: type.days[1] })
  // A current injury happened partway through its recovery; a resolved one ended in the past,
  // a returning one within RETURNING_DAYS; one played through never stopped the athlete.
  const occurred = {
    current: () => -faker.number.int({ min: 1, max: daysLost - 2 }),
    resolved: () => -faker.number.int({ min: daysLost + 7, max: 200 }),
    returning: () => -faker.number.int({ min: daysLost + 1, max: daysLost + RETURNING_DAYS - 1 }),
    playing: () => -faker.number.int({ min: 1, max: 10 }),
  }[kind]()
  const rtp = occurred + daysLost
  const isOpen = isCurrent || kind === 'playing'
  const lastTreatment = isOpen ? -faker.number.int({ min: 0, max: Math.min(3, -occurred) }) : rtp - faker.number.int({ min: 1, max: 4 })
  return {
    athlete_id: athlete.id,
    athlete_name: athleteName(athlete),
    injury_type: type.injury_type,
    osics_code: type.osics_code,
    body_part: type.body_part,
    body_region: type.body_region,
    side: type.sided ? faker.helpers.arrayElement(['Left', 'Right']) : 'Not applicable',
    pathology: type.pathology,
    mechanism: type.mechanism,
    severity: severity(daysLost),
    occurrence_date: isoDate(occurred),
    rtp_date: isoDate(rtp),
    days_lost: daysLost,
    status: isOpen ? 'Recovering' : 'Returned',
    availability: isCurrent ? 'Unavailable' : kind === 'playing' ? 'Modified' : 'Available',
    treatment_sessions: Math.max(1, Math.round((isOpen ? -occurred : daysLost) / 2)),
    last_treatment: isoDate(lastTreatment),
    treating_physician: fullName(faker.helpers.arrayElement(clinicians)),
    notes: type.note,
    created_at: isoDateTime(occurred, 15, 30),
    updated_at: isoDateTime(lastTreatment, 11, 45),
  }
}

const injuries = [
  ...current.map((a) => injury(a, 'current')),
  ...resolved.map((a) => injury(a, 'resolved')),
  ...returning.map((a) => injury(a, 'returning')),
  ...playing.map((a) => injury(a, 'playing')),
]
  .sort((a, b) => b.occurrence_date.localeCompare(a.occurrence_date))
  .map((record, index) => ({ id: index + 1, ...record }))

// Open injuries that keep the athlete out until their return-to-play date.
export const currentInjuries = injuries.filter((record) => record.status === 'Recovering' && record.availability === 'Unavailable')
// Open injuries the athlete trains and plays through.
export const playingThrough = injuries.filter((record) => record.status === 'Recovering' && record.availability === 'Modified')

export default injuries
