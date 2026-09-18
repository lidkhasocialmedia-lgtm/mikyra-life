import { createClient, type SupabaseClient } from '@supabase/supabase-js'

/**
 * Clientes de Supabase (anon + service role).
 *
 * FILOSOFÍA "FUNCIONA SIN CLAVES": si las variables de entorno no están
 * definidas, devolvemos null en lugar de romper el build. Las páginas
 * detectan null y usan los datos de seed (modo demo).
 */

const url = process.env.NEXT_PUBLIC_SUPABASE_URL
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

/** Solo considera válidas URLs https que pasen el constructor URL (evita '' o placeholders) */
function urlValida(candidata?: string): boolean {
  if (!candidata) return false
  try {
    const u = new URL(candidata)
    return u.protocol === 'https:' || u.protocol === 'http:'
  } catch {
    return false
  }
}

export function haySupabase(): boolean {
  return urlValida(url) && Boolean(anonKey)
}

let clienteAnon: SupabaseClient | null = null
let clienteAdmin: SupabaseClient | null = null

/** Cliente público (respeta RLS) - usar en Server Components de lectura */
export function getSupabase(): SupabaseClient | null {
  if (!haySupabase()) return null
  if (!clienteAnon) {
    clienteAnon = createClient(url!.trim(), anonKey!.trim(), {
      auth: { persistSession: false, autoRefreshToken: false },
    })
  }
  return clienteAnon
}

/** Cliente administrativo (service role) - SOLO server-side, nunca en client components */
export function getSupabaseAdmin(): SupabaseClient | null {
  if (!urlValida(url) || !serviceKey) return null
  if (!clienteAdmin) {
    clienteAdmin = createClient(url!.trim(), serviceKey.trim(), {
      auth: { persistSession: false, autoRefreshToken: false },
    })
  }
  return clienteAdmin
}
