import { CheckCircle2, Clock, MapPin } from 'lucide-react'
import { colors } from '../../../../core/theme/colors'
import type { Appointment } from '../../domain/entities/Appointment'
import styles from './AppointmentTooltip.module.css'

export interface TooltipState {
  appointment: Appointment
  x: number
  y: number
}

interface AppointmentTooltipProps {
  tooltip: TooltipState
  onClose: () => void
}

const formatTime = (date: Date): string =>
  new Intl.DateTimeFormat('es-ES', { hour: '2-digit', minute: '2-digit' }).format(date)

export function AppointmentTooltip({ tooltip, onClose }: AppointmentTooltipProps) {
  const { appointment, x, y } = tooltip
  const isPaid = appointment.status === 'paid'
  const statusColor = isPaid ? colors.success : colors.pendingText
  const statusBg = isPaid ? '#ECFDF5' : '#EFF6FF'

  const left = Math.max(8, Math.min(x + 16, window.innerWidth - 288))
  const top = Math.max(8, Math.min(y + 16, window.innerHeight - 240))

  return (
    <>
      <div className={styles.backdrop} onMouseDown={onClose} />
      <div
        className={styles.tooltip}
        style={{ left, top }}
        role="dialog"
        aria-label="Detalle de la cita"
      >
        <div className={styles.header}>
          <strong className={styles.patient}>{appointment.patientName}</strong>
          <span
            className={styles.status}
            style={{ color: statusColor, background: statusBg }}
          >
            {isPaid ? 'Pagada' : 'Pendiente'}
          </span>
        </div>
        <div className={styles.rows}>
          <div className={styles.row}>
            <Clock size={15} className={styles.rowIcon} />
            <span>
              {formatTime(appointment.start)} – {formatTime(appointment.end)}
            </span>
          </div>
          <div className={styles.row}>
            <CheckCircle2 size={15} className={styles.rowIcon} />
            <span>{appointment.appointmentType}</span>
          </div>
          <div className={styles.row}>
            <MapPin size={15} className={styles.rowIcon} />
            <span>{appointment.location}</span>
          </div>
        </div>
      </div>
    </>
  )
}