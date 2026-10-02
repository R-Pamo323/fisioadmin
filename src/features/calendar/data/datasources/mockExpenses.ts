import type { Expense, ExpenseDraft, ExpensePatch } from '../../domain/entities/Expense'

function dayOffset(offsetDays: number): Date {
  const date = new Date()
  date.setDate(date.getDate() + offsetDays)
  date.setHours(0, 0, 0, 0)
  return date
}

/*
 * Los gastos no son citas: no ocupan horario, por eso no llevan hora de inicio
 * ni de fin. La hora es opcional y solo informativa.
 */
const SEED_EXPENSES: Expense[] = [
  {
    id: 'e1',
    title: 'Alquiler del local',
    description: 'Mesada del mes',
    date: dayOffset(1),
    time: '09:00',
    amount: 1500,
    serviceTypeId: null,
  },
  {
    id: 'e2',
    title: 'Luz e internet',
    description: 'Factura del mes',
    date: dayOffset(3),
    time: null,
    amount: 320,
    serviceTypeId: null,
  },
  {
    id: 'e3',
    title: 'Insumos médicos',
    description: 'Vendas, gasas y material descartable',
    date: dayOffset(4),
    time: null,
    amount: 480,
    serviceTypeId: null,
  },
  {
    id: 'e4',
    title: 'Mantenimiento de equipos',
    description: 'Revisión de los equipos de la clínica',
    date: dayOffset(2),
    time: '16:00',
    amount: 350,
    serviceTypeId: null,
  },
]

let expenses: Expense[] = SEED_EXPENSES.map((expense) => ({ ...expense }))

let sequence = SEED_EXPENSES.length

export const mockExpenses = {
  list(): Expense[] {
    return expenses.map((expense) => ({ ...expense }))
  },

  create(input: ExpenseDraft): Expense {
    sequence += 1

    const created: Expense = { ...input, id: `e-${sequence}` }

    expenses = [...expenses, created]

    return { ...created }
  },

  update(id: string, patch: ExpensePatch): Expense | null {
    const current = expenses.find((expense) => expense.id === id)
    if (!current) return null

    const updated: Expense = { ...current, ...patch, id: current.id }

    expenses = expenses.map((expense) => (expense.id === id ? updated : expense))

    return { ...updated }
  },

  remove(id: string): boolean {
    const exists = expenses.some((expense) => expense.id === id)
    expenses = expenses.filter((expense) => expense.id !== id)
    return exists
  },
}