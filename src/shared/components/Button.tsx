import type { ButtonHTMLAttributes, CSSProperties, ReactNode } from 'react'
import { colors } from '../../core/theme/colors'
import styles from './Button.module.css'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
  fullWidth?: boolean
}

const buttonStyle: CSSProperties & Record<`--${string}`, string> = {
  background: colors.primary,
  color: colors.surface,
  '--focus-color': colors.primary,
}

export function Button({
  children,
  fullWidth = false,
  type = 'button',
  className,
  style,
  ...rest
}: ButtonProps) {
  const classes = [styles.button, fullWidth ? styles.fullWidth : '', className ?? '']
    .filter(Boolean)
    .join(' ')

  return (
    <button
      type={type}
      className={classes}
      style={{
        ...buttonStyle,
        ...style,
      }}
      {...rest}
    >
      {children}
    </button>
  )
}