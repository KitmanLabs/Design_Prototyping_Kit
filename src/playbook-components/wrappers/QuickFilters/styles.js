import { colors } from '@kitman/common/src/variables';

export const getQuickFiltersBoxStyles = () => ({
  minWidth: 70,
});

export const getChipStyles = (isSelected) => ({
  backgroundColor: isSelected ? colors.grey_300 : '',
  color: isSelected ? colors.white : '',
  '&:hover': {
    backgroundColor: isSelected ? colors.grey_300 : '',
  },
});
