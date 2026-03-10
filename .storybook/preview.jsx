import React from 'react';
import { ThemeProvider } from '@mui/material/styles';
import { LocalizationProvider } from '@mui/x-date-pickers-pro';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { rootTheme } from '../src/playbook-components/themes';
import '../src/styles/design-tokens.css';

const preview = {
  decorators: [
    (Story) => (
      <ThemeProvider theme={rootTheme}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
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
