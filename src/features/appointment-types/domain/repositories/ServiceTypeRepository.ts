import type {
  ServiceType,
  ServiceTypeDraft,
  ServiceTypePatch,
} from '../entities/ServiceType'

export interface ServiceTypeRepository {
  list(): Promise<ServiceType[]>
  create(draft: ServiceTypeDraft): Promise<ServiceType>
  update(id: string, patch: ServiceTypePatch): Promise<ServiceType>
  remove(id: string): Promise<void>
}
