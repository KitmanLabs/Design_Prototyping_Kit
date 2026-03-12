import { ToggleButton, ToggleButtonGroup } from '../../playbook-components';
import {
  ArrowDropDown,
  FormatAlignCenter,
  FormatAlignJustify,
  FormatAlignLeft,
  FormatAlignRight,
  FormatBold,
  FormatColorFill,
  FormatItalic,
  FormatUnderlined,
} from '@mui/icons-material';
import { useState } from 'react';

const docs = {
  muiLink: 'https://v5.mui.com/material-ui/react-toggle-button',
  figmaLink:
    'https://www.figma.com/file/VgFMXAuaLKSWTvEbjXHhnc/The-Playbook-Master?type=design&node-id=11022-146894&mode=design&t=yJw2T0zI6Ypl7Lad-0',
};

export default {
  title: 'Inputs/Toggle Button',
  component: ToggleButton,
  render: ({ ...args }) => (
    <ToggleButtonGroup {...args}>
      <ToggleButton {...args} value="left" selected={false}>
        <FormatAlignLeft />
      </ToggleButton>
      <ToggleButton {...args} value="center">
        <FormatAlignCenter />
      </ToggleButton>
      <ToggleButton {...args} value="right" selected={false}>
        <FormatAlignRight />
      </ToggleButton>
      <ToggleButton {...args} value="justify" selected={false}>
        <FormatAlignJustify />
      </ToggleButton>
    </ToggleButtonGroup>
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
        'standard',
        'primary',
        'secondary',
        'error',
        'info',
        'success',
        'warning',
      ],
      description: 'ToggleButton color styles',
    },
    disabled: {
      control: 'boolean',
      description: 'If component is disabled or not',
    },
    fullWidth: {
      control: 'boolean',
      description: 'If component is fullWidth or not',
    },
    selected: {
      control: 'boolean',
      description: 'If component is selected or not',
    },
    size: {
      control: 'select',
      options: ['small', 'medium', 'large'],
      description: 'ToggleButton size',
    },
  },
};

export const Story = {
  args: {
    color: 'primary',
    disabled: false,
    fullWidth: false,
    selected: false,
    size: 'medium',
  },
};

export const WithMultiSelect = () => {
  const [formats, setFormats] = useState(() => ['bold', 'italic']);

  const handleFormat = (event, newFormats) => {
    setFormats(newFormats);
  };

  return (
    <ToggleButtonGroup value={formats} onChange={handleFormat}>
      <ToggleButton value="bold">
        <FormatBold />
      </ToggleButton>
      <ToggleButton value="italic">
        <FormatItalic />
      </ToggleButton>
      <ToggleButton value="underlined">
        <FormatUnderlined />
      </ToggleButton>
      <ToggleButton value="color" disabled>
        <FormatColorFill />
        <ArrowDropDown />
      </ToggleButton>
    </ToggleButtonGroup>
  );
};
