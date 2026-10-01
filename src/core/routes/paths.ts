export const ROUTE_PATHS = {
  login: '/login',
  forgotPassword: '/olvide-password',
  register: '/registro',
  calendar: '/calendario',
  patients: '/pacientes',
  statistics: '/estadisticas',
  /** Ruta anterior, conservada solo para redirigir marcadores viejos. */
  legacyStatistics: '/ingresos',
  appointmentTypes: '/tipos-de-citas',
  settings: '/configuracion',
} as const