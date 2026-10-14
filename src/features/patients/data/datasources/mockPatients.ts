import type { Patient, PatientDraft } from '../../domain/entities/Patient'

const SEED_PATIENTS: Patient[] = [
  {
    id: 'pt-1',
    name: 'Carlos Ruiz',
    age: 34,
    gender: 'masculino',
    email: 'carlos.ruiz@correo.com',
    phone: '987 654 321',
    diagnosis: 'Lumbalgia crónica con discopatía L4-L5',
  },
  {
    id: 'pt-2',
    name: 'Elena Gómez',
    age: 45,
    gender: 'femenino',
    email: 'elena.gomez@correo.com',
    phone: '987 654 322',
    diagnosis: 'Rehabilitación post-operatoria de LCA',
  },
  {
    id: 'pt-3',
    name: 'Marc Esposito',
    age: 29,
    gender: 'masculino',
    email: 'marc.esposito@correo.com',
    phone: '987 654 323',
    diagnosis: 'Cervicalgia por sedentarismo y postura laboral',
  },
  {
    id: 'pt-4',
    name: 'Sofía Martínez',
    age: 61,
    gender: 'femenino',
    email: 'sofia.martinez@correo.com',
    phone: '987 654 324',
    diagnosis: 'Artrosis de rodilla y contracturas de flexores',
  },
  {
    id: 'pt-5',
    name: 'Roberto Díaz',
    age: 52,
    gender: 'masculino',
    email: 'roberto.diaz@correo.com',
    phone: '987 654 325',
    diagnosis: 'Epicondilitis bilateral por uso de martillo',
  },
  {
    id: 'pt-6',
    name: 'Valentina Herrera',
    age: 12,
    gender: 'femenino',
    email: 'valentina.herrera@correo.com',
    phone: '987 654 326',
    diagnosis: 'Escoliosis idiopática juvenil',
  },
  {
    id: 'pt-7',
    name: 'Andrés Quispe',
    age: 9,
    gender: 'masculino',
    email: 'andres.quispe@correo.com',
    phone: '987 654 327',
    diagnosis: 'Hemiparesia espástica leve, neurodesarrollo',
  },
  {
    id: 'pt-8',
    name: 'Lucía Fernández',
    age: 41,
    gender: 'femenino',
    email: 'lucia.fernandez@correo.com',
    phone: '987 654 328',
    diagnosis: 'Dolor crónico de miembro inferior',
  },
  {
    id: 'pt-9',
    name: 'Diego Cueva',
    age: 38,
    gender: 'masculino',
    email: 'diego.cueva@correo.com',
    phone: '987 654 329',
    diagnosis: 'Fibromialgia con fatiga persistente',
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
