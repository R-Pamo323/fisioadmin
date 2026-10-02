import type { Appointment, AppointmentDraft, AppointmentPatch } from '../../domain/entities/Appointment'

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

/*
 * Los patientId y los nombres coinciden con features/patients/data/datasources/
 * mockPatients.ts, y los tipos de cita con mockServiceTypes.ts. Las reuniones
 * llevan patientId null y status 'no_payment': no generan cobro.
 */
const SEED_APPOINTMENTS: Appointment[] = [
  {
    id: 'a1',
    patientId: 'pt-1',
    patientName: 'Carlos Ruiz',
    appointmentType: 'Terapia Física',
    description: 'Valoración inicial y trabajo de movilidad de hombro',
    start: atTime(dayOffset(0), 9),
    end: atTime(dayOffset(0), 10),
    status: 'paid',
  },
  {
    id: 'a2',
    patientId: 'pt-4',
    patientName: 'Sofía Martínez',
    appointmentType: 'Rehabilitación',
    description: 'Fortalecimiento de cadena posterior y descarga lumbar',
    start: atTime(dayOffset(0), 10, 30),
    end: atTime(dayOffset(0), 11, 30),
    status: 'pending',
  },
  {
    id: 'a3',
    patientId: 'pt-8',
    patientName: 'Lucía Fernández',
    appointmentType: 'Masaje Relaxante',
    description: 'Masaje de cuerpo completo para eliminar tensión cervical',
    start: atTime(dayOffset(0), 12),
    end: atTime(dayOffset(0), 13),
    status: 'paid',
  },
  {
    id: 'a4',
    patientId: 'pt-6',
    patientName: 'Valentina Herrera',
    appointmentType: 'Pilates Terapéutico',
    description: 'Sesión de pilates clínico para corrección postural',
    start: atTime(dayOffset(0), 16),
    end: atTime(dayOffset(0), 16, 40),
    status: 'pending',
  },
  {
    id: 'a5',
    patientId: null,
    patientName: 'Reunión de equipo',
    appointmentType: '',
    description: 'Revisión semanal de casos del equipo clínico',
    start: atTime(dayOffset(0), 19),
    end: atTime(dayOffset(0), 20),
    status: 'no_payment',
  },
  {
    id: 'a6',
    patientId: 'pt-5',
    patientName: 'Roberto Díaz',
    appointmentType: 'Terapia Lumbar',
    description: 'Terapia manual y estiramientos para lumbalgia crónica',
    start: atTime(dayOffset(1), 9, 30),
    end: atTime(dayOffset(1), 10, 30),
    status: 'paid',
  },
  {
    id: 'a7',
    patientId: 'pt-3',
    patientName: 'Marc Esposito',
    appointmentType: 'Evaluación inicial',
    description: 'Primera valoración para definir el plan de tratamiento',
    start: atTime(dayOffset(2), 11),
    end: atTime(dayOffset(2), 12),
    status: 'pending',
  },
  {
    id: 'a8',
    patientId: null,
    patientName: 'Mantenimiento de equipos',
    appointmentType: '',
    description: 'Revisión trimestral de los equipos de la clínica',
    start: atTime(dayOffset(2), 20, 30),
    end: atTime(dayOffset(2), 21),
    status: 'no_payment',
  },
  {
    id: 'a9',
    patientId: 'pt-7',
    patientName: 'Andrés Quispe',
    appointmentType: 'Rehabilitación',
    description: 'Continuación de la rehabilitación de rodilla post-operatoria',
    start: atTime(dayOffset(3), 15),
    end: atTime(dayOffset(3), 16),
    status: 'paid',
  },
  {
    id: 'a10',
    patientId: 'pt-9',
    patientName: 'Diego Cueva',
    appointmentType: 'Masaje Relaxante',
    description: 'Masaje relaxante de descarga muscular',
    start: atTime(dayOffset(4), 10),
    end: atTime(dayOffset(4), 11),
    status: 'paid',
  },
]

let appointments: Appointment[] = SEED_APPOINTMENTS.map((appointment) => ({ ...appointment }))

let sequence = SEED_APPOINTMENTS.length

export const mockAppointments = {
  list(): Appointment[] {
    return appointments.map((appointment) => ({ ...appointment }))
  },

  create(input: AppointmentDraft): Appointment {
    sequence += 1

    const created: Appointment = { ...input, id: `a-${sequence}` }

    appointments = [...appointments, created]

    return { ...created }
  },

  update(id: string, patch: AppointmentPatch): Appointment | null {
    const current = appointments.find((appointment) => appointment.id === id)
    if (!current) return null

    const updated: Appointment = { ...current, ...patch, id: current.id }

    appointments = appointments.map((appointment) =>
      appointment.id === id ? updated : appointment,
    )

    return { ...updated }
  },

  remove(id: string): boolean {
    const exists = appointments.some((appointment) => appointment.id === id)
    appointments = appointments.filter((appointment) => appointment.id !== id)
    return exists
  },
}