import { History, Mail, Pencil, Phone, Trash2 } from 'lucide-react'
import { Avatar, Badge, DropdownMenu } from '../../../../shared/components'
import { colors } from '../../../../core/theme/colors'
import type { Patient } from '../../domain/entities/Patient'
import {
  STATUS_META,
  formatRelativeVisit,
  formatVisitDate,
} from './patientMeta'
import styles from './PatientList.module.css'

interface PatientListProps {
  patients: Patient[]
  onEdit: (patient: Patient) => void
  onDelete: (patient: Patient) => void
  onShowHistory: (patient: Patient) => void
}

export function PatientList({
  patients,
  onEdit,
  onDelete,
  onShowHistory,
}: PatientListProps) {
  return (
    <div className={styles.wrapper}>
      <div className={styles.head} role="row">
        <span className={styles.headCell}>Paciente</span>
        <span className={styles.headCell}>Edad</span>
        <span className={styles.headCell}>Contacto</span>
        <span className={styles.headCell}>Tratamiento actual</span>
        <span className={styles.headCell}>Última visita</span>
        <span className={styles.headCell}>Estado</span>
        <span className={styles.headCell} />
      </div>

      {patients.map((patient) => {
        const status = STATUS_META[patient.status]

        return (
          <div key={patient.id} className={styles.row}>
            <div className={styles.cell} data-label="Paciente">
              <div className={styles.patient}>
                <Avatar name={patient.name} size={40} />
                <div className={styles.patientText}>
                  <strong className={styles.patientName}>{patient.name}</strong>
                  <span className={styles.patientDiagnosis}>{patient.diagnosis}</span>
                </div>
              </div>
            </div>

            <div className={styles.cell} data-label="Edad">
              <span className={styles.age}>
                <strong>{patient.age}</strong> años
              </span>
            </div>

            <div className={styles.cell} data-label="Contacto">
              <span className={styles.contact}>
                <span className={styles.contactLine}>
                  <Mail size={14} className={styles.contactIcon} />
                  <span className={styles.contactValue}>{patient.email}</span>
                </span>
                <span className={styles.contactLine}>
                  <Phone size={14} className={styles.contactIcon} />
                  <span className={styles.contactValue}>{patient.phone}</span>
                </span>
              </span>
            </div>

            <div className={styles.cell} data-label="Tratamiento actual">
              <button
                type="button"
                className={styles.treatment}
                style={{ color: colors.primary }}
                onClick={() => onShowHistory(patient)}
              >
                {patient.treatment}
              </button>
            </div>

            <div className={styles.cell} data-label="Última visita">
              <span className={styles.visit}>
                <strong className={styles.visitDate}>
                  {formatVisitDate(patient.lastVisitAt)}
                </strong>
                <span className={styles.visitRelative}>
                  {formatRelativeVisit(patient.lastVisitAt)}
                </span>
              </span>
            </div>

            <div className={styles.cell} data-label="Estado">
              <Badge tone={status.tone}>{status.label}</Badge>
            </div>

            <div className={`${styles.cell} ${styles.actions}`}>
              <DropdownMenu
                ariaLabel={`Acciones de ${patient.name}`}
                items={[
                  {
                    label: 'Ver historial',
                    icon: <History size={15} />,
                    onSelect: () => onShowHistory(patient),
                  },
                  {
                    label: 'Editar',
                    icon: <Pencil size={15} />,
                    onSelect: () => onEdit(patient),
                  },
                  {
                    label: 'Eliminar',
                    icon: <Trash2 size={15} />,
                    onSelect: () => onDelete(patient),
                    tone: 'danger',
                  },
                ]}
              />
            </div>
          </div>
        )
      })}
    </div>
  )
}