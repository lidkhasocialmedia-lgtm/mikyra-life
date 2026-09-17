import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({
  subsets: ['latin-ext'],
  display: 'swap',
  variable: '--font-inter',
})

const URL_BASE = process.env.NEXT_PUBLIC_URL ?? 'http://localhost:3000'

/**
 * Metadata raíz de MIKYRA LIFE.
 * openGraph + twitter en todo el sitio; cada página sobreescribe title/description.
 */
export const metadata: Metadata = {
  metadataBase: new URL(URL_BASE),
  title: {
    default: 'MIKYRA LIFE | Gafas bloqueadoras de luz roja para dormir mejor',
    template: '%s | MIKYRA LIFE',
  },
  description:
    'Gafas de precisión que bloquean el 100% de la luz roja e infrarroja que frena tu melatonina. Sueño profundo, ritmo circadiano optimizado. Envío a España en 5-10 días y garantía de 30 días.',
  keywords: [
    'gafas bloqueadoras de luz roja',
    'red light blocking glasses',
    'melatonina',
    'ritmo circadiano',
    'higiene del sueño',
    'biohacking',
    'gafas para dormir',
    'bloquear luz azul',
  ],
  authors: [{ name: 'MIKYRA LIFE' }],
  creator: 'MIKYRA LIFE',
  openGraph: {
    type: 'website',
    locale: 'es_ES',
    url: URL_BASE,
    siteName: 'MIKYRA LIFE',
    title: 'MIKYRA LIFE | Gafas bloqueadoras de luz roja para dormir mejor',
    description:
      'Bloquea el 100% de la luz roja e IR-C que sabotea tu melatonina. Diseñadas para el protocolo circadiano nocturno.',
    images: [
      {
        url: `${URL_BASE}/images/productos/mikyra-pro-red-frontal.svg`,
        width: 800,
        height: 800,
        alt: 'Gafas MIKYRA PRO Red',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MIKYRA LIFE | Duerme como antes del neón',
    description: 'Gafas bloqueadoras de luz roja e infrarroja para recuperar tu melatonina.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
  },
  alternates: { canonical: '/' },
}

export const viewport: Viewport = {
  themeColor: '#0a0a0a',
  width: 'device-width',
  initialScale: 1,
}

/** JSON-LD de la organización (schema.org) - mejora la entidad del sitio en Google */
const jsonLdOrganizacion = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'MIKYRA LIFE',
  url: URL_BASE,
  logo: `${URL_BASE}/images/logo.svg`,
  description: 'Ecommerce de gafas bloqueadoras de luz roja e infrarroja para optimizar el sueño.',
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'customer service',
    email: 'hola@mikyra.roadshop.online',
    availableLanguage: ['Spanish', 'English'],
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={inter.variable}>
      <body className="min-h-screen font-sans">
        <script
          type="application/ld+json"
          // JSON estático controlado por nosotros: sin riesgo XSS
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdOrganizacion) }}
        />
        {children}
      </body>
    </html>
  )
}
