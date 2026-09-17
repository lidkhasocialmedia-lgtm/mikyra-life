import { NextRequest, NextResponse } from 'next/server'
import type Stripe from 'stripe'
import { getStripe, hayStripe } from '@/lib/stripe'
import { getSupabaseAdmin } from '@/lib/supabase'
import { crearPedidoCJ } from '@/lib/cj'
import { enviarEmailConfirmacion } from '@/lib/resend'

export const runtime = 'nodejs'

/**
 * POST /api/webhook — FASE 4: el corazón de la automatización.
 *
 * checkout.session.completed ->
 *   1. marcar pedido como "pagado"
 *   2. crear pedido en CJ Dropshipping (si tiene vids y CJ configurado)
 *   3. enviar email de confirmación (Resend)
 *   Si algo de 2-3 falla, el pedido queda visible en /admin para acción manual.
 *
 * Configurar en Stripe: https://mikyra.roadshop.online/api/webhook
 * evento checkout.session.completed -> copia whsec_ a STRIPE_WEBHOOK_SECRET
 */
export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = request.headers.get('stripe-signature')

  if (!hayStripe() || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: 'Webhook no configurado' }, { status: 503 })
  }

  let event: Stripe.Event
  try {
    event = getStripe().webhooks.constructEvent(body, signature ?? '', process.env.STRIPE_WEBHOOK_SECRET)
  } catch (error) {
    console.error('[webhook] firma inválida:', error)
    return NextResponse.json({ error: 'Webhook inválido' }, { status: 400 })
  }

  if (event.type !== 'checkout.session.completed') {
    return NextResponse.json({ received: true, ignorado: event.type })
  }

  const session = event.data.object as Stripe.Checkout.Session
  const supabase = getSupabaseAdmin()
  if (!supabase) return NextResponse.json({ received: true, error: 'sin supabase' })

  try {
    // 1. Localizar el pedido por la sesión de Stripe
    const { data: pedido } = await supabase
      .from('pedidos')
      .select('*')
      .eq('stripe_session_id', session.id)
      .maybeSingle()

    if (!pedido) {
      console.error('[webhook] pedido no encontrado para sesión', session.id)
      return NextResponse.json({ received: true, error: 'pedido no encontrado' }, { status: 404 })
    }

    // Idempotencia: si ya pasó de "pendiente", no repetir efectos
    if (pedido.estado !== 'pendiente') {
      return NextResponse.json({ received: true, duplicado: true })
    }

    // 2. Marcar como pagado
    await supabase
      .from('pedidos')
      .update({
        estado: 'pagado',
        stripe_payment_intent: (session.payment_intent as string) ?? null,
      })
      .eq('id', pedido.id)

    // 3. Intentar crear el pedido en CJ Dropshipping
    const lineas = (pedido.items ?? []) as Array<{ slug: string; cjVariantId: string | null; cantidad: number }>
    const conVid = lineas.filter((l) => l.cjVariantId)
    let estadoFinal = 'pagado'

    if (conVid.length === lineas.length && conVid.length > 0) {
      const cj = await crearPedidoCJ({
        orderNumber: pedido.numero_pedido,
        products: conVid.map((l) => ({ vid: l.cjVariantId!, quantity: l.cantidad })),
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
        estadoFinal = 'procesando'
      } else {
        // Queda "pagado" y un admin lo empuja a CJ manualmente desde /admin
        await supabase
          .from('pedidos')
          .update({ notas: `CJ no automatizado: ${cj.message ?? 'sin vids o error'}` })
          .eq('id', pedido.id)
        console.warn('[webhook] CJ sin completar:', cj.message)
      }
    }

    // 4. Email de confirmación al cliente
    const lineasRich = lineas as Array<{ slug: string; nombre?: string; cantidad: number; precio?: number }>
    await enviarEmailConfirmacion({
      to: pedido.cliente_email,
      nombre: pedido.cliente_nombre ?? 'cliente',
      numeroPedido: pedido.numero_pedido,
      items: lineasRich.map((l) => ({ nombre: l.nombre ?? l.slug, cantidad: l.cantidad, precio: Number(l.precio ?? 0) })),
      total: Number(pedido.total),
    })

    console.log(`✅ Pedido ${pedido.numero_pedido} procesado (estado: ${estadoFinal})`)
    return NextResponse.json({ received: true, pedido: pedido.numero_pedido, estado: estadoFinal })
  } catch (error) {
    console.error('[webhook] error procesando pedido:', error)
    // Devolver 500 para que Stripe reintente con backoff
    return NextResponse.json({ error: 'Error interno procesando' }, { status: 500 })
  }
}
