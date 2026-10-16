import { supabase } from '../../../../../shared/lib/supabase'
import type {
  CreateAccountInput,
  CreateAccountResult,
} from '../../../shared/domain/types'
import type { RegisterRepository } from '../../domain/repositories/RegisterRepository'

/*
 * El registro está oculto por ahora (clínica de un solo administrador), pero se
 * deja implementado para el futuro. Requiere reactivar "Enable sign ups" en
 * Supabase → Authentication → Providers → Email.
 */
export class SupabaseRegisterRepository implements RegisterRepository {
  async createAccount(input: CreateAccountInput): Promise<CreateAccountResult> {
    const { error } = await supabase.auth.signUp({
      email: input.email,
      password: input.password,
      options: { data: { name: input.name } },
    })

    if (error) return { ok: false, error: error.message }

    return { ok: true }
  }
}
