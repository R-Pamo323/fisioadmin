import type { Appointment } from '../../calendar/domain/entities/Appointment'
import type { Expense } from '../../calendar/domain/entities/Expense'
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
 * ellos mismos, igual que `appointmentSelectors` en el calendario. Todo se mide
 * sobre el año elegido y solo con lo que ya ocurrió (`start`/`date` <= `now`):
 * una cita pagada por adelantado no entra hasta que llega su día.
 */

/** Año más antiguo al que puede llegar el selector, aunque no haya datos. */
const MIN_SELECTABLE_YEAR = 2020

/** Paleta de la distribución; se asigna por volumen (el mayor primero). */
const SHARE_COLORS = ['#0EA5E9', '#6366F1', '#F59E0B', '#10B981', '#8B5CF6', '#EF4444']

/** Índices de los 12 meses: el eje del gráfico siempre los muestra todos. */
const MONTH_INDEXES = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]

const monthFormatter = new Intl.DateTimeFormat('es-ES', { month: 'short' })

function isRealized(date: Date, now: Date): boolean {
  return date.getTime() <= now.getTime()
}

/** La fecha pertenece al año elegido y además ya ocurrió. */
function isRealizedIn(date: Date, year: number, now: Date): boolean {
  return date.getFullYear() === year && isRealized(date, now)
}

/** Con `month` nulo no filtra; si no, exige que la fecha caiga en ese mes. */
function isInMonth(date: Date, month: number | null): boolean {
  return month === null || date.getMonth() === month
}

/** Citas de un paciente del año ya realizadas; excluye reuniones y tareas. */
function realizedPatientAppointments(
  appointments: ReadonlyArray<Appointment>,
  year: number,
  now: Date,
): Appointment[] {
  return appointments.filter(
    (appointment) =>
      appointment.patientId !== null && isRealizedIn(appointment.start, year, now),
  )
}

function sumAmount(appointments: ReadonlyArray<Appointment>): number {
  return appointments.reduce((sum, appointment) => sum + appointment.amount, 0)
}

function monthLabel(year: number, month: number): string {
  const label = monthFormatter.format(new Date(year, month, 1)).replace('.', '')
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

/** Años que el selector puede recorrer: de 2020 al año actual, con datos o sin ellos. */
export function selectAvailableYears(now: Date = new Date()): number[] {
  const currentYear = now.getFullYear()
  const minYear = Math.min(MIN_SELECTABLE_YEAR, currentYear)

  const years: number[] = []
  for (let year = minYear; year <= currentYear; year += 1) {
    years.push(year)
  }

  return years
}

export function selectMetrics(
  appointments: ReadonlyArray<Appointment>,
  year: number,
  now: Date = new Date(),
): MetricCard[] {
  const realized = realizedPatientAppointments(appointments, year, now)
  const paid = sumAmount(realized.filter((appointment) => appointment.status === 'paid'))
  const pending = realized.filter((appointment) => appointment.status === 'pending')

  // "Pacientes" es la gente atendida en el año: pacientes distintos con al menos
  // una cita realizada en ese año, sin repetir.
  const attendedPatients = new Set(realized.map((appointment) => appointment.patientId))

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
      value: String(attendedPatients.size),
      caption: 'ATENDIDOS EN EL AÑO',
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

/** Ingresos (citas pagadas) y gastos de cada mes del año; siempre los 12 meses. */
export function selectMonthly(
  appointments: ReadonlyArray<Appointment>,
  expenses: ReadonlyArray<Expense>,
  year: number,
  now: Date = new Date(),
): RevenuePoint[] {
  const points = MONTH_INDEXES.map<RevenuePoint>((month) => ({
    label: monthLabel(year, month),
    ingresos: 0,
    gastos: 0,
  }))

  for (const appointment of appointments) {
    if (appointment.status !== 'paid') continue
    if (!isRealizedIn(appointment.start, year, now)) continue

    points[appointment.start.getMonth()].ingresos += appointment.amount
  }

  for (const expense of expenses) {
    if (!isRealizedIn(expense.date, year, now)) continue

    points[expense.date.getMonth()].gastos += expense.amount
  }

  return points
}

/** Reparto de los ingresos cobrados por tipo de cita (de mayor a menor), en un año o mes. */
export function selectAppointmentShare(
  appointments: ReadonlyArray<Appointment>,
  year: number,
  now: Date = new Date(),
  month: number | null = null,
): ShareSlice[] {
  const totals = new Map<string, number>()
  let grandTotal = 0

  for (const appointment of appointments) {
    if (appointment.status !== 'paid' || !isRealizedIn(appointment.start, year, now)) continue
    if (!isInMonth(appointment.start, month)) continue
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

/** Cobrado y pendiente de un año o mes, para el gráfico de estado de pagos. */
export function selectPaymentBuckets(
  appointments: ReadonlyArray<Appointment>,
  year: number,
  now: Date = new Date(),
  month: number | null = null,
): PaymentBucket[] {
  const realized = realizedPatientAppointments(appointments, year, now).filter((appointment) =>
    isInMonth(appointment.start, month),
  )

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

/** Movimientos con cobro ya realizados, del más reciente al más antiguo, en un año o mes. */
export function selectTransactions(
  appointments: ReadonlyArray<Appointment>,
  year: number,
  now: Date = new Date(),
  month: number | null = null,
): Transaction[] {
  return realizedPatientAppointments(appointments, year, now)
    .filter(
      (appointment) => appointment.status === 'paid' || appointment.status === 'pending',
    )
    .filter((appointment) => isInMonth(appointment.start, month))
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
  expenses: ReadonlyArray<Expense>,
  year: number,
  now: Date = new Date(),
): StatisticsOverview {
  return {
    years: selectAvailableYears(now),
    metrics: selectMetrics(appointments, year, now),
    monthly: selectMonthly(appointments, expenses, year, now),
    appointmentShare: selectAppointmentShare(appointments, year, now),
    appointmentShareByMonth: MONTH_INDEXES.map((month) =>
      selectAppointmentShare(appointments, year, now, month),
    ),
    transactions: selectTransactions(appointments, year, now),
    transactionsByMonth: MONTH_INDEXES.map((month) =>
      selectTransactions(appointments, year, now, month),
    ),
    payments: selectPaymentBuckets(appointments, year, now),
    paymentsByMonth: MONTH_INDEXES.map((month) =>
      selectPaymentBuckets(appointments, year, now, month),
    ),
  }
}
