import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import { decodeJwtPayload } from '../auth/jwt'
import type { Role } from '../auth/AuthContext'

export default function OAuthCallback() {
  const [params] = useSearchParams()
  const { setSession } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    const token = params.get('token')
    if (!token) {
      navigate('/oauth2/error?reason=missing_token', { replace: true })
      return
    }

    const payload = decodeJwtPayload(token)
    const role = payload.role as Role | undefined
    const userId = payload.userId as string | undefined
    const name = payload.name as string | undefined

    if (!role || !userId || !name || (role !== 'STUDENT' && role !== 'TEACHER')) {
      navigate('/oauth2/error?reason=invalid_token', { replace: true })
      return
    }

    setSession({ token, role, userId, name })
    navigate(role === 'TEACHER' ? '/dashboard' : '/search', { replace: true })
  }, [])

  return null
}
