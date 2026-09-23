import { useEffect, useRef } from 'react'
import type { ClipboardEvent, CSSProperties, KeyboardEvent } from 'react'
import { colors } from '../../../../core/theme/colors'
import styles from './OtpInput.module.css'

interface OtpInputProps {
  length?: number
  value: string
  onChange: (value: string) => void
  disabled?: boolean
  error?: boolean
}

type TokenStyle = CSSProperties & Record<`--${string}`, string>

const boxStyle: TokenStyle = {
  color: colors.textPrimary,
  '--field-color': colors.border,
  '--focus-color': colors.primary,
  '--error-color': colors.error,
  '--surface-color': colors.surface,
}

export function OtpInput({
  length = 4,
  value,
  onChange,
  disabled = false,
  error = false,
}: OtpInputProps) {
  const refs = useRef<Array<HTMLInputElement | null>>([])

  useEffect(() => {
    const nextIndex = value.length
    if (nextIndex < length) {
      refs.current[nextIndex]?.focus()
    }
  }, [value, length])

  const handleChange = (index: number, rawValue: string) => {
    const digit = rawValue.replace(/\D/g, '').slice(-1)
    if (!digit) return

    const next = value.slice(0, index) + digit + value.slice(index + 1)
    onChange(next)

    if (index < length - 1) {
      refs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (index: number, event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Backspace') {
      event.preventDefault()
      if (value[index]) {
        onChange(value.slice(0, index) + value.slice(index + 1))
      }
      if (index > 0) {
        refs.current[index - 1]?.focus()
      }
    }
    if (event.key === 'ArrowLeft' && index > 0) {
      refs.current[index - 1]?.focus()
    }
    if (event.key === 'ArrowRight' && index < length - 1) {
      refs.current[index + 1]?.focus()
    }
  }

  const handlePaste = (index: number, event: ClipboardEvent<HTMLInputElement>) => {
    event.preventDefault()
    const pasted = event.clipboardData.getData('text').replace(/\D/g, '')
    if (!pasted) return

    const chars = value.split('')
    for (let i = 0; i < pasted.length && index + i < length; i++) {
      chars[index + i] = pasted[i]
    }
    onChange(chars.join(''))

    const nextFocus = Math.min(index + pasted.length, length)
    if (nextFocus < length) {
      refs.current[nextFocus]?.focus()
    }
  }

  return (
    <div
      className={styles.group}
      style={error ? { ...boxStyle, '--field-color': colors.error } : boxStyle}
    >
      {Array.from({ length }, (_, index) => (
        <input
          key={index}
          ref={(node) => {
            refs.current[index] = node
          }}
          type="text"
          inputMode="numeric"
          autoComplete="one-time-code"
          maxLength={1}
          value={value[index] ?? ''}
          disabled={disabled}
          aria-label={`Dígito ${index + 1}`}
          className={styles.input}
          onChange={(event) => handleChange(index, event.target.value)}
          onKeyDown={(event) => handleKeyDown(index, event)}
          onPaste={(event) => handlePaste(index, event)}
          onFocus={(event) => event.target.select()}
        />
      ))}
    </div>
  )
}