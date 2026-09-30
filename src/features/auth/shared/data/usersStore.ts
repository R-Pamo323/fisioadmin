export const MOCK_RESET_CODE = '1234'

const REGISTERED_USERS: Record<string, string> = {
  'juan.perez@fisioadmin.com': 'fisioadmin',
  'test@test.com': 'test1234',
}

const normalizeEmail = (email: string) => email.trim().toLowerCase()

export const usersStore = {
  hasEmail(email: string): boolean {
    return normalizeEmail(email) in REGISTERED_USERS
  },
  getPassword(email: string): string | undefined {
    return REGISTERED_USERS[normalizeEmail(email)]
  },
  add(email: string, password: string): void {
    REGISTERED_USERS[normalizeEmail(email)] = password
  },
}

export const MOCK_LOGIN_PASSWORD = REGISTERED_USERS['juan.perez@fisioadmin.com']
