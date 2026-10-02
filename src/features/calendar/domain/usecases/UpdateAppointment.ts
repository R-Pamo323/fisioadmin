import type { Appointment, AppointmentPatch } from '../entities/Appointment'
import type { AppointmentRepository } from '../repositories/AppointmentRepository'

export class UpdateAppointment {
  private readonly repository: AppointmentRepository

  constructor(repository: AppointmentRepository) {
    this.repository = repository
  }

  execute(id: string, patch: AppointmentPatch): Promise<Appointment> {
    const normalized: AppointmentPatch = {
      ...patch,
      ...(patch.patientName !== undefined ? { patientName: patch.patientName.trim() } : {}),
      ...(patch.appointmentType !== undefined
        ? { appointmentType: patch.appointmentType.trim() }
        : {}),
    }

    return this.repository.update(id, normalized)
  }
}