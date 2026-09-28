import type { Appointment } from '../../domain/entities/Appointment'

function atTime(date: Date, hours: number, minutes = 0): Date {
  const result = new Date(date)
  result.setHours(hours, minutes, 0, 0)
  return result
}

function dayOffset(offsetDays: number): Date {
  const date = new Date()
  date.setDate(date.getDate() + offsetDays)
  date.setHours(0, 0, 0, 0)
  return date
}

export const MOCK_TODAY_LOCATION = 'Box 01'

export const mockAppointments: Appointment[] = [
  {
    id: 'a1',
    patientName: 'María García',
    appointmentType: 'Fisioterapia',
    start: atTime(dayOffset(0), 9),
    end: atTime(dayOffset(0), 10),
    status: 'paid',
    location: 'Box 01',
  },
  {
    id: 'a2',
    patientName: 'Carlos Ruiz',
    appointmentType: 'Rehabilitación',
    start: atTime(dayOffset(0), 10, 30),
    end: atTime(dayOffset(0), 11, 30),
    status: 'pending',
    location: 'Box 02',
  },
  {
    id: 'a3',
    patientName: 'Laura Sánchez',
    appointmentType: 'Quiromasaje',
    start: atTime(dayOffset(0), 12),
    end: atTime(dayOffset(0), 13),
    status: 'paid',
    location: 'Box 03',
  },
  {
    id: 'a4',
    patientName: 'Pablo Gómez',
    appointmentType: 'Pilates',
    start: atTime(dayOffset(0), 16),
    end: atTime(dayOffset(0), 17),
    status: 'pending',
    location: 'Sala Grupal',
  },
  {
    id: 'a5',
    patientName: 'Ana Torres',
    appointmentType: 'Fisioterapia',
    start: atTime(dayOffset(1), 9, 30),
    end: atTime(dayOffset(1), 10, 30),
    status: 'paid',
    location: 'Box 01',
  },
  {
    id: 'a6',
    patientName: 'Jorge Díaz',
    appointmentType: 'Osteopatía',
    start: atTime(dayOffset(2), 11),
    end: atTime(dayOffset(2), 12),
    status: 'pending',
    location: 'Box 02',
  },
  {
    id: 'a7',
    patientName: 'Sofía Navarro',
    appointmentType: 'Rehabilitación',
    start: atTime(dayOffset(3), 15),
    end: atTime(dayOffset(3), 16),
    status: 'paid',
    location: 'Box 03',
  },
  {
    id: 'a8',
    patientName: 'Raúl Méndez',
    appointmentType: 'Quiromasaje',
    start: atTime(dayOffset(4), 10),
    end: atTime(dayOffset(4), 11),
    status: 'paid',
    location: 'Box 01',
  },
]

function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  )
}

export function getTodayAppointments(): Appointment[] {
  const today = new Date()
  return mockAppointments
    .filter((appointment) => isSameDay(appointment.start, today))
    .sort((a, b) => a.start.getTime() - b.start.getTime())
}

export function getNextAppointment(): Appointment | null {
  const now = new Date()
  const upcoming = getTodayAppointments().filter((appointment) => appointment.end > now)
  return upcoming[0] ?? null
}

export function getWeekPayments(): { paid: number; pending: number } {
  const today = new Date()
  const day = today.getDay()
  const monday = atTime(dayOffset(0), 0)
  monday.setDate(today.getDate() - ((day + 6) % 7))
  monday.setHours(0, 0, 0, 0)

  const weekEnd = new Date(monday)
  weekEnd.setDate(monday.getDate() + 7)

  let paid = 0
  let pending = 0

  for (const appointment of mockAppointments) {
    if (appointment.start >= monday && appointment.start < weekEnd) {
      if (appointment.status === 'paid') paid += 1
      else pending += 1
    }
  }

  return { paid, pending }
}