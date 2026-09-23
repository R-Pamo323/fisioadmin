import { colors } from './colors'

export const typography = {
  fontFamily: "'Inter', sans-serif",
  h1: { fontSize: '34px', fontWeight: 700, color: colors.textPrimary },
  h2: { fontSize: '26px', fontWeight: 600, color: colors.textPrimary },
  body: { fontSize: '16px', fontWeight: 400, color: colors.textSecondary },
  small: { fontSize: '14px', fontWeight: 500, color: colors.textSecondary },
} as const