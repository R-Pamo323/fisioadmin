import type { PasswordChangeResult } from '../entities/PasswordChange'
import type { SettingsProfile } from '../entities/SettingsProfile'

export interface SettingsRepository {
  getProfile(): Promise<SettingsProfile>
  updateProfile(profile: SettingsProfile): Promise<SettingsProfile>
  /** El mock compara contra una contraseña fija, no contra un hash real. */
  changePassword(current: string, next: string): Promise<PasswordChangeResult>
}