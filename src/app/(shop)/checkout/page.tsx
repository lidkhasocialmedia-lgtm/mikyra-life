import type { Metadata } from 'next'
import { CheckoutForm } from '@/components/shop/CheckoutForm'

export const metadata: Metadata = {
  title: 'Finalizar compra',
  description: 'Checkout seguro de MIKYRA LIFE con Stripe.',
  robots: { index: false, follow: false },
  alternates: { canonical: '/checkout' },
}

export default function CheckoutPage() {
  return (
    <div className="seccion pt-28 sm:pt-36">
      <h1 className="text-3xl font-black text-white sm:text-4xl">Finalizar compra</h1>
      <p className="mt-2 text-sm text-neutral-500">Pago cifrado procesado por Stripe. Nunca almacenamos tu tarjeta.</p>
      <CheckoutForm />
    </div>
  )
}
