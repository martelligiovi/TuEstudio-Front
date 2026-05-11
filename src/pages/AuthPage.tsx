import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import logo from '../assets/logo.png'
import hero from '../assets/hero.png'
import { login as apiLogin, register as apiRegister, initiateOAuth, initiateOAuthLogin } from '../api/auth'
import { useAuth } from '../auth/AuthContext'

type Mode = 'login' | 'register'
type Role = 'student' | 'teacher'

export default function AuthPage() {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const { setSession } = useAuth()
  const [mode, setMode] = useState<Mode>(pathname === '/register' ? 'register' : 'login')

  useEffect(() => {
    setMode(pathname === '/register' ? 'register' : 'login')
  }, [pathname])

  function switchTo(next: Mode) {
    navigate(next === 'login' ? '/login' : '/register')
  }

  // Login state
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loginLoading, setLoginLoading] = useState(false)
  const [loginError, setLoginError] = useState<string | null>(null)

  // Register state
  const [role, setRole] = useState<Role | null>(null)
  const [name, setName] = useState('')
  const [regEmail, setRegEmail] = useState('')
  const [regPassword, setRegPassword] = useState('')
  const [registerLoading, setRegisterLoading] = useState(false)
  const [registerError, setRegisterError] = useState<string | null>(null)

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoginLoading(true)
    setLoginError(null)
    try {
      const res = await apiLogin(email, password)
      setSession({ token: res.token, role: res.role, userId: res.userId, name: res.name })
      navigate(res.role === 'TEACHER' ? '/dashboard' : '/search')
    } catch {
      setLoginError('Email o contraseña incorrectos.')
    } finally {
      setLoginLoading(false)
    }
  }

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault()
    if (!role) return
    setRegisterLoading(true)
    setRegisterError(null)
    try {
      const res = await apiRegister(name, regEmail, regPassword, role === 'student' ? 'STUDENT' : 'TEACHER')
      setSession({ token: res.token, role: res.role, userId: res.userId, name: res.name })
      navigate(res.role === 'TEACHER' ? '/dashboard' : '/search')
    } catch {
      setRegisterError('No se pudo crear la cuenta. Verificá que el email no esté en uso.')
    } finally {
      setRegisterLoading(false)
    }
  }

  /*
    Strip layout (200vw wide):
    ┌─────────────────────────┬─────────────────────────┐
    │   LOGIN (100vw)         │   REGISTER (100vw)       │
    │  [image 50vw|form 50vw] │  [form 50vw|image 50vw]  │
    └─────────────────────────┴─────────────────────────┘

    translateX(0)    → Login visible
    translateX(-50%) → Register visible

    Register→Login: strip desliza a la DERECHA (translateX -50% → 0)
    El form blanco del register se va hacia la derecha, aparece el login.
  */
  const translateX = mode === 'login' ? '0%' : '-50%'

  return (
    <div className="h-screen w-screen overflow-hidden font-sans">
      <div
        className="flex h-full"
        style={{
          width: '200%',
          transform: `translateX(${translateX})`,
          transition: 'transform 0.55s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >

        {/* ══════════════════════════════════════
            PANEL IZQUIERDO — LOGIN
            [imagen left | form right]
        ══════════════════════════════════════ */}
        <div className="flex h-full" style={{ width: '50%' }}>

          {/* Imagen editorial */}
          <div className="hidden md:block md:w-1/2 relative bg-surface-dark">
            <img
              src={hero}
              alt="Editorial"
              className="absolute inset-0 w-full h-full object-cover opacity-90"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-surface-dark/80 to-transparent" />
            <div className="absolute bottom-12 left-10 right-10">
              <p className="font-serif text-display-sm text-on-dark mb-3 leading-snug">
                "Un santuario para el pensamiento reflexivo y el estudio deliberado."
              </p>
              <p className="font-sans text-body-sm text-on-dark-soft">La Colección Editorial</p>
            </div>
          </div>

          {/* Formulario login */}
          <div
            className="w-full md:w-1/2 flex items-center justify-center px-10 py-10 bg-canvas"
          >
            <div className="w-full max-w-sm">
              <div className="mb-5 flex items-center gap-2">
                <img src={logo} alt="" className="h-8 w-auto" />
                <span className="font-serif italic text-2xl font-bold text-primary">TuEstudio</span>
              </div>

              <h1 className="font-serif text-display-md text-ink mb-1">Bienvenido de vuelta</h1>
              <p className="font-sans text-body-md text-muted mb-8">Ingresá tus datos para continuar.</p>

              <form onSubmit={handleLogin} className="space-y-5">
                <div>
                  <label htmlFor="login-email" className="block font-sans text-caption text-body-strong mb-1.5">
                    Email
                  </label>
                  <input
                    id="login-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="tu@correo.com"
                    className="w-full bg-surface-soft border border-hairline rounded-md px-4 h-[44px] font-sans text-body-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                  />
                </div>
                <div>
                  <label htmlFor="login-password" className="block font-sans text-caption text-body-strong mb-1.5">
                    Contraseña
                  </label>
                  <input
                    id="login-password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-surface-soft border border-hairline rounded-md px-4 h-[44px] font-sans text-body-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="h-4 w-4 text-primary border-hairline rounded" />
                    <span className="font-sans text-caption text-muted">Recordarme</span>
                  </label>
                  <a href="#" className="font-sans text-caption text-primary hover:text-primary-active transition-colors">
                    ¿Olvidaste la contraseña?
                  </a>
                </div>

                {loginError && (
                  <p className="font-sans text-body-sm text-error">{loginError}</p>
                )}

                <button
                  type="submit"
                  disabled={loginLoading}
                  className="w-full h-[44px] bg-primary hover:bg-primary-active text-on-primary font-sans text-button rounded-md transition-colors disabled:opacity-60"
                >
                  {loginLoading ? 'Ingresando...' : 'Iniciar sesión'}
                </button>
              </form>

              <div className="mt-6">
                <div className="relative mb-5">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-hairline" />
                  </div>
                  <div className="relative flex justify-center">
                    <span className="px-3 bg-canvas font-sans text-caption text-muted">O continuá con</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => initiateOAuthLogin('google')}
                  className="w-full flex justify-center items-center h-[40px] border border-hairline rounded-md bg-surface-soft hover:bg-surface-cream-strong transition-colors font-sans text-button gap-2"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                  </svg>
                  Google
                </button>
              </div>

              <p className="mt-6 text-center font-sans text-caption text-muted">
                ¿No tenés una cuenta?{' '}
                <button
                  onClick={() => switchTo('register')}
                  className="font-medium text-primary hover:text-primary-active transition-colors underline underline-offset-2"
                >
                  Registrate gratis
                </button>
              </p>
            </div>
          </div>
        </div>

        {/* ══════════════════════════════════════
            PANEL DERECHO — REGISTER
            [form left | imagen right]
        ══════════════════════════════════════ */}
        <div className="flex h-full" style={{ width: '50%' }}>

          {/* Formulario register */}
          <div
            className="w-full md:w-1/2 flex items-center justify-center px-10 py-10 bg-canvas"
          >
            <div className="w-full max-w-sm">
              <div className="mb-6 flex items-center gap-2">
                <img src={logo} alt="" className="h-8 w-auto" />
                <span className="font-serif italic text-2xl font-bold text-primary">TuEstudio</span>
              </div>

              <h1 className="font-serif text-display-sm text-ink mb-1">Comenzá tu camino</h1>
              <p className="font-sans text-body-sm text-muted mb-6">
                Contanos cómo planeás usar la plataforma.
              </p>

              <form onSubmit={handleRegister} className="space-y-4">
                {/* Role cards */}
                <div className="grid grid-cols-2 gap-3">
                  {(
                    [
                      { value: 'student' as Role, icon: 'local_library', title: 'Estudiante', desc: 'Busco tutores' },
                      { value: 'teacher' as Role, icon: 'history_edu', title: 'Profesor', desc: 'Quiero enseñar' },
                    ] as const
                  ).map(({ value, icon, title, desc }) => {
                    const selected = role === value
                    return (
                      <label
                        key={value}
                        className={`relative flex flex-col items-start p-4 rounded-lg border cursor-pointer transition-all ${
                          selected
                            ? 'border-primary bg-primary/5'
                            : 'border-hairline bg-surface-card hover:bg-surface-soft hover:border-outline'
                        }`}
                      >
                        <input
                          type="radio"
                          name="role"
                          value={value}
                          checked={selected}
                          onChange={() => setRole(value)}
                          className="sr-only"
                        />
                        <div
                          className={`absolute top-3 right-3 w-4 h-4 rounded-full border transition-all bg-canvas ${
                            selected ? 'border-[5px] border-primary' : 'border-outline'
                          }`}
                        />
                        <span className="material-symbols-outlined text-primary text-[22px] mb-2">{icon}</span>
                        <span className="font-sans text-title-sm text-ink">{title}</span>
                        <span className="font-sans text-caption text-muted mt-0.5">{desc}</span>
                      </label>
                    )
                  })}
                </div>

                <div>
                  <label htmlFor="reg-name" className="block font-sans text-caption text-body-strong mb-1.5">
                    Nombre completo
                  </label>
                  <input
                    id="reg-name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ej. Ana García"
                    className="w-full bg-canvas border border-hairline rounded-md px-3 h-[40px] font-sans text-body-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors placeholder:text-muted/50"
                  />
                </div>
                <div>
                  <label htmlFor="reg-email" className="block font-sans text-caption text-body-strong mb-1.5">
                    Correo electrónico
                  </label>
                  <input
                    id="reg-email"
                    type="email"
                    required
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder="tu@correo.com"
                    className="w-full bg-canvas border border-hairline rounded-md px-3 h-[40px] font-sans text-body-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors placeholder:text-muted/50"
                  />
                </div>
                <div>
                  <label htmlFor="reg-password" className="block font-sans text-caption text-body-strong mb-1.5">
                    Contraseña
                  </label>
                  <input
                    id="reg-password"
                    type="password"
                    required
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    placeholder="Mínimo 8 caracteres"
                    className="w-full bg-canvas border border-hairline rounded-md px-3 h-[40px] font-sans text-body-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors placeholder:text-muted/50"
                  />
                </div>

                {registerError && (
                  <p className="font-sans text-body-sm text-error">{registerError}</p>
                )}

                <button
                  type="submit"
                  disabled={registerLoading || !role}
                  className="w-full h-[44px] bg-primary hover:bg-primary-active text-on-primary font-sans text-button rounded-md transition-colors disabled:opacity-60"
                >
                  {registerLoading ? 'Creando cuenta...' : 'Crear cuenta'}
                </button>
              </form>

              {/* Social — bloqueados hasta elegir rol */}
              <div className="mt-5">
                <div className="relative mb-4">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-hairline" />
                  </div>
                  <div className="relative flex justify-center">
                    <span className="px-3 bg-canvas font-sans text-caption text-muted">O registrate con</span>
                  </div>
                </div>
                <button
                  type="button"
                  disabled={!role}
                  title={!role ? 'Seleccioná tu perfil primero' : undefined}
                  onClick={() => role && initiateOAuth('google', role === 'student' ? 'STUDENT' : 'TEACHER')}
                  className={`w-full flex justify-center items-center h-[40px] border border-hairline rounded-md bg-surface-soft font-sans text-button gap-2 disabled:cursor-not-allowed hover:bg-surface-cream-strong transition-colors transition-opacity duration-200 ${!role ? 'opacity-40 pointer-events-none' : ''}`}
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                  </svg>
                  Google
                </button>
              </div>

              <p className="mt-4 text-center font-sans text-caption text-muted">
                ¿Ya tenés una cuenta?{' '}
                <button
                  onClick={() => switchTo('login')}
                  className="font-medium text-primary hover:text-primary-active transition-colors underline underline-offset-2"
                >
                  Iniciar sesión
                </button>
              </p>
            </div>
          </div>

          {/* Imagen editorial */}
          <div className="hidden md:block md:w-1/2 relative bg-surface-dim">
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAwV09vl4Q1dYOTF3G7jpwSTZAemL1d1NxIW3tZ8azJI9ogAKi9zuBwkmQTK-2Ws_fchsaOS_u1D-e88ALTW3FuiPOe09_sekGoAYnEfyAB78YDjyMsPbdXgG9zX7sjnaprPuDOdQge1Y273YscgrG7vi7L6RvjR3WlXsO4MjK1lI5HeJvq_dpa5uTJ6nN2h4dYRcYdBMa3K9nQMye6g_fWYXED_QU1QAEcge8-i-6iSskWtqhp_vVXtbEgNkIM19694c_qjcASWA"
              alt="Study setting"
              className="absolute inset-0 w-full h-full object-cover opacity-90 mix-blend-multiply"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-canvas/40 via-transparent to-transparent pointer-events-none" />
          </div>
        </div>

      </div>
    </div>
  )
}
