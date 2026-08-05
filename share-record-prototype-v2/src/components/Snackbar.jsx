// Global snackbar, pinned to the top-right. Reads message from ShareContext and
// auto-dismisses. Used to confirm "Record shared" after the share action.
import { useEffect } from 'react'
import { useShare } from '../context/ShareContext'
import './Snackbar.css'

export default function Snackbar() {
  const { snackbar, hideSnackbar } = useShare()

  useEffect(() => {
    if (!snackbar) return undefined
    const t = setTimeout(hideSnackbar, 5000)
    return () => clearTimeout(t)
  }, [snackbar, hideSnackbar])

  if (!snackbar) return null

  return (
    <div className="snackbar" role="status" aria-live="polite">
      <span className="material-icons-outlined snackbar__icon">check_circle</span>
      <span className="snackbar__msg">{snackbar}</span>
    </div>
  )
}
