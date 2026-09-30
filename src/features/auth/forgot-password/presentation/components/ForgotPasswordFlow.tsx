import type { FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { Button, CheckIcon, EnvelopeIcon, Input } from '../../../../../shared/components'
import { ROUTE_PATHS } from '../../../../../core/routes/paths'
import { colors } from '../../../../../core/theme/colors'
import { typography } from '../../../../../core/theme/typography'
import { AuthModal } from '../../../shared/presentation/components/AuthModal'
import { OtpInput } from '../../../shared/presentation/components/OtpInput'
import { usePasswordReset } from '../hooks/usePasswordReset'
import styles from './ForgotPasswordFlow.module.css'

export function ForgotPasswordFlow() {
  const {
    step,
    email,
    emailError,
    isSending,
    sentTo,
    code,
    codeError,
    isChecking,
    secondsLeft,
    successOpen,
    codeLength,
    setCode,
    setEmail,
    handleEmailBlur,
    handleSend,
    handleVerify,
    handleResend,
    handleChangeEmail,
    goToLogin,
  } = usePasswordReset()

  const handleEmailSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    void handleSend()
  }

  return (
    <>
      {step === 'email' ? (
        <form className={styles.form} onSubmit={handleEmailSubmit} noValidate>
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
            autoComplete="email"
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

          <OtpInput
            length={codeLength}
            value={code}
            onChange={setCode}
            disabled={isChecking}
            error={codeError !== ''}
          />

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
              {secondsLeft > 0
                ? `Reenviar código (${secondsLeft}s)`
                : 'Reenviar código'}
            </button>
          </div>

          <Button
            type="button"
            fullWidth
            disabled={code.length !== codeLength || isChecking}
            onClick={handleVerify}
          >
            {isChecking ? 'Verificando…' : 'Verificar código'}
          </Button>

          <button
            type="button"
            className={styles.changeEmail}
            onClick={handleChangeEmail}
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

      <AuthModal
        open={successOpen}
        variant="success"
        title="¡Listo!"
        message="Contraseña cambiada exitosamente"
        icon={<CheckIcon />}
        actionLabel="Ir al inicio de sesión"
        onAction={goToLogin}
      />
    </>
  )
}
