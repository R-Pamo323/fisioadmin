import { X } from 'lucide-react'
import { colors } from '../../../../core/theme/colors'
import { typography } from '../../../../core/theme/typography'
import { Button, Input, Modal, Select, Textarea } from '../../../../shared/components'
import type { SelectOption } from '../../../../shared/components'
import type { ServiceType } from '../../../appointment-types/domain/entities/ServiceType'
import type { Expense, ExpenseDraft } from '../../domain/entities/Expense'
import { NO_SERVICE_TYPE_VALUE, useExpenseForm } from '../hooks/useExpenseForm'
import { EXPENSE_META } from './expenseMeta'
import styles from './ExpenseFormModal.module.css'

interface ExpenseFormModalProps {
  open: boolean
  /** Gasto en edición; null cuando se crea uno nuevo. */
  expense: Expense | null
  /** Solo los tipos de cita de categoría 'gastos'. */
  expenseServiceTypes: ServiceType[]
  onSubmit: (draft: ExpenseDraft) => Promise<void>
  onClose: () => void
}

export function ExpenseFormModal({
  open,
  expense,
  expenseServiceTypes,
  onSubmit,
  onClose,
}: ExpenseFormModalProps) {
  const { values, isValid, isSaving, mode, setValue, onBlur, getError, handleSubmit } =
    useExpenseForm({
      expense,
      expenseServiceTypes,
      onSubmit,
      onDone: onClose,
    })

  const isEdit = mode === 'edit'

  const serviceTypeOptions: SelectOption[] = [
    { value: NO_SERVICE_TYPE_VALUE, label: 'Sin tipo de cita' },
    ...expenseServiceTypes.map((serviceType) => ({
      value: serviceType.id,
      label: `${serviceType.name} (S/${serviceType.price})`,
    })),
  ]

  return (
    <Modal open={open} onRequestClose={onClose} size="lg">
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
            {isEdit ? 'Editar gasto' : 'Nuevo gasto'}
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

        <span
          className={styles.badge}
          style={{ color: EXPENSE_META.color, background: EXPENSE_META.background }}
        >
          <EXPENSE_META.Icon size={14} />
          {EXPENSE_META.label}
        </span>

        <Input
          label="Título del gasto"
          value={values.title}
          onChange={setValue('title')}
          onBlur={onBlur('title')}
          error={getError('title')}
          placeholder="Ej. Alquiler del local"
        />

        <Textarea
          label="Descripción"
          rows={2}
          value={values.description}
          onChange={setValue('description')}
          onBlur={onBlur('description')}
          placeholder="Ej. Factura del mes"
        />

        <div className={styles.row}>
          <Input
            label="Fecha"
            type="date"
            value={values.date}
            onChange={setValue('date')}
            onBlur={onBlur('date')}
            error={getError('date')}
          />
          <Input
            label="Hora (opcional)"
            type="time"
            value={values.time}
            onChange={setValue('time')}
            onBlur={onBlur('time')}
          />
        </div>

        <div className={styles.row}>
          <Input
            label="Monto (S/)"
            type="number"
            min="0"
            value={values.amount}
            onChange={setValue('amount')}
            onBlur={onBlur('amount')}
            error={getError('amount')}
            placeholder="0"
          />
          <Select
            label="Tipo de cita (opcional)"
            value={values.serviceTypeId}
            onChange={setValue('serviceTypeId')}
            onBlur={onBlur('serviceTypeId')}
            options={serviceTypeOptions}
          />
        </div>

        <p className={styles.hint}>
          El gasto no ocupa horario: se muestra en la banda roja de arriba del calendario y no
          interfiere con las citas.
        </p>

        <div className={styles.actions}>
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" disabled={!isValid || isSaving}>
            {isSaving ? 'Guardando…' : isEdit ? 'Guardar cambios' : 'Registrar gasto'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}