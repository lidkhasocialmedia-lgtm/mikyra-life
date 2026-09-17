import Stripe from 'stripe'
import { loadStripe, type Stripe as StripeJs } from '@stripe/stripe-js'

/**
 * Stripe: instancia de servidor (secret key) y cargador de la librería de cliente.
 * Todo degrada a null si no hay claves, para que la demo funcione sin cuenta.
 */

const secretKey = process.env.STRIPE_SECRET_KEY
const publicKey = process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY

export function hayStripe(): boolean {
  return Boolean(secretKey)
}

let stripe: Stripe | null = null

/** Cliente Stripe de servidor. Lanzar solo desde Server Components / Route Handlers. */
export function getStripe(): Stripe {
  if (!stripe) {
    if (!secretKey) {
      throw new Error('STRIPE_SECRET_KEY no está definida (modo demo: no se puede cobrar)')
    }
    stripe = new Stripe(secretKey, { apiVersion: '2025-03-31.basil' as Stripe.LatestApiVersion })
  }
  return stripe
}

let stripeJsPromise: Promise<StripeJs | null> | null = null

/** Cargador para @stripe/react-stripe-js (client-side). Devuelve null sin clave pública. */
export function getStripeJs(): Promise<StripeJs | null> {
  if (!publicKey) return Promise.resolve(null)
  if (!stripeJsPromise) stripeJsPromise = loadStripe(publicKey)
  return stripeJsPromise
}
