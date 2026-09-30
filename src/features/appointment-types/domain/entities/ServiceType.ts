export type ServiceCategory =
  | 'fisioterapia'
  | 'rehabilitacion'
  | 'masaje'
  | 'pilates'
  | 'otros'

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
