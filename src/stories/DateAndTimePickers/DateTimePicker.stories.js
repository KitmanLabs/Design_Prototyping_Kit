import { DateTimePicker } from '../../playbook-components';

const docs = {
  muiLink: 'https://mui.com/x/react-date-pickers/date-time-picker/',
  figmaLink:
    'https://www.figma.com/file/VgFMXAuaLKSWTvEbjXHhnc/The-Playbook-Master?type=design&node-id=11061-149839&mode=design&t=VMszpLtJK4xpTYfg-0',
};

export default {
  title: 'Date & Time Pickers/Date Time Picker',
  component: DateTimePicker,
  render: ({ ...args }) => <DateTimePicker {...args} />,
  parameters: {
    layout: 'centered',
    docs: {
    },
  },
  tags: ['autodocs'],

  argTypes: {
    disabled: {
      control: 'boolean',
      description: 'If component is disabled or not',
    },
    disableFuture: {
      control: 'boolean',
      description: 'Disable the future dates',
    },
    disableOpenPicker: {
      control: 'boolean',
      description: 'Disable open picker',
    },
    disablePast: {
      control: 'boolean',
      description: 'Disable the past dates',
    },
    formatDensity: {
      control: 'select',
      options: ['dense', 'spacious'],
      description: 'Density of format',
    },
    label: {
      control: 'text',
      description: 'DateTimePicker label text',
    },
    loading: {
      control: 'boolean',
      description: 'Disable the past dates',
    },
  },
};

export const Story = {
  args: {
    disabled: false,
    disableFuture: false,
    disableOpenPicker: false,
    disablePast: false,
    formatDensity: 'dense',
    label: 'Date and Time of Birth',
    loading: false,
  },
};

export const WithHelperText = () => (
  <DateTimePicker
    label="Helper text example"
    slotProps={{
      textField: {
        helperText: 'MM/DD/YYYY HH/MM',
      },
    }}
  />
);
