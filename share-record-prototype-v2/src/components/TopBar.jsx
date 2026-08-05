// Top navigation bar. Left: breadcrumb (people icon → crumbs). Right: club name
// (opens Switch Club / Sign Out menu) + club avatar.
import { useState, useEffect, useRef, Fragment } from 'react'
import { useNavigate } from 'react-router-dom'
import { currentClub } from '../data/mockData'
import './TopBar.css'

export default function TopBar({ leadingIcon = 'people', crumbs = [] }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const ref = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    const onDoc = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setMenuOpen(false)
    }
    document.addEventListener('mousedown', onDoc)
    return () => document.removeEventListener('mousedown', onDoc)
  }, [])

  return (
    <header className="topbar">
      <div className="topbar__crumbs">
        <span className="material-icons-outlined topbar__crumb-icon">{leadingIcon}</span>
        {crumbs.map((crumb, i) => (
          <Fragment key={crumb}>
            {i > 0 && (
              <span className="material-icons-outlined topbar__chevron">chevron_right</span>
            )}
            <span className={`topbar__crumb ${i === crumbs.length - 1 ? 'topbar__crumb--current' : ''}`}>
              {crumb}
            </span>
          </Fragment>
        ))}
      </div>

      <div className="topbar__club" ref={ref}>
        <button className="topbar__club-btn" onClick={() => setMenuOpen((o) => !o)}>
          <span className="topbar__club-name">{currentClub.name}</span>
          <span className="material-icons-outlined">arrow_drop_down</span>
        </button>
        <span className="topbar__club-avatar">{currentClub.initials}</span>
        {menuOpen && (
          <div className="topbar__menu">
            <button className="topbar__menu-item">
              <span className="material-icons-outlined">swap_horiz</span>
              Switch club
            </button>
            <button
              className="topbar__menu-item"
              onClick={() => {
                setMenuOpen(false)
                navigate('/login')
              }}
            >
              <span className="material-icons-outlined">logout</span>
              Sign out
            </button>
          </div>
        )}
      </div>
    </header>
  )
}
