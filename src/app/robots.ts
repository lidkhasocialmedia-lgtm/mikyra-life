import type { MetadataRoute } from 'next'

const BASE = process.env.NEXT_PUBLIC_URL ?? 'http://localhost:3000'

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
