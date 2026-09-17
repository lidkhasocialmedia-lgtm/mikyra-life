'use client'

import * as Dialog from '@radix-ui/react-dialog'
import Image from 'next/image'
import Link from 'next/link'
import { AnimatePresence, motion } from 'framer-motion'
import { Minus, Plus, ShoppingBag, Trash2, X } from 'lucide-react'
import { useCarrito } from '@/hooks/useCart'
import { formatearPrecio, UMBRAL_ENVIO_GRATIS } from '@/lib/utils'
import { clasesDeBoton } from '@/components/ui/Button'

/**
 * Drawer lateral del carrito (Radix Dialog como base, animado con Framer Motion).
 * Permite editar cantidades y salta al checkout sin abandonar la página.
 */
export function CartDrawer() {
  const { items, subtotal, envio, total, unidades, abierto, cerrar, cambiarCantidad, quitar } = useCarrito()

  const faltaParaGratis = Math.max(0, UMBRAL_ENVIO_GRATIS - subtotal)
  const progreso = Math.min(100, (subtotal / UMBRAL_ENVIO_GRATIS) * 100)

  return (
    <Dialog.Root open={abierto} onOpenChange={(v) => (v ? undefined : cerrar())}>
      <AnimatePresence>
        {abierto && (
          <Dialog.Overlay asChild>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[60] bg-black/70 backdrop-blur-sm"
            />
          </Dialog.Overlay>
        )}
      </AnimatePresence>

      <Dialog.Portal>
        {abierto && (
          <Dialog.Content asChild>
            <motion.aside
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 320, damping: 34 }}
              className="fixed inset-y-0 right-0 z-[70] flex w-full max-w-md flex-col border-l border-marca-borde bg-[#0d0d0d] shadow-2xl"
              aria-label="Carrito de la compra"
            >
              <header className="flex items-center justify-between border-b border-marca-borde px-5 py-4">
                <Dialog.Title className="flex items-center gap-2 text-base font-bold text-white">
                  <ShoppingBag className="h-5 w-5 text-marca-ambar" />
                  Tu carrito {unidades > 0 && <span className="text-neutral-500">({unidades})</span>}
                </Dialog.Title>
                <Dialog.Close asChild>
                  <button
                    type="button"
                    onClick={cerrar}
                    aria-label="Cerrar carrito"
                    className="flex h-9 w-9 items-center justify-center rounded-lg text-neutral-400 hover:bg-white/5 hover:text-white"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </Dialog.Close>
              </header>

              {/* Progreso envío gratis */}
              {items.length > 0 && (
                <div className="border-b border-marca-borde/60 px-5 py-3">
                  <p className="text-xs text-neutral-400">
                    {faltaParaGratis > 0 ? (
                      <>
                        Te faltan <span className="font-bold text-marca-ambar">{formatearPrecio(faltaParaGratis)}</span> para
                        el envío gratis
                      </>
                    ) : (
                      <span className="font-semibold text-green-400">🎉 ¡Tienes envío gratis!</span>
                    )}
                  </p>
                  <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-neutral-800">
                    <motion.div
                      className="h-full rounded-full bg-gradient-to-r from-marca-rojo to-marca-ambar"
                      initial={false}
                      animate={{ width: `${progreso}%` }}
                      transition={{ duration: 0.4 }}
                    />
                  </div>
                </div>
              )}

              {items.length === 0 ? (
                <div className="flex flex-1 flex-col items-center justify-center gap-4 p-8 text-center">
                  <ShoppingBag className="h-12 w-12 text-neutral-700" />
                  <div>
                    <p className="font-semibold text-white">Tu carrito está vacío</p>
                    <p className="mt-1 text-sm text-neutral-500">Tu melatonina te espera. Elige tu par.</p>
                  </div>
                  <Link href="/productos" className={clasesDeBoton('primario', 'md')}>
                    Ver las gafas
                  </Link>
                </div>
              ) : (
                <>
                  <ul className="flex-1 divide-y divide-marca-borde/60 overflow-y-auto px-5">
                    {items.map((item) => (
                      <li key={item.productoId} className="flex gap-4 py-4">
                        <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl border border-marca-borde bg-black">
                          <Image src={item.imagen} alt={item.nombre} fill sizes="80px" className="object-cover" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-semibold text-white">{item.nombre}</p>
                          <p className="text-sm text-neutral-400">{formatearPrecio(item.precio)}</p>
                          <div className="mt-2 flex items-center gap-2">
                            <div className="flex items-center rounded-lg border border-neutral-800">
                              <button
                                type="button"
                                onClick={() => cambiarCantidad(item.productoId, item.cantidad - 1)}
                                aria-label={`Restar unidad de ${item.nombre}`}
                                className="p-1.5 text-neutral-400 hover:text-white"
                              >
                                <Minus className="h-3.5 w-3.5" />
                              </button>
                              <span className="w-8 text-center text-sm font-medium">{item.cantidad}</span>
                              <button
                                type="button"
                                onClick={() => cambiarCantidad(item.productoId, item.cantidad + 1)}
                                aria-label={`Sumar unidad de ${item.nombre}`}
                                className="p-1.5 text-neutral-400 hover:text-white"
                              >
                                <Plus className="h-3.5 w-3.5" />
                              </button>
                            </div>
                            <button
                              type="button"
                              onClick={() => quitar(item.productoId)}
                              aria-label={`Eliminar ${item.nombre} del carrito`}
                              className="ml-auto p-1.5 text-neutral-500 transition-colors hover:text-red-400"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                        <p className="text-sm font-bold text-white">{formatearPrecio(item.precio * item.cantidad)}</p>
                      </li>
                    ))}
                  </ul>

                  <footer className="space-y-3 border-t border-marca-borde bg-black/40 p-5">
                    <div className="space-y-1.5 text-sm">
                      <div className="flex justify-between text-neutral-400">
                        <span>Subtotal</span>
                        <span>{formatearPrecio(subtotal)}</span>
                      </div>
                      <div className="flex justify-between text-neutral-400">
                        <span>Envío</span>
                        <span>{envio === 0 ? <span className="text-green-400">Gratis</span> : formatearPrecio(envio)}</span>
                      </div>
                      <div className="flex justify-between pt-1.5 text-base font-bold text-white">
                        <span>Total</span>
                        <span>{formatearPrecio(total)}</span>
                      </div>
                    </div>
                    <Link href="/checkout" className={clasesDeBoton('primario', 'lg', 'w-full')} onClick={cerrar}>
                      Finalizar compra →
                    </Link>
                    <p className="text-center text-[11px] text-neutral-600">Pago cifrado con Stripe · Garantía 30 días</p>
                  </footer>
                </>
              )}
            </motion.aside>
          </Dialog.Content>
        )}
      </Dialog.Portal>
    </Dialog.Root>
  )
}
