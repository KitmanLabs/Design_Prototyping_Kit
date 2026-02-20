import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material'
import { LicenseInfo } from '@mui/x-license'
import App from './App'
import './styles/design-tokens.css'

// MUI X Pro license key – set before first component render to remove watermarks and console warnings
LicenseInfo.setLicenseKey(
  import.meta.env.VITE_MUI_LICENSE ??
    '4e5ec90a1afaadb78690f94968111927Tz05NTgxNSxFPTE3NTQ3NDE0NDcwMDAsUz1wcmVtaXVtLExNPXN1YnNjcmlwdGlvbixQVj1pbml0aWFsLEtWPTI='
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