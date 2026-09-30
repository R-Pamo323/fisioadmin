import { useId } from 'react'
import type { ChangeEvent } from 'react'
import { ChevronDown } from 'lucide-react'
import { colors } from '../../core/theme/colors'
import { typography } from '../../core/theme/typography'
import styles from './Select.module.css'

export interface SelectOption {
  value: string
  label: string
}

interface SelectProps {
  label?: string
  value: string
  onChange: (event: ChangeEvent<HTMLSelectElement>) => void
  onBlur?: () => void
  options: SelectOption[]
  error?: string
  disabled?: boolean
  name?: string
  id?: string
}

export function Select({
  label,
  value,
  onChange,
  onBlur,
  options,
  error,
  disabled = false,
  name,
  id,
}: SelectProps) {
  const generatedId = useId()
  const selectId = id ?? generatedId

  return (
    <div className={styles.wrapper}>
      {label ? (
        <label className={styles.label} htmlFor={selectId} style={{ color: colors.textPrimary }}>
          {label}
        </label>
      ) : null}

      <div
        className={styles.box}
        style={{
          borderColor: error ? colors.error : colors.border,
          background: colors.surface,
          '--focus-color': colors.primary,
        }}
      >
        <select
          id={selectId}
          name={name}
          value={value}
          disabled={disabled}
          onChange={onChange}
          onBlur={onBlur}
          className={styles.select}
          style={{ color: colors.textPrimary }}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <span className={styles.chevron} style={{ color: colors.textSecondary }}>
          <ChevronDown size={16} />
        </span>
      </div>

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
