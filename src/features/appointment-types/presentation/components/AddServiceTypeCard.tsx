import { Plus } from 'lucide-react'
import { colors } from '../../../../core/theme/colors'
import styles from './AddServiceTypeCard.module.css'

interface AddServiceTypeCardProps {
  onClick: () => void
}

export function AddServiceTypeCard({ onClick }: AddServiceTypeCardProps) {
  return (
    <button
      type="button"
      className={styles.card}
      onClick={onClick}
      style={{ color: colors.primary, borderColor: colors.border }}
    >
      <span className={styles.icon} style={{ color: colors.primary }}>
        <Plus size={24} />
      </span>
      <strong className={styles.title}>Añadir Servicio</strong>
      <span className={styles.subtitle}>Define un nuevo tipo de terapia</span>
    </button>
  )
}
