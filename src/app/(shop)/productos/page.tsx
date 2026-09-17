import type { Metadata } from 'next'
import { cargarProductos, CATEGORIAS_SEED } from '@/lib/seed'
import { ProductCard } from '@/components/shop/ProductCard'
import { Reveal } from '@/components/ui/Reveal'
import { cn } from '@/lib/utils'

export const metadata: Metadata = {
  title: 'Gafas bloqueadoras de luz roja, IR y azul | MIKYRA LIFE',
  description:
    'Catálogo MIKYRA LIFE: bloqueo de luz roja nocturno, bloqueo total para dormir y filtros ámbar para pantallas. Certificación CE, garantía 30 días.',
  alternates: { canonical: '/productos' },
}

/**
 * Catálogo con filtro por categoría vía searchParams (server-side, cacheable).
 * ?categoria=luz-roja-nocturna | bloqueo-total | luz-azul-diurna
 */
export default async function CatalogoPage({
  searchParams,
}: {
  searchParams: { categoria?: string }
}) {
  const productos = await cargarProductos()
  const categoriaActiva = searchParams.categoria ?? null
  const filtrados = categoriaActiva ? productos.filter((p) => p.categoriaSlug === categoriaActiva) : productos

  return (
    <div className="seccion pt-28 sm:pt-36">
      <Reveal>
        <h1 className="text-3xl font-black text-white sm:text-4xl">Elige tu escudo lumínico</h1>
        <p className="mt-3 max-w-2xl text-neutral-400">
          Cada modelo bloquea una banda del espectro para un momento distinto de tu día. Ninguna graduación intermedia:
          la biología es binaria.
        </p>
      </Reveal>

      {/* Filtros de categoría */}
      <nav className="mt-8 flex flex-wrap gap-2" aria-label="Filtrar por categoría">
        <a
          href="/productos"
          className={cn(
            'rounded-full border px-4 py-2 text-sm font-semibold transition-colors',
            !categoriaActiva
              ? 'border-marca-ambar bg-marca-ambar text-black'
              : 'border-neutral-800 text-neutral-400 hover:border-marca-ambar/50 hover:text-white'
          )}
        >
          Todas
        </a>
        {CATEGORIAS_SEED.map((cat) => (
          <a
            key={cat.slug}
            href={`/productos?categoria=${cat.slug}`}
            className={cn(
              'rounded-full border px-4 py-2 text-sm font-semibold transition-colors',
              categoriaActiva === cat.slug
                ? 'border-marca-ambar bg-marca-ambar text-black'
                : 'border-neutral-800 text-neutral-400 hover:border-marca-ambar/50 hover:text-white'
            )}
          >
            {cat.nombre}
          </a>
        ))}
      </nav>

      {filtrados.length === 0 ? (
        <p className="mt-16 text-center text-neutral-500">No hay productos en esta categoría todavía.</p>
      ) : (
        <div className="mt-10 grid gap-5 pb-8 sm:grid-cols-2 lg:grid-cols-3">
          {filtrados.map((producto, i) => (
            <Reveal key={producto.id} retardo={i * 0.06}>
              <ProductCard producto={producto} />
            </Reveal>
          ))}
        </div>
      )}
    </div>
  )
}
