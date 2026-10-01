import { useState } from 'react'
import type { ChangeEvent, ReactNode } from 'react'
import { colors } from '../../core/theme/colors'
import { EyeIcon, EyeOffIcon, LockIcon } from './Icons'
import { Input } from './Input'
import styles from './PasswordField.module.css'

interface PasswordFieldProps {
  label: string
  placeholder: string
  value: string
  onChange: (event: ChangeEvent<HTMLInputElement>) => void
  onBlur?: () => void
  error?: string
  autoComplete?: string
  footer?: ReactNode
}

export function PasswordField({
  label,
  placeholder,
  value,
  onChange,
  onBlur,
  error,
  autoComplete,
  footer,
}: PasswordFieldProps) {
  const [showPassword, setShowPassword] = useState(false)

  return (
    <Input
      label={label}
      type={showPassword ? 'text' : 'password'}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      onBlur={onBlur}
      autoComplete={autoComplete}
      iconLeft={<LockIcon />}
      error={error}
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
      footer={footer}
    />
  )
}
