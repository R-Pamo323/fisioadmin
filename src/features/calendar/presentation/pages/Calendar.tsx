import { useEffect, useRef, useState } from 'react'
import FullCalendar from '@fullcalendar/react'
import type { DatesSetArg } from '@fullcalendar/core'
import { X } from 'lucide-react'
import { Button } from '../../../../shared/components'
import { Modal } from '../../../../shared/components'
import {
  getNextAppointment,
  getTodayAppointments,
  getWeekPayments,
} from '../../data/datasources/mockAppointments'
import { CalendarControls } from '../components/CalendarControls'
import { CalendarView } from '../components/CalendarView'
import type { CalendarViewType } from '../components/CalendarView'
import { CalendarOverview } from '../components/CalendarOverview'
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
  const [newAppointmentOpen, setNewAppointmentOpen] = useState(false)
  const firstViewApplied = useRef(false)

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

  const todayAppointments = getTodayAppointments()
  const nextAppointment = getNextAppointment()
  const payments = getWeekPayments()

  return (
    <div className={styles.page}>
      <CalendarControls
        title={title}
        view={view}
        onPrev={() => calendarRef.current?.getApi().prev()}
        onNext={() => calendarRef.current?.getApi().next()}
        onToday={() => calendarRef.current?.getApi().today()}
        onChangeView={(nextView) => setView(nextView)}
        onNewAppointment={() => setNewAppointmentOpen(true)}
      />

      <CalendarView calendarRef={calendarRef} view={view} onDatesSet={handleDatesSet} />

      <CalendarOverview
        appointments={todayAppointments}
        next={nextAppointment}
        payments={payments}
      />

      <Modal
        open={newAppointmentOpen}
        onRequestClose={() => setNewAppointmentOpen(false)}
      >
        <div className={styles.modalHeader}>
          <h3 className={styles.modalTitle}>Nueva cita</h3>
          <button
            className={styles.modalClose}
            onClick={() => setNewAppointmentOpen(false)}
            aria-label="Cerrar"
          >
            <X size={18} />
          </button>
        </div>
        <p className={styles.modalText}>
          El formulario para registrar citas estará disponible próximamente.
        </p>
        <Button fullWidth onClick={() => setNewAppointmentOpen(false)}>
          Entendido
        </Button>
      </Modal>
    </div>
  )
}