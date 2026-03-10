import { Button, IconButton } from '../../playbook-components';
import { CheckCircle } from '../../playbook-components/icons';

const docs = {
  muiLink: 'https://mui.com/material-ui/react-button/',
  figmaLink:
    'https://www.figma.com/file/VgFMXAuaLKSWTvEbjXHhnc/The-Playbook-Master?type=design&node-id=11011%3A143217&mode=design&t=j7VHl9qsuIUgpOIE-1',
};

export default {
  title: 'Inputs/Button',
  component: Button,
  render: ({ content, ...args }) => <Button {...args}>{content}</Button>,
  parameters: {
    layout: 'centered',
    docs: {
    },
  },
  tags: ['autodocs'],

  argTypes: {
    content: {
      control: 'text',
      defaultValue: '',
      description: 'Content of the button',
    },
    color: {
      control: 'select',
      defaultValue: 'primary',
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

// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args
export const Story = {
  args: {
    color: 'primary',
    content: 'Button Content',
    disabled: false,
  },
};

export const Icon = {
  args: {
    color: 'primary',
    disabled: false,
  },
  render: ({ content, Component, ...args }) => (
    <IconButton {...args}>
      <CheckCircle />
    </IconButton>
  ),
};
