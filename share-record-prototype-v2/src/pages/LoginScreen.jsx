// Login screen — diagonal two-panel layout matching the reference design.
// No real auth: submitting proceeds to the recipient (shared record) view.
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './LoginScreen.css'

export default function LoginScreen() {
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const proceed = (e) => {
    if (e) e.preventDefault()
    navigate('/shared')
  }

  return (
    <div className="login">
      <div className="login__shape" />

      <div className="login__left">
        <div className="login__wordmark">
          <div className="login__wordmark-row">
            <span className="login__wordmark-thin">NFL</span>
            <span className="login__wordmark-accent">MEDICAL</span>
            <span className="login__bracket" />
          </div>
          <div className="login__wordmark-row login__wordmark-bold">PLAYER</div>
          <div className="login__wordmark-row">
            <span className="login__bracket login__bracket--left" />
            <span className="login__wordmark-bold">RECORDS</span>
          </div>
        </div>

        <div className="login__banner">Logged out successfully</div>

        <button type="button" className="login__okta">Login with Okta</button>

        <div className="login__divider">
          <span>or</span>
        </div>

        <form className="login__form" onSubmit={proceed}>
          <label className="login__label" htmlFor="login-username">Username</label>
          <input
            id="login-username"
            className="login__input"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="username"
          />

          <label className="login__label" htmlFor="login-password">Password</label>
          <input
            id="login-password"
            type="password"
            className="login__input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
          />

          <button type="submit" className="login__signin">Sign In</button>

          <div className="login__links">
            <a href="#forgot" onClick={(e) => e.preventDefault()}>Forgot password?</a>
            <a href="#resend" onClick={(e) => e.preventDefault()}>Resend confirmation email</a>
          </div>
        </form>

        <div className="login__footer">
          <span className="login__footer-bold">Kitman</span>
          <span className="login__footer-light">Labs</span>
        </div>
      </div>

      <div className="login__right">
        <img src="/assets/logos/nfl-logo.png" alt="NFL" className="login__crest" />
      </div>
    </div>
  )
}
