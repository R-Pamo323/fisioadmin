import { Gift, Receipt, TrendingUp, Users } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { colors } from '../../../../core/theme/colors'
import type { ServiceCategory } from '../../../appointment-types/domain/entities/ServiceType'

export interface AppointmentCategoryMeta {
  label: string
  color: string
  background: string
  Icon: LucideIcon
}

/**
 * Aspecto de cada categoría de tipo de cita en el calendario. Es la contraparte
 * de CATEGORY_META (Tipos de cita): los colores son los mismos, pero aquí se
 * usan para el borde y el fondo del evento, no para un badge.
 */
export const APPOINTMENT_CATEGORY_META: Record<ServiceCategory, AppointmentCategoryMeta> = {
  beneficios: { label: 'Beneficios', color: colors.success, background: '#ECFDF5', Icon: TrendingUp },
  gastos: { label: 'Gastos', color: colors.error, background: '#FEF2F2', Icon: Receipt },
  gratis: { label: 'Gratis', color: '#F59E0B', background: '#FFFBEB', Icon: Gift },
}

/**
 * Una reunión o tarea interna no tiene tipo de cita y por tanto no tiene
 * categoría. Se mantiene el morado que ya usaba el estado "Sin cobro".
 */
export const UNCATEGORIZED_APPOINTMENT_META: AppointmentCategoryMeta = {
  label: 'Reunión',
  color: '#7C3AED',
  background: '#F5F3FF',
  Icon: Users,
}

/** Resuelve la meta a partir de la categoría, o la de reunión si no hay. */
export function appointmentCategoryMeta(
  category: ServiceCategory | null,
): AppointmentCategoryMeta {
  return category ? APPOINTMENT_CATEGORY_META[category] : UNCATEGORIZED_APPOINTMENT_META
}
