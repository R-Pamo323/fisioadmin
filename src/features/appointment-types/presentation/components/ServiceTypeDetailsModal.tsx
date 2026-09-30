import { X } from 'lucide-react'
import { Badge, Button, Modal } from '../../../../shared/components'
import { colors } from '../../../../core/theme/colors'
import { typography } from '../../../../core/theme/typography'
import type { ServiceType } from '../../domain/entities/ServiceType'
import { CATEGORY_META, formatDuration, formatPrice } from './categories'
import styles from './ServiceTypeDetailsModal.module.css'

interface ServiceTypeDetailsModalProps {
  service: ServiceType | null
  onClose: () => void
}

export function ServiceTypeDetailsModal({
  service,
  onClose,
}: ServiceTypeDetailsModalProps) {
  if (!service) return null

  const meta = CATEGORY_META[service.category]

  return (
    <Modal open onRequestClose={onClose} size="md">
      <div className={styles.content}>
        <header className={styles.header}>
          <h3
            className={styles.title}
            style={{
              color: typography.h2.color,
              fontSize: typography.h2.fontSize,
              fontWeight: typography.h2.fontWeight,
            }}
          >
            Detalles de protocolo
          </h3>
          <button
            type="button"
            className={styles.close}
            onClick={onClose}
            aria-label="Cerrar"
            style={{ color: colors.textSecondary }}
          >
            <X size={18} />
          </button>
        </header>

        <div className={styles.summary}>
          <div className={styles.summaryText}>
            <strong className={styles.name}>{service.name}</strong>
            <Badge tone={meta.tone}>{meta.label}</Badge>
          </div>

          <div className={styles.facts}>
            <span className={styles.fact}>
              <strong>{formatDuration(service.durationMinutes)}</strong>
              <span>Duración</span>
            </span>
            <span className={styles.fact}>
              <strong
                style={{
                  color: service.price === 0 ? colors.primary : colors.textPrimary,
                }}
              >
                {formatPrice(service.price)}
              </strong>
              <span>Tarifa</span>
            </span>
          </div>
        </div>

        {service.description ? (
          <p className={styles.description}>{service.description}</p>
        ) : null}

        <section className={styles.protocol}>
          <h4 className={styles.protocolTitle}>Protocolo de sesión</h4>
          <ol className={styles.steps}>
            {service.protocol.map((step, index) => (
              <li key={`${service.id}-step-${index}`} className={styles.step}>
                <span className={styles.stepIndex}>{index + 1}</span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </section>

        <Button fullWidth onClick={onClose}>
          Cerrar
        </Button>
      </div>
    </Modal>
  )
}
