import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import FullCalendar from '@fullcalendar/react'
import type { DatesSetArg } from '@fullcalendar/core'
import {
  selectNextAppointment,
  selectTodayAppointments,
  selectWeekPaymentCounts,
} from '../../domain/appointmentSelectors'
import type { Appointment, AppointmentDraft } from '../../domain/entities/Appointment'
import type { Expense, ExpenseDraft } from '../../domain/entities/Expense'
import { CalendarControls } from '../components/CalendarControls'
import { CalendarView } from '../components/CalendarView'
import type { CalendarViewType } from '../components/CalendarView'
import { CalendarOverview } from '../components/CalendarOverview'
import { AppointmentFormModal } from '../components/AppointmentFormModal'
import { DeleteAppointmentModal } from '../components/DeleteAppointmentModal'
import { DeleteExpenseModal } from '../components/DeleteExpenseModal'
import { ExpenseFormModal } from '../components/ExpenseFormModal'
import { useAppointments } from '../hooks/useAppointments'
import { useExpenses } from '../hooks/useExpenses'
import { useAppointmentCatalog } from '../hooks/useAppointmentCatalog'
import { useIsMobile } from '../hooks/useMediaQuery'
import styles from './Calendar.module.css'

const capitalize = (value: string): string =>
  value.charAt(0).toUpperCase() + value.slice(1)

function formatCalendarTitle(start: Date, end: Date): string {
  const monthOf = (date: Date): string =>
    capitalize(new Intl.DateTimeFormat('es-ES', { month: 'long' }).format(date))

  const startYear = start.getFullYear()
  const endYear = end.getFullYear()

  if (start.getMonth() === end.getMonth() && startYear === endYear) {
    return `${monthOf(start)} ${startYear}`
  }
  if (startYear === endYear) {
    return `${monthOf(start)} – ${monthOf(end)} ${startYear}`
  }
  return `${monthOf(start)} ${startYear} – ${monthOf(end)} ${endYear}`
}

export function Calendar() {
  const calendarRef = useRef<FullCalendar | null>(null)
  const isMobile = useIsMobile()
  const [view, setView] = useState<CalendarViewType>(() =>
    isMobile ? 'timeGridDay' : 'timeGridWeek',
  )
  const [title, setTitle] = useState('')
  const firstViewApplied = useRef(false)

  const { appointments, create, update, remove } = useAppointments()
  const { expenses, create: createExpense, update: updateExpense, remove: removeExpense } =
    useExpenses()
  const { patients, serviceTypes, isLoading: isCatalogLoading } = useAppointmentCatalog()

  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState<Appointment | null>(null)
  /** Cambia en cada apertura para reiniciar el estado del formulario. */
  const [formSession, setFormSession] = useState(0)
  const [deleting, setDeleting] = useState<Appointment | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const [expenseFormOpen, setExpenseFormOpen] = useState(false)
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null)
  const [expenseFormSession, setExpenseFormSession] = useState(0)
  const [deletingExpense, setDeletingExpense] = useState<Expense | null>(null)
  const [isDeletingExpense, setIsDeletingExpense] = useState(false)

  useEffect(() => {
    setView(isMobile ? 'timeGridDay' : 'timeGridWeek')
  }, [isMobile])

  useEffect(() => {
    const api = calendarRef.current?.getApi()
    if (!api || !firstViewApplied.current) {
      firstViewApplied.current = true
      return
    }
    const id = window.setTimeout(() => api.changeView(view), 0)
    return () => window.clearTimeout(id)
  }, [view])

  const handleDatesSet = (arg: DatesSetArg) => {
    setTitle(formatCalendarTitle(arg.start, arg.end))
  }

  const openCreate = () => {
    setEditing(null)
    setFormSession((session) => session + 1)
    setFormOpen(true)
  }

  const openEdit = (appointment: Appointment) => {
    setEditing(appointment)
    setFormSession((session) => session + 1)
    setFormOpen(true)
  }

  const closeForm = () => {
    setFormOpen(false)
    setEditing(null)
  }

  const handleSubmit = useCallback(
    async (draft: AppointmentDraft) => {
      if (editing) {
        await update(editing.id, draft)
        return
      }

      const created = await create(draft)
      // Saltar al día de la cita nueva para que el usuario la vea de inmediato.
      calendarRef.current?.getApi().gotoDate(created.start)
    },
    [create, editing, update],
  )

  const handleConfirmDelete = async () => {
    if (!deleting) return

    setIsDeleting(true)
    await remove(deleting.id)
    setIsDeleting(false)
    setDeleting(null)
  }

  const openCreateExpense = () => {
    setEditingExpense(null)
    setExpenseFormSession((session) => session + 1)
    setExpenseFormOpen(true)
  }

  const openEditExpense = (expense: Expense) => {
    setEditingExpense(expense)
    setExpenseFormSession((session) => session + 1)
    setExpenseFormOpen(true)
  }

  const handleSubmitExpense = useCallback(
    async (draft: ExpenseDraft) => {
      if (editingExpense) {
        await updateExpense(editingExpense.id, draft)
        return
      }

      const created = await createExpense(draft)
      // Ir al día del gasto nuevo para que el usuario lo vea de inmediato.
      calendarRef.current?.getApi().gotoDate(created.date)
    },
    [createExpense, editingExpense, updateExpense],
  )

  const handleConfirmDeleteExpense = async () => {
    if (!deletingExpense) return

    setIsDeletingExpense(true)
    await removeExpense(deletingExpense.id)
    setIsDeletingExpense(false)
    setDeletingExpense(null)
  }

  const todayAppointments = useMemo(() => selectTodayAppointments(appointments), [appointments])
  const nextAppointment = useMemo(() => selectNextAppointment(appointments), [appointments])
  const payments = useMemo(() => selectWeekPaymentCounts(appointments), [appointments])
  /** Solo los tipos de cita de gastos sirven para vincular un gasto del catálogo. */
  const expenseServiceTypes = useMemo(
    () => serviceTypes.filter((serviceType) => serviceType.category === 'gastos'),
    [serviceTypes],
  )

  return (
    <div className={styles.page}>
      <CalendarControls
        title={title}
        view={view}
        onPrev={() => calendarRef.current?.getApi().prev()}
        onNext={() => calendarRef.current?.getApi().next()}
        onToday={() => calendarRef.current?.getApi().today()}
        onChangeView={(nextView) => setView(nextView)}
        onNewAppointment={openCreate}
        onNewExpense={openCreateExpense}
      />

      <CalendarView
        calendarRef={calendarRef}
        view={view}
        onDatesSet={handleDatesSet}
        appointments={appointments}
        expenses={expenses}
        onEdit={openEdit}
        onDelete={setDeleting}
        onEditExpense={openEditExpense}
        onDeleteExpense={setDeletingExpense}
      />

      <CalendarOverview
        appointments={todayAppointments}
        next={nextAppointment}
        payments={payments}
      />

      <AppointmentFormModal
        key={formSession}
        open={formOpen}
        appointment={editing}
        patients={patients}
        serviceTypes={serviceTypes}
        isLoading={isCatalogLoading}
        onSubmit={handleSubmit}
        onClose={closeForm}
      />

      <DeleteAppointmentModal
        open={deleting !== null}
        appointment={deleting}
        isDeleting={isDeleting}
        onConfirm={handleConfirmDelete}
        onClose={() => setDeleting(null)}
      />

      <ExpenseFormModal
        key={`expense-${expenseFormSession}`}
        open={expenseFormOpen}
        expense={editingExpense}
        expenseServiceTypes={expenseServiceTypes}
        onSubmit={handleSubmitExpense}
        onClose={() => {
          setExpenseFormOpen(false)
          setEditingExpense(null)
        }}
      />

      <DeleteExpenseModal
        open={deletingExpense !== null}
        expense={deletingExpense}
        isDeleting={isDeletingExpense}
        onConfirm={handleConfirmDeleteExpense}
        onClose={() => setDeletingExpense(null)}
      />
    </div>
  )
}