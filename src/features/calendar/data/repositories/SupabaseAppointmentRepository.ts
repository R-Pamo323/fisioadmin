import { supabase } from '../../../../shared/lib/supabase'
import { createId } from '../../../../shared/lib/ids'
import type {
  Appointment,
  AppointmentDraft,
  AppointmentPatch,
} from '../../domain/entities/Appointment'
import type { AppointmentRepository } from '../../domain/repositories/AppointmentRepository'
import {
  toAppointment,
  toAppointmentRow,
  type AppointmentRow,
} from '../mappers/AppointmentMapper'

export class SupabaseAppointmentRepository implements AppointmentRepository {
  async list(): Promise<Appointment[]> {
    const { data, error } = await supabase.from('appointments').select('*').order('start_at')

    if (error) throw error

    return (data as AppointmentRow[]).map(toAppointment)
  }

  async create(draft: AppointmentDraft): Promise<Appointment> {
    const { data, error } = await supabase
      .from('appointments')
      .insert({ id: createId('a'), ...toAppointmentRow(draft) })
      .select('*')
      .single()

    if (error) throw error

    return toAppointment(data as AppointmentRow)
  }

  async update(id: string, patch: AppointmentPatch): Promise<Appointment> {
    const { data, error } = await supabase
      .from('appointments')
      .update(toAppointmentRow(patch))
      .eq('id', id)
      .select('*')
      .single()

    if (error) throw error

    return toAppointment(data as AppointmentRow)
  }

  async remove(id: string): Promise<void> {
    const { error } = await supabase.from('appointments').delete().eq('id', id)

    if (error) throw error
  }
}
