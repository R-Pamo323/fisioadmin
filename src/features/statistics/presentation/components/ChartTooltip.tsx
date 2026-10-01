import type { TooltipContentProps } from 'recharts'
import { formatCurrency } from './statisticsMeta'
import styles from './ChartTooltip.module.css'

type ChartTooltipProps = TooltipContentProps<number, string> & {
  /** Cada gráfico decide cómo formatea sus valores. */
  valueFormatter?: (value: number) => string
}

export function ChartTooltip({
  active,
  label,
  payload,
  valueFormatter = formatCurrency,
}: ChartTooltipProps) {
  if (!active || !payload || payload.length === 0) return null

  return (
    <div className={styles.tooltip}>
      {label === undefined ? null : <span className={styles.title}>{label}</span>}

      <div className={styles.rows}>
        {payload.map((entry) => {
          const value = typeof entry.value === 'number' ? entry.value : null
          if (value === null) return null

          return (
            <div key={String(entry.dataKey)} className={styles.row}>
              <span className={styles.dot} style={{ background: entry.color }} />
              <span className={styles.name}>{entry.name}</span>
              <strong className={styles.value}>{valueFormatter(value)}</strong>
            </div>
          )
        })}
      </div>
    </div>
  )
}