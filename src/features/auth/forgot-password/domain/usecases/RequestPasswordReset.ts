import type { PasswordResetRepository } from '../repositories/PasswordResetRepository'

/** Longitud del código OTP que envía Supabase por correo (6 dígitos por defecto). */
export const RESET_CODE_LENGTH = 6

export class RequestPasswordReset {
  private readonly repository: PasswordResetRepository

  constructor(repository: PasswordResetRepository) {
    this.repository = repository
  }

  execute(email: string): Promise<boolean> {
    return this.repository.isEmailRegistered(email.trim())
  }
}
