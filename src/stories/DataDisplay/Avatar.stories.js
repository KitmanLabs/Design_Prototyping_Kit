import { Avatar, AvatarGroup, Typography } from '../../playbook-components';
import Box from '@mui/material/Box';

const docs = {
  muiLink: 'https://v5.mui.com/material-ui/react-avatar/', // changed a link to MUI v5 because it's the current project version.
  figmaLink:
    'https://www.figma.com/file/VgFMXAuaLKSWTvEbjXHhnc/The-Playbook-Master?type=design&node-id=10990-140796&mode=design&t=gsbJpD0lukrp3miB-0',
};

export default {
  title: 'Data Display/Avatar',
  component: Avatar,
  render: ({ content, ...args }) => (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 5,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Avatar
        {...args}
        sx={{ height: '40px', width: '40px' }}
        alt="Kitman Labs"
        src="https://pbs.twimg.com/profile_images/1674827032126005249/5e1nsr_Y_400x400.png"
      />

      <Typography variant="body2">
        We are using three different sizes of avatars: 24x24px , 32x32px and
        40x40px.
      </Typography>
    </Box>
  ),
  parameters: {
    layout: 'centered',
    docs: {
    },
  },
  tags: ['autodocs'],

  argTypes: {
    variant: {
      control: 'select',
      options: ['circular', 'rounded', 'square'],
      description: 'Avatar variant',
    },
  },
};

export const Story = {
  args: {
    variant: 'circular',
  },
};

export const AvatarSizes = () => {
  return (
    <Box sx={{ display: 'flex', gap: 2 }}>
      <Avatar
        variant="circular"
        sx={{ height: '24px', width: '24px' }}
        alt="Kitman Labs"
        src="https://pbs.twimg.com/profile_images/1674827032126005249/5e1nsr_Y_400x400.png"
      />

      <Avatar
        variant="circular"
        sx={{ height: '32px', width: '32px' }}
        alt="Kitman Labs"
        src="https://pbs.twimg.com/profile_images/1674827032126005249/5e1nsr_Y_400x400.png"
      />

      <Avatar
        variant="circular"
        sx={{ height: '40px', width: '40px' }}
        alt="Kitman Labs"
        src="https://pbs.twimg.com/profile_images/1674827032126005249/5e1nsr_Y_400x400.png"
      />
    </Box>
  );
};

export const AvatarGroupWithMax = () => (
  <AvatarGroup>
    <Avatar
      variant="circular"
      sx={{ height: '24px', width: '24px' }}
      alt="Kitman Labs"
      src="https://pbs.twimg.com/profile_images/1674827032126005249/5e1nsr_Y_400x400.png"
    />
    <Avatar
      variant="circular"
      sx={{ height: '32px', width: '32px' }}
      alt="National Football League"
      src="https://www.the-sun.com/wp-content/uploads/sites/6/2022/04/la-nfl-logo-hidden-meaning-comp.jpg"
    />
    <Avatar
      variant="circular"
      sx={{ height: '40px', width: '40px' }}
      alt="Premier League"
      src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRxDu8r1Q2rEXP7E5cu4vD4u82HtB6Hd2vtuz9Kn_OkvISNF9b70yRNEZlcLF-oDxgLweI&usqp=CAU"
    />
    <Avatar
      variant="circular"
      sx={{ height: '24px', width: '24px' }}
      alt="NBA"
      src="https://www.iconarchive.com/download/i103841/blackvariant/button-ui-requests-13/NBA.ico"
    />
    <Avatar
      variant="circular"
      sx={{ height: '32px', width: '32px' }}
      alt="NBA"
      src="https://www.iconarchive.com/download/i103841/blackvariant/button-ui-requests-13/NBA.ico"
    />
    <Avatar
      variant="circular"
      sx={{ height: '40px', width: '40px' }}
      alt="NBA"
      src="https://www.iconarchive.com/download/i103841/blackvariant/button-ui-requests-13/NBA.ico"
    />
  </AvatarGroup>
);
