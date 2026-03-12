import { Alert, AlertTitle } from '../../playbook-components';

const docs = {
  muiLink: 'https://mui.com/material-ui/react-alert/',
  figmaLink:
    'https://www.figma.com/file/VgFMXAuaLKSWTvEbjXHhnc/The-Playbook-Master?type=design&node-id=10990-229266&mode=design&t=KAmH8dScCCIvYSNC-0',
};

export default {
  title: 'Feedback/Alert',
  component: Alert,
  render: ({ content, ...args }) => (
    <Alert {...args}>This is example text</Alert>
  ),
  parameters: {
    layout: 'centered',
    docs: {
    },
  },
  tags: ['autodocs'],
  argTypes: {
    color: {
      control: 'select',
      options: ['error', 'info', 'success', 'warning'],
      description:
        'The color of the component. Unless provided, the value is taken from the severity prop. It supports both default and custom theme colors, which can be added as shown in the palette customization guide.',
      table: {
        defaultValue: { summary: 'success' },
      },
    },
    severity: {
      control: 'select',
      options: ['error', 'info', 'success', 'warning'],
      description:
        'The severity of the alert. This defines the color and icon used.',
      table: {
        defaultValue: { summary: 'success' },
      },
    },
    variant: {
      control: 'select',
      options: ['filled', 'outlined', 'standard'],
      description: 'The variant to use.',
      table: {
        defaultValue: { summary: 'standard' },
      },
    },
  },
};

export const Story = {
  args: {
    color: 'success',
    severity: 'success',
    variant: 'standard',
  },
};

export const AlertWithTitle = () => (
  <Alert>
    <AlertTitle>Success</AlertTitle>This is example text
  </Alert>
);
