import { SearchInput, SegmentedControl } from '../../../../shared/components'
import type { SegmentOption } from '../../../../shared/components'
import { colors } from '../../../../core/theme/colors'
import type { PatientStatusFilter } from '../hooks/usePatients'
import styles from './PatientFilters.module.css'

interface PatientFiltersProps {
  search: string
  onSearchChange: (value: string) => void
  statusFilter: PatientStatusFilter
  onStatusFilterChange: (value: PatientStatusFilter) => void
  statusCounts: Record<PatientStatusFilter, number>
  total: number
}

const THIS_MONTH_GROWTH = '+12'

export function PatientFilters({
  search,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  statusCounts,
  total,
}: PatientFiltersProps) {
  const options: SegmentOption[] = [
    { value: 'todos', label: 'Todos', count: statusCounts.todos },
    { value: 'activo', label: 'Activos', count: statusCounts.activo },
    { value: 'pendiente', label: 'Pendientes', count: statusCounts.pendiente },
  ]

  return (
    <div className={styles.bar}>
      <div className={styles.search}>
        <SearchInput
          value={search}
          onChange={onSearchChange}
          placeholder="Buscar por nombre, apellido o correo..."
          ariaLabel="Buscar pacientes"
        />
      </div>

      <div className={styles.filters}>
        <SegmentedControl
          options={options}
          value={statusFilter}
          onChange={(value) => onStatusFilterChange(value as PatientStatusFilter)}
          ariaLabel="Filtrar pacientes por estado"
        />
      </div>

      <div className={styles.metrics}>
        <span className={styles.metric}>
          <span className={styles.metricLabel} style={{ color: colors.textSecondary }}>
            Total
          </span>
          <strong className={styles.metricValue} style={{ color: colors.textPrimary }}>
            {total}
          </strong>
        </span>

        <span className={styles.metricDivider} />

        <span className={styles.metric}>
          <span className={styles.metricLabel} style={{ color: colors.textSecondary }}>
            Este mes
          </span>
          <strong className={styles.metricValue} style={{ color: colors.success }}>
            {THIS_MONTH_GROWTH}
          </strong>
        </span>
      </div>
    </div>
  )
}