import type { Expense, ExpenseDraft, ExpensePatch } from '../../domain/entities/Expense'
import { toDateInputValue } from '../../../../shared/utils/date'

/** Fila tal como la devuelve la tabla `expenses` de Supabase. */
export interface ExpenseRow {
  id: string
  description: string
  /** Columna `date`: "YYYY-MM-DD". */
  date: string
  time: string | null
  amount: number | string
  service_type_id: string | null
}

/**
 * "YYYY-MM-DD" → Date a medianoche LOCAL. La columna es `date` (sin zona), así
 * que no se puede usar `new Date("YYYY-MM-DD")` (que la interpreta en UTC y
 * desplaza el día).
 */
function parseLocalDate(value: string): Date {
  return new Date(`${value}T00:00:00`)
}

export function toExpense(row: ExpenseRow): Expense {
  return {
    id: row.id,
    description: row.description,
    date: parseLocalDate(row.date),
    time: row.time,
    amount: Number(row.amount),
    serviceTypeId: row.service_type_id,
  }
}

export function toExpenseRow(payload: Partial<ExpenseDraft | ExpensePatch>) {
  const row: Record<string, unknown> = {}
  if (payload.description !== undefined) row.description = payload.description
  if (payload.date !== undefined) row.date = toDateInputValue(payload.date)
  if (payload.time !== undefined) row.time = payload.time
  if (payload.amount !== undefined) row.amount = payload.amount
  if (payload.serviceTypeId !== undefined) row.service_type_id = payload.serviceTypeId
  return row
}
