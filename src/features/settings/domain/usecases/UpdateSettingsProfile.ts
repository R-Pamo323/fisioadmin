import type { SettingsProfile } from '../entities/SettingsProfile'
import type { SettingsRepository } from '../repositories/SettingsRepository'

export class UpdateSettingsProfile {
  private readonly repository: SettingsRepository

  constructor(repository: SettingsRepository) {
    this.repository = repository
  }

  execute(profile: SettingsProfile): Promise<SettingsProfile> {
    return this.repository.updateProfile(profile)
  }
}