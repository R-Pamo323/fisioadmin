import { Link } from 'react-router-dom'
import { Card, LogoMark } from '../../../../shared/components'
import { ROUTE_PATHS } from '../../../../core/routes/paths'
import { colors } from '../../../../core/theme/colors'
import { typography } from '../../../../core/theme/typography'
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
          Estás en la pantalla de registro de nuevos usuarios.
        </p>

        <Link
          to={ROUTE_PATHS.login}
          className={styles.backLink}
          style={{
            color: colors.primary,
            fontFamily: typography.fontFamily,
            fontSize: typography.body.fontSize,
            fontWeight: 600,
          }}
        >
          ← Volver al inicio de sesión
        </Link>
      </Card>
    </main>
  )
}