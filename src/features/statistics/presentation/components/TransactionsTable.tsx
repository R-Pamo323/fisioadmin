import { Badge } from '../../../../shared/components'
import type { Transaction } from '../../domain/entities/Statistics'
import {
  TRANSACTION_COLUMNS,
  TRANSACTION_STATUS_META,
  formatCurrency,
  formatShortDate,
} from './statisticsMeta'
import styles from './TransactionsTable.module.css'

interface TransactionsTableProps {
  transactions: Transaction[]
  /**
   * `compact` para el card angosto, que se desborda en X con scroll.
   * `roomy` para el modal ancho: columnas elásticas que nunca desbordan.
   */
  variant?: 'compact' | 'roomy'
}

/**
 * Tabla de transacciones sin contenedor de scroll propio: cada padre decide
 * cómo desborda (el card en X, el modal en Y). Garantiza columnas idénticas.
 */
export function TransactionsTable({
  transactions,
  variant = 'compact',
}: TransactionsTableProps) {
  return (
    <div
      className={[styles.table, variant === 'roomy' ? styles.roomy : '']
        .filter(Boolean)
        .join(' ')}
    >
      <div className={styles.headRow}>
        {TRANSACTION_COLUMNS.map((column) => (
          <span key={column} className={styles.headCell}>
            {column}
          </span>
        ))}
      </div>

      {transactions.map((transaction) => {
        const status = TRANSACTION_STATUS_META[transaction.status]

        return (
          <div key={transaction.id} className={styles.row}>
            <span className={styles.patient} data-label={TRANSACTION_COLUMNS[0]}>
              {transaction.patient}
            </span>
            <span className={styles.type} data-label={TRANSACTION_COLUMNS[1]}>
              {transaction.appointmentType}
            </span>
            <span className={styles.date} data-label={TRANSACTION_COLUMNS[2]}>
              {formatShortDate(transaction.date)}
            </span>
            <strong className={styles.amount} data-label={TRANSACTION_COLUMNS[3]}>
              {formatCurrency(transaction.amount)}
            </strong>
            <span className={styles.status} data-label={TRANSACTION_COLUMNS[4]}>
              <Badge tone={status.tone}>{status.label}</Badge>
            </span>
          </div>
        )
      })}
    </div>
  )
}