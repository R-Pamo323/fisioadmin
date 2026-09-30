import type { PasswordResetRepository } from '../repositories/PasswordResetRepository'
import { RESET_CODE_LENGTH } from './RequestPasswordReset'

export type VerifyResetCodeResult = 'invalid_length' | 'invalid_code' | 'ok'

export class VerifyResetCode {
  private readonly repository: PasswordResetRepository

  constructor(repository: PasswordResetRepository) {
    this.repository = repository
  }

  async execute(code: string): Promise<VerifyResetCodeResult> {
    if (code.length !== RESET_CODE_LENGTH) {
      return 'invalid_length'
    }

    const isValid = await this.repository.verifyResetCode(code)

    return isValid ? 'ok' : 'invalid_code'
  }
}
