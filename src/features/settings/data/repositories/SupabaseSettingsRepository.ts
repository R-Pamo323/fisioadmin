import { supabase } from '../../../../shared/lib/supabase'
import type { PasswordChangeResult } from '../../domain/entities/PasswordChange'
import type { SettingsProfile } from '../../domain/entities/SettingsProfile'
import type { SettingsRepository } from '../../domain/repositories/SettingsRepository'

const PROFILE_COLUMNS = 'name, specialty, email'

/** Misma regla que valida el registro (useRegister.validatePassword). */
const MIN_PASSWORD_LENGTH = 8

async function currentUser() {
  const { data } = await supabase.auth.getUser()
  return data.user
}

export class SupabaseSettingsRepository implements SettingsRepository {
  async getProfile(): Promise<SettingsProfile> {
    const user = await currentUser()
    if (!user) throw new Error('No hay una sesión activa.')

    const { data, error } = await supabase
      .from('profiles')
      .select(PROFILE_COLUMNS)
      .eq('user_id', user.id)
      .maybeSingle()

    if (error) throw error
    if (data) return data as SettingsProfile

    // Cuenta creada antes del trigger: se crea el perfil por defecto.
    // `id` es la clave (FK a auth.users en el patrón de Supabase), así que se
    // puebla también por si la columna no tuviera default.
    const { data: created, error: insertError } = await supabase
      .from('profiles')
      .insert({
        id: user.id,
        user_id: user.id,
        name: '',
        specialty: '',
        email: user.email ?? '',
      })
      .select(PROFILE_COLUMNS)
      .single()

    if (insertError) throw insertError

    return created as SettingsProfile
  }

  async updateProfile(profile: SettingsProfile): Promise<SettingsProfile> {
    const user = await currentUser()
    if (!user) throw new Error('No hay una sesión activa.')

    const { data, error } = await supabase
      .from('profiles')
      .update(profile)
      .eq('user_id', user.id)
      .select(PROFILE_COLUMNS)
      .single()

    if (error) throw error

    return data as SettingsProfile
  }

  async changePassword(current: string, next: string): Promise<PasswordChangeResult> {
    if (next.length < MIN_PASSWORD_LENGTH) return 'invalid_length'

    const user = await currentUser()
    if (!user?.email) return 'invalid_current'

    // Supabase no expone "verificar contraseña": se reautentica al usuario.
    const { error: reauthError } = await supabase.auth.signInWithPassword({
      email: user.email,
      password: current,
    })
    if (reauthError) return 'invalid_current'

    const { error } = await supabase.auth.updateUser({ password: next })
    if (error) return 'invalid_length'

    return 'success'
  }
}
