import type { ButtonHTMLAttributes, CSSProperties, ReactNode } from 'react'
import { colors } from '../../core/theme/colors'
import styles from './Button.module.css'

export type ButtonVariant = 'primary' | 'secondary' | 'ghost'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
  fullWidth?: boolean
  variant?: ButtonVariant
}

const VARIANT_STYLES: Record<ButtonVariant, CSSProperties & Record<`--${string}`, string>> = {
  primary: {
    background: colors.primary,
    color: colors.surface,
    borderColor: 'transparent',
  },
  secondary: {
    background: colors.surface,
    color: colors.textPrimary,
    borderColor: colors.border,
  },
  ghost: {
    background: 'transparent',
    color: colors.textSecondary,
    borderColor: 'transparent',
  },
}

const focusStyle: Record<`--${string}`, string> = {
  '--focus-color': colors.primary,
}

export function Button({
  children,
  fullWidth = false,
  variant = 'primary',
  type = 'button',
  className,
  style,
  ...rest
}: ButtonProps) {
  const classes = [
    styles.button,
    styles[variant],
    fullWidth ? styles.fullWidth : '',
    className ?? '',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <button
      type={type}
      className={classes}
      style={{
        ...VARIANT_STYLES[variant],
        ...focusStyle,
        ...style,
      }}
      {...rest}
    >
      {children}
    </button>
  )
}