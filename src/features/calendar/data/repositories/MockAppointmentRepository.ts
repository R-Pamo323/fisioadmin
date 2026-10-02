import type {
  Appointment,
  AppointmentDraft,
  AppointmentPatch,
} from '../../domain/entities/Appointment'
import type { AppointmentRepository } from '../../domain/repositories/AppointmentRepository'
import { mockAppointments } from '../datasources/mockAppointments'

export class MockAppointmentRepository implements AppointmentRepository {
  list(): Promise<Appointment[]> {
    return Promise.resolve(mockAppointments.list())
  }

  create(draft: AppointmentDraft): Promise<Appointment> {
    return Promise.resolve(mockAppointments.create(draft))
  }

  update(id: string, patch: AppointmentPatch): Promise<Appointment> {
    const updated = mockAppointments.update(id, patch)

    if (!updated) {
      return Promise.reject(new Error(`No existe la cita ${id}`))
    }

    return Promise.resolve(updated)
  }

  remove(id: string): Promise<void> {
    mockAppointments.remove(id)
    return Promise.resolve()
  }
}