import apiFetch from './client'
import type { CatalogData } from './types'

export function getCatalog(): Promise<CatalogData> {
  return apiFetch<CatalogData>('/api/catalog')
}
