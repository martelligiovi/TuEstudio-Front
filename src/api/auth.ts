import apiFetch from './client'
import type { AuthResponse } from './types'

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
