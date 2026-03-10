import { DateRangePicker } from '../../playbook-components';

const docs = {
  muiLink: 'https://mui.com/x/react-date-pickers/date-range-picker/',
  figmaLink:
    'https://www.figma.com/file/VgFMXAuaLKSWTvEbjXHhnc/The-Playbook-Master?type=design&node-id=11061-149839&mode=design&t=VMszpLtJK4xpTYfg-0',
};

export default {
  title: 'Date & Time Pickers/Date Range Picker',
  component: DateRangePicker,
  render: ({ ...args }) => <DateRangePicker {...args} />,
  parameters: {
    layout: 'centered',
    docs: {
    },
  },
  tags: ['autodocs'],

  argTypes: {
    calendars: {
      control: 'select',
      options: ['1', '2', '3'],
      description: 'The number of calendars to render on desktop.',
    },
    disabled: {
      control: 'boolean',
      description: 'If component is disabled or not',
    },
    disableAutoMonthSwitching: {
      control: 'boolean',
      description:
        'If true, after selecting start date calendar will not automatically switch to the month of end date.',
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
      description: 'DateRangePicker label text',
    },
    loading: {
      control: 'boolean',
      description: 'Disable the past dates',
    },
  },
};

export const Story = {
  args: {
    calendars: 2,
    disabled: false,
    disableAutoMonthSwitching: false,
    disableFuture: false,
    disableOpenPicker: false,
    disablePast: false,
    formatDensity: 'dense',
    label: 'Date of Birth',
    loading: false,
  },
};

export const WithHelperText = () => (
  <DateRangePicker
    label="Helper text example"
    slotProps={{
      textField: {
        helperText: 'MM/DD/YYYY',
      },
    }}
  />
);
