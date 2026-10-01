import type {
  MetricCard,
  PaymentBucket,
  RevenuePoint,
  ShareSlice,
  StatisticsOverview,
  Transaction,
} from '../../domain/entities/Statistics'

const METRICS: MetricCard[] = [
  {
    id: 'total-revenue',
    label: 'Ingresos Totales',
    value: '$12,450.00',
    caption: 'VS. MES ANTERIOR',
    trend: { percent: 12.4, direction: 'up' },
  },
  {
    id: 'completed-appointments',
    label: 'Citas Completadas',
    value: '148',
    caption: 'ESTE MES',
    trend: { percent: 8.1, direction: 'up' },
  },
  {
    id: 'patients',
    label: 'Pacientes',
    value: '48',
    caption: 'NÚMERO PACIENTES',
  },
  {
    id: 'pending-collection',
    label: 'Pendiente de Cobro',
    value: '$1,205.00',
    caption: 'POR GESTIONAR',
    badge: { label: '12 facturas', tone: 'info' },
  },
]

/** Ene-Dic. Dic cuadra con el total de la métrica principal y con los pagos. */
const MONTHLY: RevenuePoint[] = [
  { label: 'Ene', ingresos: 8900, gastos: 5200 },
  { label: 'Feb', ingresos: 9640, gastos: 5480 },
  { label: 'Mar', ingresos: 10310, gastos: 5910 },
  { label: 'Abr', ingresos: 11020, gastos: 6240 },
  { label: 'May', ingresos: 11580, gastos: 6510 },
  { label: 'Jun', ingresos: 11940, gastos: 6740 },
  { label: 'Jul', ingresos: 12010, gastos: 6790 },
  { label: 'Ago', ingresos: 12140, gastos: 6820 },
  { label: 'Sep', ingresos: 12230, gastos: 6850 },
  { label: 'Oct', ingresos: 12310, gastos: 6865 },
  { label: 'Nov', ingresos: 12380, gastos: 6875 },
  { label: 'Dic', ingresos: 12450, gastos: 6880 },
]

const APPOINTMENT_SHARE: ShareSlice[] = [
  { id: 'terapia-fisica', name: 'Terapia Física', percent: 45, color: '#0EA5E9' },
  { id: 'rehabilitacion-lumbar', name: 'Rehabilitación Lumbar', percent: 25, color: '#6366F1' },
  { id: 'masaje-deportivo', name: 'Masaje Deportivo', percent: 20, color: '#F59E0B' },
  { id: 'pilates-clinico', name: 'Pilates Clínico', percent: 10, color: '#10B981' },
]

/** De la más reciente a la más antigua. El card muestra las 5 primeras. */
const TRANSACTIONS: Transaction[] = [
  {
    id: 'tx-1',
    patient: 'Laura Martínez',
    appointmentType: 'Terapia Física',
    date: '2026-07-14',
    amount: 320,
    status: 'pagado',
  },
  {
    id: 'tx-2',
    patient: 'Carlos Ruiz',
    appointmentType: 'Rehabilitación Lumbar',
    date: '2026-07-13',
    amount: 480,
    status: 'pagado',
  },
  {
    id: 'tx-3',
    patient: 'Elena Gómez',
    appointmentType: 'Masaje Deportivo',
    date: '2026-07-11',
    amount: 260,
    status: 'pendiente',
  },
  {
    id: 'tx-4',
    patient: 'Roberto Díaz',
    appointmentType: 'Terapia Física',
    date: '2026-07-09',
    amount: 340,
    status: 'vencido',
  },
  {
    id: 'tx-5',
    patient: 'Ana Belén',
    appointmentType: 'Pilates Clínico',
    date: '2026-07-07',
    amount: 210,
    status: 'pagado',
  },
  {
    id: 'tx-6',
    patient: 'Sofía Ramírez',
    appointmentType: 'Evaluación Física',
    date: '2026-07-05',
    amount: 290,
    status: 'pagado',
  },
  {
    id: 'tx-7',
    patient: 'Miguel Ángel Torres',
    appointmentType: 'Pilates Clínico',
    date: '2026-07-03',
    amount: 225,
    status: 'pendiente',
  },
  {
    id: 'tx-8',
    patient: 'Lucía Fernández',
    appointmentType: 'Masaje Deportivo',
    date: '2026-07-01',
    amount: 275,
    status: 'vencido',
  },
  {
    id: 'tx-9',
    patient: 'Diego Navarro',
    appointmentType: 'Rehabilitación Lumbar',
    date: '2026-06-29',
    amount: 445,
    status: 'pagado',
  },
  {
    id: 'tx-10',
    patient: 'Valentina Ortiz',
    appointmentType: 'Terapia Física',
    date: '2026-06-26',
    amount: 310,
    status: 'pagado',
  },
  {
    id: 'tx-11',
    patient: 'Andrés Molina',
    appointmentType: 'Masaje Deportivo',
    date: '2026-06-24',
    amount: 235,
    status: 'pendiente',
  },
  {
    id: 'tx-12',
    patient: 'Carmen Iglesia',
    appointmentType: 'Pilates Clínico',
    date: '2026-06-21',
    amount: 265,
    status: 'pagado',
  },
  {
    id: 'tx-13',
    patient: 'Javier Sanz',
    appointmentType: 'Evaluación Física',
    date: '2026-06-18',
    amount: 300,
    status: 'vencido',
  },
  {
    id: 'tx-14',
    patient: 'Paula Herrera',
    appointmentType: 'Terapia Física',
    date: '2026-06-16',
    amount: 355,
    status: 'pagado',
  },
]

/** 10,580 + 1,205 + 665 = 12,450: el mismo total de la métrica principal. */
const PAYMENTS: PaymentBucket[] = [
  { id: 'paid', label: 'Pagados', amount: 10580, color: '#10B981' },
  { id: 'pending', label: 'Pendientes', amount: 1205, color: '#3B82F6' },
  { id: 'overdue', label: 'Vencidos', amount: 665, color: '#EF4444' },
]

/** Cuántas filas caben en el card; el modal usa la lista completa. */
const RECENT_TRANSACTIONS_COUNT = 5

export const mockStatistics = {
  getOverview(): StatisticsOverview {
    return {
      metrics: METRICS.map((metric) => ({
        ...metric,
        ...(metric.trend ? { trend: { ...metric.trend } } : {}),
        ...(metric.badge ? { badge: { ...metric.badge } } : {}),
      })),
      monthly: MONTHLY.map((point) => ({ ...point })),
      appointmentShare: APPOINTMENT_SHARE.map((slice) => ({ ...slice })),
      transactions: TRANSACTIONS.slice(0, RECENT_TRANSACTIONS_COUNT).map((transaction) => ({
        ...transaction,
      })),
      payments: PAYMENTS.map((bucket) => ({ ...bucket })),
    }
  },

  getTransactions(): Transaction[] {
    return TRANSACTIONS.map((transaction) => ({ ...transaction }))
  },
}