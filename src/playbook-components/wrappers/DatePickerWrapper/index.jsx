import { DatePicker, Box } from '@kitman/playbook/components';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';

import { useState } from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { rootTheme } from '@kitman/playbook/themes';
import { zIndices } from '@kitman/common/src/variables';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

const createDatePickerTheme = (theme) =>
  createTheme({
    ...theme,
    components: {
      MuiFormControl: {
        styleOverrides: {
          root: { width: '100%' },
        },
      },
      MuiPickersPopper: {
        styleOverrides: {
          root: { zIndex: zIndices.popover },
        },
      },

      MuiPickersDay: {
        styleOverrides: {
          root: {
            '&.Mui-selected': { backgroundColor: rootTheme.palette.info.light },
            '&.Mui-selected:focus': {
              backgroundColor: rootTheme.palette.info.light,
            },
            '&.MuiButtonBase-root:hover': {
              backgroundColor: rootTheme.palette.border.light,
              color: rootTheme.palette.common.white,
            },
          },
        },
      },
      MuiInputBase: {
        styleOverrides: {
          root: {
            height: '3rem',
            background: rootTheme.palette.common.white,
            border: '1px solid',
            borderColor: rootTheme.palette.border.default,
          },
        },
      },
    },
  });

const DatePickerWrapper = (props) => {
  const [open, setOpen] = useState(false);
  return (
    <ThemeProvider theme={createDatePickerTheme}>
      <LocalizationProvider dateAdapter={AdapterMoment}>
        <Box
          sx={{
            label: {
              color: rootTheme.palette.primary.light,
              marginBottom: '0.2rem',
              fontWeight: 600,
              fontSize: '0.75rem', // 12px
              fontFamily: 'Open Sans',
            },
            fieldset: {
              border: 'none',
            },
          }}
        >
          <label>{props.inputLabel}</label>
          <DatePicker
            open={open}
            onOpen={() => setOpen(true)}
            onClose={() => setOpen(false)}
            slotProps={{
              textField: {
                placeholder: props.placeholder || 'MM/DD/YYYY',
                error: !!props.isInvalid,
                onClick: () => setOpen(true),
              },
            }}
            {...props}
          />
        </Box>
      </LocalizationProvider>
    </ThemeProvider>
  );
};

export default DatePickerWrapper;
