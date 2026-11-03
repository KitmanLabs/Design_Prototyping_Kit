// url=https://www.figma.com/design/7VG51RENiXwPZrSMvQGmkL?node-id=6588-47683
// component=Chip

import figma from 'figma'

const label = figma.selectedInstance.getString('Label')
const disabled = figma.selectedInstance.getEnum('State', { Disabled: true })
const color = figma.selectedInstance.getEnum('Color', {
  Default: 'default',
  Primary: 'primary',
  Secondary: 'secondary',
  Error: 'error',
  Warning: 'warning',
  Info: 'info',
  Success: 'success',
})

export default {
  id: 'Chip',
  imports: ["import { Chip } from 'playbook-components'"],
  example: figma.code`<Chip label="${label}" size="small"${color && color !== 'default' ? ` color="${color}"` : ''}${disabled ? ' disabled' : ''} />`,
  metadata: { nestable: true },
}
