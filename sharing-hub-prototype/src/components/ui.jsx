// Small hand-built UI primitives matching the Kitman kit's visual style.
// Intentionally simple — this prototype does not use the kit's Playbook Components.
import { useEffect, useRef, useState } from 'react'
import './ui.css'

export function Button({ variant = 'primary', children, ...props }) {
  return (
    <button className={`btn btn--${variant}`} {...props}>
      {children}
    </button>
  )
}

export function IconButton({ icon, ...props }) {
  return (
    <button className="icon-btn" {...props}>
      <span className="material-icons-outlined">{icon}</span>
    </button>
  )
}

export function Field({ label, optional, children }) {
  return (
    <div className="field">
      <label className="field__label">
        {label}
        {optional && <span className="field__optional"> (optional)</span>}
      </label>
      {children}
    </div>
  )
}

// Plain filled dropdown (no search) — for short, fixed option lists.
export function Select({ value, onChange, options, placeholder }) {
  const [open, setOpen] = useState(false)
  const wrapRef = useRef(null)

  useEffect(() => {
    const onDocClick = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', onDocClick)
    return () => document.removeEventListener('mousedown', onDocClick)
  }, [])

  const selected = options.find((o) => o.value === value)

  return (
    <div className="select" ref={wrapRef}>
      <button
        type="button"
        className={`select__control ${open ? 'select__control--open' : ''}`}
        onClick={() => setOpen((o) => !o)}
      >
        <span className={selected ? 'select__value' : 'select__placeholder'}>
          {selected ? selected.label : placeholder}
        </span>
        <span className="material-icons-outlined select__arrow">
          {open ? 'arrow_drop_up' : 'arrow_drop_down'}
        </span>
      </button>
      {open && (
        <div className="select__menu">
          <div className="select__options">
            {options.map((o) => (
              <button
                type="button"
                key={o.value}
                className={`select__option ${o.value === value ? 'select__option--selected' : ''}`}
                onClick={() => {
                  onChange(o.value)
                  setOpen(false)
                }}
              >
                {o.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export function TextField({ value, onChange, placeholder }) {
  return (
    <input
      className="textfield"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
    />
  )
}

export function Chip({ label }) {
  return <span className="chip">{label}</span>
}

// CSS-only hover tooltip. Wraps any trigger; bubble shows on hover/focus.
export function Tooltip({ content, children }) {
  return (
    <span className="tooltip" tabIndex={0}>
      {children}
      <span className="tooltip__bubble" role="tooltip">
        {content}
      </span>
    </span>
  )
}

export function SegmentedToggle({ value, onChange, options }) {
  return (
    <div className="segmented" role="radiogroup">
      {options.map((opt) => (
        <button
          key={opt}
          type="button"
          role="radio"
          aria-checked={value === opt}
          className={`segmented__option ${value === opt ? 'segmented__option--active' : ''}`}
          onClick={() => onChange(opt)}
        >
          {opt}
        </button>
      ))}
    </div>
  )
}
