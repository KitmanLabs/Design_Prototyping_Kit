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

export function ConfirmDialog({ open, title, message, confirmLabel = 'Confirm', onConfirm, onCancel }) {
  if (!open) return null
  return (
    <div className="confirm-backdrop" onClick={onCancel}>
      <div className="confirm-modal" role="alertdialog" aria-label={title} onClick={(e) => e.stopPropagation()}>
        <h3 className="confirm-modal__title">{title}</h3>
        <p className="confirm-modal__message">{message}</p>
        <div className="confirm-modal__actions">
          <Button variant="secondary" onClick={onCancel}>Cancel</Button>
          <Button variant="primary" onClick={onConfirm}>{confirmLabel}</Button>
        </div>
      </div>
    </div>
  )
}

export function IconButton({ icon, ...props }) {
  return (
    <button className="icon-btn" {...props}>
      <span className="material-icons-outlined">{icon}</span>
    </button>
  )
}

export function Avatar({ name, size = 40 }) {
  const initials = name
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
  return (
    <span
      className="avatar"
      style={{ width: size, height: size, fontSize: size * 0.4 }}
    >
      {initials}
    </span>
  )
}

export function Checkbox({ checked, indeterminate = false, onChange, label, sublabel }) {
  const ref = useRef(null)
  useEffect(() => {
    if (ref.current) ref.current.indeterminate = indeterminate && !checked
  }, [indeterminate, checked])
  return (
    <label className="checkbox">
      <input ref={ref} type="checkbox" checked={checked} onChange={onChange} />
      <span className="checkbox__text">
        <span className="checkbox__label">{label}</span>
        {sublabel && <span className="checkbox__sublabel">{sublabel}</span>}
      </span>
    </label>
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

// Filled-grey searchable dropdown, mimicking the kit's filled select style.
export function SearchableSelect({ value, onChange, options, placeholder }) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const wrapRef = useRef(null)

  useEffect(() => {
    const onDocClick = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', onDocClick)
    return () => document.removeEventListener('mousedown', onDocClick)
  }, [])

  const filtered = options.filter((o) =>
    o.toLowerCase().includes(query.toLowerCase())
  )

  return (
    <div className="select" ref={wrapRef}>
      <button
        type="button"
        className={`select__control ${open ? 'select__control--open' : ''}`}
        onClick={() => setOpen((o) => !o)}
      >
        <span className={value ? 'select__value' : 'select__placeholder'}>
          {value || placeholder}
        </span>
        <span className="material-icons-outlined select__arrow">
          {open ? 'arrow_drop_up' : 'arrow_drop_down'}
        </span>
      </button>
      {open && (
        <div className="select__menu">
          <input
            autoFocus
            className="select__search"
            placeholder="Search…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <div className="select__options">
            {filtered.length === 0 && (
              <div className="select__empty">No matches</div>
            )}
            {filtered.map((o) => (
              <button
                type="button"
                key={o}
                className={`select__option ${o === value ? 'select__option--selected' : ''}`}
                onClick={() => {
                  onChange(o)
                  setOpen(false)
                  setQuery('')
                }}
              >
                {o}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// Two/three-option pill toggle (e.g. permission level).
export function SegmentedToggle({ value, onChange, options }) {
  return (
    <div className="segmented" role="radiogroup">
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          role="radio"
          aria-checked={value === opt.value}
          className={`segmented__option ${value === opt.value ? 'segmented__option--active' : ''}`}
          onClick={() => onChange(opt.value)}
        >
          {opt.label}
        </button>
      ))}
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

// Native date input, styled to match TextField.
export function DateField({ value, onChange, min }) {
  return (
    <input
      type="date"
      className="textfield"
      value={value}
      min={min}
      onChange={(e) => onChange(e.target.value)}
    />
  )
}

export function TextField({ value, onChange, placeholder, multiline }) {
  if (multiline) {
    return (
      <textarea
        className="textfield textfield--multiline"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={3}
      />
    )
  }
  return (
    <input
      className="textfield"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
    />
  )
}

// Small label chip (grey, rounded) used in the Labels column.
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

const STATUS_LABELS = {
  available: 'Available',
  limited: 'Limited',
  unavailable: 'Unavailable',
  unknown: 'Unknown',
}

export function StatusChip({ status }) {
  return (
    <span className={`status-chip status-chip--${status}`}>
      <span className="status-chip__dot" />
      {STATUS_LABELS[status] || status}
    </span>
  )
}
