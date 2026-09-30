import type { ServiceType, ServiceTypePatch } from '../entities/ServiceType'
import type { ServiceTypeRepository } from '../repositories/ServiceTypeRepository'

export class UpdateServiceType {
  private readonly repository: ServiceTypeRepository

  constructor(repository: ServiceTypeRepository) {
    this.repository = repository
  }

  execute(id: string, patch: ServiceTypePatch): Promise<ServiceType> {
    const normalized: ServiceTypePatch = {
      ...patch,
      ...(patch.name !== undefined ? { name: patch.name.trim() } : {}),
      ...(patch.description !== undefined
        ? { description: patch.description.trim() }
        : {}),
    }

    return this.repository.update(id, normalized)
  }
}
