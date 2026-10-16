import { useCallback, useMemo, useState } from 'react'
import type { ChangeEvent, FormEvent } from 'react'
import type { ServiceCategory, ServiceType, ServiceTypeDraft } from '../../domain/entities/ServiceType'
import { DEFAULT_CATEGORY } from '../components/serviceMeta'

interface ServiceTypeFormValues {
  name: string
  price: string
  duration: string
  description: string
  protocol: string
  category: ServiceCategory
}

type FormField = keyof ServiceTypeFormValues
type FormErrors = Partial<Record<FormField, string>>

const emptyValues: ServiceTypeFormValues = {
  name: '',
  price: '',
  duration: '',
  description: '',
  protocol: '',
  category: DEFAULT_CATEGORY,
}

const fromServiceType = (service: ServiceType): ServiceTypeFormValues => ({
  name: service.name,
  price: String(service.price),
  duration: String(service.durationMinutes),
  description: service.description,
  protocol: service.protocol.join('\n'),
  category: service.category,
})

/** Convierte el texto del textarea en pasos, ignorando líneas vacías. */
const parseProtocol = (value: string): string[] =>
  value
    .split('\n')
    .map((step) => step.trim())
    .filter((step) => step !== '')

const parseNumber = (value: string): number | null => {
  const trimmed = value.trim()
  if (trimmed === '') return null

  const parsed = Number(trimmed)
  return Number.isFinite(parsed) ? parsed : null
}

function validate(values: ServiceTypeFormValues): FormErrors {
  const errors: FormErrors = {}

  if (values.name.trim() === '') {
    errors.name = 'El nombre del servicio es obligatorio.'
  }

  // El precio siempre es obligatorio. En gratis el servicio no cobra, así que
  // el único valor válido es 0 (el campo queda fijo ahí).
  const price = parseNumber(values.price)
  if (price === null) {
    errors.price = 'Indica el precio del servicio.'
  } else if (price < 0) {
    errors.price = 'El precio no puede ser negativo.'
  } else if (values.category === 'gratis' && price !== 0) {
    errors.price = 'Un servicio gratis debe tener precio 0.'
  }

  // La duración solo es opcional en gastos; en beneficios y gratis es
  // obligatoria. Un 0 en gastos equivale a "sin duración".
  const duration = parseNumber(values.duration)
  if (values.category !== 'gastos') {
    if (duration === null) {
      errors.duration = 'La duración en minutos es obligatoria.'
    } else if (duration <= 0) {
      errors.duration = 'La duración debe ser mayor a 0 minutos.'
    }
  } else if (duration !== null && duration < 0) {
    errors.duration = 'La duración no puede ser negativa.'
  }

  if (values.description.trim() === '') {
    errors.description = 'La descripción del servicio es obligatoria.'
  }

  return errors
}

export function useServiceTypeForm(options: {
  service: ServiceType | null
  onSubmit: (draft: ServiceTypeDraft) => Promise<void>
  onDone: () => void
}) {
  const { service, onSubmit, onDone } = options

  const [values, setValues] = useState<ServiceTypeFormValues>(() =>
    service ? fromServiceType(service) : emptyValues,
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
        setValues((current) => {
          // Elegir gratis no deja precio: el servicio es sin coste.
          if (field === 'category' && nextValue === 'gratis') {
            return { ...current, category: 'gratis', price: '0' }
          }

          // Un gratis no puede cambiar su precio, aunque el campo esté bloqueado.
          if (field === 'price' && current.category === 'gratis') {
            return current
          }

          return { ...current, [field]: nextValue }
        })
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
    setValues(service ? fromServiceType(service) : emptyValues)
    setTouched({})
    setSubmitAttempted(false)
    setIsSaving(false)
  }, [service])

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSubmitAttempted(true)

    if (Object.keys(validate(values)).length > 0 || isSaving) return

    setIsSaving(true)

    await onSubmit({
      name: values.name,
      price: values.category === 'gratis' ? 0 : parseNumber(values.price) ?? 0,
      durationMinutes: parseNumber(values.duration) ?? 0,
      description: values.description,
      category: values.category,
      protocol: parseProtocol(values.protocol),
    })

    setIsSaving(false)
    onDone()
  }

  return {
    values,
    isValid,
    isSaving,
    mode: service ? ('edit' as const) : ('create' as const),
    setValue: change,
    onBlur: blur,
    getError: visibleError,
    handleSubmit,
    reset,
  }
}
