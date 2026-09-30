import { Card, ProgressBar } from '../../../../shared/components'
import type { DistributionRow } from './patientMeta'
import { AGE_BANDS, buildDistribution } from './patientMeta'
import type { Patient } from '../../domain/entities/Patient'
import styles from './DemographicSummary.module.css'

interface DemographicSummaryProps {
  patients: Patient[]
}

function BandList({ title, rows }: { title: string; rows: DistributionRow[] }) {
  return (
    <div className={styles.group}>
      <h4 className={styles.groupTitle}>{title}</h4>

      <div className={styles.bars}>
        {rows.map((row) => (
          <div key={row.key} className={styles.barRow}>
            <div className={styles.barTop}>
              <span className={styles.barLabel}>{row.label}</span>
              <span className={styles.barValue}>
                {row.percent}%
                <span className={styles.barCount}>
                  {row.count} {row.count === 1 ? 'paciente' : 'pacientes'}
                </span>
              </span>
            </div>

            <ProgressBar
              value={row.percent}
              color={row.color}
              ariaLabel={`${row.label}: ${row.percent}%`}
            />
          </div>
        ))}
      </div>
    </div>
  )
}

export function DemographicSummary({ patients }: DemographicSummaryProps) {
  return (
    <Card className={styles.card}>
      <div className={styles.heading}>
        <h3 className={styles.title}>Resumen Demográfico</h3>
        <p className={styles.subtitle}>
          Distribución de edad de tu base de pacientes.
        </p>
      </div>

      <BandList title="Distribución por edad" rows={buildDistribution(patients, AGE_BANDS)} />
    </Card>
  )
}