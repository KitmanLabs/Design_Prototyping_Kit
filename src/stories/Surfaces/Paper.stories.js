import { Box, Paper, Stack, Typography } from '../../playbook-components';

const docs = {
  muiLink: 'https://mui.com/material-ui/react-card/',
  figmaLink:
    'https://www.figma.com/file/VgFMXAuaLKSWTvEbjXHhnc/The-Playbook-Master?type=design&node-id=6584-46700&mode=design&t=QLenttbW1XEfaEEc-0',
};

export default {
  title: 'Surfaces/Paper',
  component: Paper,
  render: ({ ...args }) => {
    return (
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          '& > :not(style)': {
            m: 1,
            width: 128,
            height: 128,
          },
        }}
      >
        <Paper elevation={0} {...args} />
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
    variant: {
      control: 'select',
      options: ['elevation', 'outlined'],
      description: 'The variant to use',
      table: {
        defaultValue: { summary: 'elevation' },
      },
    },
    square: {
      control: 'boolean',
      description: 'If true, rounded corners are disabled',
      table: {
        defaultValue: { summary: false },
      },
    },
    elevation: {
      control: {
        type: 'number',
        min: 0,
        max: 24,
        step: 1,
      },
      description:
        'Shadow depth, corresponds to dp in the spec. It accepts values between 0 and 24 inclusive',
      table: {
        defaultValue: { summary: 1 },
      },
    },
  },
};

export const Story = {
  args: {
    variant: 'elevation',
    square: false,
    elevation: 1,
  },
};

export const WithVariants = () => {
  const styles = {
    width: 120,
    height: 120,
    padding: 2,
    textAlign: 'center',
  };

  return (
    <Stack direction="row" spacing={2}>
      <Paper variant="elevation" sx={styles}>
        <Typography>default variant</Typography>
      </Paper>
      <Paper variant="outlined" sx={styles}>
        <Typography>outlined variant</Typography>
      </Paper>
    </Stack>
  );
};

export const WithSquareCorners = () => {
  const styles = {
    width: 120,
    height: 120,
    padding: 2,
    textAlign: 'center',
  };

  return (
    <Stack direction="row" spacing={2}>
      <Paper variant="elevation" square sx={styles} />
      <Paper variant="outlined" square sx={styles} />
    </Stack>
  );
};
