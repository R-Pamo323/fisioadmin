import { LogOut } from 'lucide-react'
import { Button } from '../../../../shared/components'
import { SettingsCard } from './SettingsCard'

interface LogoutCardProps {
  onLogout: () => void
}

export function LogoutCard({ onLogout }: LogoutCardProps) {
  return (
    <SettingsCard
      tone="danger"
      icon={<LogOut size={20} />}
      title="Cerrar Sesión"
      subtitle="Al cerrar sesión tendrás que volver a iniciar sesión para acceder a FisioAdmin."
    >
      <Button variant="danger" fullWidth onClick={onLogout} style={{ fontSize: 16 }}>
        <LogOut size={16} />
        Salir de FisioAdmin
      </Button>
    </SettingsCard>
  )
}