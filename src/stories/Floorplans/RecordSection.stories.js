import { useState } from 'react';
import { Box, TextField } from '../../playbook-components';
import { RecordLayout, RecordSection, RecordFields } from '../../floorplans';

const Demo = () => {
  const [height, setHeight] = useState('188cm');
  const [draft, setDraft] = useState(height);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  const save = () => {
    setSaving(true);
    setTimeout(() => {
      setHeight(draft);
      setSaving(false);
      setEditing(false);
    }, 600);
  };

  return (
    <Box sx={{ width: 1000, p: 3, bgcolor: 'var(--color-background-primary)' }}>
      <RecordLayout asideTitle="Timeline" aside={<Box sx={{ typography: 'body2' }}>2024-01-15 · Daily wellbeing</Box>}>
        <RecordSection
          title="Profile"
          isEditing={editing}
          onEdit={() => {
            setDraft(height);
            setEditing(true);
          }}
          onCancel={() => setEditing(false)}
          onSave={save}
          saving={saving}
        >
          {editing ? (
            <TextField variant="filled" label="Height" value={draft} onChange={(e) => setDraft(e.target.value)} />
          ) : (
            <RecordFields
              fields={[
                { id: 'position', label: 'Position', value: 'Forward' },
                { id: 'height', label: 'Height', value: height },
              ]}
            />
          )}
        </RecordSection>
      </RecordLayout>
    </Box>
  );
};

export default {
  title: 'Floorplans/Record sections',
  component: RecordSection,
  render: () => <Demo />,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A Record\'s content: RecordLayout puts a supporting pane (timeline, notes) beside the main column from the lg breakpoint, and under it below. Each RecordSection has its own Edit, then Cancel and Save, so people change one part of a record at a time. RecordFields is the read view.',
      },
    },
  },
  tags: ['autodocs'],
};

export const SectionLevelEditing = {};
