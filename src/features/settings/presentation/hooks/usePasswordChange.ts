import { useCallback, useEffect, useState } from 'react'
import { MockSettingsRepository } from '../../data/repositories/MockSettingsRepository'
import { ChangePassword } from '../../domain/usecases/ChangePassword'

const changePassword = new ChangePassword(new MockSettingsRepository())

/** Misma regla y mismo mensaje que el registro (useRegister). */
const MIN_PASSWORD_LENGTH = 8

const SAVED_MESSAGE_MS = 2500

const validateCurrent = (value: string) => {
  if (value === '') return 'Introduce tu contraseña actual.'
  return ''
}

const validateNext = (value: string) => {
  if (value === '') return 'Introduce una nueva contraseña.'
  if (value.length < MIN_PASSWORD_LENGTH) {
    return 'La contraseña debe tener al menos 8 caracteres.'
  }
  return ''
}

const validateConfirm = (value: string, next: string) => {
  if (value === '') return 'Repite tu nueva contraseña.'
  if (value !== next) return 'Las contraseñas no coinciden.'
  return ''
}

export function usePasswordChange() {
  const [isOpen, setIsOpen] = useState(false)
  const [current, setCurrent] = useState('')
  const [next, setNext] = useState('')
  const [confirm, setConfirm] = useState('')
  const [currentError, setCurrentError] = useState('')
  const [nextError, setNextError] = useState('')
  const [confirmError, setConfirmError] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [isSaved, setIsSaved] = useState(false)

  useEffect(() => {
    if (!isSaved) return undefined

    const timer = setTimeout(() => setIsSaved(false), SAVED_MESSAGE_MS)
    return () => clearTimeout(timer)
  }, [isSaved])

  const reset = useCallback(() => {
    setCurrent('')
    setNext('')
    setConfirm('')
    setCurrentError('')
    setNextError('')
    setConfirmError('')
  }, [])

  const toggle = useCallback(() => {
    if (isOpen) {
      reset()
      setIsSaved(false)
      setIsOpen(false)
      return
    }

    setIsOpen(true)
  }, [isOpen, reset])

  const handleCurrentBlur = useCallback(() => setCurrentError(validateCurrent(current)), [current])

  const handleNextBlur = useCallback(() => setNextError(validateNext(next)), [next])

  const handleConfirmBlur = useCallback(
    () => setConfirmError(validateConfirm(confirm, next)),
    [confirm, next],
  )

  const submit = useCallback(async () => {
    // Revalida por si el usuario nunca salió del campo antes de guardar.
    const currentErrorNext = validateCurrent(current)
    const nextErrorNext = validateNext(next)
    const confirmErrorNext = validateConfirm(confirm, next)

    setCurrentError(currentErrorNext)
    setNextError(nextErrorNext)
    setConfirmError(confirmErrorNext)

    if (currentErrorNext || nextErrorNext || confirmErrorNext) return

    setIsSaving(true)
    const result = await changePassword.execute(current, next)
    setIsSaving(false)

    if (result === 'invalid_current') {
      setCurrentError('Esta no es tu contraseña actual.')
      return
    }

    if (result === 'invalid_length') {
      setNextError('La contraseña debe tener al menos 8 caracteres.')
      return
    }

    reset()
    setIsSaved(true)
  }, [confirm, current, next, reset])

  return {
    isOpen,
    current,
    next,
    confirm,
    currentError,
    nextError,
    confirmError,
    isSaving,
    isSaved,
    setCurrent,
    setNext,
    setConfirm,
    handleCurrentBlur,
    handleNextBlur,
    handleConfirmBlur,
    toggle,
    submit,
  }
}