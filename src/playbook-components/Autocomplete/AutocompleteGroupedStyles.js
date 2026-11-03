import { styled, lighten, darken } from '@mui/material/styles';

export const GroupHeader = styled('div')(({ theme }) => ({
  position: 'sticky',
  top: '-8px',
  padding: '4px 10px',
  color: theme.palette.primary.main,
  // Conditionally set backgroundColor based on theme mode
  backgroundColor:
    theme.palette.mode === 'dark'
      ? darken(theme.palette.primary.main, 0.8)
      : lighten(theme.palette.primary.light, 0.85),
}));

export const GroupItems = styled('ul')({
  padding: 0,
});
