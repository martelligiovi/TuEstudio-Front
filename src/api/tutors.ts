import apiFetch from './client'
import type { TutorSummary, TutorProfile } from './types'

export interface SearchParams {
  universidad?: string
  materia?: string
  carrera?: string
  minPrice?: number
  maxPrice?: number
}

export function searchTutors(params: SearchParams): Promise<TutorSummary[]> {
  const qs = new URLSearchParams()
  if (params.universidad) qs.set('universidad', params.universidad)
  if (params.materia) qs.set('materia', params.materia)
  if (params.carrera) qs.set('carrera', params.carrera)
  if (params.minPrice != null) qs.set('minPrice', String(params.minPrice))
  if (params.maxPrice != null) qs.set('maxPrice', String(params.maxPrice))
  const query = qs.toString()
  return apiFetch<TutorSummary[]>(`/api/tutors${query ? `?${query}` : ''}`)
}

export function getTutor(id: string): Promise<TutorProfile> {
  return apiFetch<TutorProfile>(`/api/tutors/${id}`)
}

export interface ContactPayload {
  nombre: string
  telefono: string
  universidad?: string
  carrera?: string
  materia?: string
}

export function contactTutor(id: string, payload: ContactPayload): Promise<void> {
  return apiFetch<void>(`/api/tutors/${id}/contact`, {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}
