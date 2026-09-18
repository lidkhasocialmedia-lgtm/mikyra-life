import type { MetadataRoute } from 'next'
import { cargarProductos } from '@/lib/seed'
import { siteUrl } from '@/lib/site'

const BASE = siteUrl()

/** Sitemap dinámico: estáticos + productos reales de la BD */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const estaticos: MetadataRoute.Sitemap = [
    { url: `${BASE}/`, changeFrequency: 'weekly', priority: 1 },
    { url: `${BASE}/productos`, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${BASE}/faq`, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${BASE}/envios-devoluciones`, changeFrequency: 'yearly', priority: 0.4 },
    { url: `${BASE}/garantia`, changeFrequency: 'yearly', priority: 0.4 },
    { url: `${BASE}/contacto`, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${BASE}/privacidad`, changeFrequency: 'yearly', priority: 0.2 },
    { url: `${BASE}/terminos`, changeFrequency: 'yearly', priority: 0.2 },
    { url: `${BASE}/cookies`, changeFrequency: 'yearly', priority: 0.2 },
  ]

  let productos: MetadataRoute.Sitemap = []
  try {
    productos = (await cargarProductos()).map((p) => ({
      url: `${BASE}/productos/${p.slug}`,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }))
  } catch {
    /* que el build no falle si la BD está caída */
  }

  return [...estaticos, ...productos]
}
