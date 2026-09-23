import { useEffect } from 'react'
import type { CSSProperties, ReactNode } from 'react'
import { colors } from '../../core/theme/colors'
import styles from './Modal.module.css'

interface ModalProps {
  open: boolean
  onRequestClose?: () => void
  children: ReactNode
}

type TokenStyle = CSSProperties & Record<`--${string}`, string>

const overlayStyle: TokenStyle = {
  '--overlay-color': colors.textPrimary,
}

export function Modal({ open, onRequestClose, children }: ModalProps) {
  useEffect(() => {
    if (!open || !onRequestClose) return

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onRequestClose()
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [open, onRequestClose])

  if (!open) return null

  return (
    <div className={styles.overlay} style={overlayStyle} role="presentation">
      <div
        className={styles.dialog}
        role="dialog"
        aria-modal="true"
        style={{
          background: colors.surface,
          borderColor: colors.border,
        }}
      >
        {children}
      </div>
    </div>
  )
}