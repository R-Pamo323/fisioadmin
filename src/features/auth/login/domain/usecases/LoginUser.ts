import type { LoginResult } from '../../../shared/domain/types'
import type { LoginRepository } from '../repositories/LoginRepository'

export class LoginUser {
  private readonly repository: LoginRepository

  constructor(repository: LoginRepository) {
    this.repository = repository
  }

  execute(email: string, password: string): Promise<LoginResult> {
    return this.repository.login(email.trim(), password)
  }
}
