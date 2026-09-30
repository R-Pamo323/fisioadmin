import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ROUTE_PATHS } from '../../../../../core/routes/paths'
import { EMAIL_REGEX } from '../../../shared/presentation/constants'
import { MockPasswordResetRepository } from '../../data/repositories/MockPasswordResetRepository'
import { RequestPasswordReset, RESET_CODE_LENGTH } from '../../domain/usecases/RequestPasswordReset'
import { VerifyResetCode } from '../../domain/usecases/VerifyResetCode'

const repository = new MockPasswordResetRepository()
const requestPasswordReset = new RequestPasswordReset(repository)
const verifyResetCode = new VerifyResetCode(repository)

const RESEND_SECONDS = 30
const SUCCESS_REDIRECT_MS = 2500

type Step = 'email' | 'code'

export function usePasswordReset() {
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
    if (step !== 'code' || secondsLeft <= 0) return

    const timer = setTimeout(
      () => setSecondsLeft((seconds) => seconds - 1),
      1000,
    )
    return () => clearTimeout(timer)
  }, [step, secondsLeft])

  useEffect(() => {
    if (!successOpen) return

    const redirect = setTimeout(() => {
      navigate(ROUTE_PATHS.login)
    }, SUCCESS_REDIRECT_MS)

    return () => clearTimeout(redirect)
  }, [successOpen, navigate])

  const handleEmailBlur = useCallback(() => {
    if (email.trim() !== '' && !EMAIL_REGEX.test(email.trim())) {
      setEmailError('Introduce un correo electrónico válido.')
    }
  }, [email])

  const handleSend = async () => {
    if (email.trim() === '') {
      setEmailError('Introduce tu correo electrónico.')
      return
    }
    if (!EMAIL_REGEX.test(email.trim())) {
      setEmailError('Introduce un correo electrónico válido.')
      return
    }

    setIsSending(true)
    const registered = await requestPasswordReset.execute(email)
    setIsSending(false)

    if (!registered) {
      setEmailError('Este correo no está registrado.')
      return
    }

    setEmailError('')
    setSentTo(email.trim())
    setSecondsLeft(RESEND_SECONDS)
    setStep('code')
  }

  const handleVerify = async () => {
    setIsChecking(true)
    const result = await verifyResetCode.execute(code)
    setIsChecking(false)

    if (result === 'invalid_length') {
      setCodeError('Introduce el código de 4 dígitos.')
      return
    }

    if (result === 'invalid_code') {
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
    setSecondsLeft(RESEND_SECONDS)
  }

  const handleChangeEmail = () => {
    setStep('email')
    setCode('')
    setCodeError('')
  }

  return {
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
    codeLength: RESET_CODE_LENGTH,
    setCode,
    setEmail,
    handleEmailBlur,
    handleSend,
    handleVerify,
    handleResend,
    handleChangeEmail,
    goToLogin: () => navigate(ROUTE_PATHS.login),
  }
}
