import { Badge } from '../../../../shared/components'
import type { MetricCard } from '../../domain/entities/Statistics'
import styles from './StatCard.module.css'

interface StatCardProps {
  metric: MetricCard
}

export function StatCard({ metric }: StatCardProps) {
  const { caption, badge } = metric

  return (
    <div className={styles.card}>
      <div className={styles.head}>
        <span className={styles.label}>{metric.label}</span>
      </div>

      <strong className={styles.value}>{metric.value}</strong>

      {badge || caption ? (
        <div className={styles.foot}>
          {badge ? <Badge tone={badge.tone}>{badge.label}</Badge> : null}
          {caption ? <span className={styles.caption}>{caption}</span> : null}
        </div>
      ) : null}
    </div>
  )
}
