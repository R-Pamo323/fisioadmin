import type { FormEvent } from 'react'
import { useState } from 'react'
import { EMAIL_REGEX } from '../../../shared/presentation/constants'
import { MockRegisterRepository } from '../../data/repositories/MockRegisterRepository'
import { RegisterUser } from '../../domain/usecases/RegisterUser'

const registerUser = new RegisterUser(new MockRegisterRepository())

export interface RegisterModalState {
  variant: 'success' | 'error'
  message: string
}

const validateName = (name: string) =>
  name.trim() === '' ? 'El nombre es obligatorio.' : ''

const validateEmail = (email: string) => {
  if (email.trim() === '') return 'El correo electrónico es obligatorio.'
  if (!EMAIL_REGEX.test(email.trim())) {
    return 'Introduce un correo electrónico válido.'
  }
  return ''
}

const validatePassword = (password: string) => {
  if (password === '') return 'La contraseña es obligatoria.'
  if (password.length < 8) {
    return 'La contraseña debe tener al menos 8 caracteres.'
  }
  return ''
}

const validateConfirm = (password: string, confirm: string) => {
  if (confirm === '') return 'Repite tu contraseña.'
  if (confirm !== password) return 'Las contraseñas no coinciden.'
  return ''
}

export function useRegister() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [nameError, setNameError] = useState('')
  const [emailError, setEmailError] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [confirmError, setConfirmError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [modal, setModal] = useState<RegisterModalState | null>(null)

  const isFormValid =
    validateName(name) === '' &&
    validateEmail(email) === '' &&
    validatePassword(password) === '' &&
    validateConfirm(password, confirm) === ''

  const handleNameBlur = () => setNameError(validateName(name))
  const handleEmailBlur = () => setEmailError(validateEmail(email))
  const handlePasswordBlur = () => setPasswordError(validatePassword(password))
  const handleConfirmBlur = () => setConfirmError(validateConfirm(password, confirm))

  const closeModal = () => setModal(null)

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const nextNameError = validateName(name)
    const nextEmailError = validateEmail(email)
    const nextPasswordError = validatePassword(password)
    const nextConfirmError = validateConfirm(password, confirm)

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
    const result = await registerUser.execute({ name, email, password })
    setIsSubmitting(false)

    if (result.ok) {
      setModal({ variant: 'success', message: 'Cuenta creada exitosamente' })
    } else {
      setModal({ variant: 'error', message: result.error })
    }
  }

  return {
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
  }
}
