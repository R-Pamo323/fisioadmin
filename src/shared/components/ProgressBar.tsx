import { colors } from '../../core/theme/colors'
import styles from './ProgressBar.module.css'

interface ProgressBarProps {
  value: number
  max?: number
  color?: string
  /** Altura de la pista en px; 8 por defecto. */
  height?: number
  ariaLabel?: string
  className?: string
}

export function ProgressBar({
  value,
  max = 100,
  color = colors.primary,
  height = 8,
  ariaLabel,
  className,
}: ProgressBarProps) {
  const percent = max <= 0 ? 0 : Math.min(100, Math.max(0, (value / max) * 100))

  return (
    <div
      className={[styles.track, className ?? ''].filter(Boolean).join(' ')}
      style={{ height }}
      role="progressbar"
      aria-label={ariaLabel}
      aria-valuemin={0}
      aria-valuemax={Math.round(max)}
      aria-valuenow={Math.round(value)}
    >
      <span className={styles.fill} style={{ width: `${percent}%`, background: color }} />
    </div>
  )
}