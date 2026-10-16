/**
 * Monto crudo "S/50", el formato con el que se listan precios en la app.
 * Los reportes usan decimales y agrupación de miles: ese formateo vive en el
 * dominio de estadísticas, no aquí.
 */
export function formatSoles(amount: number): string {
  return `S/${amount}`
}
