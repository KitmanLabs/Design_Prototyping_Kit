import './babelHelpersPolyfill'
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { ThemeProvider, CssBaseline } from '@mui/material'
import { LicenseInfo } from '@mui/x-license'
import App from './App'
import { rootTheme } from './playbook-components/themes'
import './styles/design-tokens.css'
import './i18n'

const muiLicenseKey = import.meta.env.VITE_MUI_X_LICENSE_KEY
if (muiLicenseKey) {
  LicenseInfo.setLicenseKey(muiLicenseKey)
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <ThemeProvider theme={rootTheme}>
    <CssBaseline />
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </ThemeProvider>
)
