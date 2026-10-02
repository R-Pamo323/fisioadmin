import { AlertTriangle, X } from 'lucide-react'
import { colors } from '../../../../core/theme/colors'
import { Button, Modal } from '../../../../shared/components'
import type { Appointment } from '../../domain/entities/Appointment'
import styles from './DeleteAppointmentModal.module.css'

const formatTime = (date: Date): string =>
  new Intl.DateTimeFormat('es-ES', {
    weekday: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)

interface DeleteAppointmentModalProps {
  open: boolean
  /** Cita que se va a eliminar; null cuando el modal está cerrado. */
  appointment: Appointment | null
  isDeleting: boolean
  onConfirm: () => void
  onClose: () => void
}

export function DeleteAppointmentModal({
  open,
  appointment,
  isDeleting,
  onConfirm,
  onClose,
}: DeleteAppointmentModalProps) {
  if (!appointment) return null

  return (
    <Modal open={open} onRequestClose={onClose} size="sm">
      <div className={styles.body}>
        <div className={styles.header}>
          <span className={styles.icon}>
            <AlertTriangle size={20} />
          </span>
          <button
            type="button"
            className={styles.close}
            onClick={onClose}
            aria-label="Cerrar"
            style={{ color: colors.textSecondary }}
          >
            <X size={18} />
          </button>
        </div>

        <h3 className={styles.title}>Eliminar cita</h3>
        <p className={styles.text}>
          Vas a eliminar <strong>{appointment.patientName}</strong> del{' '}
          {formatTime(appointment.start)}. Esta acción no se puede deshacer.
        </p>

        <div className={styles.actions}>
          <Button variant="secondary" onClick={onClose} disabled={isDeleting}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={onConfirm} disabled={isDeleting}>
            {isDeleting ? 'Eliminando…' : 'Eliminar'}
          </Button>
        </div>
      </div>
    </Modal>
  )
}