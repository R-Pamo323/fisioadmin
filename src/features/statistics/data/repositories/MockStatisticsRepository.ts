import type { StatisticsOverview, Transaction } from '../../domain/entities/Statistics'
import type { StatisticsRepository } from '../../domain/repositories/StatisticsRepository'
import {
  buildStatisticsOverview,
  selectTransactions,
} from '../../domain/statisticsSelectors'
import { MockAppointmentRepository } from '../../../calendar/data/repositories/MockAppointmentRepository'
import { MockExpenseRepository } from '../../../calendar/data/repositories/MockExpenseRepository'
import { MockPatientRepository } from '../../../patients/data/repositories/MockPatientRepository'

/*
 * Las estadísticas ya no tienen mocks propios: se derivan de las citas, los
 * gastos y los pacientes. Se leen por sus repositorios públicos (no importando
 * sus datasources), igual que hace el calendario con el catálogo.
 */
const appointmentRepository = new MockAppointmentRepository()
const expenseRepository = new MockExpenseRepository()
const patientRepository = new MockPatientRepository()

export class MockStatisticsRepository implements StatisticsRepository {
  async getOverview(): Promise<StatisticsOverview> {
    const [appointments, expenses, patients] = await Promise.all([
      appointmentRepository.list(),
      expenseRepository.list(),
      patientRepository.list(),
    ])

    return buildStatisticsOverview(appointments, patients, expenses)
  }

  async getTransactions(): Promise<Transaction[]> {
    const appointments = await appointmentRepository.list()
    return selectTransactions(appointments)
  }
}
