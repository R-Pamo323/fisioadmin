import type { Appointment } from '../../../calendar/domain/entities/Appointment'
import type { Patient } from '../../domain/entities/Patient'

/**
 * Estado de pago del paciente, derivado de la cita más reciente que tiene en el
 * calendario. El paciente ya no guarda el estado: se calcula al leerlo.
 */
export type PatientStatus = 'pendiente' | 'pagado' | 'sin_tratamiento'

/** Paciente con su tratamiento y estado, calculados desde sus citas. */
export interface PatientView extends Patient {
  /** Tipo de la cita más reciente; cadena vacía si el paciente no tiene citas. */
  treatment: string
  status: PatientStatus
  /** Cita más reciente; sirve para marcar el tratamiento como pagado. */
  latestAppointment: Appointment | null
}

/**
 * Cita más reciente del paciente por fecha de inicio. Las reuniones no cuentan
 * porque no tienen paciente (`patientId === null`).
 */
export function selectLatestPatientAppointment(
  appointments: ReadonlyArray<Appointment>,
  patientId: string,
): Appointment | null {
  let latest: Appointment | null = null

  for (const appointment of appointments) {
    if (appointment.patientId !== patientId) continue
    if (!latest || appointment.start.getTime() > latest.start.getTime()) {
      latest = appointment
    }
  }

  return latest
}

/**
 * Una cita de pago pendiente deja al paciente "pendiente"; una pagada, "pagado".
 * Una cita gratis no genera cobro y un paciente sin citas tampoco tiene nada que
 * pagar: en ambos casos queda "sin tratamiento".
 */
export function resolvePatientStatus(latest: Appointment | null): PatientStatus {
  if (!latest) return 'sin_tratamiento'
  if (latest.status === 'paid') return 'pagado'
  if (latest.status === 'pending') return 'pendiente'
  return 'sin_tratamiento'
}

export function toPatientView(
  patient: Patient,
  appointments: ReadonlyArray<Appointment>,
): PatientView {
  const latestAppointment = selectLatestPatientAppointment(appointments, patient.id)

  return {
    ...patient,
    treatment: latestAppointment?.appointmentType ?? '',
    status: resolvePatientStatus(latestAppointment),
    latestAppointment,
  }
}
