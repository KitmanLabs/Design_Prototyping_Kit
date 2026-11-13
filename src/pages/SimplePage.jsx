import { PageFrame, PageHeader, PageState } from '../floorplans'

// Floorplan: none yet. A placeholder for routes that aren't built (Analysis, Activity, Help):
// the page title and an empty state, so the page still has a title like every other page.
function SimplePage({ pageName }) {
  return (
    <PageFrame header={<PageHeader title={pageName} />}>
      <PageState kind="empty" title="Not in the prototype yet" description="This page hasn't been built in the kit." />
    </PageFrame>
  )
}

export default SimplePage
