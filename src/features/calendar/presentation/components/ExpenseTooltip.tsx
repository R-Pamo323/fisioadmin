import { CalendarDays, Clock, FileText, Pencil, Receipt, Trash2 } from 'lucide-react'
import { Button } from '../../../../shared/components'
import type { Expense } from '../../domain/entities/Expense'
import { EXPENSE_META, formatExpenseAmount, formatExpenseDate } from './expenseMeta'
import styles from './ExpenseTooltip.module.css'

export interface ExpenseTooltipState {
  expense: Expense
  x: number
  y: number
}

interface ExpenseTooltipProps {
  tooltip: ExpenseTooltipState
  onClose: () => void
  onEdit: (expense: Expense) => void
  onDelete: (expense: Expense) => void
}

export function ExpenseTooltip({ tooltip, onClose, onEdit, onDelete }: ExpenseTooltipProps) {
  const { expense, x, y } = tooltip

  const left = Math.max(8, Math.min(x + 16, window.innerWidth - 288))
  const top = Math.max(8, Math.min(y + 16, window.innerHeight - 300))

  return (
    <>
      <div className={styles.backdrop} onMouseDown={onClose} />
      <div
        className={styles.tooltip}
        style={{ left, top }}
        role="dialog"
        aria-label="Detalle del gasto"
      >
        <div className={styles.header}>
          <strong className={styles.title}>{expense.title}</strong>
          <span
            className={styles.tag}
            style={{ color: EXPENSE_META.color, background: EXPENSE_META.background }}
          >
            {EXPENSE_META.label}
          </span>
        </div>
        <div className={styles.rows}>
          <div className={styles.row}>
            <CalendarDays size={15} className={styles.rowIcon} />
            <span>{formatExpenseDate(expense.date)}</span>
            {expense.time ? (
              <>
                <Clock size={15} className={styles.rowIcon} />
                <span>{expense.time}</span>
              </>
            ) : null}
          </div>
          <div className={styles.row}>
            <Receipt size={15} className={styles.rowIcon} />
            <strong
              style={{
                color: expense.amount === 0 ? '#111827' : EXPENSE_META.color,
              }}
            >
              {formatExpenseAmount(expense.amount)}
            </strong>
          </div>
          {expense.description.trim() !== '' ? (
            <div className={styles.row}>
              <FileText size={15} className={styles.rowIcon} />
              <span className={styles.description}>{expense.description}</span>
            </div>
          ) : null}
        </div>

        <div className={styles.actions}>
          <Button variant="secondary" onClick={() => onEdit(expense)} className={styles.actionBtn}>
            <Pencil size={14} />
            Editar
          </Button>
          <Button variant="danger" onClick={() => onDelete(expense)} className={styles.actionBtn}>
            <Trash2 size={14} />
            Eliminar
          </Button>
        </div>
      </div>
    </>
  )
}