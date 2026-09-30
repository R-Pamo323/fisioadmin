import { useState } from 'react'
import { Download, Plus, SearchX, Users } from 'lucide-react'
import { Button, Card, SectionHeader } from '../../../../shared/components'
import { colors } from '../../../../core/theme/colors'
import type { Patient, PatientDraft } from '../../domain/entities/Patient'
import { DataProtectionNotice } from '../components/DataProtectionNotice'
import { DemographicSummary } from '../components/DemographicSummary'
import { PatientDetailsModal } from '../components/PatientDetailsModal'
import { PatientFilters } from '../components/PatientFilters'
import { PatientFormModal } from '../components/PatientFormModal'
import { PatientList } from '../components/PatientList'
import { usePatients } from '../hooks/usePatients'
import styles from './Patients.module.css'

export function Patients() {
  const {
    patients,
    visiblePatients,
    statusCounts,
    total,
    isLoading,
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
    create,
    update,
    remove,
  } = usePatients()

  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState<Patient | null>(null)
  const [details, setDetails] = useState<Patient | null>(null)
  /** Cambia en cada apertura para reiniciar el estado del formulario. */
  const [formSession, setFormSession] = useState(0)

  const openCreate = () => {
    setEditing(null)
    setFormSession((session) => session + 1)
    setFormOpen(true)
  }

  const openEdit = (patient: Patient) => {
    setEditing(patient)
    setFormSession((session) => session + 1)
    setFormOpen(true)
  }

  const closeForm = () => {
    setFormOpen(false)
    setEditing(null)
  }

  const handleSubmit = async (draft: PatientDraft) => {
    if (editing) {
      await update(editing.id, draft)
      return
    }

    await create(draft)
  }

  const handleDelete = (patient: Patient) => {
    void remove(patient.id)
  }

  const hasFilters = search.trim() !== '' || statusFilter !== 'todos'

  return (
    <div className={styles.page}>
      <SectionHeader
        title="Gestión de Pacientes"
        subtitle="Administra la base de datos de tu clínica. Visualiza historias clínicas, tratamientos activos y datos de contacto."
        actions={
          <>
            <Button variant="secondary">
              <Download size={16} />
              Exportar CSV
            </Button>
            <Button onClick={openCreate}>
              <Plus size={16} />
              Agregar Paciente
            </Button>
          </>
        }
      />

      <PatientFilters
        search={search}
        onSearchChange={setSearch}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        statusCounts={statusCounts}
        total={total}
      />

      <Card className={styles.tableCard}>
        {isLoading ? (
          <p className={styles.loading} style={{ color: colors.textSecondary }}>
            Cargando pacientes...
          </p>
        ) : visiblePatients.length === 0 ? (
          <div className={styles.emptyState}>
            <span className={styles.emptyIcon} style={{ color: colors.textSecondary }}>
              {hasFilters ? <SearchX size={22} /> : <Users size={22} />}
            </span>
            <strong className={styles.emptyTitle}>
              {hasFilters ? 'Sin resultados' : 'Todavía no hay pacientes'}
            </strong>
            <span className={styles.emptyText}>
              {hasFilters
                ? 'Ningún paciente coincide con los filtros aplicados.'
                : 'Usa “Agregar Paciente” para registrar el primero de tu clínica.'}
            </span>
          </div>
        ) : (
          <div className={styles.tableScroll}>
            <PatientList
              patients={visiblePatients}
              onEdit={openEdit}
              onDelete={handleDelete}
              onShowHistory={setDetails}
            />
          </div>
        )}
      </Card>

      <DemographicSummary patients={patients} />

      <DataProtectionNotice />

      <footer className={styles.footer}>
        FisioAdmin v2.4.0 • Sistema de Gestión Clínica para Fisioterapeutas • 2024
      </footer>

      <PatientFormModal
        key={formSession}
        open={formOpen}
        patient={editing}
        onSubmit={handleSubmit}
        onClose={closeForm}
      />

      <PatientDetailsModal patient={details} onClose={() => setDetails(null)} />
    </div>
  )
}