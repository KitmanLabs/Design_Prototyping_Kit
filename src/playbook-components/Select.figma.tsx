import figma from '@figma/code-connect';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';

figma.connect(
  Select,
  'https://www.figma.com/design/7VG51RENiXwPZrSMvQGmkL?node-id=6570-41424',
  {
    props: {
      label: figma.string('Label'),
      disabled: figma.enum('State', { Disabled: true }),
    },
    example: ({ label, disabled }) => (
      <FormControl variant="filled" size="small" fullWidth>
        <InputLabel>{label}</InputLabel>
        <Select disabled={!!disabled}>
          <MenuItem value="">None</MenuItem>
        </Select>
      </FormControl>
    ),
  }
);
