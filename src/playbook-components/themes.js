/**
 * The one MUI theme for this repo (replaces @kitman/playbook/themes).
 * Used by the app (src/main.jsx), Storybook (.storybook/preview.jsx) and Playbook
 * components that read rootTheme directly.
 *
 * Mirrors the real Playbook theme (KitmanLabs/kitman-playbook, themes/index.ts) so
 * prototypes look like iP. Colour values come from iP's
 * packages/common/src/variables/colors.js; the names in the comments are theirs.
 * Kit-only additions are marked "Kit:".
 */
import { createTheme } from '@mui/material/styles';

/* eslint-disable design-system/no-hardcoded-colors -- MUI palettes need real color values */
const colors = {
  white: '#ffffff',
  neutral_100: '#f6f6f6',
  neutral_200: '#f1f2f3',
  neutral_400: '#cfd4db',
  grey_100: '#5f7089',
  grey_200: '#3b4960',
  grey_300: '#1f2d44',
  grey_400: '#0d1b30',
  grey_disabled: '#3b4960',
  grey_inactive: '#dedede',
  grey_100_50: '#afb7c4',
  grey_200_12: 'rgba(59, 73, 96, 0.12)',
  p04: '#bec3c7',
  red_100: '#c31d2b',
  red_200: '#b11b27',
  red_300: '#931621',
  red_light: '#feedee',
  orange_100: '#ea7b5d',
  orange_200: '#e55e38',
  orange_300: '#c73f1a',
  orange_400: '#ef6c00',
  yellow_100: '#ffab00',
  green_100: '#43b374',
  green_200: '#0a875a',
  green_300: '#0a6644',
  blue_info: '#e5f6fd',
  beige_50: '#fff4e5',
  brown_600: '#663c00',
};
/* eslint-enable design-system/no-hardcoded-colors */

const palette = {
  text: {
    primary: colors.grey_200,
    secondary: colors.grey_300,
    disabled: colors.grey_disabled,
  },
  primary: {
    main: colors.grey_200,
    dark: colors.grey_400,
    light: colors.grey_100,
    contrastText: colors.white,
    focus: colors.grey_200_12,
  },
  secondary: {
    main: colors.neutral_200,
    dark: colors.neutral_400,
    light: colors.neutral_100,
    contrastText: colors.grey_200,
  },
  error: {
    main: colors.red_200,
    dark: colors.red_300,
    light: colors.red_100,
    light2: colors.red_light,
    contrastText: colors.white,
  },
  warning: {
    main: colors.orange_200,
    dark: colors.orange_300,
    light: colors.orange_100,
    lighter: colors.yellow_100,
    contrastText: colors.white,
  },
  info: {
    main: colors.grey_200,
    dark: colors.grey_400,
    light: colors.grey_100,
    lightBlue: colors.blue_info,
    contrastText: colors.white,
  },
  success: {
    main: colors.green_200,
    dark: colors.green_300,
    light: colors.green_100,
    contrastText: colors.white,
  },
  background: { default: colors.white, paper: colors.white },
  border: { default: colors.grey_100_50, light: colors.p04 },
  common: { white: colors.white, black: colors.grey_200 },
};

// Kit: sentence case through a CSS variable, so tokens control it.
const sentenceCase = { textTransform: 'var(--text-transform)' };

const rootTheme = createTheme({
  palette,
  typography: {
    fontFamily: '"Open Sans", sans-serif',
    h1: { fontSize: 96 },
    h2: { fontSize: 60 },
    h3: { fontSize: 48 },
    h4: { fontSize: 34 },
    h5: { fontSize: 24 },
    h6: { fontSize: 20 },
    subtitle1: { fontSize: 16 },
    subtitle2: { fontSize: 14 },
    body1: { fontSize: 16 },
    body2: { fontSize: 14 },
    caption: { fontSize: 12 },
    overline: { fontSize: 12 },
    button: sentenceCase,
  },
  shape: {
    borderRadius: 4,
  },
  components: {
    // Inputs
    MuiButton: {
      defaultProps: { color: 'primary', size: 'medium', variant: 'contained', disableElevation: true },
      styleOverrides: {
        // Kit: button type and radius come from design tokens.
        root: {
          textTransform: 'var(--button-text-transform)',
          fontWeight: 'var(--button-font-weight)',
          borderRadius: 'var(--button-border-radius)',
        },
      },
    },
    MuiButtonGroup: { defaultProps: { color: 'primary', orientation: 'horizontal', variant: 'contained' } },
    MuiCheckbox: { defaultProps: { color: 'primary', size: 'medium' } },
    MuiFab: { defaultProps: { color: 'default', size: 'large', variant: 'circular' } },
    MuiFormControl: { defaultProps: { fullWidth: true, size: 'medium', variant: 'filled' } },
    MuiRadio: { defaultProps: { color: 'primary', size: 'medium' } },
    MuiRating: { defaultProps: { size: 'medium' } },
    MuiSelect: { defaultProps: { size: 'small', variant: 'filled' } },
    MuiSlider: { defaultProps: { color: 'primary', orientation: 'horizontal', size: 'medium' } },
    MuiSwitch: { defaultProps: { color: 'primary', size: 'medium' } },
    MuiTextField: {
      defaultProps: { size: 'small', variant: 'filled' },
      styleOverrides: {
        root: {
          '& .Mui-disabled': {
            opacity: 0.5,
            color: colors.grey_disabled,
            WebkitTextFillColor: colors.grey_disabled,
          },
        },
      },
    },
    MuiToggleButton: { defaultProps: { size: 'medium' } },
    MuiToggleButtonGroup: { defaultProps: { size: 'medium' } },

    // Data display
    MuiAvatar: { defaultProps: { sx: { height: '40px', width: '40px' }, variant: 'circular' } },
    MuiBadge: { defaultProps: { color: 'default', variant: 'standard' } },
    MuiChip: { defaultProps: { color: 'default', size: 'medium', variant: 'filled' } },
    MuiIcon: { defaultProps: { fontSize: 'medium' } },

    // Surfaces
    MuiAccordion: {
      defaultProps: { disableGutters: true },
      styleOverrides: {
        root: {
          boxShadow: 'unset',
          '&.MuiAccordion-root': { '::before': { opacity: 1 } },
        },
      },
    },

    // Navigation
    MuiStepIcon: { styleOverrides: { root: { color: colors.grey_inactive } } },
    MuiTab: { styleOverrides: { root: sentenceCase } },

    // Feedback
    MuiAlert: {
      styleOverrides: {
        root: {
          '&.MuiAlert-standardWarning': { backgroundColor: colors.beige_50, color: colors.brown_600 },
          '&.MuiAlert-filledWarning': { backgroundColor: colors.orange_400 },
        },
      },
    },

    // Date and time pickers
    MuiDatePicker: { defaultProps: { showDaysOutsideCurrentMonth: true } },

    // Kit: grid-internal buttons (toolbar, filter panel) inherit the MuiButton defaults above,
    // so make them contained secondary per the design rules rather than contained primary.
    // Theme slotProps merge per slot with each grid's own slotProps.
    MuiDataGrid: {
      defaultProps: {
        // disableElevation comes from MuiButton defaults; setting it here leaks to icon buttons.
        slotProps: { baseButton: { variant: 'contained', color: 'secondary' } },
      },
    },
  },
});

export { rootTheme };
export default rootTheme;
