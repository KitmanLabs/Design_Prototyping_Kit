import { Container, Typography } from '../../playbook-components';

const docs = {
  muiLink: 'https://mui.com/system/react-box',
  figmaLink:
    'https://www.figma.com/file/VgFMXAuaLKSWTvEbjXHhnc/The-Playbook-Master?type=design&node-id=899-99404&mode=design&t=8uvEuNllEzO2CqdA-0',
};

export default {
  title: 'Layout/Container',
  component: Container,
  render: ({ ...args }) => (
    <Container {...args} sx={{ backgroundColor: 'lightBlue' }}>
      <Typography variant="h3">Where does it come from?</Typography>
      Contrary to popular belief, Lorem Ipsum is not simply random text. It has
      roots in a piece of classical Latin literature from 45 BC, making it over
      2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney
      College in Virginia, looked up one of the more obscure Latin words,
      consectetur, from a Lorem Ipsum passage, and going through the cites of
      the word in classical literature, discovered the undoubtable source. Lorem
      Ipsum comes from sections 1.10.32 and 1.10.33 of &quot;de Finibus Bonorum
      et Malorum&quot; (The Extremes of Good and Evil) by Cicero, written in 45
      BC. This book is a treatise on the theory of ethics, very popular during
      the Renaissance. The first line of Lorem Ipsum, &quot;Lorem ipsum dolor
      sit amet..&quot;, comes from a line in section 1.10.32. The standard chunk
      of Lorem Ipsum used since the 1500s is reproduced below for those
      interested. Sections 1.10.32 and 1.10.33 from &quot;de Finibus Bonorum et
      Malorum&quot; by Cicero are also reproduced in their exact original form,
      accompanied by English versions from the 1914 translation by H. Rackham.
    </Container>
  ),
  parameters: {
    layout: 'centered',
    docs: {
    },
  },
  tags: ['autodocs'],

  argTypes: {
    disableGutters: {
      control: 'boolean',
      description: 'If component gutter is disabled or not',
    },
    fixed: {
      control: 'boolean',
      description: 'If component is fixed or not',
    },
    maxWidth: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl', false],
      description: 'Max width options',
    },
  },
};

export const Story = {
  args: {
    disableGutters: false,
    fixed: false,
    maxWidth: 'md',
  },
};
