import { useEffect, useRef, useState } from 'react'
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
import { CheckCircle2, Clock } from 'lucide-react'
import { colors } from '../../../../core/theme/colors'
import { mockAppointments } from '../../data/datasources/mockAppointments'
import type { Appointment, AppointmentStatus } from '../../domain/entities/Appointment'
import { AppointmentTooltip } from './AppointmentTooltip'
import type { TooltipState } from './AppointmentTooltip'
import styles from './CalendarView.module.css'

export type CalendarViewType = 'timeGridWeek' | 'timeGridDay'

const DAY_START_MINUTES = 8 * 60
const DAY_END_MINUTES = 20 * 60

function getNowMinutes(): number {
  const now = new Date()
  return now.getHours() * 60 + now.getMinutes() + now.getSeconds() / 60
}

interface CalendarViewProps {
  calendarRef: RefObject<FullCalendar | null>
  view: CalendarViewType
  onDatesSet: (arg: DatesSetArg) => void
}

const timeFormat = { hour: '2-digit', minute: '2-digit', hour12: false } as const

const events: EventInput[] = mockAppointments.map((appointment) => ({
  id: appointment.id,
  title: appointment.patientName,
  start: appointment.start,
  end: appointment.end,
  extendedProps: {
    patientName: appointment.patientName,
    appointmentType: appointment.appointmentType,
    status: appointment.status,
    location: appointment.location,
  },
}))

const statusStyle: Record<AppointmentStatus, { color: string; background: string }> = {
  paid: { color: colors.success, background: '#ECFDF5' },
  pending: { color: colors.pendingText, background: '#EFF6FF' },
}

const capitalize = (value: string): string =>
  value.charAt(0).toUpperCase() + value.slice(1)

const isSameDay = (a: Date, b: Date): boolean =>
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate()

export function CalendarView({ calendarRef, view, onDatesSet }: CalendarViewProps) {
  const [tooltip, setTooltip] = useState<TooltipState | null>(null)
  const wrapperRef = useRef<HTMLDivElement | null>(null)
  const [bodyEl, setBodyEl] = useState<HTMLElement | null>(null)
  const [nowMinutes, setNowMinutes] = useState(getNowMinutes)

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
    setTooltip(null)
    onDatesSet(arg)
  }

  const handleEventClick = (info: EventClickArg) => {
    const props = info.event.extendedProps as Omit<Appointment, 'id' | 'start' | 'end'>
    const appointment: Appointment = {
      id: info.event.id,
      patientName: props.patientName,
      appointmentType: props.appointmentType,
      status: props.status,
      location: props.location,
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
        allDaySlot={false}
        slotMinTime="08:00:00"
        slotMaxTime="20:00:00"
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
          const props = arg.event.extendedProps as Omit<Appointment, 'id' | 'start' | 'end'>
          const status = statusStyle[props.status]
          const Icon = props.status === 'paid' ? CheckCircle2 : Clock
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
                <span>{props.patientName}</span>
              </div>
              {arg.timeText ? (
                <span className={styles.eventMeta}>
                  {arg.timeText} · {props.appointmentType}
                </span>
              ) : null}
            </div>
          )
        }}
      />
      {tooltip ? (
        <AppointmentTooltip tooltip={tooltip} onClose={() => setTooltip(null)} />
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