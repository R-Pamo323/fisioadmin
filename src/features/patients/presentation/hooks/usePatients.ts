import { useCallback, useEffect, useMemo, useState } from 'react'
import type { Patient, PatientDraft } from '../../domain/entities/Patient'
import { MockPatientRepository } from '../../data/repositories/MockPatientRepository'
import { CreatePatient } from '../../domain/usecases/CreatePatient'
import { DeletePatient } from '../../domain/usecases/DeletePatient'
import { GetPatients } from '../../domain/usecases/GetPatients'
import { UpdatePatient } from '../../domain/usecases/UpdatePatient'
import type { Appointment } from '../../../calendar/domain/entities/Appointment'
import { MockAppointmentRepository } from '../../../calendar/data/repositories/MockAppointmentRepository'
import { GetAppointments } from '../../../calendar/domain/usecases/GetAppointments'
import { UpdateAppointment } from '../../../calendar/domain/usecases/UpdateAppointment'
import { toTimestamp } from '../components/patientMeta'
import type { PatientView } from '../components/patientTreatment'
import {
  selectLatestPatientAppointment,
  toPatientView,
} from '../components/patientTreatment'

const repository = new MockPatientRepository()
const getPatients = new GetPatients(repository)
const createPatient = new CreatePatient(repository)
const updatePatient = new UpdatePatient(repository)
const deletePatient = new DeletePatient(repository)

/*
 * El paciente no guarda tratamiento ni estado: se derivan de su cita más
 * reciente, así que esta pantalla también lee (y marca como pagada) esa cita.
 */
const appointmentRepository = new MockAppointmentRepository()
const getAppointments = new GetAppointments(appointmentRepository)
const updateAppointment = new UpdateAppointment(appointmentRepository)

const normalize = (value: string) => value.trim().toLowerCase()

export type PatientStatusFilter =
  | 'todos'
  | 'pendiente'
  | 'pagado'
  | 'sin_tratamiento'

export function usePatients() {
  const [patients, setPatients] = useState<Patient[]>([])
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<PatientStatusFilter>('todos')

  const refresh = useCallback(async () => {
    const [nextPatients, nextAppointments] = await Promise.all([
      getPatients.execute(),
      getAppointments.execute(),
    ])
    setPatients(nextPatients)
    setAppointments(nextAppointments)
  }, [])

  useEffect(() => {
    let active = true

    void (async () => {
      const [nextPatients, nextAppointments] = await Promise.all([
        getPatients.execute(),
        getAppointments.execute(),
      ])
      if (!active) return
      setPatients(nextPatients)
      setAppointments(nextAppointments)
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

  /**
   * Marca como pagada la cita más reciente del paciente; es lo que cierra el
   * tratamiento y habilita que pueda empezar otro.
   */
  const markAsPaid = useCallback(
    async (patientId: string) => {
      const latest = selectLatestPatientAppointment(appointments, patientId)
      if (!latest || latest.status !== 'pending') return

      await updateAppointment.execute(latest.id, { status: 'paid' })
      await refresh()
    },
    [appointments, refresh],
  )

  const views = useMemo(
    () => patients.map((patient) => toPatientView(patient, appointments)),
    [patients, appointments],
  )

  const visiblePatients = useMemo(() => {
    const term = normalize(search)

    const filtered = views.filter((patient) => {
      if (statusFilter !== 'todos' && patient.status !== statusFilter) return false
      if (term === '') return true

      return (
        normalize(patient.name).includes(term) ||
        normalize(patient.email).includes(term) ||
        normalize(patient.diagnosis).includes(term) ||
        normalize(patient.phone).includes(term) ||
        normalize(patient.treatment).includes(term)
      )
    })

    // `filter` ya devuelve un array nuevo, así que ordenar in-place es seguro.
    // Del más reciente al más antiguo, con desempate alfabético por nombre.
    return filtered.sort(
      (a, b) =>
        toTimestamp(b.lastVisitAt ?? '') - toTimestamp(a.lastVisitAt ?? '') ||
        a.name.localeCompare(b.name, 'es'),
    )
  }, [views, search, statusFilter])

  const statusCounts = useMemo(
    () => ({
      todos: views.length,
      pendiente: views.filter((patient) => patient.status === 'pendiente').length,
      pagado: views.filter((patient) => patient.status === 'pagado').length,
      sin_tratamiento: views.filter(
        (patient) => patient.status === 'sin_tratamiento',
      ).length,
    }),
    [views],
  )

  return {
    patients: views,
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
    markAsPaid,
  }
}
