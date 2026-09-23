import type { CSSProperties, HTMLAttributes, ReactNode } from 'react'
import { colors } from '../../core/theme/colors'
import styles from './Card.module.css'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
  tone?: 'default' | 'soft'
}

type TokenStyle = CSSProperties & Record<`--${string}`, string>

const baseStyle: TokenStyle = {
  borderColor: colors.border,
  '--primary-color': colors.primary,
}

const surfaceStyle: TokenStyle = {
  background: colors.surface,
}

export function Card({
  children,
  tone = 'default',
  className,
  style,
  ...rest
}: CardProps) {
  const classes = [styles.card, tone === 'soft' ? styles.soft : '', className ?? '']
    .filter(Boolean)
    .join(' ')

  const toneStyle = tone === 'soft' ? {} : surfaceStyle

  return (
    <div
      className={classes}
      style={{
        ...baseStyle,
        ...toneStyle,
        ...style,
      }}
      {...rest}
    >
      {children}
    </div>
  )
}