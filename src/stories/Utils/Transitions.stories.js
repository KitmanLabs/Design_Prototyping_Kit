/* eslint-disable react-hooks/rules-of-hooks */

import {
  Box,
  Collapse,
  Fade,
  FormControlLabel,
  Grow,
  Paper,
  Slide,
  Switch,
  Zoom,
} from '../../playbook-components';
import { useState } from 'react';

const docs = {
  muiLink: 'https://mui.com/material-ui/transitions/',
  figmaLink: null,
};

const icon = (
  <Paper sx={{ m: 1, width: 100, height: 100 }} elevation={4}>
    <svg>
      <Box
        component="polygon"
        points="0,100 50,00, 100,100"
        sx={{
          fill: (theme) => theme.palette.common.white,
          stroke: (theme) => theme.palette.divider,
          strokeWidth: 1,
        }}
      />
    </svg>
  </Paper>
);

export default {
  title: 'Utils/Transitions',
  component: null,
  render: () => {
    const [checked, setChecked] = useState(false);

    const handleChange = () => {
      setChecked((prev) => !prev);
    };

    return (
      <Box sx={{ height: 300 }}>
        <FormControlLabel
          control={<Switch checked={checked} onChange={handleChange} />}
          label="Show"
        />
        <Box
          sx={{
            '& > :not(style)': {
              display: 'flex',
              justifyContent: 'space-around',
              height: 120,
              width: 250,
            },
          }}
        >
          <div>
            <Collapse in={checked}>{icon}</Collapse>
            <Collapse in={checked} collapsedSize={40}>
              {icon}
            </Collapse>
          </div>
          <div>
            <Box sx={{ width: '50%' }}>
              <Collapse orientation="horizontal" in={checked}>
                {icon}
              </Collapse>
            </Box>
            <Box sx={{ width: '50%' }}>
              <Collapse
                orientation="horizontal"
                in={checked}
                collapsedSize={40}
              >
                {icon}
              </Collapse>
            </Box>
          </div>
        </Box>
      </Box>
    );
  },
  parameters: {
    layout: 'centered',
    docs: {
    },
  },
  tags: ['autodocs'],
  argTypes: {},
};

export const Story = {
  args: {},
};

export const TransitionWithFade = () => {
  const [checked, setChecked] = useState(false);

  const handleChange = () => {
    setChecked((prev) => !prev);
  };

  return (
    <Box sx={{ height: 180 }}>
      <FormControlLabel
        control={<Switch checked={checked} onChange={handleChange} />}
        label="Show"
      />
      <Box sx={{ display: 'flex' }}>
        <Fade in={checked}>{icon}</Fade>
      </Box>
    </Box>
  );
};

export const TransitionWithGrow = () => {
  const [checked, setChecked] = useState(false);

  const handleChange = () => {
    setChecked((prev) => !prev);
  };

  return (
    <Box sx={{ height: 180 }}>
      <FormControlLabel
        control={<Switch checked={checked} onChange={handleChange} />}
        label="Show"
      />
      <Box sx={{ display: 'flex' }}>
        <Grow in={checked}>{icon}</Grow>
        {/* Conditionally applies the timeout prop to change the entry speed. */}
        <Grow
          in={checked}
          style={{ transformOrigin: '0 0 0' }}
          {...(checked ? { timeout: 1000 } : {})}
        >
          {icon}
        </Grow>
      </Box>
    </Box>
  );
};

export const TransitionWithSlide = () => {
  const [checked, setChecked] = useState(false);

  const handleChange = () => {
    setChecked((prev) => !prev);
  };

  return (
    <Box
      sx={{
        height: 180,
        width: 130,
        position: 'relative',
        zIndex: 1,
      }}
    >
      <FormControlLabel
        control={<Switch checked={checked} onChange={handleChange} />}
        label="Show"
      />
      <Slide direction="up" in={checked} mountOnEnter unmountOnExit>
        {icon}
      </Slide>
    </Box>
  );
};

export const TransitionWithZoom = () => {
  const [checked, setChecked] = useState(false);

  const handleChange = () => {
    setChecked((prev) => !prev);
  };

  return (
    <Box sx={{ height: 180 }}>
      <FormControlLabel
        control={<Switch checked={checked} onChange={handleChange} />}
        label="Show"
      />
      <Box sx={{ display: 'flex' }}>
        <Zoom in={checked}>{icon}</Zoom>
        <Zoom
          in={checked}
          style={{ transitionDelay: checked ? '500ms' : '0ms' }}
        >
          {icon}
        </Zoom>
      </Box>
    </Box>
  );
};
