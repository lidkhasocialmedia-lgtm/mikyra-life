'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { ArrowRight, BadgeCheck, Moon, ShieldCheck, Star } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { clasesDeBoton } from '@/components/ui/Button'

/**
 * Hero de MIKYRA LIFE.
 * Concepto visual: habitación a oscuras con luz roja ambiental "viva" (glow animado)
 * y el producto flotando. El mensaje ataca el dolor principal: no poder dormir.
 */

const stats = [
  { valor: '100%', etiqueta: 'luz roja bloqueada' },
  { valor: '23 g', etiqueta: 'ultraligeras' },
  { valor: '4.8★', etiqueta: '294 valoraciones' },
  { valor: '30 días', etiqueta: 'de prueba' },
]

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-28 sm:pt-32 lg:pt-36" aria-label="Presentación MIKYRA LIFE">
      {/* Fondo: degradado + halo rojo pulsante */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-[#140705] via-marca-fondo to-marca-fondo" />
        <motion.div
          className="absolute -top-32 left-1/2 h-[520px] w-[820px] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(185,28,28,0.32),transparent)] blur-2xl"
          animate={{ opacity: [0.5, 0.85, 0.5], scale: [1, 1.05, 1] }}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute bottom-0 left-10 h-64 w-64 rounded-full bg-[radial-gradient(closest-side,rgba(245,158,11,0.14),transparent)] blur-xl"
          animate={{ opacity: [0.4, 0.8, 0.4] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1.2 }}
        />
      </div>

      <div className="seccion grid items-center gap-12 pb-16 lg:grid-cols-[1.05fr_0.95fr] lg:pb-24">
        {/* Columna de texto */}
        <div>
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <Badge tono="rojo">
              <Moon className="h-3.5 w-3.5" />
              Biohacking para tu descanso
            </Badge>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.08 }}
            className="mt-5 text-4xl font-black leading-[1.05] tracking-tight text-white sm:text-5xl lg:text-6xl"
          >
            Si duermes mal,
            <br />
            el problema puede ser <span className="texto-degradado">la luz que no ves</span>.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.16 }}
            className="mt-5 max-w-xl text-base leading-relaxed text-neutral-400 sm:text-lg"
          >
            Las gafas <strong className="text-neutral-200">MIKYRA PRO Red</strong> bloquean el 100% de la luz roja e
            infrarroja que frena tu melatonina después del atardecer. Mira pantallas, lee, vive tu noche — sin
            sabotear tu sueño.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.24 }}
            className="mt-8 flex flex-col gap-3 sm:flex-row"
          >
            <Link href="/productos" className={clasesDeBoton('primario', 'lg')}>
              Ver las gafas
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/#ciencia" className={clasesDeBoton('secundario', 'lg')}>
              La ciencia detrás
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-neutral-500"
          >
            <span className="flex items-center gap-1.5">
              <Star className="h-4 w-4 fill-marca-ambar text-marca-ambar" />
              4.8/5 de 294 clientes
            </span>
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-green-400" />
              Garantía de 30 días
            </span>
            <span className="flex items-center gap-1.5">
              <BadgeCheck className="h-4 w-4 text-marca-ambar" />
              Certificación CE
            </span>
          </motion.div>
        </div>

        {/* Columna de producto */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.15, ease: [0.21, 0.47, 0.32, 0.98] }}
          className="relative mx-auto w-full max-w-lg"
        >
          <div className="tarjeta relative animate-flotar overflow-hidden p-6 sm:p-8">
            <Image
              src="/images/productos/mikyra-pro-red-frontal.svg"
              alt="Gafas MIKYRA PRO Red sobre fondo con luz ambiental roja"
              width={800}
              height={800}
              priority
              className="w-full drop-shadow-[0_20px_45px_rgba(185,28,28,0.35)]"
            />
            <div className="mt-4 flex items-end justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-widest text-neutral-500"> superventas · uso nocturno</p>
                <p className="text-lg font-bold text-white">MIKYRA PRO Red</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-neutral-500 line-through">89,99 €</p>
                <p className="text-2xl font-black text-marca-ambar">49,99 €</p>
              </div>
            </div>
          </div>

          {/* Etiqueta flotante técnica */}
          <motion.div
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7 }}
            className="absolute -left-3 top-8 hidden rounded-xl border border-marca-rojo/50 bg-black/90 px-4 py-2.5 text-xs shadow-glow-rojo sm:block"
          >
            <p className="font-bold text-marca-brasa">620–750 nm</p>
            <p className="text-neutral-400">bloqueo total</p>
          </motion.div>
        </motion.div>
      </div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="seccion pb-14"
      >
        <dl className="grid grid-cols-2 divide-white/5 rounded-2xl border border-marca-borde bg-marca-superficie/50 sm:grid-cols-4 sm:divide-x">
          {stats.map((s) => (
            <div key={s.etiqueta} className="px-4 py-5 text-center">
              <dt className="sr-only">{s.etiqueta}</dt>
              <dd className="text-2xl font-black text-white">{s.valor}</dd>
              <dd className="mt-0.5 text-xs uppercase tracking-widest text-neutral-500">{s.etiqueta}</dd>
            </div>
          ))}
        </dl>
      </motion.div>
    </section>
  )
}
