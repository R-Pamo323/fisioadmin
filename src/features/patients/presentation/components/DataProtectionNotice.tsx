import { Info } from 'lucide-react'
import { Card } from '../../../../shared/components'
import styles from './DataProtectionNotice.module.css'

export function DataProtectionNotice() {
  return (
    <Card className={styles.card}>
      <span className={styles.icon}>
        <Info size={18} />
      </span>

      <div className={styles.body}>
        <h3 className={styles.title}>Protección de Datos de Salud</h3>
        <p className={styles.text}>
          Toda la información personal y clínica almacenada en este módulo cumple
          con las normativas locales de protección de datos personales. Asegúrese
          de cerrar su sesión al terminar su jornada laboral para mantener la
          confidencialidad de sus pacientes.
        </p>
      </div>
    </Card>
  )
}