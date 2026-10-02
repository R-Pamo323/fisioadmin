import type { Appointment, AppointmentDraft } from '../entities/Appointment'
import type { AppointmentRepository } from '../repositories/AppointmentRepository'

export class CreateAppointment {
  private readonly repository: AppointmentRepository

  constructor(repository: AppointmentRepository) {
    this.repository = repository
  }

  execute(draft: AppointmentDraft): Promise<Appointment> {
    const normalized: AppointmentDraft = {
      ...draft,
      patientName: draft.patientName.trim(),
      appointmentType: draft.appointmentType.trim(),
    }

    return this.repository.create(normalized)
  }
}