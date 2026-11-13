import moment from 'moment'

/**
 * MUI date pickers in this repo use AdapterMoment, so they take and return moment
 * objects. Components that keep their state as plain Date objects convert at the
 * picker boundary with these helpers.
 */

/** Date | string | number | null -> moment | null, for a picker's value/minDate/maxDate. */
export const toMoment = (date) => (date == null ? null : moment(date))

/**
 * Wraps a picker onChange/onAccept handler so it receives a Date (or null) instead of
 * a moment. An invalid, partly typed value arrives as an Invalid Date, as it did with
 * AdapterDateFns.
 */
export const withDate = (handler) => (value, context) =>
  handler(value == null ? null : value.toDate(), context)
