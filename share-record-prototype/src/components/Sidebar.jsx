// Left-side icon rail. Placeholder icon set — only Settings is active, since the
// user is in the administration area. Icons are not final.
import './Sidebar.css'

const NAV_ITEMS = [
  { icon: 'dashboard', label: 'Dashboard' },
  { icon: 'groups', label: 'Athletes' },
  { icon: 'calendar_today', label: 'Calendar' },
  { icon: 'medical_services', label: 'Medical' },
  { icon: 'bar_chart', label: 'Reports' },
]

export default function Sidebar() {
  return (
    <nav className="sidebar" aria-label="Main navigation">
      <div className="sidebar__logo">RL</div>
      <div className="sidebar__items">
        {NAV_ITEMS.map((item) => (
          <button key={item.label} className="sidebar__item" title={item.label} aria-label={item.label}>
            <span className="material-icons-outlined">{item.icon}</span>
          </button>
        ))}
      </div>
      <div className="sidebar__bottom">
        <button
          className="sidebar__item sidebar__item--active"
          title="Settings"
          aria-label="Settings"
          aria-current="page"
        >
          <span className="material-icons-outlined">settings</span>
        </button>
      </div>
    </nav>
  )
}
