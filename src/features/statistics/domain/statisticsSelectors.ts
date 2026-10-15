import type { Appointment } from '../../calendar/domain/entities/Appointment'
import type { Expense } from '../../calendar/domain/entities/Expense'
import type { Patient } from '../../patients/domain/entities/Patient'
import type {
  MetricCard,
  PaymentBucket,
  RevenuePoint,
  ShareSlice,
  StatisticsOverview,
  Transaction,
} from './entities/Statistics'
import { formatCurrency } from './statisticsFormat'

/**
 * Selectores puros: reciben los datos ya leídos de sus mocks en vez de leerlos
 * ellos mismos, igual que `appointmentSelectors` en el calendario. Todas las
 * cifras se calculan solo con lo que ya ocurrió (`start`/`date` <= `now`): una
 * cita pagada por adelantado no entra en las estadísticas hasta que llega su día.
 */

/** Cuántas filas caben en el card; el modal usa la lista completa. */
const RECENT_TRANSACTIONS_COUNT = 5

/** Paleta de la distribución; se asigna por volumen (el mayor primero). */
const SHARE_COLORS = ['#0EA5E9', '#6366F1', '#F59E0B', '#10B981', '#8B5CF6', '#EF4444']

const monthFormatter = new Intl.DateTimeFormat('es-ES', { month: 'short' })

function isRealized(date: Date, now: Date): boolean {
  return date.getTime() <= now.getTime()
}

/** Citas de un paciente ya realizadas; excluye reuniones y tareas internas. */
function realizedPatientAppointments(
  appointments: ReadonlyArray<Appointment>,
  now: Date,
): Appointment[] {
  return appointments.filter(
    (appointment) => appointment.patientId !== null && isRealized(appointment.start, now),
  )
}

function sumAmount(appointments: ReadonlyArray<Appointment>): number {
  return appointments.reduce((sum, appointment) => sum + appointment.amount, 0)
}

function monthKey(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
}

function monthLabel(date: Date): string {
  const label = monthFormatter.format(date).replace('.', '')
  return label.charAt(0).toUpperCase() + label.slice(1)
}

/** Identificador estable para las rebanadas del gráfico, a partir del nombre. */
function slugify(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function selectMetrics(
  appointments: ReadonlyArray<Appointment>,
  patients: ReadonlyArray<Patient>,
  now: Date = new Date(),
): MetricCard[] {
  const realized = realizedPatientAppointments(appointments, now)
  const paid = sumAmount(realized.filter((appointment) => appointment.status === 'paid'))
  const pending = realized.filter((appointment) => appointment.status === 'pending')

  return [
    {
      id: 'total-revenue',
      label: 'Ingresos Totales',
      value: formatCurrency(paid),
    },
    {
      id: 'completed-appointments',
      label: 'Citas Completadas',
      value: String(realized.length),
      caption: 'REALIZADAS',
    },
    {
      id: 'patients',
      label: 'Pacientes',
      value: String(patients.length),
      caption: 'NÚMERO PACIENTES',
    },
    {
      id: 'pending-collection',
      label: 'Pendiente de Cobro',
      value: formatCurrency(sumAmount(pending)),
      caption: 'POR GESTIONAR',
      badge: {
        label: `${pending.length} ${pending.length === 1 ? 'factura' : 'facturas'}`,
        tone: 'info',
      },
    },
  ]
}

/** Ingresos (citas pagadas) y gastos por mes, solo de los meses que tienen datos. */
export function selectMonthly(
  appointments: ReadonlyArray<Appointment>,
  expenses: ReadonlyArray<Expense>,
  now: Date = new Date(),
): RevenuePoint[] {
  const buckets = new Map<
    string,
    { order: number; label: string; ingresos: number; gastos: number }
  >()

  const bucketFor = (date: Date) => {
    const key = monthKey(date)
    let bucket = buckets.get(key)

    if (!bucket) {
      const first = new Date(date.getFullYear(), date.getMonth(), 1)
      bucket = { order: first.getTime(), label: monthLabel(first), ingresos: 0, gastos: 0 }
      buckets.set(key, bucket)
    }

    return bucket
  }

  for (const appointment of appointments) {
    if (appointment.status !== 'paid' || !isRealized(appointment.start, now)) continue
    bucketFor(appointment.start).ingresos += appointment.amount
  }

  for (const expense of expenses) {
    if (!isRealized(expense.date, now)) continue
    bucketFor(expense.date).gastos += expense.amount
  }

  return [...buckets.values()]
    .sort((a, b) => a.order - b.order)
    .filter((bucket) => bucket.ingresos > 0 || bucket.gastos > 0)
    .map(({ label, ingresos, gastos }) => ({ label, ingresos, gastos }))
}

/** Reparto de los ingresos ya cobrados por tipo de cita (de mayor a menor). */
export function selectAppointmentShare(
  appointments: ReadonlyArray<Appointment>,
  now: Date = new Date(),
): ShareSlice[] {
  const totals = new Map<string, number>()
  let grandTotal = 0

  for (const appointment of appointments) {
    if (appointment.status !== 'paid' || !isRealized(appointment.start, now)) continue
    if (appointment.amount <= 0) continue

    const name = appointment.appointmentType.trim() || 'Sin tipo'
    totals.set(name, (totals.get(name) ?? 0) + appointment.amount)
    grandTotal += appointment.amount
  }

  if (grandTotal === 0) return []

  const slices = [...totals.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([name, amount], index) => ({
      id: slugify(name),
      name,
      percent: Math.round((amount / grandTotal) * 100),
      color: SHARE_COLORS[index % SHARE_COLORS.length],
    }))

  // El redondeo puede dejar la suma en 99 o 101: el resto lo absorbe la mayor.
  const remainder = 100 - slices.reduce((sum, slice) => sum + slice.percent, 0)
  if (remainder !== 0) slices[0] = { ...slices[0], percent: slices[0].percent + remainder }

  return slices
}

/** Cobrado y pendiente sobre lo ya realizado, para el gráfico de estado de pagos. */
export function selectPaymentBuckets(
  appointments: ReadonlyArray<Appointment>,
  now: Date = new Date(),
): PaymentBucket[] {
  const realized = realizedPatientAppointments(appointments, now)

  return [
    {
      id: 'paid',
      label: 'Pagados',
      amount: sumAmount(realized.filter((appointment) => appointment.status === 'paid')),
      color: '#10B981',
    },
    {
      id: 'pending',
      label: 'Pendientes',
      amount: sumAmount(realized.filter((appointment) => appointment.status === 'pending')),
      color: '#3B82F6',
    },
  ]
}

/** Movimientos con cobro ya realizados, del más reciente al más antiguo. */
export function selectTransactions(
  appointments: ReadonlyArray<Appointment>,
  now: Date = new Date(),
): Transaction[] {
  return realizedPatientAppointments(appointments, now)
    .filter(
      (appointment) => appointment.status === 'paid' || appointment.status === 'pending',
    )
    .sort((a, b) => b.start.getTime() - a.start.getTime())
    .map((appointment) => ({
      id: appointment.id,
      patient: appointment.patientName,
      appointmentType: appointment.appointmentType,
      date: appointment.start.toISOString(),
      amount: appointment.amount,
      status: appointment.status === 'paid' ? 'pagado' : 'pendiente',
    }))
}

export function buildStatisticsOverview(
  appointments: ReadonlyArray<Appointment>,
  patients: ReadonlyArray<Patient>,
  expenses: ReadonlyArray<Expense>,
  now: Date = new Date(),
): StatisticsOverview {
  return {
    metrics: selectMetrics(appointments, patients, now),
    monthly: selectMonthly(appointments, expenses, now),
    appointmentShare: selectAppointmentShare(appointments, now),
    transactions: selectTransactions(appointments, now).slice(0, RECENT_TRANSACTIONS_COUNT),
    payments: selectPaymentBuckets(appointments, now),
  }
}
