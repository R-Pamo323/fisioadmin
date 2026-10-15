import type { StatisticsOverview, Transaction } from '../../domain/entities/Statistics'
import type { StatisticsRepository } from '../../domain/repositories/StatisticsRepository'
import {
  buildStatisticsOverview,
  selectTransactions,
} from '../../domain/statisticsSelectors'
import { MockAppointmentRepository } from '../../../calendar/data/repositories/MockAppointmentRepository'
import { MockExpenseRepository } from '../../../calendar/data/repositories/MockExpenseRepository'

/*
 * Las estadísticas no tienen mocks propios: se derivan de las citas y los
 * gastos. Se leen por sus repositorios públicos (no importando sus datasources),
 * igual que hace el calendario con el catálogo.
 */
const appointmentRepository = new MockAppointmentRepository()
const expenseRepository = new MockExpenseRepository()

export class MockStatisticsRepository implements StatisticsRepository {
  async getOverview(year: number): Promise<StatisticsOverview> {
    const [appointments, expenses] = await Promise.all([
      appointmentRepository.list(),
      expenseRepository.list(),
    ])

    return buildStatisticsOverview(appointments, expenses, year)
  }

  async getTransactions(year: number): Promise<Transaction[]> {
    const appointments = await appointmentRepository.list()
    return selectTransactions(appointments, year)
  }
}
