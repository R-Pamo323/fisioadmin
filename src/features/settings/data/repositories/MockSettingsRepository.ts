import type { PasswordChangeResult } from '../../domain/entities/PasswordChange'
import type { SettingsProfile } from '../../domain/entities/SettingsProfile'
import type { SettingsRepository } from '../../domain/repositories/SettingsRepository'
import { mockSettings } from '../datasources/mockSettings'

export class MockSettingsRepository implements SettingsRepository {
  getProfile(): Promise<SettingsProfile> {
    return Promise.resolve(mockSettings.getProfile())
  }

  updateProfile(profile: SettingsProfile): Promise<SettingsProfile> {
    return Promise.resolve(mockSettings.updateProfile(profile))
  }

  changePassword(current: string, next: string): Promise<PasswordChangeResult> {
    return Promise.resolve(mockSettings.changePassword(current, next))
  }
}