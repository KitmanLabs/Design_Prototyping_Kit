import './babelHelpersPolyfill'
import React from 'react'
import ReactDOM from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import { ThemeProvider, CssBaseline } from '@mui/material'
import { LicenseInfo } from '@mui/x-license'
import App from './App'
import { rootTheme } from './playbook-components/themes'
import meta from '../prototype.json'
import './styles/design-tokens.css'
import './i18n'

// The MUI X licence key comes from the environment when the prototype runs locally, never
// from a file in this folder. Builds for the record leave it out.
const muiLicenseKey = import.meta.env.VITE_MUI_X_LICENSE_KEY
if (muiLicenseKey) {
  LicenseInfo.setLicenseKey(muiLicenseKey)
}

// Every route sits under its version (#/v1/...), so a route says which version it belongs to.
const basename = `/${meta.version}`
if (!new RegExp(`^#${basename}(/|$)`).test(window.location.hash)) {
  window.location.replace(`#${basename}/`)
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <ThemeProvider theme={rootTheme}>
    <CssBaseline />
    <HashRouter basename={basename}>
      <App />
    </HashRouter>
  </ThemeProvider>
)
