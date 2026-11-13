import { colors } from '@kitman/common/src/variables';

export const globalStyles = {
  '.MuiPickerDay-root:active': {
    backgroundColor: `${colors.neutral_light} !important`,
    color: 'white !important',
    borderRadius: '50% !important',
  },
  '.MuiDialogActions-root.MuiPickersLayout-actionBar': {
    display: 'none !important',
  },
};

export const getTextFieldStyles = (
  variant
) => ({
  cursor: 'pointer',
  backgroundColor: variant === 'menuFilters' ? colors.neutral_200 : '',
  width: variant === 'menuFilters' ? '270px' : '300px',
  borderRadius: variant === 'menuFilters' ? 1 : 0,
  ...(variant === 'menuFilters' && {
    '& .MuiOutlinedInput-notchedOutline': {
      border: 'none',
    },
    '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
      border: 'none',
    },
    '& .MuiInputBase-root': {
      height: '32px',
      fontSize: '14px',
    },
    '& .MuiInputBase-input': {
      padding: '6px 12px',
    },
    '& .MuiInputBase-input::placeholder': {
      color: colors.grey_100,
      opacity: 1,
    },
    '& .MuiIconButton-root': {
      padding: '4px',
      '& .MuiSvgIcon-root': {
        fontSize: '18px',
      },
    },
  }),
});

export const getCalendarContainerStyles = (
  variant
) => ({
  mt: variant === 'menuFilters' ? 0 : 2,
  position: 'absolute',
  zIndex: 100,
  top: 50,
  left: '-50%',
  transform: 'translateX(-10%)',
  backgroundColor: colors.white,
  p: '16px',
  boxShadow: 10,
});

export const getQuickFiltersContainerStyles = () => ({
  pt: 2,
  backgroundColor: colors.white,
});

export const getCalendarHeaderStyles = () => ({
  textAlign: 'left',
  paddingLeft: 3,
  paddingTop: 1,
  borderRight: `1px solid ${colors.grey_300}`,
});

export const getEndCalendarHeaderStyles = () => ({
  textAlign: 'left',
  paddingLeft: 3,
  paddingTop: 1,
});

export const getStartCalendarStyles = () => ({
  borderRight: `1px solid ${colors.grey_300}`,
});

export const getButtonContainerStyles = () => ({
  display: 'flex',
  justifyContent: 'end',
  gap: 1,
});

export const getMobileHeaderStyles = () => ({
  mb: 2,
});

export const getMobileQuickFiltersStyles = () => ({
  mb: 2,
  flexDirection: 'row',
  flexWrap: 'wrap',
});
