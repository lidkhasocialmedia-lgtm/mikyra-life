import type { Metadata } from 'next'
import Link from 'next/link'
import { CheckCircle2, Clock, Mail } from 'lucide-react'
import { clasesDeBoton } from '@/components/ui/Button'

export const metadata: Metadata = {
  title: '¡Pedido recibido!',
  robots: { index: false, follow: false },
}

/**
 * Página de gracias post-Stripe.
 * El webhook confirma el pago en unos segundos; aquí celebramos y fijamos expectativas.
 */
export default function GraciasPage({
  searchParams,
}: {
  searchParams: { pedido?: string; estado?: string; cancelado?: string }
}) {
  const cancelado = searchParams.cancelado === '1'
  const numero = searchParams.pedido

  if (cancelado) {
    return (
      <div className="seccion flex min-h-[70vh] flex-col items-center justify-center py-32 text-center">
        <h1 className="text-3xl font-black text-white">El pago se canceló</h1>
        <p className="mt-3 max-w-md text-neutral-400">
          Tu carrito sigue intacto por si quieres retomarlo. No se ha cobrado nada.
        </p>
        <Link href="/carrito" className={clasesDeBoton('primario', 'md', 'mt-8')}>
          Volver al carrito
        </Link>
      </div>
    )
  }

  return (
    <div className="seccion flex min-h-[70vh] flex-col items-center justify-center py-32 text-center">
      <CheckCircle2 className="h-16 w-16 text-green-400" />
      <h1 className="mt-6 text-3xl font-black text-white sm:text-4xl">
        ¡Pedido {numero ? <span className="text-marca-ambar">{numero}</span> : 'confirmado'}!
      </h1>
      <p className="mt-3 max-w-lg text-neutral-400">
        Gracias por confiar en MIKYRA LIFE. Estás más cerca de tus mejores noches.
      </p>

      <div className="mt-10 grid max-w-2xl gap-4 text-left sm:grid-cols-2">
        <div className="tarjeta flex items-start gap-3 p-5">
          <Mail className="mt-0.5 h-5 w-5 shrink-0 text-marca-ambar" />
          <div>
            <p className="text-sm font-bold text-white">Email de confirmación</p>
            <p className="mt-1 text-sm text-neutral-500">Te llegará en unos minutos con el resumen de tu compra.</p>
          </div>
        </div>
        <div className="tarjeta flex items-start gap-3 p-5">
          <Clock className="mt-0.5 h-5 w-5 shrink-0 text-marca-ambar" />
          <div>
            <p className="text-sm font-bold text-white">Entrega 5-10 días hábiles</p>
            <p className="mt-1 text-sm text-neutral-500">Recibirás el tracking por email en cuanto salga del almacén.</p>
          </div>
        </div>
      </div>

      <div className="mt-10 flex flex-col gap-3 sm:flex-row">
        <Link href="/productos" className={clasesDeBoton('secundario', 'md')}>
          Seguir explorando
        </Link>
        <a href="mailto:hola@mikyra.roadshop.online" className={clasesDeBoton('fantasma', 'md')}>
          ¿Algo no encaja? Escríbenos
        </a>
      </div>
    </div>
  )
}
