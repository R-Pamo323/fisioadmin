import { ChevronLeft, ChevronRight } from 'lucide-react'
import { colors } from '../../core/theme/colors'
import styles from './Pagination.module.css'

interface PaginationProps {
  /** Página actual, empezando en 1. */
  page: number
  totalPages: number
  onPageChange: (page: number) => void
  /** Texto de contexto, ej. "Mostrando 1–5 de 8". */
  summary?: string
  ariaLabel?: string
  className?: string
}

/** Vecindades a cada lado de la página actual antes de colapsar con puntos. */
const WINDOW = 1

function buildPageItems(page: number, totalPages: number): (number | 'gap')[] {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1)
  }

  const items: (number | 'gap')[] = []
  let previous = 0

  for (let current = 1; current <= totalPages; current += 1) {
    const isEdge = current === 1 || current === totalPages
    const isNear = Math.abs(current - page) <= WINDOW
    if (!isEdge && !isNear) continue

    if (previous !== 0 && current - previous > 1) items.push('gap')
    items.push(current)
    previous = current
  }

  return items
}

export function Pagination({
  page,
  totalPages,
  onPageChange,
  summary,
  ariaLabel = 'Paginación',
  className,
}: PaginationProps) {
  if (totalPages < 1) return null

  const safePage = Math.min(Math.max(page, 1), totalPages)
  const goTo = (target: number) => {
    const next = Math.min(Math.max(target, 1), totalPages)
    if (next !== safePage) onPageChange(next)
  }

  return (
    <nav className={[styles.root, className ?? ''].filter(Boolean).join(' ')}>
      {summary ? <span className={styles.summary}>{summary}</span> : null}

      {totalPages > 1 ? (
        <div className={styles.controls}>
          <button
            type="button"
            className={styles.arrow}
            onClick={() => goTo(safePage - 1)}
            disabled={safePage === 1}
            aria-label="Página anterior"
          >
            <ChevronLeft size={15} />
          </button>

          {buildPageItems(safePage, totalPages).map((item) =>
            item === 'gap' ? (
              <span key="gap" className={styles.gap} aria-hidden="true">
                …
              </span>
            ) : (
              <button
                key={item}
                type="button"
                className={item === safePage ? styles.itemActive : styles.item}
                onClick={() => goTo(item)}
                aria-label={`Página ${item}`}
                aria-current={item === safePage ? 'page' : undefined}
                style={
                  item === safePage
                    ? { background: colors.primary, color: colors.surface }
                    : undefined
                }
              >
                {item}
              </button>
            ),
          )}

          <button
            type="button"
            className={styles.arrow}
            onClick={() => goTo(safePage + 1)}
            disabled={safePage === totalPages}
            aria-label="Página siguiente"
          >
            <ChevronRight size={15} />
          </button>
        </div>
      ) : null}

      <span className={styles.srOnly} aria-live="polite">
        {`Página ${safePage} de ${totalPages}`}
      </span>
    </nav>
  )
}