import type { SettingsProfile } from '../entities/SettingsProfile'
import type { SettingsRepository } from '../repositories/SettingsRepository'

export class GetSettingsProfile {
  private readonly repository: SettingsRepository

  constructor(repository: SettingsRepository) {
    this.repository = repository
  }

  execute(): Promise<SettingsProfile> {
    return this.repository.getProfile()
  }
}