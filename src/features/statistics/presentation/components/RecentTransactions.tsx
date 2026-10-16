import { ArrowRight } from 'lucide-react'
import { Card } from '../../../../shared/components'
import type { Transaction } from '../../domain/entities/Statistics'
import { MonthFilter } from './MonthFilter'
import { TransactionsTable } from './TransactionsTable'
import styles from './RecentTransactions.module.css'

/** Cuántas filas caben en el card; el modal muestra la lista completa. */
const RECENT_TRANSACTIONS_COUNT = 5

interface RecentTransactionsProps {
  transactions: Transaction[]
  /** Mes activo (0–11) o `null` para todo el año. */
  month: number | null
  onMonthChange: (month: number | null) => void
  onViewAll: () => void
}

export function RecentTransactions({
  transactions,
  month,
  onMonthChange,
  onViewAll,
}: RecentTransactionsProps) {
  const visible = transactions.slice(0, RECENT_TRANSACTIONS_COUNT)

  return (
    <Card className={styles.card}>
      <header className={styles.head}>
        <div className={styles.headText}>
          <h3 className={styles.title}>Transacciones Recientes</h3>
          <p className={styles.subtitle}>Últimos movimientos registrados en el sistema</p>
        </div>

        <div className={styles.controls}>
          <MonthFilter value={month} onChange={onMonthChange} />

          <button type="button" className={styles.link} onClick={onViewAll}>
            Ver todo
            <ArrowRight size={14} />
          </button>
        </div>
      </header>

      <div className={styles.tableScroll}>
        {visible.length > 0 ? (
          <TransactionsTable transactions={visible} />
        ) : (
          <p className={styles.empty}>
            {month === null ? 'Sin transacciones en este año' : 'Sin transacciones en este mes'}
          </p>
        )}
      </div>
    </Card>
  )
}
