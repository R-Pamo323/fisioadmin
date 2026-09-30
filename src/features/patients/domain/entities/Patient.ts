export type PatientStatus = 'activo' | 'pendiente' | 'finalizado'

export type PatientGender = 'femenino' | 'masculino'

export interface Patient {
  id: string
  /** Nombre completo, tal como se muestra en la tabla. */
  name: string
  age: number
  gender: PatientGender
  email: string
  phone: string
  /** Diagnóstico o descripción clínica breve. */
  diagnosis: string
  /** Tratamiento que el paciente tiene en curso. */
  treatment: string
  status: PatientStatus
  /** Última visita en formato ISO; se usa para el texto relativo. */
  lastVisitAt: string
}

export type PatientDraft = Omit<Patient, 'id'>

export type PatientPatch = Partial<Omit<Patient, 'id'>>