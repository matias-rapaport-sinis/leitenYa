import { createContext, useContext, useState, useCallback } from 'react'
import { loginFromAPP } from './api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [sessionId, setSessionId] = useState(null)
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const login = useCallback(async (codUsr, password) => {
    setLoading(true)
    setError(null)
    try {
      const data = await loginFromAPP(codUsr, password)
      setSessionId(data.session_id)
      setUser({ codUsr })
      return data
    } catch (err) {
      setError(err.message || 'Error al iniciar sesión')
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const logout = useCallback(() => {
    setSessionId(null)
    setUser(null)
    setError(null)
  }, [])

  return (
    <AuthContext.Provider value={{ sessionId, user, loading, error, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth debe usarse dentro de AuthProvider')
  return ctx
}
