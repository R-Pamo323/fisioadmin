/**
 * Los servicios ya son las categorías: solo se distingue si el servicio deja
 * dinero a la clínica o si es un gasto.
 */
export type ServiceCategory =
  /** Genera dinero: el paciente paga por el servicio. */
  | 'beneficios'
  /** No genera dinero: es un costo de la clínica. */
  | 'gastos'
  /** No genera ni cuesta dinero: el servicio es sin coste para el paciente. */
  | 'gratis'

export interface ServiceType {
  id: string
  name: string
  price: number
  durationMinutes: number
  description: string
  category: ServiceCategory
  protocol: string[]
}

export type ServiceTypeDraft = Omit<ServiceType, 'id'>

export type ServiceTypePatch = Partial<Omit<ServiceType, 'id'>>
