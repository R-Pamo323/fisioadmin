import { AlertTriangle, X } from 'lucide-react'
import { colors } from '../../../../core/theme/colors'
import { Button, Modal } from '../../../../shared/components'
import type { Expense } from '../../domain/entities/Expense'
import { formatExpenseAmount, formatExpenseDate } from './expenseMeta'
import styles from './DeleteExpenseModal.module.css'

interface DeleteExpenseModalProps {
  open: boolean
  /** Gasto que se va a eliminar; null cuando el modal está cerrado. */
  expense: Expense | null
  isDeleting: boolean
  onConfirm: () => void
  onClose: () => void
}

export function DeleteExpenseModal({
  open,
  expense,
  isDeleting,
  onConfirm,
  onClose,
}: DeleteExpenseModalProps) {
  if (!expense) return null

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

        <h3 className={styles.title}>Eliminar gasto</h3>
        <p className={styles.text}>
          Vas a eliminar <strong>{expense.title}</strong> del{' '}
          {formatExpenseDate(expense.date)} por {formatExpenseAmount(expense.amount)}. Esta acción
          no se puede deshacer.
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