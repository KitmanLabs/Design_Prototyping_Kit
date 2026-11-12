// Athlete profiles, generated: the roster with availability that agrees with the injury records.
import moment from 'moment'
import { fakerFor } from './fake'
import { TODAY, isoDate, isoDateTime } from './clock'
import roster from './roster'
import injuries, { currentInjuries, playingThrough, RETURNING_DAYS } from './injuries_medical'

const faker = fakerFor('athletes')
const injuryFor = new Map(currentInjuries.map((record) => [record.athlete_id, record]))
const playingThroughFor = new Map(playingThrough.map((record) => [record.athlete_id, record]))
const returnedOn = new Map()
for (const record of injuries.filter((r) => r.status === 'Returned')) {
  if (!returnedOn.has(record.athlete_id) || record.rtp_date > returnedOn.get(record.athlete_id)) returnedOn.set(record.athlete_id, record.rtp_date)
}

// iP's availability status, as the Playbook's AvailabilityLabel and athletes list read it:
// unavailable (out), injured (Available (Injured/Ill): playing through), returning (Available
// (Returning from injury/illness)) or available.
const sentence = (text) => text.toLowerCase().replace(/^\w/, (c) => c.toUpperCase())

function availabilityOf(athleteId) {
  if (injuryFor.has(athleteId)) return 'unavailable'
  if (playingThroughFor.has(athleteId)) return 'injured'
  const back = returnedOn.get(athleteId)
  if (back && TODAY.diff(moment(back), 'days') <= RETURNING_DAYS) return 'returning'
  return 'available'
}

// How long the athlete has been in that status, worded as iP sends it in unavailable_since:
// "1 day", "12 days", and "0 days" for an available athlete. AvailabilityLabel shows it under
// any status but Available.
const dayCount = (days) => `${days} ${days === 1 ? 'day' : 'days'}`
function statusSince(athleteId) {
  const open = injuryFor.get(athleteId) ?? playingThroughFor.get(athleteId)
  if (open) return dayCount(TODAY.diff(moment(open.occurrence_date), 'days'))
  if (availabilityOf(athleteId) === 'returning') return dayCount(TODAY.diff(moment(returnedOn.get(athleteId)), 'days'))
  return dayCount(0)
}

const athletes = roster.map((athlete) => {
  const injury = injuryFor.get(athlete.id)
  const playing = playingThroughFor.get(athlete.id)
  const weeksOut = injury ? Math.max(1, Math.ceil(moment(injury.rtp_date).diff(TODAY, 'days') / 7)) : 0
  const updated = -faker.number.int({ min: 0, max: 6 })
  const value = faker.number.int({ min: 3, max: 40 }) * 100
  return {
    id: athlete.id,
    firstname: athlete.firstname,
    lastname: athlete.lastname,
    alias: athlete.alias,
    date_of_birth: athlete.date_of_birth,
    age: athlete.age,
    gender: athlete.gender,
    height: athlete.height,
    weight: athlete.weight,
    country: athlete.country,
    position: athlete.position,
    position_group: athlete.position_group,
    squad_id: athlete.squad_id,
    squad_name: athlete.squad_name,
    organisation_id: athlete.organisation_id,
    is_active: athlete.is_active,
    is_removed: athlete.is_removed,
    availability: availabilityOf(athlete.id),
    unavailable_since: statusSince(athlete.id),
    // The kit's older two-value status, kept for its pages: 'Injured' means out, which is iP's
    // unavailable, not iP's injured. New work reads availability.
    availability_status: injury ? 'Injured' : 'Available',
    rtp_date: injury ? injury.rtp_date : null,
    performance_score: faker.number.int({ min: injury ? 55 : 65, max: 94 }),
    market_value: value >= 1000 ? `$${(value / 1000).toFixed(1)}M` : `$${value}K`,
    fitness_level: injury ? 'Good' : faker.helpers.weightedArrayElement([
      { weight: 3, value: 'Excellent' },
      { weight: 4, value: 'Very Good' },
      { weight: 2, value: 'Good' },
    ]),
    injury_status: injury
      ? `${sentence(injury.injury_type)} - ${weeksOut} week${weeksOut > 1 ? 's' : ''}`
      : playing ? `${sentence(playing.injury_type)} - playing through` : 'Healthy',
    last_assessment: isoDate(-faker.number.int({ min: 1, max: 30 })),
    training_load: injury ? faker.number.float({ min: 2, max: 4.5, fractionDigits: 1 }) : faker.number.float({ min: 5.5, max: 8, fractionDigits: 1 }),
    wellbeing_score: faker.number.float({ min: injury ? 5.5 : 6.5, max: 9, fractionDigits: 1 }),
    created_at: athlete.created_at,
    updated_at: isoDateTime(updated, 14, 20),
  }
})

export default athletes
