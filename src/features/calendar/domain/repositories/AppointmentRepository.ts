import type {
  Appointment,
  AppointmentDraft,
  AppointmentPatch,
} from '../entities/Appointment'

export interface AppointmentRepository {
  list(): Promise<Appointment[]>
  create(draft: AppointmentDraft): Promise<Appointment>
  update(id: string, patch: AppointmentPatch): Promise<Appointment>
  remove(id: string): Promise<void>
}