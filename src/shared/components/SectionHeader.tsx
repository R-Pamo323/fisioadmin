import type { ReactNode } from 'react'
import { colors } from '../../core/theme/colors'
import { typography } from '../../core/theme/typography'
import styles from './SectionHeader.module.css'

interface SectionHeaderProps {
  title?: string
  subtitle?: string
  actions?: ReactNode
}

export function SectionHeader({ title, subtitle, actions }: SectionHeaderProps) {
  return (
    <header className={styles.header}>
      <div className={styles.text}>
        {title ? (
          <h2
            className={styles.title}
            style={{
              color: typography.h2.color,
              fontSize: typography.h2.fontSize,
              fontWeight: typography.h2.fontWeight,
            }}
          >
            {title}
          </h2>
        ) : null}

        {subtitle ? (
          <p
            className={styles.subtitle}
            style={{
              color: colors.textSecondary,
              fontSize: typography.body.fontSize,
              fontWeight: typography.body.fontWeight,
            }}
          >
            {subtitle}
          </p>
        ) : null}
      </div>

      {actions ? <div className={styles.actions}>{actions}</div> : null}
    </header>
  )
}
