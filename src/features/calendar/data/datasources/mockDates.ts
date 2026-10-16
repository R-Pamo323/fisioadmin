/**
 * Fecha desplazada desde hoy, normalizada a medianoche: base de los datos de
 * ejemplo (citas y gastos), que siempre se dibujan relativos al día de hoy.
 */
export function dayOffset(offsetDays: number): Date {
  const date = new Date()
  date.setDate(date.getDate() + offsetDays)
  date.setHours(0, 0, 0, 0)
  return date
}
