import type { CSSProperties, ReactNode } from 'react'
import { colors } from '../../../../core/theme/colors'
import { Card } from '../../../../shared/components'
import styles from './SettingsCard.module.css'

type SettingsCardTone = 'default' | 'danger'

interface SettingsCardProps {
  /** Ícono del encabezado (User, LogOut…). */
  icon: ReactNode
  title: string
  subtitle: string
  /**
   * `danger` pinta fondo, borde, ícono y título en rojo. El fondo tiene que ir
   * por `style` porque Card aplica `background: colors.surface` inline con
   * tone="default", y el estilo inline gana sobre cualquier clase CSS.
   */
  tone?: SettingsCardTone
  children: ReactNode
}

type CardStyle = CSSProperties & Record<`--${string}`, string>

/** Mismos porcentajes 6% / 20% que usa `.soft` en Card.module.css. */
const DANGER_BACKGROUND = 'color-mix(in srgb, #ef4444 6%, #ffffff)'
const DANGER_BORDER = 'color-mix(in srgb, #ef4444 20%, #ffffff)'
const DANGER_ICON_BG = 'color-mix(in srgb, #ef4444 12%, #ffffff)'

export function SettingsCard({
  icon,
  title,
  subtitle,
  tone = 'default',
  children,
}: SettingsCardProps) {
  const isDanger = tone === 'danger'

  const cardStyle: CardStyle | undefined = isDanger
    ? { background: DANGER_BACKGROUND, borderColor: DANGER_BORDER }
    : undefined

  return (
    <Card className={styles.card} style={cardStyle}>
      <header className={styles.head}>
        <span
          className={styles.icon}
          style={{
            background: isDanger ? DANGER_ICON_BG : '#e0f2fe',
            color: isDanger ? colors.error : colors.primary,
          }}
        >
          {icon}
        </span>

        <div className={styles.headText}>
          <h3 className={styles.title} style={isDanger ? { color: colors.error } : undefined}>
            {title}
          </h3>
          <p className={styles.subtitle}>{subtitle}</p>
        </div>
      </header>

      {children}
    </Card>
  )
}