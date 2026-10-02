import type { Expense, ExpenseDraft, ExpensePatch } from '../entities/Expense'

export interface ExpenseRepository {
  list(): Promise<Expense[]>
  create(draft: ExpenseDraft): Promise<Expense>
  update(id: string, patch: ExpensePatch): Promise<Expense>
  remove(id: string): Promise<void>
}