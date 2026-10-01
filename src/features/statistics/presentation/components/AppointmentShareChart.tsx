import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'
import { Card } from '../../../../shared/components'
import type { ShareSlice } from '../../domain/entities/Statistics'
import { ChartTooltip } from './ChartTooltip'
import styles from './AppointmentShareChart.module.css'

interface AppointmentShareChartProps {
  data: ShareSlice[]
}

const formatPercentValue = (value: number) => `${value}%`

export function AppointmentShareChart({ data }: AppointmentShareChartProps) {
  return (
    <Card className={styles.card}>
      <header className={styles.head}>
        <h3 className={styles.title}>Distribución por Cita</h3>
        <p className={styles.subtitle}>Volumen de ingresos según especialidad</p>
      </header>

      <div className={styles.plot}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Tooltip content={<ChartTooltip valueFormatter={formatPercentValue} />} />
            <Pie
              data={data}
              dataKey="percent"
              nameKey="name"
              innerRadius="58%"
              outerRadius="82%"
              paddingAngle={2}
              stroke="#FFFFFF"
              strokeWidth={2}
            >
              {data.map((slice) => (
                <Cell key={slice.id} fill={slice.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>

      <ul className={styles.legend}>
        {data.map((slice) => (
          <li key={slice.id} className={styles.legendItem}>
            <span className={styles.legendDot} style={{ background: slice.color }} />
            <span className={styles.legendName}>{slice.name}</span>
            <strong className={styles.legendValue}>{slice.percent}%</strong>
          </li>
        ))}
      </ul>
    </Card>
  )
}