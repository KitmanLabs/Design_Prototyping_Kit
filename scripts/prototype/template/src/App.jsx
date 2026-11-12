import { Routes, Route, Navigate } from 'react-router-dom'
import { LayoutWithMainNav } from './components'
import { PageFrame, PageHeader, PageState } from './floorplans'
import { routes } from './prototype/routes'
import pages from './prototype/pages'
import meta from '../prototype.json'

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

// What a fresh clone shows until routes.js lists its first route.
function NothingBuilt() {
  return (
    <PageFrame header={<PageHeader title={meta.title} />}>
      <PageState kind="empty" title="Nothing built yet" description="This prototype's pages go here." />
    </PageFrame>
  )
}

// The version opens on '/'. A route can claim it; otherwise it goes to the first route.
function opening() {
  if (routes.some((route) => route.path === '/')) return null
  if (!routes.length) return <NothingBuilt />
  return <Navigate to={routes[0].path} replace />
}

function App() {
  const openingPage = opening()
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
        {openingPage && <Route path="/" element={openingPage} />}
        <Route path="*" element={<NotInPrototype />} />
      </Routes>
    </LayoutWithMainNav>
  )
}

export default App
