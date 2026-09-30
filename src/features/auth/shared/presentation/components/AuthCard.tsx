import type { ReactNode } from 'react'
import { Card, LogoMark } from '../../../../../shared/components'
import { colors } from '../../../../../core/theme/colors'
import { typography } from '../../../../../core/theme/typography'
import styles from './AuthCard.module.css'

interface AuthCardProps {
  title: string
  subtitle?: string
  children: ReactNode
}

export function AuthCard({ title, subtitle, children }: AuthCardProps) {
  return (
    <main
      className={styles.page}
      style={{
        background: colors.background,
        fontFamily: typography.fontFamily,
      }}
    >
      <Card className={styles.card}>
        <header className={styles.brand}>
          <LogoMark />
          <span
            className={styles.brandName}
            style={{ color: colors.textPrimary, fontWeight: 700 }}
          >
            FisioAdmin
          </span>
        </header>

        <h1
          className={styles.title}
          style={{
            color: typography.h1.color,
            fontFamily: typography.fontFamily,
            fontSize: typography.h1.fontSize,
            fontWeight: typography.h1.fontWeight,
          }}
        >
          {title}
        </h1>

        {subtitle ? (
          <p
            className={styles.subtitle}
            style={{
              color: typography.body.color,
              fontFamily: typography.fontFamily,
              fontSize: typography.body.fontSize,
              fontWeight: typography.body.fontWeight,
            }}
          >
            {subtitle}
          </p>
        ) : null}

        {children}
      </Card>
    </main>
  )
}
