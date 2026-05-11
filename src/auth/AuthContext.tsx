import { createContext, useContext, useState, type ReactNode } from 'react'

export type Role = 'STUDENT' | 'TEACHER'

export interface AuthSession {
  token: string
  role: Role
  userId: string
  name: string
}

interface AuthContextValue {
  session: AuthSession | null
  isLoggedIn: boolean
  isTeacher: boolean
  isStudent: boolean
  setSession: (s: AuthSession) => void
  logout: () => void
}

const STORAGE_KEY = 'auth_session'

function hydrateSession(): AuthSession | null {
  const raw = localStorage.getItem(STORAGE_KEY)
  if (!raw) {
    // Migration: if only the old bare token exists, remove it and force re-login
    if (localStorage.getItem('token')) {
      localStorage.removeItem('token')
    }
    return null
  }
  try {
    const parsed = JSON.parse(raw) as AuthSession
    if (
      typeof parsed?.token === 'string' &&
      (parsed.role === 'STUDENT' || parsed.role === 'TEACHER') &&
      typeof parsed.userId === 'string' &&
      typeof parsed.name === 'string'
    ) {
      // Mirror token for apiFetch compatibility
      localStorage.setItem('token', parsed.token)
      return parsed
    }
  } catch {
    /* ignore */
  }
  // Corrupt session → clear everything
  localStorage.removeItem(STORAGE_KEY)
  localStorage.removeItem('token')
  return null
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSessionState] = useState<AuthSession | null>(hydrateSession)

  function setSession(s: AuthSession) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(s))
    localStorage.setItem('token', s.token)
    setSessionState(s)
  }

  function logout() {
    localStorage.removeItem(STORAGE_KEY)
    localStorage.removeItem('token')
    setSessionState(null)
  }

  return (
    <AuthContext.Provider
      value={{
        session,
        isLoggedIn: session !== null,
        isTeacher: session?.role === 'TEACHER',
        isStudent: session?.role === 'STUDENT',
        setSession,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
