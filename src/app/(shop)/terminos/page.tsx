import type { Metadata } from 'next'
import { LegalPage } from '@/components/layout/LegalPage'

export const metadata: Metadata = {
  title: 'Términos y condiciones',
  alternates: { canonical: '/terminos' },
}

export default function TerminosPage() {
  return (
    <LegalPage
      titulo="Términos y condiciones"
      intro="Las reglas claras de la tienda. Si algo te parece confuso, escríbenos antes de comprar."
      actualizado="15/09/2026"
      secciones={[
        {
          h2: 'Productos y uso',
          parrafos: [
            'Las gafas MIKYRA LIFE son accesorios de bienestar con filtro lumínico, no productos sanitarios ni terapéuticos. No diagnostican, tratan ni curan enfermedades.',
            'Nunca uses las PRO Red ni las BLACKOUT para conducir de noche o en situaciones donde necesites percepción fiel del color. Las DayShield ámbar son aptas para conducción diurna (transmisión >8%).',
            'Los datos de bloqueo de espectro corresponden al lote de lentes medido en laboratorio; el rendimiento puede variar ±2% por tolerancias de fabricación.',
          ],
        },
        {
          h2: 'Precios y pago',
          parrafos: ['Precios en euros con IVA incluido cuando legalmente proceda. El pago se realiza por tarjeta a través de Stripe; el pedido se confirma al recibir el cargo.'],
        },
        {
          h2: 'Desistimiento (14 días legales) + garantía comercial (30 días)',
          parrafos: [
            'Tienes 14 días naturales desde la recepción para desistir legalmente sin penalización (real Decreto-ley 1/2007, TRLGDCU).',
            'Además aplicamos nuestra garantía comercial de 30 días "duerme mejor o te devolvemos todo", descrita en /garantia. Ambas conviven: rige la más favorable para ti.',
            'El reembolso se realiza por el mismo método de pago en un máximo de 14 días desde la recepción de la devolución.',
          ],
        },
        {
          h2: 'Propiedad intelectual',
          parrafos: ['Los textos, marca y diseño de esta tienda son de MIKYRA LIFE. Las imágenes de producto se usan bajo licencia del proveedor; las ilustraciones temporales se sustituirán por fotografía propia.'],
        },
      ]}
    />
  )
}
