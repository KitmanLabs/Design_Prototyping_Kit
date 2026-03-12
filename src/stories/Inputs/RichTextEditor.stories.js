import { useArgs } from '@storybook/client-api';
import {
  Box,
  RichTextEditor as RichTextEditorComponent,
} from '../../playbook-components';
import 'remirror/styles/all.css';

const docs = {
  figmaLink:
    'https://www.figma.com/file/VgFMXAuaLKSWTvEbjXHhnc/The-Playbook-Master?type=design&node-id=7031-1334&mode=design&t=QPxREzVb7JiFy7aH-0',
};

export const Story = () => {
  const [args, updateArgs] = useArgs();
  const onChange = (updatedValue) => updateArgs({ value: updatedValue });

  return (
    <Box sx={{ width: 500 }}>
      <RichTextEditorComponent
        key={JSON.stringify({
          placeholder: args.placeholder,
          charLimit: args.charLimit,
          showHeadingButtons: args.showHeadingButtons,
        })}
        {...args}
        onChange={onChange}
      />
    </Box>
  );
};

Story.args = {
  label: undefined,
  optionalText: undefined,
  placeholder: undefined,
  value: undefined,
  onChange: () => {},
  disabled: false,
  error: false,
  errorText: undefined,
  showHeadingButtons: false,
  size: 'medium',
  charLimit: undefined,
};

const onChangeDescription = `
<div style="margin-bottom: 8px;">Callback fired when the value is changed</div>
<div style="margin-bottom: 5px;"><strong>Signature:</strong></div>
<div><code>function(content: string) => void</code></div>`;

export default {
  title: 'Inputs/RichTextEditor',
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
    optionalText: {
      control: 'text',
      description: 'The optional text content',
    },
    placeholder: {
      control: 'text',
      description: 'The placeholder content',
    },
    value: {
      control: 'text',
      description: 'The value of the contentEditable element',
    },
    onChange: {
      control: { type: null },
      description: onChangeDescription,
    },
    disabled: {
      control: 'boolean',
      description: 'If true, the component is disabled',
    },
    error: {
      control: 'boolean',
      description: 'If true, the component is displayed in an error state',
    },
    errorText: {
      control: 'text',
      description: 'The error text content',
      if: { arg: 'error' },
    },
    showHeadingButtons: {
      control: 'boolean',
      description: 'If true, the heading buttons will show in the toolbar',
      table: {
        defaultValue: { summary: false },
      },
    },
    size: {
      control: 'select',
      description: 'The size of the component',
      options: ['small', 'medium', 'large'],
      table: {
        defaultValue: { summary: 'medium' },
      },
    },
    charLimit: {
      control: 'number',
      description: 'character limit',
    },
  },
};

export const WithLabel = () => {
  return (
    <Box sx={{ width: 500 }}>
      <RichTextEditorComponent label="Label" onChange={() => {}} />
    </Box>
  );
};

export const WithOptionalText = () => {
  return (
    <Box sx={{ width: 500 }}>
      <RichTextEditorComponent
        optionalText="Optional text"
        onChange={() => {}}
      />
    </Box>
  );
};

export const WithPlaceholder = () => {
  return (
    <Box sx={{ width: 500 }}>
      <RichTextEditorComponent placeholder="Placeholder" onChange={() => {}} />
    </Box>
  );
};

export const WithLabelAndOptionalText = () => {
  return (
    <Box sx={{ width: 500 }}>
      <RichTextEditorComponent
        label="Label"
        optionalText="Optional text"
        onChange={() => {}}
      />
    </Box>
  );
};

export const WithValue = () => {
  return (
    <Box sx={{ width: 500 }}>
      <RichTextEditorComponent
        value="<p><strong>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</strong> <em>Duis suscipit sit amet metus eu rhoncus</em>. <u>Nunc congue nisl id ex lobortis</u>, <s>tincidunt semper nulla pharetra</s>. </p><p></p><ul><li><p>Integer tincidunt hendrerit tellus eu varius.</p></li></ul><ol><li><p>Nullam dapibus leo ligula, sit amet lacinia enim pulvinar in.</p></li></ol>"
        onChange={() => {}}
      />
    </Box>
  );
};

export const WithErrorState = () => {
  return (
    <Box sx={{ width: 500 }}>
      <RichTextEditorComponent
        label="Label"
        onChange={() => {}}
        error
        errorText="This field is required"
      />
    </Box>
  );
};

export const WithDisabledState = () => {
  return (
    <Box sx={{ width: 500 }}>
      <RichTextEditorComponent onChange={() => {}} disabled />
    </Box>
  );
};

export const WithHeadingButtons = () => {
  return (
    <Box sx={{ width: 500 }}>
      <RichTextEditorComponent onChange={() => {}} showHeadingButtons />
    </Box>
  );
};

export const WithCharacterLimit = () => {
  return (
    <Box sx={{ width: 500 }}>
      <RichTextEditorComponent onChange={() => {}} charLimit={250} />
    </Box>
  );
};
