import { Box, Snackbar } from '../../playbook-components';

const docs = {
  muiLink: 'https://mui.com/material-ui/react-snackbar/',
  figmaLink:
    'https://www.figma.com/file/VgFMXAuaLKSWTvEbjXHhnc/The-Playbook-Master?type=design&node-id=11045-147195&mode=design&t=70RTh6qEdJAelGkv-0',
};

export default {
  title: 'Feedback/Snackbar',
  component: Snackbar,
  render: ({ content, ...args }) => (
    <Box sx={{ minHeight: '200px' }}>
      <Snackbar
        anchorOrigin={{
          vertical: args.verticalAnchor,
          horizontal: args.horizontalAnchor,
        }}
        open
        autoHideDuration={6000}
        onClose={() => {}}
        message="Example text for the snackbar"
      />
    </Box>
  ),
  parameters: {
    layout: 'centered',
    docs: {
    },
  },
  tags: ['autodocs'],
  argTypes: {
    horizontalAnchor: {
      control: 'select',
      options: ['center', 'left', 'right'],
      description: 'Horizontal anchor point.',
    },
    verticalAnchor: {
      control: 'select',
      options: ['bottom', 'top'],
      description: 'Vertical anchor point',
    },
  },
};

export const Story = {
  args: {
    horizontalAnchor: 'left',
    verticalAnchor: 'bottom',
  },
};
