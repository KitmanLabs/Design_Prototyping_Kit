import {
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
} from '../../playbook-components';

const docs = {
  muiLink: 'https://mui.com/material-ui/react-radio-button/',
  figmaLink:
    'https://www.figma.com/file/VgFMXAuaLKSWTvEbjXHhnc/The-Playbook-Master?type=design&node-id=6558-39248&mode=design&t=qlnO5wpykUY7hnIV-0',
};

export default {
  title: 'Inputs/Radio Group',
  component: RadioGroup,
  render: ({ ...args }) => (
    <FormControl>
      <FormLabel>Gender</FormLabel>
      <RadioGroup defaultValue="female">
        <FormControlLabel
          value="female"
          label="Female"
          control={<Radio {...args} />}
        />
        <FormControlLabel
          value="male"
          label="Male"
          control={<Radio {...args} />}
        />
        <FormControlLabel
          value="other"
          label="Other"
          control={<Radio {...args} />}
        />
      </RadioGroup>
    </FormControl>
  ),
  parameters: {
    layout: 'centered',
    docs: {
    },
  },
  tags: ['autodocs'],

  argTypes: {
    color: {
      control: 'select',
      options: [
        'primary',
        'default',
        'secondary',
        'error',
        'info',
        'success',
        'warning',
      ],
      description: 'Radio color styles',
    },
    disabled: {
      control: 'boolean',
      description: 'If component is disabled or not',
    },
    required: {
      control: 'boolean',
      description: 'If component is required or not',
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
    color: 'primary',
    disabled: false,
    size: 'large',
  },
};

export const WithHorizontalOrientation = () => (
  <FormControl>
    <FormLabel>Gender</FormLabel>
    <RadioGroup defaultValue="female" row>
      <FormControlLabel
        value="female"
        control={<Radio color="success" />}
        label="Female"
      />
      <FormControlLabel
        value="male"
        control={<Radio color="success" />}
        label="Male"
      />
      <FormControlLabel
        value="other"
        control={<Radio color="success" />}
        label="Other"
      />
    </RadioGroup>
  </FormControl>
);
