import { useMediaQuery, useTheme } from '@mui/material';

// Simple hook to detect mobile devices using Material-UI breakpoints

export function useIsMobile() {
  const theme = useTheme();
  return useMediaQuery(theme.breakpoints.down('sm'));
}
