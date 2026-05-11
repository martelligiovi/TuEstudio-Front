/**
 * Decodes the payload of a JWT (middle segment) WITHOUT verifying the signature.
 * For UI use ONLY (routing, which tabs to show). NEVER for authorization.
 * The backend validates the signature on every request.
 *
 * Returns `{}` on any error — never throws.
 */
export function decodeJwtPayload(token: string): Record<string, unknown> {
  try {
    const parts = token.split('.')
    if (parts.length !== 3) return {}
    const payload = parts[1]
    // base64url → standard base64
    const base64 = payload.replace(/-/g, '+').replace(/_/g, '/')
    // Padding
    const padded = base64 + '='.repeat((4 - (base64.length % 4)) % 4)
    const json = atob(padded)
    // UTF-8 support (names with accents/ñ common in es-AR)
    const utf8 = decodeURIComponent(
      Array.from(json)
        .map((c) => '%' + c.charCodeAt(0).toString(16).padStart(2, '0'))
        .join('')
    )
    const parsed = JSON.parse(utf8)
    return typeof parsed === 'object' && parsed !== null ? parsed : {}
  } catch {
    return {}
  }
}
