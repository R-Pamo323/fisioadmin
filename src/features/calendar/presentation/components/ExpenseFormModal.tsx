import { useNavigate } from 'react-router-dom'
import { ArrowRight, X } from 'lucide-react'
import { ROUTE_PATHS } from '../../../../core/routes/paths'
import { colors } from '../../../../core/theme/colors'
import { typography } from '../../../../core/theme/typography'
import { formatSoles } from '../../../../shared/utils/currency'
import { Button, Input, Modal, Select, Textarea } from '../../../../shared/components'
import type { SelectOption } from '../../../../shared/components'
import type { ServiceType } from '../../../appointment-types/domain/entities/ServiceType'
import type { Expense, ExpenseDraft } from '../../domain/entities/Expense'
import { useExpenseForm } from '../hooks/useExpenseForm'
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
  const navigate = useNavigate()

  /** El borrador se pierde al navegar: es el flujo simple acordado. */
  const goTo = (path: string) => {
    onClose()
    navigate(path)
  }

  const serviceTypeOptions: SelectOption[] = [
    { value: '', label: 'Selecciona…' },
    ...expenseServiceTypes.map((serviceType) => ({
      value: serviceType.id,
      label: `${serviceType.name} (${formatSoles(serviceType.price)})`,
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

        <Select
          label="Tipo de cita"
          value={values.serviceTypeId}
          onChange={setValue('serviceTypeId')}
          onBlur={onBlur('serviceTypeId')}
          error={getError('serviceTypeId')}
          options={serviceTypeOptions}
        />

        <button
          type="button"
          className={styles.link}
          onClick={() => goTo(ROUTE_PATHS.appointmentTypes)}
        >
          ¿No aparece el tipo? Crea uno nuevo
          <ArrowRight size={13} />
        </button>

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

        <p className={styles.hint}>
          El gasto no ocupa horario: se muestra en la hora &quot;Gastos&quot;, al final del
          calendario, y no interfiere con las citas.
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