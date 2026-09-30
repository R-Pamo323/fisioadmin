import type { ServiceType } from '../entities/ServiceType'
import type { ServiceTypeRepository } from '../repositories/ServiceTypeRepository'

export class GetServiceTypes {
  private readonly repository: ServiceTypeRepository

  constructor(repository: ServiceTypeRepository) {
    this.repository = repository
  }

  execute(): Promise<ServiceType[]> {
    return this.repository.list()
  }
}
