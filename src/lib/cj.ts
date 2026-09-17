/**
 * MIKYRA LIFE - Integración CJ Dropshipping (API v2.0)
 * Docs: https://developers.cjdropshipping.com
 *
 * Flujo: token (dura 1h, cacheado en memoria) -> createOrder -> getOrderDetail
 * Si no hay credenciales, las funciones devuelven un resultado "no configurado"
 * y el webhook deja el pedido en estado "pagado" para procesarlo a mano.
 */

const CJ_BASE_URL = 'https://developers.cjdropshipping.com/api2.0/v1'

export interface PedidoCJ {
  orderNumber: string
  products: Array<{ vid: string; quantity: number }>
  shipping: {
    name: string
    phone: string
    address: string
    city: string
    province: string
    country: string
    zip: string
  }
}

export interface ResultadoCJ {
  ok: boolean
  configurado: boolean
  orderId?: string
  message?: string
  raw?: unknown
}

export function hayCJ(): boolean {
  return Boolean(process.env.CJ_EMAIL && process.env.CJ_PASSWORD)
}

// ---------- Token (cacheado en memoria, se renueva a los 55 min) ----------

let tokenCache: { token: string; expiraEn: number } | null = null

export async function getCJToken(): Promise<string | null> {
  if (!hayCJ()) return null

  if (tokenCache && tokenCache.expiraEn > Date.now()) return tokenCache.token

  const respuesta = await fetch(`${CJ_BASE_URL}/authentication/getAccessToken`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: process.env.CJ_EMAIL,
      password: process.env.CJ_PASSWORD,
    }),
    cache: 'no-store',
  })

  const data = (await respuesta.json()) as {
    code?: number
    message?: string
    data?: { accessToken?: string }
  }

  if (data.code !== 200 || !data.data?.accessToken) {
    throw new Error(`CJ auth falló: ${data.message ?? 'respuesta inesperada'}`)
  }

  tokenCache = { token: data.data.accessToken, expiraEn: Date.now() + 55 * 60 * 1000 }
  return tokenCache.token
}

/** Crear pedido en CJ tras un pago confirmado */
export async function crearPedidoCJ(pedido: PedidoCJ): Promise<ResultadoCJ> {
  if (!hayCJ()) {
    return { ok: false, configurado: false, message: 'CJ no configurado (sin credenciales)' }
  }

  try {
    const token = await getCJToken()

    const respuesta = await fetch(`${CJ_BASE_URL}/shopping/order/createOrder`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'CJ-Access-Token': token ?? '',
        'CJ-API-Key': process.env.CJ_API_KEY ?? '',
      },
      body: JSON.stringify({
        orderNumber: pedido.orderNumber,
        shippingZip: pedido.shipping.zip,
        shippingCountry: pedido.shipping.country,
        shippingProvince: pedido.shipping.province,
        shippingCity: pedido.shipping.city,
        shippingAddress1: pedido.shipping.address,
        shippingName: pedido.shipping.name,
        shippingPhone: pedido.shipping.phone,
        // "CJpacket" suele ser la opción más equilibrada para España;
        // se puede hacer dinámico consultando getShippingMethods.
        shippingMethod: 'CJpacket',
        products: pedido.products.map((p) => ({ vid: p.vid, quantity: p.quantity })),
      }),
      cache: 'no-store',
    })

    const data = (await respuesta.json()) as {
      code?: number
      message?: string
      result?: { orderId?: string; cjOrderNumber?: string }
    }

    if (data.code === 200 && data.result?.orderId) {
      return { ok: true, configurado: true, orderId: data.result.orderId, raw: data.result }
    }

    return { ok: false, configurado: true, message: data.message ?? 'CJ devolvió un error', raw: data }
  } catch (error) {
    return { ok: false, configurado: true, message: error instanceof Error ? error.message : 'Error desconocido' }
  }
}

/** Consultar detalle + tracking de un pedido CJ */
export async function getTrackingCJ(orderId: string): Promise<ResultadoCJ> {
  if (!hayCJ()) {
    return { ok: false, configurado: false, message: 'CJ no configurado' }
  }

  try {
    const token = await getCJToken()

    const respuesta = await fetch(
      `${CJ_BASE_URL}/shopping/order/getOrderDetail?orderId=${encodeURIComponent(orderId)}`,
      { headers: { 'CJ-Access-Token': token ?? '' }, cache: 'no-store' }
    )

    const data = (await respuesta.json()) as {
      code?: number
      message?: string
      result?: {
        orderTrackingNumber?: string | null
        orderTrackingUrl?: string | null
        orderStatus?: number
      }
    }

    if (data.code === 200 && data.result) {
      return {
        ok: true,
        configurado: true,
        orderId: data.result.orderTrackingNumber ?? undefined,
        message: JSON.stringify({
          trackingUrl: data.result.orderTrackingUrl ?? null,
          estadoCJ: data.result.orderStatus,
        }),
        raw: data.result,
      }
    }

    return { ok: false, configurado: true, message: data.message ?? 'Error consultando CJ' }
  } catch (error) {
    return { ok: false, configurado: true, message: error instanceof Error ? error.message : 'Error' }
  }
}
