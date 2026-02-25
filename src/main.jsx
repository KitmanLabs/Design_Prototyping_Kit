import './babelHelpersPolyfill'
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material'
import { LicenseInfo } from '@mui/x-license'
import App from './App'
import './styles/design-tokens.css'
import './i18n'

// MUI X Pro license key – hard-coded per request
LicenseInfo.setLicenseKey(
  'bc1c125f0df063ef4d354f52404b3b86Tz0xMTc1MzksRT0xNzg2NTc5MTk5MDAwLFM9cHJlbWl1bSxMTT1zdWJzY3JpcHRpb24sUFY9aW5pdGlhbCxLVj0y'
)

const theme = createTheme({
  typography: {
    fontFamily: 'Open Sans, sans-serif'
  }
})

ReactDOM.createRoot(document.getElementById('root')).render(
  <ThemeProvider theme={theme}>
    <CssBaseline />
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </ThemeProvider>
)