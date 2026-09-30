import type { Patient, PatientPatch } from '../entities/Patient'
import type { PatientRepository } from '../repositories/PatientRepository'

export class UpdatePatient {
  private readonly repository: PatientRepository

  constructor(repository: PatientRepository) {
    this.repository = repository
  }

  execute(id: string, patch: PatientPatch): Promise<Patient> {
    const normalized: PatientPatch = {
      ...patch,
      ...(patch.name !== undefined ? { name: patch.name.trim() } : {}),
      ...(patch.email !== undefined
        ? { email: patch.email.trim().toLowerCase() }
        : {}),
      ...(patch.phone !== undefined ? { phone: patch.phone.trim() } : {}),
      ...(patch.diagnosis !== undefined
        ? { diagnosis: patch.diagnosis.trim() }
        : {}),
      ...(patch.treatment !== undefined
        ? { treatment: patch.treatment.trim() }
        : {}),
    }

    return this.repository.update(id, normalized)
  }
}