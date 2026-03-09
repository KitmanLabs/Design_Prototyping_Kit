/* eslint-disable react-hooks/rules-of-hooks */
import { useArgs } from '@storybook/client-api';
import {
  Drawer,
  Stack,
  Typography,
  IconButton,
} from '../../playbook-components';
import { Close } from '@mui/icons-material';

const docs = {
  muiLink: 'https://mui.com/material-ui/react-drawer/',
  figmaLink:
    'https://www.figma.com/file/VgFMXAuaLKSWTvEbjXHhnc/The-Playbook-Master?type=design&node-id=6574-50653&mode=design&t=wupJKXGzRzdNpY1a-0',
};

export default {
  title: 'Navigation/Drawer',
  component: Drawer,
  render: () => {
    const [args, updateArgs] = useArgs();
    const onClose = () => updateArgs({ open: false });
    return (
      <Drawer
        {...args}
        onClose={onClose}
        PaperProps={{
          sx: { width: '500px' },
        }}
      >
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          spacing={1}
          p={1}
        >
          <Typography variant="h6" component="p" sx={{ color: 'text.primary' }}>
            Title
          </Typography>
          <IconButton onClick={onClose}>
            <Close />
          </IconButton>
        </Stack>
      </Drawer>
    );
  },
  parameters: {
    layout: 'centered',
    docs: {
    },
  },
  tags: ['autodocs'],

  argTypes: {
    open: {
      control: 'boolean',
      description: 'If true, the component is shown.',
      table: {
        defaultValue: { summary: false },
      },
    },
    anchor: {
      control: 'select',
      options: ['bottom', 'left', 'right', 'top'],
      description: 'Side from which the drawer will appear.',
      table: {
        defaultValue: { summary: 'left' },
      },
    },
    variant: {
      control: 'select',
      options: ['permanent', 'persistent', 'temporary'],
      description: 'The variant to use.',
      table: {
        defaultValue: { summary: 'temporary' },
      },
    },
    hideBackdrop: {
      control: 'boolean',
      description: 'If true, the backdrop is not rendered.',
      table: {
        defaultValue: { summary: false },
      },
    },
    elevation: {
      control: 'number',
      description: 'The elevation of the drawer.',
      table: {
        defaultValue: { summary: 16 },
      },
    },
  },
};

export const Story = {
  args: {
    open: false,
    anchor: 'left',
    variant: 'temporary',
    hideBackdrop: false,
    elevation: 16,
  },
};
