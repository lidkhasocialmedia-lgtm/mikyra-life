'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Star } from 'lucide-react'
import type { Producto } from '@/types'
import { calcularDescuento, formatearPrecio } from '@/lib/utils'
import { Badge } from '@/components/ui/Badge'
import { AddToCart } from './AddToCart'

/**
 * Tarjeta de producto para catálogo y destacados.
 * Hover: zoom de imagen + sombra de marca. El CTA rápido añade al carrito sin navegar.
 */
export function ProductCard({ producto }: { producto: Producto }) {
  const descuento = calcularDescuento(producto.precio, producto.precioOriginal)

  return (
    <article className="tarjeta group relative overflow-hidden transition-all duration-300 hover:border-marca-ambar/40 hover:shadow-glow-rojo">
      <Link
        href={`/productos/${producto.slug}`}
        className="absolute inset-0 z-10"
        aria-label={`Ver ${producto.nombre}`}
      />

      <div className="relative aspect-square overflow-hidden bg-black">
        <Image
          src={producto.imagenes[0]}
          alt={`${producto.nombre} - gafas bloqueadoras de luz`}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-[1.06]"
        />
        <div className="absolute left-3 top-3 z-20 flex flex-col items-start gap-2">
          {descuento && <Badge tono="rojo">-{descuento}%</Badge>}
          {producto.destacado && <Badge tono="ambar">★ Superventas</Badge>}
        </div>
      </div>

      <div className="p-5">
        <div className="flex items-center justify-between gap-2">
          <h3 className="truncate text-base font-bold text-white">{producto.nombre}</h3>
          <span className="flex shrink-0 items-center gap-1 text-xs text-neutral-400">
            <Star className="h-3.5 w-3.5 fill-marca-ambar text-marca-ambar" />
            {producto.ratingPromedio.toFixed(1)}
          </span>
        </div>
        <p className="mt-1 line-clamp-2 min-h-[2.5rem] text-sm text-neutral-500">{producto.descripcionCorta}</p>

        <div className="mt-4 flex items-center justify-between gap-3">
          <div>
            {producto.precioOriginal && (
              <span className="mr-2 text-xs text-neutral-600 line-through">{formatearPrecio(producto.precioOriginal)}</span>
            )}
            <span className="text-xl font-black text-marca-ambar">{formatearPrecio(producto.precio)}</span>
          </div>
          {/* z-20 para quedar por encima del enlace que cubre la tarjeta */}
          <div className="relative z-20">
            <AddToCart producto={producto} compacto />
          </div>
        </div>
      </div>
    </article>
  )
}
