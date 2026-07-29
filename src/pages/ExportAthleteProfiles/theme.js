import { createTheme } from '@mui/material'

// Local theme for the standalone Export athlete profiles prototype.
// Hardcoded brand hexes are intentional here — this prototype mirrors a
// specific Kitman screen and is rendered outside the app's global theme.
/* eslint-disable design-system/no-hardcoded-colors */
export const C = {
  navy: '#1A2133',
  accent: '#2850ED',
  accentBg: '#E7EDFD',
  green: '#22A35C',
  inactive: '#C7CCD4',
  pageBg: '#F3F4F7',
  chipGrey: '#EAECF0',
  warmBg: '#FFF7E5',
  red: '#D8443C',
}

export const exportTheme = createTheme({
  palette: {
    primary: { main: C.accent },
    success: { main: C.green },
    background: { default: C.pageBg, paper: '#FFFFFF' },
  },
  typography: {
    fontFamily: 'Inter, sans-serif',
  },
  shape: { borderRadius: 8 },
  components: {
    MuiTextField:   { defaultProps: { variant: 'filled', size: 'small' } },
    MuiFormControl: { defaultProps: { variant: 'filled', size: 'small' } },
    MuiSelect:      { defaultProps: { variant: 'filled', size: 'small' } },
    MuiFilledInput: {
      styleOverrides: {
        root: {
          backgroundColor: C.pageBg,
          '&:hover': { backgroundColor: C.pageBg },
          '&.Mui-focused': { backgroundColor: C.pageBg },
        },
      },
    },
  },
})
/* eslint-enable design-system/no-hardcoded-colors */
