import { ResponsivePageHeaderTranslated } from '../playbook-components/HeaderNew'

/**
 * The page header region: the Playbook's HeaderNew (ResponsivePageHeader), as in iP.
 * Props pass straight through; see src/playbook-components/HeaderNew/readme.md.
 *
 * Rules (docs/reference/design-system.md, "Floorplans"):
 * - One primaryAction, one secondaryAction, the rest in moreActions (the overflow menu).
 * - At most four listItems (key facts). HeaderNew shows five badges on desktop, two on mobile.
 * - Page-level actions only. Save belongs in FloorplanFooter, never here.
 */
function PageHeader({ listItems, ...props }) {
  if (import.meta.env.DEV && listItems && listItems.length > 4) {
    console.warn('PageHeader: show at most four key facts in the header; move the rest into the page.')
  }
  return <ResponsivePageHeaderTranslated listItems={listItems} {...props} />
}

export default PageHeader
