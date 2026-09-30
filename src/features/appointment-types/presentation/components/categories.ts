import type { ComponentType } from 'react'
import { Activity, CircleDot, Dumbbell, Hand, Waves } from 'lucide-react'
import type { BadgeTone, SelectOption } from '../../../../shared/components'
import type { ServiceCategory } from '../../domain/entities/ServiceType'

export interface CategoryMeta {
  label: string
  icon: ComponentType<{ size?: number; color?: string }>
  tone: BadgeTone
  /** Wash used behind the card illustration and the icon watermark. */
  wash: string
}

export const CATEGORY_META: Record<ServiceCategory, CategoryMeta> = {
  fisioterapia: {
    label: 'Terapia Física',
    icon: Activity,
    tone: 'primary',
    wash: '#E0F2FE',
  },
  rehabilitacion: {
    label: 'Rehabilitación',
    icon: Dumbbell,
    tone: 'success',
    wash: '#DCFCE7',
  },
  masaje: {
    label: 'Masaje',
    icon: Hand,
    tone: 'warning',
    wash: '#FEF3C7',
  },
  pilates: {
    label: 'Pilates',
    icon: Waves,
    tone: 'info',
    wash: '#DBEAFE',
  },
  otros: {
    label: 'No definido / Otros',
    icon: CircleDot,
    tone: 'neutral',
    wash: '#F3F4F6',
  },
}

export const CATEGORY_OPTIONS: SelectOption[] = (
  Object.keys(CATEGORY_META) as ServiceCategory[]
).map((category) => ({ value: category, label: CATEGORY_META[category].label }))

/** Categoría por defecto para servicios sin categoría específica asignada. */
export const DEFAULT_CATEGORY: ServiceCategory = 'otros'

export const formatPrice = (price: number): string =>
  price === 0 ? 'Gratis' : `S/${price}`

export const formatDuration = (minutes: number): string => `${minutes} min`
