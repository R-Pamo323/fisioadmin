import { supabase } from '../../../../shared/lib/supabase'
import { createId } from '../../../../shared/lib/ids'
import type {
  ServiceType,
  ServiceTypeDraft,
  ServiceTypePatch,
} from '../../domain/entities/ServiceType'
import type { ServiceTypeRepository } from '../../domain/repositories/ServiceTypeRepository'
import {
  toServiceType,
  toServiceTypeRow,
  type ServiceTypeRow,
} from '../mappers/ServiceTypeMapper'

export class SupabaseServiceTypeRepository implements ServiceTypeRepository {
  async list(): Promise<ServiceType[]> {
    const { data, error } = await supabase.from('service_types').select('*').order('name')

    if (error) throw error

    return (data as ServiceTypeRow[]).map(toServiceType)
  }

  async create(draft: ServiceTypeDraft): Promise<ServiceType> {
    const { data, error } = await supabase
      .from('service_types')
      .insert({ id: createId('st'), ...toServiceTypeRow(draft) })
      .select('*')
      .single()

    if (error) throw error

    return toServiceType(data as ServiceTypeRow)
  }

  async update(id: string, patch: ServiceTypePatch): Promise<ServiceType> {
    const { data, error } = await supabase
      .from('service_types')
      .update(toServiceTypeRow(patch))
      .eq('id', id)
      .select('*')
      .single()

    if (error) throw error

    return toServiceType(data as ServiceTypeRow)
  }

  async remove(id: string): Promise<void> {
    const { error } = await supabase.from('service_types').delete().eq('id', id)

    if (error) throw error
  }
}
