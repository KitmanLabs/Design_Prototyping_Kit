import { Box } from '../../playbook-components';

const docs = {
  muiLink: 'https://mui.com/system/react-box',
  figmaLink:
    'https://www.figma.com/file/VgFMXAuaLKSWTvEbjXHhnc/The-Playbook-Master?type=design&node-id=4662-14&mode=design&t=IavrGog2hIvepYYn-0',
};

export default {
  title: 'Layout/Box',
  component: Box,
  render: ({ ...args }) => (
    <Box {...args} sx={{ p: 2, border: '1px dashed grey' }}>
      This is a section container
    </Box>
  ),
  parameters: {
    layout: 'centered',
    docs: {
    },
  },
  tags: ['autodocs'],

  argTypes: {
    display: {
      control: 'select',
      options: ['inline', 'block'],
      description: 'Display options',
    },
    height: {
      control: 'select',
      options: [10, 20, 50, 100, 250, 500],
      description: 'Box height',
    },
    width: {
      control: 'select',
      options: [10, 20, 50, 100, 250, 500],
      description: 'Box width',
    },
  },
};

export const Story = {
  args: {
    display: 'block',
    height: 100,
    width: 250,
  },
};

export const WithBackgroundColorAndHover = () => (
  <Box
    sx={{
      width: 100,
      height: 100,
      borderRadius: 1,
      bgcolor: 'primary.main',
      '&:hover': {
        bgcolor: 'primary.dark',
      },
    }}
  />
);
