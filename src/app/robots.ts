import type { MetadataRoute } from 'next'
import { siteUrl } from '@/lib/site'

const BASE = siteUrl()

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        // No indexar proceso de compra ni panel
        disallow: ['/carrito', '/checkout', '/gracias', '/admin', '/api'],
      },
    ],
    sitemap: `${BASE}/sitemap.xml`,
    host: BASE,
  }
}
