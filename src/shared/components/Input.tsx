import type { ChangeEvent, CSSProperties, InputHTMLAttributes, ReactNode } from 'react'
import { colors } from '../../core/theme/colors'
import { typography } from '../../core/theme/typography'
import styles from './Input.module.css'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  value: string
  onChange: (event: ChangeEvent<HTMLInputElement>) => void
  iconLeft?: ReactNode
  rightSlot?: ReactNode
  footer?: ReactNode
  error?: string
}

type TokenStyle = CSSProperties & Record<`--${string}`, string>

export function Input({
  label,
  value,
  onChange,
  iconLeft,
  rightSlot,
  footer,
  error,
  type = 'text',
  id,
  className,
  style,
  ...rest
}: InputProps) {
  const inputId = id ?? label?.replace(/\s+/g, '-').toLowerCase()

  const boxStyle: TokenStyle = {
    borderColor: error ? colors.error : colors.border,
    background: colors.surface,
    '--placeholder-color': colors.textSecondary,
    '--focus-color': colors.primary,
  }

  return (
    <div className={[styles.wrapper, className ?? ''].join(' ')} style={style}>
      {label ? (
        <label
          className={styles.label}
          htmlFor={inputId}
          style={{ color: colors.textPrimary }}
        >
          {label}
        </label>
      ) : null}

      <div className={styles.box} style={boxStyle}>
        {iconLeft ? (
          <span className={styles.iconLeft} style={{ color: colors.textSecondary }}>
            {iconLeft}
          </span>
        ) : null}

        <input
          id={inputId}
          type={type}
          value={value}
          onChange={onChange}
          className={styles.input}
          style={{ color: colors.textPrimary }}
          {...rest}
        />

        {rightSlot ? <span className={styles.rightSlot}>{rightSlot}</span> : null}
      </div>

      {footer ? <div className={styles.footer}>{footer}</div> : null}

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