export const MOCK_RESET_CODE = '1234'

const REGISTERED_USERS: Record<string, string> = {
  'juan.perez@fisioadmin.com': 'fisioadmin',
  'test@test.com': 'test1234',
}

export const REGISTERED_EMAILS = Object.keys(REGISTERED_USERS)

export const MOCK_LOGIN_PASSWORD = REGISTERED_USERS['juan.perez@fisioadmin.com']

const wait = (ms: number) =>
  new Promise<void>((resolve) => {
    setTimeout(resolve, ms)
  })

export type LoginResult =
  | { ok: true }
  | { ok: false; error: 'email_not_registered' | 'invalid_credentials' }

export async function mockLogin(email: string, password: string): Promise<LoginResult> {
  await wait(900)

  const normalizedEmail = email.trim().toLowerCase()

  if (!(normalizedEmail in REGISTERED_USERS)) {
    return { ok: false, error: 'email_not_registered' }
  }

  if (REGISTERED_USERS[normalizedEmail] !== password) {
    return { ok: false, error: 'invalid_credentials' }
  }

  return { ok: true }
}

export interface CreateAccountInput {
  name: string
  email: string
  password: string
}

export type CreateAccountResult =
  | { ok: true }
  | { ok: false; error: string }

export async function mockCreateAccount(
  input: CreateAccountInput,
): Promise<CreateAccountResult> {
  await wait(800)

  if (input.email.trim().toLowerCase() === 'test@test.com') {
    return { ok: false, error: 'Este correo ya está registrado.' }
  }

  return { ok: true }
}

export async function mockIsEmailRegistered(
  email: string,
): Promise<boolean> {
  await wait(500)
  return REGISTERED_EMAILS.includes(email.trim().toLowerCase())
}

export async function mockVerifyResetCode(code: string): Promise<boolean> {
  await wait(600)
  return code === MOCK_RESET_CODE
}