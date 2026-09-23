import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { Login } from '../../features/auth/presentation/pages/Login'
import { ForgotPassword } from '../../features/auth/presentation/pages/ForgotPassword'
import { Register } from '../../features/auth/presentation/pages/Register'
import { ROUTE_PATHS } from './paths'

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={ROUTE_PATHS.login} element={<Login />} />
        <Route path={ROUTE_PATHS.forgotPassword} element={<ForgotPassword />} />
        <Route path={ROUTE_PATHS.register} element={<Register />} />
        <Route path="*" element={<Navigate to={ROUTE_PATHS.login} replace />} />
      </Routes>
    </BrowserRouter>
  )
}