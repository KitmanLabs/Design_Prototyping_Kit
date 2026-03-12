/* eslint-disable react-hooks/rules-of-hooks */
import { useState } from 'react';
import { useArgs } from '@storybook/client-api';
import { styled, alpha } from '@mui/material/styles';
import {
  Button,
  Menu,
  MenuItem,
  Paper,
  MenuList,
  ListItemText,
  ListItemIcon,
  Divider,
} from '../../playbook-components';
import {
  Check,
  Edit,
  Archive,
  FileCopy,
  MoreHoriz,
  KeyboardArrowDown,
} from '@mui/icons-material';

const docs = {
  muiLink: 'https://mui.com/material-ui/react-menu/',
  figmaLink:
    'https://www.figma.com/file/VgFMXAuaLKSWTvEbjXHhnc/The-Playbook-Master?type=design&node-id=6576-50713&mode=design&t=r1AFGMsSeJ6wgQ4n-0',
};

export default {
  title: 'Navigation/Menu',
  component: Menu,
  render: () => {
    const [args, updateArgs] = useArgs();
    const handleClick = (event) =>
      updateArgs({ open: true, anchorEl: event.currentTarget });
    const handleClose = () => updateArgs({ open: false });

    return (
      <div>
        <Button
          aria-controls={args.open ? 'basic-menu' : undefined}
          aria-haspopup="true"
          aria-expanded={args.open ? 'true' : undefined}
          onClick={handleClick}
        >
          Dashboard
        </Button>
        <Menu {...args} onClose={handleClose}>
          <MenuItem onClick={handleClose}>Profile</MenuItem>
          <MenuItem onClick={handleClose}>My account</MenuItem>
          <MenuItem onClick={handleClose}>Logout</MenuItem>
        </Menu>
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
      description: 'If true, the component is shown.',
      table: {
        defaultValue: { summary: null },
      },
    },
    anchorEl: {
      control: null,
      description: `An HTML element, or a function that returns one. It's used to set the position of the menu.`,
      table: {
        defaultValue: { summary: null },
      },
    },
    autoFocus: {
      control: 'boolean',
      description:
        'If true (Default) will focus the [role="menu"] if no focusable child is found. Disabled children are not focusable. If you set this prop to false focus will be placed on the parent modal container. This has severe accessibility implications and should only be considered if you manage focus otherwise.',
      table: {
        defaultValue: { summary: false },
      },
    },
    disableAutoFocusItem: {
      control: 'boolean',
      description: `When opening the menu will not focus the active item but the [role="menu"] unless autoFocus is also set to false. Not using the default means not following WAI-ARIA authoring practices. Please be considerate about possible accessibility implications.`,
      table: {
        defaultValue: { summary: false },
      },
    },
    variant: {
      control: 'select',
      options: ['menu', 'selectedMenu'],
      description:
        'The variant to use. Use menu to prevent selected items from impacting the initial focus.',
      table: {
        defaultValue: { summary: 'selectedMenu' },
      },
    },
  },
};

export const Story = {
  args: {
    open: false,
    anchorEl: null,
    autoFocus: false,
    disableAutoFocusItem: false,
    variant: 'selectedMenu',
  },
};

export const WithDense = () => (
  <Paper sx={{ width: 320 }}>
    <MenuList dense>
      <MenuItem>
        <ListItemText inset>Single</ListItemText>
      </MenuItem>
      <MenuItem>
        <ListItemText inset>1.15</ListItemText>
      </MenuItem>
      <MenuItem>
        <ListItemText inset>Double</ListItemText>
      </MenuItem>
      <MenuItem>
        <ListItemIcon>
          <Check />
        </ListItemIcon>
        Custom: 1.2
      </MenuItem>
      <Divider />
      <MenuItem>
        <ListItemText>Add space before paragraph</ListItemText>
      </MenuItem>
      <MenuItem>
        <ListItemText>Add space after paragraph</ListItemText>
      </MenuItem>
      <Divider />
      <MenuItem>
        <ListItemText>Custom spacing...</ListItemText>
      </MenuItem>
    </MenuList>
  </Paper>
);

export const WithCustomization = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const StyledMenu = styled((props) => (
    <Menu
      elevation={0}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      {...props}
    />
  ))(({ theme }) => ({
    '& .MuiPaper-root': {
      borderRadius: 6,
      marginTop: theme.spacing(1),
      minWidth: 180,
      color:
        theme.palette.mode === 'light'
          ? 'rgb(55, 65, 81)'
          : theme.palette.grey[300],
      boxShadow:
        'rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px',
      '& .MuiMenu-list': {
        padding: '4px 0',
      },
      '& .MuiMenuItem-root': {
        '& .MuiSvgIcon-root': {
          fontSize: 18,
          color: theme.palette.text.secondary,
          marginRight: theme.spacing(1.5),
        },
        '&:active': {
          backgroundColor: alpha(
            theme.palette.primary.main,
            theme.palette.action.selectedOpacity
          ),
        },
      },
    },
  }));

  return (
    <div>
      <Button
        aria-controls={open ? 'demo-customized-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        variant="contained"
        disableElevation
        onClick={handleClick}
        endIcon={<KeyboardArrowDown />}
      >
        Options
      </Button>
      <StyledMenu
        id="demo-customized-menu"
        MenuListProps={{
          'aria-labelledby': 'demo-customized-button',
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >
        <MenuItem onClick={handleClose} disableRipple>
          <Edit />
          Edit
        </MenuItem>
        <MenuItem onClick={handleClose} disableRipple>
          <FileCopy />
          Duplicate
        </MenuItem>
        <Divider sx={{ my: 0.5 }} />
        <MenuItem onClick={handleClose} disableRipple>
          <Archive />
          Archive
        </MenuItem>
        <MenuItem onClick={handleClose} disableRipple>
          <MoreHoriz />
          More
        </MenuItem>
      </StyledMenu>
    </div>
  );
};
