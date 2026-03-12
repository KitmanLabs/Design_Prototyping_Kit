import figma from '@figma/code-connect';
import TextField from '@mui/material/TextField';

figma.connect(
  TextField,
  'https://www.figma.com/design/7VG51RENiXwPZrSMvQGmkL?node-id=6570-48313',
  {
    props: {
      label: figma.string('Label'),
      disabled: figma.enum('State', { Disabled: true }),
      error: figma.enum('State', { Error: true }),
    },
    example: ({ label, disabled, error }) => (
      <TextField
        variant="filled"
        size="small"
        label={label}
        disabled={!!disabled}
        error={!!error}
      />
    ),
  }
);
