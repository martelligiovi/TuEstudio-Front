import { useState, useEffect } from 'react'
import { useParams, useSearchParams, Link } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'
import MobileNav from '../components/MobileNav'
import { getTutor, contactTutor } from '../api/tutors'
import type { TutorProfile as TutorProfileData } from '../api/types'

export default function TutorProfile() {
  const { id } = useParams<{ id: string }>()
  const [searchParams] = useSearchParams()

  const [tutor, setTutor] = useState<TutorProfileData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [nombre, setNombre] = useState('')
  const [telefono, setTelefono] = useState('')
  const [universidad, setUniversidad] = useState(searchParams.get('universidad') ?? '')
  const [carrera, setCarrera] = useState(searchParams.get('carrera') ?? '')
  const [materia, setMateria] = useState(searchParams.get('materia') ?? '')
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return
    setLoading(true)
    getTutor(id)
      .then(setTutor)
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false))
  }, [id])

  async function handleContact(e: React.FormEvent) {
    e.preventDefault()
    if (!id || !tutor?.phoneNumber) {
      setSubmitError('El tutor no tiene número de contacto disponible.')
      return
    }
    setSubmitting(true)
    setSubmitError(null)
    try {
      await contactTutor(id, {
        nombre,
        telefono,
        universidad: universidad || undefined,
        carrera: carrera || undefined,
        materia: materia || undefined,
      })
    } catch {
      // no bloqueamos la apertura de WhatsApp si falla el registro
    }

    const lines = [
      `Hola ${tutor.name}, te contacto desde TuEstudio.`,
      `Mi nombre es ${nombre}.`,
      materia ? `Estoy buscando clases de *${materia}*.` : '',
      carrera ? `Carrera: ${carrera}.` : '',
      universidad ? `Universidad: ${universidad}.` : '',
      `Mi teléfono es ${telefono}.`,
      `¿Podríamos coordinar una sesión?`,
    ].filter(Boolean).join('\n')

    window.open(`https://wa.me/${tutor.phoneNumber.replace(/\D/g, '')}?text=${encodeURIComponent(lines)}`, '_blank')
    setSubmitting(false)
  }

  if (loading) {
    return (
      <div className="bg-canvas min-h-screen flex flex-col font-sans">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <span className="material-symbols-outlined text-[48px] text-muted animate-spin">progress_activity</span>
        </main>
        <Footer />
      </div>
    )
  }

  if (error || !tutor) {
    return (
      <div className="bg-canvas min-h-screen flex flex-col font-sans">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <p className="font-serif text-display-md text-ink mb-4">Tutor no encontrado</p>
            <Link to="/search" className="text-primary hover:text-primary-active font-sans text-button">
              ← Volver a la búsqueda
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="bg-canvas text-ink min-h-screen flex flex-col font-sans">
      <Header />

      <main className="flex-grow w-full max-w-content mx-auto px-6 py-8 pb-section">
        <Link
          to="/search"
          className="inline-flex items-center gap-1 text-muted hover:text-primary font-sans text-body-sm mb-8 transition-colors"
        >
          <span className="material-symbols-outlined text-[18px]">arrow_back</span>
          Volver a resultados
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* ── LEFT COLUMN ─────────────────────── */}
          <div className="lg:col-span-2 flex flex-col gap-8">

            {/* Hero */}
            <div className="flex flex-col sm:flex-row gap-6 items-start">
              <img
                src={tutor.photoUrl}
                alt={tutor.name}
                className="w-20 h-20 rounded-full object-cover border border-hairline shrink-0"
              />
              <div className="flex-1">
                <h1 className="font-serif text-display-md text-ink leading-tight mb-1">{tutor.name}</h1>
                <p className="font-sans text-title-sm text-muted mb-3">{tutor.subjectSpecialty}</p>
                <div className="flex flex-wrap items-center gap-4">
                  <div className="flex items-center gap-1">
                    <span
                      className="material-symbols-outlined text-[16px] text-accent-amber"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      star
                    </span>
                    <span className="font-sans text-body-sm text-ink font-medium">{tutor.rating}</span>
                    <span className="font-sans text-body-sm text-muted">({tutor.reviewsCount} reseñas)</span>
                  </div>
                  <div className="flex items-center gap-1 text-muted">
                    <span className="material-symbols-outlined text-[16px]">location_on</span>
                    <span className="font-sans text-body-sm">
                      {tutor.location}, {tutor.modalidad}
                    </span>
                  </div>
                </div>
                <p className="font-sans text-body-sm text-body mt-4 max-w-prose leading-relaxed">
                  {tutor.bio}
                </p>
              </div>
            </div>

            {/* Dark cards: Materias + Metodología */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Materias */}
              <div className="bg-surface-dark rounded-lg p-xl flex flex-col gap-5">
                <div className="flex items-center gap-2 mb-1">
                  <span className="material-symbols-outlined text-[20px] text-on-dark">menu_book</span>
                  <h2 className="font-sans text-title-sm text-on-dark">Materias</h2>
                </div>
                {tutor.subjects.map((m) => (
                  <div key={m.name} className="flex items-start gap-3">
                    <span className="material-symbols-outlined text-[18px] text-on-dark-soft mt-0.5 shrink-0">
                      {m.icon}
                    </span>
                    <div>
                      <p className="font-sans text-title-sm text-on-dark leading-snug">{m.name}</p>
                      <p className="font-sans text-body-sm text-on-dark-soft mt-0.5">{m.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Metodología */}
              <div className="bg-surface-dark rounded-lg p-xl flex flex-col gap-5">
                <div className="flex items-center gap-2 mb-1">
                  <span className="material-symbols-outlined text-[20px] text-on-dark">lightbulb</span>
                  <h2 className="font-sans text-title-sm text-on-dark">Metodología</h2>
                </div>
                <p className="font-sans text-body-sm text-on-dark-soft leading-relaxed">
                  {tutor.methodology.intro}
                </p>
                <div className="border-t border-surface-dark-elevated pt-4 flex flex-col gap-2">
                  {tutor.methodology.features.map((f) => (
                    <div key={f.label} className="flex items-center justify-between">
                      <span className="font-sans text-body-sm text-on-dark-soft">{f.label}</span>
                      <span
                        className={`font-sans text-caption font-medium ${
                          f.value ? 'text-accent-teal' : 'text-on-dark-soft opacity-40'
                        }`}
                      >
                        {f.value ? 'Sí' : 'No'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Disponibilidad y Tarifas */}
            <div>
              <h2 className="font-serif text-display-sm text-ink mb-6">Disponibilidad y Tarifas</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Horarios */}
                <div className="bg-surface-card rounded-lg p-xl border border-hairline flex flex-col gap-4">
                  <div className="flex items-center gap-2 border-b border-hairline pb-sm">
                    <span className="material-symbols-outlined text-[20px] text-primary">schedule</span>
                    <h3 className="font-sans text-title-sm text-ink">Horarios Habituales</h3>
                  </div>
                  <div className="flex flex-col gap-3">
                    {tutor.schedules.map((h) => (
                      <div key={h.days} className="flex items-start justify-between gap-4">
                        <span className="font-sans text-body-sm text-muted">{h.days}</span>
                        <span className="font-sans text-body-sm text-ink font-medium text-right">{h.hours}</span>
                      </div>
                    ))}
                  </div>
                  <p className="font-sans text-caption text-muted-soft mt-1">{tutor.schedulesNote}</p>
                </div>

                {/* Planes */}
                <div className="bg-surface-card rounded-lg p-xl border border-hairline flex flex-col gap-4">
                  <div className="flex items-center gap-2 border-b border-hairline pb-sm">
                    <span className="material-symbols-outlined text-[20px] text-primary">payments</span>
                    <h3 className="font-sans text-title-sm text-ink">Planes de Estudio</h3>
                  </div>
                  <div className="flex flex-col gap-4">
                    {tutor.plans.map((p) => (
                      <div
                        key={p.name}
                        className={`flex items-center justify-between gap-3 rounded-md px-md py-sm ${
                          p.featured ? 'bg-surface-cream-strong' : 'bg-canvas border border-hairline'
                        }`}
                      >
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-sans text-title-sm text-ink">{p.name}</span>
                            {p.badge && (
                              <span
                                className={`font-sans text-caption-uppercase px-2 py-0.5 rounded-full whitespace-nowrap ${
                                  p.featured
                                    ? 'bg-primary text-on-primary'
                                    : 'bg-surface-card text-muted'
                                }`}
                              >
                                {p.badge}
                              </span>
                            )}
                          </div>
                          <span className="font-sans text-body-sm text-muted block">{p.description}</span>
                        </div>
                        <div className="flex flex-col items-end shrink-0">
                          <span className="font-serif text-display-sm text-ink leading-none">{p.price}</span>
                          {p.unit && (
                            <span className="font-sans text-body-sm text-muted">{p.unit}</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ── RIGHT COLUMN — sticky contact form ── */}
          <div className="lg:col-span-1">
            <div className="bg-surface-card rounded-lg p-xl border border-hairline sticky top-[88px]">
              <h2 className="font-sans text-title-md text-ink mb-1">Solicitar contacto</h2>
              <p className="font-sans text-body-sm text-muted mb-6 leading-relaxed">
                Contanos un poco sobre lo que necesitás aprender y pondremos en contacto contigo
                para organizar una sesión.
              </p>

              <form onSubmit={handleContact} className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                  <label htmlFor="nombre" className="font-sans text-caption text-ink font-medium">
                    Nombre completo
                  </label>
                  <input
                    id="nombre"
                    type="text"
                    required
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    placeholder="Ej. Ana García"
                    className="h-[44px] px-3 rounded-md border border-hairline bg-canvas focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 font-sans text-body-sm text-ink transition-all placeholder:text-muted/50"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="telefono" className="font-sans text-caption text-ink font-medium">
                    Teléfono
                  </label>
                  <input
                    id="telefono"
                    type="tel"
                    required
                    value={telefono}
                    onChange={(e) => setTelefono(e.target.value)}
                    placeholder="Ej. +54 600 000 000"
                    className="h-[44px] px-3 rounded-md border border-hairline bg-canvas focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 font-sans text-body-sm text-ink transition-all placeholder:text-muted/50"
                  />
                </div>

                <div className="border-t border-hairline pt-4 flex flex-col gap-3">
                  <p className="font-sans text-caption text-muted leading-snug">
                    Datos de tu búsqueda — el tutor los usará para prepararse. Podés modificarlos.
                  </p>
                  <div className="flex flex-col gap-2">
                    <label htmlFor="universidad" className="font-sans text-caption text-ink font-medium">
                      Universidad
                    </label>
                    <input
                      id="universidad"
                      type="text"
                      value={universidad}
                      onChange={(e) => setUniversidad(e.target.value)}
                      placeholder="Ej. UBA"
                      className="h-[40px] px-3 rounded-md border border-hairline bg-canvas focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 font-sans text-body-sm text-ink transition-all placeholder:text-muted/50"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label htmlFor="carrera" className="font-sans text-caption text-ink font-medium">
                      Carrera
                    </label>
                    <input
                      id="carrera"
                      type="text"
                      value={carrera}
                      onChange={(e) => setCarrera(e.target.value)}
                      placeholder="Ej. Ingeniería en Sistemas"
                      className="h-[40px] px-3 rounded-md border border-hairline bg-canvas focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 font-sans text-body-sm text-ink transition-all placeholder:text-muted/50"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label htmlFor="materia" className="font-sans text-caption text-ink font-medium">
                      Materia
                    </label>
                    <input
                      id="materia"
                      type="text"
                      value={materia}
                      onChange={(e) => setMateria(e.target.value)}
                      placeholder="Ej. Álgebra II"
                      className="h-[40px] px-3 rounded-md border border-hairline bg-canvas focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 font-sans text-body-sm text-ink transition-all placeholder:text-muted/50"
                    />
                  </div>
                </div>

                {submitError && (
                  <p className="font-sans text-body-sm text-error">{submitError}</p>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  className="mt-2 w-full h-[48px] bg-primary hover:bg-primary-active text-on-primary font-sans text-button rounded-md transition-colors disabled:opacity-60"
                >
                  {submitting ? 'Enviando...' : 'Enviar solicitud'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </main>

      <Footer />
      <MobileNav />
    </div>
  )
}
