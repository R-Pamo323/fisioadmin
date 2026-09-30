import type {
  ServiceType,
  ServiceTypeDraft,
  ServiceTypePatch,
} from '../../domain/entities/ServiceType'
import type { ServiceTypeRepository } from '../../domain/repositories/ServiceTypeRepository'
import { mockServiceTypes } from '../datasources/mockServiceTypes'

export class MockServiceTypeRepository implements ServiceTypeRepository {
  list(): Promise<ServiceType[]> {
    return Promise.resolve(mockServiceTypes.list())
  }

  create(draft: ServiceTypeDraft): Promise<ServiceType> {
    return Promise.resolve(mockServiceTypes.create(draft))
  }

  update(id: string, patch: ServiceTypePatch): Promise<ServiceType> {
    const updated = mockServiceTypes.update(id, patch)

    if (!updated) {
      return Promise.reject(new Error(`No existe el servicio ${id}`))
    }

    return Promise.resolve(updated)
  }

  remove(id: string): Promise<void> {
    mockServiceTypes.remove(id)
    return Promise.resolve()
  }
}
