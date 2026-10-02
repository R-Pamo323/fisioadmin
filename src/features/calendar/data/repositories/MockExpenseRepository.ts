import type { Expense, ExpenseDraft, ExpensePatch } from '../../domain/entities/Expense'
import type { ExpenseRepository } from '../../domain/repositories/ExpenseRepository'
import { mockExpenses } from '../datasources/mockExpenses'

export class MockExpenseRepository implements ExpenseRepository {
  list(): Promise<Expense[]> {
    return Promise.resolve(mockExpenses.list())
  }

  create(draft: ExpenseDraft): Promise<Expense> {
    return Promise.resolve(mockExpenses.create(draft))
  }

  update(id: string, patch: ExpensePatch): Promise<Expense> {
    const updated = mockExpenses.update(id, patch)

    if (!updated) {
      return Promise.reject(new Error(`No existe el gasto ${id}`))
    }

    return Promise.resolve(updated)
  }

  remove(id: string): Promise<void> {
    mockExpenses.remove(id)
    return Promise.resolve()
  }
}