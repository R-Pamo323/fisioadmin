import type { CSSProperties } from 'react'
import { colors } from '../../core/theme/colors'
import styles from './SegmentedControl.module.css'

export interface SegmentOption {
  value: string
  label: string
  count?: number
}

interface SegmentedControlProps {
  options: SegmentOption[]
  value: string
  onChange: (value: string) => void
  ariaLabel?: string
  className?: string
}

export function SegmentedControl({
  options,
  value,
  onChange,
  ariaLabel = 'Filtrar',
  className,
}: SegmentedControlProps) {
  return (
    <div
      className={[styles.group, className ?? ''].filter(Boolean).join(' ')}
      role="group"
      aria-label={ariaLabel}
    >
      {options.map((option) => {
        const isActive = option.value === value
        const activeStyle: CSSProperties = isActive
          ? { background: colors.primary, color: colors.surface }
          : { color: colors.textSecondary }

        return (
          <button
            key={option.value}
            type="button"
            className={isActive ? styles.itemActive : styles.item}
            aria-pressed={isActive}
            style={activeStyle}
            onClick={() => onChange(option.value)}
          >
            {option.label}
            {option.count === undefined ? null : (
              <span className={styles.count}>{option.count}</span>
            )}
          </button>
        )
      })}
    </div>
  )
}