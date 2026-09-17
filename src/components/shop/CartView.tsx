'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react'
import { useCarrito } from '@/hooks/useCart'
import { formatearPrecio, UMBRAL_ENVIO_GRATIS } from '@/lib/utils'
import { clasesDeBoton } from '@/components/ui/Button'

/**
 * Página de carrito completa (edición de cantidades, resumen, CTA a checkout).
 * Montado con guardas anti-hidratación desde useCarrito.
 */
export function CartView() {
  const { items, subtotal, envio, total, montado, cambiarCantidad, quitar } = useCarrito()

  if (!montado) {
    return <div className="mt-10 h-64 animate-pulse rounded-2xl border border-marca-borde bg-marca-superficie/40" />
  }

  if (items.length === 0) {
    return (
      <div className="mt-16 flex flex-col items-center gap-5 rounded-3xl border border-marca-borde bg-marca-superficie/40 px-6 py-20 text-center">
        <ShoppingBag className="h-14 w-14 text-neutral-700" />
        <div>
          <p className="text-xl font-bold text-white">Tu carrito está vacío</p>
          <p className="mt-1 text-sm text-neutral-500">Las noches malas no se curan solas.</p>
        </div>
        <Link href="/productos" className={clasesDeBoton('primario', 'md')}>
          Ver las gafas
        </Link>
      </div>
    )
  }

  return (
    <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_360px]">
      {/* Items */}
      <ul className="divide-y divide-marca-borde/60 rounded-2xl border border-marca-borde bg-marca-superficie/40 px-6">
        {items.map((item) => (
          <li key={item.productoId} className="flex flex-wrap items-center gap-5 py-6 sm:flex-nowrap">
            <Link
              href={`/productos/${item.slug}`}
              className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl border border-marca-borde bg-black"
            >
              <Image src={item.imagen} alt={item.nombre} fill sizes="96px" className="object-cover" />
            </Link>

            <div className="min-w-0 flex-1">
              <Link href={`/productos/${item.slug}`} className="text-base font-bold text-white hover:text-marca-ambar">
                {item.nombre}
              </Link>
              <p className="mt-0.5 text-sm text-neutral-500">{formatearPrecio(item.precio)} / ud.</p>

              <div className="mt-3 inline-flex items-center rounded-lg border border-neutral-800 bg-black/40">
                <button
                  type="button"
                  onClick={() => cambiarCantidad(item.productoId, item.cantidad - 1)}
                  aria-label="Restar una unidad"
                  className="p-2 text-neutral-400 hover:text-white"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="w-10 text-center text-sm font-semibold">{item.cantidad}</span>
                <button
                  type="button"
                  onClick={() => cambiarCantidad(item.productoId, item.cantidad + 1)}
                  aria-label="Sumar una unidad"
                  className="p-2 text-neutral-400 hover:text-white"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="ml-auto text-right">
              <p className="text-lg font-black text-white">{formatearPrecio(item.precio * item.cantidad)}</p>
              <button
                type="button"
                onClick={() => quitar(item.productoId)}
                className="mt-2 inline-flex items-center gap-1 text-xs text-neutral-500 transition-colors hover:text-red-400"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Quitar
              </button>
            </div>
          </li>
        ))}
      </ul>

      {/* Resumen */}
      <aside className="h-fit rounded-2xl border border-marca-borde bg-marca-superficie/60 p-6 lg:sticky lg:top-28">
        <h2 className="text-lg font-bold text-white">Resumen</h2>

        <div className="mt-4 space-y-2 text-sm">
          <div className="flex justify-between text-neutral-400">
            <span>Subtotal</span>
            <span>{formatearPrecio(subtotal)}</span>
          </div>
          <div className="flex justify-between text-neutral-400">
            <span>Envío</span>
            <span>{envio === 0 ? <span className="text-green-400">Gratis</span> : formatearPrecio(envio)}</span>
          </div>
          {subtotal < UMBRAL_ENVIO_GRATIS && (
            <p className="text-xs text-marca-ambar">
              Añade {formatearPrecio(UMBRAL_ENVIO_GRATIS - subtotal)} y el envío corre de nuestra cuenta.
            </p>
          )}
          <div className="flex justify-between border-t border-marca-borde pt-3 text-base font-black text-white">
            <span>Total</span>
            <span>{formatearPrecio(total)}</span>
          </div>
        </div>

        <Link href="/checkout" className={clasesDeBoton('primario', 'lg', 'mt-6 w-full')}>
          Finalizar compra →
        </Link>

        <div className="mt-5 flex items-center justify-center gap-4 text-[11px] uppercase tracking-widest text-neutral-600">
          <span>🔒 Stripe SSL</span>
          <span>↩️ 30 días</span>
        </div>
      </aside>
    </div>
  )
}
