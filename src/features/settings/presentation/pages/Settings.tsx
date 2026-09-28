import { Settings as SettingsIcon } from 'lucide-react'
import { colors } from '../../../../core/theme/colors'
import { typography } from '../../../../core/theme/typography'
import { Card } from '../../../../shared/components'
import styles from './Settings.module.css'

export function Settings() {
  return (
    <div className={styles.container}>
      <Card className={styles.placeholder}>
        <div className={styles.iconCircle}>
          <SettingsIcon size={24} color={colors.primary} />
        </div>
        <h2
          style={{
            margin: 0,
            color: typography.h2.color,
            fontSize: typography.h2.fontSize,
            fontWeight: typography.h2.fontWeight,
          }}
        >
          Configuración
        </h2>
        <p
          style={{
            margin: 0,
            color: typography.body.color,
            fontSize: typography.body.fontSize,
            lineHeight: 1.5,
          }}
        >
          Administra los datos de tu centro, tu perfil, precios y preferencias generales de la
          cuenta.
        </p>
        <span className={styles.badge}>Próximamente</span>
      </Card>
    </div>
  )
}