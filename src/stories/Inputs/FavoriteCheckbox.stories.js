import { useState } from 'react';
import { useArgs } from '@storybook/client-api';
import { FavoriteCheckbox } from '../../playbook-components';

const docs = {
  muiLink: 'https://mui.com/material-ui/react-checkbox/',
};

export const Story = () => {
  const [args, updateArgs] = useArgs();
  const onChange = (checked) =>
    updateArgs({
      checked,
      label: checked ? 'Added to favorites' : 'Add to favorites',
      tooltipTitle: checked ? 'Remove from favorites' : null,
    });

  return <FavoriteCheckbox {...args} onChange={onChange} />;
};

Story.args = {
  label: 'Added to favorites',
  checked: true,
  tooltipTitle: 'Remove from favorites',
};

export default {
  title: 'Inputs/FavoriteCheckbox',
  component: Story,
  parameters: {
    layout: 'centered',
    docs: {
    },
  },
  tags: ['autodocs'],
  argTypes: {
    label: {
      control: 'text',
      description: 'The label content',
    },
    checked: {
      control: 'boolean',
      description: 'If checkbox is checked or not',
    },
    tooltipTitle: {
      control: 'text',
      description: 'The tooltip content',
    },
  },
};

export const WithLabel = () => {
  const [isChecked, setIsChecked] = useState(false);

  return (
    <FavoriteCheckbox
      checked={isChecked}
      label={isChecked ? 'Added to favorites' : 'Add to favorites'}
      onChange={(checked) => setIsChecked(checked)}
    />
  );
};

export const WithTooltip = () => {
  const [isChecked, setIsChecked] = useState(false);

  return (
    <FavoriteCheckbox
      checked={isChecked}
      label={isChecked ? 'Added to favorites' : 'Add to favorites'}
      tooltipTitle={isChecked ? 'Remove from favorites' : null}
      onChange={(checked) => setIsChecked(checked)}
    />
  );
};
