import type { AppointmentRepository } from '../repositories/AppointmentRepository'

export class DeleteAppointment {
  private readonly repository: AppointmentRepository

  constructor(repository: AppointmentRepository) {
    this.repository = repository
  }

  execute(id: string): Promise<void> {
    return this.repository.remove(id)
  }
}