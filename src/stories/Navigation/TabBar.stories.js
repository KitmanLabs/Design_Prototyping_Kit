import { useState } from 'react';
import { Box, TabBar, Typography } from '../../playbook-components';

const tabs = [
  { tabKey: 'overview', tabHash: '#overview', title: 'Overview', content: <Typography variant="body2">Overview content</Typography> },
  { tabKey: 'availability', tabHash: '#availability', title: 'Availability', content: <Typography variant="body2">Availability content</Typography> },
  { tabKey: 'notes', tabHash: '#notes', title: 'Notes', content: <Typography variant="body2">Notes content</Typography> },
];

const TabBarDemo = (args) => {
  const [value, setValue] = useState(args.value);
  return (
    <Box sx={{ width: 600 }}>
      <TabBar {...args} value={value} onChange={setValue} />
    </Box>
  );
};

export default {
  title: 'Navigation/TabBar',
  component: TabBar,
  render: (args) => <TabBarDemo {...args} />,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Page-level tabs. Each tab has a `tabKey`, a `tabHash` (its value) and a `title`, plus optional `content` rendered in its panel. `onChange` receives the selected `tabHash`.',
      },
    },
  },
  tags: ['autodocs'],
  args: {
    tabs,
    value: '#overview',
    variant: 'standard',
  },
  argTypes: {
    variant: { control: 'select', options: ['standard', 'scrollable', 'fullWidth'] },
    tabs: { control: 'object' },
  },
};

export const Default = {};

export const Scrollable = {
  args: { variant: 'scrollable' },
};
