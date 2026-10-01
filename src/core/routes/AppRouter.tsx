import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { Login } from '../../features/auth/login/presentation/pages/Login'
import { ForgotPassword } from '../../features/auth/forgot-password/presentation/pages/ForgotPassword'
import { Register } from '../../features/auth/register/presentation/pages/Register'
import { Calendar } from '../../features/calendar/presentation/pages/Calendar'
import { Patients } from '../../features/patients/presentation/pages/Patients'
import { Statistics } from '../../features/statistics/presentation/pages/Statistics'
import { AppointmentTypes } from '../../features/appointment-types/presentation/pages/AppointmentTypes'
import { Settings } from '../../features/settings/presentation/pages/Settings'
import { MainLayout } from '../../shared/layouts/MainLayout'
import { ROUTE_PATHS } from './paths'

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={ROUTE_PATHS.login} element={<Login />} />
        <Route path={ROUTE_PATHS.forgotPassword} element={<ForgotPassword />} />
        <Route path={ROUTE_PATHS.register} element={<Register />} />
        <Route element={<MainLayout />}>
          <Route path={ROUTE_PATHS.calendar} element={<Calendar />} />
          <Route path={ROUTE_PATHS.patients} element={<Patients />} />
          <Route
            path={ROUTE_PATHS.legacyStatistics}
            element={<Navigate to={ROUTE_PATHS.statistics} replace />}
          />
          <Route path={ROUTE_PATHS.statistics} element={<Statistics />} />
          <Route path={ROUTE_PATHS.appointmentTypes} element={<AppointmentTypes />} />
          <Route path={ROUTE_PATHS.settings} element={<Settings />} />
        </Route>
        <Route path="*" element={<Navigate to={ROUTE_PATHS.login} replace />} />
      </Routes>
    </BrowserRouter>
  )
}