import { createContext, useContext, useState, type ReactNode } from 'react'

interface AuthContextValue {
  token: string | null
  isLoggedIn: boolean
  setToken: (token: string) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setTokenState] = useState<string | null>(() => localStorage.getItem('token'))

  function setToken(t: string) {
    localStorage.setItem('token', t)
    setTokenState(t)
  }

  function logout() {
    localStorage.removeItem('token')
    setTokenState(null)
  }

  return (
    <AuthContext.Provider value={{ token, isLoggedIn: !!token, setToken, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
