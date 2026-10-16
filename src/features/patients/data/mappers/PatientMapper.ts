import type { Patient, PatientDraft, PatientPatch } from '../../domain/entities/Patient'

/** Fila tal como la devuelve la tabla `patients` de Supabase. */
export interface PatientRow {
  id: string
  name: string
  age: number
  gender: Patient['gender']
  email: string
  phone: string
  diagnosis: string
}

export function toPatient(row: PatientRow): Patient {
  return {
    id: row.id,
    name: row.name,
    age: row.age,
    gender: row.gender,
    email: row.email,
    phone: row.phone,
    diagnosis: row.diagnosis,
  }
}

/**
 * Draft/patch → columnas. Se envían solo las claves presentes para que un
 * `update` parcial no pise el resto. En pacientes no hay renombres de campos.
 */
export function toPatientRow(payload: Partial<PatientDraft | PatientPatch>) {
  const row: Record<string, unknown> = {}
  if (payload.name !== undefined) row.name = payload.name
  if (payload.age !== undefined) row.age = payload.age
  if (payload.gender !== undefined) row.gender = payload.gender
  if (payload.email !== undefined) row.email = payload.email
  if (payload.phone !== undefined) row.phone = payload.phone
  if (payload.diagnosis !== undefined) row.diagnosis = payload.diagnosis
  return row
}
