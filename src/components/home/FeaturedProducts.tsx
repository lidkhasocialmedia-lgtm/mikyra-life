import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import type { Producto } from '@/types'
import { ProductCard } from '@/components/shop/ProductCard'
import { Reveal } from '@/components/ui/Reveal'
import { clasesDeBoton } from '@/components/ui/Button'

/**
 * Vitrina de productos del sistema "sueño completo":
 * noche (roja), blackout total y día (ámbar). Los datos llegan desde
 * cargarProductos() (Supabase o seed), el render es server-side = SEO.
 */
export function FeaturedProducts({ productos }: { productos: Producto[] }) {
  return (
    <section className="seccion py-16 sm:py-24" aria-labelledby="productos-titulo">
      <Reveal className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.25em] text-marca-brasa">El sistema</p>
          <h2 id="productos-titulo" className="mt-2 text-3xl font-black text-white sm:text-4xl">
            Tres gafas. Veinticuatro horas de control lumínico.
          </h2>
        </div>
        <Link href="/productos" className={clasesDeBoton('secundario', 'md')}>
          Ver catálogo
          <ArrowRight className="h-4 w-4" />
        </Link>
      </Reveal>

      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {productos.map((producto, i) => (
          <Reveal key={producto.id} retardo={i * 0.1}>
            <ProductCard producto={producto} />
          </Reveal>
        ))}
      </div>

      <Reveal retardo={0.3}>
        <p className="mt-8 text-center text-sm text-neutral-500">
          Pack sistema completo: <span className="font-semibold text-neutral-300">ahorra un 15%</span> usando PRO Red +
          DayShield en la misma rutina.
        </p>
      </Reveal>
    </section>
  )
}
