import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from '../../playbook-components';
import { useState } from 'react';

const docs = {
  muiLink: 'https://v5.mui.com/material-ui/react-select/',
  figmaLink:
    'https://www.figma.com/file/VgFMXAuaLKSWTvEbjXHhnc/The-Playbook-Master?type=design&node-id=11017-144316&mode=design&t=OTu4zhsV14ZJPRXi-0',
};

export default {
  title: 'Inputs/Select',
  component: Select,
  render: ({ ...args }) => (
    <Box sx={{ minWidth: 300 }}>
      <FormControl {...args} fullWidth>
        <InputLabel id="example-select-label">Age</InputLabel>
        <Select
          {...args}
          labelId="example-select-label"
          id="example-select"
          value={10}
          label="Age"
        >
          <MenuItem value={10}>Ten</MenuItem>
          <MenuItem value={20}>Twenty</MenuItem>
          <MenuItem value={30}>Thirty</MenuItem>
        </Select>
      </FormControl>
    </Box>
  ),
  parameters: {
    layout: 'centered',
    docs: {
    },
  },
  tags: ['autodocs'],

  argTypes: {
    autoWidth: {
      control: 'boolean',
      description: 'If component is auto width or not',
    },
    variant: {
      control: 'select',
      options: ['filled', 'outlined', 'standard'],
      description: 'Select variant style',
    },
    size: {
      control: 'select',
      options: ['small', 'medium'],
      description: 'Select size',
    },
    disabled: {
      control: 'boolean',
      description: 'If select is disabled',
    },
    error: {
      control: 'boolean',
      description: 'If select has error state',
    },
    multiple: {
      control: 'boolean',
      description: 'If select supports multiple selections',
    },
    displayEmpty: {
      control: 'boolean',
      description: 'If select displays empty value',
    },
    native: {
      control: 'boolean',
      description: 'If select uses native HTML select',
    },
  },
};

export const Story = {
  args: {
    autoWidth: false,
    variant: 'outlined',
    size: 'medium',
    disabled: false,
    error: false,
    multiple: false,
    displayEmpty: false,
    native: false,
  },
};

export const SmallSize = {
  args: {
    autoWidth: false,
    variant: 'outlined',
    size: 'small',
    disabled: false,
    error: false,
    multiple: false,
    displayEmpty: false,
    native: false,
  },
};

export const AllVariants = () => (
  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, minWidth: 300 }}>
    <FormControl variant="filled" size="small" fullWidth>
      <InputLabel id="filled-small-label">Filled Small</InputLabel>
      <Select labelId="filled-small-label" value={10} label="Filled Small">
        <MenuItem value={10}>Ten</MenuItem>
        <MenuItem value={20}>Twenty</MenuItem>
        <MenuItem value={30}>Thirty</MenuItem>
      </Select>
    </FormControl>

    <FormControl variant="filled" size="medium" fullWidth>
      <InputLabel id="filled-medium-label">Filled Medium</InputLabel>
      <Select labelId="filled-medium-label" value={10} label="Filled Medium">
        <MenuItem value={10}>Ten</MenuItem>
        <MenuItem value={20}>Twenty</MenuItem>
        <MenuItem value={30}>Thirty</MenuItem>
      </Select>
    </FormControl>

    <FormControl variant="outlined" size="small" fullWidth>
      <InputLabel id="outlined-small-label">Outlined Small</InputLabel>
      <Select labelId="outlined-small-label" value={10} label="Outlined Small">
        <MenuItem value={10}>Ten</MenuItem>
        <MenuItem value={20}>Twenty</MenuItem>
        <MenuItem value={30}>Thirty</MenuItem>
      </Select>
    </FormControl>

    <FormControl variant="outlined" size="medium" fullWidth>
      <InputLabel id="outlined-medium-label">Outlined Medium</InputLabel>
      <Select
        labelId="outlined-medium-label"
        value={10}
        label="Outlined Medium"
      >
        <MenuItem value={10}>Ten</MenuItem>
        <MenuItem value={20}>Twenty</MenuItem>
        <MenuItem value={30}>Thirty</MenuItem>
      </Select>
    </FormControl>

    <FormControl variant="standard" size="small" fullWidth>
      <InputLabel id="standard-small-label">Standard Small</InputLabel>
      <Select labelId="standard-small-label" value={10} label="Standard Small">
        <MenuItem value={10}>Ten</MenuItem>
        <MenuItem value={20}>Twenty</MenuItem>
        <MenuItem value={30}>Thirty</MenuItem>
      </Select>
    </FormControl>

    <FormControl variant="standard" size="medium" fullWidth>
      <InputLabel id="standard-medium-label">Standard Medium</InputLabel>
      <Select
        labelId="standard-medium-label"
        value={10}
        label="Standard Medium"
      >
        <MenuItem value={10}>Ten</MenuItem>
        <MenuItem value={20}>Twenty</MenuItem>
        <MenuItem value={30}>Thirty</MenuItem>
      </Select>
    </FormControl>
  </Box>
);

export const WithMultipleSelect = () => {
  const [personName, setPersonName] = useState([]);

  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    setPersonName(
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value
    );
  };

  return (
    <Box sx={{ minWidth: 300 }}>
      <FormControl variant="outlined" size="medium" fullWidth>
        <InputLabel id="name-example-select-label">Names</InputLabel>
        <Select
          labelId="name-example-select-label"
          id="name-example-select"
          label="Names"
          value={personName}
          onChange={handleChange}
          multiple
        >
          <MenuItem value={1}>John</MenuItem>
          <MenuItem value={2}>Jimmy</MenuItem>
          <MenuItem value={3}>Cathal</MenuItem>
          <MenuItem value={4}>Paul</MenuItem>
          <MenuItem value={5}>Ryan</MenuItem>
          <MenuItem value={6}>Rory</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
};

export const ErrorState = {
  args: {
    autoWidth: false,
    variant: 'outlined',
    size: 'medium',
    disabled: false,
    error: true,
    multiple: false,
    displayEmpty: false,
    native: false,
  },
};

export const DisabledState = {
  args: {
    autoWidth: false,
    variant: 'outlined',
    size: 'medium',
    disabled: true,
    error: false,
    multiple: false,
    displayEmpty: false,
    native: false,
  },
};
