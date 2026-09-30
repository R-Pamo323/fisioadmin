import { AuthCard } from '../../../shared/presentation/components/AuthCard'
import { RegisterForm } from '../components/RegisterForm'

export function Register() {
  return (
    <AuthCard
      title="Crear cuenta"
      subtitle="Registra los datos del nuevo acceso a tu centro clínico."
    >
      <RegisterForm />
    </AuthCard>
  )
}
