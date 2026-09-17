import type { Metadata } from 'next'
import { CartView } from '@/components/shop/CartView'

export const metadata: Metadata = {
  title: 'Tu carrito',
  description: 'Revisa los productos de tu pedido MIKYRA LIFE antes de pagar.',
  robots: { index: false, follow: false }, // nunca indexar el carrito
  alternates: { canonical: '/carrito' },
}

export default function CarritoPage() {
  return (
    <div className="seccion pt-28 sm:pt-36">
      <h1 className="text-3xl font-black text-white sm:text-4xl">Tu carrito</h1>
      <CartView />
    </div>
  )
}
