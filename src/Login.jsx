import { useState } from 'react'
import { useAuth } from './AuthContext'

export default function Login() {
  const [codUsr, setCodUsr] = useState('')
  const [password, setPassword] = useState('')
  const { login, loading, error } = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!codUsr.trim() || !password.trim()) return
    try {
      await login(codUsr.trim(), password)
    } catch {
      // error ya se muestra via context
    }
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-header">
          <span className="logo-icon">🏗️</span>
          <h1 className="login-title">
            Leiten<span className="logo-accent">Ya</span>
          </h1>
          <p className="login-subtitle">Ingresá con tu cuenta de Leiten</p>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="login-field">
            <label htmlFor="codUsr">Usuario</label>
            <input
              id="codUsr"
              type="text"
              placeholder="Tu código de usuario"
              value={codUsr}
              onChange={(e) => setCodUsr(e.target.value)}
              autoComplete="username"
              autoFocus
              disabled={loading}
            />
          </div>

          <div className="login-field">
            <label htmlFor="password">Contraseña</label>
            <input
              id="password"
              type="password"
              placeholder="Tu contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              disabled={loading}
            />
          </div>

          {error && <div className="login-error">{error}</div>}

          <button
            className="login-btn"
            type="submit"
            disabled={loading || !codUsr.trim() || !password.trim()}
          >
            {loading ? 'Ingresando...' : 'Ingresar'}
          </button>
        </form>
      </div>
    </div>
  )
}
