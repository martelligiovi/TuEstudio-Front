import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

type Role = 'student' | 'teacher'

export default function Register() {
  const navigate = useNavigate()
  const [role, setRole] = useState<Role>('student')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    navigate('/search')
  }

  return (
    <div className="bg-canvas min-h-screen text-body font-sans">
      <main className="flex min-h-screen">
        {/* Left: form */}
        <div className="w-full lg:w-1/2 flex flex-col px-6 md:px-12 lg:px-24 py-12 lg:py-16">
          {/* Brand */}
          <div className="flex items-center gap-2 mb-section">
            <span
              className="material-symbols-outlined text-primary text-3xl"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              menu_book
            </span>
            <span className="font-serif text-display-sm font-bold text-ink tracking-tight">TuEstudio.</span>
          </div>

          <div className="max-w-md w-full mx-auto lg:mx-0 flex-grow flex flex-col justify-center">
            <h1 className="font-serif text-display-xl text-ink mb-2">Comenzá tu camino en TuEstudio</h1>
            <p className="font-sans text-body-md text-muted mb-10">
              Unite a nuestra comunidad de aprendizaje. Contanos cómo planeás usar la plataforma.
            </p>

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Role cards */}
              <fieldset>
                <legend className="sr-only">Seleccioná tu perfil</legend>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {(
                    [
                      {
                        value: 'student' as Role,
                        icon: 'local_library',
                        title: 'Soy Estudiante',
                        desc: 'Busco clases y tutores para alcanzar mis metas.',
                      },
                      {
                        value: 'teacher' as Role,
                        icon: 'history_edu',
                        title: 'Soy Profesor',
                        desc: 'Quiero compartir mi conocimiento y enseñar.',
                      },
                    ] as const
                  ).map(({ value, icon, title, desc }) => {
                    const selected = role === value
                    return (
                      <label
                        key={value}
                        className={`group relative flex flex-col p-6 rounded-xl border cursor-pointer transition-all ${
                          selected
                            ? 'border-primary bg-surface-card'
                            : 'border-hairline bg-surface-card hover:bg-surface-soft hover:border-outline'
                        }`}
                      >
                        <input
                          type="radio"
                          name="account_type"
                          value={value}
                          checked={selected}
                          onChange={() => setRole(value)}
                          className="sr-only"
                        />
                        {/* Custom radio dot */}
                        <div
                          className={`absolute top-5 right-5 w-5 h-5 rounded-full border transition-all bg-canvas ${
                            selected ? 'border-[6px] border-primary' : 'border-outline'
                          }`}
                        />
                        <div className="w-12 h-12 rounded-full bg-surface-dim flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                          <span className="material-symbols-outlined text-primary text-2xl">{icon}</span>
                        </div>
                        <span className="font-sans text-title-md text-ink mb-1 block">{title}</span>
                        <span className="font-sans text-body-sm text-muted block">{desc}</span>
                      </label>
                    )
                  })}
                </div>
              </fieldset>

              <div className="h-px w-full bg-hairline my-6" />

              {/* Fields */}
              <div className="space-y-5">
                <div className="flex flex-col gap-2">
                  <label htmlFor="name" className="font-sans text-title-sm text-ink">
                    Nombre completo
                  </label>
                  <input
                    id="name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ej. Ana García"
                    className="h-[44px] px-3 rounded-md border border-hairline bg-canvas focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 font-sans text-body-md text-ink transition-all placeholder:text-muted/50"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="email" className="font-sans text-title-sm text-ink">
                    Correo electrónico
                  </label>
                  <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="tu@correo.com"
                    className="h-[44px] px-3 rounded-md border border-hairline bg-canvas focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 font-sans text-body-md text-ink transition-all placeholder:text-muted/50"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="password" className="font-sans text-title-sm text-ink">
                    Contraseña
                  </label>
                  <input
                    id="password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Mínimo 8 caracteres"
                    className="h-[44px] px-3 rounded-md border border-hairline bg-canvas focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 font-sans text-body-md text-ink transition-all placeholder:text-muted/50"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full h-[48px] bg-primary hover:bg-primary-active text-on-primary font-sans text-button rounded-md transition-colors"
                >
                  Crear cuenta
                </button>
              </div>
            </form>

            <p className="font-sans text-body-sm text-center text-muted mt-8">
              ¿Ya tenés una cuenta?{' '}
              <Link
                to="/login"
                className="text-primary hover:text-primary-active underline underline-offset-4 decoration-primary/30 hover:decoration-primary transition-all font-medium ml-1"
              >
                Iniciar sesión
              </Link>
            </p>
          </div>
        </div>

        {/* Right: editorial visual */}
        <div className="hidden lg:block lg:w-1/2 relative bg-surface-dim overflow-hidden">
          <img
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAwV09vl4Q1dYOTF3G7jpwSTZAemL1d1NxIW3tZ8azJI9ogAKi9zuBwkmQTK-2Ws_fchsaOS_u1D-e88ALTW3FuiPOe09_sekGoAYnEfyAB78YDjyMsPbdXgG9zX7sjnaprPuDOdQge1Y273YscgrG7vi7L6RvjR3WlXsO4MjK1lI5HeJvq_dpa5uTJ6nN2h4dYRcYdBMa3K9nQMye6g_fWYXED_QU1QAEcge8-i-6iSskWtqhp_vVXtbEgNkIM19694c_qjcASWA"
            alt="Study setting"
            className="absolute inset-0 w-full h-full object-cover opacity-90 mix-blend-multiply"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-canvas via-transparent to-transparent opacity-40 pointer-events-none" />
        </div>
      </main>
    </div>
  )
}
