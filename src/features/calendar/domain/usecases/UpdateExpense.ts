import type { Expense, ExpensePatch } from '../entities/Expense'
import type { ExpenseRepository } from '../repositories/ExpenseRepository'

export class UpdateExpense {
  private readonly repository: ExpenseRepository

  constructor(repository: ExpenseRepository) {
    this.repository = repository
  }

  execute(id: string, patch: ExpensePatch): Promise<Expense> {
    const normalized: ExpensePatch = {
      ...patch,
      ...(patch.title !== undefined ? { title: patch.title.trim() } : {}),
      ...(patch.description !== undefined ? { description: patch.description.trim() } : {}),
    }

    return this.repository.update(id, normalized)
  }
}