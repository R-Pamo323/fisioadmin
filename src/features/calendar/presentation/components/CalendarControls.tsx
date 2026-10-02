import { ChevronLeft, ChevronRight, Plus, Receipt } from 'lucide-react'
import { Button } from '../../../../shared/components'
import { colors } from '../../../../core/theme/colors'
import type { CalendarViewType } from './CalendarView'
import { EXPENSE_META } from './expenseMeta'
import styles from './CalendarControls.module.css'

interface CalendarControlsProps {
  title: string
  view: CalendarViewType
  onPrev: () => void
  onNext: () => void
  onToday: () => void
  onChangeView: (view: CalendarViewType) => void
  onNewAppointment: () => void
  onNewExpense: () => void
}

export function CalendarControls({
  title,
  view,
  onPrev,
  onNext,
  onToday,
  onChangeView,
  onNewAppointment,
  onNewExpense,
}: CalendarControlsProps) {
  return (
    <div className={styles.toolbar}>
      <div className={styles.left}>
        <button className={styles.navBtn} onClick={onPrev} aria-label="Anterior">
          <ChevronLeft size={18} />
        </button>
        <button className={styles.todayBtn} onClick={onToday}>
          Hoy
        </button>
        <button className={styles.navBtn} onClick={onNext} aria-label="Siguiente">
          <ChevronRight size={18} />
        </button>
        <h2 className={styles.title}>{title}</h2>
      </div>

      <div className={styles.right}>
        <div className={styles.segment}>
          <button
            className={view === 'timeGridDay' ? styles.segmentActive : styles.segmentIdle}
            onClick={() => onChangeView('timeGridDay')}
          >
            Día
          </button>
          <button
            className={view === 'timeGridWeek' ? styles.segmentActive : styles.segmentIdle}
            onClick={() => onChangeView('timeGridWeek')}
          >
            Semana
          </button>
        </div>
        <Button
          variant="secondary"
          className={styles.newExpenseBtn}
          onClick={onNewExpense}
          style={{ color: EXPENSE_META.color, borderColor: EXPENSE_META.color }}
        >
          <Receipt size={16} color={EXPENSE_META.color} />
          Nuevo gasto
        </Button>
        <Button className={styles.newApptBtn} onClick={onNewAppointment}>
          <Plus size={16} style={{ color: colors.surface }} />
          Nueva cita
        </Button>
      </div>
    </div>
  )
}