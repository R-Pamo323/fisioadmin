import { useCallback, useEffect, useMemo, useState } from 'react'
import type {
  ServiceType,
  ServiceTypeDraft,
  ServiceTypePatch,
} from '../../domain/entities/ServiceType'
import { MockServiceTypeRepository } from '../../data/repositories/MockServiceTypeRepository'
import { CreateServiceType } from '../../domain/usecases/CreateServiceType'
import { DeleteServiceType } from '../../domain/usecases/DeleteServiceType'
import { GetServiceTypes } from '../../domain/usecases/GetServiceTypes'
import { UpdateServiceType } from '../../domain/usecases/UpdateServiceType'

const repository = new MockServiceTypeRepository()
const getServiceTypes = new GetServiceTypes(repository)
const createServiceType = new CreateServiceType(repository)
const updateServiceType = new UpdateServiceType(repository)
const deleteServiceType = new DeleteServiceType(repository)

const normalize = (value: string) => value.trim().toLowerCase()

export function useServiceTypes() {
  const [serviceTypes, setServiceTypes] = useState<ServiceType[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [search, setSearch] = useState('')

  const refresh = useCallback(async () => {
    const next = await getServiceTypes.execute()
    setServiceTypes(next)
  }, [])

  useEffect(() => {
    let active = true

    void (async () => {
      const next = await getServiceTypes.execute()
      if (!active) return
      setServiceTypes(next)
      setIsLoading(false)
    })()

    return () => {
      active = false
    }
  }, [])

  const create = useCallback(
    async (draft: ServiceTypeDraft) => {
      await createServiceType.execute(draft)
      await refresh()
    },
    [refresh],
  )

  const update = useCallback(
    async (id: string, patch: ServiceTypePatch) => {
      await updateServiceType.execute(id, patch)
      await refresh()
    },
    [refresh],
  )

  const remove = useCallback(
    async (id: string) => {
      await deleteServiceType.execute(id)
      await refresh()
    },
    [refresh],
  )

  const filtered = useMemo(() => {
    const term = normalize(search)
    if (term === '') return serviceTypes

    return serviceTypes.filter(
      (service) =>
        normalize(service.name).includes(term) ||
        normalize(service.description).includes(term) ||
        normalize(service.category).includes(term),
    )
  }, [serviceTypes, search])

  return {
    serviceTypes: filtered,
    total: serviceTypes.length,
    isLoading,
    search,
    setSearch,
    create,
    update,
    remove,
  }
}
