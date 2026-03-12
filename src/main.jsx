import './babelHelpersPolyfill'
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material'
import { LicenseInfo } from '@mui/x-license'
import App from './App'
import './styles/design-tokens.css'
import './i18n'

const muiLicenseKey = import.meta.env.VITE_MUI_X_LICENSE_KEY
if (muiLicenseKey) {
  LicenseInfo.setLicenseKey(muiLicenseKey)
}

const theme = createTheme({
  typography: {
    fontFamily: 'Open Sans, sans-serif',
  },
  shape: {
    borderRadius: 4,
  },
  /* eslint-disable design-system/no-hardcoded-colors */
  palette: {
    primary:    { main: '#3b4960', dark: '#3b4960', contrastText: '#ffffff' },
    secondary:  { main: '#f1f2f3', dark: '#f1f2f3', contrastText: '#3b4960' },
    error:      { main: '#d32f2f', dark: '#c62828', contrastText: '#ffffff' },
    warning:    { main: '#ef6c00', dark: '#e65100', contrastText: '#ffffff' },
    info:       { main: '#0288d1', dark: '#01579b', contrastText: '#ffffff' },
    success:    { main: '#2e7d32' },
    background: { default: '#ffffff', paper: '#ffffff' },
  },
  /* eslint-enable design-system/no-hardcoded-colors */
  components: {
    MuiTextField:     { defaultProps: { variant: 'filled', size: 'small' } },
    MuiFormControl:   { defaultProps: { variant: 'filled', size: 'small' } },
    MuiSelect:        { defaultProps: { variant: 'filled', size: 'small' } },
    MuiButton:        { defaultProps: { variant: 'contained', size: 'small', disableElevation: true } },
    MuiLoadingButton: { defaultProps: { variant: 'contained', size: 'small', disableElevation: true } },
    MuiAutocomplete:  { defaultProps: { size: 'small' } },
    MuiChip:          { defaultProps: { size: 'small' } },
    MuiIconButton:    { defaultProps: { size: 'small' } },
  },
})

ReactDOM.createRoot(document.getElementById('root')).render(
  <ThemeProvider theme={theme}>
    <CssBaseline />
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </ThemeProvider>
)