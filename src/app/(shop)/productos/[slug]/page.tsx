import type { Metadata } from 'next'
import { siteUrl } from '@/lib/site'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Check, RefreshCcw, Ruler, ShieldCheck, Star, Truck } from 'lucide-react'
import { cargarDestacados, cargarProductoPorSlug, listarSlugsSemilla, reviewsDeProducto } from '@/lib/seed'
import { esProductoDemo } from '@/lib/seed'
import { calcularDescuento, formatearPrecio } from '@/lib/utils'
import { ProductGallery } from '@/components/shop/ProductGallery'
import { ProductTabs } from '@/components/shop/ProductTabs'
import { AddToCart } from '@/components/shop/AddToCart'
import { Badge } from '@/components/ui/Badge'
import { ProductCard } from '@/components/shop/ProductCard'

const URL_BASE = siteUrl()

/** Prerenderizar los slugs de seed para que la demo funcione en static */
export function generateStaticParams() {
  return listarSlugsSemilla().map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const producto = await cargarProductoPorSlug(params.slug)
  if (!producto) return { title: 'Producto no encontrado' }

  return {
    title: producto.metaTitle ?? `${producto.nombre} | Gafas bloqueadoras MIKYRA LIFE`,
    description: producto.metaDescription ?? producto.descripcionCorta,
    alternates: { canonical: `/productos/${producto.slug}` },
    openGraph: {
      title: producto.nombre,
      description: producto.descripcionCorta,
      images: [{ url: `${URL_BASE}${producto.imagenes[0]}`, width: 800, height: 800, alt: producto.nombre }],
    },
  }
}

/**
 * Página de producto — la página que vende.
 * Izquierda: galería. Derecha: pitch + precio + CTA pegajoso.
 * Abajo: tabs (descripción/características/specs/reviews), garantías, relacionados.
 */
export default async function ProductoPage({ params }: { params: { slug: string } }) {
  const producto = await cargarProductoPorSlug(params.slug)
  if (!producto) notFound()

  const [destacados] = await Promise.all([cargarDestacados(3)])
  const relacionados = destacados.filter((p) => p.slug !== producto.slug)
  const descuento = calcularDescuento(producto.precio, producto.precioOriginal)
  const esDemo = esProductoDemo(producto)

  // JSON-LD Product para rich results (precio + disponibilidad)
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: producto.nombre,
    description: producto.descripcionCorta,
    image: producto.imagenes.map((img) => `${URL_BASE}${img}`),
    sku: producto.cjVariantId ?? producto.slug.toUpperCase(),
    brand: { '@type': 'Brand', name: 'MIKYRA LIFE' },
    offers: {
      '@type': 'Offer',
      url: `${URL_BASE}/productos/${producto.slug}`,
      priceCurrency: 'EUR',
      price: producto.precio,
      availability: 'https://schema.org/InStock',
    },
  }

  return (
    <div className="seccion pt-24 sm:pt-32">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Breadcrumb */}
      <nav className="text-xs text-neutral-500" aria-label="Ruta de navegación">
        <Link href="/" className="hover:text-marca-ambar">
          Inicio
        </Link>{' '}
        /{' '}
        <Link href="/productos" className="hover:text-marca-ambar">
          Gafas
        </Link>{' '}
        / <span className="text-neutral-300">{producto.nombre}</span>
      </nav>

      <div className="mt-6 grid gap-10 lg:grid-cols-2 lg:gap-14">
        <ProductGallery imagenes={producto.imagenes} nombre={producto.nombre} />

        {/* Columna de compra */}
        <div>
          <div className="flex flex-wrap items-center gap-2">
            {descuento && <Badge tono="rojo">OFERTA -{descuento}%</Badge>}
            {producto.destacado && <Badge tono="ambar">★ Superventas</Badge>}
            <Badge tono="verde">En stock</Badge>
          </div>

          <h1 className="mt-4 text-3xl font-black text-white sm:text-4xl">{producto.nombre}</h1>

          <div className="mt-3 flex items-center gap-2 text-sm text-neutral-400">
            <span className="flex gap-0.5" aria-label={`${producto.ratingPromedio} de 5`}>
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={i < Math.round(producto.ratingPromedio) ? 'h-4 w-4 fill-marca-ambar text-marca-ambar' : 'h-4 w-4 text-neutral-700'}
                />
              ))}
            </span>
            <span>
              {producto.ratingPromedio.toFixed(1)} · {producto.reviewsTotal} opiniones
              {esDemo && <span className="text-neutral-600"> (demo)</span>}
            </span>
          </div>

          <p className="mt-4 text-neutral-300">{producto.descripcionCorta}</p>

          <div className="mt-6 flex items-end gap-3">
            <span className="text-4xl font-black text-marca-ambar">{formatearPrecio(producto.precio)}</span>
            {producto.precioOriginal && (
              <span className="pb-1 text-lg text-neutral-600 line-through">{formatearPrecio(producto.precioOriginal)}</span>
            )}
            {descuento && (
              <span className="mb-1.5 rounded-md bg-marca-rojo/30 px-2 py-0.5 text-xs font-bold text-marca-brasa">
                ahorras {formatearPrecio(producto.precioOriginal! - producto.precio)}
              </span>
            )}
          </div>

          <ul className="mt-6 grid gap-2 text-sm text-neutral-300 sm:grid-cols-2">
            {producto.caracteristicas.slice(0, 6).map((c) => (
              <li key={c} className="flex items-start gap-2">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-green-400" />
                {c}
              </li>
            ))}
          </ul>

          <div className="mt-7">
            <AddToCart producto={producto} />
          </div>

          <div className="mt-6 grid grid-cols-3 gap-3 text-center text-xs text-neutral-400">
            <div className="tarjeta flex flex-col items-center gap-1.5 px-2 py-4">
              <Truck className="h-5 w-5 text-marca-ambar" />
              Envío 5-10 días
            </div>
            <div className="tarjeta flex flex-col items-center gap-1.5 px-2 py-4">
              <RefreshCcw className="h-5 w-5 text-marca-ambar" />
              30 días de prueba
            </div>
            <div className="tarjeta flex flex-col items-center gap-1.5 px-2 py-4">
              <ShieldCheck className="h-5 w-5 text-marca-ambar" />
              Garantía 2 años
            </div>
          </div>

          <div className="mt-4 flex items-center gap-2 rounded-xl border border-marca-borde bg-marca-superficie/50 px-4 py-3 text-xs text-neutral-400">
            <Ruler className="h-4 w-4 shrink-0 text-neutral-500" />
            Fit-over hasta 140 mm de ancho. Compatible con la mayoría de gafas graduadas.
          </div>
        </div>
      </div>

      {/* Tabs de contenido largo (SEO: texto indexable en HTML) */}
      <ProductTabs producto={producto} reviews={reviewsDeProducto(producto.id)} />

      {/* Relacionados */}
      {relacionados.length > 0 && (
        <section className="mt-20" aria-labelledby="relacionados-titulo">
          <h2 id="relacionados-titulo" className="text-2xl font-black text-white">
            Completa tu sistema
          </h2>
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {relacionados.map((p) => (
              <ProductCard key={p.id} producto={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}

