import type { Patient, PatientDraft, PatientPatch } from '../entities/Patient'

export interface PatientRepository {
  list(): Promise<Patient[]>
  create(draft: PatientDraft): Promise<Patient>
  update(id: string, patch: PatientPatch): Promise<Patient>
  remove(id: string): Promise<void>
}