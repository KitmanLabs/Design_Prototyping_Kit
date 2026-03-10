import { Box, Slider } from '../../playbook-components';
import { useState } from 'react';

const docs = {
  muiLink: 'https://mui.com/material-ui/react-slider/',
  figmaLink:
    'https://www.figma.com/file/VgFMXAuaLKSWTvEbjXHhnc/The-Playbook-Master?type=design&node-id=11017-146185&mode=design&t=qlnO5wpykUY7hnIV-0',
};

export default {
  title: 'Inputs/Slider',
  component: Slider,
  render: ({ ...args }) => (
    <Box sx={{ width: 500 }}>
      <Slider {...args} value={30} />
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
        'primary',
        'default',
        'secondary',
        'error',
        'info',
        'success',
        'warning',
      ],
      description: 'Slider color styles',
    },
    disabled: {
      control: 'boolean',
      description: 'If component is disabled or not',
    },
    marks: {
      control: 'boolean',
      description: 'If component has measurement marks',
    },
    max: {
      control: 'select',
      options: [10, 25, 50, 100, 200, 500],
      description: 'Maximum value allowed',
    },
    min: {
      control: 'select',
      options: [0, 10, 25, 50],
      description: 'Minimum value allowed',
    },
    orientation: {
      control: 'select',
      options: ['horizontal', 'vertical'],
      description: 'Orientation direction',
    },
    size: {
      control: 'select',
      options: ['small', 'medium'],
      description: 'Slider size',
    },
    step: {
      control: 'select',
      options: [1, 2, 5, 10, 20],
      description: 'Step size',
    },
    track: {
      control: 'select',
      options: ['inverted', 'normal', false],
      description: 'Track presentation',
    },
    valueLabelDisplay: {
      control: 'select',
      options: ['auto', 'off', 'on'],
      description: 'Display value label',
    },
  },
};

export const Story = {
  args: {
    color: 'primary',
    disabled: false,
    marks: false,
    max: 100,
    min: 0,
    orientation: 'horizontal',
    size: 'medium',
    step: 1,
    track: 'normal',
    valueLabelDisplay: 'auto',
  },
};

export const WithSliderRange = () => {
  const [value, setValue] = useState([30, 54]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: 500 }}>
      <Slider
        value={value}
        color="success"
        valueLabelDisplay="auto"
        onChange={handleChange}
      />
    </Box>
  );
};
export const WithSliderVertical = () => {
  const [value, setValue] = useState(20);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ height: 200 }}>
      <Slider
        value={value}
        orientation="vertical"
        valueLabelDisplay="auto"
        color="error"
        onChange={handleChange}
      />
    </Box>
  );
};
