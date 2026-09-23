import { useState } from 'react'
import type { FormEvent } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import {
  AlertIcon,
  Button,
  CheckIcon,
  EnvelopeIcon,
  EyeIcon,
  EyeOffIcon,
  Input,
  LockIcon,
  Modal,
  UserIcon,
} from '../../../../shared/components'
import { ROUTE_PATHS } from '../../../../core/routes/paths'
import { colors } from '../../../../core/theme/colors'
import { typography } from '../../../../core/theme/typography'
import { mockCreateAccount } from '../../data/datasources/mockAuth'
import styles from './RegisterForm.module.css'

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

interface ModalState {
  variant: 'success' | 'error'
  message: string
}

export function RegisterForm() {
  const navigate = useNavigate()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [nameError, setNameError] = useState('')
  const [emailError, setEmailError] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [confirmError, setConfirmError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [modal, setModal] = useState<ModalState | null>(null)

  const validateName = () =>
    name.trim() === '' ? 'El nombre es obligatorio.' : ''

  const validateEmail = () => {
    if (email.trim() === '') return 'El correo electrónico es obligatorio.'
    if (!EMAIL_REGEX.test(email.trim())) {
      return 'Introduce un correo electrónico válido.'
    }
    return ''
  }

  const validatePassword = () => {
    if (password === '') return 'La contraseña es obligatoria.'
    if (password.length < 8) {
      return 'La contraseña debe tener al menos 8 caracteres.'
    }
    return ''
  }

  const validateConfirm = () => {
    if (confirm === '') return 'Repite tu contraseña.'
    if (confirm !== password) return 'Las contraseñas no coinciden.'
    return ''
  }

  const isFormValid =
    validateName() === '' &&
    validateEmail() === '' &&
    validatePassword() === '' &&
    validateConfirm() === ''

  const handleNameBlur = () => setNameError(validateName())
  const handleEmailBlur = () => setEmailError(validateEmail())
  const handlePasswordBlur = () => setPasswordError(validatePassword())
  const handleConfirmBlur = () => setConfirmError(validateConfirm())

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const nextNameError = validateName()
    const nextEmailError = validateEmail()
    const nextPasswordError = validatePassword()
    const nextConfirmError = validateConfirm()

    setNameError(nextNameError)
    setEmailError(nextEmailError)
    setPasswordError(nextPasswordError)
    setConfirmError(nextConfirmError)

    if (
      nextNameError ||
      nextEmailError ||
      nextPasswordError ||
      nextConfirmError
    ) {
      return
    }

    setIsSubmitting(true)
    const result = await mockCreateAccount({ name, email, password })
    setIsSubmitting(false)

    if (result.ok) {
      setModal({ variant: 'success', message: 'Cuenta creada exitosamente' })
    } else {
      setModal({ variant: 'error', message: result.error })
    }
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      <Input
        label="Nombre"
        type="text"
        placeholder="Tu nombre completo"
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
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        onBlur={handleEmailBlur}
        iconLeft={<EnvelopeIcon />}
        error={emailError}
      />

      <Input
        label="Contraseña"
        type={showPassword ? 'text' : 'password'}
        placeholder="Mínimo 8 caracteres"
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
      />

      <Input
        label="Repetir contraseña"
        type={showConfirm ? 'text' : 'password'}
        placeholder="Repite tu contraseña"
        value={confirm}
        onChange={(event) => setConfirm(event.target.value)}
        onBlur={handleConfirmBlur}
        iconLeft={<LockIcon />}
        error={confirmError}
        rightSlot={
          <button
            type="button"
            className={styles.eyeButton}
            aria-label={showConfirm ? 'Ocultar contraseña' : 'Mostrar contraseña'}
            onClick={() => setShowConfirm((visible) => !visible)}
            style={{ color: colors.textSecondary }}
          >
            {showConfirm ? <EyeOffIcon /> : <EyeIcon />}
          </button>
        }
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

      <Modal open={modal !== null} onRequestClose={() => setModal(null)}>
        <div className={styles.modalBox}>
          <span
            className={styles.modalIcon}
            style={{
              color:
                modal?.variant === 'success' ? colors.success : colors.error,
            }}
          >
            {modal?.variant === 'success' ? <CheckIcon /> : <AlertIcon />}
          </span>
          <p
            className={styles.modalTitle}
            style={{
              color: colors.textPrimary,
              fontFamily: typography.fontFamily,
              fontSize: typography.h2.fontSize,
              fontWeight: typography.h2.fontWeight,
            }}
          >
            {modal?.variant === 'success' ? '¡Éxito!' : 'No se pudo continuar'}
          </p>
          <p
            className={styles.modalMessage}
            style={{
              color: typography.body.color,
              fontFamily: typography.fontFamily,
              fontSize: typography.body.fontSize,
              fontWeight: typography.body.fontWeight,
            }}
          >
            {modal?.message}
          </p>
          {modal?.variant === 'success' ? (
            <Button fullWidth onClick={() => navigate(ROUTE_PATHS.login)}>
              Ir al inicio de sesión
            </Button>
          ) : (
            <Button fullWidth onClick={() => setModal(null)}>
              Entendido
            </Button>
          )}
        </div>
      </Modal>
    </form>
  )
}