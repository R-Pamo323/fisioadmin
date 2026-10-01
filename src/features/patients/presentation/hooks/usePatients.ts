import { useCallback, useEffect, useMemo, useState } from 'react'
import type { Patient, PatientDraft } from '../../domain/entities/Patient'
import { MockPatientRepository } from '../../data/repositories/MockPatientRepository'
import { CreatePatient } from '../../domain/usecases/CreatePatient'
import { DeletePatient } from '../../domain/usecases/DeletePatient'
import { GetPatients } from '../../domain/usecases/GetPatients'
import { UpdatePatient } from '../../domain/usecases/UpdatePatient'
import { toTimestamp } from '../components/patientMeta'

const repository = new MockPatientRepository()
const getPatients = new GetPatients(repository)
const createPatient = new CreatePatient(repository)
const updatePatient = new UpdatePatient(repository)
const deletePatient = new DeletePatient(repository)

const normalize = (value: string) => value.trim().toLowerCase()

export type PatientStatusFilter = 'todos' | 'activo' | 'pendiente'

export function usePatients() {
  const [patients, setPatients] = useState<Patient[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<PatientStatusFilter>('todos')

  const refresh = useCallback(async () => {
    const next = await getPatients.execute()
    setPatients(next)
  }, [])

  useEffect(() => {
    let active = true

    void (async () => {
      const next = await getPatients.execute()
      if (!active) return
      setPatients(next)
      setIsLoading(false)
    })()

    return () => {
      active = false
    }
  }, [])

  const create = useCallback(
    async (draft: PatientDraft) => {
      await createPatient.execute(draft)
      await refresh()
    },
    [refresh],
  )

  const update = useCallback(
    async (id: string, patch: Partial<Omit<Patient, 'id'>>) => {
      await updatePatient.execute(id, patch)
      await refresh()
    },
    [refresh],
  )

  const remove = useCallback(
    async (id: string) => {
      await deletePatient.execute(id)
      await refresh()
    },
    [refresh],
  )

  const visiblePatients = useMemo(() => {
    const term = normalize(search)

    const filtered = patients.filter((patient) => {
      if (statusFilter !== 'todos' && patient.status !== statusFilter) return false
      if (term === '') return true

      return (
        normalize(patient.name).includes(term) ||
        normalize(patient.email).includes(term) ||
        normalize(patient.diagnosis).includes(term) ||
        normalize(patient.treatment).includes(term)
      )
    })

    // `filter` ya devuelve un array nuevo, así que ordenar in-place es seguro.
    // Del más reciente al más antiguo, con desempate alfabético por nombre.
    return filtered.sort(
      (a, b) =>
        toTimestamp(b.lastVisitAt) - toTimestamp(a.lastVisitAt) ||
        a.name.localeCompare(b.name, 'es'),
    )
  }, [patients, search, statusFilter])

  const statusCounts = useMemo(
    () => ({
      todos: patients.length,
      activo: patients.filter((patient) => patient.status === 'activo').length,
      pendiente: patients.filter((patient) => patient.status === 'pendiente').length,
    }),
    [patients],
  )

  return {
    patients,
    visiblePatients,
    statusCounts,
    isLoading,
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
    create,
    update,
    remove,
  }
}