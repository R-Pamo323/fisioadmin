import { ChevronDown } from 'lucide-react'
import { MONTH_OPTIONS } from './statisticsMeta'
import styles from './MonthFilter.module.css'

interface MonthFilterProps {
  /** Mes seleccionado (0–11) o `null` para todo el año. */
  value: number | null
  onChange: (month: number | null) => void
}

/** Selector compacto de mes por panel: "Todo el año" o un mes concreto. */
export function MonthFilter({ value, onChange }: MonthFilterProps) {
  return (
    <div className={styles.wrapper}>
      <select
        className={styles.select}
        aria-label="Filtrar por mes"
        value={value === null ? 'all' : String(value)}
        onChange={(event) => {
          const raw = event.target.value
          onChange(raw === 'all' ? null : Number(raw))
        }}
      >
        {MONTH_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      <span className={styles.chevron} aria-hidden="true">
        <ChevronDown size={14} />
      </span>
    </div>
  )
}
