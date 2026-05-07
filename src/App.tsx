import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { type ReactNode } from 'react'
import { AuthProvider, useAuth } from './auth/AuthContext'
import Landing from './pages/Landing'
import Search from './pages/Search'
import AuthPage from './pages/AuthPage'
import TutorProfile from './pages/TutorProfile'
import Confirmed from './pages/Confirmed'

function GuestRoute({ children }: { children: ReactNode }) {
  const { isLoggedIn } = useAuth()
  return isLoggedIn ? <Navigate to="/search" replace /> : <>{children}</>
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
