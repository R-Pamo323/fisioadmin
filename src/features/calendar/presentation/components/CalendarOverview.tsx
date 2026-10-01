import { Link } from 'react-router-dom'
import { ArrowRight, CheckCircle2, Clock, MapPin } from 'lucide-react'
import { colors } from '../../../../core/theme/colors'
import { typography } from '../../../../core/theme/typography'
import { ROUTE_PATHS } from '../../../../core/routes/paths'
import type { Appointment } from '../../domain/entities/Appointment'
import styles from './CalendarOverview.module.css'

interface CalendarOverviewProps {
  appointments: Appointment[]
  next: Appointment | null
  payments: { paid: number; pending: number }
}

const formatTime = (date: Date): string =>
  new Intl.DateTimeFormat('es-ES', { hour: '2-digit', minute: '2-digit' }).format(date)

function minutesUntil(start: Date): string {
  const diff = Math.max(0, Math.round((start.getTime() - Date.now()) / 60000))
  if (diff < 60) return `En ${diff} min`
  const hours = Math.floor(diff / 60)
  const minutes = diff % 60
  return minutes > 0 ? `En ${hours} h ${minutes} min` : `En ${hours} h`
}

export function CalendarOverview({ appointments, next, payments }: CalendarOverviewProps) {
  return (
    <div className={styles.grid}>
      <section className={styles.card}>
        <h3 className={styles.cardTitle}>Resumen de hoy</h3>
        {appointments.length === 0 ? (
          <p className={styles.empty}>No hay citas programadas para hoy.</p>
        ) : (
          <ul className={styles.todayList}>
            {appointments.map((appointment) => (
              <li key={appointment.id} className={styles.todayRow}>
                <span className={styles.todayTime}>{formatTime(appointment.start)}</span>
                <div className={styles.todayInfo}>
                  <strong>{appointment.patientName}</strong>
                  <span>{appointment.appointmentType}</span>
                </div>
                <span
                  className={styles.badge}
                  style={
                    appointment.status === 'paid'
                      ? { color: colors.success, background: '#ECFDF5' }
                      : { color: colors.pendingText, background: '#EFF6FF' }
                  }
                >
                  {appointment.status === 'paid' ? 'Pagada' : 'Pendiente'}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section
        className={`${styles.card} ${styles.nextCard}`}
        style={{ borderColor: colors.primary }}
      >
        <h3 className={styles.cardTitle} style={{ color: colors.primary }}>
          Próxima cita
        </h3>
        {next ? (
          <>
            <div className={styles.nextTime}>{formatTime(next.start)}</div>
            <div className={styles.nextInfo}>
              <strong>{next.patientName}</strong>
              <span>{next.appointmentType}</span>
            </div>
            <div className={styles.nextLocation}>
              <MapPin size={14} />
              {next.location}
            </div>
            <span className={styles.nextWhen}>{minutesUntil(next.start)}</span>
          </>
        ) : (
          <p className={styles.empty}>No tienes más citas hoy.</p>
        )}
      </section>

      <section className={styles.card}>
        <h3 className={styles.cardTitle}>Estado de Pagos</h3>
        <p className={styles.cardSubtitle}>Semana actual</p>
        <div className={styles.payments}>
          <div className={styles.paymentRow}>
            <span className={styles.paymentLabel}>
              <CheckCircle2 size={16} color={colors.success} />
              Pagadas
            </span>
            <strong>{payments.paid}</strong>
          </div>
          <div className={styles.paymentRow}>
            <span className={styles.paymentLabel}>
              <Clock size={16} color={colors.pendingText} />
              Pendientes
            </span>
            <strong>{payments.pending}</strong>
          </div>
        </div>
        <Link className={styles.link} to={ROUTE_PATHS.statistics}>
          Ver detalle de estadísticas
          <ArrowRight size={14} />
        </Link>
      </section>

      <section className={styles.card}>
        <h3 className={styles.cardTitle}>Leyenda</h3>
        <div className={styles.legend}>
          <div className={styles.legendItem}>
            <span
              className={styles.legendDot}
              style={{ background: colors.success }}
            />
            <span style={typography.small}>Pagada</span>
          </div>
          <div className={styles.legendItem}>
            <span
              className={styles.legendDot}
              style={{ background: colors.pendingText }}
            />
            <span style={typography.small}>Pendiente</span>
          </div>
        </div>
      </section>
    </div>
  )
}