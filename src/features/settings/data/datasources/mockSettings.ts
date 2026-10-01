import type { PasswordChangeResult } from '../../domain/entities/PasswordChange'
import type { SettingsProfile } from '../../domain/entities/SettingsProfile'

/**
 * Contraseña con la que arranca el mock. Es la misma sembrada en auth para
 * juan.perez@fisioadmin.com (features/auth/shared/data/usersStore.ts), así que
 * sirve para probar tanto el acierto como el error de "contraseña actual".
 */
export const MOCK_CURRENT_PASSWORD = 'fisioadmin'

/** Misma regla que valida el registro (useRegister.validatePassword). */
const MIN_PASSWORD_LENGTH = 8

const PROFILE: SettingsProfile = {
  name: 'Dr. Juan Pérez',
  specialty: 'Fisioterapeuta Deportivo',
  email: 'juan.perez@fisioadmin.com',
}

let currentPassword = MOCK_CURRENT_PASSWORD

export const mockSettings = {
  getProfile(): SettingsProfile {
    return { ...PROFILE }
  },

  updateProfile(profile: SettingsProfile): SettingsProfile {
    Object.assign(PROFILE, profile)
    return { ...PROFILE }
  },

  changePassword(current: string, next: string): PasswordChangeResult {
    if (current !== currentPassword) return 'invalid_current'
    if (next.length < MIN_PASSWORD_LENGTH) return 'invalid_length'

    currentPassword = next
    return 'success'
  },
}