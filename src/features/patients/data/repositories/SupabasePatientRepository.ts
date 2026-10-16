import { supabase } from '../../../../shared/lib/supabase'
import { createId } from '../../../../shared/lib/ids'
import type { Patient, PatientDraft, PatientPatch } from '../../domain/entities/Patient'
import type { PatientRepository } from '../../domain/repositories/PatientRepository'
import { toPatient, toPatientRow, type PatientRow } from '../mappers/PatientMapper'

export class SupabasePatientRepository implements PatientRepository {
  async list(): Promise<Patient[]> {
    const { data, error } = await supabase.from('patients').select('*').order('name')

    if (error) throw error

    return (data as PatientRow[]).map(toPatient)
  }

  async create(draft: PatientDraft): Promise<Patient> {
    const { data, error } = await supabase
      .from('patients')
      .insert({ id: createId('pt'), ...toPatientRow(draft) })
      .select('*')
      .single()

    if (error) throw error

    return toPatient(data as PatientRow)
  }

  async update(id: string, patch: PatientPatch): Promise<Patient> {
    const { data, error } = await supabase
      .from('patients')
      .update(toPatientRow(patch))
      .eq('id', id)
      .select('*')
      .single()

    if (error) throw error

    return toPatient(data as PatientRow)
  }

  async remove(id: string): Promise<void> {
    const { error } = await supabase.from('patients').delete().eq('id', id)

    if (error) throw error
  }
}
