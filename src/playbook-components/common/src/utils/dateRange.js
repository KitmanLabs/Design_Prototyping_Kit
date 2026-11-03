/**
 * Stub for @kitman/common/src/utils/dateRange
 */
import moment from 'moment';

export function isDateInRange(date, rangeStart, rangeEnd) {
  if (!date || !rangeStart || !rangeEnd) return false;
  const d = moment(date);
  const start = moment(rangeStart);
  const end = moment(rangeEnd);
  return (d.isAfter(start) || d.isSame(start, 'day')) && (d.isBefore(end) || d.isSame(end, 'day'));
}
