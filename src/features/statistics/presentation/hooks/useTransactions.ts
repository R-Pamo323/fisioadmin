import { useEffect, useState } from 'react'
import type { Transaction } from '../../domain/entities/Statistics'
import { MockStatisticsRepository } from '../../data/repositories/MockStatisticsRepository'
import { GetTransactions } from '../../domain/usecases/GetTransactions'

const repository = new MockStatisticsRepository()
const getTransactions = new GetTransactions(repository)

/** Carga diferida: solo pide datos cuando el modal se abre, y por año elegido. */
export function useTransactions(year: number, isOpen: boolean) {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (!isOpen) return

    let active = true
    setIsLoading(true)

    void (async () => {
      const next = await getTransactions.execute(year)
      if (!active) return
      setTransactions(next)
      setIsLoading(false)
    })()

    return () => {
      active = false
    }
  }, [year, isOpen])

  return { transactions, isLoading }
}
