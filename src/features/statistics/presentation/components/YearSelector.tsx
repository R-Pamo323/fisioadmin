import { ChevronLeft, ChevronRight } from 'lucide-react'
import styles from './YearSelector.module.css'

interface YearSelectorProps {
  year: number
  minYear: number
  maxYear: number
  onChange: (year: number) => void
}

/** Selector global de año: mueve ‹ 2026 › un año por clic. */
export function YearSelector({ year, minYear, maxYear, onChange }: YearSelectorProps) {
  const canGoPrev = year > minYear
  const canGoNext = year < maxYear

  return (
    <div className={styles.selector} role="group" aria-label="Selector de año">
      <button
        type="button"
        className={styles.navBtn}
        onClick={() => onChange(year - 1)}
        disabled={!canGoPrev}
        aria-label="Año anterior"
      >
        <ChevronLeft size={18} />
      </button>

      <span className={styles.year} aria-live="polite">
        {year}
      </span>

      <button
        type="button"
        className={styles.navBtn}
        onClick={() => onChange(year + 1)}
        disabled={!canGoNext}
        aria-label="Año siguiente"
      >
        <ChevronRight size={18} />
      </button>
    </div>
  )
}
