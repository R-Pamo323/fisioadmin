export interface VisitRecord {
  id: string
  /** Fecha de la visita, en formato ISO. */
  date: string
  service: string
  notes: string
}

function daysAgo(days: number): string {
  const date = new Date()
  date.setDate(date.getDate() - days)
  return date.toISOString()
}

/**
 * Historial mock por paciente. Los pacientes creados desde el formulario no
 * tienen entrada y el modal de detalle muestra un estado vacío.
 */
const SEED_VISIT_HISTORY: Record<string, VisitRecord[]> = {
  'pt-1': [
    {
      id: 'pt-1-v1',
      date: daysAgo(3),
      service: 'Terapia lumbar',
      notes: 'Dolor lumbar 2/10. Continúa esquema de ejercicios en casa.',
    },
    {
      id: 'pt-1-v2',
      date: daysAgo(17),
      service: 'Terapia lumbar',
      notes: 'Test de Lasègue positivo. Se añade descarga biomecánica.',
    },
    {
      id: 'pt-1-v3',
      date: daysAgo(31),
      service: 'Evaluación inicial',
      notes: 'Alta de la sesión inicial con 5 visitas de terapia.',
    },
  ],
  'pt-2': [
    {
      id: 'pt-2-v1',
      date: daysAgo(1),
      service: 'Rehabilitación de rodilla',
      notes: 'Rango de flexión 118°. Progresión de carga en prensa.',
    },
    {
      id: 'pt-2-v2',
      date: daysAgo(15),
      service: 'Rehabilitación de rodilla',
      notes: 'Derrame resuelto. Inicio de trabajo de fuerza excéntrica.',
    },
    {
      id: 'pt-2-v3',
      date: daysAgo(29),
      service: 'Rehabilitación de rodilla',
      notes: 'Control de cicatriz sin complicaciones.',
    },
    {
      id: 'pt-2-v4',
      date: daysAgo(43),
      service: 'Terapia post-operatoria',
      notes: 'Retirada de suturas. Autorizada carga parcial.',
    },
  ],
  'pt-3': [
    {
      id: 'pt-3-v1',
      date: daysAgo(7),
      service: 'Terapia cervical',
      notes: 'Contractura cervical marcada. Se receta pausa ergonómica.',
    },
    {
      id: 'pt-3-v2',
      date: daysAgo(21),
      service: 'Terapia cervical',
      notes: 'Mejoría parcial. Continúa estiramientos diarios.',
    },
  ],
  'pt-4': [
    {
      id: 'pt-4-v1',
      date: daysAgo(45),
      service: 'Artrosis de rodilla',
      notes: 'Alta del programa. Mantenimiento domiciliario mensual.',
    },
    {
      id: 'pt-4-v2',
      date: daysAgo(75),
      service: 'Artrosis de rodilla',
      notes: 'Reducción de edema. Fortalecimiento de musculatura.',
    },
    {
      id: 'pt-4-v3',
      date: daysAgo(105),
      service: 'Evaluación inicial',
      notes: 'Se programa infiltración y fisioterapia de mantenimiento.',
    },
  ],
  'pt-5': [
    {
      id: 'pt-5-v1',
      date: daysAgo(12),
      service: 'Ondas de choque',
      notes: 'Dolor epicondíleo 3/10 en epicondilo medial.',
    },
    {
      id: 'pt-5-v2',
      date: daysAgo(40),
      service: 'Ondas de choque',
      notes: 'Tercera sesión. Sin reagresión sintomática.',
    },
  ],
  'pt-6': [
    {
      id: 'pt-6-v1',
      date: daysAgo(5),
      service: 'Método Schroth',
      notes: 'Angle de Cobb 14°. Buen apego al ejercicio domiciliario.',
    },
    {
      id: 'pt-6-v2',
      date: daysAgo(19),
      service: 'Método Schroth',
      notes: 'Autocorrección postural. Refuerzo de respiración diafragmática.',
    },
  ],
  'pt-7': [
    {
      id: 'pt-7-v1',
      date: daysAgo(2),
      service: 'Terapia infantil',
      notes: 'Trabajo de control de tronco en decúbito prono.',
    },
    {
      id: 'pt-7-v2',
      date: daysAgo(16),
      service: 'Terapia infantil',
      notes: 'Avance en la mano dominante.',
    },
  ],
  'pt-8': [
    {
      id: 'pt-8-v1',
      date: daysAgo(18),
      service: 'Fortalecimiento muscular',
      notes: 'Dolor lumbar 6/10. Se programa un ciclo de 6 sesiones.',
    },
  ],
  'pt-9': [
    {
      id: 'pt-9-v1',
      date: daysAgo(25),
      service: 'Terapia somática',
      notes: 'Registro de sueño irregular. Inicio de técnicas de relajación.',
    },
  ],
}

export function getVisitHistory(patientId: string): VisitRecord[] {
  return SEED_VISIT_HISTORY[patientId] ?? []
}