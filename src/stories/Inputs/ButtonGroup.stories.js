import { ButtonGroup, Button } from '../../playbook-components';

const docs = {
  muiLink: 'https://mui.com/material-ui/react-button-group/',
  figmaLink:
    'https://www.figma.com/file/VgFMXAuaLKSWTvEbjXHhnc/The-Playbook-Master?type=design&node-id=6543%3A39713&mode=design&t=HXrgtjkoIhAqwfcs-1',
};

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Inputs/Button Group',
  component: ButtonGroup,
  render: ({ ...args }) => (
    <ButtonGroup {...args}>
      <Button>One</Button>
      <Button>Two</Button>
      <Button>Three</Button>
    </ButtonGroup>
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
    orientation: {
      control: 'select',
      options: ['horizontal', 'vertical'],
      description: 'Orientation of button group',
    },
    variant: {
      control: 'select',
      options: ['contained', 'text'],
      description: 'Variant of the button style',
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
    orientation: 'horizontal',
    variant: 'contained',
    disabled: false,
    size: 'medium',
  },
};
