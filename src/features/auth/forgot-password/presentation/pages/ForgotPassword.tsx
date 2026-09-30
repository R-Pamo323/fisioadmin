import { AuthCard } from '../../../shared/presentation/components/AuthCard'
import { ForgotPasswordFlow } from '../components/ForgotPasswordFlow'

export function ForgotPassword() {
  return (
    <AuthCard title="Recuperar contraseña">
      <ForgotPasswordFlow />
    </AuthCard>
  )
}
