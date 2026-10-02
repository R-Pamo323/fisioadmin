import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { colors } from '../../../../core/theme/colors'
import { typography } from '../../../../core/theme/typography'
import { ROUTE_PATHS } from '../../../../core/routes/paths'
import type { WeekPaymentCounts } from '../../domain/appointmentSelectors'
import type { Appointment } from '../../domain/entities/Appointment'
import {
  APPOINTMENT_STATUS_META,
  APPOINTMENT_STATUS_ORDER,
  appointmentStatusMeta,
} from './appointmentStatusMeta'
import { EXPENSE_META } from './expenseMeta'
import styles from './CalendarOverview.module.css'

/**
 * La leyenda no es solo de estados: el gasto es lo único rojo del calendario,
 * así que se agrega como una entrada más, sin tocar el orden de estados (que
 * usan el selector de pago y la tarjeta de pagos).
 */
const LEGEND_ITEMS = [
  ...APPOINTMENT_STATUS_ORDER.map((status) => ({
    key: status,
    label: APPOINTMENT_STATUS_META[status].label,
    color: APPOINTMENT_STATUS_META[status].color,
  })),
  { key: 'expense', label: EXPENSE_META.label, color: EXPENSE_META.color },
]

interface CalendarOverviewProps {
  appointments: Appointment[]
  next: Appointment | null
  payments: WeekPaymentCounts
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
            {appointments.map((appointment) => {
              const status = appointmentStatusMeta(appointment.status)
              return (
                <li key={appointment.id} className={styles.todayRow}>
                  <span className={styles.todayTime}>{formatTime(appointment.start)}</span>
                  <div className={styles.todayInfo}>
                    <strong>{appointment.patientName}</strong>
                    <span>{appointment.appointmentType || 'Sin tipo de cita'}</span>
                  </div>
                  <span
                    className={styles.badge}
                    style={{ color: status.color, background: status.background }}
                  >
                    {status.label}
                  </span>
                </li>
              )
            })}
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
              <span>{next.appointmentType || 'Sin tipo de cita'}</span>
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
          {APPOINTMENT_STATUS_ORDER.map((statusKey) => {
            const { label, color, Icon } = APPOINTMENT_STATUS_META[statusKey]
            return (
              <div key={statusKey} className={styles.paymentRow}>
                <span className={styles.paymentLabel}>
                  <Icon size={16} color={color} />
                  {statusKey === 'no_payment' ? 'Sin cobro' : `${label}s`}
                </span>
                <strong>{payments[statusKey]}</strong>
              </div>
            )
          })}
        </div>
        <Link className={styles.link} to={ROUTE_PATHS.statistics}>
          Ver detalle de estadísticas
          <ArrowRight size={14} />
        </Link>
      </section>

      <section className={styles.card}>
        <h3 className={styles.cardTitle}>Leyenda</h3>
        <div className={styles.legend}>
          {LEGEND_ITEMS.map((item) => (
            <div key={item.key} className={styles.legendItem}>
              <span className={styles.legendDot} style={{ background: item.color }} />
              <span style={typography.small}>{item.label}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}