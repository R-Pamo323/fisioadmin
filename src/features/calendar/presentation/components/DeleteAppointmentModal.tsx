import type { Appointment } from '../../domain/entities/Appointment'
import { DeleteConfirmModal } from './DeleteConfirmModal'

const formatWhen = (date: Date): string =>
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
    <DeleteConfirmModal
      open={open}
      title="Eliminar cita"
      message={
        <>
          Vas a eliminar <strong>{appointment.patientName}</strong> del{' '}
          {formatWhen(appointment.start)}. Esta acción no se puede deshacer.
        </>
      }
      isDeleting={isDeleting}
      onConfirm={onConfirm}
      onClose={onClose}
    />
  )
}
