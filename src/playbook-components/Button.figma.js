// url=https://www.figma.com/design/7VG51RENiXwPZrSMvQGmkL?node-id=6543-36744
// component=Button

import figma from 'figma'

const label = figma.selectedInstance.getString('Label')
const disabled = figma.selectedInstance.getEnum('State', { Disabled: true })
// Only contained buttons are allowed; outlined and text variants map to secondary.
const color = figma.selectedInstance.getEnum('Variant', {
  Contained: 'primary',
  Outlined: 'secondary',
  Text: 'secondary',
})

export default {
  id: 'Button',
  imports: ["import { Button } from 'playbook-components'"],
  example: figma.code`<Button variant="contained" color="${color || 'primary'}" size="small" disableElevation={true}${disabled ? ' disabled' : ''}>
  ${label}
</Button>`,
  metadata: { nestable: true },
}
