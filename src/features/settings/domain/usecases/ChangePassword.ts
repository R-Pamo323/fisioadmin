import type { PasswordChangeResult } from '../entities/PasswordChange'
import type { SettingsRepository } from '../repositories/SettingsRepository'

export class ChangePassword {
  private readonly repository: SettingsRepository

  constructor(repository: SettingsRepository) {
    this.repository = repository
  }

  execute(current: string, next: string): Promise<PasswordChangeResult> {
    return this.repository.changePassword(current, next)
  }
}