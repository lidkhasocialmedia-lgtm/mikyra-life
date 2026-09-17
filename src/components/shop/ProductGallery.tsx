'use client'

import { useState } from 'react'
import Image from 'next/image'
import { AnimatePresence, motion } from 'framer-motion'
import { cn } from '@/lib/utils'

/**
 * Galería del producto: imagen principal con crossfade + miniaturas.
 * Hover con zoom suave (transform, sin librerías externas).
 */
export function ProductGallery({ imagenes, nombre }: { imagenes: string[]; nombre: string }) {
  const [activa, setActiva] = useState(0)
  const [zoom, setZoom] = useState(false)

  return (
    <div className="flex flex-col-reverse gap-4 sm:flex-row">
      {/* Miniaturas */}
      <div className="flex gap-3 sm:flex-col" role="tablist" aria-label="Vistas del producto">
        {imagenes.map((src, i) => (
          <button
            key={src}
            type="button"
            role="tab"
            aria-selected={i === activa}
            aria-label={`Ver imagen ${i + 1} de ${nombre}`}
            onMouseEnter={() => setActiva(i)}
            onFocus={() => setActiva(i)}
            onClick={() => setActiva(i)}
            className={cn(
              'relative h-16 w-16 shrink-0 overflow-hidden rounded-xl border bg-black transition-all',
              i === activa ? 'border-marca-ambar ring-2 ring-marca-ambar/30' : 'border-neutral-800 opacity-60 hover:opacity-100'
            )}
          >
            <Image src={src} alt="" fill sizes="64px" className="object-cover" />
          </button>
        ))}
      </div>

      {/* Imagen principal */}
      <div
        className="relative aspect-square flex-1 cursor-zoom-in overflow-hidden rounded-2xl border border-marca-borde bg-black"
        onMouseEnter={() => setZoom(true)}
        onMouseLeave={() => setZoom(false)}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={imagenes[activa]}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="absolute inset-0"
          >
            <Image
              src={imagenes[activa]}
              alt={`${nombre} - vista ${activa + 1}`}
              fill
              priority={activa === 0}
              sizes="(max-width: 1024px) 100vw, 50vw"
              className={cn('object-cover transition-transform duration-500', zoom && 'scale-[1.35]')}
            />
          </motion.div>
        </AnimatePresence>
        <span className="pointer-events-none absolute bottom-3 right-3 rounded-full bg-black/70 px-3 py-1 text-[11px] text-neutral-400 backdrop-blur">
          {activa + 1}/{imagenes.length}
        </span>
      </div>
    </div>
  )
}
