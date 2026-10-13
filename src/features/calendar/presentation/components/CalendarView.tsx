import { useEffect, useMemo, useRef, useState } from 'react'
import type { RefObject } from 'react'
import { createPortal } from 'react-dom'
import FullCalendar from '@fullcalendar/react'
import type {
  DatesSetArg,
  DayHeaderContentArg,
  EventClickArg,
  EventInput,
  SlotLabelContentArg,
  SlotLaneContentArg,
} from '@fullcalendar/core'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import esLocale from '@fullcalendar/core/locales/es'
import { colors } from '../../../../core/theme/colors'
import type { Appointment } from '../../domain/entities/Appointment'
import type { Expense } from '../../domain/entities/Expense'
import type { ServiceCategory } from '../../../appointment-types/domain/entities/ServiceType'
import { AppointmentTooltip } from './AppointmentTooltip'
import type { TooltipState } from './AppointmentTooltip'
import { ExpenseTooltip } from './ExpenseTooltip'
import type { ExpenseTooltipState } from './ExpenseTooltip'
import { appointmentCategoryMeta, appointmentEventStyle } from './appointmentCategoryMeta'
import { EXPENSE_META, formatExpenseAmount } from './expenseMeta'
import styles from './CalendarView.module.css'

export type CalendarViewType = 'timeGridWeek' | 'timeGridDay'

const DAY_START_MINUTES = 8 * 60
/**
 * La grilla llega hasta las 23:00. La última hora (22:00–23:00) es la hora
 * "Gastos"; el formulario no deja agendar más tarde de las 21:00.
 */
const DAY_END_MINUTES = 23 * 60
/** Hora del día en la que se pintan los gastos: la última fila de la grilla. */
const EXPENSES_START_HOUR = 22
/** Gastos visibles por día en la hora "Gastos"; el resto se resume en "+N más". */
const MAX_EXPENSE_CHIPS = 3

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
  /** Gastos: se pintan en la hora "Gastos", al final de la grilla. */
  expenses: Expense[]
  /** Nombre del tipo de cita → categoría, para colorear cada evento. */
  serviceCategoryByName: Map<string, ServiceCategory>
  /** Id del tipo de cita → nombre, para mostrar el tipo de cada gasto. */
  serviceTypeNameById: Map<string, string>
  onEdit: (appointment: Appointment) => void
  onDelete: (appointment: Appointment) => void
  onEditExpense: (expense: Expense) => void
  onDeleteExpense: (expense: Expense) => void
}

const timeFormat = { hour: '2-digit', minute: '2-digit', hour12: false } as const

function toEventInput(
  appointment: Appointment,
  serviceCategoryByName: Map<string, ServiceCategory>,
): EventInput {
  const category = appointment.appointmentType
    ? serviceCategoryByName.get(appointment.appointmentType) ?? null
    : null

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
      category,
    },
  }
}

function toDateKey(date: Date): string {
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${date.getFullYear()}-${month}-${day}`
}

function atHour(date: Date, hour: number): Date {
  const result = new Date(date)
  result.setHours(hour, 0, 0, 0)
  return result
}

const isSameDay = (a: Date, b: Date): boolean =>
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate()

/**
 * Los gastos se pintan en la hora "Gastos" (la última de la grilla) y no pueden
 * solaparse con una cita. Se agrupan por día en un solo evento: si hay varios,
 * se apilan como chips en vez de quedar uno al lado del otro como las citas.
 */
function toExpenseEvents(expenses: Expense[]): EventInput[] {
  const byDay = new Map<string, Expense[]>()

  for (const expense of expenses) {
    const key = toDateKey(expense.date)
    const dayExpenses = byDay.get(key)
    if (dayExpenses) dayExpenses.push(expense)
    else byDay.set(key, [expense])
  }

  return [...byDay.entries()].map(([key, dayExpenses]) => {
    const isToday = isSameDay(dayExpenses[0].date, new Date())

    return {
      id: `expenses-${key}`,
      start: atHour(dayExpenses[0].date, EXPENSES_START_HOUR),
      end: atHour(dayExpenses[0].date, EXPENSES_START_HOUR + 1),
      allDay: false,
      // El día de hoy se marca en ámbar para que se distinga del rosado normal.
      classNames: isToday
        ? ['fc-expenses-band', 'fc-expenses-band-today']
        : ['fc-expenses-band'],
      extendedProps: { kind: 'expenses', expenses: dayExpenses },
    }
  })
}

const capitalize = (value: string): string =>
  value.charAt(0).toUpperCase() + value.slice(1)

export function CalendarView({
  calendarRef,
  view,
  onDatesSet,
  appointments,
  expenses,
  serviceCategoryByName,
  serviceTypeNameById,
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
    () => [
      ...appointments.map((appointment) => toEventInput(appointment, serviceCategoryByName)),
      ...toExpenseEvents(expenses),
    ],
    [appointments, expenses, serviceCategoryByName],
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

    if (props.kind === 'expenses') {
      // La hora "Gastos" agrupa varios gastos: el clic lo maneja cada chip.
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
        // Los gastos viven en la última hora de la grilla, no en la banda de
        // "todo el día": así scrollean junto con las horas y quedan al final.
        allDaySlot={false}
        // Las citas no deben cruzarse entre sí; los gastos van en su propia hora.
        // La validación del formulario ya lo impide, esto lo refuerza al pintar.
        eventOverlap={false}
        slotEventOverlap={false}
        slotMinTime="08:00:00"
        slotMaxTime="23:00:00"
        slotDuration="00:30:00"
        slotLabelInterval="01:00:00"
        slotLabelFormat={timeFormat}
        // La última hora es la hora "Gastos": su etiqueta dice "Gastos" y el
        // fondo se tiñe de rosa (semitransparente, para no tapar las divisiones
        // por día ni el amarillo de hoy), con o sin gastos, para que se lea como banda.
        slotLabelContent={(arg: SlotLabelContentArg) =>
          arg.date.getHours() === EXPENSES_START_HOUR ? (
            <span className={styles.expensesAxisLabel}>Gastos</span>
          ) : (
            arg.text
          )
        }
        slotLabelClassNames={(arg: SlotLabelContentArg) =>
          arg.date.getHours() === EXPENSES_START_HOUR ? 'fc-gastos-slot' : ''
        }
        slotLaneClassNames={(arg: SlotLaneContentArg) =>
          arg.date?.getHours() === EXPENSES_START_HOUR ? 'fc-gastos-lane' : ''
        }
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

          if (props.kind === 'expenses') {
            // Hora "Gastos": los del día, apilados. Cada chip abre su detalle.
            const dayExpenses = (props.expenses as Expense[] | undefined) ?? []
            const visible = dayExpenses.slice(0, MAX_EXPENSE_CHIPS)
            const hidden = dayExpenses.length - visible.length

            return (
              <div className={styles.expenseChips}>
                {visible.map((expense) => (
                  <button
                    key={expense.id}
                    type="button"
                    className={styles.expenseChip}
                    onClick={(event) => {
                      event.stopPropagation()
                      closePopovers()
                      setExpenseTooltip({
                        expense,
                        serviceTypeName:
                          serviceTypeNameById.get(expense.serviceTypeId ?? '') ?? null,
                        x: event.clientX,
                        y: event.clientY,
                      })
                    }}
                  >
                    <EXPENSE_META.Icon size={12} color={EXPENSE_META.color} />
                    <span className={styles.expenseTitle}>
                      {serviceTypeNameById.get(expense.serviceTypeId ?? '') ?? 'Gasto'}
                    </span>
                    <span className={styles.expenseAmount}>
                      {formatExpenseAmount(expense.amount)}
                    </span>
                  </button>
                ))}
                {hidden > 0 ? <span className={styles.expenseMore}>+{hidden} más</span> : null}
              </div>
            )
          }

          const appointmentProps = props as Omit<Appointment, 'id' | 'start' | 'end'>
          // El color de un Beneficios refleja su estado de pago (verde pagado,
          // azul pendiente); Gastos y Gratis conservan el de su categoría. Una
          // reunión sin tipo se combina con gratis.
          const category = (props.category ?? null) as ServiceCategory | null
          const meta = appointmentCategoryMeta(category)
          const eventStyle = appointmentEventStyle(category, appointmentProps.status)
          const Icon = meta.Icon
          return (
            <div
              className={styles.eventCard}
              style={{
                borderColor: eventStyle.color,
                background: eventStyle.background,
              }}
            >
              <div className={styles.eventTitle}>
                <Icon size={12} color={eventStyle.color} />
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