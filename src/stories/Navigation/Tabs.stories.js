/* eslint-disable react-hooks/rules-of-hooks */
import { useState } from 'react';
import { useArgs } from '@storybook/client-api';
import { Box, Tabs, Tab, Typography } from '../../playbook-components';

const docs = {
  muiLink: 'https://mui.com/material-ui/react-tabs/',
  figmaLink:
    'https://www.figma.com/file/VgFMXAuaLKSWTvEbjXHhnc/The-Playbook-Master?type=design&node-id=6579-45052&mode=design&t=HHOBSXBlC1skHPQC-0',
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

export default {
  title: 'Navigation/Tabs',
  component: Tabs,
  render: () => {
    const [args, updateArgs] = useArgs();
    const handleChange = (event, updatedValue) =>
      updateArgs({ value: updatedValue });
    return (
      <Box sx={{ maxWidth: { xs: 320, sm: 480 }, bgcolor: 'background.paper' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs {...args} value={args.value} onChange={handleChange}>
            <Tab label="Item One" {...a11yProps(0)} />
            <Tab label="Item Two" {...a11yProps(1)} />
            <Tab label="Item Three" {...a11yProps(2)} />
            {args.variant === 'scrollable' && (
              <Tab label="Item Four" {...a11yProps(3)} />
            )}
            {args.variant === 'scrollable' && (
              <Tab label="Item Five" {...a11yProps(4)} />
            )}
            {args.variant === 'scrollable' && (
              <Tab label="Item Six" {...a11yProps(5)} />
            )}
          </Tabs>
          <CustomTabPanel value={args.value} index={0}>
            Item One
          </CustomTabPanel>
          <CustomTabPanel value={args.value} index={1}>
            Item Two
          </CustomTabPanel>
          <CustomTabPanel value={args.value} index={2}>
            Item Three
          </CustomTabPanel>
          <CustomTabPanel value={args.value} index={3}>
            Item Four
          </CustomTabPanel>
          <CustomTabPanel value={args.value} index={4}>
            Item Five
          </CustomTabPanel>
          <CustomTabPanel value={args.value} index={5}>
            Item Six
          </CustomTabPanel>
        </Box>
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
    value: {
      control: 'number',
      description: `The value of the currently selected Tab. If you don't want any selected Tab, you can set this prop to false.`,
      table: {
        defaultValue: { summary: 0 },
      },
    },
    variant: {
      control: 'select',
      options: ['fullWidth', 'scrollable', 'standard'],
      description: `Determines additional display behavior of the tabs:
        \n- scrollable will invoke scrolling properties and allow for horizontally scrolling (or swiping) of the tab bar.
        \n- fullWidth will make the tabs grow to use all the available space, which should be used for small views, like on mobile.
        \n- standard will render the default state.`,
      table: {
        defaultValue: { summary: 'standard' },
      },
    },
    orientation: {
      control: 'select',
      options: ['horizontal', 'vertical'],
      description: 'The component orientation (layout flow direction).',
      table: {
        defaultValue: { summary: 'horizontal' },
      },
    },
    textColor: {
      control: 'select',
      options: ['inherit', 'primary', 'secondary'],
      description: 'Determines the color of the Tab.',
      table: {
        defaultValue: { summary: 'primary' },
      },
    },
    indicatorColor: {
      control: 'select',
      options: ['primary', 'secondary', 'string'],
      description: 'Determines the color of the indicator.',
      table: {
        defaultValue: { summary: 'primary' },
      },
    },
    scrollButtons: {
      control: 'select',
      options: ['auto', true, false],
      description: `Determine behavior of scroll buttons when tabs are set to scroll:
      \n- auto will only present them when not all the items are visible.
      \n- true will always present them.
      \n- false will never present them.
      \n\nBy default the scroll buttons are hidden on mobile. This behavior can be disabled with allowScrollButtonsMobile.`,
      table: {
        defaultValue: { summary: 'auto' },
      },
    },
    centered: {
      control: 'boolean',
      description:
        'If true, the tabs are centered. This prop is intended for large views.',
      table: {
        defaultValue: { summary: false },
      },
    },
    allowScrollButtonsMobile: {
      control: 'boolean',
      description: `If true, the scroll buttons aren't forced hidden on mobile. By default the scroll buttons are hidden on mobile and takes precedence over scrollButtons.`,
      table: {
        defaultValue: { summary: false },
      },
    },
    selectionFollowsFocus: {
      control: 'boolean',
      description:
        'If true the selected tab changes on focus. Otherwise it only changes on activation.',
      table: {
        defaultValue: { summary: false },
      },
    },
    visibleScrollbar: {
      control: 'boolean',
      description:
        'If true, the scrollbar is visible. It can be useful when displaying a long vertical list of tabs.',
      table: {
        defaultValue: { summary: false },
      },
    },
  },
};

export const Story = {
  args: {
    value: 0,
    variant: 'standard',
    orientation: 'horizontal',
    textColor: 'primary',
    indicatorColor: 'primary',
    scrollButtons: 'auto',
    centered: false,
    allowScrollButtonsMobile: false,
    selectionFollowsFocus: false,
    visibleScrollbar: false,
  },
};

export const WithColored = () => {
  const [value, setValue] = useState('one');

  return (
    <Box sx={{ width: '100%' }}>
      <Tabs
        value={value}
        onChange={(event, newValue) => setValue(newValue)}
        textColor="secondary"
        indicatorColor="secondary"
      >
        <Tab value="one" label="Item One" />
        <Tab value="two" label="Item Two" />
        <Tab value="three" label="Item Three" />
      </Tabs>
    </Box>
  );
};

export const WithDisabled = () => {
  const [value, setValue] = useState('one');

  return (
    <Box sx={{ width: '100%' }}>
      <Tabs value={value} onChange={(event, newValue) => setValue(newValue)}>
        <Tab value="one" label="Item One" />
        <Tab value="two" label="Item Two" disabled />
        <Tab value="three" label="Item Three" />
      </Tabs>
    </Box>
  );
};

export const WithScrollable = () => {
  const [value, setValue] = useState(0);

  return (
    <Box sx={{ maxWidth: { xs: 320, sm: 480 }, bgcolor: 'background.paper' }}>
      <Tabs
        value={value}
        onChange={(event, newValue) => setValue(newValue)}
        variant="scrollable"
        scrollButtons="auto"
        aria-label="scrollable auto tabs example"
      >
        <Tab label="Item One" />
        <Tab label="Item Two" />
        <Tab label="Item Three" />
        <Tab label="Item Four" />
        <Tab label="Item Five" />
        <Tab label="Item Six" />
        <Tab label="Item Seven" />
      </Tabs>
    </Box>
  );
};
