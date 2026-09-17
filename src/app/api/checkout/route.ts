import { NextRequest, NextResponse } from 'next/server'
import { getStripe, hayStripe } from '@/lib/stripe'
import { getSupabaseAdmin } from '@/lib/supabase'
import { cargarProductoPorSlug } from '@/lib/seed'
import { esquemaCheckout } from '@/lib/validation'
import { calcularEnvio } from '@/lib/utils'
import type { ApiResponse } from '@/types'

export const runtime = 'nodejs'

/**
 * POST /api/checkout
 * 1. Valida formulario + carrito (Zod)
 * 2. RE-PRECIFICA contra el catálogo (nunca confiar en precios del cliente)
 * 3. Crea el pedido en Supabase (estado pendiente)
 * 4. Crea una Stripe Checkout Session y devuelve la URL
 * El webhook (FASE 4) hace el resto: CJ + emails.
 */
export async function POST(request: NextRequest) {
  try {
    const json = await request.json()
    const parseo = esquemaCheckout.safeParse(json)
    if (!parseo.success) {
      return NextResponse.json<ApiResponse>(
        { ok: false, error: parseo.error.issues[0]?.message ?? 'Datos incompletos' },
        { status: 400 }
      )
    }
    const datos = parseo.data

    // ---- Re-calcular precios desde el origen de datos real ----
    const lineas: Array<{
      slug: string
      nombre: string
      precio: number
      cantidad: number
      cjVariantId: string | null
    }> = []

    for (const item of datos.items) {
      const producto = await cargarProductoPorSlug(item.slug)
      if (!producto) {
        return NextResponse.json<ApiResponse>({ ok: false, error: `Producto no disponible: ${item.slug}` }, { status: 400 })
      }
      lineas.push({
        slug: producto.slug,
        nombre: producto.nombre,
        precio: producto.precio,
        cantidad: Math.min(item.cantidad, 10),
        cjVariantId: producto.cjVariantId,
      })
    }

    const subtotal = lineas.reduce((acc, l) => acc + l.precio * l.cantidad, 0)
    const envio = calcularEnvio(subtotal)
    const total = subtotal + envio

    if (subtotal <= 0) {
      return NextResponse.json<ApiResponse>({ ok: false, error: 'Carrito vacío o precios no válidos' }, { status: 400 })
    }

    const supabase = getSupabaseAdmin()
    if (!supabase) {
      // Sin BD no podemos dejar rastro del pedido -> modo demo
      return NextResponse.json<ApiResponse>(
        { ok: false, demo: true, error: 'Supabase no configurado (modo demo). Conecta las claves para cobrar.' },
        { status: 503 }
      )
    }

    // ---- 1. Insertar pedido en pendiente ----
    const { data: pedido, error: errPedido } = await supabase
      .from('pedidos')
      .insert({
        numero_pedido: 'PENDING', // el trigger generar_numero_pedido() lo reemplaza
        items: lineas,
        subtotal,
        envio,
        total,
        cliente_email: datos.email,
        cliente_nombre: datos.nombre,
        cliente_telefono: datos.telefono || null,
        direccion_linea1: datos.direccion,
        direccion_linea2: datos.direccion2 || null,
        ciudad: datos.ciudad,
        codigo_postal: datos.codigoPostal,
        provincia: datos.provincia,
        pais: datos.pais,
        estado: 'pendiente',
        ip_cliente: request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? null,
      })
      .select('id, numero_pedido')
      .single()

    if (errPedido || !pedido) {
      console.error('[checkout] error insertando pedido:', errPedido)
      return NextResponse.json<ApiResponse>({ ok: false, error: 'No pudimos registrar tu pedido. Inténtalo de nuevo.' }, { status: 500 })
    }

    // ---- 2. Stripe Checkout ----
    if (!hayStripe()) {
      // Cancelamos el pedido pendiente para no dejar basura
      await supabase.from('pedidos').update({ estado: 'cancelado', notas: 'stripe no configurado (demo)' }).eq('id', pedido.id)
      return NextResponse.json<ApiResponse>(
        { ok: false, demo: true, error: 'Stripe no configurado (modo demo).' },
        { status: 503 }
      )
    }

    const stripe = getStripe()
    const base = process.env.NEXT_PUBLIC_URL ?? request.nextUrl.origin

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      customer_email: datos.email,
      locale: 'es',
      line_items: lineas.map((l) => ({
        quantity: l.cantidad,
        price_data: {
          currency: 'eur',
          unit_amount: Math.round(l.precio * 100),
          product_data: { name: l.nombre, description: 'MIKYRA LIFE · bloqueadores de luz' },
        },
      })),
      // La dirección de envío se recoge en NUESTRO formulario y viaja al pedido de
      // Supabase (origen de verdad para CJ). Stripe solo cobra: sin shipping_address_collection
      // para no pedir dos veces los mismos datos al cliente.
      metadata: { pedidoId: pedido.id, clienteId: datos.clienteId },
      success_url: `${base}/gracias?pedido=${encodeURIComponent(pedido.numero_pedido)}&estado=pagado`,
      cancel_url: `${base}/checkout?cancelado=1`,
    })

    // ---- 3. Vincular sesión para que el webhook encuentre el pedido ----
    await supabase.from('pedidos').update({ stripe_session_id: session.id }).eq('id', pedido.id)

    return NextResponse.json<ApiResponse<{ url: string }>>({ ok: true, data: { url: session.url! } })
  } catch (error) {
    console.error('[checkout] error inesperado:', error)
    return NextResponse.json<ApiResponse>(
      { ok: false, error: 'Error procesando el checkout. Inténtalo de nuevo.' },
      { status: 500 }
    )
  }
}
