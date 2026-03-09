/**
 * Local theme for Playbook Components (replaces @kitman/playbook/themes).
 * Uses MUI createTheme with design tokens compatible with existing components.
 */
import { createTheme } from '@mui/material/styles';

const rootTheme = createTheme({
  palette: {
    primary: {
      main: '#3b4960',
      dark: '#3b4960',
      contrastText: '#ffffff',
      focus: 'rgba(59, 73, 96, 0.08)',
    },
    secondary: {
      main: '#f1f2f3',
      contrastText: '#3b4960',
    },
    error: {
      main: '#d32f2f',
      dark: '#c62828',
      light: '#e57373',
    },
    warning: {
      main: '#ef6c00',
      dark: '#e65100',
      light: '#ffb74d',
      lighter: '#ffe0b2',
    },
    info: {
      main: '#0288d1',
      dark: '#01579b',
    },
    success: {
      main: '#2e7d32',
    },
  },
});

export { rootTheme };
export default rootTheme;
