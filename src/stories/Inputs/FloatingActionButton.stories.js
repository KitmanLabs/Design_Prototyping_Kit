import { Box, Fab } from '../../playbook-components';

import { Add, Edit, Favorite, Navigation } from '@mui/icons-material';

const docs = {
  muiLink: 'https://mui.com/material-ui/react-floating-action-button/',
  figmaLink:
    'https://www.figma.com/file/VgFMXAuaLKSWTvEbjXHhnc/The-Playbook-Master?type=design&node-id=6556-38207&mode=design&t=u3TuVUJuh7yFB96F-0',
};

export default {
  title: 'Inputs/Floating Action Button',
  component: Fab,
  render: ({ ...args }) => (
    <Fab {...args}>
      <Add />
    </Fab>
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
      options: [
        'primary',
        'default',
        'error',
        'info',
        'inherit',
        'secondary',
        'success',
        'warning',
      ],
      description: 'Fab color styles',
    },

    disabled: {
      control: 'boolean',
      description: 'If component is disabled or not',
    },
    size: {
      control: 'select',
      options: ['small', 'medium', 'large'],
      description: 'FAB Size',
    },
    variant: {
      control: 'select',
      options: ['circular', 'extended'],
      description: 'FAB Variant',
    },
  },
};

export const WithSomeOtherArgs = {
  args: {
    color: 'success',
    disabled: false,
    size: 'large',
    variant: 'circular',
  },
};

export const WithIcons = () => (
  <Box sx={{ '& > :not(style)': { m: 1 } }}>
    <Fab color="primary">
      <Add />
    </Fab>
    <Fab color="secondary">
      <Edit />
    </Fab>
    <Fab variant="extended">
      <Navigation sx={{ mr: 1 }} />
      Navigate
    </Fab>
    <Fab disabled>
      <Favorite />
    </Fab>
  </Box>
);
