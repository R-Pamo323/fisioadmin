import { useState } from 'react'
import type { CSSProperties, FormEvent } from 'react'
import { Link } from 'react-router-dom'
import {
  Button,
  EnvelopeIcon,
  EyeIcon,
  EyeOffIcon,
  Input,
  LockIcon,
  LogoMark,
  Switch,
} from '../../../../shared/components'
import { ROUTE_PATHS } from '../../../../core/routes/paths'
import { colors } from '../../../../core/theme/colors'
import { typography } from '../../../../core/theme/typography'
import styles from './LoginForm.module.css'

type TokenStyle = CSSProperties & Record<`--${string}`, string>

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const rememberStyle: TokenStyle = {
  color: colors.textSecondary,
  fontFamily: typography.fontFamily,
  fontSize: typography.small.fontSize,
  fontWeight: typography.small.fontWeight,
}

export function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [remember, setRemember] = useState(false)
  const [emailError, setEmailError] = useState('')
  const [passwordError, setPasswordError] = useState('')

  const handleEmailBlur = () => {
    if (email.trim() !== '' && !EMAIL_REGEX.test(email.trim())) {
      setEmailError('Introduce un correo electrónico válido.')
    }
  }

  const handlePasswordBlur = () => {
    if (password !== '' && password.length < 8) {
      setPasswordError('La contraseña debe tener al menos 8 caracteres.')
    }
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (email.trim() === '') {
      setEmailError('Introduce tu correo electrónico.')
    } else if (!EMAIL_REGEX.test(email.trim())) {
      setEmailError('Introduce un correo electrónico válido.')
    } else {
      setEmailError('')
    }

    if (password.length < 8) {
      setPasswordError('La contraseña debe tener al menos 8 caracteres.')
    } else {
      setPasswordError('')
    }
  }

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
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          onBlur={handleEmailBlur}
          iconLeft={<EnvelopeIcon />}
          error={emailError}
        />

        <Input
          label="Contraseña"
          type={showPassword ? 'text' : 'password'}
          placeholder="Introduce tu contraseña"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          onBlur={handlePasswordBlur}
          iconLeft={<LockIcon />}
          error={passwordError}
          rightSlot={
            <button
              type="button"
              className={styles.eyeButton}
              aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
              onClick={() => setShowPassword((visible) => !visible)}
              style={{ color: colors.textSecondary }}
            >
              {showPassword ? <EyeOffIcon /> : <EyeIcon />}
            </button>
          }
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

        <div className={styles.remember} style={rememberStyle}>
          <Switch checked={remember} onChange={setRemember} ariaLabel="Mantener sesión iniciada" />
          <span>Mantener sesión iniciada</span>
        </div>

        <Button type="submit" fullWidth>
          Iniciar sesión →
        </Button>
      </form>

      <div className={styles.divider} style={{ borderColor: colors.border }}></div>

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
        FISIOADMIN PROFESSIONAL V2.4.0 • 2024 FISIOSYNC SL
      </footer>
    </div>
  )
}