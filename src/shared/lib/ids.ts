/**
 * Genera el id en el cliente para las tablas cuyo `id` es texto. Así no depende
 * de que la columna tenga `default` en la base de datos. El prefijo identifica
 * la entidad y el resto es único.
 */
function randomToken(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }

  // Contexto sin Web Crypto (p. ej. http no seguro fuera de localhost).
  return `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 10)}`
}

export function createId(prefix: string): string {
  return `${prefix}-${randomToken()}`
}
