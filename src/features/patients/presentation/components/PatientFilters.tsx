import { SearchInput, SegmentedControl } from '../../../../shared/components'
import type { SegmentOption } from '../../../../shared/components'
import type { PatientStatusFilter } from '../hooks/usePatients'
import styles from './PatientFilters.module.css'

interface PatientFiltersProps {
  search: string
  onSearchChange: (value: string) => void
  statusFilter: PatientStatusFilter
  onStatusFilterChange: (value: PatientStatusFilter) => void
  statusCounts: Record<PatientStatusFilter, number>
}

export function PatientFilters({
  search,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  statusCounts,
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
    </div>
  )
}