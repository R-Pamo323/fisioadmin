import { useCallback, useMemo, useState } from 'react'
import type { ChangeEvent, FormEvent } from 'react'
import type {
  Patient,
  PatientDraft,
  PatientGender,
  PatientStatus,
} from '../../domain/entities/Patient'
import { DEFAULT_GENDER, DEFAULT_STATUS } from '../components/patientMeta'

export interface PatientFormValues {
  name: string
  age: string
  gender: PatientGender
  email: string
  phone: string
  diagnosis: string
  treatment: string
  status: PatientStatus
}

type FormField = keyof PatientFormValues
type FormErrors = Partial<Record<FormField, string>>

const emptyValues: PatientFormValues = {
  name: '',
  age: '',
  gender: DEFAULT_GENDER,
  email: '',
  phone: '',
  diagnosis: '',
  treatment: '',
  status: DEFAULT_STATUS,
}

const fromPatient = (patient: Patient): PatientFormValues => ({
  name: patient.name,
  age: String(patient.age),
  gender: patient.gender,
  email: patient.email,
  phone: patient.phone,
  diagnosis: patient.diagnosis,
  treatment: patient.treatment,
  status: patient.status,
})

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

const parseNumber = (value: string): number | null => {
  const trimmed = value.trim()
  if (trimmed === '') return null

  const parsed = Number(trimmed)
  return Number.isFinite(parsed) ? parsed : null
}

function validate(values: PatientFormValues): FormErrors {
  const errors: FormErrors = {}

  if (values.name.trim() === '') {
    errors.name = 'El nombre del paciente es obligatorio.'
  }

  const age = parseNumber(values.age)
  if (age === null) {
    errors.age = 'Indica la edad del paciente.'
  } else if (!Number.isInteger(age)) {
    errors.age = 'La edad debe ser un número entero.'
  } else if (age < 0 || age > 120) {
    errors.age = 'La edad debe estar entre 0 y 120 años.'
  }

  if (values.email.trim() === '') {
    errors.email = 'El correo es obligatorio.'
  } else if (!EMAIL_PATTERN.test(values.email.trim())) {
    errors.email = 'Ingresa un correo válido.'
  }

  if (values.phone.trim() === '') {
    errors.phone = 'El teléfono es obligatorio.'
  }

  if (values.treatment.trim() === '') {
    errors.treatment = 'Indica el tratamiento actual del paciente.'
  }

  return errors
}

export function usePatientForm(options: {
  patient: Patient | null
  onSubmit: (draft: PatientDraft) => Promise<void>
  onDone: () => void
}) {
  const { patient, onSubmit, onDone } = options

  const [values, setValues] = useState<PatientFormValues>(() =>
    patient ? fromPatient(patient) : emptyValues,
  )
  const [touched, setTouched] = useState<Partial<Record<FormField, boolean>>>({})
  const [submitAttempted, setSubmitAttempted] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const errors = useMemo(() => validate(values), [values])
  const isValid = Object.keys(errors).length === 0

  const change = useCallback(
    (field: FormField) =>
      (event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const nextValue = event.target.value
        setValues((current) => ({ ...current, [field]: nextValue }))
      },
    [],
  )

  const blur = useCallback(
    (field: FormField) => () => {
      setTouched((current) => ({ ...current, [field]: true }))
    },
    [],
  )

  const visibleError = useCallback(
    (field: FormField) => (submitAttempted || touched[field] ? errors[field] : undefined),
    [errors, submitAttempted, touched],
  )

  const reset = useCallback(() => {
    setValues(patient ? fromPatient(patient) : emptyValues)
    setTouched({})
    setSubmitAttempted(false)
    setIsSaving(false)
  }, [patient])

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSubmitAttempted(true)

    if (Object.keys(validate(values)).length > 0 || isSaving) return

    setIsSaving(true)

    await onSubmit({
      name: values.name,
      age: parseNumber(values.age) ?? 0,
      gender: values.gender,
      email: values.email,
      phone: values.phone,
      diagnosis: values.diagnosis,
      treatment: values.treatment,
      status: values.status,
      // La última visita solo cambia al guardar un paciente nuevo.
      lastVisitAt: patient ? patient.lastVisitAt : new Date().toISOString(),
    })

    setIsSaving(false)
    onDone()
  }

  return {
    values,
    isValid,
    isSaving,
    mode: patient ? ('edit' as const) : ('create' as const),
    setValue: change,
    onBlur: blur,
    getError: visibleError,
    handleSubmit,
    reset,
  }
}