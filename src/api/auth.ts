import apiFetch from './client'
import type { AuthResponse } from './types'

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8080'

export function login(email: string, password: string): Promise<AuthResponse> {
  return apiFetch<AuthResponse>('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  })
}

export function register(
  name: string,
  email: string,
  password: string,
  role: 'STUDENT' | 'TEACHER',
): Promise<AuthResponse> {
  return apiFetch<AuthResponse>('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify({ name, email, password, role }),
  })
}

export function initiateOAuth(provider: 'google' | 'linkedin', role: 'STUDENT' | 'TUTOR'): void {
  window.location.href = `${API_URL}/api/auth/social/initiate?provider=${provider}&role=${role}`
}

export function initiateOAuthLogin(provider: 'google' | 'linkedin'): void {
  window.location.href = `${API_URL}/api/auth/social/initiate?provider=${provider}&flow=login`
}
