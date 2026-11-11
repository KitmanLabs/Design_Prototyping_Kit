// "Today" for every date in the mock data. Dates are generated relative to it, so the data
// always looks current. A build for the record pins it (VITE_PROTOTYPE_TODAY, as YYYY-MM-DD),
// so that version renders the same dates whenever it's served.
import moment from 'moment'

const pinned = import.meta.env?.VITE_PROTOTYPE_TODAY

export const TODAY = (pinned ? moment(pinned, 'YYYY-MM-DD', true) : moment()).startOf('day')

// The day `offset` days from today (negative for the past), as a moment.
export const day = (offset = 0) => TODAY.clone().add(offset, 'days')

// The same day as YYYY-MM-DD.
export const isoDate = (offset = 0) => day(offset).format('YYYY-MM-DD')

// A timestamp on that day, as YYYY-MM-DDTHH:mm:00Z.
export const isoDateTime = (offset = 0, hour = 9, minute = 0) =>
  day(offset).hour(hour).minute(minute).format('YYYY-MM-DD[T]HH:mm:00[Z]')

// The season label for today, such as 2026-27 (seasons start in July).
export const season = () => {
  const start = TODAY.month() >= 6 ? TODAY.year() : TODAY.year() - 1
  return `${start}-${String((start + 1) % 100).padStart(2, '0')}`
}
