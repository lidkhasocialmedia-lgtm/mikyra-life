'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { AlertTriangle, Lock, PartyPopper } from 'lucide-react'
import { esquemaCheckout, type DatosCheckout } from '@/lib/validation'
import { useCarrito } from '@/hooks/useCart'
import { formatearPrecio, generarIdCliente } from '@/lib/utils'
import { Input } from '@/components/ui/Input'
import { Boton } from '@/components/ui/Button'
import { cn } from '@/lib/utils'

type EstadoEnvio = 'idle' | 'enviando' | 'demo' | 'error'

/**
 * Formulario de checkout (React Hook Form + Zod).
 * Envía a /api/checkout; si todo va bien, redirige a Stripe Checkout.
 * En modo demo (sin claves) muestra aviso claro en vez de error.
 */
export function CheckoutForm() {
  const { items, subtotal, envio, total, vaciar, montado } = useCarrito()
  const [estado, setEstado] = useState<EstadoEnvio>('idle')
  const [mensaje, setMensaje] = useState<string | null>(null)
  const [clienteId, setClienteId] = useState('')

  // Identificador anónimo persistente para vincular sesión de Stripe <-> pedido
  useEffect(() => {
    let id = localStorage.getItem('mikyra-cliente-id')
    if (!id) {
      id = generarIdCliente()
      localStorage.setItem('mikyra-cliente-id', id)
    }
    setClienteId(id)
  }, [])

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<DatosCheckout>({
    // cast: RHF+@hookform/resolvers v5 son estrictos con generics de resolver
    resolver: zodResolver(esquemaCheckout) as never,
    defaultValues: { pais: 'ES', telefono: '', direccion2: '' },
  })

  async function enviar(datos: DatosCheckout) {
    if (items.length === 0) {
      setEstado('error')
      setMensaje('Tu carrito está vacío.')
      return
    }
    setEstado('enviando')
    setMensaje(null)

    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...datos,
          clienteId,
          items: items.map((i) => ({ slug: i.slug, cantidad: i.cantidad })),
        }),
      })

      const json = await res.json()

      if (res.ok && json.ok && json.data?.url) {
        vaciar() // Stripe ya tiene la línea de pedido; limpiamos el carrito local
        window.location.href = json.data.url
        return
      }

      if (json.demo) {
        setEstado('demo')
        setMensaje(
          'La tienda está en modo demo: faltan claves de Stripe/Supabase en el servidor. Añádelas en .env.local y el pago quedará habilitado.'
        )
        return
      }

      setEstado('error')
      setMensaje(json.error ?? 'No pudimos iniciar el pago. Revisa los datos e inténtalo otra vez.')
    } catch {
      setEstado('error')
      setMensaje('Error de conexión. Comprueba tu red e inténtalo de nuevo.')
    }
  }

  return (
    <div className={cn('mt-10 grid gap-10 pb-8 lg:grid-cols-[1fr_400px]', estado === 'demo' && 'opacity-95')}>
      {/* Columna formulario */}
      <form onSubmit={handleSubmit(enviar)} noValidate className="space-y-8">
        {estado === 'demo' && (
          <div className="flex items-start gap-3 rounded-2xl border border-amber-500/40 bg-amber-500/10 p-5 text-sm text-amber-200">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" />
            <div>
              <p className="font-bold">Modo demo activo</p>
              <p className="mt-1 text-amber-200/80">{mensaje}</p>
            </div>
          </div>
        )}
        {estado === 'error' && mensaje && (
          <div className="flex items-start gap-3 rounded-2xl border border-red-500/40 bg-red-500/10 p-5 text-sm text-red-300">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" />
            <p>{mensaje}</p>
          </div>
        )}

        <fieldset className="tarjeta p-6">
          <legend className="px-2 text-sm font-bold uppercase tracking-widest text-marca-ambar">1 · Contacto</legend>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <Input etiqueta="Nombre completo *" placeholder="Ana Pérez" error={errors.nombre?.message} {...register('nombre')} autoComplete="name" />
            <Input etiqueta="Email *" type="email" placeholder="ana@email.com" error={errors.email?.message} {...register('email')} autoComplete="email" />
          </div>
          <div className="mt-4">
            <Input etiqueta="Teléfono (para la agencia de envíos)" type="tel" placeholder="+34 600 000 000" error={errors.telefono?.message} {...register('telefono')} autoComplete="tel" />
          </div>
        </fieldset>

        <fieldset className="tarjeta p-6">
          <legend className="px-2 text-sm font-bold uppercase tracking-widest text-marca-ambar">2 · Envío</legend>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <Input etiqueta="Dirección *" placeholder="Calle Serrano 21, 3ºB" error={errors.direccion?.message} {...register('direccion')} autoComplete="street-address" />
            </div>
            <div className="sm:col-span-2">
              <Input etiqueta="Apartamento, escalera… (opcional)" placeholder="Portero automático: PÉREZ" error={errors.direccion2?.message} {...register('direccion2')} />
            </div>
            <Input etiqueta="Ciudad *" placeholder="Madrid" error={errors.ciudad?.message} {...register('ciudad')} autoComplete="address-level2" />
            <Input etiqueta="Código postal *" placeholder="28001" error={errors.codigoPostal?.message} {...register('codigoPostal')} autoComplete="postal-code" inputMode="numeric" />
            <Input etiqueta="Provincia *" placeholder="Madrid" error={errors.provincia?.message} {...register('provincia')} autoComplete="address-level1" />
            <Input etiqueta="País (ES)" placeholder="ES" error={errors.pais?.message} {...register('pais')} />
          </div>
        </fieldset>

        <Boton type="submit" tamano="lg" cargando={estado === 'enviando'} className="w-full sm:w-auto">
          <Lock className="h-4 w-4" />
          {estado === 'enviando' ? 'Preparando pago seguro…' : `Pagar ${formatearPrecio(total)} con Stripe`}
        </Boton>
        <p className="text-center text-xs text-neutral-600 sm:text-left">
          Al pagar aceptas nuestros{' '}
          <Link href="/terminos" className="underline hover:text-neutral-400">términos</Link> y la{' '}
          <Link href="/privacidad" className="underline hover:text-neutral-400">política de privacidad</Link>. Garantía de
          devolución de 30 días.
        </p>
      </form>

      {/* Resumen pegajoso */}
      <aside className="h-fit rounded-2xl border border-marca-borde bg-marca-superficie/60 p-6 lg:sticky lg:top-28">
        <h2 className="flex items-center gap-2 text-lg font-bold text-white">
          <PartyPopper className="h-5 w-5 text-marca-ambar" />
          Tu pedido
        </h2>

        {montado && items.length > 0 ? (
          <>
            <ul className="mt-4 space-y-3">
              {items.map((i) => (
                <li key={i.productoId} className="flex items-center gap-3">
                  <div className="relative h-12 w-12 overflow-hidden rounded-lg border border-marca-borde bg-black">
                    <Image src={i.imagen} alt="" fill sizes="48px" className="object-cover" />
                  </div>
                  <div className="min-w-0 flex-1 text-sm">
                    <p className="truncate font-semibold text-white">{i.nombre}</p>
                    <p className="text-neutral-500">× {i.cantidad}</p>
                  </div>
                  <p className="text-sm font-bold text-white">{formatearPrecio(i.precio * i.cantidad)}</p>
                </li>
              ))}
            </ul>
            <div className="mt-5 space-y-1.5 border-t border-marca-borde pt-4 text-sm">
              <div className="flex justify-between text-neutral-400">
                <span>Subtotal</span>
                <span>{formatearPrecio(subtotal)}</span>
              </div>
              <div className="flex justify-between text-neutral-400">
                <span>Envío</span>
                <span>{envio === 0 ? <span className="text-green-400">Gratis</span> : formatearPrecio(envio)}</span>
              </div>
              <div className="flex justify-between pt-2 text-base font-black text-white">
                <span>Total</span>
                <span>{formatearPrecio(total)}</span>
              </div>
            </div>
          </>
        ) : (
          <p className="mt-4 text-sm text-neutral-500">Cargando tu carrito…</p>
        )}
      </aside>
    </div>
  )
}
