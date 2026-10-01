import type { StatisticsOverview, Transaction } from '../entities/Statistics'

export interface StatisticsRepository {
  getOverview(): Promise<StatisticsOverview>
  /** Lista completa de transacciones; el overview solo trae las más recientes. */
  getTransactions(): Promise<Transaction[]>
}