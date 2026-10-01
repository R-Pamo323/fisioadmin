/** Tono del badge opcional de una métrica, sin depender de tipos de UI. */
export type MetricBadgeTone = 'info' | 'warning' | 'error' | 'success'

export type TrendDirection = 'up' | 'down'

export type TransactionStatus = 'pagado' | 'pendiente' | 'vencido'

export interface MetricTrend {
  /** Variación porcentual, con signo. */
  percent: number
  direction: TrendDirection
}

export interface MetricBadge {
  label: string
  tone: MetricBadgeTone
}

export interface MetricCard {
  id: string
  /** Etiqueta visible, ej. "Ingresos Totales". */
  label: string
  /** Ya formateado para mostrar, ej. "$12,450.00". */
  value: string
  /** Texto en mayúsculas debajo, ej. "VS. MES ANTERIOR". */
  caption: string
  trend?: MetricTrend
  badge?: MetricBadge
}

export interface RevenuePoint {
  /** Etiqueta del eje X: "Ene".."Dic". */
  label: string
  ingresos: number
  gastos: number
}

export interface ShareSlice {
  id: string
  name: string
  /** Proporción sobre el total, 0-100. */
  percent: number
  color: string
}

export interface Transaction {
  id: string
  patient: string
  appointmentType: string
  /** Fecha en formato ISO. */
  date: string
  amount: number
  status: TransactionStatus
}

export interface PaymentBucket {
  id: string
  label: string
  amount: number
  color: string
}

export interface StatisticsOverview {
  metrics: MetricCard[]
  /** Ene-Dic, con el scroll horizontal resolviendo los meses fuera de vista. */
  monthly: RevenuePoint[]
  appointmentShare: ShareSlice[]
  /** Solo las más recientes para el card; la lista completa la trae GetTransactions. */
  transactions: Transaction[]
  payments: PaymentBucket[]
}