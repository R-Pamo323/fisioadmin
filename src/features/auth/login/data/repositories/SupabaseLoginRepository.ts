import { supabase } from '../../../../../shared/lib/supabase'
import type { LoginResult } from '../../../shared/domain/types'
import type { LoginRepository } from '../../domain/repositories/LoginRepository'

export class SupabaseLoginRepository implements LoginRepository {
  async login(email: string, password: string): Promise<LoginResult> {
    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      // Por seguridad Supabase no distingue entre correo inexistente y
      // contraseña incorrecta, así que se reporta un error genérico.
      return { ok: false, error: 'invalid_credentials' }
    }

    return { ok: true }
  }
}
