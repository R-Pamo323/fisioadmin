import { useNavigate } from 'react-router-dom'
import { ArrowRight, X } from 'lucide-react'
import { ROUTE_PATHS } from '../../../../core/routes/paths'
import { colors } from '../../../../core/theme/colors'
import { typography } from '../../../../core/theme/typography'
import { Button, Input, Modal, Select } from '../../../../shared/components'
import type { SelectOption } from '../../../../shared/components'
import type { Patient } from '../../../patients/domain/entities/Patient'
import type { ServiceType } from '../../../appointment-types/domain/entities/ServiceType'
import type { Appointment, AppointmentDraft } from '../../domain/entities/Appointment'
import { NO_PATIENT_VALUE, useAppointmentForm } from '../hooks/useAppointmentForm'
import { APPOINTMENT_STATUS_OPTIONS } from './appointmentStatusMeta'
import styles from './AppointmentFormModal.module.css'

const PLACEHOLDER_OPTION: SelectOption = { value: '', label: 'Selecciona…' }

interface AppointmentFormModalProps {
  open: boolean
  /** Cita en edición; null cuando se crea una nueva. */
  appointment: Appointment | null
  patients: Patient[]
  serviceTypes: ServiceType[]
  isLoading: boolean
  onSubmit: (draft: AppointmentDraft) => Promise<void>
  onClose: () => void
}

export function AppointmentFormModal({
  open,
  appointment,
  patients,
  serviceTypes,
  isLoading,
  onSubmit,
  onClose,
}: AppointmentFormModalProps) {
  const isEdit = appointment !== null
  const navigate = useNavigate()

  const { values, isValid, isSaving, mode, isMeeting, setValue, onBlur, getError, handleSubmit } =
    useAppointmentForm({ appointment, patients, serviceTypes, onSubmit, onDone: onClose })

  const patientOptions: SelectOption[] = [
    PLACEHOLDER_OPTION,
    { value: NO_PATIENT_VALUE, label: 'Indeterminado (sin paciente)' },
    ...patients.map((patient) => ({ value: patient.id, label: patient.name })),
  ]

  const serviceTypeOptions: SelectOption[] = [
    PLACEHOLDER_OPTION,
    ...serviceTypes.map((serviceType) => ({
      value: serviceType.id,
      label: serviceType.name,
    })),
  ]

  const close = () => {
    onClose()
  }

  /** El borrador se pierde al navegar: es el flujo simple acordado. */
  const goTo = (path: string) => {
    onClose()
    navigate(path)
  }

  return (
    <Modal open={open} onRequestClose={close} size="lg">
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
            {isEdit ? 'Editar cita' : 'Nueva cita'}
          </h3>
          <button
            type="button"
            className={styles.close}
            onClick={close}
            aria-label="Cerrar"
            style={{ color: colors.textSecondary }}
          >
            <X size={18} />
          </button>
        </header>

        <Select
          label="Paciente"
          value={values.patientId}
          onChange={setValue('patientId')}
          onBlur={onBlur('patientId')}
          options={patientOptions}
          error={getError('patientId')}
          disabled={isLoading}
        />

        <button
          type="button"
          className={styles.link}
          onClick={() => goTo(ROUTE_PATHS.patients)}
        >
          ¿Falta algún paciente? Ir a Pacientes
          <ArrowRight size={13} />
        </button>

        {isMeeting ? (
          <>
            <Input
              label="Título de la reunión"
              value={values.meetingTitle}
              onChange={setValue('meetingTitle')}
              onBlur={onBlur('meetingTitle')}
              error={getError('meetingTitle')}
              placeholder="Ej. Reunión de equipo"
            />
            <p className={styles.hint}>
              Las reuniones no están ligadas a un paciente y no generan cobro.
            </p>
          </>
        ) : (
          <Select
            label="Tipo de cita"
            value={values.serviceTypeId}
            onChange={setValue('serviceTypeId')}
            onBlur={onBlur('serviceTypeId')}
            options={serviceTypeOptions}
            error={getError('serviceTypeId')}
            disabled={isLoading}
          />
        )}

        <button
          type="button"
          className={styles.link}
          onClick={() => goTo(ROUTE_PATHS.appointmentTypes)}
        >
          ¿No aparece el tipo? Crear uno nuevo
          <ArrowRight size={13} />
        </button>

        <Input
          label="Fecha"
          type="date"
          value={values.date}
          onChange={setValue('date')}
          onBlur={onBlur('date')}
          error={getError('date')}
        />

        <div className={styles.row}>
          <Input
            label="Hora de inicio"
            type="time"
            value={values.startTime}
            onChange={setValue('startTime')}
            onBlur={onBlur('startTime')}
            error={getError('startTime')}
          />
          <Input
            label="Hora de fin"
            type="time"
            value={values.endTime}
            onChange={setValue('endTime')}
            onBlur={onBlur('endTime')}
            error={getError('endTime')}
          />
        </div>

        {mode === 'edit' ? (
          <Select
            label="Estado de pago"
            value={values.status}
            onChange={setValue('status')}
            onBlur={onBlur('status')}
            options={APPOINTMENT_STATUS_OPTIONS}
            disabled={isLoading}
          />
        ) : null}

        <div className={styles.actions}>
          <Button type="button" variant="ghost" onClick={close}>
            Cancelar
          </Button>
          <Button type="submit" disabled={!isValid || isSaving || isLoading}>
            {isSaving ? 'Guardando…' : isEdit ? 'Guardar cambios' : 'Registrar cita'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}