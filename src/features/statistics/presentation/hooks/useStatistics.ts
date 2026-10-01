import { useCallback, useEffect, useState } from 'react'
import type { StatisticsOverview } from '../../domain/entities/Statistics'
import { MockStatisticsRepository } from '../../data/repositories/MockStatisticsRepository'
import { GetStatisticsOverview } from '../../domain/usecases/GetStatisticsOverview'

const repository = new MockStatisticsRepository()
const getStatisticsOverview = new GetStatisticsOverview(repository)

export function useStatistics() {
  const [overview, setOverview] = useState<StatisticsOverview | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let active = true

    void (async () => {
      const next = await getStatisticsOverview.execute()
      if (!active) return
      setOverview(next)
      setIsLoading(false)
    })()

    return () => {
      active = false
    }
  }, [])

  const refresh = useCallback(async () => {
    const next = await getStatisticsOverview.execute()
    setOverview(next)
  }, [])

  return { overview, isLoading, refresh }
}