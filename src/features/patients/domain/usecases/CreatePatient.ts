import type { Patient, PatientDraft } from '../entities/Patient'
import type { PatientRepository } from '../repositories/PatientRepository'

export class CreatePatient {
  private readonly repository: PatientRepository

  constructor(repository: PatientRepository) {
    this.repository = repository
  }

  execute(draft: PatientDraft): Promise<Patient> {
    return this.repository.create({
      ...draft,
      name: draft.name.trim(),
      email: draft.email.trim().toLowerCase(),
      phone: draft.phone.trim(),
      diagnosis: draft.diagnosis.trim(),
      treatment: draft.treatment.trim(),
    })
  }
}