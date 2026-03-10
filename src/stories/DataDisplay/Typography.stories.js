import { Box, Typography } from '../../playbook-components';

const docs = {
  muiLink: 'https://mui.com/material-ui/react-typography/',
  figmaLink:
    'https://www.figma.com/file/VgFMXAuaLKSWTvEbjXHhnc/The-Playbook-Master?type=design&node-id=11039-146766&mode=design&t=gsbJpD0lukrp3miB-0',
};

export default {
  title: 'Data Display/Typography',
  component: Typography,
  render: ({ content, ...args }) => (
    <Box sx={{ width: '100%', maxWidth: 500 }}>
      <Typography {...args} variant="h1">
        h1. Heading
      </Typography>
      <Typography {...args} variant="h2">
        h2. Heading
      </Typography>
      <Typography {...args} variant="h3">
        h3. Heading
      </Typography>
      <Typography {...args} variant="h4">
        h4. Heading
      </Typography>
      <Typography {...args} variant="h5">
        h5. Heading
      </Typography>
      <Typography {...args} variant="h6">
        h6. Heading
      </Typography>
      <Typography {...args} variant="subtitle1">
        subtitle1. Lorem ipsum dolor sit amet, consectetur adipisicing elit.
        Quos blanditiis tenetur
      </Typography>
      <Typography {...args} variant="subtitle2">
        subtitle2. Lorem ipsum dolor sit amet, consectetur adipisicing elit.
        Quos blanditiis tenetur
      </Typography>
      <Typography {...args} variant="body1">
        body1. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quos
        blanditiis tenetur unde suscipit, quam beatae rerum inventore
        consectetur, neque doloribus, cupiditate numquam dignissimos laborum
        fugiat deleniti? Eum quasi quidem quibusdam.
      </Typography>
      <Typography {...args} variant="body2">
        body2. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quos
        blanditiis tenetur unde suscipit, quam beatae rerum inventore
        consectetur, neque doloribus, cupiditate numquam dignissimos laborum
        fugiat deleniti? Eum quasi quidem quibusdam.
      </Typography>
      <Typography {...args} variant="button" display="block">
        button text
      </Typography>
      <Typography {...args} variant="caption" display="block">
        caption text
      </Typography>
      <Typography {...args} variant="overline" display="block">
        overline text
      </Typography>
    </Box>
  ),
  parameters: {
    layout: 'centered',
    docs: {
    },
  },
  tags: ['autodocs'],

  argTypes: {
    align: {
      control: 'select',
      options: ['center', 'inherit', 'justify', 'left', 'right'],
      description: 'Set the text-align on the component.',
    },
    gutterBottom: {
      control: 'boolean',
      description: 'If true, the text will have a bottom margin.',
    },
    noWrap: {
      control: 'boolean',
      description:
        'If true, the text will not wrap, but instead will truncate with a text overflow ellipsis. Note that text overflow can only happen with block or inline-block level elements (the element needs to have a width in order to overflow).',
    },
    paragraph: {
      control: 'boolean',
      description: 'If true, the element will be a paragraph element.',
    },
  },
};

export const Story = {
  args: {
    align: 'inherit',
    gutterBottom: false,
    noWrap: false,
    paragraph: false,
  },
};
