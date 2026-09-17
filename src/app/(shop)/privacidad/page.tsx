import type { Metadata } from 'next'
import { LegalPage } from '@/components/layout/LegalPage'

export const metadata: Metadata = {
  title: 'Política de privacidad',
  robots: { index: true, follow: true },
  alternates: { canonical: '/privacidad' },
}

export default function PrivacidadPage() {
  return (
    <LegalPage
      titulo="Política de privacidad"
      intro="Tratamos el mínimo de datos necesarios para enviarte tus gafas. Nada de reventas, nada de newsletters forzados."
      actualizado="15/09/2026"
      secciones={[
        {
          h2: 'Responsable del tratamiento',
          parrafos: ['MIKYRA LIFE — hola@mikyra.roadshop.online. Tienda operada bajo la legislación española/UE (RGPD y LOPDGDD).'],
        },
        {
          h2: 'Datos que recogemos y por qué',
          parrafos: [
            'Pedido: nombre, email, teléfono, dirección de envío y ciudad/provincia/CP. Base legal: ejecución del contrato de compra-venta. Se almacenan en Supabase (UE) para tramitar el envío y la garantía.',
            'Pago: lo procesa íntegramente Stripe; nunca vemos ni almacenamos números de tarjeta.',
            'Logística: nombre, dirección, teléfono y email se comparten con CJ Dropshipping exclusivamente para preparar y entregar el pedido.',
            'Email marketing: solo si te suscribes voluntariamente al newsletter (base legal: consentimiento). Un clic cancela la suscripción y eliminamos el registro.',
            'Analítica: métricas agregadas y anónimas de Vercel Analytics. No usamos cookies publicitarias de terceros sin tu consentimiento.',
          ],
        },
        {
          h2: 'Conservación',
          parrafos: ['Datos de pedido: 5 años (obligaciones fiscales). Suscripciones: hasta que te des de baja. Consultas de soporte: 2 años.'],
        },
        {
          h2: 'Tus derechos',
          parrafos: [
            'Puedes ejercer acceso, rectificación, supresión, portabilidad y oposición escribiendo a hola@mikyra.roadshop.online. También puedes reclamar ante la AEPD (aepd.es).',
          ],
        },
      ]}
    />
  )
}
