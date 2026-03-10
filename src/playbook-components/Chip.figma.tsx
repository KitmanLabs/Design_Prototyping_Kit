import figma from '@figma/code-connect';
import Chip from '@mui/material/Chip';

figma.connect(
  Chip,
  'https://www.figma.com/design/7VG51RENiXwPZrSMvQGmkL?node-id=6588-47683',
  {
    props: {
      label: figma.string('Label'),
      disabled: figma.enum('State', { Disabled: true }),
      color: figma.enum('Color', {
        Default: 'default',
        Primary: 'primary',
        Secondary: 'secondary',
        Error: 'error',
        Warning: 'warning',
        Info: 'info',
        Success: 'success',
      }),
    },
    example: ({ label, disabled, color }) => (
      <Chip
        label={label}
        size="small"
        color={color}
        disabled={!!disabled}
      />
    ),
  }
);
