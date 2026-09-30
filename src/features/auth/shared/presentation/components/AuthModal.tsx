import type { ReactNode } from 'react'
import { Button, Modal } from '../../../../../shared/components'
import { colors } from '../../../../../core/theme/colors'
import { typography } from '../../../../../core/theme/typography'
import styles from './AuthModal.module.css'

interface AuthModalProps {
  open: boolean
  variant: 'success' | 'error'
  title: string
  message: string
  actionLabel: string
  icon: ReactNode
  onAction: () => void
  onRequestClose?: () => void
}

export function AuthModal({
  open,
  variant,
  title,
  message,
  actionLabel,
  icon,
  onAction,
  onRequestClose,
}: AuthModalProps) {
  return (
    <Modal open={open} onRequestClose={onRequestClose}>
      <div className={styles.modalBox}>
        <span
          className={styles.modalIcon}
          style={{ color: variant === 'success' ? colors.success : colors.error }}
        >
          {icon}
        </span>
        <p
          className={styles.modalTitle}
          style={{
            color: colors.textPrimary,
            fontFamily: typography.fontFamily,
            fontSize: typography.h2.fontSize,
            fontWeight: typography.h2.fontWeight,
          }}
        >
          {title}
        </p>
        <p
          className={styles.modalMessage}
          style={{
            color: typography.body.color,
            fontFamily: typography.fontFamily,
            fontSize: typography.body.fontSize,
            fontWeight: typography.body.fontWeight,
          }}
        >
          {message}
        </p>
        <Button fullWidth onClick={onAction}>
          {actionLabel}
        </Button>
      </div>
    </Modal>
  )
}
