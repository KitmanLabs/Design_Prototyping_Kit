import { Box, Toasts } from '../../playbook-components';
// NOTE: Original file imported getPage, getDesign from '@kitman/playbook/stories/utils'.
// Those utilities have been removed as they are not available in Design_Prototyping_Kit.

const docs = {
  muiLink: 'https://mui.com/material-ui/react-snackbar/',
  figmaLink:
    'https://www.figma.com/file/VgFMXAuaLKSWTvEbjXHhnc/The-Playbook-Master?type=design&node-id=11045-147195&mode=design&t=70RTh6qEdJAelGkv-0',
};

const toasts = [{ id: 1, status: 'SUCCESS', title: 'This is a success toast' }];

export default {
  title: 'Feedback/Toasts',
  component: Toasts,
  render: ({ ...args }) => (
    <Box sx={{ width: '500px', minHeight: '100px' }}>
      <Toasts
        toasts={args.toasts}
        onCloseToast={() => {}}
        onClickToastLink={() => {}}
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
    toasts: {
      control: 'object',
      description: 'Provided toast objects',
      table: {
        defaultValue: { summary: '[]' },
      },
    },
  },
};

export const Story = {
  args: {
    toasts,
  },
};

export const WithSuccessStatus = () => (
  <Box sx={{ width: '500px', minHeight: '100px' }}>
    <Toasts
      toasts={[{ id: 1, status: 'SUCCESS', title: 'This is a success toast' }]}
      onCloseToast={() => {}}
      onClickToastLink={() => {}}
    />
  </Box>
);

export const WithInfoStatus = () => (
  <Box sx={{ width: '500px', minHeight: '100px' }}>
    <Toasts
      toasts={[{ id: 1, status: 'INFO', title: 'This is a info toast' }]}
      onCloseToast={() => {}}
      onClickToastLink={() => {}}
    />
  </Box>
);

export const WithWarningStatus = () => (
  <Box sx={{ width: '500px', minHeight: '100px' }}>
    <Toasts
      toasts={[{ id: 1, status: 'WARNING', title: 'This is a warning toast' }]}
      onCloseToast={() => {}}
      onClickToastLink={() => {}}
    />
  </Box>
);

export const WithErrorStatus = () => (
  <Box sx={{ width: '500px', minHeight: '100px' }}>
    <Toasts
      toasts={[{ id: 1, status: 'ERROR', title: 'This is an error toast' }]}
      onCloseToast={() => {}}
      onClickToastLink={() => {}}
    />
  </Box>
);

export const WithLoadingStatus = () => (
  <Box sx={{ width: '500px', minHeight: '100px' }}>
    <Toasts
      toasts={[{ id: 1, status: 'LOADING', title: 'Loading...' }]}
      onCloseToast={() => {}}
      onClickToastLink={() => {}}
    />
  </Box>
);

export const WithDescription = () => (
  <Box sx={{ width: '500px', minHeight: '100px' }}>
    <Toasts
      toasts={[
        {
          id: 1,
          status: 'ERROR',
          title: 'Error',
          description: 'This is an error toast with description',
        },
      ]}
      onCloseToast={() => {}}
      onClickToastLink={() => {}}
    />
  </Box>
);

export const WithLinks = () => (
  <Box sx={{ width: '500px', minHeight: '100px' }}>
    <Toasts
      toasts={[
        {
          id: 1,
          status: 'WARNING',
          title: 'This is a warning toast with links',
          links: [
            {
              id: 1,
              text: 'Resolve now',
              link: '#',
              withHashParam: true,
              metadata: {
                action: '',
              },
            },
            {
              id: 2,
              text: 'Do it later',
              link: '#',
              withHashParam: true,
              metadata: {
                action: '',
              },
            },
          ],
        },
      ]}
      onCloseToast={() => {}}
      onClickToastLink={() => {}}
    />
  </Box>
);

export const WithMultiple = () => (
  <Box sx={{ width: '500px', minHeight: '250px' }}>
    <Toasts
      toasts={[
        { id: 1, status: 'SUCCESS', title: 'This is a success toast' },
        { id: 2, status: 'INFO', title: 'This is a info toast' },
        { id: 3, status: 'WARNING', title: 'This is a warning toast' },
        { id: 4, status: 'ERROR', title: 'This is a error toast' },
      ]}
      onCloseToast={() => {}}
      onClickToastLink={() => {}}
    />
  </Box>
);
