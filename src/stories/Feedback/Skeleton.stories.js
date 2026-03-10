import { Skeleton, Stack } from '../../playbook-components';

const docs = {
  muiLink: 'https://mui.com/material-ui/react-skeleton/',
  figmaLink:
    'https://www.figma.com/file/VgFMXAuaLKSWTvEbjXHhnc/The-Playbook-Master?type=design&node-id=6596-49007&mode=design&t=p16QQHbX4HLjZnrz-0',
};

export default {
  title: 'Feedback/Skeleton',
  component: Skeleton,
  render: ({ content, ...args }) => (
    <Stack spacing={1}>
      <Skeleton {...args} variant="text" sx={{ fontSize: '1rem' }} />
      <Skeleton {...args} variant="circular" width={40} height={40} />
      <Skeleton {...args} variant="rectangular" width={210} height={60} />
      <Skeleton {...args} variant="rounded" width={210} height={60} />
    </Stack>
  ),
  parameters: {
    layout: 'centered',
    docs: {
    },
  },
  tags: ['autodocs'],
  argTypes: {
    animation: {
      control: 'select',
      options: ['pulse', 'wave', false],
      description: 'The animation. If false the animation effect is disabled.',
      table: {
        defaultValue: { summary: 'pulse' },
      },
    },
  },
};

export const Story = {
  args: {
    animation: 'pulse',
  },
};
