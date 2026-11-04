import { useState } from 'react';
import { Box, TextField } from '../../playbook-components';
import { SettingsLayout, SettingsGroup, FloorplanFooter, PageFrame, PageHeader } from '../../floorplans';
import { settingsSections, defaultSettings } from '../../data/settings';

const Demo = () => {
  const [section, setSection] = useState('organization');
  const [name, setName] = useState(defaultSettings.organizationName);
  const isDirty = name !== defaultSettings.organizationName;

  return (
    <Box sx={{ height: 560, overflow: 'auto', border: '1px dashed var(--color-border-primary)' }}>
      <PageFrame
        header={<PageHeader title="Administration" />}
        footer={
          <FloorplanFooter
            open={isDirty}
            message="Unsaved changes"
            cancelLabel="Discard"
            onCancel={() => setName(defaultSettings.organizationName)}
            primaryAction={{ label: 'Save', onClick: () => {} }}
          />
        }
      >
        <SettingsLayout sections={settingsSections} activeSection={section} onSectionChange={setSection}>
          <SettingsGroup title="Organization" description="How your organization appears to staff and athletes.">
            <TextField variant="filled" label="Organization name" value={name} onChange={(e) => setName(e.target.value)} />
          </SettingsGroup>
        </SettingsLayout>
      </PageFrame>
    </Box>
  );
};

export default {
  title: 'Floorplans/Settings',
  component: SettingsLayout,
  render: () => <Demo />,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Section navigation and grouped settings. Edit the organization name: the save bar appears only while there are unsaved changes.',
      },
    },
  },
  tags: ['autodocs'],
};

export const Default = {};
