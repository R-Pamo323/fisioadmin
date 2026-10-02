import type { Appointment, AppointmentStatus } from './entities/Appointment'

function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  )
}

/**
 * Selectores puros: reciben el array de citas en vez de leer el datasource, para
 * que la pantalla reaccione a las citas que se crean desde el formulario.
 */

export function selectTodayAppointments(
  appointments: Appointment[],
  now: Date = new Date(),
): Appointment[] {
  return appointments
    .filter((appointment) => isSameDay(appointment.start, now))
    .sort((a, b) => a.start.getTime() - b.start.getTime())
}

export function selectNextAppointment(
  appointments: Appointment[],
  now: Date = new Date(),
): Appointment | null {
  const upcoming = selectTodayAppointments(appointments, now).filter(
    (appointment) => appointment.end > now,
  )
  return upcoming[0] ?? null
}

export interface WeekPaymentCounts {
  paid: number
  pending: number
  no_payment: number
}

/** Semana natural, de lunes a domingo, en la zona horaria local. */
export function selectWeekPaymentCounts(
  appointments: Appointment[],
  now: Date = new Date(),
): WeekPaymentCounts {
  const monday = new Date(now)
  monday.setDate(now.getDate() - ((now.getDay() + 6) % 7))
  monday.setHours(0, 0, 0, 0)

  const weekEnd = new Date(monday)
  weekEnd.setDate(monday.getDate() + 7)

  const counts: Record<AppointmentStatus, number> = {
    paid: 0,
    pending: 0,
    no_payment: 0,
  }

  for (const appointment of appointments) {
    if (appointment.start >= monday && appointment.start < weekEnd) {
      counts[appointment.status] += 1
    }
  }

  return counts
}