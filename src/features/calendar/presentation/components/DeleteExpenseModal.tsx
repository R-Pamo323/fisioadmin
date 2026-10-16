import type { Expense } from '../../domain/entities/Expense'
import { formatExpenseAmount, formatExpenseDate } from './expenseMeta'
import { DeleteConfirmModal } from './DeleteConfirmModal'

interface DeleteExpenseModalProps {
  open: boolean
  /** Gasto que se va a eliminar; null cuando el modal está cerrado. */
  expense: Expense | null
  /** Nombre del tipo de cita (tipo de gasto); null si no resuelve. */
  serviceTypeName: string | null
  isDeleting: boolean
  onConfirm: () => void
  onClose: () => void
}

export function DeleteExpenseModal({
  open,
  expense,
  serviceTypeName,
  isDeleting,
  onConfirm,
  onClose,
}: DeleteExpenseModalProps) {
  if (!expense) return null

  return (
    <DeleteConfirmModal
      open={open}
      title="Eliminar gasto"
      message={
        <>
          Vas a eliminar <strong>{serviceTypeName ?? 'Gasto'}</strong> del{' '}
          {formatExpenseDate(expense.date)} por {formatExpenseAmount(expense.amount)}. Esta acción
          no se puede deshacer.
        </>
      }
      isDeleting={isDeleting}
      onConfirm={onConfirm}
      onClose={onClose}
    />
  )
}
