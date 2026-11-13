import React, { useState } from 'react'
import { FormControlLabel, MenuItem, Switch, TextField, Typography, Box } from '../playbook-components'
import {
  PageFrame,
  PageHeader,
  FloorplanFooter,
  SettingsLayout,
  SettingsGroup,
  DiscardChangesDialog,
  useToasts,
} from '../floorplans'
import {
  settingsSections,
  timezoneOptions,
  unitOptions,
  defaultSettings,
  notificationSettings,
  integrationSettings,
} from '../data/settings'

// Floorplan: Settings. Grouped configuration that changes rarely; the save bar appears
// only while there are unsaved changes.

function SwitchSetting({ setting, checked, onChange }) {
  return (
    <FormControlLabel
      control={<Switch checked={checked} onChange={(e) => onChange(e.target.checked)} />}
      label={
        <Box>
          <Typography variant="body2">{setting.label}</Typography>
          <Typography variant="caption" sx={{ color: 'var(--color-text-secondary)' }}>
            {setting.description}
          </Typography>
        </Box>
      }
      sx={{ alignItems: 'flex-start', ml: 0, gap: 1, '& .MuiSwitch-root': { mt: -0.5 } }}
    />
  )
}

function Administration() {
  const { showToast, toasts } = useToasts()
  const [section, setSection] = useState('organization')
  const [saved, setSaved] = useState(defaultSettings)
  const [values, setValues] = useState(defaultSettings)
  const [saving, setSaving] = useState(false)
  const [confirmingDiscard, setConfirmingDiscard] = useState(false)

  const isDirty = Object.keys(values).some((key) => values[key] !== saved[key])
  const set = (key) => (value) => setValues((current) => ({ ...current, [key]: value }))

  const save = () => {
    setSaving(true)
    // A short delay stands in for the request, so Save shows its loading state
    setTimeout(() => {
      setSaved(values)
      setSaving(false)
      showToast({ title: 'Settings saved' })
    }, 600)
  }

  const discard = () => {
    setValues(saved)
    setConfirmingDiscard(false)
  }

  const content = {
    organization: (
      <>
        <SettingsGroup title="Organization" description="How your organization appears to staff and athletes.">
          <TextField
            variant="filled"
            label="Organization name"
            value={values.organizationName}
            onChange={(e) => set('organizationName')(e.target.value)}
          />
        </SettingsGroup>
        <SettingsGroup title="Regional settings" description="Used for dates, times and measurements across iP.">
          <TextField variant="filled" select label="Timezone" value={values.timezone} onChange={(e) => set('timezone')(e.target.value)}>
            {timezoneOptions.map((zone) => <MenuItem key={zone} value={zone}>{zone}</MenuItem>)}
          </TextField>
          <TextField variant="filled" select label="Units" value={values.units} onChange={(e) => set('units')(e.target.value)}>
            {unitOptions.map((unit) => <MenuItem key={unit.value} value={unit.value}>{unit.label}</MenuItem>)}
          </TextField>
        </SettingsGroup>
      </>
    ),
    notifications: (
      <SettingsGroup title="Notifications" description="Which notifications staff and athletes receive.">
        {notificationSettings.map((setting) => (
          <SwitchSetting key={setting.id} setting={setting} checked={values[setting.id]} onChange={set(setting.id)} />
        ))}
      </SettingsGroup>
    ),
    integrations: (
      <SettingsGroup title="Integrations" description="Data that iP imports from other systems.">
        {integrationSettings.map((setting) => (
          <SwitchSetting key={setting.id} setting={setting} checked={values[setting.id]} onChange={set(setting.id)} />
        ))}
      </SettingsGroup>
    ),
  }[section]

  return (
    <PageFrame
      header={<PageHeader title="Administration" />}
      footer={
        <FloorplanFooter
          open={isDirty || saving}
          message="Unsaved changes"
          onCancel={() => setConfirmingDiscard(true)}
          cancelLabel="Discard"
          primaryAction={{ label: 'Save', onClick: save, loading: saving }}
        />
      }
    >
      <SettingsLayout sections={settingsSections} activeSection={section} onSectionChange={setSection}>
        {content}
      </SettingsLayout>
      <DiscardChangesDialog open={confirmingDiscard} onKeepEditing={() => setConfirmingDiscard(false)} onDiscard={discard} />
      {toasts}
    </PageFrame>
  )
}

export default Administration
