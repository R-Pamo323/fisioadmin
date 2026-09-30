import { Search } from 'lucide-react'
import { colors } from '../../core/theme/colors'
import styles from './SearchInput.module.css'

interface SearchInputProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  ariaLabel?: string
}

export function SearchInput({
  value,
  onChange,
  placeholder = 'Buscar...',
  ariaLabel = 'Buscar',
}: SearchInputProps) {
  return (
    <label className={styles.searchBox}>
      <span className={styles.icon} style={{ color: colors.textSecondary }}>
        <Search size={16} />
      </span>
      <input
        type="search"
        className={styles.input}
        value={value}
        placeholder={placeholder}
        aria-label={ariaLabel}
        onChange={(event) => onChange(event.target.value)}
        style={{ color: colors.textPrimary, '--placeholder-color': colors.textSecondary }}
      />
    </label>
  )
}
