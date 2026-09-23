export const MOCK_RESET_CODE = '1234'

const REGISTERED_EMAILS = ['juan.perez@fisioadmin.com', 'test@test.com']

const wait = (ms: number) =>
  new Promise<void>((resolve) => {
    setTimeout(resolve, ms)
  })

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