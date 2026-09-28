import { Wallet } from 'lucide-react'
import { colors } from '../../../../core/theme/colors'
import { typography } from '../../../../core/theme/typography'
import { Card } from '../../../../shared/components'
import styles from './Income.module.css'

export function Income() {
  return (
    <div className={styles.container}>
      <Card className={styles.placeholder}>
        <div className={styles.iconCircle}>
          <Wallet size={24} color={colors.primary} />
        </div>
        <h2
          style={{
            margin: 0,
            color: typography.h2.color,
            fontSize: typography.h2.fontSize,
            fontWeight: typography.h2.fontWeight,
          }}
        >
          Ingresos
        </h2>
        <p
          style={{
            margin: 0,
            color: typography.body.color,
            fontSize: typography.body.fontSize,
            lineHeight: 1.5,
          }}
        >
          Aquí verás el resumen de cobros, los pagos pendientes y el detalle de los ingresos del
          centro clínico.
        </p>
        <span className={styles.badge}>Próximamente</span>
      </Card>
    </div>
  )
}