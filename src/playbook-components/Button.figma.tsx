import figma from '@figma/code-connect';
import Button from '@mui/material/Button';

figma.connect(
  Button,
  'https://www.figma.com/design/7VG51RENiXwPZrSMvQGmkL?node-id=6543-36744',
  {
    props: {
      label: figma.string('Label'),
      disabled: figma.enum('State', { Disabled: true }),
      variant: figma.enum('Variant', {
        Contained: 'contained',
        Outlined: 'outlined',
        Text: 'text',
      }),
    },
    example: ({ label, disabled }) => (
      <Button variant="contained" size="small" disableElevation disabled={!!disabled}>
        {label}
      </Button>
    ),
  }
);
