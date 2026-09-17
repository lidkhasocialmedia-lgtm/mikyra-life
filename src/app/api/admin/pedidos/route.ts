import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase'
import { crearPedidoCJ, getTrackingCJ } from '@/lib/cj'
import type { ApiResponse, Pedido } from '@/types'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/**
 * API del panel admin (protegida por cookie vía middleware).
 * GET   -> lista pedidos (?estado=pagado&limit=100)
 * PATCH -> { id, estado?, tracking_number?, tracking_url?, notas? }
 * POST  -> { accion: 'enviar-cj', id } empuja un pedido pagado a CJ manualmente
 * PUT   -> { accion: 'sincronizar-tracking', id } pregunta a CJ por el tracking
 */
export async function GET(request: NextRequest) {
  const supabase = getSupabaseAdmin()
  if (!supabase) return NextResponse.json<ApiResponse>({ ok: false, error: 'Supabase no configurado' }, { status: 503 })

  const estado = request.nextUrl.searchParams.get('estado')
  let query = supabase.from('pedidos').select('*').order('created_at', { ascending: false }).limit(100)
  if (estado) query = query.eq('estado', estado)

  const { data, error } = await query
  if (error) return NextResponse.json<ApiResponse>({ ok: false, error: error.message }, { status: 500 })
  return NextResponse.json<ApiResponse<Pedido[]>>({ ok: true, data: (data ?? []) as Pedido[] })
}

export async function PATCH(request: NextRequest) {
  const supabase = getSupabaseAdmin()
  if (!supabase) return NextResponse.json<ApiResponse>({ ok: false, error: 'Supabase no configurado' }, { status: 503 })

  const body = await request.json()
  const { id, ...campos } = body ?? {}
  if (!id) return NextResponse.json<ApiResponse>({ ok: false, error: 'Falta id' }, { status: 400 })

  const permitidos = ['estado', 'tracking_number', 'tracking_url', 'notas', 'cj_order_id'] as const
  const updates: Record<string, unknown> = {}
  for (const clave of permitidos) {
    if (clave in campos) updates[clave] = campos[clave]
  }

  const { data, error } = await supabase.from('pedidos').update(updates).eq('id', id).select().single()
  if (error) return NextResponse.json<ApiResponse>({ ok: false, error: error.message }, { status: 500 })
  return NextResponse.json<ApiResponse>({ ok: true, data })
}

export async function POST(request: NextRequest) {
  const supabase = getSupabaseAdmin()
  if (!supabase) return NextResponse.json<ApiResponse>({ ok: false, error: 'Supabase no configurado' }, { status: 503 })

  const body = await request.json()

  if (body?.accion === 'enviar-cj' && body.id) {
    const { data: pedido } = await supabase.from('pedidos').select('*').eq('id', body.id).single()
    if (!pedido) return NextResponse.json<ApiResponse>({ ok: false, error: 'Pedido no encontrado' }, { status: 404 })

    const lineas = (pedido.items ?? []) as Array<{ cjVariantId: string | null; cantidad: number }>
    if (lineas.some((l) => !l.cjVariantId)) {
      return NextResponse.json<ApiResponse>({ ok: false, error: 'Algún ítem no tiene CJ vid asignado' }, { status: 400 })
    }

    const cj = await crearPedidoCJ({
      orderNumber: pedido.numero_pedido,
      products: lineas.map((l) => ({ vid: l.cjVariantId as string, quantity: l.cantidad })),
      shipping: {
        name: pedido.cliente_nombre ?? pedido.cliente_email,
        phone: pedido.cliente_telefono ?? '000000000',
        address: pedido.direccion_linea1 ?? '',
        city: pedido.ciudad ?? '',
        province: pedido.provincia ?? '',
        country: pedido.pais ?? 'ES',
        zip: pedido.codigo_postal ?? '',
      },
    })

    if (cj.ok && cj.orderId) {
      await supabase.from('pedidos').update({ estado: 'procesando', cj_order_id: cj.orderId }).eq('id', pedido.id)
      return NextResponse.json<ApiResponse>({ ok: true, data: { orderId: cj.orderId } })
    }
    return NextResponse.json<ApiResponse>({ ok: false, error: cj.message ?? 'CJ falló' }, { status: 502 })
  }

  if (body?.accion === 'sincronizar-tracking' && body.id) {
    const { data: pedido } = await supabase.from('pedidos').select('id, cj_order_id').eq('id', body.id).single()
    if (!pedido?.cj_order_id) {
      return NextResponse.json<ApiResponse>({ ok: false, error: 'El pedido aún no existe en CJ' }, { status: 400 })
    }
    const cj = await getTrackingCJ(pedido.cj_order_id)
    if (cj.ok && cj.orderId) {
      let trackingUrl: string | null = null
      try {
        trackingUrl = (JSON.parse(cj.message ?? '{}') as { trackingUrl?: string }).trackingUrl ?? null
      } catch {
        /* message no es JSON */
      }
      await supabase
        .from('pedidos')
        .update({ tracking_number: cj.orderId, tracking_url: trackingUrl, estado: 'enviado' })
        .eq('id', pedido.id)
      return NextResponse.json<ApiResponse>({ ok: true })
    }
    return NextResponse.json<ApiResponse>({ ok: false, error: cj.message ?? 'CJ sin datos' }, { status: 502 })
  }

  return NextResponse.json<ApiResponse>({ ok: false, error: 'Acción no válida' }, { status: 400 })
}
