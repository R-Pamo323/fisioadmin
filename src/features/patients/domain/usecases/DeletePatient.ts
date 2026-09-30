import type { Patient } from '../entities/Patient'
import type { PatientRepository } from '../repositories/PatientRepository'

export class DeletePatient {
  private readonly repository: PatientRepository

  constructor(repository: PatientRepository) {
    this.repository = repository
  }

  execute(id: string): Promise<void> {
    return this.repository.remove(id)
  }
}