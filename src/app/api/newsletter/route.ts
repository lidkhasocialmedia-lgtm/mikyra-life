import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase'
import { esquemaNewsletter } from '@/lib/validation'
import type { ApiResponse } from '@/types'

export const runtime = 'nodejs'

/**
 * POST /api/newsletter { email, fuente? }
 * Upsert en la tabla suscriptores. En modo demo (sin BD) responde ok sin persistir,
 * para que el frontend no muestre errores falsos durante el desarrollo.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const parseo = esquemaNewsletter.safeParse(body)
    if (!parseo.success) {
      return NextResponse.json<ApiResponse>({ ok: false, error: parseo.error.issues[0]?.message ?? 'Email inválido' }, { status: 400 })
    }

    const supabase = getSupabaseAdmin()
    if (supabase) {
      const { error } = await supabase.from('suscriptores').upsert(
        { email: parseo.data.email, fuente: parseo.data.fuente ?? 'web', activo: true },
        { onConflict: 'email' }
      )
      if (error) {
        console.error('[newsletter] error supabase:', error.message)
        return NextResponse.json<ApiResponse>({ ok: false, error: 'No pudimos guardarte' }, { status: 500 })
      }
    } else {
      console.warn('[newsletter] modo demo: suscriptor no persistido:', parseo.data.email)
    }

    return NextResponse.json<ApiResponse>({ ok: true })
  } catch (error) {
    console.error('[newsletter]', error)
    return NextResponse.json<ApiResponse>({ ok: false, error: 'Error inesperado' }, { status: 500 })
  }
}
