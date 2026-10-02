import { useEffect, useMemo, useRef, useState } from 'react'
import type { RefObject } from 'react'
import { createPortal } from 'react-dom'
import FullCalendar from '@fullcalendar/react'
import type {
  DatesSetArg,
  DayHeaderContentArg,
  EventClickArg,
  EventInput,
} from '@fullcalendar/core'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import esLocale from '@fullcalendar/core/locales/es'
import { colors } from '../../../../core/theme/colors'
import type { Appointment } from '../../domain/entities/Appointment'
import type { Expense } from '../../domain/entities/Expense'
import { AppointmentTooltip } from './AppointmentTooltip'
import type { TooltipState } from './AppointmentTooltip'
import { ExpenseTooltip } from './ExpenseTooltip'
import type { ExpenseTooltipState } from './ExpenseTooltip'
import { EXPENSE_META, formatExpenseAmount } from './expenseMeta'
import { appointmentStatusMeta } from './appointmentStatusMeta'
import styles from './CalendarView.module.css'

export type CalendarViewType = 'timeGridWeek' | 'timeGridDay'

const DAY_START_MINUTES = 8 * 60
/** La grilla llega hasta las 22:00; el formulario no deja agendar más tarde de las 21:00. */
const DAY_END_MINUTES = 22 * 60

function getNowMinutes(): number {
  const now = new Date()
  return now.getHours() * 60 + now.getMinutes() + now.getSeconds() / 60
}

interface CalendarViewProps {
  calendarRef: RefObject<FullCalendar | null>
  view: CalendarViewType
  onDatesSet: (arg: DatesSetArg) => void
  /** Viene por prop para que las citas creadas en el modal aparezcan al instante. */
  appointments: Appointment[]
  /** Gastos: van en la banda de todo el día, nunca en la grilla de horas. */
  expenses: Expense[]
  onEdit: (appointment: Appointment) => void
  onDelete: (appointment: Appointment) => void
  onEditExpense: (expense: Expense) => void
  onDeleteExpense: (expense: Expense) => void
}

const timeFormat = { hour: '2-digit', minute: '2-digit', hour12: false } as const

function toEventInput(appointment: Appointment): EventInput {
  return {
    id: appointment.id,
    title: appointment.patientName,
    start: appointment.start,
    end: appointment.end,
    extendedProps: {
      kind: 'appointment',
      patientId: appointment.patientId,
      patientName: appointment.patientName,
      appointmentType: appointment.appointmentType,
      description: appointment.description,
      status: appointment.status,
    },
  }
}

/**
 * El gasto se declara como evento de todo el día: FullCalendar lo pinta en la
 * banda superior y por definición no puede solaparse con una cita.
 */
function toExpenseEventInput(expense: Expense): EventInput {
  return {
    id: expense.id,
    title: expense.title,
    start: expense.date,
    allDay: true,
    extendedProps: {
      kind: 'expense',
      title: expense.title,
      description: expense.description,
      time: expense.time,
      amount: expense.amount,
      serviceTypeId: expense.serviceTypeId,
    },
  }
}

const capitalize = (value: string): string =>
  value.charAt(0).toUpperCase() + value.slice(1)

const isSameDay = (a: Date, b: Date): boolean =>
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate()

export function CalendarView({
  calendarRef,
  view,
  onDatesSet,
  appointments,
  expenses,
  onEdit,
  onDelete,
  onEditExpense,
  onDeleteExpense,
}: CalendarViewProps) {
  const [tooltip, setTooltip] = useState<TooltipState | null>(null)
  const [expenseTooltip, setExpenseTooltip] = useState<ExpenseTooltipState | null>(null)
  const wrapperRef = useRef<HTMLDivElement | null>(null)
  const [bodyEl, setBodyEl] = useState<HTMLElement | null>(null)
  const [nowMinutes, setNowMinutes] = useState(getNowMinutes)

  const events = useMemo(
    () => [...appointments.map(toEventInput), ...expenses.map(toExpenseEventInput)],
    [appointments, expenses],
  )

  /** Ningún popover sobrevive a un cambio de fecha o de vista. */
  const closePopovers = () => {
    setTooltip(null)
    setExpenseTooltip(null)
  }

  useEffect(() => {
    const el = wrapperRef.current?.querySelector<HTMLElement>('.fc-timegrid-body') ?? null
    if (el !== bodyEl) setBodyEl(el)
  })

  useEffect(() => {
    if (!bodyEl) return undefined

    setNowMinutes(getNowMinutes())
    const interval = window.setInterval(() => setNowMinutes(getNowMinutes()), 60_000)
    const onResize = () => setNowMinutes(getNowMinutes())
    window.addEventListener('resize', onResize)

    return () => {
      window.clearInterval(interval)
      window.removeEventListener('resize', onResize)
    }
  }, [bodyEl])

  let nowLineTop = 0
  let nowLineLeft = 0
  const showNowLine =
    bodyEl !== null && nowMinutes >= DAY_START_MINUTES && nowMinutes <= DAY_END_MINUTES

  if (bodyEl && showNowLine) {
    const bodyRect = bodyEl.getBoundingClientRect()
    const colEl = bodyEl.querySelector<HTMLElement>('.fc-timegrid-col')
    if (colEl) {
      nowLineLeft = colEl.getBoundingClientRect().left - bodyRect.left
    }
    const ratio = (nowMinutes - DAY_START_MINUTES) / (DAY_END_MINUTES - DAY_START_MINUTES)
    nowLineTop = ratio * bodyEl.offsetHeight
  }

  const handleDatesSet = (arg: DatesSetArg) => {
    closePopovers()
    onDatesSet(arg)
  }

  const handleEventClick = (info: EventClickArg) => {
    // Un solo popover a la vez: se cierra el del otro tipo antes de abrir este.
    closePopovers()
    const props = info.event.extendedProps

    if (props.kind === 'expense') {
      const expense: Expense = {
        id: info.event.id,
        title: props.title,
        description: props.description,
        date: info.event.start ?? new Date(),
        time: props.time,
        amount: props.amount,
        serviceTypeId: props.serviceTypeId,
      }
      setExpenseTooltip({
        expense,
        x: info.jsEvent.clientX,
        y: info.jsEvent.clientY,
      })
      return
    }

    const appointmentProps = props as Omit<Appointment, 'id' | 'start' | 'end'>
    const appointment: Appointment = {
      id: info.event.id,
      patientId: appointmentProps.patientId,
      patientName: appointmentProps.patientName,
      appointmentType: appointmentProps.appointmentType,
      description: appointmentProps.description,
      status: appointmentProps.status,
      start: info.event.start ?? new Date(),
      end: info.event.end ?? new Date(),
    }
    setTooltip({
      appointment,
      x: info.jsEvent.clientX,
      y: info.jsEvent.clientY,
    })
  }

  return (
    <div className={styles.wrapper} ref={wrapperRef}>
      <FullCalendar
        ref={calendarRef}
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        locale={esLocale}
        initialView={view}
        headerToolbar={false}
        firstDay={1}
        allDaySlot
        allDayText="Gastos"
        // FullCalendar acota la banda por su cuenta con un "+N más", así la fila
        // de gastos nunca se come la grilla de horas.
        dayMaxEvents={4}
        slotMinTime="08:00:00"
        slotMaxTime="22:00:00"
        slotDuration="00:30:00"
        slotLabelInterval="01:00:00"
        slotLabelFormat={timeFormat}
        eventTimeFormat={timeFormat}
        height="100%"
        expandRows
        events={events}
        datesSet={handleDatesSet}
        eventClick={handleEventClick}
        dayHeaderContent={(arg: DayHeaderContentArg) => {
          const isToday = isSameDay(arg.date, new Date())
          return (
            <div className={styles.dayHeader}>
              <span className={styles.dayHeaderWeekday}>
                {capitalize(new Intl.DateTimeFormat('es-ES', { weekday: 'short' }).format(arg.date))}
              </span>
              <span
                className={styles.dayHeaderNumber}
                style={
                  isToday
                    ? { background: colors.primary, color: colors.surface }
                    : { color: colors.textPrimary }
                }
              >
                {arg.date.getDate()}
              </span>
            </div>
          )
        }}
        eventContent={(arg) => {
          const props = arg.event.extendedProps

          if (props.kind === 'expense') {
            // Chip de la banda de gastos: título, hora opcional y monto.
            return (
              <div className={styles.expenseChip}>
                <EXPENSE_META.Icon size={12} color={EXPENSE_META.color} />
                <span className={styles.expenseTitle}>{props.title}</span>
                {props.time ? <span className={styles.expenseTime}>{props.time}</span> : null}
                <span className={styles.expenseAmount}>
                  {formatExpenseAmount(props.amount)}
                </span>
              </div>
            )
          }

          const appointmentProps = props as Omit<Appointment, 'id' | 'start' | 'end'>
          const status = appointmentStatusMeta(appointmentProps.status)
          const Icon = status.Icon
          return (
            <div
              className={styles.eventCard}
              style={{
                borderColor: status.color,
                background: status.background,
              }}
            >
              <div className={styles.eventTitle}>
                <Icon size={12} color={status.color} />
                <span>{appointmentProps.patientName}</span>
              </div>
              {arg.timeText ? (
                <span className={styles.eventMeta}>
                  {arg.timeText}
                  {appointmentProps.appointmentType
                    ? ` · ${appointmentProps.appointmentType}`
                    : ''}
                </span>
              ) : null}
            </div>
          )
        }}
      />
      {tooltip ? (
        <AppointmentTooltip
          tooltip={tooltip}
          onClose={closePopovers}
          onEdit={(appointment) => {
            // Se cierra el detalle para que no quede detrás del modal.
            closePopovers()
            onEdit(appointment)
          }}
          onDelete={(appointment) => {
            closePopovers()
            onDelete(appointment)
          }}
        />
      ) : null}
      {expenseTooltip ? (
        <ExpenseTooltip
          tooltip={expenseTooltip}
          onClose={closePopovers}
          onEdit={(expense) => {
            closePopovers()
            onEditExpense(expense)
          }}
          onDelete={(expense) => {
            closePopovers()
            onDeleteExpense(expense)
          }}
        />
      ) : null}
      {bodyEl && showNowLine
        ? createPortal(
            <div className={styles.nowLine} style={{ top: nowLineTop, left: nowLineLeft }} />,
            bodyEl,
          )
        : null}
    </div>
  )
}