export type AppointmentStatus = 'paid' | 'pending'

export interface Appointment {
  id: string
  patientName: string
  appointmentType: string
  start: Date
  end: Date
  status: AppointmentStatus
  location: string
}