/** Tono del badge opcional de una métrica, sin depender de tipos de UI. */
export type MetricBadgeTone = 'info' | 'warning' | 'error' | 'success'

export type TransactionStatus = 'pagado' | 'pendiente'

export interface MetricBadge {
  label: string
  tone: MetricBadgeTone
}

export interface MetricCard {
  id: string
  /** Etiqueta visible, ej. "Ingresos Totales". */
  label: string
  /** Ya formateado para mostrar, ej. "$630.00". */
  value: string
  /** Texto en mayúsculas debajo; opcional. */
  caption?: string
  badge?: MetricBadge
}

export interface RevenuePoint {
  /** Etiqueta del eje X, ej. "Sep". */
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
  /** Meses con datos, de más antiguo a más reciente. */
  monthly: RevenuePoint[]
  appointmentShare: ShareSlice[]
  /** Solo las más recientes para el card; la lista completa la trae GetTransactions. */
  transactions: Transaction[]
  payments: PaymentBucket[]
}
