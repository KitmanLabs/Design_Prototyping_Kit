// url=https://www.figma.com/design/7VG51RENiXwPZrSMvQGmkL?node-id=6570-41424
// component=Select

import figma from 'figma'

const label = figma.selectedInstance.getString('Label')
const disabled = figma.selectedInstance.getEnum('State', { Disabled: true })

export default {
  id: 'Select',
  imports: ["import { FormControl, InputLabel, MenuItem, Select } from 'playbook-components'"],
  example: figma.code`<FormControl variant="filled"${disabled ? ' disabled' : ''}>
  <InputLabel>${label}</InputLabel>
  <Select variant="filled" value={value} onChange={handleChange}>
    <MenuItem value="">None</MenuItem>
  </Select>
</FormControl>`,
  metadata: { nestable: true },
}
