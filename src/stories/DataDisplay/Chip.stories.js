import { Avatar, Chip } from '../../playbook-components';

const docs = {
  muiLink: 'https://v5.mui.com/material-ui/react-chip/',
  figmaLink:
    'https://www.figma.com/file/VgFMXAuaLKSWTvEbjXHhnc/The-Playbook-Master?type=design&node-id=11033-144919&mode=design&t=gsbJpD0lukrp3miB-0',
};

export default {
  title: 'Data Display/Chip',
  component: Chip,
  render: ({ showAvatar, ...args }) => (
    <Chip
      {...args}
      avatar={
        showAvatar ? (
          <Avatar src="https://images.teamtalk.com/content/uploads/2023/09/17093600/man-utd-striker-rasmus-hojlund.jpg" />
        ) : undefined
      }
    />
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
      description: 'Badge color styles',
    },
    disabled: {
      control: 'boolean',
      description: 'If badge is disabled or not',
    },
    size: {
      control: 'select',
      options: ['small', 'medium'],
      description: 'Chip sizes',
    },
    variant: {
      control: 'select',
      options: ['filled', 'outlined'],
      description: 'Variant type',
    },
    showAvatar: {
      control: 'boolean',
      description: 'Show avatar icon in chip',
      defaultValue: false,
    },
  },
};

export const Story = {
  args: {
    label: 'Example Chip Text',
    color: 'primary',
    disabled: false,
    size: 'medium',
    variant: 'filled',
    showAvatar: false,
  },
};

export const ChipWithIconAdornment = {
  args: {
    label: 'Rasmus Højlund',
    color: 'primary',
    disabled: false,
    size: 'medium',
    variant: 'filled',
    showAvatar: true,
  },
};
