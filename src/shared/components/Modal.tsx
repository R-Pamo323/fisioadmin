import { useEffect } from 'react'
import type { CSSProperties, ReactNode } from 'react'
import { colors } from '../../core/theme/colors'
import styles from './Modal.module.css'

export type ModalSize = 'sm' | 'md' | 'lg'

interface ModalProps {
  open: boolean
  onRequestClose?: () => void
  children: ReactNode
  size?: ModalSize
}

type TokenStyle = CSSProperties & Record<`--${string}`, string>

const overlayStyle: TokenStyle = {
  '--overlay-color': colors.textPrimary,
}

const SIZE_CLASSES: Record<ModalSize, string> = {
  sm: styles.sizeSm,
  md: styles.sizeMd,
  lg: styles.sizeLg,
}

export function Modal({ open, onRequestClose, children, size = 'sm' }: ModalProps) {
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
        className={[styles.dialog, SIZE_CLASSES[size]].join(' ')}
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