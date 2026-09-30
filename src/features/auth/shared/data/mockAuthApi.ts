import type {
  CreateAccountInput,
  CreateAccountResult,
  LoginResult,
} from '../domain/types'
import { MOCK_RESET_CODE, usersStore } from './usersStore'

const wait = (ms: number) =>
  new Promise<void>((resolve) => {
    setTimeout(resolve, ms)
  })

export async function mockLogin(
  email: string,
  password: string,
): Promise<LoginResult> {
  await wait(900)

  if (!usersStore.hasEmail(email)) {
    return { ok: false, error: 'email_not_registered' }
  }

  if (usersStore.getPassword(email) !== password) {
    return { ok: false, error: 'invalid_credentials' }
  }

  return { ok: true }
}

export async function mockCreateAccount(
  input: CreateAccountInput,
): Promise<CreateAccountResult> {
  await wait(800)

  if (usersStore.hasEmail(input.email)) {
    return { ok: false, error: 'Este correo ya está registrado.' }
  }

  usersStore.add(input.email, input.password)

  return { ok: true }
}

export async function mockIsEmailRegistered(email: string): Promise<boolean> {
  await wait(500)
  return usersStore.hasEmail(email)
}

export async function mockVerifyResetCode(code: string): Promise<boolean> {
  await wait(600)
  return code === MOCK_RESET_CODE
}
