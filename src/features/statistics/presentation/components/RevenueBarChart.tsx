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

/** Ancho mínimo por mes: con los 12 meses fuerza el scroll horizontal. */
const MONTH_SLOT_WIDTH = 64

interface RevenueBarChartProps {
  data: RevenuePoint[]
}

export function RevenueBarChart({ data }: RevenueBarChartProps) {
  const hasData = data.some((point) => point.ingresos > 0 || point.gastos > 0)
  const canvasMinWidth = data.length * MONTH_SLOT_WIDTH

  return (
    <Card className={styles.card}>
      <header className={styles.head}>
        <h3 className={styles.title}>Rendimiento de Ingresos</h3>
        <p className={styles.subtitle}>Comparativa histórica de ingresos vs gastos</p>
      </header>

      {hasData ? (
        <>
          <div className={styles.scroll}>
            <div className={styles.canvas} style={{ minWidth: canvasMinWidth }}>
              <ResponsiveContainer width="100%" height="100%">
                {/* barCategoryGap bajo y sin tope de ancho: las barras llenan el
                    slot y quedan juntas, sin el aire del maxBarSize anterior. */}
                <BarChart
                  data={data}
                  margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
                  barCategoryGap="16%"
                  barGap={4}
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
                      un width fijo recortaba el inicio de "S/12,450.00". */}
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
                  />
                  <Bar
                    dataKey={REVENUE_SERIES.gastos.key}
                    name={REVENUE_SERIES.gastos.label}
                    fill={REVENUE_SERIES.gastos.color}
                    radius={[4, 4, 0, 0]}
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
        </>
      ) : (
        <p className={styles.empty}>Sin datos en este año</p>
      )}
    </Card>
  )
}
