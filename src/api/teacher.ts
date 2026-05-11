import apiFetch from './client'
import type { ContactRequest } from './types'

export function getContactRequests(): Promise<ContactRequest[]> {
  return apiFetch<ContactRequest[]>('/api/teacher/requests')
}

export function markAsAttended(requestId: string): Promise<ContactRequest> {
  return apiFetch<ContactRequest>(`/api/teacher/requests/${requestId}/attend`, {
    method: 'PATCH',
  })
}
