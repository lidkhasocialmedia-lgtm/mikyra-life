import { Resend } from 'resend'
import { siteUrl } from '@/lib/site'
import type { ItemCarrito } from '@/types'

/**
 * MIKYRA LIFE - Emails transaccionales con Resend.
 * Si no hay API key, los envíos se omiten con log (no rompen el flujo de compra).
 * IMPORTANTE: antes de enviar a clientes reales, verifica tu dominio en Resend
 * y cambia EMAIL_FROM (por defecto usa el dominio de test onboarding@resend.dev).
 */

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null
const FROM = process.env.EMAIL_FROM ?? 'MIKYRA LIFE <onboarding@resend.dev>'

export function hayResend(): boolean {
  return Boolean(resend)
}

interface EmailConfirmacion {
  to: string
  nombre: string
  numeroPedido: string
  items: Array<Pick<ItemCarrito, 'nombre' | 'cantidad' | 'precio'>>
  total: number
}

/** Email de confirmación de pedido (lo dispara el webhook de Stripe) */
export async function enviarEmailConfirmacion({ to, nombre, numeroPedido, items, total }: EmailConfirmacion) {
  if (!resend) {
    console.warn('[resend] sin API key - email de confirmación omitido:', numeroPedido)
    return { ok: false }
  }

  try {
    await resend.emails.send({
      from: FROM,
      to,
      subject: `✅ Pedido confirmado ${numeroPedido} - MIKYRA LIFE`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; background: #0a0a0a; color: #fff; margin:0 }
              .container { max-width: 600px; margin: 0 auto; padding: 40px 20px; }
              .header { background: linear-gradient(135deg, #7f1d1d, #000); padding: 30px; border-radius: 12px; text-align: center; }
              .logo { font-size: 28px; font-weight: 900; color: #f59e0b; }
              .badge { background: #15803d; color: white; padding: 8px 20px; border-radius: 20px; display: inline-block; margin: 15px 0; }
              .producto { background: #1a1a1a; padding: 15px; border-radius: 8px; margin: 10px 0; display: flex; align-items: center; }
              .total { background: #7f1d1d; padding: 20px; border-radius: 8px; text-align: center; font-size: 24px; font-weight: bold; }
              .footer { text-align: center; color: #666; margin-top: 30px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <div class="logo">🔴 MIKYRA LIFE</div>
                <div class="badge">✅ PEDIDO CONFIRMADO</div>
                <h2>¡Gracias ${nombre}!</h2>
                <p>Tu pedido <strong>${numeroPedido}</strong> está en camino</p>
              </div>

              <h3 style="margin-top:30px">Tu pedido:</h3>
              ${items
                .map(
                  (item) => `
                <div class="producto">
                  <div>
                    <strong>${item.nombre}</strong><br/>
                    <span style="color:#aaa">Cantidad: ${item.cantidad}</span>
                  </div>
                  <div style="margin-left:auto">€${item.precio.toFixed(2)}</div>
                </div>`
                )
                .join('')}

              <div class="total" style="margin-top:20px">Total: €${total.toFixed(2)}</div>

              <div style="background:#1a1a1a; padding:20px; border-radius:8px; margin-top:20px">
                <h4>⏱️ ¿Cuándo llega?</h4>
                <p>Tiempo estimado de entrega: <strong>7-15 días hábiles</strong></p>
                <p>Te enviaremos el número de tracking en cuanto salga tu pedido.</p>
              </div>

              <div class="footer">
                <p>MIKYRA LIFE | ${siteUrl()}</p>
                <p>¿Preguntas? Responde a este email</p>
              </div>
            </div>
          </body>
        </html>
      `,
    })
    return { ok: true }
  } catch (error) {
    console.error('[resend] error enviando confirmación:', error)
    return { ok: false }
  }
}

interface EmailTracking {
  to: string
  nombre: string
  numeroPedido: string
  trackingNumber: string
  trackingUrl: string
}

/** Email de envío con número de seguimiento */
export async function enviarEmailTracking({ to, nombre, numeroPedido, trackingNumber, trackingUrl }: EmailTracking) {
  if (!resend) {
    console.warn('[resend] sin API key - email de tracking omitido:', numeroPedido)
    return { ok: false }
  }

  try {
    await resend.emails.send({
      from: FROM,
      to,
      subject: `📦 Tu pedido ${numeroPedido} está en camino`,
      html: `
        <div style="font-family:Arial;max-width:600px;margin:0 auto;padding:40px 20px;background:#0a0a0a;color:#fff">
          <h1 style="color:#f59e0b">📦 ¡Tu pedido está en camino!</h1>
          <p>Hola ${nombre}, tus gafas MIKYRA LIFE ya están de camino.</p>
          <div style="background:#1a1a1a;padding:20px;border-radius:8px;text-align:center">
            <p style="color:#aaa">Número de seguimiento</p>
            <h2 style="color:#f59e0b">${trackingNumber}</h2>
            <a href="${trackingUrl}"
               style="background:#7f1d1d;color:white;padding:12px 30px;border-radius:8px;text-decoration:none;display:inline-block">
              Seguir mi pedido →
            </a>
          </div>
        </div>
      `,
    })
    return { ok: true }
  } catch (error) {
    console.error('[resend] error enviando tracking:', error)
    return { ok: false }
  }
}
