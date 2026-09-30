import type { CSSProperties, ReactNode } from 'react'
import { colors } from '../../core/theme/colors'
import styles from './Badge.module.css'

export type BadgeTone = 'neutral' | 'primary' | 'success' | 'info' | 'warning' | 'error'

interface BadgeProps {
  children: ReactNode
  tone?: BadgeTone
  className?: string
}

type TokenStyle = CSSProperties & Record<`--${string}`, string>

const TONE_STYLES: Record<BadgeTone, TokenStyle> = {
  neutral: {
    color: colors.textSecondary,
    '--badge-bg': `color-mix(in srgb, ${colors.border} 70%, ${colors.surface})`,
  },
  primary: {
    color: colors.primary,
    '--badge-bg': `color-mix(in srgb, ${colors.primary} 12%, ${colors.surface})`,
  },
  success: {
    color: colors.success,
    '--badge-bg': `color-mix(in srgb, ${colors.success} 14%, ${colors.surface})`,
  },
  info: {
    color: colors.pendingText,
    '--badge-bg': colors.pendingBg,
  },
  warning: {
    color: '#B45309',
    '--badge-bg': '#FEF3C7',
  },
  error: {
    color: colors.error,
    '--badge-bg': `color-mix(in srgb, ${colors.error} 12%, ${colors.surface})`,
  },
}

export function Badge({ children, tone = 'neutral', className }: BadgeProps) {
  const classes = [styles.badge, className ?? ''].filter(Boolean).join(' ')

  return (
    <span className={classes} style={TONE_STYLES[tone]}>
      {children}
    </span>
  )
}
