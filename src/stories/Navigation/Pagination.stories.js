import { Stack, Pagination } from '../../playbook-components';

const docs = {
  muiLink: 'https://mui.com/material-ui/react-pagination/',
  figmaLink:
    'https://www.figma.com/file/VgFMXAuaLKSWTvEbjXHhnc/The-Playbook-Master?type=design&node-id=6598-49047&mode=design&t=WWtOUOTiKwjevnUn-0',
};

export default {
  title: 'Navigation/Pagination',
  component: Pagination,
  render: ({ ...args }) => {
    return (
      <Stack spacing={2}>
        <Pagination {...args} count={10} />
      </Stack>
    );
  },
  parameters: {
    layout: 'centered',
    docs: {
    },
  },
  tags: ['autodocs'],

  argTypes: {
    color: {
      control: 'select',
      options: ['primary', 'secondary', 'standard', 'string'],
      description:
        'The active color. It supports both default and custom theme colors, which can be added as shown in the palette customization guide.',
      table: {
        defaultValue: { summary: 'standard' },
      },
    },
    size: {
      control: 'select',
      options: ['small', 'medium', 'large', 'string'],
      description: 'The size of the component.',
      table: {
        defaultValue: { summary: 'medium' },
      },
    },
    variant: {
      control: 'select',
      options: ['outlined', 'text', 'string'],
      description: 'The variant to use.',
      table: {
        defaultValue: { summary: 'text' },
      },
    },
    page: {
      control: 'number',
      description: 'The current page.',
      table: {
        defaultValue: { summary: null },
      },
    },
    defaultPage: {
      control: 'number',
      description:
        'The page selected by default when the component is uncontrolled.',
      table: {
        defaultValue: { summary: 1 },
      },
    },
    count: {
      control: 'number',
      description: 'The total number of pages.',
      table: {
        defaultValue: { summary: 1 },
      },
    },
    boundaryCount: {
      control: 'number',
      description: 'Number of always visible pages at the beginning and end.',
      table: {
        defaultValue: { summary: 1 },
      },
    },
    siblingCount: {
      control: 'number',
      description:
        'Number of always visible pages before and after the current page.',
      table: {
        defaultValue: { summary: 1 },
      },
    },
    disabled: {
      control: 'boolean',
      description: 'If true, the component is disabled.',
      table: {
        defaultValue: { summary: false },
      },
    },
    hideNextButton: {
      control: 'boolean',
      description: 'If true, hide the next-page button.',
      table: {
        defaultValue: { summary: false },
      },
    },
    hidePrevButton: {
      control: 'boolean',
      description: 'If true, hide the previous-page button.',
      table: {
        defaultValue: { summary: false },
      },
    },
    showFirstButton: {
      control: 'boolean',
      description: 'If true, show the first-page button.',
      table: {
        defaultValue: { summary: false },
      },
    },
    showLastButton: {
      control: 'boolean',
      description: 'If true, show the last-page button.',
      table: {
        defaultValue: { summary: false },
      },
    },
  },
};

export const Story = {
  args: {
    color: 'primary',
    size: 'medium',
    variant: 'text',
    page: null,
    defaultPage: 1,
    count: 1,
    boundaryCount: 1,
    siblingCount: 1,
    disabled: false,
    hideNextButton: false,
    hidePrevButton: false,
    showFirstButton: false,
    showLastButton: false,
  },
};

export const WithOutlined = () => (
  <Stack spacing={2}>
    <Pagination count={10} variant="outlined" />
    <Pagination count={10} variant="outlined" color="primary" />
    <Pagination count={10} variant="outlined" color="secondary" />
    <Pagination count={10} variant="outlined" disabled />
  </Stack>
);

export const WithRounded = () => (
  <Stack spacing={2}>
    <Pagination count={10} shape="rounded" />
    <Pagination count={10} variant="outlined" shape="rounded" />
  </Stack>
);

export const WithSize = () => (
  <Stack spacing={2}>
    <Pagination count={10} size="small" />
    <Pagination count={10} />
    <Pagination count={10} size="large" />
  </Stack>
);
