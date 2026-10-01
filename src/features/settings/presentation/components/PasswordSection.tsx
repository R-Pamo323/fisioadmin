import { useId } from 'react'
import type { FormEvent } from 'react'
import { CheckCircle2, KeyRound } from 'lucide-react'
import { colors } from '../../../../core/theme/colors'
import { Button, PasswordField } from '../../../../shared/components'
import { usePasswordChange } from '../hooks/usePasswordChange'
import styles from './PasswordSection.module.css'

export function PasswordSection() {
  const {
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
  } = usePasswordChange()

  const formId = useId()

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    void submit()
  }

  return (
    <div className={styles.section}>
      <button
        type="button"
        className={styles.link}
        onClick={toggle}
        aria-expanded={isOpen}
        aria-controls={formId}
      >
        <KeyRound size={16} />
        Cambiar contraseña
      </button>

      {isOpen ? (
        <form id={formId} className={styles.form} onSubmit={handleSubmit} noValidate>
          <PasswordField
            label="Contraseña actual"
            placeholder="••••••••"
            value={current}
            onChange={(event) => setCurrent(event.target.value)}
            onBlur={handleCurrentBlur}
            error={currentError}
            autoComplete="current-password"
          />

          <PasswordField
            label="Nueva contraseña"
            placeholder="Mínimo 8 caracteres"
            value={next}
            onChange={(event) => setNext(event.target.value)}
            onBlur={handleNextBlur}
            error={nextError}
            autoComplete="new-password"
          />

          <PasswordField
            label="Repetir nueva contraseña"
            placeholder="Vuelve a escribirla"
            value={confirm}
            onChange={(event) => setConfirm(event.target.value)}
            onBlur={handleConfirmBlur}
            error={confirmError}
            autoComplete="new-password"
          />

          <Button type="submit" fullWidth disabled={isSaving} style={{ fontSize: 16 }}>
            {isSaving ? 'Guardando…' : 'Actualizar contraseña'}
          </Button>

          {isSaved ? (
            <p className={styles.saved} role="status">
              <CheckCircle2 size={16} style={{ color: colors.success }} />
              Contraseña actualizada
            </p>
          ) : null}
        </form>
      ) : null}
    </div>
  )
}