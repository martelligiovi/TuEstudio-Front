import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Landing from './pages/Landing'
import Search from './pages/Search'
import AuthPage from './pages/AuthPage'
import TutorProfile from './pages/TutorProfile'
import Confirmed from './pages/Confirmed'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/search" element={<Search />} />
        <Route path="/login" element={<AuthPage />} />
        <Route path="/register" element={<AuthPage />} />
        <Route path="/tutor/:id" element={<TutorProfile />} />
        <Route path="/confirmed" element={<Confirmed />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
