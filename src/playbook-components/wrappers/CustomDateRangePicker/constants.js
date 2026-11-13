import i18n from '@kitman/common/src/utils/i18n';
import { getThisMonth, getThisWeek, getThisYear } from './utils';

// Default quick filters available in the dropdown

export const getDefaultFilters = () => {
  return [
    {
      key: 'week',
      label: i18n.t('This Week'),
      getDateRange: getThisWeek,
    },
    {
      key: 'month',
      label: i18n.t('This Month'),
      getDateRange: getThisMonth,
    },
    {
      key: 'year',
      label: i18n.t('This Year'),
      getDateRange: getThisYear,
    },
  ];
};
