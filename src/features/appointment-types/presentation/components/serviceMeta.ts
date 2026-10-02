import type { BadgeTone } from '../../../../shared/components'
import type { ServiceCategory } from '../../domain/entities/ServiceType'

export interface CategoryMeta {
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
    tone: 'warning',
    wash: '#FEF3C7',
    ink: '#B45309',
    amountLabel: 'Costo',
  },
}

export const CATEGORY_OPTIONS = (
  Object.keys(CATEGORY_META) as ServiceCategory[]
).map((category) => ({ value: category, label: CATEGORY_META[category].label }))

/** Categoría por defecto: casi todo lo que se agenda cobra. */
export const DEFAULT_CATEGORY: ServiceCategory = 'beneficios'

/**
 * Iniciales para la card del servicio: primera letra de hasta dos palabras.
 * "Terapia Física" → TF, "Masaje Relaxante" → MR, "Pilates" → P.
 */
export function getInitials(name: string): string {
  const words = name.trim().split(/\s+/).filter((word) => word !== '')

  if (words.length === 0) return '?'

  return words
    .slice(0, 2)
    .map((word) => word.charAt(0).toLocaleUpperCase('es'))
    .join('')
}

/**
 * El mismo número significa cosas distintas según la categoría: en beneficios
 * es lo que entra, en gastos es lo que sale.
 */
export function formatAmount(amount: number, category: ServiceCategory): string {
  if (amount === 0) {
    return category === 'gastos' ? 'Sin costo' : 'Gratis'
  }

  return category === 'gastos' ? `Costo S/${amount}` : `S/${amount}`
}

export const formatDuration = (minutes: number): string => `${minutes} min`