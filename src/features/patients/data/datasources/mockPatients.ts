import type { Patient, PatientDraft } from '../../domain/entities/Patient'

/** Fecha ISO de hace `days` días, para que el texto relativo siempre sea exacto. */
function daysAgo(days: number): string {
  const date = new Date()
  date.setDate(date.getDate() - days)
  return date.toISOString()
}

const SEED_PATIENTS: Patient[] = [
  {
    id: 'pt-1',
    name: 'Carlos Ruiz',
    age: 34,
    gender: 'masculino',
    email: 'carlos.ruiz@correo.com',
    phone: '987 654 321',
    diagnosis: 'Lumbalgia crónica con discopatía L4-L5',
    treatment: 'Terapia manual + ejercicios de Jessfield',
    status: 'activo',
    lastVisitAt: daysAgo(3),
  },
  {
    id: 'pt-2',
    name: 'Elena Gómez',
    age: 45,
    gender: 'femenino',
    email: 'elena.gomez@correo.com',
    phone: '987 654 322',
    diagnosis: 'Rehabilitación post-operatoria de LCA',
    treatment: 'Protocolo de carga progresiva de rodilla',
    status: 'activo',
    lastVisitAt: daysAgo(1),
  },
  {
    id: 'pt-3',
    name: 'Marc Esposito',
    age: 29,
    gender: 'masculino',
    email: 'marc.esposito@correo.com',
    phone: '987 654 323',
    diagnosis: 'Cervicalgia por sedentarismo y postura laboral',
    treatment: 'Terapia manual + estiramientos',
    status: 'pendiente',
    lastVisitAt: daysAgo(7),
  },
  {
    id: 'pt-4',
    name: 'Sofía Martínez',
    age: 61,
    gender: 'femenino',
    email: 'sofia.martinez@correo.com',
    phone: '987 654 324',
    diagnosis: 'Artrosis de rodilla y contracturas de flexores',
    treatment: 'Ejercicios asistidos + infiltraciones',
    status: 'finalizado',
    lastVisitAt: daysAgo(45),
  },
  {
    id: 'pt-5',
    name: 'Roberto Díaz',
    age: 52,
    gender: 'masculino',
    email: 'roberto.diaz@correo.com',
    phone: '987 654 325',
    diagnosis: 'Epicondilitis bilateral por uso de martillo',
    treatment: 'Ondas de choque + pausas activas',
    status: 'activo',
    lastVisitAt: daysAgo(12),
  },
  {
    id: 'pt-6',
    name: 'Valentina Herrera',
    age: 12,
    gender: 'femenino',
    email: 'valentina.herrera@correo.com',
    phone: '987 654 326',
    diagnosis: 'Escoliosis idiopática juvenil',
    treatment: 'Método Schroth + control postural',
    status: 'activo',
    lastVisitAt: daysAgo(5),
  },
  {
    id: 'pt-7',
    name: 'Andrés Quispe',
    age: 9,
    gender: 'masculino',
    email: 'andres.quispe@correo.com',
    phone: '987 654 327',
    diagnosis: 'Hemiparesia espástica leve, neurodesarrollo',
    treatment: 'Terapia infantil del neurodesarrollo',
    status: 'pendiente',
    lastVisitAt: daysAgo(2),
  },
  {
    id: 'pt-8',
    name: 'Lucía Fernández',
    age: 41,
    gender: 'femenino',
    email: 'lucia.fernandez@correo.com',
    phone: '987 654 328',
    diagnosis: 'Dolor crónico de miembro inferior',
    treatment: 'Fortalecimiento de psoas e isquiotibiales',
    status: 'activo',
    lastVisitAt: daysAgo(18),
  },
  {
    id: 'pt-9',
    name: 'Diego Cueva',
    age: 38,
    gender: 'masculino',
    email: 'diego.cueva@correo.com',
    phone: '987 654 329',
    diagnosis: 'Fibromialgia con fatiga persistente',
    treatment: 'Terapia somática + acompañamiento',
    status: 'pendiente',
    lastVisitAt: daysAgo(25),
  },
]

let patients: Patient[] = SEED_PATIENTS.map((patient) => ({ ...patient }))

let sequence = SEED_PATIENTS.length

export const mockPatients = {
  list(): Patient[] {
    return patients.map((patient) => ({ ...patient }))
  },

  create(input: PatientDraft): Patient {
    sequence += 1

    const created: Patient = { ...input, id: `pt-${sequence}` }

    patients = [...patients, created]

    return { ...created }
  },

  update(id: string, patch: Partial<Omit<Patient, 'id'>>): Patient | null {
    const current = patients.find((patient) => patient.id === id)
    if (!current) return null

    const updated: Patient = { ...current, ...patch, id: current.id }

    patients = patients.map((patient) => (patient.id === id ? updated : patient))

    return { ...updated }
  },

  remove(id: string): boolean {
    const exists = patients.some((patient) => patient.id === id)
    patients = patients.filter((patient) => patient.id !== id)
    return exists
  },
}