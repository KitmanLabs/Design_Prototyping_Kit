/* eslint-disable react-hooks/rules-of-hooks */

import { Button, Box, Modal, Typography } from '../../playbook-components';
import { useState } from 'react';

const docs = {
  muiLink: 'https://mui.com/material-ui/react-modal/',
  figmaLink: null,
};

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Utils/Modal',
  component: Modal,
  // Optional render component which gets the args selections and renders whats needed
  render: ({ ...args }) => {
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    return (
      <>
        <Button onClick={handleOpen}>Open modal</Button>
        <Modal {...args} open={open} onClose={handleClose}>
          <Box sx={style}>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Text in a modal
            </Typography>
            <Typography id="modal-modal-description" sx={{ mt: 2 }}>
              Duis mollis, est non commodo luctus, nisi erat porttitor ligula.
            </Typography>
          </Box>
        </Modal>
      </>
    );
  },
  parameters: {
    layout: 'centered',
    docs: {
    },
  },
  tags: ['autodocs'],
  argTypes: {
    hideBackdrop: {
      control: 'boolean',
      defaultValue: false,
      description: 'If true, the backdrop is not rendered.',
    },
  },
};

// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args
export const Story = {
  args: {
    hideBackdrop: false,
  },
};
