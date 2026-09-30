import { ChevronRight, Pencil, Trash2 } from 'lucide-react'
import { Badge, Card, DropdownMenu } from '../../../../shared/components'
import { colors } from '../../../../core/theme/colors'
import type { ServiceType } from '../../domain/entities/ServiceType'
import { CATEGORY_META, formatDuration, formatPrice } from './categories'
import styles from './ServiceTypeCard.module.css'

interface ServiceTypeCardProps {
  service: ServiceType
  onEdit: (service: ServiceType) => void
  onDelete: (service: ServiceType) => void
  onShowDetails: (service: ServiceType) => void
}

export function ServiceTypeCard({
  service,
  onEdit,
  onDelete,
  onShowDetails,
}: ServiceTypeCardProps) {
  const meta = CATEGORY_META[service.category]
  const Icon = meta.icon
  const isFree = service.price === 0

  return (
    <Card className={styles.card}>
      <div className={styles.media} style={{ background: meta.wash }}>
        <span className={styles.watermark} style={{ color: colors.surface }}>
          <Icon size={72} />
        </span>
      </div>

      <Badge className={styles.duration} tone="neutral">
        {formatDuration(service.durationMinutes)}
      </Badge>

      <div className={styles.menu}>
        <DropdownMenu
          ariaLabel={`Acciones de ${service.name}`}
          items={[
            {
              label: 'Editar',
              icon: <Pencil size={15} />,
              onSelect: () => onEdit(service),
            },
            {
              label: 'Eliminar',
              icon: <Trash2 size={15} />,
              onSelect: () => onDelete(service),
              tone: 'danger',
            },
          ]}
        />
      </div>

      <div className={styles.body}>
        <div className={styles.heading}>
          <h3 className={styles.name}>{service.name}</h3>
          <span
            className={styles.price}
            style={{ color: isFree ? colors.primary : colors.textPrimary }}
          >
            {formatPrice(service.price)}
          </span>
        </div>

        <Badge tone={meta.tone}>{meta.label}</Badge>

        {service.description ? (
          <p className={styles.description}>{service.description}</p>
        ) : null}

        <button
          type="button"
          className={styles.detailsLink}
          onClick={() => onShowDetails(service)}
          style={{ color: colors.primary }}
        >
          Ver detalles de protocolo
          <ChevronRight size={14} />
        </button>
      </div>
    </Card>
  )
}
