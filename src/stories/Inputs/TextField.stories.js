import {
  FilledInput,
  FormControl,
  FormHelperText,
  InputAdornment,
  InputLabel,
  TextField,
} from '../../playbook-components';
import { AccountCircle } from '@mui/icons-material';

const docs = {
  muiLink: 'https://mui.com/material-ui/react-text-field/',
  figmaLink:
    'https://www.figma.com/file/VgFMXAuaLKSWTvEbjXHhnc/The-Playbook-Master?type=design&node-id=11022-144715&mode=design&t=OTu4zhsV14ZJPRXi-0',
};

export default {
  title: 'Inputs/Textfield',
  component: TextField,
  render: ({ ...args }) => <TextField {...args} sx={{ width: 250 }} />,
  parameters: {
    layout: 'centered',
    docs: {
    },
  },
  tags: ['autodocs'],

  argTypes: {
    autocomplete: {
      control: 'boolean',
      description: 'If component allows autofill or not',
    },
    color: {
      control: 'select',
      options: ['primary', 'secondary', 'error', 'info', 'success', 'warning'],
      description: 'TextField color styles',
    },
    disabled: {
      control: 'boolean',
      description: 'If component is disabled or not',
    },
    error: {
      control: 'boolean',
      description: 'If component is erroring or not',
    },
    fullWidth: {
      control: 'boolean',
      description: 'If component is fullWidth or not',
    },
    label: {
      control: 'text',
      description: 'TextField label text',
    },
    multiline: {
      control: 'boolean',
      description: 'If component is multiline or not',
    },
    placeholder: {
      control: 'text',
      defaultValue: 'Placeholder text',
      description: 'TextField placeholder text',
    },
    required: {
      control: 'boolean',
      description: 'If component is required or not',
    },
    size: {
      control: 'select',
      options: ['small', 'medium'],
      description: 'TextField size',
    },
    variant: {
      control: 'select',
      options: ['filled', 'outlined', 'standard'],
      description: 'TextField variant',
    },
  },
};

export const Story = {
  args: {
    autocomplete: false,
    color: 'primary',
    disabled: false,
    error: false,
    fullWidth: true,
    label: 'Label Text',
    multiline: false,
    placeholder: 'Placeholder Text',
    required: false,
    size: 'medium',
    variant: 'filled',
  },
};

export const WithErrorState = () => {
  return (
    <FormControl fullWidth error>
      <InputLabel id="input-label" error>
        Error Example
      </InputLabel>
      <FilledInput error />
      <FormHelperText>This field is required</FormHelperText>
    </FormControl>
  );
};

export const WithInputAdornment = () => {
  return (
    <TextField
      label="Start Adornment Example"
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <AccountCircle />
          </InputAdornment>
        ),
      }}
      sx={{ width: 250 }}
    />
  );
};
