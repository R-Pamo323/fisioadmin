import { ArrowDownRight, ArrowUpRight } from 'lucide-react'
import { Badge } from '../../../../shared/components'
import { colors } from '../../../../core/theme/colors'
import type { MetricCard } from '../../domain/entities/Statistics'
import { formatPercent } from './statisticsMeta'
import styles from './StatCard.module.css'

interface StatCardProps {
  metric: MetricCard
}

export function StatCard({ metric }: StatCardProps) {
  const { trend, badge } = metric
  const isPositive = trend?.direction === 'up'
  const TrendIcon = isPositive ? ArrowUpRight : ArrowDownRight

  return (
    <div className={styles.card}>
      <div className={styles.head}>
        <span className={styles.label}>{metric.label}</span>

        {trend ? (
          <span
            className={styles.trend}
            style={{ color: isPositive ? colors.success : colors.error }}
          >
            <TrendIcon size={15} />
            {formatPercent(trend.percent)}
          </span>
        ) : null}
      </div>

      <strong className={styles.value}>{metric.value}</strong>

      <div className={styles.foot}>
        {badge ? <Badge tone={badge.tone}>{badge.label}</Badge> : null}
        <span className={styles.caption}>{metric.caption}</span>
      </div>
    </div>
  )
}