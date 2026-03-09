import {
  Box,
  SpeedDial,
  SpeedDialIcon,
  SpeedDialAction,
} from '../../playbook-components';
import { FileCopy, Save, Print, Share, Edit } from '@mui/icons-material';

const docs = {
  muiLink: 'https://mui.com/material-ui/react-speed-dial/',
  figmaLink:
    'https://www.figma.com/file/VgFMXAuaLKSWTvEbjXHhnc/The-Playbook-Master?type=design&node-id=6599-50806&mode=design&t=RJD9rqhlg2L9oxmX-0',
};

const actions = [
  { icon: <FileCopy />, name: 'Copy' },
  { icon: <Save />, name: 'Save' },
  { icon: <Print />, name: 'Print' },
  { icon: <Share />, name: 'Share' },
];

export default {
  title: 'Navigation/SpeedDial',
  component: SpeedDial,
  render: ({ ...args }) => {
    return (
      <Box sx={{ height: 320, transform: 'translateZ(0px)', flexGrow: 1 }}>
        <SpeedDial
          {...args}
          ariaLabel="SpeedDial basic example"
          sx={{ position: 'absolute', bottom: 16, right: 16 }}
          icon={<SpeedDialIcon />}
        >
          {actions.map((action) => (
            <SpeedDialAction
              key={action.name}
              icon={action.icon}
              tooltipTitle={action.name}
            />
          ))}
        </SpeedDial>
      </Box>
    );
  },
  parameters: {
    layout: 'centered',
    docs: {
    },
  },
  tags: ['autodocs'],

  argTypes: {
    direction: {
      control: 'select',
      options: ['down', 'left', 'right', 'up'],
      description:
        'The direction the actions open relative to the floating action button.',
      table: {
        defaultValue: { summary: 'up' },
      },
    },
    open: {
      control: 'boolean',
      description: 'If true, the component is shown.',
      table: {
        defaultValue: { summary: false },
      },
    },
    hidden: {
      control: 'boolean',
      description: 'If true, the SpeedDial is hidden.',
      table: {
        defaultValue: { summary: false },
      },
    },
  },
};

export const Story = {
  args: {
    direction: 'up',
    open: false,
    hidden: false,
  },
};

export const WithCustomCloseIcon = () => (
  <Box sx={{ height: 320, transform: 'translateZ(0px)', flexGrow: 1 }}>
    <SpeedDial
      ariaLabel="SpeedDial openIcon example"
      sx={{ position: 'absolute', bottom: 16, right: 16 }}
      icon={<SpeedDialIcon openIcon={<Edit />} />}
    >
      {actions.map((action) => (
        <SpeedDialAction
          key={action.name}
          icon={action.icon}
          tooltipTitle={action.name}
        />
      ))}
    </SpeedDial>
  </Box>
);
