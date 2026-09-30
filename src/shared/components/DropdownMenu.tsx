import { useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { MoreVertical } from 'lucide-react'
import { colors } from '../../core/theme/colors'
import styles from './DropdownMenu.module.css'

export interface DropdownMenuItem {
  label: string
  icon?: ReactNode
  onSelect: () => void
  tone?: 'default' | 'danger'
}

interface DropdownMenuProps {
  items: DropdownMenuItem[]
  ariaLabel?: string
}

export function DropdownMenu({ items, ariaLabel = 'Opciones' }: DropdownMenuProps) {
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!open) return

    const handlePointerDown = (event: MouseEvent | TouchEvent) => {
      const target = event.target
      if (target instanceof Node && !containerRef.current?.contains(target)) {
        setOpen(false)
      }
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }

    document.addEventListener('mousedown', handlePointerDown)
    document.addEventListener('touchstart', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('mousedown', handlePointerDown)
      document.removeEventListener('touchstart', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [open])

  return (
    <div className={styles.container} ref={containerRef}>
      <button
        type="button"
        className={styles.trigger}
        aria-label={ariaLabel}
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((isOpen) => !isOpen)}
        style={{ color: colors.textSecondary }}
      >
        <MoreVertical size={18} />
      </button>

      {open ? (
        <div className={styles.menu} role="menu" style={{ borderColor: colors.border }}>
          {items.map((item) => (
            <button
              key={item.label}
              type="button"
              role="menuitem"
              className={item.tone === 'danger' ? styles.itemDanger : styles.item}
              style={{ color: item.tone === 'danger' ? colors.error : colors.textPrimary }}
              onClick={() => {
                setOpen(false)
                item.onSelect()
              }}
            >
              {item.icon ? (
                <span className={styles.itemIcon} style={{ color: colors.textSecondary }}>
                  {item.icon}
                </span>
              ) : null}
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      ) : null}
    </div>
  )
}
