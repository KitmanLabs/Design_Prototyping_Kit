import React from 'react';
import { ThemeProvider } from '@mui/material/styles';
import { LocalizationProvider } from '@mui/x-date-pickers-pro';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { rootTheme } from '../src/playbook-components/themes';
import '../src/styles/design-tokens.css';
import '../src/i18n';
import { LicenseInfo } from '@mui/x-license';

const muiLicenseKey = import.meta.env.VITE_MUI_X_LICENSE_KEY;
if (muiLicenseKey) {
  LicenseInfo.setLicenseKey(muiLicenseKey);
}

const preview = {
  decorators: [
    (Story) => (
      <ThemeProvider theme={rootTheme}>
        <LocalizationProvider dateAdapter={AdapterMoment}>
          <Story />
        </LocalizationProvider>
      </ThemeProvider>
    ),
  ],
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
  },
};

export default preview;
