import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Landing from './pages/Landing'
import Search from './pages/Search'
import Login from './pages/Login'
import Register from './pages/Register'
import TutorProfile from './pages/TutorProfile'
import Confirmed from './pages/Confirmed'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/search" element={<Search />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/tutor/:id" element={<TutorProfile />} />
        <Route path="/confirmed" element={<Confirmed />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
