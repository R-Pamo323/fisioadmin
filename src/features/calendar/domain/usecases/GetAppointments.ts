import type { Appointment } from '../entities/Appointment'
import type { AppointmentRepository } from '../repositories/AppointmentRepository'

export class GetAppointments {
  private readonly repository: AppointmentRepository

  constructor(repository: AppointmentRepository) {
    this.repository = repository
  }

  execute(): Promise<Appointment[]> {
    return this.repository.list()
  }
}