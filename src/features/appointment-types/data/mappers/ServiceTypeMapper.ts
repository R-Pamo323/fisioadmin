import type {
  ServiceCategory,
  ServiceType,
  ServiceTypeDraft,
  ServiceTypePatch,
} from '../../domain/entities/ServiceType'

/** Fila tal como la devuelve la tabla `service_types` de Supabase. */
export interface ServiceTypeRow {
  id: string
  name: string
  /** PostgREST puede serializar `numeric` como string; se normaliza a número. */
  price: number | string
  duration_minutes: number
  description: string
  category: ServiceCategory
  protocol: string[] | null
}

export function toServiceType(row: ServiceTypeRow): ServiceType {
  return {
    id: row.id,
    name: row.name,
    price: Number(row.price),
    durationMinutes: row.duration_minutes,
    description: row.description,
    category: row.category,
    protocol: row.protocol ?? [],
  }
}

export function toServiceTypeRow(payload: Partial<ServiceTypeDraft | ServiceTypePatch>) {
  const row: Record<string, unknown> = {}
  if (payload.name !== undefined) row.name = payload.name
  if (payload.price !== undefined) row.price = payload.price
  if (payload.durationMinutes !== undefined) row.duration_minutes = payload.durationMinutes
  if (payload.description !== undefined) row.description = payload.description
  if (payload.category !== undefined) row.category = payload.category
  if (payload.protocol !== undefined) row.protocol = payload.protocol
  return row
}
