import { supabase } from './supabase'

/**
 * Cierra la sesión en Supabase. `RequireAuth` reacciona al cambio de sesión y
 * expulsa al usuario de las rutas privadas.
 */
export async function signOut(): Promise<void> {
  await supabase.auth.signOut()
}
