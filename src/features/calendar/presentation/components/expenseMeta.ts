import { Receipt } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { colors } from '../../../../core/theme/colors'

export interface ExpenseMeta {
  label: string
  color: string
  background: string
  Icon: LucideIcon
}

/**
 * El rojo es exclusivo de los gastos: en el calendario es lo único que se
 * pinta de ese color, y nunca ocupa la grilla de horas.
 */
export const EXPENSE_META: ExpenseMeta = {
  label: 'Gasto',
  color: colors.error,
  background: '#FEF2F2',
  Icon: Receipt,
}

/** Igual que en Tipos de cita: el rojo se reserva para el monto real. */
export function formatExpenseAmount(amount: number): string {
  return amount === 0 ? 'Sin costo' : `S/${amount}`
}

export function formatExpenseDate(date: Date): string {
  return new Intl.DateTimeFormat('es-ES', { weekday: 'short', day: 'numeric' }).format(date)
}