import type {
  CreateAccountInput,
  CreateAccountResult,
} from '../../../shared/domain/types'
import { mockCreateAccount } from '../../../shared/data/mockAuthApi'
import type { RegisterRepository } from '../../domain/repositories/RegisterRepository'

export class MockRegisterRepository implements RegisterRepository {
  createAccount(input: CreateAccountInput): Promise<CreateAccountResult> {
    return mockCreateAccount(input)
  }
}
