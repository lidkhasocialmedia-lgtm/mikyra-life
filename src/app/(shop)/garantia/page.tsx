import type { Metadata } from 'next'
import { LegalPage } from '@/components/layout/LegalPage'

export const metadata: Metadata = {
  title: 'Garantía MIKYRA 30 días + 2 años',
  alternates: { canonical: '/garantia' },
}

export default function GarantiaPage() {
  return (
    <LegalPage
      titulo="Garantía MIKYRA"
      intro="Dos capas de protección para que comprar online sea tan tranquilo como dormir con nosotros."
      actualizado="15/09/2026"
      secciones={[
        {
          h2: 'Garantía de sueño: 30 días',
          parrafos: [
            'Si tras 30 noches de uso no mejoras tu latencia de conciliación, la calidad de tu descanso o tu sensación al despertar, te devolvemos el 100% del importe sin cuestionarios.',
            'Válida para cualquier producto de la tienda, comprada directamente en mikyra.roadshop.online.',
          ],
        },
        {
          h2: 'Garantía de fabricación: 2 años',
          parrafos: [
            'Cubrimos defectos de montura, bisagras y recubrimiento de lentes. Un cambio de lente por defecto se resuelve enviándote una unidad nueva, sin devolución previa en defectos evidentes (nos basta una foto).',
            'No cubre: rayones por uso indebido, pérdida, modificación no autorizada o uso como gafas de sol en conducción nocturna (ninguna de nuestras lentes de bloqueo es apta para conducir de noche).',
          ],
        },
        {
          h2: 'Cómo activarla',
          parrafos: [
            'Escribe a hola@mikyra.roadshop.online con tu número de pedido y una foto o breve descripción del problema. Respondemos en menos de 24 h laborables.',
          ],
        },
      ]}
    />
  )
}
