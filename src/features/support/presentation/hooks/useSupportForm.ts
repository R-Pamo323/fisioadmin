import { useCallback, useMemo, useState } from 'react'
import type { ChangeEvent, FormEvent } from 'react'
import { MockSupportRepository } from '../../data/repositories/MockSupportRepository'
import { SendSupportMessage } from '../../domain/usecases/SendSupportMessage'

const sendSupportMessage = new SendSupportMessage(new MockSupportRepository())

export interface SupportFormValues {
  title: string
  subject: string
  message: string
}

export type SupportFormField = keyof SupportFormValues
type FormErrors = Partial<Record<SupportFormField, string>>

const REQUIRED_ERROR = 'Este campo es obligatorio'

const emptyValues: SupportFormValues = {
  title: '',
  subject: '',
  message: '',
}

function validate(values: SupportFormValues): FormErrors {
  const errors: FormErrors = {}

  if (values.title.trim() === '') errors.title = REQUIRED_ERROR
  if (values.subject.trim() === '') errors.subject = REQUIRED_ERROR
  if (values.message.trim() === '') errors.message = REQUIRED_ERROR

  return errors
}

export function useSupportForm(options: { onSent: () => void }) {
  const { onSent } = options

  const [values, setValues] = useState<SupportFormValues>(emptyValues)
  const [touched, setTouched] = useState<Partial<Record<SupportFormField, boolean>>>({})
  const [submitAttempted, setSubmitAttempted] = useState(false)
  const [isSending, setIsSending] = useState(false)

  const errors = useMemo(() => validate(values), [values])
  const isValid = Object.keys(errors).length === 0

  const change = useCallback(
    (field: SupportFormField) =>
      (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const nextValue = event.target.value
        setValues((current) => ({ ...current, [field]: nextValue }))
      },
    [],
  )

  const blur = useCallback(
    (field: SupportFormField) => () => {
      setTouched((current) => ({ ...current, [field]: true }))
    },
    [],
  )

  const visibleError = useCallback(
    (field: SupportFormField) => (submitAttempted || touched[field] ? errors[field] : undefined),
    [errors, submitAttempted, touched],
  )

  const reset = useCallback(() => {
    setValues(emptyValues)
    setTouched({})
    setSubmitAttempted(false)
    setIsSending(false)
  }, [])

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSubmitAttempted(true)

    if (Object.keys(validate(values)).length > 0 || isSending) return

    setIsSending(true)
    await sendSupportMessage.execute(values)
    setIsSending(false)

    reset()
    onSent()
  }

  return {
    values,
    isValid,
    isSending,
    setValue: change,
    onBlur: blur,
    getError: visibleError,
    handleSubmit,
  }
}