import type { ReactNode } from 'react'
import { AlertTriangle, X } from 'lucide-react'
import { colors } from '../../../../core/theme/colors'
import { Button, Modal } from '../../../../shared/components'
import styles from './DeleteConfirmModal.module.css'

interface DeleteConfirmModalProps {
  open: boolean
  /** Título de la acción, p. ej. "Eliminar cita". */
  title: string
  /** Mensaje de contexto: el nombre del elemento y su fecha/hora. */
  message: ReactNode
  isDeleting: boolean
  onConfirm: () => void
  onClose: () => void
}

/**
 * Confirmación de borrado compartida por citas y gastos: solo cambian el
 * título y el mensaje, así que la carcasa vive aquí.
 */
export function DeleteConfirmModal({
  open,
  title,
  message,
  isDeleting,
  onConfirm,
  onClose,
}: DeleteConfirmModalProps) {
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

        <h3 className={styles.title}>{title}</h3>
        <p className={styles.text}>{message}</p>

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
