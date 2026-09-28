import { ClipboardList } from 'lucide-react'
import { colors } from '../../../../core/theme/colors'
import { typography } from '../../../../core/theme/typography'
import { Card } from '../../../../shared/components'
import styles from './AppointmentTypes.module.css'

export function AppointmentTypes() {
  return (
    <div className={styles.container}>
      <Card className={styles.placeholder}>
        <div className={styles.iconCircle}>
          <ClipboardList size={24} color={colors.primary} />
        </div>
        <h2
          style={{
            margin: 0,
            color: typography.h2.color,
            fontSize: typography.h2.fontSize,
            fontWeight: typography.h2.fontWeight,
          }}
        >
          Tipos de citas
        </h2>
        <p
          style={{
            margin: 0,
            color: typography.body.color,
            fontSize: typography.body.fontSize,
            lineHeight: 1.5,
          }}
        >
          Gestiona los tipos de citas, su duración, precio y color asociado para tu agenda.
        </p>
        <span className={styles.badge}>Próximamente</span>
      </Card>
    </div>
  )
}