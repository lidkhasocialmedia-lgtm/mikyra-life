import type { Metadata } from 'next'
import { LegalPage } from '@/components/layout/LegalPage'

export const metadata: Metadata = {
  title: 'Envíos y devoluciones',
  description: 'Plazos de entrega a España y Europa, y política de devoluciones de 30 días de MIKYRA LIFE.',
  alternates: { canonical: '/envios-devoluciones' },
}

export default function EnviosPage() {
  return (
    <LegalPage
      titulo="Envíos y devoluciones"
      intro="Compramos stock en almacenes europeos de CJ Dropshipping para que no esperes semanas desde Asia."
      actualizado="15/09/2026"
      secciones={[
        {
          h2: 'Tiempos de entrega',
          parrafos: [
            'España peninsular: 5-10 días hábiles desde la confirmación del pedido (CJpacket o equivalentes con seguimiento).',
            'Baleares, Canarias, Ceuta y Melilla: 8-15 días hábiles; los pedidos a Canarias pueden generar gestiones aduaneras por parte del transportista.',
            'Europa (PT, FR, DE, IT): 7-14 días hábiles.',
            'Recibirás un email automático con el número de tracking en cuanto el almacén despache tu paquete. También puedes pedirlo respondiendo a tu email de confirmación.',
          ],
        },
        {
          h2: 'Costes de envío',
          parrafos: ['Envío gratuito en pedidos superiores a 60 €. Para el resto, tarifa plana de 4,99 € a España.'],
        },
        {
          h2: 'Devoluciones: 30 días de prueba real',
          parrafos: [
            'Usa las gafas cada noche durante un mes. Si no notas mejoría en tu sueño, escríbenos a hola@mikyra.roadshop.online indicando tu número de pedido (formato MKY-YYYYMMDD-0000) y te facilitamos la dirección de retorno.',
            'Devolución sin preguntas: reembolsamos el importe del producto en un plazo máximo de 14 días desde que recibimos la unidad.',
            'No se admiten devoluciones de unidades con daños por mal uso (por ejemplo, lentes rayadas con productos de limpieza abrasivos).',
          ],
        },
        {
          h2: 'Cambios de talla o modelo',
          parrafos: [
            'Las monturas son talla única fit-over. Si necesitas otro modelo (por ejemplo pasar de PRO Red a BLACKOUT Zero), tramitamos cambio directo si la unidad está en perfecto estado: tú pagas solo el envío de vuelta.',
          ],
        },
      ]}
    />
  )
}
