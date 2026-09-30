import { Link, useNavigate } from 'react-router-dom'
import {
  AlertIcon,
  Button,
  CheckIcon,
  EnvelopeIcon,
  Input,
  UserIcon,
} from '../../../../../shared/components'
import { ROUTE_PATHS } from '../../../../../core/routes/paths'
import { colors } from '../../../../../core/theme/colors'
import { typography } from '../../../../../core/theme/typography'
import { AuthModal } from '../../../shared/presentation/components/AuthModal'
import { PasswordField } from '../../../shared/presentation/components/PasswordField'
import { useRegister } from '../hooks/useRegister'
import styles from './RegisterForm.module.css'

export function RegisterForm() {
  const navigate = useNavigate()
  const {
    name,
    email,
    password,
    confirm,
    nameError,
    emailError,
    passwordError,
    confirmError,
    isSubmitting,
    isFormValid,
    modal,
    setName,
    setEmail,
    setPassword,
    setConfirm,
    handleNameBlur,
    handleEmailBlur,
    handlePasswordBlur,
    handleConfirmBlur,
    handleSubmit,
    closeModal,
  } = useRegister()

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      <Input
        label="Nombre"
        type="text"
        placeholder="Tu nombre completo"
        autoComplete="name"
        value={name}
        onChange={(event) => setName(event.target.value)}
        onBlur={handleNameBlur}
        iconLeft={<UserIcon />}
        error={nameError}
      />

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
        placeholder="Mínimo 8 caracteres"
        autoComplete="new-password"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
        onBlur={handlePasswordBlur}
        error={passwordError}
      />

      <PasswordField
        label="Repetir contraseña"
        placeholder="Repite tu contraseña"
        autoComplete="new-password"
        value={confirm}
        onChange={(event) => setConfirm(event.target.value)}
        onBlur={handleConfirmBlur}
        error={confirmError}
      />

      <Button type="submit" fullWidth disabled={!isFormValid || isSubmitting}>
        {isSubmitting ? 'Creando cuenta…' : 'Crear cuenta'}
      </Button>

      <div className={styles.divider} style={{ borderColor: colors.border }}></div>

      <p
        className={styles.loginLink}
        style={{
          color: colors.textSecondary,
          fontFamily: typography.fontFamily,
          fontSize: typography.body.fontSize,
          fontWeight: typography.body.fontWeight,
        }}
      >
        ¿Ya tienes una cuenta?{' '}
        <Link
          to={ROUTE_PATHS.login}
          style={{
            color: colors.primary,
            fontFamily: typography.fontFamily,
            fontSize: typography.body.fontSize,
            fontWeight: 600,
          }}
        >
          Inicia sesión
        </Link>
      </p>

      <AuthModal
        open={modal !== null}
        variant={modal?.variant ?? 'success'}
        title={modal?.variant === 'error' ? 'No se pudo continuar' : '¡Éxito!'}
        message={modal?.message ?? ''}
        icon={modal?.variant === 'error' ? <AlertIcon /> : <CheckIcon />}
        actionLabel={
          modal?.variant === 'error' ? 'Entendido' : 'Ir al inicio de sesión'
        }
        onAction={
          modal?.variant === 'error'
            ? closeModal
            : () => navigate(ROUTE_PATHS.login)
        }
        onRequestClose={closeModal}
      />
    </form>
  )
}
