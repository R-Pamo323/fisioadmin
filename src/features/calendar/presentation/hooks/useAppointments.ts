import { useCallback, useEffect, useState } from 'react'
import { MockAppointmentRepository } from '../../data/repositories/MockAppointmentRepository'
import type {
  Appointment,
  AppointmentDraft,
  AppointmentPatch,
} from '../../domain/entities/Appointment'
import { CreateAppointment } from '../../domain/usecases/CreateAppointment'
import { DeleteAppointment } from '../../domain/usecases/DeleteAppointment'
import { GetAppointments } from '../../domain/usecases/GetAppointments'
import { UpdateAppointment } from '../../domain/usecases/UpdateAppointment'

const repository = new MockAppointmentRepository()
const getAppointments = new GetAppointments(repository)
const createAppointment = new CreateAppointment(repository)
const updateAppointment = new UpdateAppointment(repository)
const deleteAppointment = new DeleteAppointment(repository)

export function useAppointments() {
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const refresh = useCallback(async () => {
    const next = await getAppointments.execute()
    setAppointments(next)
  }, [])

  useEffect(() => {
    let active = true

    void (async () => {
      const next = await getAppointments.execute()
      if (!active) return
      setAppointments(next)
      setIsLoading(false)
    })()

    return () => {
      active = false
    }
  }, [])

  const create = useCallback(
    async (draft: AppointmentDraft) => {
      const created = await createAppointment.execute(draft)
      await refresh()
      return created
    },
    [refresh],
  )

  const update = useCallback(
    async (id: string, patch: AppointmentPatch) => {
      const updated = await updateAppointment.execute(id, patch)
      await refresh()
      return updated
    },
    [refresh],
  )

  const remove = useCallback(
    async (id: string) => {
      await deleteAppointment.execute(id)
      await refresh()
    },
    [refresh],
  )

  return { appointments, isLoading, create, update, remove }
}