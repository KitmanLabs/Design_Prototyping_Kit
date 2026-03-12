import { IconButton } from '../../playbook-components';
import { CheckCircle } from '../../playbook-components/icons';

const docs = {
  muiLink: 'https://mui.com/material-ui/react-button/#icon-button',
  figmaLink:
    'https://www.figma.com/file/VgFMXAuaLKSWTvEbjXHhnc/The-Playbook-Master?type=design&node-id=11011%3A143217&mode=design&t=j7VHl9qsuIUgpOIE-1',
};

export default {
  title: 'Inputs/Icon Button',
  component: IconButton,
  render: ({ content, Component, ...args }) => (
    <IconButton {...args}>
      <CheckCircle />
    </IconButton>
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
      options: [
        'primary',
        'secondary',
        'error',
        'warning',
        'info',
        'success',
        'inherit',
      ],
      description: 'Button color styles',
    },
    size: {
      control: 'select',
      options: ['small', 'medium', 'large'],
      description: 'Button Size',
    },
    disabled: {
      control: 'boolean',
      description: 'If component is disabled or not',
    },
  },
};

export const Story = {
  args: {
    color: 'primary',
    size: 'medium',
    disabled: false,
  },
};
