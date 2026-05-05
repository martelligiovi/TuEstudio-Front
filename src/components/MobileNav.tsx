import { Link, useLocation } from 'react-router-dom'

const tabs = [
  { to: '/search', icon: 'search', label: 'Buscar' },
  { to: '/mis-solicitudes', icon: 'forum', label: 'Solicitudes' },
  { to: '/perfil', icon: 'account_circle', label: 'Perfil' },
]

export default function MobileNav() {
  const { pathname } = useLocation()

  return (
    <nav className="md:hidden fixed bottom-0 left-0 w-full flex justify-around items-center px-4 py-3 pb-safe bg-[#fdfbf7] z-50 border-t border-hairline shadow-[0_-1px_3px_rgba(20,20,19,0.05)]">
      {tabs.map(({ to, icon, label }) => {
        const active = pathname === to || (to === '/search' && pathname === '/')
        return (
          <Link
            key={to}
            to={to}
            className={`flex flex-col items-center justify-center rounded-xl px-3 py-1 transition-colors ${
              active
                ? 'text-coral bg-coral/5 scale-95'
                : 'text-muted hover:bg-surface-soft'
            }`}
          >
            <span
              className="material-symbols-outlined text-[24px] mb-1"
              style={active ? { fontVariationSettings: "'FILL' 1" } : undefined}
            >
              {icon}
            </span>
            <span className="font-sans text-[11px] font-medium uppercase tracking-wider">
              {label}
            </span>
          </Link>
        )
      })}
    </nav>
  )
}
