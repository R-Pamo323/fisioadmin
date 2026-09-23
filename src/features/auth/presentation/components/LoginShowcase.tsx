import { Card, CheckIcon, LogoMark } from '../../../../shared/components'
import { colors } from '../../../../core/theme/colors'
import { typography } from '../../../../core/theme/typography'
import styles from './LoginShowcase.module.css'

export function LoginShowcase() {
  return (
    <section className={styles.wrapper}>
      <Card className={styles.heroCard}>
        <div className={styles.imagePlaceholder}>
          <span className={styles.placeholderIcon} style={{ color: colors.surface }}>
            <LogoMark />
          </span>
        </div>
      </Card>

      <ul className={styles.badges}>
        <li
          className={styles.badge}
          style={{ background: colors.surface, borderColor: colors.border }}
        >
          <span className={styles.badgeIcon} style={{ color: colors.success }}>
            <CheckIcon />
          </span>
          <span className={styles.badgeText}>
            <strong
              style={{
                color: colors.textPrimary,
                fontFamily: typography.fontFamily,
                fontSize: typography.body.fontSize,
                fontWeight: 600,
              }}
            >
              Acceso Seguro
            </strong>
            <span
              style={{
                color: typography.small.color,
                fontFamily: typography.fontFamily,
                fontSize: typography.small.fontSize,
                fontWeight: typography.small.fontWeight,
              }}
            >
              Cumplimiento con normativas de protección de datos
            </span>
          </span>
        </li>

        <li
          className={styles.badge}
          style={{ background: colors.surface, borderColor: colors.border }}
        >
          <span className={styles.badgeIcon} style={{ color: colors.success }}>
            <CheckIcon />
          </span>
          <span className={styles.badgeText}>
            <strong
              style={{
                color: colors.textPrimary,
                fontFamily: typography.fontFamily,
                fontSize: typography.body.fontSize,
                fontWeight: 600,
              }}
            >
              Gestión Integral
            </strong>
            <span
              style={{
                color: typography.small.color,
                fontFamily: typography.fontFamily,
                fontSize: typography.small.fontSize,
                fontWeight: typography.small.fontWeight,
              }}
            >
              Citas, historiales y facturación en un solo lugar
            </span>
          </span>
        </li>
      </ul>

      <Card tone="soft" className={styles.testimonialCard}>
        <blockquote
          className={styles.quote}
          style={{
            color: colors.textSecondary,
            fontFamily: typography.fontFamily,
            fontSize: typography.body.fontSize,
            fontWeight: typography.body.fontWeight,
            fontStyle: 'italic',
          }}
        >
          «La herramienta que transformó la gestión diaria de nuestro centro.
          Más tiempo para nuestros pacientes, menos tiempo en papeleo.»
        </blockquote>
        <span
          className={styles.attribution}
          style={{
            color: colors.textPrimary,
            fontFamily: typography.fontFamily,
            fontSize: typography.small.fontSize,
            fontWeight: 700,
            letterSpacing: '1.5px',
          }}
        >
          ESTÁNDAR DE EXCELENCIA CLÍNICA
        </span>
      </Card>
    </section>
  )
}