/** Hora corta "09:00", la que usan la grilla del calendario y los tooltips. */
export function formatHourMinute(date: Date): string {
  return new Intl.DateTimeFormat('es-ES', { hour: '2-digit', minute: '2-digit' }).format(date)
}

/** Valor de <input type="date">: "YYYY-MM-DD", calculado en local (sin zona). */
export function toDateInputValue(date: Date): string {
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${date.getFullYear()}-${month}-${day}`
}
