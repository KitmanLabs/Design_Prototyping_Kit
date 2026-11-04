import { useCallback, useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Toasts } from '../playbook-components'

let nextToastId = 1

/**
 * Toast feedback for a page, through the Playbook Toasts. Every completed action shows one.
 *
 *   const { showToast, toasts } = useToasts()
 *   showToast({ title: 'Athlete added' })
 *   return <PageFrame ...>...{toasts}</PageFrame>
 *
 * status is success (the default), info, warning or error.
 */
export default function useToasts() {
  const [items, setItems] = useState([])

  const closeToast = useCallback((id) => {
    setItems((current) => current.filter((toast) => toast.id !== id))
  }, [])

  const showToast = useCallback((toast) => {
    const id = nextToastId++
    setItems((current) => [...current, { status: 'success', ...toast, id }])
    return id
  }, [])

  const toasts = useMemo(
    () => <Toasts toasts={items} onCloseToast={closeToast} />,
    [items, closeToast]
  )

  return { showToast, closeToast, toasts }
}

/**
 * Shows a toast passed through navigation, for actions that finish on another page:
 *   navigate('/athletes/2', { state: { toast: 'Injury logged for Elena Rodriguez' } })
 * The page that receives it calls useNavigationToast(showToast). The state is cleared
 * afterwards, so the toast doesn't come back on refresh.
 */
export function useNavigationToast(showToast) {
  const location = useLocation()
  const navigate = useNavigate()
  const message = location.state?.toast

  useEffect(() => {
    if (!message) return
    showToast({ title: message })
    const { toast: _shown, ...rest } = location.state
    navigate(location.pathname + location.search, { replace: true, state: Object.keys(rest).length ? rest : null })
  }, [message]) // eslint-disable-line react-hooks/exhaustive-deps
}
