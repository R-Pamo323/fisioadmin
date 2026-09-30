import type { Patient, PatientDraft, PatientPatch } from '../../domain/entities/Patient'
import type { PatientRepository } from '../../domain/repositories/PatientRepository'
import { mockPatients } from '../datasources/mockPatients'

export class MockPatientRepository implements PatientRepository {
  list(): Promise<Patient[]> {
    return Promise.resolve(mockPatients.list())
  }

  create(draft: PatientDraft): Promise<Patient> {
    return Promise.resolve(mockPatients.create(draft))
  }

  update(id: string, patch: PatientPatch): Promise<Patient> {
    const updated = mockPatients.update(id, patch)

    if (!updated) {
      return Promise.reject(new Error(`No existe el paciente ${id}`))
    }

    return Promise.resolve(updated)
  }

  remove(id: string): Promise<void> {
    mockPatients.remove(id)
    return Promise.resolve()
  }
}