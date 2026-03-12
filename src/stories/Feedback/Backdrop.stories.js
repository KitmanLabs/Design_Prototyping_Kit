import {
  Backdrop,
  Button,
  Card,
  Typography,
} from '../../playbook-components';
import { useState } from 'react';

const docs = {
  muiLink: 'https://v5.mui.com/material-ui/react-backdrop/',
  figmaLink:
    'https://www.figma.com/file/VgFMXAuaLKSWTvEbjXHhnc/The-Playbook-Master?type=design&node-id=10107-170350&mode=design&t=6DtBdMBe7pa5XR8P-0',
};

export default {
  title: 'Feedback/Backdrop',
  component: Backdrop,
  render: ({ content, ...args }) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [open, setOpen] = useState(args.open || false);

    const handleClose = () => {
      setOpen(false);
    };

    const handleOpen = () => {
      setOpen(true);
    };

    return (
      <div style={{ position: 'relative', width: 900, minHeight: 300 }}>
        <Card
          sx={{
            width: '100%',
            minHeight: 300,
            alignItems: 'center',
            padding: 2,
          }}
        >
          <Typography variant="h5" component="h1" gutterBottom>
            Backdrop Example
          </Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Click the button below to show the backdrop modal.
          </Typography>
          <Button variant="contained" onClick={handleOpen}>
            Show Backdrop
          </Button>
        </Card>

        <Backdrop
          sx={{
            color: '#fff',
            zIndex: (theme) => theme.zIndex.drawer + 1,
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
          }}
          open={open || args.open}
          onClick={handleClose}
        >
          <Card
            sx={{
              maxWidth: 400,
              maxHeight: 300,
              alignItems: 'center',
              padding: 3,
              margin: 2,
            }}
          >
            <Typography variant="h6" component="h2" gutterBottom>
              Modal Content
            </Typography>
            <Typography sx={{ mt: 2, mb: 2, textAlign: 'center' }}>
              Duis mollis, est non commodo luctus, nisi erat porttitor ligula.
              Click anywhere on the backdrop to close this modal.
            </Typography>
            <Button variant="outlined" onClick={handleClose}>
              Close Modal
            </Button>
          </Card>
        </Backdrop>
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
    open: {
      control: 'boolean',
      description: 'Controls whether the backdrop is visible',
      defaultValue: false,
    },
  },
};

export const Story = {
  args: {
    open: false,
  },
};

export const OpenByDefault = {
  args: {
    open: true,
  },
};
