import type { Patient } from '../entities/Patient'
import type { PatientRepository } from '../repositories/PatientRepository'

export class GetPatients {
  private readonly repository: PatientRepository

  constructor(repository: PatientRepository) {
    this.repository = repository
  }

  execute(): Promise<Patient[]> {
    return this.repository.list()
  }
}