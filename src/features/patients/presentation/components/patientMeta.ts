import { colors } from '../../../../core/theme/colors'
import type { BadgeTone, SelectOption } from '../../../../shared/components'
import type {
  Patient,
  PatientGender,
  PatientStatus,
} from '../../domain/entities/Patient'

export interface StatusMeta {
  label: string
  tone: BadgeTone
}

export const STATUS_META: Record<PatientStatus, StatusMeta> = {
  activo: { label: 'Activo', tone: 'success' },
  pendiente: { label: 'Pendiente', tone: 'info' },
  finalizado: { label: 'Finalizado', tone: 'neutral' },
}

export const STATUS_OPTIONS: SelectOption[] = (
  Object.keys(STATUS_META) as PatientStatus[]
).map((status) => ({ value: status, label: STATUS_META[status].label }))

/** Estado por defecto de un paciente nuevo. */
export const DEFAULT_STATUS: PatientStatus = 'activo'

export const GENDER_OPTIONS: SelectOption[] = [
  { value: 'masculino', label: 'Masculino' },
  { value: 'femenino', label: 'Femenino' },
]

export const DEFAULT_GENDER: PatientGender = 'femenino'

export interface DistributionBand {
  key: string
  label: string
  color: string
  match: (patient: Patient) => boolean
}

export const AGE_BANDS: DistributionBand[] = [
  {
    key: 'ninos',
    label: 'Niños (0-17)',
    color: '#F59E0B',
    match: (patient) => patient.age < 18,
  },
  {
    key: 'jovenes',
    label: 'Jóvenes (18-35)',
    color: colors.primary,
    match: (patient) => patient.age >= 18 && patient.age <= 35,
  },
  {
    key: 'adultos',
    label: 'Adultos (36-60)',
    color: colors.success,
    match: (patient) => patient.age >= 36 && patient.age <= 60,
  },
  {
    key: 'mayores',
    label: 'Mayores (+60)',
    color: '#9CA3AF',
    match: (patient) => patient.age > 60,
  },
]

export interface DistributionRow {
  key: string
  label: string
  color: string
  count: number
  percent: number
}

/**
 * Cuenta cuántos pacientes caen en cada banda y devuelve los porcentajes
 * enteros ajustados para que sumen exactamente 100 (método del resto mayor).
 */
export function buildDistribution(
  patients: ReadonlyArray<Patient>,
  bands: DistributionBand[],
): DistributionRow[] {
  const counts = bands.map((band) =>
    patients.filter((patient) => band.match(patient)).length,
  )
  const percents = toPercentages(counts, patients.length)

  return bands.map((band, index) => ({
    key: band.key,
    label: band.label,
    color: band.color,
    count: counts[index],
    percent: percents[index],
  }))
}

/** Porcentajes enteros que suman 100 repartiendo el resto entre los mayores. */
export function toPercentages(counts: number[], total: number): number[] {
  if (total === 0) return counts.map(() => 0)

  const exact = counts.map((count) => (count * 100) / total)
  const result = exact.map((value) => Math.floor(value))

  let remaining = 100 - result.reduce((sum, value) => sum + value, 0)

  const byRemainder = exact
    .map((value, index) => ({ index, remainder: value - Math.floor(value) }))
    .sort((a, b) => b.remainder - a.remainder)

  for (const entry of byRemainder) {
    if (remaining <= 0) break
    result[entry.index] += 1
    remaining -= 1
  }

  return result
}

const dateFormatter = new Intl.DateTimeFormat('es-ES', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
})

/** "12 mar 2026" */
export const formatVisitDate = (isoDate: string): string => {
  const date = new Date(isoDate)
  return Number.isNaN(date.getTime()) ? '—' : dateFormatter.format(date)
}

const DAY_MS = 1000 * 60 * 60 * 24
const MONTH_MS = DAY_MS * 30

/** "Hoy", "Ayer", "Hace 12 días", "Hace 2 meses"... */
export function formatRelativeVisit(isoDate: string): string {
  const date = new Date(isoDate)
  if (Number.isNaN(date.getTime())) return 'Sin registro'

  const elapsed = Date.now() - date.getTime()
  const days = Math.floor(elapsed / DAY_MS)

  if (days <= 0) return 'Hoy'
  if (days === 1) return 'Ayer'
  if (days < 30) return `Hace ${days} días`
  if (days < 365) {
    const months = Math.max(1, Math.round(elapsed / MONTH_MS))
    return months === 1 ? 'Hace 1 mes' : `Hace ${months} meses`
  }

  return 'Hace más de un año'
}