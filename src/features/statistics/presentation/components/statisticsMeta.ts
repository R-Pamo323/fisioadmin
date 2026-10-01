import { colors } from '../../../../core/theme/colors'
import type { BadgeTone } from '../../../../shared/components'
import type { TransactionStatus } from '../../domain/entities/Statistics'

/** Formato de moneda tal como aparece en el mock: "$1,205.00". */
const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

export const formatCurrency = (value: number): string => currencyFormatter.format(value)

/** "+12.4%" / "-3.2%" */
export const formatPercent = (value: number): string =>
  `${value > 0 ? '+' : ''}${value.toFixed(1)}%`

const compactCurrencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  notation: 'compact',
  maximumFractionDigits: 1,
})

/** Ticks del eje Y: "$0", "$5K", "$12.5K". El importe completo vive en el tooltip. */
export const formatCompactCurrency = (value: number): string =>
  compactCurrencyFormatter.format(value)

const dateFormatter = new Intl.DateTimeFormat('es-ES', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
})

/** "14 jul 2026" */
export const formatShortDate = (isoDate: string): string => {
  const date = new Date(isoDate)
  return Number.isNaN(date.getTime()) ? '—' : dateFormatter.format(date)
}

interface StatusMeta {
  label: string
  tone: BadgeTone
}

export const TRANSACTION_STATUS_META: Record<TransactionStatus, StatusMeta> = {
  pagado: { label: 'Pagado', tone: 'success' },
  pendiente: { label: 'Pendiente', tone: 'info' },
  vencido: { label: 'Vencido', tone: 'error' },
}

/** Definición única de columnas: la comparten el card y el modal de transacciones. */
export const TRANSACTION_COLUMNS = [
  'Paciente',
  'Tipo de Cita',
  'Fecha',
  'Monto',
  'Estado',
] as const

/** Serie Ingresos en primary; Gastos en gris para que no compita con ella. */
export const REVENUE_SERIES = {
  ingresos: { key: 'ingresos', label: 'Ingresos', color: colors.primary },
  gastos: { key: 'gastos', label: 'Gastos', color: '#9CA3AF' },
} as const

export const AXIS_TICK = { fill: colors.textSecondary, fontSize: 12 } as const

export const GRID_COLOR = '#F3F4F6'