// url=https://www.figma.com/design/7VG51RENiXwPZrSMvQGmkL?node-id=6570-48313
// component=TextField

import figma from 'figma'

const label = figma.selectedInstance.getString('Label')
const state = figma.selectedInstance.getEnum('State', { Disabled: 'disabled', Error: 'error' })

export default {
  id: 'TextField',
  imports: ["import { TextField } from 'playbook-components'"],
  example: figma.code`<TextField variant="filled" label="${label}"${state ? ` ${state}` : ''} />`,
  metadata: { nestable: true },
}
