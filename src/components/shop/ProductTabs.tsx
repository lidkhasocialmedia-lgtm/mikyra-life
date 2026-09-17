'use client'

import { useState } from 'react'
import { Star } from 'lucide-react'
import type { Producto, Review } from '@/types'
import { cn } from '@/lib/utils'

/**
 * Tabs del producto: Descripción | Características | Especificaciones | Opiniones.
 * Todo el contenido vive en el DOM (display:none) para no perder texto indexable.
 */

const ETIQUETAS = ['Descripción', 'Características', 'Especificaciones', 'Opiniones'] as const

export function ProductTabs({ producto, reviews }: { producto: Producto; reviews: Review[] }) {
  const [activa, setActiva] = useState<(typeof ETIQUETAS)[number]>('Descripción')

  return (
    <section className="mt-16" aria-label="Detalles del producto">
      <div role="tablist" aria-label="Secciones del producto" className="flex flex-wrap gap-1 border-b border-marca-borde">
        {ETIQUETAS.map((etiqueta) => (
          <button
            key={etiqueta}
            role="tab"
            type="button"
            aria-selected={activa === etiqueta}
            onClick={() => setActiva(etiqueta)}
            className={cn(
              'relative px-4 py-3 text-sm font-semibold transition-colors',
              activa === etiqueta ? 'text-marca-ambar' : 'text-neutral-500 hover:text-white'
            )}
          >
            {etiqueta}
            {activa === etiqueta && <span className="absolute inset-x-0 -bottom-px h-0.5 rounded-full bg-marca-ambar" />}
          </button>
        ))}
      </div>

      <div className="py-8">
        {activa === 'Descripción' && (
          <div className="max-w-3xl space-y-4 text-[15px] leading-relaxed text-neutral-300">
            {producto.descripcion.split('\n\n').map((parrafo, i) => (
              <p key={i}>{parrafo}</p>
            ))}
          </div>
        )}

        {activa === 'Características' && (
          <ul className="grid max-w-3xl gap-3 sm:grid-cols-2">
            {producto.caracteristicas.map((c) => (
              <li key={c} className="tarjeta px-4 py-3 text-sm text-neutral-200">
                {c}
              </li>
            ))}
          </ul>
        )}

        {activa === 'Especificaciones' && (
          <dl className="max-w-xl divide-y divide-marca-borde overflow-hidden rounded-2xl border border-marca-borde">
            {Object.entries(producto.especificaciones).map(([clave, valor]) => (
              <div key={clave} className="flex justify-between gap-4 px-5 py-3 text-sm">
                <dt className="uppercase tracking-wide text-neutral-500">{formatoClave(clave)}</dt>
                <dd className="text-right font-medium text-neutral-200">{valor}</dd>
              </div>
            ))}
          </dl>
        )}

        {activa === 'Opiniones' && (
          <div className="space-y-4">
            {reviews.length === 0 ? (
              <p className="text-sm text-neutral-500">
                Aún no hay opiniones publicadas para este modelo. ¿Lo has probado? Escríbenos y te la publicamos.
              </p>
            ) : (
              reviews.map((r) => (
                <article key={r.id} className="tarjeta p-5">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-marca-rojo/30 text-sm font-bold text-marca-brasa">
                        {r.nombre.charAt(0)}
                      </span>
                      <div>
                        <p className="text-sm font-bold text-white">{r.nombre}</p>
                        <div className="flex gap-0.5">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star key={i} className={i < r.rating ? 'h-3 w-3 fill-marca-ambar text-marca-ambar' : 'h-3 w-3 text-neutral-700'} />
                          ))}
                        </div>
                      </div>
                    </div>
                    {r.verificado && (
                      <span className="rounded-full bg-green-500/15 px-2.5 py-1 text-[11px] font-semibold text-green-400">
                        Compra verificada
                      </span>
                    )}
                  </div>
                  {r.titulo && <p className="mt-3 text-sm font-semibold text-white">“{r.titulo}”</p>}
                  <p className="mt-1 text-sm leading-relaxed text-neutral-400">{r.comentario}</p>
                  <p className="mt-2 text-[11px] uppercase tracking-widest text-neutral-600">{r.fecha}</p>
                </article>
              ))
            )}
          </div>
        )}
      </div>
    </section>
  )
}

/** 'material_montura' -> 'Material montura' */
function formatoClave(clave: string): string {
  const limpio = clave.replace(/_/g, ' ')
  return limpio.charAt(0).toUpperCase() + limpio.slice(1)
}
