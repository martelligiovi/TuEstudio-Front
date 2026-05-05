import { useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'
import MobileNav from '../components/MobileNav'

const TUTORS: Record<
  string,
  {
    name: string
    subject: string
    university: string
    location: string
    modalidad: string
    rating: number
    reviews: number
    bio: string
    photo: string
    materias: { name: string; desc: string; icon: string }[]
    metodologia: {
      intro: string
      features: { label: string; value: boolean }[]
    }
    horarios: { days: string; hours: string }[]
    horariosNote: string
    planes: { name: string; desc: string; price: string; unit: string; badge?: string; featured?: boolean }[]
  }
> = {
  'sofia-r': {
    name: 'Sofia Rodríguez',
    subject: 'Cálculo & Álgebra Lineal',
    university: 'Universidad de Buenos Aires',
    location: 'Buenos Aires',
    modalidad: 'Híbrido',
    rating: 4.9,
    reviews: 38,
    bio: 'Estudiante avanzada de Matemática en la UBA con pasión por enseñar de forma clara y estructurada. Mi enfoque no es solo que aprueben, sino que comprendan profundamente los fundamentos, desarrollando un pensamiento crítico y analítico.',
    photo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD3b0vO7kObSzfWzHU6eWzjq6lX6ncNV21dC-on_As_OQ0apU-2VMFCOn9rFJMarCC4o_qI9xdc-mRV2jEddTFjUmzdvoWS5qAU_n2OL5D9HWUEaoGPaObVJOv2haZ6SZqb1Bt3F0PAcLSAyLswg8Pl2J_8yQNPaNxmyGUz75W2YuN_ZSQGjGNgtA2jHP45uMT6kjYm2qq9ojZsEiIQuYlN83TxQJKT_lBXEbRhcCLGm0LD6-Q3nzEqm509lYCuuoPvx9jfALrqpg',
    materias: [
      { name: 'Cálculo I y II', desc: 'Límites, derivadas, integrales y series.', icon: 'calculate' },
      { name: 'Álgebra Lineal', desc: 'Espacios vectoriales, matrices y autovalores.', icon: 'grid_on' },
      { name: 'Análisis Matemático', desc: 'Convergencia, continuidad y series de Fourier.', icon: 'functions' },
    ],
    metodologia: {
      intro: 'El enfoque se basa en problemas (PBL). Cada sesión comienza con un desafío práctico que resolucemos juntos, descubriendo la teoría en el proceso.',
      features: [
        { label: 'Resolución activa', value: true },
        { label: 'Conceptos clave', value: true },
        { label: 'Clase guiada', value: true },
        { label: 'Resolución de dudas', value: true },
      ],
    },
    horarios: [
      { days: 'Lunes – Miércoles', hours: '17:00 – 21:00' },
      { days: 'Viernes', hours: '15:00 – 19:00' },
    ],
    horariosNote: '* Los horarios exactos se confirman al inicio de contacto.',
    planes: [
      { name: 'Clase Suelta', desc: 'Sesión de 60 minutos', price: '$15', unit: '/hr' },
      { name: 'Bono 5 Clases', desc: 'Ahorrás un 10%', price: '$65', unit: '', badge: 'Bono', featured: true },
    ],
  },
  'mateo-v': {
    name: 'Mateo Villanueva',
    subject: 'Microeconomía & Macroeconomía',
    university: 'Universidad Torcuato Di Tella',
    location: 'Buenos Aires',
    modalidad: 'Virtual',
    rating: 4.8,
    reviews: 24,
    bio: 'Egresado de Economía en la UTDT, con experiencia en consultoría y enseñanza universitaria. Me especializo en hacer accesibles los modelos económicos complejos con ejemplos del mundo real y casos prácticos.',
    photo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDckeNbmOh_Mzv7caRVeE9mAl_RV8_YJJ-aGVT683qgceKsGhBlGC-PRARLQsWqSFagtEcv3DNMPHp5x0FIXKiddeJBp2h7G0Q6sUKjW6YafzWDNtzeb-PBK1kNaf4IH9Prp4cmmOlViW3oNuDl_lts1ifhQMFv126Fizn4V8NV5QReoESXD0tJ8CwYnVzRXfMR1MN9DapOrMRydN8LKAgy1pm-15pP5kSXHI0B8YJ7sVav7vqM7ZjCgBG_FOGTDJdqOB4UJYpqVw',
    materias: [
      { name: 'Microeconomía', desc: 'Oferta, demanda, equilibrio y teoría del consumidor.', icon: 'trending_up' },
      { name: 'Macroeconomía', desc: 'PIB, inflación, política monetaria y fiscal.', icon: 'bar_chart' },
      { name: 'Econometría', desc: 'Regresión lineal, series de tiempo y paneles.', icon: 'analytics' },
    ],
    metodologia: {
      intro: 'Trabajo con casos reales de la economía argentina y mundial para anclar cada concepto teórico. Cada clase combina teoría, ejercicios y análisis de datos.',
      features: [
        { label: 'Resolución activa', value: true },
        { label: 'Casos reales', value: true },
        { label: 'Clase guiada', value: true },
        { label: 'Resolución de dudas', value: true },
      ],
    },
    horarios: [
      { days: 'Martes – Jueves', hours: '18:00 – 22:00' },
      { days: 'Sábados', hours: '10:00 – 14:00' },
    ],
    horariosNote: '* Los horarios exactos se confirman al inicio de contacto.',
    planes: [
      { name: 'Clase Suelta', desc: 'Sesión de 60 minutos', price: '$20', unit: '/hr' },
      { name: 'Bono 5 Clases', desc: 'Ahorrás un 10%', price: '$90', unit: '', badge: 'Bono', featured: true },
    ],
  },
  'valentina-c': {
    name: 'Valentina Castillo',
    subject: 'Derecho Constitucional & Ética',
    university: 'Universidad de San Andrés',
    location: 'Buenos Aires',
    modalidad: 'Híbrido',
    rating: 4.7,
    reviews: 19,
    bio: 'Abogada graduada con orientación en derecho público y constitucional. Ayudo a estudiantes a entender los fundamentos del derecho y a prepararse para los exámenes con metodología clara y casos prácticos.',
    photo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAPAz8-C60hruBx_90ycD1wJnETU1-EKLXp48J3S6r50R1X3wMkdB2PwqJsutQ5bs-AQW7ur1zsnzDqJKPUHpL0wXcWrnEeEDJIl-6XYV7vZ1BMSnUMHWQVYQk99moiHZ1tbfvXgsUn96j5VVENxZPWusOtWYn-k7YwWinoBARw_GbUCpESkl-lPJOsG57MRK4ojPpTkmerAEXCnt4tAig2q7ad9EWNcvqSxdRKHYqoJrIdBDJI18jzLWwjzxGMq6BVj7CjUBlBKg',
    materias: [
      { name: 'Derecho Constitucional', desc: 'Derechos fundamentales y control de constitucionalidad.', icon: 'gavel' },
      { name: 'Ética Jurídica', desc: 'Razonamiento moral y deontología profesional.', icon: 'balance' },
      { name: 'Derecho Procesal', desc: 'Proceso civil y penal, recursos y ejecución.', icon: 'description' },
    ],
    metodologia: {
      intro: 'Trabajo con casos de jurisprudencia real para desarrollar el razonamiento jurídico. Cada sesión analiza un fallo relevante y su impacto en el ordenamiento.',
      features: [
        { label: 'Análisis de fallos', value: true },
        { label: 'Conceptos clave', value: true },
        { label: 'Clase guiada', value: true },
        { label: 'Resolución de dudas', value: true },
      ],
    },
    horarios: [
      { days: 'Lunes – Miércoles', hours: '16:00 – 20:00' },
      { days: 'Martes', hours: '10:00 – 13:00' },
    ],
    horariosNote: '* Los horarios exactos se confirman al inicio de contacto.',
    planes: [
      { name: 'Clase Suelta', desc: 'Sesión de 60 minutos', price: '$18', unit: '/hr' },
      { name: 'Bono 5 Clases', desc: 'Ahorrás un 10%', price: '$80', unit: '', badge: 'Bono', featured: true },
    ],
  },
  'carlos-m': {
    name: 'Carlos Mendoza',
    subject: 'Matemáticas Avanzadas & Física',
    university: 'Universidad de Buenos Aires',
    location: 'Buenos Aires',
    modalidad: 'Híbrido',
    rating: 4.9,
    reviews: 120,
    bio: 'Soy Doctor en Física Aplicada por la Universidad Computense con más de 8 años de experiencia docente. Mi objetivo no es solo que aprueben, sino que comprendan profundamente los fundamentos, desarrollando un pensamiento crítico y analítico. Creo en un aprendizaje guiado por la curiosidad, donde los errores son simplemente pasos hacia la maestría.',
    photo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBLaQ9m5XzPb8-mOqYjdeDQPy_YN5xtG3ovmHqFSqEFho6lCuLdsGLsUlg81yWUHLmMCcUAgHJFsVN1LnEoB_M6XcP0MJqQvBxlxHNqQyBf8m6-1DMMK7rXfHGPh3A8VzXCxw5MxJkR5mTFcG_VmhW2xqBr8RNPiRLmhqFKCckzCBZxhgU1x2LGr0U_yAhJrC9P2A-S6Z3kHESmHdCbhsrJ87-R3U0DtPGMaAnDHwEfnHaxIRSXmZaQr-ZD_kJVCQwrGU3dg',
    materias: [
      { name: 'Cálculo I y II', desc: 'Límites, derivadas, integrales y series.', icon: 'calculate' },
      { name: 'Álgebra Lineal', desc: 'Espacios vectoriales, matrices y autovalores.', icon: 'grid_on' },
      { name: 'Física General', desc: 'Mecánica clásica y electromagnetismo.', icon: 'bolt' },
    ],
    metodologia: {
      intro: 'El enfoque se basa en problemas (PBL). Cada sesión comienza con un desafío práctico que resolucemos juntos, descubriendo la teoría en el proceso.',
      features: [
        { label: 'Resolución activa', value: true },
        { label: 'Conceptos clave', value: true },
        { label: 'Clase guiada', value: true },
        { label: 'Resolución de dudas', value: true },
      ],
    },
    horarios: [
      { days: 'Lunes – Jueves', hours: '16:00 – 21:00' },
      { days: 'Viernes', hours: '15:00 – 19:00' },
    ],
    horariosNote: '* Los horarios exactos se confirman al inicio del contacto.',
    planes: [
      { name: 'Clase Suelta', desc: 'Sesión de 60 minutos', price: '$25', unit: '/hr' },
      { name: 'Bono 5 Clases', desc: 'Ahorrás un 10%', price: '$110', unit: '', badge: 'Bono', featured: true },
    ],
  },
}

export default function TutorProfile() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const tutor = id ? TUTORS[id] : null

  const [nombre, setNombre] = useState('')
  const [telefono, setTelefono] = useState('')

  if (!tutor) {
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

  function handleContact(e: React.FormEvent) {
    e.preventDefault()
    navigate('/confirmed')
  }

  return (
    <div className="bg-canvas text-ink min-h-screen flex flex-col font-sans">
      <Header />

      <main className="flex-grow w-full max-w-content mx-auto px-6 py-8 pb-section">
        {/* Back */}
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
                src={tutor.photo}
                alt={tutor.name}
                className="w-20 h-20 rounded-full object-cover border border-hairline shrink-0"
              />
              <div className="flex-1">
                <h1 className="font-serif text-display-md text-ink leading-tight mb-1">{tutor.name}</h1>
                <p className="font-sans text-title-sm text-muted mb-3">{tutor.subject}</p>
                <div className="flex flex-wrap items-center gap-4">
                  {/* Rating */}
                  <div className="flex items-center gap-1">
                    <span
                      className="material-symbols-outlined text-[16px] text-accent-amber"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      star
                    </span>
                    <span className="font-sans text-body-sm text-ink font-medium">{tutor.rating}</span>
                    <span className="font-sans text-body-sm text-muted">({tutor.reviews} reseñas)</span>
                  </div>
                  {/* Location */}
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
                {tutor.materias.map((m) => (
                  <div key={m.name} className="flex items-start gap-3">
                    <span className="material-symbols-outlined text-[18px] text-on-dark-soft mt-0.5 shrink-0">
                      {m.icon}
                    </span>
                    <div>
                      <p className="font-sans text-title-sm text-on-dark leading-snug">{m.name}</p>
                      <p className="font-sans text-body-sm text-on-dark-soft mt-0.5">{m.desc}</p>
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
                  {tutor.metodologia.intro}
                </p>
                <div className="border-t border-surface-dark-elevated pt-4 flex flex-col gap-2">
                  {tutor.metodologia.features.map((f) => (
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
                    {tutor.horarios.map((h) => (
                      <div key={h.days} className="flex items-start justify-between gap-4">
                        <span className="font-sans text-body-sm text-muted">{h.days}</span>
                        <span className="font-sans text-body-sm text-ink font-medium text-right">{h.hours}</span>
                      </div>
                    ))}
                  </div>
                  <p className="font-sans text-caption text-muted-soft mt-1">{tutor.horariosNote}</p>
                </div>

                {/* Planes */}
                <div className="bg-surface-card rounded-lg p-xl border border-hairline flex flex-col gap-4">
                  <div className="flex items-center gap-2 border-b border-hairline pb-sm">
                    <span className="material-symbols-outlined text-[20px] text-primary">payments</span>
                    <h3 className="font-sans text-title-sm text-ink">Planes de Estudio</h3>
                  </div>
                  <div className="flex flex-col gap-4">
                    {tutor.planes.map((p) => (
                      <div
                        key={p.name}
                        className={`flex items-center justify-between rounded-md px-md py-sm ${
                          p.featured ? 'bg-surface-cream-strong' : 'bg-canvas border border-hairline'
                        }`}
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-sans text-title-sm text-ink">{p.name}</span>
                            {p.badge && (
                              <span
                                className={`font-sans text-caption-uppercase px-2 py-0.5 rounded-full ${
                                  p.featured
                                    ? 'bg-primary text-on-primary'
                                    : 'bg-surface-card text-muted'
                                }`}
                              >
                                {p.badge}
                              </span>
                            )}
                          </div>
                          <span className="font-sans text-body-sm text-muted">{p.desc}</span>
                        </div>
                        <div className="text-right shrink-0">
                          <span className="font-serif text-display-sm text-ink">{p.price}</span>
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
                <button
                  type="submit"
                  className="mt-2 w-full h-[48px] bg-primary hover:bg-primary-active text-on-primary font-sans text-button rounded-md transition-colors"
                >
                  Enviar solicitud
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
