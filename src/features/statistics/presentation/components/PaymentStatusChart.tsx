import type { LucideIcon } from 'lucide-react'
import { AlertTriangle, CheckCircle2, Clock } from 'lucide-react'
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'
import { Card, ProgressBar } from '../../../../shared/components'
import type { PaymentBucket } from '../../domain/entities/Statistics'
import { ChartTooltip } from './ChartTooltip'
import { formatCurrency } from './statisticsMeta'
import styles from './PaymentStatusChart.module.css'

interface PaymentStatusChartProps {
  data: PaymentBucket[]
}

const BUCKET_ICONS: Record<string, LucideIcon> = {
  paid: CheckCircle2,
  pending: Clock,
  overdue: AlertTriangle,
}

export function PaymentStatusChart({ data }: PaymentStatusChartProps) {
  const total = data.reduce((sum, bucket) => sum + bucket.amount, 0)
  const paid = data.find((bucket) => bucket.id === 'paid')
  const effectiveness = total > 0 && paid ? Math.round((paid.amount / total) * 100) : 0

  return (
    <Card className={styles.card}>
      <header className={styles.head}>
        <h3 className={styles.title}>Estado de Pagos</h3>
        <p className={styles.subtitle}>Cumplimiento de facturación actual</p>
      </header>

      <div className={styles.plot}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Tooltip content={<ChartTooltip valueFormatter={formatCurrency} />} />
            <Pie
              data={data}
              dataKey="amount"
              nameKey="label"
              innerRadius="68%"
              outerRadius="92%"
              paddingAngle={2}
              stroke="#FFFFFF"
              strokeWidth={2}
              startAngle={90}
              endAngle={-270}
            >
              {data.map((bucket) => (
                <Cell key={bucket.id} fill={bucket.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>

        {/* El centro se superpone con HTML en vez de usar <Label> de recharts:
            así la tipografía y el peso salen de los tokens del proyecto. */}
        <div className={styles.center}>
          <strong className={styles.centerValue}>{effectiveness}%</strong>
          <span className={styles.centerLabel}>EFECTIVIDAD</span>
        </div>
      </div>

      <ul className={styles.list}>
        {data.map((bucket) => {
          const Icon = BUCKET_ICONS[bucket.id]

          return (
            <li key={bucket.id} className={styles.item}>
              <div className={styles.itemHead}>
                <span className={styles.itemLabel}>
                  {Icon ? <Icon size={15} style={{ color: bucket.color }} /> : null}
                  {bucket.label}
                </span>
                <strong className={styles.itemAmount}>{formatCurrency(bucket.amount)}</strong>
              </div>
              <ProgressBar
                value={bucket.amount}
                max={total}
                color={bucket.color}
                height={4}
                ariaLabel={`${bucket.label}: ${formatCurrency(bucket.amount)} de ${formatCurrency(total)}`}
              />
            </li>
          )
        })}
      </ul>
    </Card>
  )
}