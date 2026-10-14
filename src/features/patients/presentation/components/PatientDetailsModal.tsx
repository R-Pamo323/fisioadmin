import { CalendarDays, CheckCircle2, Mail, Phone, Stethoscope, X } from 'lucide-react'
import { Avatar, Badge, Button, Modal } from '../../../../shared/components'
import { colors } from '../../../../core/theme/colors'
import { typography } from '../../../../core/theme/typography'
import { formatAppointmentAmount } from '../../../calendar/presentation/components/appointmentMeta'
import { APPOINTMENT_STATUS_META } from '../../../calendar/presentation/components/appointmentStatusMeta'
import type { PatientView } from './patientTreatment'
import { GENDER_OPTIONS, STATUS_META, formatRelativeVisit, formatVisitDate } from './patientMeta'
import styles from './PatientDetailsModal.module.css'

interface PatientDetailsModalProps {
  patient: PatientView | null
  onClose: () => void
  /** Marca como pagado el tratamiento actual; solo aplica si está pendiente. */
  onMarkAsPaid?: (patient: PatientView) => void
}

export function PatientDetailsModal({
  patient,
  onClose,
  onMarkAsPaid,
}: PatientDetailsModalProps) {
  if (!patient) return null

  const status = STATUS_META[patient.status]
  const sessions = patient.sessions
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
              {patient.lastVisitAt
                ? `Última visita ${formatVisitDate(patient.lastVisitAt)}`
                : 'Sin visitas'}
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
          {patient.treatment ? (
            <p className={styles.treatment} style={{ color: colors.primary }}>
              {patient.treatment}
            </p>
          ) : (
            <p className={styles.diagnosis}>Sin tratamiento asignado.</p>
          )}
        </section>

        <section className={`${styles.section} ${styles.sectionScroll}`}>
          <h4 className={styles.sectionTitle}>
            Historial de sesiones
            {sessions.length > 0 ? (
              <span className={styles.visitCount}>{sessions.length}</span>
            ) : null}
          </h4>

          {sessions.length === 0 ? (
            <p className={styles.emptyHistory}>
              Este paciente todavía no tiene sesiones realizadas.
            </p>
          ) : (
            <ol className={styles.visits}>
              {sessions.map((session) => {
                const payment = APPOINTMENT_STATUS_META[session.status]
                const PaymentIcon = payment.Icon

                return (
                  <li key={session.id} className={styles.visit}>
                    <span className={styles.visitMarker} />
                    <div className={styles.visitBody}>
                      <div className={styles.visitHead}>
                        <strong className={styles.visitService}>{session.service}</strong>
                        <span
                          className={styles.visitPayment}
                          style={{ color: payment.color, background: payment.background }}
                        >
                          <PaymentIcon size={13} />
                          {payment.label}
                          {session.status !== 'no_payment'
                            ? ` · ${formatAppointmentAmount(session.amount)}`
                            : ''}
                        </span>
                      </div>
                      <span className={styles.visitMeta}>
                        <span className={styles.visitDate}>
                          {formatVisitDate(session.date)}
                        </span>
                        <span className={styles.visitRelative}>
                          - {formatRelativeVisit(session.date)}
                        </span>
                      </span>
                      {session.notes ? (
                        <p className={styles.visitNotes}>{session.notes}</p>
                      ) : null}
                    </div>
                  </li>
                )
              })}
            </ol>
          )}
        </section>

        {patient.status === 'pendiente' && onMarkAsPaid ? (
          <Button variant="secondary" fullWidth onClick={() => onMarkAsPaid(patient)}>
            <CheckCircle2 size={16} />
            Marcar como pagado
          </Button>
        ) : null}

        <Button fullWidth onClick={onClose}>
          Cerrar
        </Button>
      </div>
    </Modal>
  )
}