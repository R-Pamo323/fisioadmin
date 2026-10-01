import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { Card } from '../../../../shared/components'
import type { RevenuePoint } from '../../domain/entities/Statistics'
import { ChartTooltip } from './ChartTooltip'
import {
  AXIS_TICK,
  GRID_COLOR,
  REVENUE_SERIES,
  formatCompactCurrency,
  formatCurrency,
} from './statisticsMeta'
import styles from './RevenueBarChart.module.css'

/** Ancho mínimo del lienzo: mantiene las 12 barras legibles y genera el scroll. */
const CANVAS_MIN_WIDTH = 1200

/** Ancho máximo por barra; el resto del espacio va como aire entre meses. */
const MAX_BAR_SIZE = 30

interface RevenueBarChartProps {
  data: RevenuePoint[]
}

export function RevenueBarChart({ data }: RevenueBarChartProps) {
  return (
    <Card className={styles.card}>
      <header className={styles.head}>
        <h3 className={styles.title}>Rendimiento de Ingresos</h3>
        <p className={styles.subtitle}>Comparativa histórica de ingresos vs gastos</p>
      </header>

      {/* El scroll vive en el contenedor y el lienzo nunca baja del ancho mínimo:
          así las barras no se estrechan al encoger el card de dos columnas. */}
      <div className={styles.scroll}>
        <div className={styles.canvas} style={{ minWidth: CANVAS_MIN_WIDTH }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
              barGap={2}
            >
              <CartesianGrid stroke={GRID_COLOR} vertical={false} />
              <XAxis
                dataKey="label"
                axisLine={false}
                tickLine={false}
                tick={AXIS_TICK}
                interval={0}
              />
              {/* width="auto" mide la etiqueta más ancha: con importes completos
                  un width fijo recortaba el inicio de "$12,450.00". */}
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={AXIS_TICK}
                tickFormatter={formatCompactCurrency}
                width="auto"
              />
              <Tooltip
                cursor={{ fill: '#F9FAFB' }}
                content={<ChartTooltip valueFormatter={formatCurrency} />}
              />

              <Bar
                dataKey={REVENUE_SERIES.ingresos.key}
                name={REVENUE_SERIES.ingresos.label}
                fill={REVENUE_SERIES.ingresos.color}
                radius={[4, 4, 0, 0]}
                maxBarSize={MAX_BAR_SIZE}
              />
              <Bar
                dataKey={REVENUE_SERIES.gastos.key}
                name={REVENUE_SERIES.gastos.label}
                fill={REVENUE_SERIES.gastos.color}
                radius={[4, 4, 0, 0]}
                maxBarSize={MAX_BAR_SIZE}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <ul className={styles.legend}>
        {[REVENUE_SERIES.ingresos, REVENUE_SERIES.gastos].map((series) => (
          <li key={series.key} className={styles.legendItem}>
            <span className={styles.legendDot} style={{ background: series.color }} />
            {series.label}
          </li>
        ))}
      </ul>
    </Card>
  )
}