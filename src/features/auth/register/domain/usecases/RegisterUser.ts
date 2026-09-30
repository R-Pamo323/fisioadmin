import type {
  CreateAccountInput,
  CreateAccountResult,
} from '../../../shared/domain/types'
import type { RegisterRepository } from '../repositories/RegisterRepository'

export class RegisterUser {
  private readonly repository: RegisterRepository

  constructor(repository: RegisterRepository) {
    this.repository = repository
  }

  execute(input: CreateAccountInput): Promise<CreateAccountResult> {
    return this.repository.createAccount({
      name: input.name.trim(),
      email: input.email.trim(),
      password: input.password,
    })
  }
}
