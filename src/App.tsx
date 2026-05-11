import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { type ReactNode } from 'react'
import { AuthProvider, useAuth } from './auth/AuthContext'
import Landing from './pages/Landing'
import Search from './pages/Search'
import AuthPage from './pages/AuthPage'
import TutorProfile from './pages/TutorProfile'
import Confirmed from './pages/Confirmed'
import OAuthCallback from './pages/OAuthCallback'
import OAuthError from './pages/OAuthError'
import TeacherDashboard from './pages/TeacherDashboard'

function GuestRoute({ children }: { children: ReactNode }) {
  const { isLoggedIn, isTeacher } = useAuth()
  if (isLoggedIn) {
    return <Navigate to={isTeacher ? '/dashboard' : '/search'} replace />
  }
  return <>{children}</>
}

function TeacherRoute({ children }: { children: ReactNode }) {
  const { isLoggedIn, isTeacher } = useAuth()
  if (!isLoggedIn) return <Navigate to="/login" replace />
  if (!isTeacher) return <Navigate to="/search" replace />
  return <>{children}</>
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/search" element={<Search />} />
      <Route
        path="/login"
        element={
          <GuestRoute>
            <AuthPage />
          </GuestRoute>
        }
      />
      <Route
        path="/register"
        element={
          <GuestRoute>
            <AuthPage />
          </GuestRoute>
        }
      />
      <Route path="/tutor/:id" element={<TutorProfile />} />
      <Route path="/confirmed" element={<Confirmed />} />
      <Route path="/oauth2/callback" element={<OAuthCallback />} />
      <Route path="/oauth2/error" element={<OAuthError />} />
      <Route
        path="/dashboard"
        element={
          <TeacherRoute>
            <TeacherDashboard />
          </TeacherRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  )
}
