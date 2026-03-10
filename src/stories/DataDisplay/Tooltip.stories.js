import {
  Box,
  Button,
  Grid,
  IconButton,
  Tooltip,
} from '../../playbook-components';
import DeleteIcon from '@mui/icons-material/Delete';

const docs = {
  muiLink: 'https://mui.com/material-ui/react-tooltip/',
  figmaLink:
    'https://www.figma.com/file/VgFMXAuaLKSWTvEbjXHhnc/The-Playbook-Master?type=design&node-id=11039-146663&mode=design&t=gsbJpD0lukrp3miB-0',
};

export default {
  title: 'Data Display/Tooltip',
  component: Tooltip,
  render: ({ content, ...args }) => (
    <Tooltip {...args}>
      <IconButton>
        <DeleteIcon />
      </IconButton>
    </Tooltip>
  ),
  parameters: {
    layout: 'centered',
    docs: {
    },
  },
  tags: ['autodocs'],

  argTypes: {
    arrow: {
      control: 'boolean',
      description: 'If true, adds an arrow to the tooltip.',
    },
    open: {
      control: 'boolean',
      description: 'If true, the component is shown.',
    },
    placement: {
      control: 'select',
      options: [
        'bottom-end',
        'bottom-start',
        'bottom',
        'left-end',
        'left-start',
        'left',
        'right-end',
        'right-start',
        'right',
        'top-end',
        'top-start',
        'top',
      ],
      description: 'Tooltip placement.',
    },
  },
};

export const Story = {
  args: {
    arrow: false,
    open: false,
    placement: 'bottom',
    title: 'Delete',
  },
};

export const PositionedTooltips = () => {
  return (
    <Box sx={{ width: 500 }}>
      <Grid container justifyContent="center">
        <Grid item>
          <Tooltip title="Add" arrow placement="top-start">
            <Button>top-start</Button>
          </Tooltip>
          <Tooltip title="Add" arrow placement="top">
            <Button>top</Button>
          </Tooltip>
          <Tooltip title="Add" arrow placement="top-end">
            <Button>top-end</Button>
          </Tooltip>
        </Grid>
      </Grid>
      <Grid container justifyContent="center">
        <Grid item xs={6}>
          <Tooltip title="Add" arrow placement="left-start">
            <Button>left-start</Button>
          </Tooltip>
          <br />
          <Tooltip title="Add" arrow placement="left">
            <Button>left</Button>
          </Tooltip>
          <br />
          <Tooltip title="Add" arrow placement="left-end">
            <Button>left-end</Button>
          </Tooltip>
        </Grid>
        <Grid item container xs={6} alignItems="flex-end" direction="column">
          <Grid item>
            <Tooltip title="Add" arrow placement="right-start">
              <Button>right-start</Button>
            </Tooltip>
          </Grid>
          <Grid item>
            <Tooltip title="Add" arrow placement="right">
              <Button>right</Button>
            </Tooltip>
          </Grid>
          <Grid item>
            <Tooltip title="Add" arrow placement="right-end">
              <Button>right-end</Button>
            </Tooltip>
          </Grid>
        </Grid>
      </Grid>
      <Grid container justifyContent="center">
        <Grid item>
          <Tooltip title="Add" arrow placement="bottom-start">
            <Button>bottom-start</Button>
          </Tooltip>
          <Tooltip title="Add" arrow placement="bottom">
            <Button>bottom</Button>
          </Tooltip>
          <Tooltip title="Add" arrow placement="bottom-end">
            <Button>bottom-end</Button>
          </Tooltip>
        </Grid>
      </Grid>
    </Box>
  );
};
