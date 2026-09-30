import type { ServiceType } from '../../domain/entities/ServiceType'

const SEED_SERVICE_TYPES: ServiceType[] = [
  {
    id: 'st-1',
    name: 'Terapia Física',
    price: 50,
    durationMinutes: 45,
    description:
      'Sesión general de fisioterapia para recuperar la movilidad y reducir el dolor.',
    category: 'fisioterapia',
    protocol: [
      'Valoración inicial de la zona afectada',
      '15 min de movilidad articular activa',
      '20 min de contracturas y estiramientos asistidos',
      '10 min de ejercicios de refuerzo',
    ],
  },
  {
    id: 'st-2',
    name: 'Terapia Lumbar',
    price: 60,
    durationMinutes: 50,
    description:
      'Protocolo específico para lumbalgias y hernias discales con enfoque en descarga.',
    category: 'fisioterapia',
    protocol: [
      'Exploración lumbar y test de Lasègue',
      'Descarga biomecánica en decúbito lateral',
      'Estiramientos de isquiotibiales y psoas',
      'Reeducación postural',
    ],
  },
  {
    id: 'st-3',
    name: 'Rehabilitación',
    price: 70,
    durationMinutes: 60,
    description:
      'Recuperación funcional tras cirugía o lesión, con seguimiento de la evolución.',
    category: 'rehabilitacion',
    protocol: [
      'Control de la herida y rango articular',
      'Terapia manual de la cicatriz',
      'Fortalecimiento progresivo de la cadena',
      'Evaluación final de funcionalidad',
    ],
  },
  {
    id: 'st-4',
    name: 'Cita sin cobro',
    price: 0,
    durationMinutes: 30,
    description:
      'Sesión de seguimiento sin coste para pacientes de seguimiento prolongado.',
    category: 'otros',
    protocol: [
      'Control de síntomas y adherencia',
      'Revisión de la rutina de ejercicios',
    ],
  },
  {
    id: 'st-5',
    name: 'Pilates Terapéutico',
    price: 55,
    durationMinutes: 40,
    description:
      'Entrenamiento de pilates con instructor certificado para la corrección postural.',
    category: 'pilates',
    protocol: [
      'Calentamiento en plataforma',
      'Serie de ejercicios de control central',
      'Trabajo de flexo-extensión con banda elástica',
      'Relajación y respiración diafragmática',
    ],
  },
  {
    id: 'st-6',
    name: 'Masaje Relaxante',
    price: 40,
    durationMinutes: 30,
    description:
      'Masaje de cuerpo completo para reducir la tensión muscular acumulada.',
    category: 'masaje',
    protocol: [
      'Drenaje linfático en dorsales',
      'Trabajo de trapecios y cervicales',
      'Masaje funcional de Members y pies',
    ],
  },
  {
    id: 'st-7',
    name: 'Evaluación inicial',
    price: 0,
    durationMinutes: 20,
    description:
      'Primera valoración del paciente sin coste para definir el plan de tratamiento.',
    category: 'otros',
    protocol: [
      'Anamnesis y entrevista clínica',
      'Exploración física y rangos de movimiento',
      'Definición de objetivos terapéuticos',
    ],
  },
]

let serviceTypes: ServiceType[] = SEED_SERVICE_TYPES.map((service) => ({
  ...service,
  protocol: [...service.protocol],
}))

let sequence = SEED_SERVICE_TYPES.length

export const mockServiceTypes = {
  list(): ServiceType[] {
    return serviceTypes.map((service) => ({ ...service, protocol: [...service.protocol] }))
  },

  create(input: Omit<ServiceType, 'id'>): ServiceType {
    sequence += 1

    const created: ServiceType = {
      ...input,
      id: `st-${sequence}`,
      protocol: [...input.protocol],
    }

    serviceTypes = [...serviceTypes, created]

    return { ...created, protocol: [...created.protocol] }
  },

  update(id: string, patch: Partial<Omit<ServiceType, 'id'>>): ServiceType | null {
    const current = serviceTypes.find((service) => service.id === id)
    if (!current) return null

    const updated: ServiceType = {
      ...current,
      ...patch,
      id: current.id,
      protocol: patch.protocol ? [...patch.protocol] : [...current.protocol],
    }

    serviceTypes = serviceTypes.map((service) => (service.id === id ? updated : service))

    return { ...updated, protocol: [...updated.protocol] }
  },

  remove(id: string): boolean {
    const exists = serviceTypes.some((service) => service.id === id)
    serviceTypes = serviceTypes.filter((service) => service.id !== id)
    return exists
  },
}
