import { useCallback, useMemo, useState } from 'react'
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
