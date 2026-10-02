import { useCallback, useMemo, useState } from 'react'
import type { ChangeEvent, FormEvent } from 'react'
import type { Patient } from '../../../patients/domain/entities/Patient'
import type { ServiceType } from '../../../appointment-types/domain/entities/ServiceType'
import type {
  Appointment,
  AppointmentDraft,
  AppointmentStatus,
} from '../../domain/entities/Appointment'

/** La grilla muestra hasta las 22:00, pero no se agenda más allá de las 21:00. */
export const LAST_BOOKABLE_MINUTES = 21 * 60

/** Opción del selector de paciente cuando la cita no corresponde a nadie. */
export const NO_PATIENT_VALUE = 'sin-paciente'

export interface AppointmentFormValues {
  patientId: string
  serviceTypeId: string
  /** Título de la reunión; solo se usa cuando no hay paciente. */
  meetingTitle: string
  date: string
  startTime: string
  endTime: string
  /** Solo es editable al modificar una cita ya creada. */
  status: AppointmentStatus
}

type Field = keyof AppointmentFormValues
type Errors = Partial<Record<Field, string>>

const emptyValues: AppointmentFormValues = {
  patientId: '',
  serviceTypeId: '',
  meetingTitle: '',
  date: '',
  startTime: '',
  endTime: '',
  status: 'pending',
}

/** "HH:mm" → minutos desde medianoche; null si el formato no sirve. */
export function parseTimeToMinutes(value: string): number | null {
  const match = /^(\d{1,2}):(\d{2})$/.exec(value)
  if (!match) return null

  const hours = Number(match[1])
  const minutes = Number(match[2])
  if (hours > 23 || minutes > 59) return null

  return hours * 60 + minutes
}

function toTimeValue(date: Date): string {
  return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`
}

function toDateValue(date: Date): string {
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${date.getFullYear()}-${month}-${day}`
}

/** El tipo se guardó por nombre, así que al editar se busca por coincidencia. */
function fromAppointment(appointment: Appointment, serviceTypes: ServiceType[]): AppointmentFormValues {
  const isMeeting = appointment.patientId === null

  return {
    patientId: isMeeting ? NO_PATIENT_VALUE : appointment.patientId,
    serviceTypeId: isMeeting
      ? ''
      : (serviceTypes.find((serviceType) => serviceType.name === appointment.appointmentType)?.id ??
        ''),
    meetingTitle: isMeeting ? appointment.patientName : '',
    date: toDateValue(appointment.start),
    startTime: toTimeValue(appointment.start),
    endTime: toTimeValue(appointment.end),
    status: appointment.status,
  }
}

function validate(values: AppointmentFormValues): Errors {
  const errors: Errors = {}
  const isMeeting = values.patientId === NO_PATIENT_VALUE

  if (values.patientId.trim() === '') {
    errors.patientId = 'Selecciona un paciente o la opción indeterminada.'
  } else if (isMeeting) {
    if (values.meetingTitle.trim() === '') {
      errors.meetingTitle = 'Escribe el título de la reunión.'
    }
  } else if (values.serviceTypeId.trim() === '') {
    errors.serviceTypeId = 'Selecciona un tipo de cita.'
  }

  if (values.date.trim() === '') {
    errors.date = 'Selecciona una fecha.'
  }

  const start = parseTimeToMinutes(values.startTime)
  const end = parseTimeToMinutes(values.endTime)

  if (start === null) {
    errors.startTime = 'Indica la hora de inicio.'
  }

  if (end === null) {
    errors.endTime = 'Indica la hora de fin.'
  } else if (end > LAST_BOOKABLE_MINUTES) {
    errors.endTime = 'La última hora disponible es las 21:00.'
  } else if (start !== null && end <= start) {
    errors.endTime = 'La hora de fin debe ser posterior a la de inicio.'
  }

  return errors
}

export function useAppointmentForm(options: {
  /** Cita en edición; null cuando se crea una nueva. */
  appointment: Appointment | null
  patients: Patient[]
  serviceTypes: ServiceType[]
  onSubmit: (draft: AppointmentDraft) => Promise<void>
  onDone: () => void
}) {
  const { appointment, patients, serviceTypes, onSubmit, onDone } = options

  const [values, setValues] = useState<AppointmentFormValues>(() =>
    appointment ? fromAppointment(appointment, serviceTypes) : emptyValues,
  )
  const [touched, setTouched] = useState<Partial<Record<Field, boolean>>>({})
  const [submitAttempted, setSubmitAttempted] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const errors = useMemo(() => validate(values), [values])
  const isValid = Object.keys(errors).length === 0
  const isMeeting = values.patientId === NO_PATIENT_VALUE

  const change = useCallback(
    (field: Field) => (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const nextValue = event.target.value
      setValues((current) => {
        if (field === 'patientId') {
          // Cambiar entre paciente y reunión invalida lo que ya no aplica, y el
          // estado de pago acompaña a la rama: una reunión nunca se cobra.
          const meetingSelected = nextValue === NO_PATIENT_VALUE
          return {
            ...current,
            patientId: nextValue,
            serviceTypeId: '',
            meetingTitle: '',
            status: meetingSelected
              ? 'no_payment'
              : current.status === 'no_payment'
                ? 'pending'
                : current.status,
          }
        }
        return { ...current, [field]: nextValue }
      })
    },
    [],
  )

  const blur = useCallback(
    (field: Field) => () => {
      setTouched((current) => ({ ...current, [field]: true }))
    },
    [],
  )

  const visibleError = useCallback(
    (field: Field) => (submitAttempted || touched[field] ? errors[field] : undefined),
    [errors, submitAttempted, touched],
  )

  const reset = useCallback(() => {
    setValues(emptyValues)
    setTouched({})
    setSubmitAttempted(false)
    setIsSaving(false)
  }, [])

  const handleSubmit = useCallback(
    async (event: FormEvent) => {
      event.preventDefault()
      setSubmitAttempted(true)
      if (Object.keys(validate(values)).length > 0) return

      setIsSaving(true)

      const [hours, minutes] = values.startTime.split(':').map(Number)
      const start = new Date(`${values.date}T00:00:00`)
      start.setHours(hours, minutes, 0, 0)

      const [endHours, endMinutes] = values.endTime.split(':').map(Number)
      const end = new Date(start)
      end.setHours(endHours, endMinutes, 0, 0)

      const patient = isMeeting
        ? null
        : patients.find((item) => item.id === values.patientId) ?? null

      const serviceType = serviceTypes.find((item) => item.id === values.serviceTypeId)

      await onSubmit({
        patientId: isMeeting ? null : patient?.id ?? null,
        patientName: isMeeting ? values.meetingTitle.trim() : patient?.name ?? '',
        appointmentType: isMeeting ? '' : serviceType?.name ?? '',
        start,
        end,
        // Al crear, el estado se deriva; al editar, manda lo elegido.
        status: isMeeting ? 'no_payment' : values.status,
      })

      setIsSaving(false)
      onDone()
    },
    [isMeeting, onDone, onSubmit, patients, serviceTypes, values],
  )

  return {
    values,
    isValid,
    isSaving,
    mode: appointment ? ('edit' as const) : ('create' as const),
    isMeeting,
    errors,
    setValue: change,
    onBlur: blur,
    getError: visibleError,
    handleSubmit,
    reset,
  }
}