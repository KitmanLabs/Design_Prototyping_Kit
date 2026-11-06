// Daily training load for the squad, for the Squad load (Analysis) and Overview pages.
// Generated from a fixed seed relative to today, so the prototype shows the same pattern
// on every load and always covers the last 28 days.
import moment from 'moment'
import athletes from './athletes.json'

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

// Athletes whose load spikes in the last week, so the flags have something to show
const spikingAthleteIds = [3, 6]

/**
 * One row per athlete per day for the last 56 days, newest last:
 * { id, date: 'YYYY-MM-DD', athleteId, athleteName, load } where load is in arbitrary units.
 * Rest days (Wednesday and Sunday) have a load of 0. Injured athletes do light rehab only.
 */
export function buildDailyLoad(today = moment()) {
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
export function buildAvailabilityTrend(days = 14, today = moment()) {
  const random = seededRandom(4243)
  const squadSize = athletes.length
  return Array.from({ length: days }, (_, i) => {
    const offset = days - 1 - i
    // Today matches athletes.json (one athlete unavailable); earlier days vary between one and three
    const unavailable = offset === 0 ? 1 : 1 + Math.floor(random() * 3)
    return {
      date: moment(today).startOf('day').subtract(offset, 'days').format('YYYY-MM-DD'),
      percentAvailable: Math.round(((squadSize - unavailable) / squadSize) * 100),
    }
  })
}
