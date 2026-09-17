import type { Metadata } from 'next'
import { LegalPage } from '@/components/layout/LegalPage'

export const metadata: Metadata = { title: 'Política de cookies', alternates: { canonical: '/cookies' } }

export default function CookiesPage() {
  return (
    <LegalPage
      titulo="Política de cookies"
      intro="Usamos el mínimo imprescindible: ni una cookie publicitaria en el arranque de la tienda."
      actualizado="15/09/2026"
      secciones={[
        {
          h2: 'Cookies técnicas (siempre activas)',
          parrafos: [
            'Sesión del panel de administración (solo cookies httpOnly internas).',
            'Almacenamiento local del carrito (localStorage) para conservar tus productos aunque cierres la pestaña.',
          ],
        },
        {
          h2: 'Analítica',
          parrafos: ['Vercel Analytics mide páginas vistas de forma agregada y sin identificadores persistentes. No usamos Google Analytics ni píxeles publicitarios por defecto.'],
        },
        {
          h2: 'Si activamos marketing en el futuro',
          parrafos: ['Cualquier píxel (Meta, TikTok) se cargaría tras un banner de consentimiento conforme al LSSI y al RGPD, con rechazo tan fácil como aceptación.'],
        },
      ]}
    />
  )
}
