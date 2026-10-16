import { useEffect, useState } from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { supabase } from '../../shared/lib/supabase'
import { ROUTE_PATHS } from './paths'

/*
 * Puerta de las rutas privadas. Sin sesión de Supabase no se entra: se redirige
 * al login. La sesión se persiste y se refresca sola (ver shared/lib/supabase).
 * RLS en la base de datos es la segunda barrera: sin token, no hay datos.
 */
export function RequireAuth() {
  const [status, setStatus] = useState<'loading' | 'authenticated' | 'anonymous'>('loading')
  const location = useLocation()

  useEffect(() => {
    let active = true

    void supabase.auth.getSession().then(({ data }) => {
      if (active) setStatus(data.session ? 'authenticated' : 'anonymous')
    })

    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      setStatus(session ? 'authenticated' : 'anonymous')
    })

    return () => {
      active = false
      data.subscription.unsubscribe()
    }
  }, [])

  if (status === 'loading') return null

  if (status === 'anonymous') {
    return <Navigate to={ROUTE_PATHS.login} replace state={{ from: location }} />
  }

  return <Outlet />
}
