import type { CSSProperties } from 'react'
import { colors } from '../../core/theme/colors'
import styles from './Switch.module.css'

interface SwitchProps {
  checked: boolean
  onChange: (checked: boolean) => void
  ariaLabel?: string
}

type TokenStyle = CSSProperties & Record<`--${string}`, string>

const switchStyle: TokenStyle = {
  '--switch-on': colors.primary,
  '--switch-off': colors.border,
  '--switch-thumb': colors.surface,
  '--focus-color': colors.primary,
}

export function Switch({ checked, onChange, ariaLabel }: SwitchProps) {
  const classes = [styles.switch, checked ? styles.on : ''].filter(Boolean).join(' ')

  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={ariaLabel}
      className={classes}
      style={switchStyle}
      onClick={() => onChange(!checked)}
    >
      <span className={styles.thumb} />
    </button>
  )
}