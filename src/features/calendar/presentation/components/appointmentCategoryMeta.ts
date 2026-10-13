import { Gift, Receipt, TrendingUp } from 'lucide-react'
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
  gratis: { label: 'Gratis', color: '#7C3AED', background: '#F5F3FF', Icon: Gift },
}

/**
 * Las reuniones y tareas internas no tienen tipo de cita y por tanto no tienen
 * categoría. Se combinan con "gratis", así una cita sin categoría se dibuja
 * con la apariencia y el color de gratis.
 */
export function appointmentCategoryMeta(
  category: ServiceCategory | null,
): AppointmentCategoryMeta {
  return APPOINTMENT_CATEGORY_META[category ?? 'gratis']
}
