import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Button,
  CheckIcon,
  EnvelopeIcon,
  Input,
  Modal,
} from '../../../../shared/components'
import { ROUTE_PATHS } from '../../../../core/routes/paths'
import { colors } from '../../../../core/theme/colors'
import { typography } from '../../../../core/theme/typography'
import {
  mockIsEmailRegistered,
  mockVerifyResetCode,
} from '../../data/datasources/mockAuth'
import { OtpInput } from './OtpInput'
import styles from './ForgotPasswordFlow.module.css'

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

type Step = 'email' | 'code'

export function ForgotPasswordFlow() {
  const navigate = useNavigate()

  const [step, setStep] = useState<Step>('email')
  const [email, setEmail] = useState('')
  const [emailError, setEmailError] = useState('')
  const [isSending, setIsSending] = useState(false)
  const [sentTo, setSentTo] = useState('')
  const [code, setCode] = useState('')
  const [codeError, setCodeError] = useState('')
  const [isChecking, setIsChecking] = useState(false)
  const [secondsLeft, setSecondsLeft] = useState(0)
  const [successOpen, setSuccessOpen] = useState(false)

  useEffect(() => {
    if (step === 'code') setSecondsLeft(30)
  }, [step])

  useEffect(() => {
    if (step !== 'code' || secondsLeft <= 0) return

    const timer = setTimeout(() => setSecondsLeft((seconds) => seconds - 1), 1000)
    return () => clearTimeout(timer)
  }, [step, secondsLeft])

  useEffect(() => {
    if (!successOpen) return

    const redirect = setTimeout(() => {
      navigate(ROUTE_PATHS.login)
    }, 2500)

    return () => clearTimeout(redirect)
  }, [successOpen, navigate])

  const handleEmailBlur = () => {
    if (email.trim() !== '' && !EMAIL_REGEX.test(email.trim())) {
      setEmailError('Introduce un correo electrónico válido.')
    }
  }

  const handleSend = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (email.trim() === '') {
      setEmailError('Introduce tu correo electrónico.')
      return
    }
    if (!EMAIL_REGEX.test(email.trim())) {
      setEmailError('Introduce un correo electrónico válido.')
      return
    }

    setIsSending(true)
    const registered = await mockIsEmailRegistered(email)
    setIsSending(false)

    if (!registered) {
      setEmailError('Este correo no está registrado.')
      return
    }

    setEmailError('')
    setSentTo(email.trim())
    setStep('code')
  }

  const handleVerify = async () => {
    if (code.length !== 4) {
      setCodeError('Introduce el código de 4 dígitos.')
      return
    }

    setIsChecking(true)
    const isValid = await mockVerifyResetCode(code)
    setIsChecking(false)

    if (!isValid) {
      setCodeError('Código incorrecto, inténtalo de nuevo.')
      setCode('')
      return
    }

    setCodeError('')
    setSuccessOpen(true)
  }

  const handleResend = () => {
    setCode('')
    setCodeError('')
    setSecondsLeft(30)
  }

  return (
    <>
      {step === 'email' ? (
        <form className={styles.form} onSubmit={handleSend} noValidate>
          <p
            className={styles.help}
            style={{
              color: typography.body.color,
              fontFamily: typography.fontFamily,
              fontSize: typography.body.fontSize,
              fontWeight: typography.body.fontWeight,
            }}
          >
            Introduce el correo de tu cuenta y te enviaremos un código para
            restablecer tu contraseña.
          </p>

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

          <Button
            type="submit"
            fullWidth
            disabled={isSending || email.trim() === ''}
          >
            {isSending ? 'Enviando…' : 'Enviar código'}
          </Button>

          <div className={styles.divider} style={{ borderColor: colors.border }}></div>

          <p
            className={styles.backLink}
            style={{
              color: colors.textSecondary,
              fontFamily: typography.fontFamily,
              fontSize: typography.body.fontSize,
              fontWeight: typography.body.fontWeight,
            }}
          >
            <Link
              to={ROUTE_PATHS.login}
              style={{
                color: colors.primary,
                fontFamily: typography.fontFamily,
                fontSize: typography.body.fontSize,
                fontWeight: 600,
              }}
            >
              ← Volver al inicio de sesión
            </Link>
          </p>
        </form>
      ) : (
        <div className={styles.codeStep}>
          <p
            className={styles.info}
            style={{
              color: colors.success,
              fontFamily: typography.fontFamily,
              fontSize: typography.body.fontSize,
              fontWeight: typography.body.fontWeight,
            }}
          >
            Se envió un código a <strong>{sentTo}</strong>
          </p>

          <div className={styles.otpRow}>
            <OtpInput
              length={4}
              value={code}
              onChange={setCode}
              disabled={isChecking}
              error={codeError !== ''}
            />
          </div>

          {codeError ? (
            <p
              className={styles.codeError}
              style={{
                color: colors.error,
                fontSize: typography.small.fontSize,
                fontWeight: typography.small.fontWeight,
              }}
            >
              {codeError}
            </p>
          ) : null}

          <div className={styles.resendRow}>
            <button
              type="button"
              className={styles.resendButton}
              disabled={secondsLeft > 0 || isChecking}
              onClick={handleResend}
              style={{
                color: secondsLeft > 0 ? colors.textSecondary : colors.primary,
                fontFamily: typography.fontFamily,
                fontSize: typography.small.fontSize,
                fontWeight: typography.small.fontWeight,
              }}
            >
              {secondsLeft > 0 ? `Reenviar código (${secondsLeft}s)` : 'Reenviar código'}
            </button>
          </div>

          <Button
            type="button"
            fullWidth
            disabled={code.length !== 4 || isChecking}
            onClick={handleVerify}
          >
            {isChecking ? 'Verificando…' : 'Verificar código'}
          </Button>

          <button
            type="button"
            className={styles.changeEmail}
            onClick={() => {
              setStep('email')
              setCode('')
              setCodeError('')
            }}
            style={{
              color: colors.textSecondary,
              fontFamily: typography.fontFamily,
              fontSize: typography.small.fontSize,
              fontWeight: typography.small.fontWeight,
            }}
          >
            Usar otro correo
          </button>
        </div>
      )}

      <Modal open={successOpen}>
        <div className={styles.modalBox}>
          <span className={styles.modalIcon} style={{ color: colors.success }}>
            <CheckIcon />
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
            ¡Listo!
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
            Contraseña cambiada exitosamente
          </p>
          <Button fullWidth onClick={() => navigate(ROUTE_PATHS.login)}>
            Ir al inicio de sesión
          </Button>
        </div>
      </Modal>
    </>
  )
}