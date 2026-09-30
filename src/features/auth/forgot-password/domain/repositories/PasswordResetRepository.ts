export interface PasswordResetRepository {
  isEmailRegistered(email: string): Promise<boolean>
  verifyResetCode(code: string): Promise<boolean>
}
