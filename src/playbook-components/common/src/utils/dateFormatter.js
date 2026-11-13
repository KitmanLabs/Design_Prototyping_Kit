/**
 * Stub for @kitman/common/src/utils/dateFormatter
 */
import moment from 'moment';

export function formatShort(date) {
  if (!date) return '';
  const d = moment(date);
  return d.isValid() ? d.format('DD/MM/YYYY') : String(date);
}
