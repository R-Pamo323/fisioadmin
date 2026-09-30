import { useId } from 'react'
import type { ChangeEvent } from 'react'
import { colors } from '../../core/theme/colors'
import { typography } from '../../core/theme/typography'
import styles from './Textarea.module.css'

interface TextareaProps {
  label?: string
  value: string
  onChange: (event: ChangeEvent<HTMLTextAreaElement>) => void
  placeholder?: string
  rows?: number
  error?: string
  disabled?: boolean
  name?: string
  id?: string
}

export function Textarea({
  label,
  value,
  onChange,
  placeholder,
  rows = 3,
  error,
  disabled = false,
  name,
  id,
}: TextareaProps) {
  const generatedId = useId()
  const textareaId = id ?? generatedId

  return (
    <div className={styles.wrapper}>
      {label ? (
        <label
          className={styles.label}
          htmlFor={textareaId}
          style={{ color: colors.textPrimary }}
        >
          {label}
        </label>
      ) : null}

      <textarea
        id={textareaId}
        name={name}
        rows={rows}
        value={value}
        placeholder={placeholder}
        disabled={disabled}
        onChange={onChange}
        className={styles.textarea}
        style={{
          borderColor: error ? colors.error : colors.border,
          background: colors.surface,
          '--placeholder-color': colors.textSecondary,
          '--focus-color': colors.primary,
          color: colors.textPrimary,
        }}
      />

      {error ? (
        <p
          className={styles.error}
          style={{
            color: colors.error,
            fontSize: typography.small.fontSize,
            fontWeight: typography.small.fontWeight,
          }}
        >
          {error}
        </p>
      ) : null}
    </div>
  )
}
