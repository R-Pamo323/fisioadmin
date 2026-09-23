import { Card, LogoMark } from '../../../../shared/components'
import { colors } from '../../../../core/theme/colors'
import { typography } from '../../../../core/theme/typography'
import { ForgotPasswordFlow } from '../components/ForgotPasswordFlow'
import styles from './ForgotPassword.module.css'

export function ForgotPassword() {
  return (
    <main
      className={styles.page}
      style={{
        background: colors.background,
        fontFamily: typography.fontFamily,
      }}
    >
      <Card className={styles.card}>
        <header className={styles.brand}>
          <LogoMark />
          <span
            className={styles.brandName}
            style={{ color: colors.textPrimary, fontWeight: 700 }}
          >
            FisioAdmin
          </span>
        </header>

        <h1
          className={styles.title}
          style={{
            color: typography.h1.color,
            fontFamily: typography.fontFamily,
            fontSize: typography.h1.fontSize,
            fontWeight: typography.h1.fontWeight,
          }}
        >
          Recuperar contraseña
        </h1>

        <ForgotPasswordFlow />
      </Card>
    </main>
  )
}