/* eslint-disable react-hooks/rules-of-hooks */

import {
  Avatar,
  Button,
  Dialog,
  DialogTitle,
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
} from '../../playbook-components';
import PersonIcon from '@mui/icons-material/Person';
import AddIcon from '@mui/icons-material/Add';
import { useState } from 'react';

const docs = {
  muiLink: 'https://mui.com/material-ui/react-dialog/',
  figmaLink:
    'https://www.figma.com/file/VgFMXAuaLKSWTvEbjXHhnc/The-Playbook-Master?type=design&node-id=11045-146738&mode=design&t=70RTh6qEdJAelGkv-0',
};

const emails = ['smith@kitmanlabs.com', 'cooper@kitmanlabs.com'];

export default {
  title: 'Feedback/Dialog',
  component: Dialog,
  render: () => {
    const [open, setOpen] = useState(false);

    const handleClickOpen = () => {
      setOpen(true);
    };

    const handleClose = () => {
      setOpen(false);
    };

    return (
      <>
        <Button variant="outlined" onClick={handleClickOpen}>
          Open simple dialog
        </Button>
        <Dialog onClose={handleClose} open={open}>
          <DialogTitle>Set backup account</DialogTitle>
          <List sx={{ pt: 0 }}>
            {emails.map((email) => (
              <ListItem disableGutters key={email}>
                <ListItemButton>
                  <ListItemAvatar>
                    <Avatar>
                      <PersonIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText primary={email} />
                </ListItemButton>
              </ListItem>
            ))}
            <ListItem disableGutters>
              <ListItemButton autoFocus>
                <ListItemAvatar>
                  <Avatar>
                    <AddIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText primary="Add account" />
              </ListItemButton>
            </ListItem>
          </List>
        </Dialog>
      </>
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
