import { CheckCircle2, Clock, Users } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { colors } from '../../../../core/theme/colors'
import type { SelectOption } from '../../../../shared/components'
import type { AppointmentStatus } from '../../domain/entities/Appointment'

interface AppointmentStatusMeta {
  label: string
  color: string
  background: string
  Icon: LucideIcon
}

/**
 * Fuente única de verdad del aspecto de cada estado. Antes de existir esto el
 * mapa estaba copiado en CalendarView, AppointmentTooltip y CalendarOverview,
 * y añadir un estado obligaba a tocar los tres.
 */
export const APPOINTMENT_STATUS_META: Record<AppointmentStatus, AppointmentStatusMeta> = {
  paid: { label: 'Pagada', color: colors.success, background: '#ECFDF5', Icon: CheckCircle2 },
  pending: { label: 'Pendiente', color: colors.pendingText, background: '#EFF6FF', Icon: Clock },
  no_payment: { label: 'Sin cobro', color: '#7C3AED', background: '#F5F3FF', Icon: Users },
}

/** Orden en que aparecen los estados en la leyenda. */
export const APPOINTMENT_STATUS_ORDER: AppointmentStatus[] = [
  'paid',
  'pending',
  'no_payment',
]

export function appointmentStatusMeta(status: AppointmentStatus): AppointmentStatusMeta {
  return APPOINTMENT_STATUS_META[status]
}

/** Opciones del selector de estado, solo usado al editar una cita. */
export const APPOINTMENT_STATUS_OPTIONS: SelectOption[] = APPOINTMENT_STATUS_ORDER.map(
  (status) => ({
    value: status,
    label: APPOINTMENT_STATUS_META[status].label,
  }),
)