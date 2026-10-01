import { CalendarDays, Mail, Phone, Stethoscope, X } from 'lucide-react'
import { Avatar, Badge, Button, Modal } from '../../../../shared/components'
import { colors } from '../../../../core/theme/colors'
import { typography } from '../../../../core/theme/typography'
import type { Patient } from '../../domain/entities/Patient'
import { getVisitHistory } from './patientHistory'
import { GENDER_OPTIONS, STATUS_META, formatRelativeVisit, formatVisitDate } from './patientMeta'
import styles from './PatientDetailsModal.module.css'

interface PatientDetailsModalProps {
  patient: Patient | null
  onClose: () => void
}

export function PatientDetailsModal({ patient, onClose }: PatientDetailsModalProps) {
  if (!patient) return null

  const status = STATUS_META[patient.status]
  const history = getVisitHistory(patient.id)
  const genderLabel =
    GENDER_OPTIONS.find((option) => option.value === patient.gender)?.label ??
    patient.gender

  return (
    <Modal open onRequestClose={onClose} size="lg">
      <div className={styles.content}>
        <header className={styles.header}>
          <h3
            className={styles.title}
            style={{
              color: typography.h2.color,
              fontWeight: typography.h2.fontWeight,
            }}
          >
            Historial del paciente
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
          <Avatar name={patient.name} size={52} />
          <div className={styles.summaryText}>
            <strong className={styles.name}>{patient.name}</strong>
            <span className={styles.meta}>
              {patient.age} años · {genderLabel}
            </span>
            <Badge tone={status.tone}>{status.label}</Badge>
          </div>
        </div>

        <div className={styles.facts}>
          <span className={styles.fact}>
            <Mail size={15} className={styles.factIcon} />
            <span className={styles.factValue}>{patient.email}</span>
          </span>
          <span className={styles.fact}>
            <Phone size={15} className={styles.factIcon} />
            <span className={styles.factValue}>{patient.phone}</span>
          </span>
          <span className={styles.fact}>
            <CalendarDays size={15} className={styles.factIcon} />
            <span className={styles.factValue}>
              Última visita {formatVisitDate(patient.lastVisitAt)}
            </span>
          </span>
        </div>

        <section className={styles.section}>
          <h4 className={styles.sectionTitle}>
            <Stethoscope size={16} className={styles.sectionIcon} />
            Diagnóstico y tratamiento
          </h4>
          {patient.diagnosis ? (
            <p className={styles.diagnosis}>{patient.diagnosis}</p>
          ) : (
            <p className={styles.diagnosis}>Sin diagnóstico registrado.</p>
          )}
          <p className={styles.treatment} style={{ color: colors.primary }}>
            {patient.treatment}
          </p>
        </section>

        <section className={`${styles.section} ${styles.sectionScroll}`}>
          <h4 className={styles.sectionTitle}>
            Historial de visitas
            {history.length > 0 ? (
              <span className={styles.visitCount}>{history.length}</span>
            ) : null}
          </h4>

          {history.length === 0 ? (
            <p className={styles.emptyHistory}>
              Este paciente todavía no tiene visitas registradas.
            </p>
          ) : (
            <ol className={styles.visits}>
              {history.map((visit) => (
                <li key={visit.id} className={styles.visit}>
                  <span className={styles.visitMarker} />
                  <div className={styles.visitBody}>
                    <strong className={styles.visitService}>{visit.service}</strong>
                    <span className={styles.visitMeta}>
                      <span className={styles.visitDate}>
                        {formatVisitDate(visit.date)}
                      </span>
                      <span className={styles.visitRelative}>
                        - {formatRelativeVisit(visit.date)}
                      </span>
                    </span>
                    <p className={styles.visitNotes}>{visit.notes}</p>
                  </div>
                </li>
              ))}
            </ol>
          )}
        </section>

        <Button fullWidth onClick={onClose}>
          Cerrar
        </Button>
      </div>
    </Modal>
  )
}