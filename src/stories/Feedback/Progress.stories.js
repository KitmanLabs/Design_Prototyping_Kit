import {
  Box,
  CircularProgress,
  LinearProgress,
  Stack,
  Typography,
} from '../../playbook-components';
import { useEffect, useState } from 'react';

const docs = {
  muiLink: 'https://v5.mui.com/material-ui/react-progress/',
  figmaLink:
    'https://www.figma.com/file/VgFMXAuaLKSWTvEbjXHhnc/The-Playbook-Master?type=design&node-id=10180-131783&mode=design&t=p16QQHbX4HLjZnrz-0',
};

export default {
  title: 'Feedback/Progress',
  component: CircularProgress,
  render: ({ content, ...args }) => (
    <Box sx={{ display: 'flex' }}>
      <CircularProgress {...args} />
    </Box>
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
        'inherit',
        'primary',
        'secondary',
        'error',
        'info',
        'success',
        'warning',
      ],
      description: 'Progress color',
      table: {
        defaultValue: { summary: 'primary' },
      },
    },
    value: {
      control: 'select',
      options: [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100],
      description:
        'The value of the progress indicator for the determinate variant. Value between 0 and 100.',
      table: {
        defaultValue: { summary: 0 },
      },
    },
    variant: {
      control: 'select',
      options: ['determinate', 'indeterminate'],
      description:
        'The variant to use. Use indeterminate when there is no progress value.',
      table: {
        defaultValue: { summary: 'indeterminate' },
      },
    },
  },
};

export const Story = {
  args: {
    color: 'success',
    value: 10,
    variant: 'indeterminate',
  },
};

function CircularProgressWithLabel(props) {
  return (
    <Box sx={{ position: 'relative', display: 'inline-flex' }}>
      <CircularProgress variant="determinate" {...props} />
      <Box
        sx={{
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          position: 'absolute',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Typography
          variant="caption"
          component="div"
          color="text.secondary"
        >{`${Math.round(props.value)}%`}</Typography>
      </Box>
    </Box>
  );
}

export const CircularProgressWithCenterLabel = () => {
  const [progress, setProgress] = useState(10);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prevProgress) =>
        prevProgress >= 100 ? 0 : prevProgress + 10
      );
    }, 800);
    return () => {
      clearInterval(timer);
    };
  }, []);

  return <CircularProgressWithLabel value={progress} />;
};

export const LinearProgressVariants = () => {
  return (
    <Stack spacing={3} sx={{ width: 900, maxWidth: 900 }}>
      <Box>
        <Typography variant="h6" gutterBottom>
          Indeterminate
        </Typography>
        <LinearProgress />
      </Box>

      <Box>
        <Typography variant="h6" gutterBottom>
          Determinate
        </Typography>
        <LinearProgress variant="determinate" value={50} />
      </Box>

      <Box>
        <Typography variant="h6" gutterBottom>
          Buffer
        </Typography>
        <LinearProgress variant="buffer" value={50} valueBuffer={75} />
      </Box>

      <Box>
        <Typography variant="h6" gutterBottom>
          Query (Indeterminate)
        </Typography>
        <LinearProgress variant="query" />
      </Box>
    </Stack>
  );
};

export const LinearProgressColors = () => {
  return (
    <Stack spacing={2} sx={{ width: 900, maxWidth: 900 }}>
      <Box>
        <Typography variant="body2" gutterBottom>
          Primary
        </Typography>
        <LinearProgress color="primary" variant="determinate" value={60} />
      </Box>

      <Box>
        <Typography variant="body2" gutterBottom>
          Secondary
        </Typography>
        <LinearProgress color="secondary" variant="determinate" value={60} />
      </Box>

      <Box>
        <Typography variant="body2" gutterBottom>
          Success
        </Typography>
        <LinearProgress color="success" variant="determinate" value={60} />
      </Box>

      <Box>
        <Typography variant="body2" gutterBottom>
          Error
        </Typography>
        <LinearProgress color="error" variant="determinate" value={60} />
      </Box>

      <Box>
        <Typography variant="body2" gutterBottom>
          Warning
        </Typography>
        <LinearProgress color="warning" variant="determinate" value={60} />
      </Box>

      <Box>
        <Typography variant="body2" gutterBottom>
          Info
        </Typography>
        <LinearProgress color="info" variant="determinate" value={60} />
      </Box>
    </Stack>
  );
};

function LinearProgressWithLabel(props) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <Box sx={{ width: 900, mr: 1 }}>
        <LinearProgress variant="determinate" {...props} />
      </Box>
      <Box sx={{ minWidth: 35 }}>
        <Typography variant="body2" color="text.secondary">{`${Math.round(
          props.value
        )}%`}</Typography>
      </Box>
    </Box>
  );
}

export const LinearProgressWithCenterLabel = () => {
  const [progress, setProgress] = useState(10);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prevProgress) =>
        prevProgress >= 100 ? 0 : prevProgress + 10
      );
    }, 800);
    return () => {
      clearInterval(timer);
    };
  }, []);

  return (
    <Box sx={{ width: 900, maxWidth: 900 }}>
      <LinearProgressWithLabel value={progress} />
    </Box>
  );
};

export const ProgressShowcase = () => {
  const [progress, setProgress] = useState(0);
  const [buffer, setBuffer] = useState(10);

  useEffect(() => {
    const progressTimer = setInterval(() => {
      setProgress((oldProgress) => {
        if (oldProgress === 100) {
          return 0;
        }
        const diff = Math.random() * 10;
        return Math.min(oldProgress + diff, 100);
      });
    }, 500);

    const bufferTimer = setInterval(() => {
      setBuffer((oldBuffer) => {
        if (oldBuffer === 100) {
          return 10;
        }
        const diff = Math.random() * 10;
        return Math.min(oldBuffer + diff, 100);
      });
    }, 500);

    return () => {
      clearInterval(progressTimer);
      clearInterval(bufferTimer);
    };
  }, []);

  return (
    <Stack spacing={4} sx={{ width: 900, maxWidth: 900 }}>
      <Box>
        <Typography variant="h6" gutterBottom>
          File Upload Progress
        </Typography>
        <LinearProgressWithLabel value={progress} />
      </Box>

      <Box>
        <Typography variant="h6" gutterBottom>
          Video Streaming Buffer
        </Typography>
        <LinearProgress
          variant="buffer"
          value={progress}
          valueBuffer={buffer}
        />
      </Box>

      <Box sx={{ display: 'flex', gap: 3, alignItems: 'center' }}>
        <Box>
          <Typography variant="h6" gutterBottom>
            Loading...
          </Typography>
          <CircularProgressWithLabel value={progress} />
        </Box>
        <Box>
          <Typography variant="h6" gutterBottom>
            Processing
          </Typography>
          <CircularProgress color="secondary" />
        </Box>
      </Box>
    </Stack>
  );
};
