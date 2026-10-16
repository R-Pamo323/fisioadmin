import { colors } from '../../../../core/theme/colors'
import type { BadgeTone, SelectOption } from '../../../../shared/components'
import type { TransactionStatus } from '../../domain/entities/Statistics'

/** El formateo de moneda vive en el dominio porque las métricas ya vienen formateadas. */
export { formatCurrency } from '../../domain/statisticsFormat'

const compactAmountFormatter = new Intl.NumberFormat('en-US', {
  notation: 'compact',
  maximumFractionDigits: 1,
})

/** Ticks del eje Y: "S/0", "S/5K", "S/12.5K". El importe completo vive en el tooltip. */
export const formatCompactCurrency = (value: number): string =>
  `S/${compactAmountFormatter.format(value)}`

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

const monthNameFormatter = new Intl.DateTimeFormat('es-ES', { month: 'long' })

/**
 * Opciones del filtro de mes: "Todo el año" más los 12 meses. El valor `all`
 * representa el año completo; los meses van como "0"–"11".
 */
export const MONTH_OPTIONS: SelectOption[] = [
  { value: 'all', label: 'Todo el año' },
  ...Array.from({ length: 12 }, (_, month) => {
    const name = monthNameFormatter.format(new Date(2024, month, 1))
    return {
      value: String(month),
      label: name.charAt(0).toUpperCase() + name.slice(1),
    }
  }),
]
