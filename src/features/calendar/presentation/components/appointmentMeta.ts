import type { ServiceCategory } from '../../../appointment-types/domain/entities/ServiceType'

/**
 * Precio del tipo tal como se lista al elegir cita: los tipos gratis no tienen
 * precio, así que se muestran como "Gratis" en vez de "S/0".
 */
export function formatServiceTypePrice(category: ServiceCategory, price: number): string {
  return category === 'gratis' ? 'Gratis' : `S/${price}`
}

/** Monto cobrado de una cita: "S/50". */
export function formatAppointmentAmount(amount: number): string {
  return `S/${amount}`
}
