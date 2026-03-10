/* eslint-disable react-hooks/rules-of-hooks */

import { Button, Popover, Typography } from '../../playbook-components';
import { useState } from 'react';

const docs = {
  muiLink: 'https://mui.com/material-ui/react-popover/',
  figmaLink: null,
};

export default {
  title: 'Utils/Popover',
  component: Popover,
  render: ({ ...args }) => {
    const [anchorEl, setAnchorEl] = useState(null);

    const handleClick = (event) => {
      setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
      setAnchorEl(null);
    };

    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;

    return (
      <div>
        <Button aria-describedby={id} variant="contained" onClick={handleClick}>
          Open Popover
        </Button>
        <Popover
          {...args}
          id={id}
          open={open}
          anchorEl={anchorEl}
          onClose={handleClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
        >
          <Typography sx={{ p: 2 }}>The content of the Popover.</Typography>
        </Popover>
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
    elevation: {
      control: 'select',
      defaultValue: 8,
      options: [0, 2, 4, 6, 8, 10, 12],
      description: 'The elevation of the popover.',
    },
  },
};

export const Story = {
  args: {
    elevation: 8,
  },
};

export const PopoverWithHover = () => {
  const [anchorEl, setAnchorEl] = useState(null);

  const handlePopoverOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  return (
    <div>
      <Typography
        aria-owns={open ? 'mouse-over-popover' : undefined}
        aria-haspopup="true"
        onMouseEnter={handlePopoverOpen}
        onMouseLeave={handlePopoverClose}
      >
        Hover with a Popover.
      </Typography>
      <Popover
        id="mouse-over-popover"
        sx={{
          pointerEvents: 'none',
        }}
        open={open}
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        onClose={handlePopoverClose}
        disableRestoreFocus
      >
        <Typography sx={{ p: 1 }}>I use Popover.</Typography>
      </Popover>
    </div>
  );
};
