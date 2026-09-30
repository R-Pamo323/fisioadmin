import type {
  CreateAccountInput,
  CreateAccountResult,
} from '../../../shared/domain/types'

export interface RegisterRepository {
  createAccount(input: CreateAccountInput): Promise<CreateAccountResult>
}
