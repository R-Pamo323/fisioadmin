import type { ServiceType, ServiceTypeDraft } from '../entities/ServiceType'
import type { ServiceTypeRepository } from '../repositories/ServiceTypeRepository'

export class CreateServiceType {
  private readonly repository: ServiceTypeRepository

  constructor(repository: ServiceTypeRepository) {
    this.repository = repository
  }

  execute(draft: ServiceTypeDraft): Promise<ServiceType> {
    return this.repository.create({
      ...draft,
      name: draft.name.trim(),
      description: draft.description.trim(),
      protocol: draft.protocol.map((step) => step.trim()).filter((step) => step !== ''),
    })
  }
}
