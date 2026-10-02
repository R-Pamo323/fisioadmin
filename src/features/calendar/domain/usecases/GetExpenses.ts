import type { Expense } from '../entities/Expense'
import type { ExpenseRepository } from '../repositories/ExpenseRepository'

export class GetExpenses {
  private readonly repository: ExpenseRepository

  constructor(repository: ExpenseRepository) {
    this.repository = repository
  }

  execute(): Promise<Expense[]> {
    return this.repository.list()
  }
}