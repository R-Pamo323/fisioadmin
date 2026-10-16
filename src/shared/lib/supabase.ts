import { createClient } from '@supabase/supabase-js'

/*
 * Cliente único de Supabase. Las credenciales viven en `.env.local` (ignorado
 * por git). La anon key es pública: quien protege los datos es RLS con la
 * sesión del administrador. La service_role key nunca debe llegar al frontend.
 */
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Faltan VITE_SUPABASE_URL y/o VITE_SUPABASE_ANON_KEY. ' +
      'Cópialas en .env.local (mira .env.example).',
  )
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
})
