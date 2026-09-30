import type { FormEvent } from 'react'
import { useCallback, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ROUTE_PATHS } from '../../../../../core/routes/paths'
import type { LoginErrorCode } from '../../../shared/domain/types'
import { EMAIL_REGEX } from '../../../shared/presentation/constants'
import { MockLoginRepository } from '../../data/repositories/MockLoginRepository'
import { LoginUser } from '../../domain/usecases/LoginUser'

const loginUser = new LoginUser(new MockLoginRepository())

const ERROR_MESSAGES: Record<LoginErrorCode, string> = {
  email_not_registered:
    'Este correo no está registrado. Comprueba la dirección o crea una cuenta.',
  invalid_credentials:
    'La contraseña no es correcta. Revísala e inténtalo de nuevo.',
}

export function useLogin() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [emailError, setEmailError] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleEmailBlur = useCallback(() => {
    if (email.trim() !== '' && !EMAIL_REGEX.test(email.trim())) {
      setEmailError('Introduce un correo electrónico válido.')
    }
  }, [email])

  const handlePasswordBlur = useCallback(() => {
    if (password !== '' && password.length < 8) {
      setPasswordError('La contraseña debe tener al menos 8 caracteres.')
    }
  }, [password])

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (submitting) return

    const normalizedEmail = email.trim()

    if (normalizedEmail === '') {
      setEmailError('Introduce tu correo electrónico.')
      setPasswordError('')
      return
    }

    if (!EMAIL_REGEX.test(normalizedEmail)) {
      setEmailError('Introduce un correo electrónico válido.')
      setPasswordError('')
      return
    }

    if (password.length < 8) {
      setPasswordError('La contraseña debe tener al menos 8 caracteres.')
      setEmailError('')
      return
    }

    setEmailError('')
    setPasswordError('')
    setSubmitting(true)

    const result = await loginUser.execute(normalizedEmail, password)
    setSubmitting(false)

    if (result.ok) {
      navigate(ROUTE_PATHS.calendar)
      return
    }

    const message = ERROR_MESSAGES[result.error]

    if (result.error === 'email_not_registered') {
      setEmailError(message)
      return
    }

    setPasswordError(message)
  }

  return {
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
  }
}
