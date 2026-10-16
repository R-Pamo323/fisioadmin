import { X } from 'lucide-react'
import {
  Button,
  Input,
  Modal,
  Select,
  Textarea,
} from '../../../../shared/components'
import { colors } from '../../../../core/theme/colors'
import { typography } from '../../../../core/theme/typography'
import type { ServiceType, ServiceTypeDraft } from '../../domain/entities/ServiceType'
import { useServiceTypeForm } from '../hooks/useServiceTypeForm'
import { CATEGORY_OPTIONS } from './serviceMeta'
import styles from './ServiceTypeFormModal.module.css'

interface ServiceTypeFormModalProps {
  open: boolean
  /** Servicio en edición; null cuando se crea uno nuevo. */
  service: ServiceType | null
  onSubmit: (draft: ServiceTypeDraft) => Promise<void>
  onClose: () => void
}

export function ServiceTypeFormModal({
  open,
  service,
  onSubmit,
  onClose,
}: ServiceTypeFormModalProps) {
  const isEdit = service !== null

  const { values, isValid, isSaving, setValue, onBlur, getError, handleSubmit } =
    useServiceTypeForm({ service, onSubmit, onDone: onClose })
  const isFree = values.category === 'gratis'

  return (
    <Modal open={open} onRequestClose={onClose} size="md">
      <form className={styles.form} onSubmit={handleSubmit} noValidate>
        <header className={styles.header}>
          <h3
            className={styles.title}
            style={{
              color: typography.h2.color,
              fontSize: typography.h2.fontSize,
              fontWeight: typography.h2.fontWeight,
            }}
          >
            {isEdit ? 'Editar Servicio' : 'Nuevo Servicio'}
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

        <p className={styles.hint}>
          Los cambios se aplican solo a esta pantalla (datos de demostración).
        </p>

        <Input
          label="Nombre del servicio"
          placeholder="Ej. Terapia Física"
          value={values.name}
          onChange={setValue('name')}
          onBlur={onBlur('name')}
          error={getError('name')}
        />

        <Select
          label="Categoría"
          value={values.category}
          onChange={setValue('category')}
          onBlur={onBlur('category')}
          options={CATEGORY_OPTIONS}
        />
        <p className={styles.categoryHint}>
          Elige <strong>beneficios</strong> si el servicio genera dinero;{' '}
          <strong>gastos</strong> si es un costo de la clínica; <strong>gratis</strong> si no
          tiene coste para el paciente.
        </p>

        <div className={styles.row}>
          <Input
            label="Precio (S/)"
            type="number"
            min={0}
            placeholder="0"
            value={values.price}
            onChange={setValue('price')}
            onBlur={onBlur('price')}
            error={getError('price')}
            disabled={isFree}
          />

          <Input
            label="Duración (min)"
            type="number"
            min={values.category === 'gastos' ? 0 : 1}
            placeholder={values.category === 'gastos' ? 'Opcional' : '45'}
            value={values.duration}
            onChange={setValue('duration')}
            onBlur={onBlur('duration')}
            error={getError('duration')}
          />
        </div>

        <Textarea
          label="Descripción"
          placeholder="Describe brevemente en qué consiste el servicio."
          rows={3}
          value={values.description}
          onChange={setValue('description')}
          onBlur={onBlur('description')}
          error={getError('description')}
        />

        <Textarea
          label="Detalles de protocolo"
          rows={4}
          value={values.protocol}
          onChange={setValue('protocol')}
          placeholder={'Ej.:\nEvaluar al paciente\nAplicar calor\nTerapia manual'}
        />
        <p className={styles.protocolHint}>
          Opcional. Escribe un paso por línea; se guardan en el orden en que los
          escribas.
        </p>

        <div className={styles.actions}>
          <Button variant="ghost" onClick={onClose} disabled={isSaving}>
            Cancelar
          </Button>
          <Button type="submit" disabled={!isValid || isSaving}>
            {isSaving ? 'Guardando…' : 'Guardar'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
