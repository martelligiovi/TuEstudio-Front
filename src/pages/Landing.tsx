import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'
import MobileNav from '../components/MobileNav'

export default function Landing() {
  const navigate = useNavigate()
  const [materia, setMateria] = useState('')
  const [universidad, setUniversidad] = useState('')

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    const params = new URLSearchParams()
    if (materia) params.set('materia', materia)
    if (universidad) params.set('universidad', universidad)
    navigate(`/search?${params.toString()}`)
  }

  return (
    <div className="bg-canvas text-ink min-h-screen flex flex-col font-sans">
      <Header />

      <main className="flex-1 w-full max-w-content mx-auto px-6 pb-section">
        {/* Hero */}
        <section className="py-section grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
          <div className="md:col-span-6 space-y-8">
            <h1 className="font-serif text-display-xl text-ink max-w-[15ch]">
              Encuentra tu socio de pensamiento académico
            </h1>
            <p className="font-sans text-body-md text-body max-w-[40ch]">
              Una plataforma sofisticada que conecta a estudiantes con tutores académicos
              de alto calibre. Una experiencia curada para el aprendizaje superior.
            </p>

            {/* Search box */}
            <form
              onSubmit={handleSearch}
              className="bg-surface-card rounded-lg p-lg border border-hairline flex flex-col sm:flex-row gap-4 shadow-[0_1px_3px_rgba(20,20,19,0.08)]"
            >
              <div className="flex-1 flex flex-col">
                <label className="font-sans text-caption-uppercase text-muted-soft mb-2 uppercase tracking-widest">
                  Materia
                </label>
                <input
                  type="text"
                  value={materia}
                  onChange={(e) => setMateria(e.target.value)}
                  placeholder="Ej. Cálculo Avanzado"
                  className="bg-canvas border border-hairline rounded-md px-3 h-[40px] font-sans text-body-sm focus:border-primary focus:ring-2 focus:ring-primary/15 outline-none w-full"
                />
              </div>
              <div className="flex-1 flex flex-col">
                <label className="font-sans text-caption-uppercase text-muted-soft mb-2 uppercase tracking-widest">
                  Universidad
                </label>
                <input
                  type="text"
                  value={universidad}
                  onChange={(e) => setUniversidad(e.target.value)}
                  placeholder="Ej. UBA"
                  className="bg-canvas border border-hairline rounded-md px-3 h-[40px] font-sans text-body-sm focus:border-primary focus:ring-2 focus:ring-primary/15 outline-none w-full"
                />
              </div>
              <div className="flex flex-col justify-end">
                <button
                  type="submit"
                  className="bg-primary text-on-primary font-sans text-button h-[40px] px-6 rounded-md hover:bg-primary-active transition-colors w-full sm:w-auto"
                >
                  Buscar
                </button>
              </div>
            </form>
          </div>

          {/* Hero image */}
          <div className="md:col-span-6 relative h-[500px] rounded-lg overflow-hidden border border-hairline">
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage:
                  "url('https://lh3.googleusercontent.com/aida-public/AB6AXuArir9UJnTgbBrWt6xEmeZ5GXhG703Zx82LE8EFwKpi2cbwepbJuSl8EsqUMa3UL8o3M3Cbo8IjqybWnPf2zZ3V4n3Fx3LeL85KvqiKyKCvdifelwl4nDXPGL03hRrTCrYQHPT6Wvgs-hkptELqK36-tdhp_zhF-o1AXfKcJxhY0Ep9SZkBM21IYGeUoU1_CqbbFOjhQzHDXuLP3ebsUb31rXREMEhQVkaoSqaDfdnPPu29cEgOCJbCBUCBZuzx4y8aWx6Wc2MtA')",
              }}
            />
          </div>
        </section>
      </main>

      <Footer />
      <MobileNav />
    </div>
  )
}
