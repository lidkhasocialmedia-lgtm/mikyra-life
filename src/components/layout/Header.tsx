'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Eye, Menu, ShoppingCart, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useCarrito } from '@/hooks/useCart'
import { Badge } from '@/components/ui/Badge'

const ENLACES = [
  { href: '/', etiqueta: 'Inicio' },
  { href: '/productos', etiqueta: 'Gafas' },
  { href: '/#ciencia', etiqueta: 'La ciencia' },
  { href: '/#faq', etiqueta: 'FAQ' },
]

/**
 * Header fijo con blur, contador de carrito animado y menú móvil.
 * El badge de unidades usa montado=true para evitar mismatch de hidratación.
 */
export function Header() {
  const pathname = usePathname()
  const { unidades, toggle, montado } = useCarrito()
  const [menuAbierto, setMenuAbierto] = useState(false)
  const [encogido, setEncogido] = useState(false)

  // Sombra/compacto al hacer scroll
  useEffect(() => {
    const onScroll = () => setEncogido(window.scrollY > 12)
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Cerrar menú móvil al navegar
  useEffect(() => setMenuAbierto(false), [pathname])

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-50 transition-all duration-300',
        encogido ? 'border-b border-marca-borde bg-black/80 backdrop-blur-xl' : 'bg-transparent'
      )}
    >
      {/* Barra superior de confianza */}
      <div className="hidden border-b border-white/5 bg-black/60 sm:block">
        <p className="seccion flex items-center justify-center gap-6 py-1.5 text-[11px] uppercase tracking-widest text-neutral-400">
          <span>🚚 Envío gratis desde 60€</span>
          <span className="text-neutral-700">·</span>
          <span>🔬 Diseñadas con evidencia circadiana</span>
          <span className="text-neutral-700">·</span>
          <span>↩️ 30 días de prueba</span>
        </p>
      </div>

      <div className="seccion flex h-16 items-center justify-between gap-4">
        {/* Logo */}
        <Link href="/" className="group flex items-center gap-2.5" aria-label="MIKYRA LIFE - inicio">
          <span className="relative flex h-9 w-9 items-center justify-center rounded-full border border-marca-ambar/60 bg-black">
            <Eye className="h-4 w-4 text-marca-brasa transition-colors group-hover:text-marca-ambar" />
            <span className="absolute inset-0 animate-pulso-luz rounded-full bg-marca-rojo/30 blur-md" />
          </span>
          <span className="text-lg font-black tracking-[0.2em] text-white">
            MIKYRA<span className="text-marca-ambar">LIFE</span>
          </span>
        </Link>

        {/* Navegación desktop */}
        <nav className="hidden items-center gap-1 md:flex" aria-label="Navegación principal">
          {ENLACES.map((enlace) => {
            const activo = enlace.href === '/' && pathname === '/'
            return (
              <Link
                key={enlace.href}
                href={enlace.href}
                className={cn(
                  'rounded-lg px-3.5 py-2 text-sm font-medium transition-colors',
                  activo ? 'text-marca-ambar' : 'text-neutral-300 hover:text-white'
                )}
              >
                {enlace.etiqueta}
              </Link>
            )
          })}
        </nav>

        {/* Acciones */}
        <div className="flex items-center gap-2">
          <Badge tono="rojo" className="hidden lg:inline-flex">
            -45% lanzamiento
          </Badge>

          <button
            type="button"
            onClick={toggle}
            aria-label={`Abrir carrito (${unidades} artículos)`}
            className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-neutral-800 bg-black/40 text-neutral-200 transition-colors hover:border-marca-ambar hover:text-marca-ambar"
          >
            <ShoppingCart className="h-5 w-5" />
            <AnimatePresence>
              {montado && unidades > 0 && (
                <motion.span
                  key={unidades}
                  initial={{ scale: 0.4, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.4, opacity: 0 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 28 }}
                  className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-marca-ambar text-[11px] font-bold text-black"
                >
                  {unidades}
                </motion.span>
              )}
            </AnimatePresence>
          </button>

          <button
            type="button"
            onClick={() => setMenuAbierto((v) => !v)}
            aria-label="Abrir menú"
            aria-expanded={menuAbierto}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-neutral-800 bg-black/40 text-neutral-200 md:hidden"
          >
            {menuAbierto ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Menú móvil */}
      <AnimatePresence>
        {menuAbierto && (
          <motion.nav
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="overflow-hidden border-b border-marca-borde bg-black/95 backdrop-blur-xl md:hidden"
            aria-label="Navegación móvil"
          >
            <div className="seccion flex flex-col gap-1 py-4">
              {ENLACES.map((enlace) => (
                <Link
                  key={enlace.href}
                  href={enlace.href}
                  className="rounded-lg px-3 py-3 text-base font-medium text-neutral-200 hover:bg-white/5"
                >
                  {enlace.etiqueta}
                </Link>
              ))}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  )
}
