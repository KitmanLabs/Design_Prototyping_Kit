import { useState } from 'react';
import { ExpandButton } from '../../playbook-components';

const ExpandButtonDemo = (args) => {
  const [isCollapsed, setIsCollapsed] = useState(args.isCollapsed);
  return (
    <ExpandButton
      {...args}
      isCollapsed={isCollapsed}
      handleClick={() => setIsCollapsed((collapsed) => !collapsed)}
    />
  );
};

export default {
  title: 'Inputs/ExpandButton',
  component: ExpandButton,
  render: (args) => <ExpandButtonDemo {...args} />,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Small icon button that toggles a collapsible section. It stops click propagation, so it can sit inside a clickable row.',
      },
    },
  },
  tags: ['autodocs'],
  args: {
    isCollapsed: true,
    isDisabled: false,
    ariaLabel: 'Expand list',
  },
};

export const Default = {};

export const Disabled = {
  args: { isDisabled: true },
};
