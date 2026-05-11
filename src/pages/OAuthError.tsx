import { Link, useSearchParams } from 'react-router-dom'

export default function OAuthError() {
  const [params] = useSearchParams()
  const reason = params.get('reason') ?? ''

  if (reason === 'account_not_found') {
    return (
      <div className="bg-canvas min-h-screen flex items-center justify-center font-sans">
        <div className="text-center max-w-sm px-6">
          <p className="font-serif text-display-sm text-ink mb-3">No tenés cuenta</p>
          <p className="font-sans text-body-md text-muted mb-8">¿Querés registrarte?</p>
          <Link
            to="/register"
            className="inline-block bg-primary hover:bg-primary-active text-on-primary font-sans text-button px-6 py-3 rounded-md transition-colors"
          >
            Crear cuenta
          </Link>
        </div>
      </div>
    )
  }

  const MESSAGES: Record<string, string> = {
    invalid_role: 'La sesión de registro expiró. Probá de nuevo.',
    missing_email: 'No pudimos obtener tu email desde el proveedor.',
    missing_token: 'No se recibió un token de sesión.',
    invalid_token: 'El token recibido no es válido.',
  }

  const message = MESSAGES[reason] ?? 'Ocurrió un error durante el inicio de sesión social.'

  return (
    <div className="bg-canvas min-h-screen flex items-center justify-center font-sans">
      <div className="text-center max-w-sm px-6">
        <p className="font-serif text-display-sm text-ink mb-3">Algo salió mal</p>
        <p className="font-sans text-body-md text-muted mb-8">{message}</p>
        <Link
          to="/login"
          className="inline-block bg-primary hover:bg-primary-active text-on-primary font-sans text-button px-6 py-3 rounded-md transition-colors"
        >
          Volver al login
        </Link>
      </div>
    </div>
  )
}
