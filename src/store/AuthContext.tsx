import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react'
import { AUTH_LOGOUT_EVENT } from '@/api/client'
import { tokenStorage } from '@/lib/token'

interface AuthContextValue {
  isAuthenticated: boolean
  token: string | null
  login: (token: string) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() => tokenStorage.get())

  const login = useCallback((newToken: string) => {
    tokenStorage.set(newToken)
    setToken(newToken)
  }, [])

  const logout = useCallback(() => {
    tokenStorage.clear()
    setToken(null)
  }, [])

  useEffect(() => {
    const handleForcedLogout = () => setToken(null)
    window.addEventListener(AUTH_LOGOUT_EVENT, handleForcedLogout)
    return () =>
      window.removeEventListener(AUTH_LOGOUT_EVENT, handleForcedLogout)
  }, [])

  return (
    <AuthContext.Provider
      value={{ isAuthenticated: !!token, token, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
