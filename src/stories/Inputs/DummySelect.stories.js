import { useArgs } from '@storybook/client-api';
import { DummySelect, Button, Box } from '../../playbook-components';

const options = [
  { value: 1, label: 'Value 1' },
  { value: 2, label: 'Value 2' },
  { value: 3, label: 'Value 3' },
];

export const Story = () => {
  const [args, updateArgs] = useArgs();

  const onChange = (selectedOption) =>
    updateArgs({
      option: selectedOption,
    });

  return (
    <DummySelect {...args} onChange={onChange}>
      <Box>
        {options.map((option) => (
          <Button
            key={`${option.label}_button`}
            variant="text"
            onClick={() =>
              onChange({ value: option.value, label: option.label })
            }
          >
            {option.label}
          </Button>
        ))}
      </Box>
    </DummySelect>
  );
};

Story.args = {
  label: 'Label',
  option: options[0],
};

export default {
  title: 'Inputs/DummySelect',
  component: Story,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    label: {
      control: 'text',
      description: 'The label content',
    },
    option: {
      description: 'Option object used to hold value and label',
    },
    onChange: {
      description: 'Function which gets called on click of element',
    },
    children: {
      description: 'React node passed as children',
    },
  },
};
