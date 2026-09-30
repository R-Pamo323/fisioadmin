export type LoginErrorCode = 'email_not_registered' | 'invalid_credentials'

export type LoginResult =
  | { ok: true }
  | { ok: false; error: LoginErrorCode }

export interface CreateAccountInput {
  name: string
  email: string
  password: string
}

export type CreateAccountResult =
  | { ok: true }
  | { ok: false; error: string }
