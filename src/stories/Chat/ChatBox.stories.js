import { ChatBox, createEchoAdapter } from '@mui/x-chat';
import { Box } from '../../playbook-components';

// The echo adapter replies with the user's own message, so the chat works offline. In iP the
// adapter would stream replies from a real backend (MUI X Chat also ships an AI SDK adapter).
const adapter = createEchoAdapter();

export default {
  title: 'Chat/ChatBox',
  component: ChatBox,
  render: (args) => (
    <Box sx={{ width: 520 }}>
      <ChatBox adapter={adapter} sx={{ height: 520 }} {...args} />
    </Box>
  ),
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'MUI X Chat (MIT; alpha) drop-in chat surface. Messages are answered by an offline echo adapter. MUI X Chat is in early development, so its API may change.',
      },
    },
  },
  tags: ['autodocs'],
};

export const Default = {};

export const Compact = {
  args: { variant: 'compact' },
};
