import type { ExpenseRepository } from '../repositories/ExpenseRepository'

export class DeleteExpense {
  private readonly repository: ExpenseRepository

  constructor(repository: ExpenseRepository) {
    this.repository = repository
  }

  execute(id: string): Promise<void> {
    return this.repository.remove(id)
  }
}