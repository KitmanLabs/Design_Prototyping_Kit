import { colors } from '@kitman/common/src/variables';

export const dateRangePickerStyles = {
  // Container styles
  container: {
    display: 'flex',
    alignItems: 'center',
    gap: 1,
  },

  // Common date picker input styles
  datePickerInput: {
    '& .MuiInputBase-root': {
      height: '1.88rem',
      fontSize: '0.88rem',
    },
    '& input': {
      height: '1.88rem',
      padding: '0 0.5rem',
      boxSizing: 'border-box',
    },
    '& .MuiInputAdornment-root': {
      display: 'flex',
    },
    '& .Mui-disabled': {
      cursor: 'not-allowed',
      pointerEvents: 'auto',
      '& .MuiInputBase-input': {
        cursor: 'not-allowed',
      },
    },
    '& .MuiInputLabel-root': {
      fontSize: '0.88rem',
      color: colors.grey_200,
      top: '-0.25rem',
      transform: 'translate(0.88rem, 0.5rem) scale(1)',
    },
    '& .MuiInputLabel-shrink': {
      transform: 'translate(0.88rem, -0.7rem) scale(0.7)',
    },
  },

  // Separator dash styles
  separatorText: {
    color: 'text.secondary',
    fontSize: '1rem',
    fontWeight: 500,
    px: 0.5,
  },

  // Clear button positioned styles
  clearButton: {
    minWidth: '2.5rem',
    height: '2rem',
    transform: 'translateX(-0.63rem)', // -10px converted to rem
  },

  // Calendar icon styles
  calendarIcon: {
    fontSize: '1rem',
    color: 'action.active',
  },
};
