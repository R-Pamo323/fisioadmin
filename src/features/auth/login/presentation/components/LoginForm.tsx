import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Button,
  EnvelopeIcon,
  Input,
  LogoMark,
  PasswordField,
  Switch,
} from '../../../../../shared/components'
import { ROUTE_PATHS } from '../../../../../core/routes/paths'
import { colors } from '../../../../../core/theme/colors'
import { typography } from '../../../../../core/theme/typography'
import { useLogin } from '../hooks/useLogin'
import styles from './LoginForm.module.css'

export function LoginForm() {
  const {
    email,
    password,
    emailError,
    passwordError,
    submitting,
    setEmail,
    setPassword,
    handleEmailBlur,
    handlePasswordBlur,
    handleSubmit,
  } = useLogin()

  const [remember, setRemember] = useState(false)

  return (
    <div className={styles.wrapper}>
      <header className={styles.brand}>
        <LogoMark />
        <span
          className={styles.brandName}
          style={{
            color: colors.textPrimary,
            fontFamily: typography.fontFamily,
            fontWeight: 700,
          }}
        >
          FisioAdmin
        </span>
      </header>

      <div className={styles.intro}>
        <h1
          className={styles.title}
          style={{
            color: typography.h1.color,
            fontFamily: typography.fontFamily,
            fontSize: typography.h1.fontSize,
            fontWeight: typography.h1.fontWeight,
          }}
        >
          Bienvenido de nuevo.
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
          Accede a tu centro clínico.
        </p>
      </div>

      <form className={styles.form} onSubmit={handleSubmit} noValidate>
        <Input
          label="Correo electrónico"
          type="email"
          placeholder="ejemplo@clinica.com"
          autoComplete="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          onBlur={handleEmailBlur}
          iconLeft={<EnvelopeIcon />}
          error={emailError}
        />

        <PasswordField
          label="Contraseña"
          placeholder="Introduce tu contraseña"
          autoComplete="current-password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          onBlur={handlePasswordBlur}
          error={passwordError}
          footer={
            <Link
              to={ROUTE_PATHS.forgotPassword}
              className={styles.forgotLink}
              style={{
                color: colors.primary,
                fontFamily: typography.fontFamily,
                fontSize: typography.small.fontSize,
                fontWeight: typography.small.fontWeight,
              }}
            >
              ¿Olvidaste tu contraseña?
            </Link>
          }
        />

        <div
          className={styles.remember}
          style={{
            color: colors.textSecondary,
            fontFamily: typography.fontFamily,
            fontSize: typography.small.fontSize,
            fontWeight: typography.small.fontWeight,
          }}
        >
          <Switch
            checked={remember}
            onChange={setRemember}
            ariaLabel="Mantener sesión iniciada"
          />
          <span>Mantener sesión iniciada</span>
        </div>

        <Button type="submit" fullWidth disabled={submitting}>
          {submitting ? (
            <>
              <span className={styles.loader} />
              Iniciando sesión...
            </>
          ) : (
            'Iniciar sesión →'
          )}
        </Button>
      </form>

      <div
        className={styles.divider}
        style={{ borderColor: colors.border }}
      ></div>

      <p
        className={styles.signup}
        style={{
          color: colors.textSecondary,
          fontFamily: typography.fontFamily,
          fontSize: typography.body.fontSize,
          fontWeight: typography.body.fontWeight,
        }}
      >
        ¿No tienes una cuenta?{' '}
        <Link
          to={ROUTE_PATHS.register}
          style={{
            color: colors.primary,
            fontFamily: typography.fontFamily,
            fontSize: typography.body.fontSize,
            fontWeight: 600,
          }}
        >
          Regístrate
        </Link>
      </p>

      <footer
        className={styles.footer}
        style={{
          color: typography.small.color,
          fontFamily: typography.fontFamily,
          fontSize: typography.small.fontSize,
          fontWeight: typography.small.fontWeight,
        }}
      >
        FISIOADMIN PROFESSIONAL V2.4.0 • 2024 FISIOADMIN TN
      </footer>
    </div>
  )
}
