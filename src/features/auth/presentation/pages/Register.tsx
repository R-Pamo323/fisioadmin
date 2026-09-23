import { Card, LogoMark } from '../../../../shared/components'
import { colors } from '../../../../core/theme/colors'
import { typography } from '../../../../core/theme/typography'
import { RegisterForm } from '../components/RegisterForm'
import styles from './Register.module.css'

export function Register() {
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
          Crear cuenta
        </h1>

        <p
          className={styles.subtitle}
          style={{
            color: typography.body.color,
            fontFamily: typography.fontFamily,
            fontSize: typography.body.fontSize,
            fontWeight: typography.body.fontWeight,
          }}
        >
          Registra los datos del nuevo acceso a tu centro clínico.
        </p>

        <RegisterForm />
      </Card>
    </main>
  )
}