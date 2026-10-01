import { useNavigate } from 'react-router-dom'
import { ROUTE_PATHS } from '../../../../core/routes/paths'
import { SectionHeader } from '../../../../shared/components'
import { LogoutCard } from '../components/LogoutCard'
import { ProfileCard } from '../components/ProfileCard'
import { useSettingsProfile } from '../hooks/useSettingsProfile'
import styles from './Settings.module.css'

/**
 * Versión mostrada en el pie. Se fija aquí a propósito: `package.json` está en
 * 0.0.0 durante el desarrollo y no refleja la versión de producto.
 */
const APP_VERSION = '2.4.0'

export function Settings() {
  const navigate = useNavigate()
  const { profile, isLoading, isSaving, setProfileField, save } = useSettingsProfile()

  const handleLogout = () => navigate(ROUTE_PATHS.login)

  return (
    <div className={styles.page}>
      <SectionHeader
        title="Configuración"
        subtitle="Administra tus preferencias personales, seguridad y ajustes de la cuenta."
      />

      <div className={styles.layout}>
        {isLoading || !profile ? (
          <p className={styles.loading}>Cargando configuración…</p>
        ) : (
          <>
            <ProfileCard
              profile={profile}
              isSaving={isSaving}
              onFieldChange={setProfileField}
              onSave={() => void save()}
            />

            <LogoutCard onLogout={handleLogout} />
          </>
        )}
      </div>

      <footer className={styles.footer}>
        <span>FisioAdmin v{APP_VERSION}</span>
        <span className={styles.footerDot} aria-hidden="true">
          •
        </span>
        <span>Política de Privacidad</span>
        <span className={styles.footerDot} aria-hidden="true">
          •
        </span>
        <span>Términos de Servicio</span>
      </footer>
    </div>
  )
}