import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'
import MobileNav from '../components/MobileNav'

const TUTORS = [
  {
    id: 'sofia-r',
    name: 'Sofia R.',
    university: 'Universidad de Buenos Aires',
    subjects: ['Cálculo I y II', 'Álgebra Lineal'],
    rate: 15,
    active: true,
    photo:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuD3b0vO7kObSzfWzHU6eWzjq6lX6ncNV21dC-on_As_OQ0apU-2VMFCOn9rFJMarCC4o_qI9xdc-mRV2jEddTFjUmzdvoWS5qAU_n2OL5D9HWUEaoGPaObVJOv2haZ6SZqb1Bt3F0PAcLSAyLswg8Pl2J_8yQNPaNxmyGUz75W2YuN_ZSQGjGNgtA2jHP45uMT6kjYm2qq9ojZsEiIQuYlN83TxQJKT_lBXEbRhcCLGm0LD6-Q3nzEqm509lYCuuoPvx9jfALrqpg',
  },
  {
    id: 'mateo-v',
    name: 'Mateo V.',
    university: 'Universidad Torcuato Di Tella',
    subjects: ['Microeconomía', 'Macroeconomía'],
    rate: 20,
    active: true,
    photo:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDckeNbmOh_Mzv7caRVeE9mAl_RV8_YJJ-aGVT683qgceKsGhBlGC-PRARLQsWqSFagtEcv3DNMPHp5x0FIXKiddeJBp2h7G0Q6sUKjW6YafzWDNtzeb-PBK1kNaf4IH9Prp4cmmOlViW3oNuDl_lts1ifhQMFv126Fizn4V8NV5QReoESXD0tJ8CwYnVzRXfMR1MN9DapOrMRydN8LKAgy1pm-15pP5kSXHI0B8YJ7sVav7vqM7ZjCgBG_FOGTDJdqOB4UJYpqVw',
  },
  {
    id: 'valentina-c',
    name: 'Valentina C.',
    university: 'Universidad de San Andrés',
    subjects: ['Derecho Constitucional', 'Ética'],
    rate: 18,
    active: false,
    photo:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAPAz8-C60hruBx_90ycD1wJnETU1-EKLXp48J3S6r50R1X3wMkdB2PwqJsutQ5bs-AQW7ur1zsnzDqJKPUHpL0wXcWrnEeEDJIl-6XYV7vZ1BMSnUMHWQVYQk99moiHZ1tbfvXgsUn96j5VVENxZPWusOtWYn-k7YwWinoBARw_GbUCpESkl-lPJOsG57MRK4ojPpTkmerAEXCnt4tAig2q7ad9EWNcvqSxdRKHYqoJrIdBDJI18jzLWwjzxGMq6BVj7CjUBlBKg',
  },
  {
    id: 'carlos-m',
    name: 'Carlos M.',
    university: 'Universidad de Buenos Aires',
    subjects: ['Matemáticas Avanzadas', 'Estadística'],
    rate: 22,
    active: true,
    photo:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBLaQ9m5XzPb8-mOqYjdeDQPy_YN5xtG3ovmHqFSqEFho6lCuLdsGLsUlg81yWUHLmMCcUAgHJFsVN1LnEoB_M6XcP0MJqQvBxlxHNqQyBf8m6-1DMMK7rXfHGPh3A8VzXCxw5MxJkR5mTFcG_VmhW2xqBr8RNPiRLmhqFKCckzCBZxhgU1x2LGr0U_yAhJrC9P2A-S6Z3kHESmHdCbhsrJ87-R3U0DtPGMaAnDHwEfnHaxIRSXmZaQr-ZD_kJVCQwrGU3dg',
  },
]

const UNIVERSITIES = ['Universidad de Buenos Aires (UBA)', 'Universidad Torcuato Di Tella', 'Universidad de San Andrés']
const CAREERS = ['Economía', 'Derecho', 'Ingeniería Informática', 'Administración de Empresas']
const SUBJECTS = ['Cálculo I', 'Álgebra Lineal', 'Microeconomía', 'Derecho Constitucional']

type DropdownProps = {
  label: string
  placeholder: string
  options: string[]
  value: string
  onChange: (v: string) => void
}

function FilterDropdown({ label, placeholder, options, value, onChange }: DropdownProps) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState(value)

  const filtered = options.filter((o) => o.toLowerCase().includes(query.toLowerCase()))

  return (
    <div className="flex flex-col gap-3 mt-4">
      <h3 className="font-sans text-title-sm text-ink border-b border-hairline pb-2">{label}</h3>
      <div className="relative mt-1">
        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-muted text-sm z-10">
          search
        </span>
        <input
          value={query}
          onFocus={() => setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 150)}
          onChange={(e) => setQuery(e.target.value)}
          className="bg-canvas border border-hairline rounded-md pl-9 pr-8 py-2 w-full font-sans text-body-sm focus:border-primary focus:ring-2 focus:ring-primary/15 outline-none"
          placeholder={placeholder}
        />
        <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-muted text-sm pointer-events-none">
          expand_more
        </span>
        {open && filtered.length > 0 && (
          <div className="absolute top-full left-0 w-full mt-1 bg-surface-card border border-hairline rounded-md shadow-lg z-20 max-h-48 overflow-y-auto">
            <ul className="py-1">
              {filtered.map((opt) => (
                <li
                  key={opt}
                  onMouseDown={() => {
                    onChange(opt)
                    setQuery(opt)
                    setOpen(false)
                  }}
                  className="px-3 py-2 hover:bg-surface-soft cursor-pointer font-sans text-body-sm"
                >
                  {opt}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}

export default function Search() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const [uniFilter, setUniFilter] = useState(searchParams.get('universidad') || '')
  const [subjectFilter, setSubjectFilter] = useState(searchParams.get('materia') || '')
  const [careerFilter, setCareerFilter] = useState('')
  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')

  const activeFilters = [
    uniFilter && { key: 'uni', label: uniFilter, clear: () => setUniFilter('') },
    subjectFilter && { key: 'sub', label: subjectFilter, clear: () => setSubjectFilter('') },
    careerFilter && { key: 'car', label: careerFilter, clear: () => setCareerFilter('') },
  ].filter(Boolean) as { key: string; label: string; clear: () => void }[]

  const filtered = TUTORS.filter((t) => {
    if (uniFilter && !t.university.toLowerCase().includes(uniFilter.toLowerCase())) return false
    if (subjectFilter && !t.subjects.some((s) => s.toLowerCase().includes(subjectFilter.toLowerCase()))) return false
    if (minPrice && t.rate < Number(minPrice)) return false
    if (maxPrice && t.rate > Number(maxPrice)) return false
    return true
  })

  function resetFilters() {
    setUniFilter('')
    setSubjectFilter('')
    setCareerFilter('')
    setMinPrice('')
    setMaxPrice('')
  }

  return (
    <div className="bg-canvas text-ink min-h-screen flex flex-col font-sans">
      <Header />

      <main className="flex-grow w-full max-w-content mx-auto px-6 py-8 flex flex-col md:flex-row gap-8">
        {/* Sidebar */}
        <aside className="w-full md:w-64 flex-shrink-0 flex flex-col gap-6">
          <div className="mb-4">
            <h1 className="font-serif text-display-md text-ink mb-2">Buscar Tutores</h1>
            <p className="font-sans text-body-sm text-muted">
              Descubrí socios de pensamiento en todas las materias y universidades.
            </p>
          </div>

          {/* Active filters */}
          {activeFilters.length > 0 && (
            <div className="flex flex-col gap-3 mb-2">
              <h3 className="font-sans text-title-sm text-ink border-b border-hairline pb-2">
                Filtros activos
              </h3>
              <div className="flex flex-wrap gap-2">
                {activeFilters.map((f) => (
                  <div
                    key={f.key}
                    className="inline-flex items-center gap-1 bg-primary/10 text-primary-active px-2 py-1 rounded-md text-caption font-medium"
                  >
                    <span>{f.label}</span>
                    <button onClick={f.clear} className="hover:text-primary transition-colors flex items-center">
                      <span className="material-symbols-outlined text-[14px]">close</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <FilterDropdown
            label="Universidad"
            placeholder="Buscar universidad..."
            options={UNIVERSITIES}
            value={uniFilter}
            onChange={setUniFilter}
          />
          <FilterDropdown
            label="Carrera"
            placeholder="Buscar carrera..."
            options={CAREERS}
            value={careerFilter}
            onChange={setCareerFilter}
          />
          <FilterDropdown
            label="Materia"
            placeholder="Buscar materia..."
            options={SUBJECTS}
            value={subjectFilter}
            onChange={setSubjectFilter}
          />

          {/* Price range */}
          <div className="flex flex-col gap-3 mt-4">
            <h3 className="font-sans text-title-sm text-ink border-b border-hairline pb-2">
              Precio (por hora)
            </h3>
            <div className="flex items-center gap-2 mt-1">
              <input
                type="number"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                placeholder="Mín"
                className="bg-canvas border border-hairline rounded-md px-3 py-2 w-full font-sans text-body-sm focus:border-primary focus:ring-2 focus:ring-primary/15 outline-none"
              />
              <span className="text-muted">-</span>
              <input
                type="number"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                placeholder="Máx"
                className="bg-canvas border border-hairline rounded-md px-3 py-2 w-full font-sans text-body-sm focus:border-primary focus:ring-2 focus:ring-primary/15 outline-none"
              />
            </div>
          </div>

          <button
            onClick={resetFilters}
            className="bg-canvas text-ink border border-hairline rounded-md py-2 px-4 font-sans text-button hover:bg-surface-soft transition-colors mt-4"
          >
            Limpiar filtros
          </button>
        </aside>

        {/* Tutor grid */}
        <div className="flex-grow grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 auto-rows-max">
          {filtered.length === 0 && (
            <div className="col-span-full flex flex-col items-center justify-center py-xxl text-muted">
              <span className="material-symbols-outlined text-[48px] mb-4">search_off</span>
              <p className="font-sans text-body-md">No se encontraron tutores con esos filtros.</p>
            </div>
          )}
          {filtered.map((tutor) => (
            <article
              key={tutor.id}
              className="bg-surface-card rounded-lg p-xl border border-hairline flex flex-col gap-4 relative overflow-hidden group hover:shadow-[0_1px_3px_rgba(20,20,19,0.08)] transition-shadow"
            >
              {/* Status badge */}
              <div className={`absolute top-4 right-4 flex items-center gap-1.5 ${!tutor.active && 'opacity-50'}`}>
                <span className={`w-2 h-2 rounded-full ${tutor.active ? 'bg-success' : 'bg-muted'}`} />
                <span className={`font-sans text-caption ${tutor.active ? 'text-success' : 'text-muted'}`}>
                  {tutor.active ? 'Activo' : 'Offline'}
                </span>
              </div>

              {/* Tutor info */}
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-full overflow-hidden border border-hairline shrink-0">
                  <img
                    src={tutor.photo}
                    alt={tutor.name}
                    className={`w-full h-full object-cover ${!tutor.active && 'grayscale-[20%]'}`}
                  />
                </div>
                <div>
                  <h2 className="font-serif text-display-sm text-ink leading-tight">{tutor.name}</h2>
                  <p className="font-sans text-body-sm text-muted mt-1">{tutor.university}</p>
                </div>
              </div>

              {/* Subjects */}
              <div className="flex flex-wrap gap-2 mt-2">
                {tutor.subjects.map((s) => (
                  <span
                    key={s}
                    className="bg-canvas border border-hairline text-ink rounded-full px-3 py-1 font-sans text-caption"
                  >
                    {s}
                  </span>
                ))}
              </div>

              {/* Footer */}
              <div className="mt-auto pt-4 flex items-center justify-between border-t border-hairline-soft">
                <div className="flex items-center gap-2">
                  <span className="font-sans text-title-sm text-ink">${tutor.rate}/hr</span>
                </div>
                <button
                  onClick={() => navigate(`/tutor/${tutor.id}`)}
                  className="text-primary hover:text-primary-active font-sans text-button flex items-center gap-1 group-hover:translate-x-1 transition-transform"
                >
                  Ver perfil <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                </button>
              </div>
            </article>
          ))}
        </div>
      </main>

      <Footer />
      <MobileNav />
    </div>
  )
}
