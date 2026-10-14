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
}

export type PatientDraft = Omit<Patient, 'id'>

export type PatientPatch = Partial<Omit<Patient, 'id'>>