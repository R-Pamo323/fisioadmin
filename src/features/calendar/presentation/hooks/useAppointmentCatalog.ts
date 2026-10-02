import { useEffect, useState } from 'react'
import { MockPatientRepository } from '../../../patients/data/repositories/MockPatientRepository'
import type { Patient } from '../../../patients/domain/entities/Patient'
import { GetPatients } from '../../../patients/domain/usecases/GetPatients'
import { MockServiceTypeRepository } from '../../../appointment-types/data/repositories/MockServiceTypeRepository'
import type { ServiceType } from '../../../appointment-types/domain/entities/ServiceType'
import { GetServiceTypes } from '../../../appointment-types/domain/usecases/GetServiceTypes'

/*
 * El calendario necesita los pacientes y los tipos de cita de otras features.
 * Se consumen por sus repositorios y casos de uso públicos (no importando sus
 * datasources), igual que cualquier otro cliente de esos módulos.
 */
const getPatients = new GetPatients(new MockPatientRepository())
const getServiceTypes = new GetServiceTypes(new MockServiceTypeRepository())

export function useAppointmentCatalog() {
  const [patients, setPatients] = useState<Patient[]>([])
  const [serviceTypes, setServiceTypes] = useState<ServiceType[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let active = true

    void (async () => {
      const [nextPatients, nextServiceTypes] = await Promise.all([
        getPatients.execute(),
        getServiceTypes.execute(),
      ])
      if (!active) return

      setPatients(nextPatients)
      setServiceTypes(nextServiceTypes)
      setIsLoading(false)
    })()

    return () => {
      active = false
    }
  }, [])

  return { patients, serviceTypes, isLoading }
}