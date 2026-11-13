// Injuries and medical records, generated: some current (the athlete is unavailable until the
// return-to-play date) and some resolved. athletes.js reads these, so availability always agrees.
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

const severity = (days) => (days < 14 ? 'Minor' : days <= 28 ? 'Moderate' : 'Major')

const faker = fakerFor('injuries')
const clinicians = [staffWithRole('Team Doctor'), staffWithRole('Physiotherapist')]

// About one athlete in eight is injured now; about one in five had an injury this season.
const shuffled = faker.helpers.shuffle(roster)
const current = shuffled.slice(0, Math.max(2, Math.round(roster.length / 8)))
const resolved = shuffled.slice(current.length, current.length + Math.round(roster.length / 5))

function injury(athlete, isCurrent) {
  const type = faker.helpers.arrayElement(INJURY_TYPES)
  const daysLost = faker.number.int({ min: type.days[0], max: type.days[1] })
  // A current injury happened partway through its recovery; a resolved one ended in the past.
  const occurred = isCurrent
    ? -faker.number.int({ min: 1, max: daysLost - 2 })
    : -faker.number.int({ min: daysLost + 7, max: 200 })
  const rtp = occurred + daysLost
  const lastTreatment = isCurrent ? -faker.number.int({ min: 0, max: Math.min(3, -occurred) }) : rtp - faker.number.int({ min: 1, max: 4 })
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
    status: isCurrent ? 'Recovering' : 'Returned',
    treatment_sessions: Math.max(1, Math.round((isCurrent ? -occurred : daysLost) / 2)),
    last_treatment: isoDate(lastTreatment),
    treating_physician: fullName(faker.helpers.arrayElement(clinicians)),
    notes: type.note,
    created_at: isoDateTime(occurred, 15, 30),
    updated_at: isoDateTime(lastTreatment, 11, 45),
  }
}

const injuries = [...current.map((a) => injury(a, true)), ...resolved.map((a) => injury(a, false))]
  .sort((a, b) => b.occurrence_date.localeCompare(a.occurrence_date))
  .map((record, index) => ({ id: index + 1, ...record }))

export const currentInjuries = injuries.filter((record) => record.status === 'Recovering')

export default injuries
