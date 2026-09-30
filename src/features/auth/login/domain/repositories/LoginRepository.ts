import type { LoginResult } from '../../../shared/domain/types'

export interface LoginRepository {
  login(email: string, password: string): Promise<LoginResult>
}
