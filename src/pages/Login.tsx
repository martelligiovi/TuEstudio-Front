import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { login } from '../api/auth'

export default function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const res = await login(email, password)
      localStorage.setItem('token', res.token)
      navigate('/search')
    } catch {
      setError('Email o contraseña incorrectos.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-canvas text-body flex flex-col min-h-screen font-sans">
      <main className="flex-grow flex items-stretch">
        <div className="flex w-full min-h-screen">
          {/* Left: editorial image */}
          <div className="hidden md:block w-1/2 relative bg-surface-dark">
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBLaQ9m5XzPb8-mOqYjdeDQPy_YN5xtG3ovmHqFSqEFho6lCuLdsGLsUlg81yWUHLmMCcUAgHJFsVN1LnEoB_M6XcP0MJqQvBxlxHNqQyBf8m6-1DMMK7rXfHGPh3A8VzXCxw5MxJkR5mTFcG_VmhW2xqBr8RNPiRLmhqFKCckzCBZxhgU1x2LGr0U_yAhJrC9P2A-S6Z3kHESmHdCbhsrJ87-R3U0DtPGMaAnDHwEfnHaxIRSXmZaQr-ZD_kJVCQwrGU3dg"
              alt="Editorial book"
              className="absolute inset-0 w-full h-full object-cover opacity-90"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-surface-dark/80 to-transparent" />
            <div className="absolute bottom-12 left-12 right-12">
              <p className="font-serif text-display-md text-on-dark mb-4 max-w-md">
                "Un santuario para el pensamiento reflexivo y el estudio deliberado."
              </p>
              <p className="font-sans text-body-md text-on-dark-soft">La Colección Editorial</p>
            </div>
          </div>

          {/* Right: login form */}
          <div className="w-full md:w-1/2 flex items-center justify-center p-8 bg-canvas">
            <div className="w-full max-w-md">
              <div className="mb-12">
                <span className="font-serif italic text-2xl font-bold text-primary">TuEstudio</span>
              </div>
              <div className="mb-8">
                <h1 className="font-serif text-display-md text-ink mb-2">Bienvenido de vuelta</h1>
                <p className="font-sans text-body-md text-muted">Ingresá tus datos para continuar.</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <label htmlFor="email" className="block font-sans text-caption text-body-strong mb-2">
                      Email
                    </label>
                    <input
                      id="email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="tu@correo.com"
                      className="w-full bg-surface-soft border border-hairline rounded px-4 py-3 font-sans text-body-md focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                    />
                  </div>
                  <div>
                    <label htmlFor="password" className="block font-sans text-caption text-body-strong mb-2">
                      Contraseña
                    </label>
                    <input
                      id="password"
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-surface-soft border border-hairline rounded px-4 py-3 font-sans text-body-md focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 font-sans text-caption text-muted cursor-pointer">
                    <input
                      type="checkbox"
                      className="h-4 w-4 text-primary bg-surface-soft border-hairline rounded focus:ring-primary"
                    />
                    Recordarme
                  </label>
                  <a href="#" className="font-sans text-caption text-primary hover:text-primary-active transition-colors">
                    ¿Olvidaste la contraseña?
                  </a>
                </div>

                {error && (
                  <p className="font-sans text-body-sm text-error">{error}</p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center py-3 px-4 rounded font-sans text-button text-on-primary bg-primary hover:bg-primary-active focus:outline-none transition-colors disabled:opacity-60"
                >
                  {loading ? 'Ingresando...' : 'Iniciar sesión'}
                </button>
              </form>

              {/* Social divider */}
              <div className="mt-8">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-hairline" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-canvas font-sans text-caption text-muted">O continuá con</span>
                  </div>
                </div>
                <div className="mt-6">
                  <button className="w-full flex justify-center items-center py-2 px-4 border border-hairline rounded bg-surface-soft hover:bg-surface-cream-strong transition-colors font-sans text-button text-body-strong">
                    <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                    </svg>
                    Google
                  </button>
                </div>
              </div>

              <p className="mt-8 text-center font-sans text-caption text-muted">
                ¿No tenés una cuenta?{' '}
                <Link to="/register" className="font-medium text-primary hover:text-primary-active transition-colors">
                  Registrate gratis
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
