import { Box, Divider, Stack, Paper } from '../../playbook-components';
import { styled } from '@mui/material/styles';

const docs = {
  muiLink: 'https://mui.com/system/react-box',
  figmaLink:
    'https://www.figma.com/file/VgFMXAuaLKSWTvEbjXHhnc/The-Playbook-Master?type=design&node-id=11477-166906&mode=design&t=V2i05RuzmLX12bz7-0',
};

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: 'lightblue',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
}));

export default {
  title: 'Layout/Stack',
  component: Stack,
  render: ({ ...args }) => (
    <Box sx={{ width: 300 }}>
      <Stack {...args}>
        <Item>Item 1</Item>
        <Item>Item 2</Item>
        <Item>Item 3</Item>
      </Stack>
    </Box>
  ),
  parameters: {
    layout: 'centered',
    docs: {
    },
  },
  tags: ['autodocs'],

  argTypes: {
    direction: {
      control: 'select',
      options: ['row', 'row-reverse', 'column', 'column-reverse'],
      description: 'Direction options',
    },
    justifyContent: {
      control: 'select',
      options: [
        'flex-start',
        'center',
        'flex-end',
        'space-between',
        'space-around',
        'space-evenly',
      ],
      description: 'Justify content options',
    },
    spacing: {
      control: 'select',
      options: [0.25, 0.5, 1, 2, 5],
      description: 'Spacing distance',
    },
  },
};

export const Story = {
  args: {
    direction: 'column',
    justifyContent: 'flex-start',
    spacing: 0.5,
  },
};

export const WithDividers = () => (
  <Box sx={{ width: 300 }}>
    <Stack
      direction="column"
      justifyContent="center"
      spacing={2}
      divider={<Divider orientation="horizontal" flexItem />}
    >
      <Item>Item 1</Item>
      <Item>Item 2</Item>
      <Item>Item 3</Item>
    </Stack>
  </Box>
);
