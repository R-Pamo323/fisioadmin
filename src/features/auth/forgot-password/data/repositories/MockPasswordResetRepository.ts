import {
  mockIsEmailRegistered,
  mockVerifyResetCode,
} from '../../../shared/data/mockAuthApi'
import type { PasswordResetRepository } from '../../domain/repositories/PasswordResetRepository'

export class MockPasswordResetRepository implements PasswordResetRepository {
  isEmailRegistered(email: string): Promise<boolean> {
    return mockIsEmailRegistered(email)
  }

  verifyResetCode(code: string): Promise<boolean> {
    return mockVerifyResetCode(code)
  }
}
