/**
 * Un gasto es una salida de dinero de la clínica, no una cita. Por eso vive
 * aparte de Appointment: no tiene paciente, no tiene duración y no ocupa
 * horario en la grilla. En el calendario aparece en la banda de todo el día.
 */
export interface Expense {
  id: string
  title: string
  description: string
  /** Día en el que se registró el gasto. */
  date: Date
  /** Hora 'HH:MM' opcional. Es informativa: no ubica el evento en la grilla. */
  time: string | null
  /** Costo del gasto. */
  amount: number
  /** Tipo de cita de categoría 'gastos' del que se copió el costo, si aplica. */
  serviceTypeId: string | null
}

export type ExpenseDraft = Omit<Expense, 'id'>

export type ExpensePatch = Partial<Omit<Expense, 'id'>>