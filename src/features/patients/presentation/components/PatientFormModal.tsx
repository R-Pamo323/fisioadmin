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
import type { Patient, PatientDraft } from '../../domain/entities/Patient'
import { usePatientForm } from '../hooks/usePatientForm'
import { GENDER_OPTIONS, STATUS_OPTIONS } from './patientMeta'
import styles from './PatientFormModal.module.css'

interface PatientFormModalProps {
  open: boolean
  /** Paciente en edición; null cuando se crea uno nuevo. */
  patient: Patient | null
  onSubmit: (draft: PatientDraft) => Promise<void>
  onClose: () => void
}

export function PatientFormModal({
  open,
  patient,
  onSubmit,
  onClose,
}: PatientFormModalProps) {
  const isEdit = patient !== null

  const { values, isValid, isSaving, setValue, onBlur, getError, handleSubmit } =
    usePatientForm({ patient, onSubmit, onDone: onClose })

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
            {isEdit ? 'Editar Paciente' : 'Nuevo Paciente'}
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
          label="Nombre"
          placeholder="Ej. Carlos Ruiz"
          value={values.name}
          onChange={setValue('name')}
          onBlur={onBlur('name')}
          error={getError('name')}
        />

        <div className={styles.row}>
          <Input
            label="Edad"
            type="number"
            min={0}
            max={120}
            placeholder="34"
            value={values.age}
            onChange={setValue('age')}
            onBlur={onBlur('age')}
            error={getError('age')}
          />

          <Select
            label="Género"
            value={values.gender}
            onChange={setValue('gender')}
            options={GENDER_OPTIONS}
          />
        </div>

        <Input
          label="Correo"
          type="email"
          placeholder="correo@ejemplo.com"
          value={values.email}
          onChange={setValue('email')}
          onBlur={onBlur('email')}
          error={getError('email')}
        />

        <Input
          label="Teléfono"
          type="tel"
          placeholder="987 654 321"
          value={values.phone}
          onChange={setValue('phone')}
          onBlur={onBlur('phone')}
          error={getError('phone')}
        />

        <Textarea
          label="Diagnóstico / descripción breve"
          placeholder="Ej. Lumbalgia crónica con discopatía L4-L5"
          rows={3}
          value={values.diagnosis}
          onChange={setValue('diagnosis')}
        />

        <Input
          label="Tratamiento actual"
          placeholder="Ej. Terapia manual + ejercicios de Jessfield"
          value={values.treatment}
          onChange={setValue('treatment')}
          onBlur={onBlur('treatment')}
          error={getError('treatment')}
        />

        <Select
          label="Estado"
          value={values.status}
          onChange={setValue('status')}
          options={STATUS_OPTIONS}
        />

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