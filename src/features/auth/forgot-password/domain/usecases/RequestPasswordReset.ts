import type { PasswordResetRepository } from '../repositories/PasswordResetRepository'

export const RESET_CODE_LENGTH = 4

export class RequestPasswordReset {
  private readonly repository: PasswordResetRepository

  constructor(repository: PasswordResetRepository) {
    this.repository = repository
  }

  execute(email: string): Promise<boolean> {
    return this.repository.isEmailRegistered(email.trim())
  }
}
