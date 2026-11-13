/**
 * Stand-in for @kitman/playbook/providers from the iP monorepo.
 */
import { createElement } from 'react';
import { LocalizationProvider as MuiLocalizationProvider } from '@mui/x-date-pickers-pro';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';

export { ThemeProvider } from '@mui/material/styles';

/** MUI LocalizationProvider preset to moment, the one date library in this repo. */
export const LocalizationProvider = ({ children, ...props }) =>
  createElement(MuiLocalizationProvider, { dateAdapter: AdapterMoment, ...props }, children);
