import DatePickerWrapper from '../../playbook-components/wrappers/DatePickerWrapper';

const docs = {
  muiLink: 'https://mui.com/x/react-date-pickers/date-picker/',
  figmaLink:
    'https://www.figma.com/file/VgFMXAuaLKSWTvEbjXHhnc/The-Playbook-Master?type=design&node-id=11061-149839&mode=design&t=VMszpLtJK4xpTYfg-0',
};

export default {
  title: 'Date Picker Wrapper',
  component: DatePickerWrapper,
  render: ({ ...args }) => <DatePickerWrapper {...args} />,
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
    placeholder: {
      control: 'text',
      description: 'DatePickerWrapper placeholder text',
    },
    inputLabel: {
      control: 'text',
      description: 'DatePickerWrapper inputLabel text',
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
    placeholder: 'placeholder',
    inputLabel: 'Date of Birth label here',
    loading: false,
  },
};

export const WithHelperText = () => (
  <DatePickerWrapper
    inputLabel="Helper text example"
    slotProps={{
      textField: {
        helperText: 'Helper text here',
      },
    }}
  />
);
