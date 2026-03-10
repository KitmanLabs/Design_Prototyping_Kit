import { FormControlLabel, Switch } from '../../playbook-components';

const docs = {
  muiLink: 'https://mui.com/material-ui/api/switch/',
  figmaLink:
    'https://www.figma.com/file/VgFMXAuaLKSWTvEbjXHhnc/The-Playbook-Master?type=design&node-id=11022-144509&mode=design&t=yJw2T0zI6Ypl7Lad-0',
};

export default {
  title: 'Inputs/Switch',
  component: Switch,
  render: ({ ...args }) => <Switch {...args} />,
  parameters: {
    layout: 'centered',
    docs: {
    },
  },
  tags: ['autodocs'],

  argTypes: {
    checked: {
      control: 'boolean',
      description: 'If component is checked or not',
    },
    color: {
      control: 'select',
      options: [
        'primary',
        'default',
        'secondary',
        'error',
        'info',
        'success',
        'warning',
      ],
      description: 'Switch color styles',
    },
    defaultChecked: {
      control: 'boolean',
      description: 'If component is checked by default or not',
    },
    disabled: {
      control: 'boolean',
      description: 'If component is disabled or not',
    },
    required: {
      control: 'boolean',
      description: 'If component is required or not',
    },
    size: {
      control: 'select',
      options: ['small', 'medium'],
      description: 'Switch size',
    },
  },
};

export const Story = {
  args: {
    checked: true,
    color: 'primary',
    defaultChecked: true,
    disabled: false,
    required: false,
    size: 'medium',
  },
};

export const WithLabel = () => (
  <FormControlLabel
    control={<Switch defaultChecked color="success" />}
    label="Label"
  />
);
