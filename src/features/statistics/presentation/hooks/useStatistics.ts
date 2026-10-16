import { useCallback, useEffect, useState } from 'react'
import type { StatisticsOverview } from '../../domain/entities/Statistics'
import { SupabaseStatisticsRepository } from '../../data/repositories/SupabaseStatisticsRepository'
import { GetStatisticsOverview } from '../../domain/usecases/GetStatisticsOverview'

const repository = new SupabaseStatisticsRepository()
const getStatisticsOverview = new GetStatisticsOverview(repository)

export function useStatistics(year: number) {
  const [overview, setOverview] = useState<StatisticsOverview | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let active = true

    // Solo se marca carga la primera vez: al cambiar de año se conserva el
    // resumen anterior hasta que llega el nuevo, sin parpadear.
    void (async () => {
      const next = await getStatisticsOverview.execute(year)
      if (!active) return
      setOverview(next)
      setIsLoading(false)
    })()

    return () => {
      active = false
    }
  }, [year])

  const refresh = useCallback(async () => {
    const next = await getStatisticsOverview.execute(year)
    setOverview(next)
  }, [year])

  return { overview, isLoading, refresh }
}
