// url=https://www.figma.com/design/7VG51RENiXwPZrSMvQGmkL?node-id=6579-45197
// source=https://github.com/KitmanLabs/Design_Prototyping_Kit/blob/main/src/playbook-components/TabBar/index.jsx
// component=TabBar

import figma from 'figma'

export default {
  id: 'TabBar',
  imports: ["import { TabBar } from 'playbook-components'"],
  example: figma.code`<TabBar
  value={activeTab}
  onChange={(tabHash) => setActiveTab(tabHash)}
  tabs={[
    { tabKey: 'overview', tabHash: '#overview', title: 'Overview', content: <Overview /> },
    { tabKey: 'details', tabHash: '#details', title: 'Details', content: <Details /> },
  ]}
/>`,
  metadata: { nestable: true },
}
