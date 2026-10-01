import { useEffect, useRef, useState } from 'react'
import { X } from 'lucide-react'
import { Modal, Pagination } from '../../../../shared/components'
import type { Transaction } from '../../domain/entities/Statistics'
import { TransactionsTable } from './TransactionsTable'
import styles from './TransactionsModal.module.css'

interface TransactionsModalProps {
  open: boolean
  transactions: Transaction[]
  isLoading: boolean
  onClose: () => void
}

/** Filas por página; el mock da 14, así que el paginado muestra 2 páginas. */
const PAGE_SIZE = 10

export function TransactionsModal({
  open,
  transactions,
  isLoading,
  onClose,
}: TransactionsModalProps) {
  const [page, setPage] = useState(1)
  const scrollRef = useRef<HTMLDivElement>(null)

  const totalPages = Math.max(1, Math.ceil(transactions.length / PAGE_SIZE))
  const safePage = Math.min(Math.max(page, 1), totalPages)

  // El padre remonta el modal con una key por apertura, así que la página ya
  // empieza en 1. Solo queda devolver la lista arriba al cambiar de página.
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 0 })
  }, [safePage])

  if (!open) return null

  const firstIndex = (safePage - 1) * PAGE_SIZE
  const visible = transactions.slice(firstIndex, firstIndex + PAGE_SIZE)

  return (
    <Modal open onRequestClose={onClose} size="xl">
      <div className={styles.content}>
        <header className={styles.header}>
          <div className={styles.headText}>
            <h3 className={styles.title}>Todas las Transacciones</h3>
            <p className={styles.subtitle}>Historial completo de movimientos</p>
          </div>
          <button type="button" className={styles.close} onClick={onClose} aria-label="Cerrar">
            <X size={18} />
          </button>
        </header>

        <div className={styles.scroll} ref={scrollRef}>
          {isLoading ? (
            <p className={styles.loading}>Cargando transacciones...</p>
          ) : (
            <TransactionsTable transactions={visible} variant="roomy" />
          )}
        </div>

        {isLoading || transactions.length === 0 ? null : (
          <Pagination
            page={safePage}
            totalPages={totalPages}
            onPageChange={setPage}
            summary={`Mostrando ${firstIndex + 1}–${firstIndex + visible.length} de ${transactions.length}`}
            ariaLabel="Paginación de transacciones"
          />
        )}
      </div>
    </Modal>
  )
}