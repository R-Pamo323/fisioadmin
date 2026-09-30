import { useState } from 'react'
import { Plus, SearchX } from 'lucide-react'
import { Button, SearchInput, SectionHeader } from '../../../../shared/components'
import { colors } from '../../../../core/theme/colors'
import type { ServiceType, ServiceTypeDraft } from '../../domain/entities/ServiceType'
import { AddServiceTypeCard } from '../components/AddServiceTypeCard'
import { PriceUpdateBanner } from '../components/PriceUpdateBanner'
import { ServiceTypeCard } from '../components/ServiceTypeCard'
import { ServiceTypeDetailsModal } from '../components/ServiceTypeDetailsModal'
import { ServiceTypeFormModal } from '../components/ServiceTypeFormModal'
import { useServiceTypes } from '../hooks/useServiceTypes'
import styles from './AppointmentTypes.module.css'

export function AppointmentTypes() {
  const { serviceTypes, isLoading, search, setSearch, create, update, remove } =
    useServiceTypes()

  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState<ServiceType | null>(null)
  const [details, setDetails] = useState<ServiceType | null>(null)
  /** Cambia en cada apertura para reiniciar el estado del formulario. */
  const [formSession, setFormSession] = useState(0)

  const openCreate = () => {
    setEditing(null)
    setFormSession((session) => session + 1)
    setFormOpen(true)
  }

  const openEdit = (service: ServiceType) => {
    setEditing(service)
    setFormSession((session) => session + 1)
    setFormOpen(true)
  }

  const closeForm = () => {
    setFormOpen(false)
    setEditing(null)
  }

  const handleSubmit = async (draft: ServiceTypeDraft) => {
    if (editing) {
      await update(editing.id, draft)
      return
    }

    await create(draft)
  }

  const handleDelete = (service: ServiceType) => {
    void remove(service.id)
  }

  return (
    <div className={styles.page}>
      <SectionHeader
        subtitle="Gestiona los servicios y tarifas ofrecidos en tu clínica."
        actions={
          <>
            <SearchInput
              value={search}
              onChange={setSearch}
              placeholder="Buscar servicios..."
              ariaLabel="Buscar servicios"
            />
            <Button onClick={openCreate}>
              <Plus size={16} />
              Nuevo Servicio
            </Button>
          </>
        }
      />

      <PriceUpdateBanner />

      {isLoading ? (
        <p className={styles.loading} style={{ color: colors.textSecondary }}>
          Cargando servicios...
        </p>
      ) : (
        <>
          <div className={styles.grid}>
            {serviceTypes.map((service) => (
              <ServiceTypeCard
                key={service.id}
                service={service}
                onEdit={openEdit}
                onDelete={handleDelete}
                onShowDetails={setDetails}
              />
            ))}

            <AddServiceTypeCard onClick={openCreate} />
          </div>

          {serviceTypes.length === 0 ? (
            <div className={styles.emptyState}>
              <span className={styles.emptyIcon} style={{ color: colors.textSecondary }}>
                <SearchX size={22} />
              </span>
              <strong className={styles.emptyTitle}>
                {search.trim() === ''
                  ? 'Todavía no hay servicios'
                  : 'Sin resultados'}
              </strong>
              <span className={styles.emptyText}>
                {search.trim() === ''
                  ? 'Usa “Añadir Servicio” para crear el primero de tu clínica.'
                  : `Ningún servicio coincide con “${search.trim()}”.`}
              </span>
            </div>
          ) : null}
        </>
      )}

      <ServiceTypeFormModal
        key={formSession}
        open={formOpen}
        service={editing}
        onSubmit={handleSubmit}
        onClose={closeForm}
      />

      <ServiceTypeDetailsModal service={details} onClose={() => setDetails(null)} />
    </div>
  )
}
