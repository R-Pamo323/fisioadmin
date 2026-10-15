import type { StatisticsOverview } from '../entities/Statistics'
import type { StatisticsRepository } from '../repositories/StatisticsRepository'

export class GetStatisticsOverview {
  private readonly repository: StatisticsRepository

  constructor(repository: StatisticsRepository) {
    this.repository = repository
  }

  execute(year: number): Promise<StatisticsOverview> {
    return this.repository.getOverview(year)
  }
}