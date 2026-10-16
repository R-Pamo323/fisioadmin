import { supabase } from '../../../../../shared/lib/supabase'
import type { PasswordResetRepository } from '../../domain/repositories/PasswordResetRepository'

/*
 * Supabase envía por correo un código OTP (6 dígitos por defecto) que se verifica
 * con `verifyOtp`. El correo del intento en curso se guarda aquí porque la
 * interfaz `verifyResetCode(code)` no lo recibe por parámetro.
 */
export class SupabasePasswordResetRepository implements PasswordResetRepository {
  private email: string | null = null

  async isEmailRegistered(email: string): Promise<boolean> {
    this.email = email
    const { error } = await supabase.auth.resetPasswordForEmail(email)

    // Supabase responde igual exista o no el correo (anti enumeración), así que
    // no se puede saber si está registrado; se continúa con el flujo.
    return !error
  }

  async verifyResetCode(code: string): Promise<boolean> {
    if (!this.email) return false

    const { error } = await supabase.auth.verifyOtp({
      email: this.email,
      token: code,
      type: 'recovery',
    })

    return !error
  }
}
