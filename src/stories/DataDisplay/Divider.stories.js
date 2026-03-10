import {
  Box,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemText,
} from '../../playbook-components';
import { styled } from '@mui/material/styles';
import FormatAlignLeftIcon from '@mui/icons-material/FormatAlignLeft';
import FormatAlignCenterIcon from '@mui/icons-material/FormatAlignCenter';
import FormatAlignRightIcon from '@mui/icons-material/FormatAlignRight';
import FormatBoldIcon from '@mui/icons-material/FormatBold';
import FormatItalicIcon from '@mui/icons-material/FormatItalic';

const docs = {
  muiLink: 'https://mui.com/material-ui/react-divider/',
  figmaLink:
    'https://www.figma.com/file/VgFMXAuaLKSWTvEbjXHhnc/The-Playbook-Master?type=design&node-id=11033-145136&mode=design&t=gsbJpD0lukrp3miB-0',
};

export default {
  title: 'Data Display/Divider',
  component: Divider,
  render: ({ content, ...args }) => (
    <List
      sx={{
        width: 300,
        bgcolor: 'background.paper',
      }}
      component="nav"
      aria-label="mailbox folders"
    >
      <ListItem button>
        <ListItemText primary="Inbox" />
      </ListItem>
      <Divider {...args} />
      <ListItem button>
        <ListItemText primary="Drafts" />
      </ListItem>
      <Divider {...args} />
      <ListItem button>
        <ListItemText primary="Trash" />
      </ListItem>
      <Divider {...args} />
      <ListItem button>
        <ListItemText primary="Spam" />
      </ListItem>
    </List>
  ),
  parameters: {
    layout: 'centered',
    docs: {
    },
  },
  tags: ['autodocs'],

  argTypes: {
    light: {
      control: 'boolean',
      description: 'If true, the divider will have a lighter color.',
    },
    variant: {
      control: 'select',
      options: ['fullWidth', 'inset', 'middle'],
      description: 'Variant type',
    },
  },
};

export const Story = {
  args: {
    light: false,
    variant: 'middle',
  },
};

const Root = styled('div')(({ theme }) => ({
  width: '100%',
  ...theme.typography.body2,
  '& > :not(style) ~ :not(style)': {
    marginTop: theme.spacing(2),
  },
}));

export const DividersWithText = () => {
  const content = (
    <div>
      {`Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus id dignissim justo.
   Nulla ut facilisis ligula. Interdum et malesuada fames ac ante ipsum primis in faucibus.
   Sed malesuada lobortis pretium.`}
    </div>
  );

  return (
    <Root>
      {content}
      <Divider>CENTER</Divider>
      {content}
      <Divider textAlign="left">LEFT</Divider>
      {content}
      <Divider textAlign="right">RIGHT</Divider>
      {content}
      <Divider>
        <Chip label="CHIP" />
      </Divider>
      {content}
    </Root>
  );
};

export const VerticalDivider = () => {
  return (
    <div>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          width: 'fit-content',
          border: (theme) => `1px solid ${theme.palette.divider}`,
          borderRadius: 1,
          bgcolor: 'background.paper',
          color: 'text.secondary',
          '& svg': {
            m: 1.5,
          },
          '& hr': {
            mx: 0.5,
          },
        }}
      >
        <FormatAlignLeftIcon />
        <FormatAlignCenterIcon />
        <FormatAlignRightIcon />
        <Divider orientation="vertical" flexItem />
        <FormatBoldIcon />
        <FormatItalicIcon />
      </Box>
    </div>
  );
};
