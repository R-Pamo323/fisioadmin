export type AppointmentStatus =
  /** Cobrada. */
  | 'paid'
  /** Programada, todavía sin cobrar. */
  | 'pending'
  /** No genera cobro: reuniones y tareas internas. */
  | 'no_payment'

export interface Appointment {
  id: string
  /** null cuando la cita no pertenece a un paciente (reuniones, tareas). */
  patientId: string | null
  /** Nombre del paciente, o el título de la reunión si no hay paciente. */
  patientName: string
  /** Nombre del tipo de cita; vacío cuando no aplica. */
  appointmentType: string
  /** Qué se va a hacer con el paciente, o de qué trata la reunión. Opcional. */
  description: string
  start: Date
  end: Date
  status: AppointmentStatus
}

/** Datos que escribe la persona al agendar; el id lo pone el repositorio. */
export type AppointmentDraft = Omit<Appointment, 'id'>

/** Campos que se pueden cambiar al editar una cita ya creada. */
export type AppointmentPatch = Partial<Omit<Appointment, 'id'>>