import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import { getContactRequests, markAsAttended, getProfile } from '../api/teacher'
import type { ContactRequest, TutorProfileResponse } from '../api/types'
import Header from '../components/Header'

// ─── Utilities ────────────────────────────────────────────────────────────────

function isNew(createdAt: string): boolean {
  const ageMs = Date.now() - new Date(createdAt).getTime()
  return ageMs < 2 * 60 * 60 * 1000
}

const rtf = new Intl.RelativeTimeFormat('es-AR', { numeric: 'auto' })

function formatRelative(createdAt: string): string {
  const diffMs = new Date(createdAt).getTime() - Date.now()
  const diffSec = Math.round(diffMs / 1000)
  const diffMin = Math.round(diffSec / 60)
  const diffHour = Math.round(diffMin / 60)
  const diffDay = Math.round(diffHour / 24)

  if (Math.abs(diffDay) >= 1) return rtf.format(diffDay, 'day')
  if (Math.abs(diffHour) >= 1) return rtf.format(diffHour, 'hour')
  if (Math.abs(diffMin) >= 1) return rtf.format(diffMin, 'minute')
  return 'justo ahora'
}

function buildWhatsAppUrl(req: ContactRequest, teacherName: string): string {
  const { studentPhone, studentName, subject, career } = req
  // Strip leading + for wa.me
  const phone = studentPhone.replace(/^\+/, '')
  const text = [
    `Hola ${studentName}, soy ${teacherName} de TuEstudio.`,
    `Vi tu solicitud${subject ? ` para ${subject}` : ''}${career ? ` (${career})` : ''}.`,
    '¿Cuándo te viene bien coordinar una sesión?',
  ].join(' ')
  return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`
}

// ─── RequestCard ──────────────────────────────────────────────────────────────

interface RequestCardProps {
  req: ContactRequest
  teacherName: string
  onAttend: (id: string) => Promise<void>
  cardError: string | null
}

function RequestCard({ req, teacherName, onAttend, cardError }: RequestCardProps) {
  const isPending = req.status === 'PENDING'
  const showNewBadge = isPending && isNew(req.createdAt)

  return (
    <div
      className={[
        'rounded-lg border border-hairline p-5 flex flex-col gap-3 transition-opacity',
        isPending
          ? 'bg-surface-card border-l-[3px] border-l-primary'
          : 'bg-surface-card opacity-60',
      ].join(' ')}
    >
      {/* Header row */}
      <div className="flex items-start justify-between gap-2">
        <h2 className="font-serif text-display-sm text-ink leading-tight">{req.studentName}</h2>
        <div className="flex items-center gap-2 shrink-0">
          {showNewBadge && (
            <span className="bg-accent-amber/20 text-accent-amber font-sans text-[11px] font-medium px-2 py-0.5 rounded-full uppercase tracking-wider">
              Nueva
            </span>
          )}
          {!isPending && (
            <span className="bg-success/10 text-success font-sans text-[11px] font-medium px-2 py-0.5 rounded-full uppercase tracking-wider">
              Atendida
            </span>
          )}
          <span className="font-sans text-caption text-muted">{formatRelative(req.createdAt)}</span>
        </div>
      </div>

      {/* Meta fields */}
      <div className="flex flex-col gap-1.5">
        {(req.university || req.career) && (
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-muted text-[18px]">school</span>
            <span className="font-sans text-body-sm text-ink">
              {[req.university, req.career].filter(Boolean).join(' · ')}
            </span>
          </div>
        )}
        {req.subject && (
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-muted text-[18px]">menu_book</span>
            <span className="font-sans text-body-sm text-ink">{req.subject}</span>
          </div>
        )}
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-muted text-[18px]">phone</span>
          <span className="font-sans text-body-sm text-ink">{req.studentPhone}</span>
        </div>
      </div>

      {/* Inline error on revert */}
      {cardError && (
        <p className="font-sans text-body-sm text-error flex items-center gap-1.5">
          <span className="material-symbols-outlined text-[16px]">error_outline</span>
          {cardError}
        </p>
      )}

      {/* Actions */}
      <div className="flex items-center gap-2 flex-wrap">
        <a
          href={buildWhatsAppUrl(req, teacherName)}
          target="_blank"
          rel="noopener noreferrer"
          className={[
            'flex items-center gap-2 h-[40px] px-4 rounded-md font-sans text-button transition-colors',
            isPending
              ? 'bg-primary text-on-primary hover:bg-primary-active'
              : 'bg-surface-soft text-ink border border-hairline hover:bg-canvas',
          ].join(' ')}
        >
          <span className="material-symbols-outlined text-[18px]">chat</span>
          WhatsApp
        </a>

        {isPending && (
          <button
            onClick={() => onAttend(req.id)}
            className="h-[40px] px-4 rounded-md border border-hairline bg-surface-soft text-muted hover:bg-canvas hover:text-ink font-sans text-button transition-colors"
          >
            Marcar como atendida
          </button>
        )}
      </div>
    </div>
  )
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function SkeletonCard() {
  return (
    <div className="rounded-lg border border-hairline bg-surface-soft p-5 animate-pulse">
      <div className="h-5 w-2/5 bg-surface-cream-strong rounded mb-3" />
      <div className="h-3 w-3/5 bg-surface-cream-strong rounded mb-2" />
      <div className="h-3 w-2/5 bg-surface-cream-strong rounded mb-4" />
      <div className="flex gap-2">
        <div className="h-10 w-28 bg-surface-cream-strong rounded-md" />
        <div className="h-10 w-36 bg-surface-cream-strong rounded-md" />
      </div>
    </div>
  )
}

// ─── TeacherDashboard ─────────────────────────────────────────────────────────

export default function TeacherDashboard() {
  const { session } = useAuth()

  const [requests, setRequests] = useState<ContactRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [cardErrors, setCardErrors] = useState<Record<string, string>>({})
  const [profile, setProfile] = useState<TutorProfileResponse | null>(null)
  const pollingRef = useRef<number | null>(null)

  async function fetchRequests(silent = false) {
    if (!silent) setLoading(true)
    try {
      const data = await getContactRequests()
      // Sort descending by createdAt
      const sorted = [...data].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
      setRequests(sorted)
      setError(null)
    } catch {
      if (!silent) setError('No pudimos cargar tus solicitudes. Probá de nuevo.')
    } finally {
      if (!silent) setLoading(false)
    }
  }

  useEffect(() => {
    fetchRequests(false)
    getProfile().then(setProfile).catch(() => {
      /* non-blocking — banner just won't render */
    })
    pollingRef.current = window.setInterval(() => fetchRequests(true), 10_000)
    return () => {
      if (pollingRef.current !== null) {
        window.clearInterval(pollingRef.current)
      }
    }
  }, [])

  async function handleAttend(id: string) {
    // Optimistic update
    setRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: 'ATTENDED' as const } : r))
    )
    setCardErrors((prev) => ({ ...prev, [id]: '' }))

    try {
      const updated = await markAsAttended(id)
      setRequests((prev) => prev.map((r) => (r.id === id ? updated : r)))
    } catch {
      // Revert
      setRequests((prev) =>
        prev.map((r) => (r.id === id ? { ...r, status: 'PENDING' as const } : r))
      )
      setCardErrors((prev) => ({
        ...prev,
        [id]: 'No pudimos registrar la atención. Reintentá.',
      }))
    }
  }

  const pendingCount = requests.filter((r) => r.status === 'PENDING').length
  const teacherName = session?.name ?? 'Profe'

  return (
    <div className="min-h-screen bg-canvas">
      <Header />

      {/* Main content */}
      <main className="max-w-content mx-auto px-6 py-8">
        {/* Page title */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-1">
            <h1 className="font-serif text-display-md text-ink">
              Hola, {teacherName}
            </h1>
            {pendingCount > 0 && (
              <span className="bg-primary text-on-primary font-sans text-[12px] font-semibold h-6 min-w-[24px] px-1.5 rounded-full flex items-center justify-center">
                {pendingCount}
              </span>
            )}
          </div>
          <p className="font-sans text-body-md text-muted">
            Respondé y coordiná tus sesiones desde acá.
          </p>
        </div>

        {/* Activation banner — only when profile is incomplete */}
        {profile && profile.missingForActivation.length > 0 && (
          <Link
            to="/profile"
            className="mb-6 rounded-lg border border-accent-amber/40 bg-accent-amber/5 p-4 flex items-center gap-3 hover:bg-accent-amber/10 transition-colors"
          >
            <span className="material-symbols-outlined text-accent-amber text-[22px] shrink-0">
              info
            </span>
            <div className="flex-1">
              <p className="font-sans text-body-md text-ink font-medium">
                Tu perfil todavía no está publicado
              </p>
              <p className="font-sans text-body-sm text-muted mt-0.5">
                Te {profile.missingForActivation.length === 1 ? 'falta' : 'faltan'}{' '}
                {profile.missingForActivation.length}{' '}
                {profile.missingForActivation.length === 1 ? 'campo' : 'campos'} para que los alumnos puedan encontrarte.
              </p>
            </div>
            <span className="material-symbols-outlined text-muted text-[20px]">chevron_right</span>
          </Link>
        )}

        {/* Initial loading skeleton */}
        {loading && requests.length === 0 && (
          <div className="flex flex-col gap-4">
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </div>
        )}

        {/* Error state */}
        {error && requests.length === 0 && (
          <div className="flex flex-col items-center gap-4 py-16 text-center">
            <span className="material-symbols-outlined text-error text-[48px]">error_outline</span>
            <p className="font-sans text-body-md text-error">{error}</p>
            <button
              onClick={() => fetchRequests(false)}
              className="h-[40px] px-5 rounded-md bg-primary text-on-primary font-sans text-button hover:bg-primary-active transition-colors"
            >
              Reintentar
            </button>
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && requests.length === 0 && (
          <div className="flex flex-col items-center gap-4 py-16 text-center bg-surface-soft rounded-xl">
            <span className="material-symbols-outlined text-muted text-[56px]">inbox</span>
            <div>
              <p className="font-serif text-display-sm text-ink mb-1">Tu inbox está listo</p>
              <p className="font-sans text-body-md text-muted max-w-xs mx-auto">
                Tu perfil está activo. Las solicitudes de alumnos aparecerán aquí.
              </p>
            </div>
          </div>
        )}

        {/* Request list */}
        {requests.length > 0 && (
          <div className="flex flex-col gap-4">
            {requests.map((req) => (
              <RequestCard
                key={req.id}
                req={req}
                teacherName={teacherName}
                onAttend={handleAttend}
                cardError={cardErrors[req.id] || null}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
