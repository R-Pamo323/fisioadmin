import type { LoginResult } from '../../../shared/domain/types'
import type { LoginRepository } from '../../domain/repositories/LoginRepository'
import { mockLogin } from '../../../shared/data/mockAuthApi'

export class MockLoginRepository implements LoginRepository {
  login(email: string, password: string): Promise<LoginResult> {
    return mockLogin(email, password)
  }
}
