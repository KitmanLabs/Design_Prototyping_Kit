// App chrome: fixed left rail + sticky top bar, with page content in the main area.
import Sidebar from './Sidebar'
import TopBar from './TopBar'
import './Layout.css'

export default function Layout({ crumbs, leadingIcon, children }) {
  return (
    <div className="layout">
      <Sidebar />
      <div className="layout__main">
        <TopBar crumbs={crumbs} leadingIcon={leadingIcon} />
        <div className="layout__content">{children}</div>
      </div>
    </div>
  )
}
