import { Link, NavLink, useNavigate } from 'react-router-dom'
import logo from '../assets/logo.png'
import { useAuth } from '../auth/AuthContext'

export default function Header() {
  const navigate = useNavigate()
  const { isLoggedIn, isTeacher, session, logout } = useAuth()

  function handleLogout() {
    logout()
    navigate('/')
  }

  const tabBase =
    'font-sans text-button transition-colors duration-200 pb-1 border-b-2'
  const tabActive = 'text-ink border-primary'
  const tabIdle = 'text-muted border-transparent hover:text-ink'

  return (
    <header className="bg-[#fdfbf7] border-b border-hairline sticky top-0 z-40 hidden md:block">
      <div className="flex justify-between items-center w-full px-6 py-4 max-w-content mx-auto">
        <Link to="/" className="flex items-center gap-2">
          <img src={logo} alt="" className="h-8 w-auto" />
          <span className="font-serif italic text-2xl font-bold text-primary">TuEstudio</span>
        </Link>

        {isTeacher && session && (
          <nav className="flex items-center gap-6">
            <NavLink
              to="/dashboard"
              end
              className={({ isActive }) => `${tabBase} ${isActive ? tabActive : tabIdle}`}
            >
              Solicitudes
            </NavLink>
            <NavLink
              to="/profile"
              className={({ isActive }) => `${tabBase} ${isActive ? tabActive : tabIdle}`}
            >
              Mi perfil
            </NavLink>
          </nav>
        )}

        <div className="flex items-center gap-4">
          {isLoggedIn ? (
            <button
              onClick={handleLogout}
              className="border border-hairline text-muted font-sans text-button h-[40px] px-4 rounded-md hover:bg-surface-soft hover:text-ink transition-colors duration-200"
            >
              Cerrar sesión
            </button>
          ) : (
            <>
              <button
                onClick={() => navigate('/register')}
                className="border border-primary text-primary font-sans text-button h-[40px] px-4 rounded-md hover:bg-primary/5 transition-colors duration-200"
              >
                Registrarse
              </button>
              <button
                onClick={() => navigate('/login')}
                className="bg-primary text-on-primary font-sans text-button h-[40px] px-4 rounded-md hover:bg-primary-active transition-colors duration-200"
              >
                Iniciar sesión
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
