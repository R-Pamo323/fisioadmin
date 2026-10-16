import { useState } from 'react'
import { SectionHeader } from '../../../../shared/components'
import { AppointmentShareChart } from '../components/AppointmentShareChart'
import { PaymentStatusChart } from '../components/PaymentStatusChart'
import { RecentTransactions } from '../components/RecentTransactions'
import { RevenueBarChart } from '../components/RevenueBarChart'
import { StatCard } from '../components/StatCard'
import { TransactionsModal } from '../components/TransactionsModal'
import { YearSelector } from '../components/YearSelector'
import { useStatistics } from '../hooks/useStatistics'
import { useTransactions } from '../hooks/useTransactions'
import styles from './Statistics.module.css'

const currentYear = new Date().getFullYear()

export function Statistics() {
  const [selectedYear, setSelectedYear] = useState(currentYear)
  const [isTransactionsOpen, setIsTransactionsOpen] = useState(false)
  /** Cambia en cada apertura para reiniciar la página del modal. */
  const [transactionsSession, setTransactionsSession] = useState(0)
  /** Filtro de mes independiente por panel; `null` es todo el año. */
  const [shareMonth, setShareMonth] = useState<number | null>(null)
  const [transactionsMonth, setTransactionsMonth] = useState<number | null>(null)
  const [paymentsMonth, setPaymentsMonth] = useState<number | null>(null)
  const { overview, isLoading } = useStatistics(selectedYear)
  const { transactions, isLoading: isTransactionsLoading } = useTransactions(
    selectedYear,
    isTransactionsOpen,
  )

  // Al cambiar de año se vuelve a "Todo el año" en los tres filtros. Se ajusta
  // durante el render (patrón de React) para no encadenar un efecto.
  const [trackedYear, setTrackedYear] = useState(selectedYear)
  if (trackedYear !== selectedYear) {
    setTrackedYear(selectedYear)
    setShareMonth(null)
    setTransactionsMonth(null)
    setPaymentsMonth(null)
  }

  // Mientras carga el primer resumen, el selector ya permite ver el año pasado.
  const years = overview?.years ?? [currentYear - 1, currentYear]

  const openTransactions = () => {
    setTransactionsSession((session) => session + 1)
    setIsTransactionsOpen(true)
  }

  const closeTransactions = () => setIsTransactionsOpen(false)

  if (isLoading || !overview) {
    return (
      <div className={styles.page}>
        <p className={styles.loading}>Cargando estadísticas...</p>
      </div>
    )
  }

  const shareData =
    shareMonth === null ? overview.appointmentShare : overview.appointmentShareByMonth[shareMonth]
  const paymentsData =
    paymentsMonth === null ? overview.payments : overview.paymentsByMonth[paymentsMonth]
  const transactionsData =
    transactionsMonth === null
      ? overview.transactions
      : overview.transactionsByMonth[transactionsMonth]

  return (
    <div className={styles.page}>
      <SectionHeader
        title="Estadísticas"
        subtitle="Monitoriza la salud financiera de tu clínica"
        actions={
          <YearSelector
            year={selectedYear}
            minYear={years[0]}
            maxYear={years[years.length - 1]}
            onChange={setSelectedYear}
          />
        }
      />

      <div className={styles.metrics}>
        {overview.metrics.map((metric) => (
          <StatCard key={metric.id} metric={metric} />
        ))}
      </div>

      <div className={styles.grid}>
        <RevenueBarChart data={overview.monthly} />
        <AppointmentShareChart
          data={shareData}
          month={shareMonth}
          onMonthChange={setShareMonth}
        />
      </div>

      <div className={styles.grid}>
        <RecentTransactions
          transactions={transactionsData}
          month={transactionsMonth}
          onMonthChange={setTransactionsMonth}
          onViewAll={openTransactions}
        />
        <PaymentStatusChart
          data={paymentsData}
          month={paymentsMonth}
          onMonthChange={setPaymentsMonth}
        />
      </div>

      <TransactionsModal
        key={transactionsSession}
        open={isTransactionsOpen}
        transactions={transactions}
        isLoading={isTransactionsLoading}
        onClose={closeTransactions}
      />
    </div>
  )
}