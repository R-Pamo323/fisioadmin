import type { StatisticsOverview, Transaction } from '../entities/Statistics'

export interface StatisticsRepository {
  /** Resumen del año indicado; incluye los años navegables del selector. */
  getOverview(year: number): Promise<StatisticsOverview>
  /** Lista completa de transacciones del año; el overview solo trae las más recientes. */
  getTransactions(year: number): Promise<Transaction[]>
}
