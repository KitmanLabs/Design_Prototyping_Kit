import {
  Checkbox,
  FormControlLabel,
  FormGroup,
} from '../../playbook-components';
import { KITMAN_ICON_NAMES, KitmanIcon } from '../../playbook-components/icons';

const docs = {
  muiLink: 'https://v5.mui.com/material-ui/react-checkbox/', // changed a link to MUI v5 because its current project version
  figmaLink:
    'https://www.figma.com/design/111qJweoGOlBTRcmptHEf9/Playbook-Master?node-id=6543-43023',
};

export default {
  title: 'Inputs/Checkbox',
  component: Checkbox,
  render: ({ ...args }) => <Checkbox {...args} />,
  parameters: {
    layout: 'centered',
    docs: {
    },
  },
  tags: ['autodocs'],

  argTypes: {
    checked: {
      control: 'boolean',
      description: 'If true, the component is checked.',
    },
    color: {
      control: 'select',
      options: [
        'default',
        'primary',
        'secondary',
        'error',
        'info',
        'success',
        'warning',
      ],
      description: 'The color of the component.',
    },
    defaultChecked: {
      control: 'boolean',
      description:
        'The default checked state. Use when the component is not controlled.',
    },
    disabled: {
      control: 'boolean',
      description: 'If true, the component is disabled.',
    },
    disableRipple: {
      control: 'boolean',
      description: 'If true, the ripple effect is disabled.',
    },
    indeterminate: {
      control: 'boolean',
      description: 'If true, the component appears indeterminate.',
    },
    required: {
      control: 'boolean',
      description: 'If true, the input element is required.',
    },
    size: {
      control: 'select',
      options: ['small', 'medium'],
      description: 'The size of the component.',
    },
    onChange: {
      action: 'changed',
      description: 'Callback fired when the state is changed.',
    },
  },
};

export const Story = {
  args: {
    checked: true,
    color: 'primary',
    disabled: false,
    disableRipple: false,
    indeterminate: false,
    required: false,
    size: 'medium',
  },
};

export const Checked = {
  args: {
    checked: true,
    color: 'primary',
  },
};

export const Indeterminate = {
  args: {
    indeterminate: true,
    color: 'primary',
  },
};

export const Disabled = {
  args: {
    disabled: true,
    checked: true,
  },
};

export const Colors = () => (
  <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
    <Checkbox defaultChecked color="default" />
    <Checkbox defaultChecked color="primary" />
    <Checkbox defaultChecked color="secondary" />
    <Checkbox defaultChecked color="success" />
    <Checkbox defaultChecked color="warning" />
    <Checkbox defaultChecked color="error" />
  </div>
);

export const Sizes = () => (
  <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
    <Checkbox defaultChecked size="small" />
    <Checkbox defaultChecked size="medium" />
    <Checkbox defaultChecked size="large" />
  </div>
);

export const WithLabels = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
    <FormGroup>
      <FormControlLabel control={<Checkbox defaultChecked />} label="Label" />
      <FormControlLabel required control={<Checkbox />} label="Required" />
      <FormControlLabel disabled control={<Checkbox />} label="Disabled" />
    </FormGroup>
  </div>
);

export const WithIcons = () => (
  <div style={{ display: 'flex', gap: '8px' }}>
    <Checkbox
      size="medium"
      icon={<KitmanIcon name={KITMAN_ICON_NAMES.StarBorder} />}
      checkedIcon={<KitmanIcon name={KITMAN_ICON_NAMES.Star} />}
    />

    <Checkbox
      size="medium"
      icon={<KitmanIcon name={KITMAN_ICON_NAMES.CheckCircleOutline} />}
      checkedIcon={<KitmanIcon name={KITMAN_ICON_NAMES.CheckCircle} />}
    />
  </div>
);
