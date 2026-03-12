import { Rating } from '../../playbook-components';

const docs = {
  muiLink: 'https://mui.com/material-ui/react-rating/',
  figmaLink:
    'https://www.figma.com/file/VgFMXAuaLKSWTvEbjXHhnc/The-Playbook-Master?type=design&node-id=11017-144103&mode=design&t=qlnO5wpykUY7hnIV-0',
};

export default {
  title: 'Inputs/Rating',
  component: Rating,
  render: ({ ...args }) => <Rating {...args} value={2} />,
  parameters: {
    layout: 'centered',
    docs: {
    },
  },
  tags: ['autodocs'],

  argTypes: {
    disabled: {
      control: 'boolean',
      description: 'If component is disabled or not',
    },
    max: {
      control: 'select',
      options: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      description: 'Number of icons',
    },
    precision: {
      control: 'select',
      options: [0.25, 0.5, 1, 1.5, 2],
      description: 'Number of icons',
    },
    readOnly: {
      control: 'boolean',
      description: 'If component is read only or not',
    },
    size: {
      control: 'select',
      options: ['small', 'medium', 'large'],
      description: 'Radio Button Size',
    },
  },
};

export const Story = {
  args: {
    disabled: false,
    max: 5,
    precision: 1,
    readOnly: false,
    size: 'medium',
  },
};

export const WithMaxOf10 = () => <Rating defaultValue={2} max={10} />;
