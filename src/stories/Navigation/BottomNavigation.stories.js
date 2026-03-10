/* eslint-disable react-hooks/rules-of-hooks */
import { useState } from 'react';
import { useArgs } from '@storybook/client-api';
import {
  Box,
  BottomNavigation,
  BottomNavigationAction,
} from '../../playbook-components';
import { Restore, Favorite, LocationOn } from '@mui/icons-material';

const docs = {
  muiLink: 'https://mui.com/material-ui/react-bottom-navigation/',
  figmaLink:
    'https://www.figma.com/file/VgFMXAuaLKSWTvEbjXHhnc/The-Playbook-Master?type=design&node-id=6572-50270&mode=design&t=6N9koVi0wUePmUss-0',
};

export default {
  title: 'Navigation/Bottom Navigation',
  component: BottomNavigation,
  render: () => {
    const [args, updateArgs] = useArgs();
    const onChange = (event, updatedValue) =>
      updateArgs({ value: updatedValue });

    return (
      <Box sx={{ width: 500 }}>
        <BottomNavigation
          {...args}
          key={JSON.stringify({
            value: args.value,
          })}
          showLabels={args.showLabels}
          value={args.value}
          onChange={onChange}
          sx={{
            bgcolor: 'secondary.main',
          }}
        >
          <BottomNavigationAction label="Recents" icon={<Restore />} />
          <BottomNavigationAction label="Favorites" icon={<Favorite />} />
          <BottomNavigationAction label="Nearby" icon={<LocationOn />} />
        </BottomNavigation>
      </Box>
    );
  },
  parameters: {
    layout: 'centered',
    docs: {
    },
  },
  tags: ['autodocs'],

  argTypes: {
    value: {
      control: 'number',
      description:
        'The value of the currently selected BottomNavigationAction.',
      table: {
        defaultValue: { summary: 'null' },
      },
    },
    showLabels: {
      control: 'boolean',
      description:
        'If true, all BottomNavigationActions will show their labels. By default, only the selected BottomNavigationAction will show its label',
      table: {
        defaultValue: { summary: false },
      },
    },
  },
};

export const Story = {
  args: {
    value: 0,
    showLabels: true,
  },
};

export const WithNoLabel = () => {
  const [value, setValue] = useState(0);

  return (
    <Box sx={{ width: 500 }}>
      <BottomNavigation
        value={value}
        onChange={(event, updatedValue) => setValue(updatedValue)}
        sx={{
          bgcolor: 'secondary.main',
        }}
      >
        <BottomNavigationAction label="Recents" icon={<Restore />} />
        <BottomNavigationAction label="Favorites" icon={<Favorite />} />
        <BottomNavigationAction label="Nearby" icon={<LocationOn />} />
      </BottomNavigation>
    </Box>
  );
};
