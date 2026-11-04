/**
 * The one MUI theme for this repo (replaces @kitman/playbook/themes).
 * Used by the app (src/main.jsx), Storybook (.storybook/preview.jsx) and Playbook
 * components that read rootTheme directly. Palette values mirror design-tokens.css.
 */
import { createTheme } from '@mui/material/styles';

/* eslint-disable design-system/no-hardcoded-colors -- MUI palettes need real color values */
const palette = {
  primary: {
    main: '#3b4960',
    dark: '#3b4960',
    contrastText: '#ffffff',
    focus: 'rgba(59, 73, 96, 0.08)',
  },
  secondary: {
    main: '#f1f2f3',
    dark: '#f1f2f3',
    contrastText: '#3b4960',
  },
  error: { main: '#d32f2f', dark: '#c62828', light: '#e57373', contrastText: '#ffffff' },
  warning: { main: '#ef6c00', dark: '#e65100', light: '#ffb74d', lighter: '#ffe0b2', contrastText: '#ffffff' },
  info: { main: '#0288d1', dark: '#01579b', contrastText: '#ffffff' },
  success: { main: '#2e7d32' },
  background: { default: '#ffffff', paper: '#ffffff' },
};
/* eslint-enable design-system/no-hardcoded-colors */

// Sentence case everywhere: MUI uppercases buttons and tabs by default.
const sentenceCase = { textTransform: 'var(--text-transform)' };

const rootTheme = createTheme({
  palette,
  typography: {
    fontFamily: 'Open Sans, sans-serif',
    button: sentenceCase,
  },
  shape: {
    borderRadius: 4,
  },
  components: {
    MuiTextField: { defaultProps: { variant: 'filled', size: 'small' } },
    MuiFormControl: { defaultProps: { variant: 'filled', size: 'small' } },
    MuiSelect: { defaultProps: { variant: 'filled', size: 'small' } },
    MuiButton: {
      defaultProps: { variant: 'contained', size: 'small', disableElevation: true },
      styleOverrides: {
        root: {
          textTransform: 'var(--button-text-transform)',
          fontWeight: 'var(--button-font-weight)',
          borderRadius: 'var(--button-border-radius)',
        },
      },
    },
    MuiTab: { styleOverrides: { root: sentenceCase } },
    // Grid-internal buttons (toolbar, filter panel) inherit the MuiButton defaults above,
    // so make them contained secondary per the design rules rather than contained primary.
    // Theme slotProps merge per slot with each grid's own slotProps.
    MuiDataGrid: {
      defaultProps: {
        // disableElevation comes from MuiButton defaults; setting it here leaks to icon buttons.
        slotProps: { baseButton: { variant: 'contained', color: 'secondary' } },
      },
    },
    MuiAutocomplete: { defaultProps: { size: 'small' } },
    MuiChip: { defaultProps: { size: 'small' } },
    MuiIconButton: { defaultProps: { size: 'small' } },
  },
});

export { rootTheme };
export default rootTheme;
