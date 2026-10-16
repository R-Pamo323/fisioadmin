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
  /** Ya formateado para mostrar, ej. "S/630.00". */
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
  /** Años navegables del selector, de más antiguo a más reciente. */
  years: number[]
  metrics: MetricCard[]
  /** Los 12 meses del año seleccionado (Ene–Dic); los vacíos quedan en 0. */
  monthly: RevenuePoint[]
  appointmentShare: ShareSlice[]
  /** Reparto de cada mes del año (índice 0–11), para el filtro por mes del panel. */
  appointmentShareByMonth: ShareSlice[][]
  /** Todas las transacciones del año, de la más reciente a la más antigua. */
  transactions: Transaction[]
  /** Transacciones de cada mes del año (índice 0–11), para el filtro por mes del panel. */
  transactionsByMonth: Transaction[][]
  payments: PaymentBucket[]
  /** Estado de pagos de cada mes del año (índice 0–11), para el filtro por mes del panel. */
  paymentsByMonth: PaymentBucket[][]
}
