import type { StatisticsOverview, Transaction } from '../../domain/entities/Statistics'
import type { StatisticsRepository } from '../../domain/repositories/StatisticsRepository'
import {
  buildStatisticsOverview,
  selectTransactions,
} from '../../domain/statisticsSelectors'
import { SupabaseAppointmentRepository } from '../../../calendar/data/repositories/SupabaseAppointmentRepository'
import { SupabaseExpenseRepository } from '../../../calendar/data/repositories/SupabaseExpenseRepository'

/*
 * Las estadísticas no tienen tabla propia: se derivan de las citas y los gastos,
 * igual que en el mock. Se reutilizan los selectores de dominio, así que la
 * lógica de negocio (años, meses, repartos) no se duplica.
 */
const appointmentRepository = new SupabaseAppointmentRepository()
const expenseRepository = new SupabaseExpenseRepository()

export class SupabaseStatisticsRepository implements StatisticsRepository {
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
