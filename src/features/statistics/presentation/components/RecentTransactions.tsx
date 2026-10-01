import { ArrowRight } from 'lucide-react'
import { Card } from '../../../../shared/components'
import type { Transaction } from '../../domain/entities/Statistics'
import { TransactionsTable } from './TransactionsTable'
import styles from './RecentTransactions.module.css'

interface RecentTransactionsProps {
  transactions: Transaction[]
  onViewAll: () => void
}

export function RecentTransactions({ transactions, onViewAll }: RecentTransactionsProps) {
  return (
    <Card className={styles.card}>
      <header className={styles.head}>
        <div className={styles.headText}>
          <h3 className={styles.title}>Transacciones Recientes</h3>
          <p className={styles.subtitle}>Últimos movimientos registrados en el sistema</p>
        </div>

        <button type="button" className={styles.link} onClick={onViewAll}>
          Ver todo
          <ArrowRight size={14} />
        </button>
      </header>

      <div className={styles.tableScroll}>
        <TransactionsTable transactions={transactions} />
      </div>
    </Card>
  )
}