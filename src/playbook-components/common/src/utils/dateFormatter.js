/**
 * Stub for @kitman/common/src/utils/dateFormatter
 */
import moment from 'moment';

// As iP's formatShort: moment's locale short date ('L'), so 11/12/2026 under en and
// 12/11/2026 under en-gb, rather than a fixed format.
export function formatShort(date) {
  if (!date) return '';
  const d = moment(date);
  return d.isValid() ? d.format('L') : String(date);
}
