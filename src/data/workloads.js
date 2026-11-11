// Daily training load for the squad, for the Squad load (Analysis) and Overview pages.
// Generated from a fixed seed relative to today, so the prototype shows the same pattern
// on every load and always covers the last 28 days.
import moment from 'moment'
import allAthletes from './athletes'
import injuries from './injuries_medical'
import { TODAY } from './clock'

// The First Team: the squad the Squad load and Overview pages show.
const athletes = allAthletes.filter((athlete) => athlete.squad_id === 1)

export const loadRangeOptions = [
  { value: 7, label: 'Last 7 days' },
  { value: 14, label: 'Last 14 days' },
  { value: 28, label: 'Last 28 days' },
]

// moment format for chart axis dates, such as 4 Nov
export const axisDateFormat = 'D MMM'

// Acute:chronic workload ratio above this is flagged as a spike
export const acwrFlagThreshold = 1.3

const HISTORY_DAYS = 56

function seededRandom(seed) {
  let state = seed % 2147483647
  return () => {
    state = (state * 16807) % 2147483647
    return (state - 1) / 2147483646
  }
}

// Two available athletes whose load spikes in the last week, so the flags have something to show
const spikingAthleteIds = athletes
  .filter((athlete) => athlete.availability_status === 'Available' && athlete.position !== 'Goalkeeper')
  .slice(0, 2)
  .map((athlete) => athlete.id)

/**
 * One row per athlete per day for the last 56 days, newest last:
 * { id, date: 'YYYY-MM-DD', athleteId, athleteName, load } where load is in arbitrary units.
 * Rest days (Wednesday and Sunday) have a load of 0. Injured athletes do light rehab only.
 */
export function buildDailyLoad(today = TODAY) {
  const rows = []
  athletes.forEach((athlete) => {
    const random = seededRandom(athlete.id * 7919)
    const base = 250 + athlete.training_load * 45
    for (let offset = HISTORY_DAYS - 1; offset >= 0; offset -= 1) {
      const day = moment(today).startOf('day').subtract(offset, 'days')
      const isRestDay = day.day() === 0 || day.day() === 3
      let load = isRestDay ? 0 : Math.round(base * (0.75 + random() * 0.5))
      if (athlete.availability_status === 'Injured' && offset < 21) load = isRestDay ? 0 : Math.round(80 + random() * 60)
      if (spikingAthleteIds.includes(athlete.id) && offset < 7 && !isRestDay) load = Math.round(load * 1.6)
      rows.push({
        id: `${athlete.id}-${day.format('YYYY-MM-DD')}`,
        date: day.format('YYYY-MM-DD'),
        athleteId: athlete.id,
        athleteName: `${athlete.firstname} ${athlete.lastname}`,
        load,
      })
    }
  })
  return rows
}

/** Percentage of the squad available on each of the last `days` days, oldest first. */
export function buildAvailabilityTrend(days = 14, today = TODAY) {
  const squadIds = new Set(athletes.map((athlete) => athlete.id))
  const squadSize = athletes.length
  return Array.from({ length: days }, (_, i) => {
    const offset = days - 1 - i
    const day = moment(today).startOf('day').subtract(offset, 'days')
    // Unavailable means injured on that day, from the injury records
    const unavailable = new Set(
      injuries
        .filter((record) => squadIds.has(record.athlete_id))
        .filter((record) => day.isSameOrAfter(record.occurrence_date, 'day') && day.isBefore(record.rtp_date, 'day'))
        .map((record) => record.athlete_id)
    ).size
    return {
      date: day.format('YYYY-MM-DD'),
      percentAvailable: Math.round(((squadSize - unavailable) / squadSize) * 100),
    }
  })
}
