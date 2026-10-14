import type {
  Appointment,
  AppointmentStatus,
} from '../../../calendar/domain/entities/Appointment'
import type { Patient } from '../../domain/entities/Patient'

/**
 * Estado de pago del paciente, derivado de la cita más reciente que tiene en el
 * calendario. El paciente ya no guarda el estado: se calcula al leerlo.
 */
export type PatientStatus = 'pendiente' | 'pagado' | 'sin_tratamiento'

/** Una sesión ya realizada, tal como se lista en el historial del paciente. */
export interface PatientSession {
  id: string
  /** Inicio de la cita en ISO; se usa para ordenar y para el texto relativo. */
  date: string
  /** Tipo de cita: el "servicio" que se muestra en el historial. */
  service: string
  notes: string
  status: AppointmentStatus
  amount: number
}

/** Paciente con su tratamiento, estado e historial, calculados desde sus citas. */
export interface PatientView extends Patient {
  /** Tipo de la cita más reciente; cadena vacía si el paciente no tiene citas. */
  treatment: string
  status: PatientStatus
  /** Cita más reciente; sirve para marcar el tratamiento como pagado. */
  latestAppointment: Appointment | null
  /** Sesiones ya realizadas, de la más reciente a la más antigua. */
  sessions: PatientSession[]
  /** Última cita pagada ya realizada, en ISO; null si no hay ninguna. */
  lastVisitAt: string | null
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

/**
 * Sesiones del paciente que ya se realizaron (`start <= now`), gratis y de
 * beneficios, de la más reciente a la más antigua. Se excluyen las reuniones por
 * no tener paciente.
 */
export function selectPatientSessions(
  appointments: ReadonlyArray<Appointment>,
  patientId: string,
  now: Date = new Date(),
): PatientSession[] {
  return appointments
    .filter(
      (appointment) =>
        appointment.patientId === patientId &&
        appointment.start.getTime() <= now.getTime(),
    )
    // `filter` devuelve un array nuevo, así que ordenar in-place no muta la entrada.
    .sort((a, b) => b.start.getTime() - a.start.getTime())
    .map((appointment) => ({
      id: appointment.id,
      date: appointment.start.toISOString(),
      service: appointment.appointmentType,
      notes: appointment.description,
      status: appointment.status,
      amount: appointment.amount,
    }))
}

export function toPatientView(
  patient: Patient,
  appointments: ReadonlyArray<Appointment>,
): PatientView {
  const latestAppointment = selectLatestPatientAppointment(appointments, patient.id)
  const sessions = selectPatientSessions(appointments, patient.id)

  return {
    ...patient,
    treatment: latestAppointment?.appointmentType ?? '',
    status: resolvePatientStatus(latestAppointment),
    latestAppointment,
    sessions,
    // La última visita es la sesión pagada más reciente; `sessions` ya viene
    // ordenado de la más nueva a la más antigua.
    lastVisitAt: sessions.find((session) => session.status === 'paid')?.date ?? null,
  }
}
