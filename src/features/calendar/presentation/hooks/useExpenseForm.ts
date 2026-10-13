import { useCallback, useMemo, useState } from 'react'
import type { ChangeEvent, FormEvent } from 'react'
import type { ServiceType } from '../../../appointment-types/domain/entities/ServiceType'
import type { Expense, ExpenseDraft } from '../../domain/entities/Expense'

export interface ExpenseFormValues {
  description: string
  date: string
  /** Hora 'HH:MM' opcional; no ocupa la grilla. */
  time: string
  amount: string
  serviceTypeId: string
}

type Field = keyof ExpenseFormValues
type Errors = Partial<Record<Field, string>>

const emptyValues: ExpenseFormValues = {
  description: '',
  date: '',
  time: '',
  amount: '',
  serviceTypeId: '',
}

function toDateValue(date: Date): string {
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${date.getFullYear()}-${month}-${day}`
}

function fromExpense(expense: Expense): ExpenseFormValues {
  return {
    description: expense.description,
    date: toDateValue(expense.date),
    time: expense.time ?? '',
    amount: expense.amount === 0 ? '' : String(expense.amount),
    serviceTypeId: expense.serviceTypeId ?? '',
  }
}

function validate(values: ExpenseFormValues): Errors {
  const errors: Errors = {}

  if (values.date.trim() === '') {
    errors.date = 'Selecciona una fecha.'
  }

  if (values.serviceTypeId.trim() === '') {
    errors.serviceTypeId = 'Selecciona el tipo de cita.'
  }

  const amount = values.amount.trim()
  if (amount !== '' && (Number.isNaN(Number(amount)) || Number(amount) < 0)) {
    errors.amount = 'El monto debe ser un número mayor o igual a 0.'
  }

  return errors
}

export function useExpenseForm(options: {
  /** Gasto en edición; null cuando se crea uno nuevo. */
  expense: Expense | null
  /** Tipos de cita de categoría 'gastos', para copiar su costo. */
  expenseServiceTypes: ServiceType[]
  onSubmit: (draft: ExpenseDraft) => Promise<void>
  onDone: () => void
}) {
  const { expense, expenseServiceTypes, onSubmit, onDone } = options

  const [values, setValues] = useState<ExpenseFormValues>(() =>
    expense ? fromExpense(expense) : emptyValues,
  )
  const [touched, setTouched] = useState<Partial<Record<Field, boolean>>>({})
  const [submitAttempted, setSubmitAttempted] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const errors = useMemo(() => validate(values), [values])
  const isValid = Object.keys(errors).length === 0

  const change = useCallback(
    (field: Field) =>
      (event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const nextValue = event.target.value
        setValues((current) => {
          // Elegir un tipo de cita de gastos arrastra su costo, que es de donde
          // sale el monto; después se puede ajustar a mano.
          if (field === 'serviceTypeId') {
            const serviceType = expenseServiceTypes.find((item) => item.id === nextValue)
            return {
              ...current,
              serviceTypeId: nextValue,
              amount: serviceType && serviceType.price > 0 ? String(serviceType.price) : '',
            }
          }
          return { ...current, [field]: nextValue }
        })
      },
    [expenseServiceTypes],
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

  const handleSubmit = useCallback(
    async (event: FormEvent) => {
      event.preventDefault()
      setSubmitAttempted(true)
      if (Object.keys(validate(values)).length > 0) return

      setIsSaving(true)

      // La hora es solo informativa: el gasto siempre vive en la hora "Gastos".
      const date = new Date(`${values.date}T00:00:00`)

      await onSubmit({
        description: values.description.trim(),
        date,
        time: values.time.trim() === '' ? null : values.time,
        amount: values.amount.trim() === '' ? 0 : Number(values.amount),
        serviceTypeId: values.serviceTypeId,
      })

      setIsSaving(false)
      onDone()
    },
    [onDone, onSubmit, values],
  )

  return {
    values,
    isValid,
    isSaving,
    mode: expense ? ('edit' as const) : ('create' as const),
    setValue: change,
    onBlur: blur,
    getError: visibleError,
    handleSubmit,
  }
}