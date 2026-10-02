import { Clock, Pencil, Tag, Trash2, UserX } from 'lucide-react'
import { Button } from '../../../../shared/components'
import type { Appointment } from '../../domain/entities/Appointment'
import { appointmentStatusMeta } from './appointmentStatusMeta'
import styles from './AppointmentTooltip.module.css'

export interface TooltipState {
  appointment: Appointment
  x: number
  y: number
}

interface AppointmentTooltipProps {
  tooltip: TooltipState
  onClose: () => void
  onEdit: (appointment: Appointment) => void
  onDelete: (appointment: Appointment) => void
}

const formatTime = (date: Date): string =>
  new Intl.DateTimeFormat('es-ES', { hour: '2-digit', minute: '2-digit' }).format(date)

export function AppointmentTooltip({
  tooltip,
  onClose,
  onEdit,
  onDelete,
}: AppointmentTooltipProps) {
  const { appointment, x, y } = tooltip
  const status = appointmentStatusMeta(appointment.status)

  const left = Math.max(8, Math.min(x + 16, window.innerWidth - 288))
  const top = Math.max(8, Math.min(y + 16, window.innerHeight - 300))

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
            style={{ color: status.color, background: status.background }}
          >
            {status.label}
          </span>
        </div>
        <div className={styles.rows}>
          <div className={styles.row}>
            <Clock size={15} className={styles.rowIcon} />
            <span>
              {formatTime(appointment.start)} – {formatTime(appointment.end)}
            </span>
          </div>
          {appointment.appointmentType ? (
            <div className={styles.row}>
              <Tag size={15} className={styles.rowIcon} />
              <span>{appointment.appointmentType}</span>
            </div>
          ) : (
            <div className={styles.row}>
              <UserX size={15} className={styles.rowIcon} />
              <span>Sin paciente asignado</span>
            </div>
          )}
        </div>

        <div className={styles.actions}>
          <Button
            variant="secondary"
            onClick={() => onEdit(appointment)}
            className={styles.actionBtn}
          >
            <Pencil size={14} />
            Editar
          </Button>
          <Button
            variant="danger"
            onClick={() => onDelete(appointment)}
            className={styles.actionBtn}
          >
            <Trash2 size={14} />
            Eliminar
          </Button>
        </div>
      </div>
    </>
  )
}