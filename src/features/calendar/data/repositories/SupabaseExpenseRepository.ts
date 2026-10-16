import { supabase } from '../../../../shared/lib/supabase'
import { createId } from '../../../../shared/lib/ids'
import type { Expense, ExpenseDraft, ExpensePatch } from '../../domain/entities/Expense'
import type { ExpenseRepository } from '../../domain/repositories/ExpenseRepository'
import { toExpense, toExpenseRow, type ExpenseRow } from '../mappers/ExpenseMapper'

export class SupabaseExpenseRepository implements ExpenseRepository {
  async list(): Promise<Expense[]> {
    const { data, error } = await supabase.from('expenses').select('*').order('date')

    if (error) throw error

    return (data as ExpenseRow[]).map(toExpense)
  }

  async create(draft: ExpenseDraft): Promise<Expense> {
    const { data, error } = await supabase
      .from('expenses')
      .insert({ id: createId('e'), ...toExpenseRow(draft) })
      .select('*')
      .single()

    if (error) throw error

    return toExpense(data as ExpenseRow)
  }

  async update(id: string, patch: ExpensePatch): Promise<Expense> {
    const { data, error } = await supabase
      .from('expenses')
      .update(toExpenseRow(patch))
      .eq('id', id)
      .select('*')
      .single()

    if (error) throw error

    return toExpense(data as ExpenseRow)
  }

  async remove(id: string): Promise<void> {
    const { error } = await supabase.from('expenses').delete().eq('id', id)

    if (error) throw error
  }
}
