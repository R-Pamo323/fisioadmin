import type { ServiceTypeRepository } from '../repositories/ServiceTypeRepository'

export class DeleteServiceType {
  private readonly repository: ServiceTypeRepository

  constructor(repository: ServiceTypeRepository) {
    this.repository = repository
  }

  execute(id: string): Promise<void> {
    return this.repository.remove(id)
  }
}
