import type { Expense, ExpenseDraft } from '../entities/Expense'
import type { ExpenseRepository } from '../repositories/ExpenseRepository'

export class CreateExpense {
  private readonly repository: ExpenseRepository

  constructor(repository: ExpenseRepository) {
    this.repository = repository
  }

  execute(draft: ExpenseDraft): Promise<Expense> {
    const normalized: ExpenseDraft = {
      ...draft,
      title: draft.title.trim(),
      description: draft.description.trim(),
    }

    return this.repository.create(normalized)
  }
}