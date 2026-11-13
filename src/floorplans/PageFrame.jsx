import { Box, GenericActionBar } from '../playbook-components'

/**
 * The shared page anatomy every floorplan builds on. LayoutWithMainNav (the app shell)
 * already supplies the main navigation and the app bar; PageFrame fills the content area:
 *
 *   header      PageHeader (Playbook HeaderNew): title, key facts, badges, page actions
 *   tabs        TabBar, when the page has views or facets
 *   toolbar     PageToolbar: search, quick filters, the Filters drawer button
 *   selection   { count, actions } replaces the toolbar with the Playbook GenericActionBar
 *               while rows are selected
 *   children    the floorplan's content
 *   footer      FloorplanFooter, only in create and edit, or with unsaved changes
 *
 * Each slot is optional. Pass `fill` for floorplans whose content manages its own scrolling
 * (List-detail, Workspace), so the frame takes exactly the available height.
 */
function PageFrame({
  header,
  tabs,
  toolbar,
  selection,
  footer,
  fill = false,
  contentPadding = 3,
  maxContentWidth,
  contentSx,
  children,
}) {
  const isSelecting = Boolean(selection && selection.count > 0)
  const hasStickyRegion = Boolean(tabs || toolbar || isSelecting)

  return (
    <Box
      data-testid="PageFrame"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100%',
        ...(fill && { height: '100%', minHeight: 0 }),
        bgcolor: 'var(--color-background-primary)',
      }}
    >
      {header}

      {hasStickyRegion && (
        <Box
          sx={{
            position: 'sticky',
            top: 0,
            zIndex: 'var(--z-sticky)',
            bgcolor: 'var(--color-white)',
            borderBottom: '1px solid var(--color-border-primary)',
          }}
        >
          {tabs}
          {isSelecting ? (
            <GenericActionBar
              selectedCount={selection.count}
              actions={selection.actions || []}
              customContent={selection.customContent}
              t={(text) => text}
            />
          ) : (
            toolbar
          )}
        </Box>
      )}

      <Box
        component="section"
        sx={{
          flex: 1,
          minHeight: 0,
          p: contentPadding,
          ...(fill && { overflow: 'hidden', display: 'flex', flexDirection: 'column' }),
          ...(maxContentWidth && { width: '100%', maxWidth: maxContentWidth, mx: 'auto' }),
          ...contentSx,
        }}
      >
        {children}
      </Box>

      {footer}
    </Box>
  )
}

export default PageFrame
