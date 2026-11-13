import { PageFrame, PageHeader, PageState } from '../../floorplans'
import meta from '../../../prototype.json'

// A placeholder until the prototype's first page replaces it. Start that page from an iP
// baseline or a floorplan (PROTOTYPE.md), then point the route in routes.js at it.
function Start() {
  return (
    <PageFrame header={<PageHeader title={meta.title} />}>
      <PageState kind="empty" title="Nothing built yet" description="This prototype's pages go here." />
    </PageFrame>
  )
}

export default Start
