import { useCallback, useEffect, useState } from 'react'
import { MockExpenseRepository } from '../../data/repositories/MockExpenseRepository'
import type { Expense, ExpenseDraft, ExpensePatch } from '../../domain/entities/Expense'
import { CreateExpense } from '../../domain/usecases/CreateExpense'
import { DeleteExpense } from '../../domain/usecases/DeleteExpense'
import { GetExpenses } from '../../domain/usecases/GetExpenses'
import { UpdateExpense } from '../../domain/usecases/UpdateExpense'

const repository = new MockExpenseRepository()
const getExpenses = new GetExpenses(repository)
const createExpense = new CreateExpense(repository)
const updateExpense = new UpdateExpense(repository)
const deleteExpense = new DeleteExpense(repository)

export function useExpenses() {
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const refresh = useCallback(async () => {
    const next = await getExpenses.execute()
    setExpenses(next)
  }, [])

  useEffect(() => {
    let active = true

    void (async () => {
      const next = await getExpenses.execute()
      if (!active) return
      setExpenses(next)
      setIsLoading(false)
    })()

    return () => {
      active = false
    }
  }, [])

  const create = useCallback(
    async (draft: ExpenseDraft) => {
      const created = await createExpense.execute(draft)
      await refresh()
      return created
    },
    [refresh],
  )

  const update = useCallback(
    async (id: string, patch: ExpensePatch) => {
      const updated = await updateExpense.execute(id, patch)
      await refresh()
      return updated
    },
    [refresh],
  )

  const remove = useCallback(
    async (id: string) => {
      await deleteExpense.execute(id)
      await refresh()
    },
    [refresh],
  )

  return { expenses, isLoading, create, update, remove }
}