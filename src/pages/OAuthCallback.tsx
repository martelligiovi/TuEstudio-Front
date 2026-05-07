import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'

export default function OAuthCallback() {
  const [params] = useSearchParams()
  const { setToken } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    const token = params.get('token')
    if (token) {
      setToken(token)
      navigate('/search', { replace: true })
    } else {
      navigate('/oauth2/error?reason=missing_token', { replace: true })
    }
  }, [])

  return null
}
