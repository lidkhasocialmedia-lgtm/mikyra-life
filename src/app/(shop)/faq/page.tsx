import type { Metadata } from 'next'
import { FAQ } from '@/components/home/FAQ'
import { HeroCTA } from '@/components/shop/HeroCTA'

export const metadata: Metadata = {
  title: 'Preguntas frecuentes sobre gafas bloqueadoras de luz',
  description:
    'Resolvemos dudas sobre bloqueo de espectro, uso con pantallas, migraña, envíos y la garantía de 30 días de MIKYRA LIFE.',
  alternates: { canonical: '/faq' },
}

const PREGUNTAS = [
  {
    '@type': 'Question' as const,
    name: '¿Bloquean realmente el 100% de la luz roja?',
    acceptedAnswer: {
      '@type': 'Answer' as const,
      text: 'Sí. Las lentes bloquean el 100% de la banda 620-750 nm medido con espectrofotómetro, con absorción parcial de IR-C (750-1400 nm).',
    },
  },
  {
    '@type': 'Question' as const,
    name: '¿Cuánto tarda el envío a España?',
    acceptedAnswer: {
      '@type': 'Answer' as const,
      text: 'Entre 5 y 10 días hábiles desde almacén europeo, con seguimiento incluido y garantía de devolución de 30 días.',
    },
  },
  {
    '@type': 'Question' as const,
    name: '¿Puedo conducir con ellas puestas?',
    acceptedAnswer: {
      '@type': 'Answer' as const,
      text: 'Las DayShield ámbar son aptas para conducir de día. Las PRO Red y BLACKOUT no son aptas para conducir, nunca de noche.',
    },
  },
]

/** Página FAQ standalone + JSON-LD FAQPage para rich results */
export default function FaqPage() {
  return (
    <div className="pt-24 sm:pt-32">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({ '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: PREGUNTAS }),
        }}
      />
      <FAQ />
      <HeroCTA />
    </div>
  )
}
