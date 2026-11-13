import { Routes, Route } from 'react-router-dom'
import { LayoutWithMainNav } from './components'
import { PageFrame, PageHeader, PageState } from './floorplans'
import { routes } from './prototype/routes'
import pages from './prototype/pages'

// The app shell around this prototype's routes. Add routes in src/prototype/routes.js, not here.

function NotInPrototype() {
  return (
    <PageFrame header={<PageHeader title="Not in this prototype" />}>
      <PageState
        kind="empty"
        title="This page isn't part of the prototype"
        description="Go back to the page you were shown."
      />
    </PageFrame>
  )
}

function App() {
  return (
    <LayoutWithMainNav>
      <Routes>
        {routes.map((route) => {
          const Page = pages[route.page]
          if (!Page) {
            throw new Error(`routes.js names a page "${route.page}" that src/prototype/pages doesn't export.`)
          }
          return <Route key={route.path} path={route.path} element={<Page />} />
        })}
        <Route path="*" element={<NotInPrototype />} />
      </Routes>
    </LayoutWithMainNav>
  )
}

export default App
