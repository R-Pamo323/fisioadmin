import { Info } from 'lucide-react'
import { Card } from '../../../../shared/components'
import { colors } from '../../../../core/theme/colors'
import { typography } from '../../../../core/theme/typography'
import styles from './PriceUpdateBanner.module.css'

export function PriceUpdateBanner() {
  return (
    <Card className={styles.banner} style={{ borderColor: colors.border }}>
      <span className={styles.icon} style={{ color: colors.primary }}>
        <Info size={18} />
      </span>

      <div className={styles.content}>
        <strong
          className={styles.title}
          style={{
            color: colors.textPrimary,
            fontSize: typography.small.fontSize,
            fontWeight: 600,
          }}
        >
          Actualización de Precios
        </strong>
        <p
          className={styles.text}
          style={{
            color: colors.textSecondary,
            fontSize: typography.small.fontSize,
            fontWeight: typography.small.fontWeight,
          }}
        >
          Cualquier cambio realizado aquí se reflejará automáticamente en el
          módulo de facturación y en el selector de citas del calendario.
        </p>
      </div>
    </Card>
  )
}
