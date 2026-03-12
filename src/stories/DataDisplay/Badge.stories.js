import { Badge } from '../../playbook-components';
import MailIcon from '@mui/icons-material/Mail';

const docs = {
  muiLink: 'https://mui.com/material-ui/react-badge/',
  figmaLink:
    'https://www.figma.com/file/VgFMXAuaLKSWTvEbjXHhnc/The-Playbook-Master?type=design&node-id=11009-142432&mode=design&t=gsbJpD0lukrp3miB-0',
};

export default {
  title: 'Data Display/Badge',
  component: Badge,
  render: ({ content, ...args }) => (
    <Badge {...args}>
      <MailIcon />
    </Badge>
  ),
  parameters: {
    layout: 'centered',
    docs: {
    },
  },
  tags: ['autodocs'],

  argTypes: {
    badgeContent: {
      control: 'select',
      options: [1, 2, 3, 4],
      description: 'Examples of badge content',
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
      description: 'Badge color styles',
    },
    invisible: {
      control: 'boolean',
      description: 'If badge is visible or not',
    },
    overlap: {
      control: 'select',
      options: ['circular', 'rectangular'],
      description: 'Wrapped shape the badge should overlap.',
    },
    showZero: {
      control: 'boolean',
      description: 'Hide badge content or not',
    },
    variant: {
      control: 'select',
      options: ['dot', 'standard'],
      description: 'Variant type',
    },
  },
};

export const Story = {
  args: {
    badgeContent: 3,
    color: 'primary',
    invisible: false,
    overlap: 'rectangular',
    showZero: false,
    variant: 'standard',
  },
};
