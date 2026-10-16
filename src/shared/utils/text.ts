/** Primera letra en mayúscula: "lun" → "Lun". Para etiquetas cortas de UI. */
export function capitalize(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1)
}

/**
 * Iniciales del avatar: primera letra de la primera y de la última palabra.
 * "Terapia Física" → "TF", "Carlos Ruiz López" → "CL", "Pilates" → "P",
 * "" → "?".
 */
export function getInitials(name: string): string {
  const words = name.trim().split(/\s+/).filter(Boolean)

  if (words.length === 0) return '?'

  const first = words[0].charAt(0)
  const last = words.length > 1 ? words[words.length - 1].charAt(0) : ''

  return `${first}${last}`.toLocaleUpperCase('es')
}
