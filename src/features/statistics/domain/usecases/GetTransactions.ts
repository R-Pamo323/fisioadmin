import type { Transaction } from '../../domain/entities/Statistics'
import type { StatisticsRepository } from '../../domain/repositories/StatisticsRepository'

export class GetTransactions {
  private readonly repository: StatisticsRepository

  constructor(repository: StatisticsRepository) {
    this.repository = repository
  }

  execute(): Promise<Transaction[]> {
    return this.repository.getTransactions()
  }
}