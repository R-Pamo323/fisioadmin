import type { StatisticsOverview, Transaction } from '../../domain/entities/Statistics'
import type { StatisticsRepository } from '../../domain/repositories/StatisticsRepository'
import { mockStatistics } from '../datasources/mockStatistics'

export class MockStatisticsRepository implements StatisticsRepository {
  getOverview(): Promise<StatisticsOverview> {
    return Promise.resolve(mockStatistics.getOverview())
  }

  getTransactions(): Promise<Transaction[]> {
    return Promise.resolve(mockStatistics.getTransactions())
  }
}