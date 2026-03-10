import {
  Breadcrumbs,
  Link,
  Stack,
  Typography,
} from '../../playbook-components';
import {
  Dashboard,
  Description,
  Folder,
  Home,
  NavigateNext,
  Person,
  Settings,
} from '@mui/icons-material';

const docs = {
  muiLink: 'https://v5.mui.com/material-ui/react-breadcrumbs/',
  figmaLink:
    'https://www.figma.com/file/VgFMXAuaLKSWTvEbjXHhnc/The-Playbook-Master?type=design&node-id=6572-50395&mode=design&t=iKowO7Ef9en9WTYI-0',
};

export default {
  title: 'Navigation/Breadcrumbs',
  component: Breadcrumbs,
  render: ({ ...args }) => {
    return (
      <div
        role="presentation"
        onClick={(e) => {
          e.preventDefault();
          console.info('You clicked a breadcrumb.');
        }}
      >
        <Breadcrumbs {...args} aria-label="breadcrumb">
          <Link underline="hover" color="inherit" href="#">
            MUI
          </Link>
          <Link underline="hover" color="inherit" href="#">
            Core
          </Link>
          <Typography color="text.primary">Breadcrumbs</Typography>
        </Breadcrumbs>
      </div>
    );
  },
  parameters: {
    layout: 'centered',
    docs: {
    },
  },
  tags: ['autodocs'],

  argTypes: {
    separator: {
      control: 'text',
      description: 'Custom separator node.',
      table: {
        defaultValue: { summary: '/' },
      },
    },
    maxItems: {
      control: 'number',
      description:
        'Specifies the maximum number of breadcrumbs to display. When there are more than the maximum number, only the first itemsBeforeCollapse and last itemsAfterCollapse will be shown, with an ellipsis in between.',
      table: {
        defaultValue: { summary: 8 },
      },
    },
    itemsBeforeCollapse: {
      control: 'number',
      description:
        'If max items is exceeded, the number of items to show after the ellipsis.',
      table: {
        defaultValue: { summary: 1 },
      },
    },
    itemsAfterCollapse: {
      control: 'number',
      description:
        'If max items is exceeded, the number of items to show before the ellipsis.',
      table: {
        defaultValue: { summary: 1 },
      },
    },
  },
};

export const Story = {
  args: {
    separator: '/',
    maxItems: 8,
    itemsBeforeCollapse: 1,
    itemsAfterCollapse: 1,
  },
};

export const WithActiveLast = () => (
  <div role="presentation" onClick={() => {}}>
    <Breadcrumbs aria-label="breadcrumb">
      <Link underline="hover" color="inherit" href="#">
        MUI
      </Link>
      <Link underline="hover" color="inherit" href="#">
        Core
      </Link>
      <Link underline="hover" color="text.primary" aria-current="page" href="#">
        Breadcrumbs
      </Link>
    </Breadcrumbs>
  </div>
);

export const WithCustomSeparator = () => {
  const breadcrumbs = [
    <Link underline="hover" key="1" color="inherit" href="#" onClick={() => {}}>
      MUI
    </Link>,
    <Link underline="hover" key="2" color="inherit" href="#" onClick={() => {}}>
      Core
    </Link>,
    <Typography key="3" color="text.primary">
      Breadcrumb
    </Typography>,
  ];

  return (
    <Stack spacing={2}>
      <Breadcrumbs separator="›" aria-label="breadcrumb">
        {breadcrumbs}
      </Breadcrumbs>
      <Breadcrumbs separator="-" aria-label="breadcrumb">
        {breadcrumbs}
      </Breadcrumbs>
      <Breadcrumbs
        separator={<NavigateNext fontSize="small" />}
        aria-label="breadcrumb"
      >
        {breadcrumbs}
      </Breadcrumbs>
    </Stack>
  );
};

export const WithIcons = () => (
  <Stack spacing={3}>
    <Breadcrumbs aria-label="breadcrumb">
      <Link
        underline="hover"
        sx={{ display: 'flex', alignItems: 'center' }}
        color="inherit"
        href="#"
      >
        <Home sx={{ mr: 0.5 }} fontSize="inherit" />
        Home
      </Link>
      <Link
        underline="hover"
        sx={{ display: 'flex', alignItems: 'center' }}
        color="inherit"
        href="#"
      >
        <Dashboard sx={{ mr: 0.5 }} fontSize="inherit" />
        Dashboard
      </Link>
      <Typography
        sx={{ display: 'flex', alignItems: 'center' }}
        color="text.primary"
      >
        <Settings sx={{ mr: 0.5 }} fontSize="inherit" />
        Settings
      </Typography>
    </Breadcrumbs>

    <Breadcrumbs aria-label="breadcrumb">
      <Link
        underline="hover"
        sx={{ display: 'flex', alignItems: 'center' }}
        color="inherit"
        href="#"
      >
        <Home sx={{ mr: 0.5 }} fontSize="inherit" />
        Home
      </Link>
      <Link
        underline="hover"
        sx={{ display: 'flex', alignItems: 'center' }}
        color="inherit"
        href="#"
      >
        <Folder sx={{ mr: 0.5 }} fontSize="inherit" />
        Documents
      </Link>
      <Link
        underline="hover"
        sx={{ display: 'flex', alignItems: 'center' }}
        color="inherit"
        href="#"
      >
        <Folder sx={{ mr: 0.5 }} fontSize="inherit" />
        Projects
      </Link>
      <Typography
        sx={{ display: 'flex', alignItems: 'center' }}
        color="text.primary"
      >
        <Description sx={{ mr: 0.5 }} fontSize="inherit" />
        Report.pdf
      </Typography>
    </Breadcrumbs>

    <Breadcrumbs
      separator={<NavigateNext fontSize="small" />}
      aria-label="breadcrumb"
    >
      <Link
        underline="hover"
        sx={{ display: 'flex', alignItems: 'center' }}
        color="inherit"
        href="#"
      >
        <Home sx={{ mr: 0.5 }} fontSize="inherit" />
        Home
      </Link>
      <Link
        underline="hover"
        sx={{ display: 'flex', alignItems: 'center' }}
        color="inherit"
        href="#"
      >
        <Person sx={{ mr: 0.5 }} fontSize="inherit" />
        Users
      </Link>
      <Typography
        sx={{ display: 'flex', alignItems: 'center' }}
        color="text.primary"
      >
        <Settings sx={{ mr: 0.5 }} fontSize="inherit" />
        Profile Settings
      </Typography>
    </Breadcrumbs>
  </Stack>
);
