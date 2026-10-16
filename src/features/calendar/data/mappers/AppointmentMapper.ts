import type {
  Appointment,
  AppointmentDraft,
  AppointmentPatch,
  AppointmentStatus,
} from '../../domain/entities/Appointment'

/** Fila tal como la devuelve la tabla `appointments` de Supabase. */
export interface AppointmentRow {
  id: string
  patient_id: string | null
  patient_name: string
  appointment_type: string
  description: string
  amount: number | string
  start_at: string
  end_at: string
  status: AppointmentStatus
}

export function toAppointment(row: AppointmentRow): Appointment {
  return {
    id: row.id,
    patientId: row.patient_id,
    patientName: row.patient_name,
    appointmentType: row.appointment_type,
    description: row.description,
    amount: Number(row.amount),
    // `timestamptz` es un instante absoluto: `new Date(iso)` es correcto.
    start: new Date(row.start_at),
    end: new Date(row.end_at),
    status: row.status,
  }
}

export function toAppointmentRow(payload: Partial<AppointmentDraft | AppointmentPatch>) {
  const row: Record<string, unknown> = {}
  if (payload.patientId !== undefined) row.patient_id = payload.patientId
  if (payload.patientName !== undefined) row.patient_name = payload.patientName
  if (payload.appointmentType !== undefined) row.appointment_type = payload.appointmentType
  if (payload.description !== undefined) row.description = payload.description
  if (payload.amount !== undefined) row.amount = payload.amount
  if (payload.start !== undefined) row.start_at = payload.start.toISOString()
  if (payload.end !== undefined) row.end_at = payload.end.toISOString()
  if (payload.status !== undefined) row.status = payload.status
  return row
}
