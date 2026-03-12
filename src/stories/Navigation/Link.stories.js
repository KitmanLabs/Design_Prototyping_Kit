import { Box, Link } from '../../playbook-components';

const docs = {
  muiLink: 'https://mui.com/material-ui/react-link/',
  figmaLink:
    'https://www.figma.com/file/VgFMXAuaLKSWTvEbjXHhnc/The-Playbook-Master?type=design&node-id=6574-50673&mode=design&t=WWtOUOTiKwjevnUn-0',
};

const preventDefault = (event) => event.preventDefault();

export default {
  title: 'Navigation/Link',
  component: Link,
  render: ({ ...args }) => {
    return (
      <Box
        sx={{
          typography: 'body1',
          '& > :not(style) ~ :not(style)': {
            ml: 2,
          },
        }}
        onClick={preventDefault}
      >
        <Link {...args} href="#">
          Link
        </Link>
        <Link {...args} href="#" color="inherit">
          {`color="inherit"`}
        </Link>
        <Link {...args} href="#" variant="body2">
          {`variant="body2"`}
        </Link>
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
    color: {
      color: 'text',
      description: 'The color of the link.',
      table: {
        defaultValue: { summary: 'primary' },
      },
    },
    underline: {
      control: 'select',
      options: ['always', 'hover', 'none'],
      description: 'Controls when the link should have an underline.',
      table: {
        defaultValue: { summary: 'always' },
      },
    },
    variant: {
      control: 'select',
      options: [
        'body1',
        'body2',
        'button',
        'caption',
        'h1',
        'h2',
        'h3',
        'h4',
        'h5',
        'h6',
        'inherit',
        'overline',
        'subtitle1',
        'subtitle2',
        'string',
      ],
      description: 'Applies the theme typography styles.',
      table: {
        defaultValue: { summary: 'inherit' },
      },
    },
  },
};

export const Story = {
  args: {
    color: 'primary',
    underline: 'always',
    variant: 'inherit',
  },
};

export const WithUnderline = () => (
  <Box
    sx={{
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'center',
      typography: 'body1',
      '& > :not(style) ~ :not(style)': {
        ml: 2,
      },
    }}
    onClick={preventDefault}
  >
    <Link href="#" underline="none">
      {`underline="none"`}
    </Link>
    <Link href="#" underline="hover">
      {`underline="hover"`}
    </Link>
    <Link href="#" underline="always">
      {`underline="always"`}
    </Link>
  </Box>
);
