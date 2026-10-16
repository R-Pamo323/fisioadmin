import { colors } from '../../../../core/theme/colors'
import type { BadgeTone } from '../../../../shared/components'
import { formatSoles } from '../../../../shared/utils/currency'
import type { ServiceCategory } from '../../domain/entities/ServiceType'

interface CategoryMeta {
  label: string
  tone: BadgeTone
  /** Wash usado detrás de las iniciales en la card. */
  wash: string
  /** Las iniciales van en blanco sobre el wash, así que necesita contraste. */
  ink: string
  /** Etiqueta del dato de dinero en la card y en el modal de detalle. */
  amountLabel: string
}

export const CATEGORY_META: Record<ServiceCategory, CategoryMeta> = {
  beneficios: {
    label: 'Beneficios',
    tone: 'success',
    wash: '#DCFCE7',
    ink: '#047857',
    amountLabel: 'Tarifa',
  },
  gastos: {
    label: 'Gastos',
    tone: 'error',
    wash: '#FEE2E2',
    ink: '#991B1B',
    amountLabel: 'Costo',
  },
  gratis: {
    label: 'Gratis',
    tone: 'violet',
    wash: '#F5F3FF',
    ink: '#7C3AED',
    amountLabel: 'Precio',
  },
}

export const CATEGORY_OPTIONS = (
  Object.keys(CATEGORY_META) as ServiceCategory[]
).map((category) => ({ value: category, label: CATEGORY_META[category].label }))

/** Categoría por defecto: casi todo lo que se agenda cobra. */
export const DEFAULT_CATEGORY: ServiceCategory = 'beneficios'

/**
 * El mismo número significa cosas distintas según la categoría: en beneficios
 * es lo que entra, en gastos es lo que sale y en gratis no hay cobro. Un importe
 * en 0 nunca se pinta de rojo: el rojo queda reservado para los gastos con monto.
 */
export function formatAmount(amount: number, category: ServiceCategory): string {
  if (category === 'gratis') {
    return 'Gratis'
  }

  if (amount === 0) {
    return category === 'gastos' ? 'Sin costo' : 'Gratis'
  }

  return category === 'gastos' ? `Costo ${formatSoles(amount)}` : formatSoles(amount)
}

/**
 * Color del importe según la categoría. Vive aquí para que la card y el modal
 * de detalle no repitan la misma cadena de condiciones.
 */
export function amountColor(amount: number, category: ServiceCategory): string {
  if (category === 'gratis') {
    return CATEGORY_META.gratis.ink
  }

  if (amount === 0) {
    return colors.primary
  }

  return category === 'gastos' ? colors.error : colors.textPrimary
}

export const formatDuration = (minutes: number): string =>
  minutes > 0 ? `${minutes} min` : 'Sin duración'