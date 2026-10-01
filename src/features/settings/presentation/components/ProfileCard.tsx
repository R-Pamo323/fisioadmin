import { useEffect, useState } from 'react'
import type { ChangeEvent, FormEvent } from 'react'
import { CheckCircle2, User } from 'lucide-react'
import { colors } from '../../../../core/theme/colors'
import { Avatar, Button, Input } from '../../../../shared/components'
import { initialsFromName } from '../../../../shared/components/Avatar'
import type { SettingsProfile, SettingsProfileField } from '../../domain/entities/SettingsProfile'
import { PasswordSection } from './PasswordSection'
import { SettingsCard } from './SettingsCard'
import styles from './ProfileCard.module.css'

/** La confirmación se oculta sola para no dejar estado pegado en la pantalla. */
const SAVED_MESSAGE_MS = 2500

interface ProfileCardProps {
  profile: SettingsProfile
  isSaving: boolean
  onFieldChange: (field: SettingsProfileField) => (event: ChangeEvent<HTMLInputElement>) => void
  onSave: () => void
}

export function ProfileCard({
  profile,
  isSaving,
  onFieldChange,
  onSave,
}: ProfileCardProps) {
  const [isSaved, setIsSaved] = useState(false)

  useEffect(() => {
    if (!isSaved) return undefined

    const timer = setTimeout(() => setIsSaved(false), SAVED_MESSAGE_MS)
    return () => clearTimeout(timer)
  }, [isSaved])

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    onSave()
    setIsSaved(true)
  }

  return (
    <SettingsCard
      icon={<User size={20} />}
      title="Perfil del Profesional"
      subtitle="Esta información se muestra en tu perfil y en las citas que agendas."
    >
      <div className={styles.identity}>
        <Avatar name={profile.name} size={72} className={styles.avatar} />

        <div className={styles.identityText}>
          <strong className={styles.identityName}>{profile.name}</strong>
          <span className={styles.identityHint}>
            Iniciales generadas automáticamente: {initialsFromName(profile.name)}
          </span>
        </div>
      </div>

      <form className={styles.form} onSubmit={handleSubmit}>
        <Input
          label="Nombre completo"
          value={profile.name}
          onChange={onFieldChange('name')}
          placeholder="Dr. Juan Pérez"
        />

        <Input
          label="Especialidad"
          value={profile.specialty}
          onChange={onFieldChange('specialty')}
          placeholder="Fisioterapeuta Deportivo"
        />

        <Input
          label="Email de contacto"
          type="email"
          value={profile.email}
          onChange={onFieldChange('email')}
          placeholder="juan.perez@fisioadmin.com"
        />

        <Button type="submit" fullWidth disabled={isSaving} style={{ fontSize: 16 }}>
          {isSaving ? 'Guardando…' : 'Guardar cambios de perfil'}
        </Button>

        {/* Montado condicionalmente: `hidden` + `display: flex` del módulo no
            funciona por especificidad, y role="status" anuncia mejor al insertar. */}
        {isSaved ? (
          <p className={styles.saved} role="status">
            <CheckCircle2 size={16} style={{ color: colors.success }} />
            Perfil actualizado
          </p>
        ) : null}
      </form>

      <PasswordSection />
    </SettingsCard>
  )
}