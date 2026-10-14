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
 * llevan patientId null y las citas de tipo gratis llevan status 'no_payment':
 * ninguna de las dos genera cobro, así que su monto es 0. En las citas de pago
 * el monto coincide con el precio del tipo salvo que se haya ajustado.
 *
 * El historial del paciente se arma con sus citas ya realizadas, así que
 * pt-1 (Carlos), pt-2 (Elena), pt-3 (Marc) y pt-7 (Andrés) tienen varias citas
 * pasadas; el resto de pacientes no tiene citas. Solo se conservan las
 * reuniones (sin paciente) y la cita de hoy de Carlos.
 */
const SEED_APPOINTMENTS: Appointment[] = [
  {
    id: 'a1',
    patientId: 'pt-1',
    patientName: 'Carlos Ruiz',
    appointmentType: 'Terapia Física',
    description: 'Valoración inicial y trabajo de movilidad de hombro',
    amount: 50,
    start: atTime(dayOffset(0), 9),
    end: atTime(dayOffset(0), 10),
    status: 'paid',
  },
  {
    id: 'a5',
    patientId: null,
    patientName: 'Reunión de equipo',
    appointmentType: '',
    description: 'Revisión semanal de casos del equipo clínico',
    amount: 0,
    start: atTime(dayOffset(0), 19),
    end: atTime(dayOffset(0), 20),
    status: 'no_payment',
  },
  {
    id: 'a8',
    patientId: null,
    patientName: 'Mantenimiento de equipos',
    appointmentType: '',
    description: 'Revisión trimestral de los equipos de la clínica',
    amount: 0,
    start: atTime(dayOffset(2), 20, 30),
    end: atTime(dayOffset(2), 21),
    status: 'no_payment',
  },

  // pt-1 Carlos: evaluación gratis + ciclo de Terapia Física + control gratis.
  {
    id: 'a13',
    patientId: 'pt-1',
    patientName: 'Carlos Ruiz',
    appointmentType: 'Evaluación inicial',
    description: 'Primera valoración y definición del plan de tratamiento',
    amount: 0,
    start: atTime(dayOffset(-31), 10),
    end: atTime(dayOffset(-31), 10, 20),
    status: 'no_payment',
  },
  {
    id: 'a14',
    patientId: 'pt-1',
    patientName: 'Carlos Ruiz',
    appointmentType: 'Terapia Física',
    description: 'Trabajo de movilidad y refuerzo de hombro',
    amount: 50,
    start: atTime(dayOffset(-24), 9),
    end: atTime(dayOffset(-24), 10),
    status: 'paid',
  },
  {
    id: 'a15',
    patientId: 'pt-1',
    patientName: 'Carlos Ruiz',
    appointmentType: 'Terapia Física',
    description: 'Progresión de ejercicios y descarga muscular',
    amount: 50,
    start: atTime(dayOffset(-17), 9),
    end: atTime(dayOffset(-17), 10),
    status: 'paid',
  },
  {
    id: 'a16',
    patientId: 'pt-1',
    patientName: 'Carlos Ruiz',
    appointmentType: 'Cita sin cobro',
    description: 'Control de evolución sin coste',
    amount: 0,
    start: atTime(dayOffset(-10), 12),
    end: atTime(dayOffset(-10), 12, 30),
    status: 'no_payment',
  },
  {
    id: 'a17',
    patientId: 'pt-1',
    patientName: 'Carlos Ruiz',
    appointmentType: 'Terapia Física',
    description: 'Sesión de mantenimiento y reeducación postural',
    amount: 50,
    start: atTime(dayOffset(-3), 9),
    end: atTime(dayOffset(-3), 10),
    status: 'paid',
  },

  // pt-2 Elena: historial pagado y una sesión reciente pendiente de pago.
  {
    id: 'a18',
    patientId: 'pt-2',
    patientName: 'Elena Gómez',
    appointmentType: 'Evaluación inicial',
    description: 'Valoración post-operatoria de rodilla',
    amount: 0,
    start: atTime(dayOffset(-35), 11),
    end: atTime(dayOffset(-35), 11, 20),
    status: 'no_payment',
  },
  {
    id: 'a19',
    patientId: 'pt-2',
    patientName: 'Elena Gómez',
    appointmentType: 'Rehabilitación',
    description: 'Trabajo de fuerza excéntrica y control del derrame',
    amount: 70,
    start: atTime(dayOffset(-28), 10),
    end: atTime(dayOffset(-28), 11),
    status: 'paid',
  },
  {
    id: 'a20',
    patientId: 'pt-2',
    patientName: 'Elena Gómez',
    appointmentType: 'Rehabilitación',
    description: 'Progresión de carga y movilidad de rodilla',
    amount: 70,
    start: atTime(dayOffset(-20), 10),
    end: atTime(dayOffset(-20), 11),
    status: 'paid',
  },
  {
    id: 'a21',
    patientId: 'pt-2',
    patientName: 'Elena Gómez',
    appointmentType: 'Rehabilitación',
    description: 'Sesión de cierre; queda pendiente de cobro',
    amount: 70,
    start: atTime(dayOffset(-5), 10),
    end: atTime(dayOffset(-5), 11),
    status: 'pending',
  },

  // pt-3 Marc: evaluación gratis y dos sesiones de pago.
  {
    id: 'a22',
    patientId: 'pt-3',
    patientName: 'Marc Esposito',
    appointmentType: 'Evaluación inicial',
    description: 'Valoración de cervicales por postura laboral',
    amount: 0,
    start: atTime(dayOffset(-40), 11),
    end: atTime(dayOffset(-40), 11, 20),
    status: 'no_payment',
  },
  {
    id: 'a23',
    patientId: 'pt-3',
    patientName: 'Marc Esposito',
    appointmentType: 'Terapia Física',
    description: 'Terapia manual y estiramientos cervicales',
    amount: 50,
    start: atTime(dayOffset(-30), 9),
    end: atTime(dayOffset(-30), 10),
    status: 'paid',
  },
  {
    id: 'a24',
    patientId: 'pt-3',
    patientName: 'Marc Esposito',
    appointmentType: 'Terapia Física',
    description: 'Refuerzo de musculatura profunda y pautas ergonómicas',
    amount: 50,
    start: atTime(dayOffset(-12), 9),
    end: atTime(dayOffset(-12), 10),
    status: 'paid',
  },

  // pt-7 Andrés: evaluación gratis y dos sesiones de rehabilitación pagadas.
  {
    id: 'a25',
    patientId: 'pt-7',
    patientName: 'Andrés Quispe',
    appointmentType: 'Evaluación inicial',
    description: 'Valoración del neurodesarrollo y control de tronco',
    amount: 0,
    start: atTime(dayOffset(-50), 16),
    end: atTime(dayOffset(-50), 16, 20),
    status: 'no_payment',
  },
  {
    id: 'a26',
    patientId: 'pt-7',
    patientName: 'Andrés Quispe',
    appointmentType: 'Rehabilitación',
    description: 'Trabajo de control postural y mano dominante',
    amount: 70,
    start: atTime(dayOffset(-30), 15),
    end: atTime(dayOffset(-30), 16),
    status: 'paid',
  },
  {
    id: 'a27',
    patientId: 'pt-7',
    patientName: 'Andrés Quispe',
    appointmentType: 'Rehabilitación',
    description: 'Progresión de ejercicios funcionales y equilibrio',
    amount: 70,
    start: atTime(dayOffset(-8), 15),
    end: atTime(dayOffset(-8), 16),
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
