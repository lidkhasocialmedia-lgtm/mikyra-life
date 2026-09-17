'use client'

import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

/**
 * FAQ acordeón (sin dependencias radix extra).
 * Cada respuesta está redactada para resolver objeciones de compra
 * y para aparecer en rich snippets de Google (FAQPage schema).
 */

const PREGUNTAS = [
  {
    p: '¿De verdad bloquean el 100% de la luz roja?',
    r: 'Sí. Nuestras lentes de policarbonato con filtro de densidad óptica bloquean el 100% de la banda 620-750 nm medido con espectrofotómetro. La PRO Red añade absorción parcial de IR-C (750-1400 nm). Cada unidad pasa control de calidad; te enviamos el certificado del lote con tu pedido.',
  },
  {
    p: '¿Puedo usarlas para ver pantallas por la noche?',
    r: 'Con las PRO Red sí: bloquean rojo e IR pero dejan pasar algo de luz verde, suficiente para leer y navegar sin forzar la vista. Para trabajar 4+ h con código o vídeo, las DayShield ámbar son más cómodas; para dormir, mejor PRO Red o blackout.',
  },
  {
    p: '¿Sirven para migraña y fotofobia?',
    r: 'Muchos usuarios con migraña reportan menos crisis al filtrar luz azul-verde de alta energía. No son un tratamiento médico: si tienes fotofobia intensa o patología retiniana, consulta con tu oftalmólogo antes de usarlas para ese fin.',
  },
  {
    p: '¿Cuánto tarda el envío a España?',
    r: 'Entre 5 y 10 días hábiles desde nuestro almacén europeo (CJ Dropshipping, Madrid/Polonia). Recibirás tracking por email en cuanto salga. Devoluciones sin preguntas en 30 días.',
  },
  {
    p: '¿Y si no noto diferencia?',
    r: 'Garantía de sueño de 30 días: úsalas cada noche, y si no mejoras tu latencia de conciliación o la calidad de tu descanso, te devolvemos el 100% sin cuestionarios. Solo pídelo por email y te damos la dirección de retorno.',
  },
  {
    p: '¿Puedo usarlas con gafas graduadas?',
    r: 'Las monturas PRO Red y DayShield son "fit-over" compatibles con la mayoría de gafas graduadas (hasta 140 mm de ancho). Las BLACKOUT Zero no: son de lente opaca y sellante.',
  },
]

export function FAQ() {
  const [abierta, setAbierta] = useState<number | null>(0)

  return (
    <section id="faq" className="seccion scroll-mt-24 py-16 sm:py-24" aria-labelledby="faq-titulo">
      <div className="mx-auto max-w-3xl">
        <div className="text-center">
          <p className="text-sm font-bold uppercase tracking-[0.25em] text-marca-brasa">Dudas frecuentes</p>
          <h2 id="faq-titulo" className="mt-2 text-3xl font-black text-white sm:text-4xl">
            Todo lo que quieres saber antes de dormir mejor
          </h2>
        </div>

        <div className="mt-10 space-y-3">
          {PREGUNTAS.map((faq, i) => {
            const activa = abierta === i
            return (
              <div
                key={faq.p}
                className={cn(
                  'overflow-hidden rounded-2xl border bg-marca-superficie/50 transition-colors',
                  activa ? 'border-marca-ambar/40' : 'border-marca-borde hover:border-neutral-700'
                )}
              >
                <button
                  type="button"
                  onClick={() => setAbierta(activa ? null : i)}
                  aria-expanded={activa}
                  className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
                >
                  <span className={cn('text-base font-semibold', activa ? 'text-marca-ambar' : 'text-white')}>
                    {faq.p}
                  </span>
                  <ChevronDown
                    className={cn('h-5 w-5 shrink-0 text-neutral-500 transition-transform duration-300', activa && 'rotate-180 text-marca-ambar')}
                  />
                </button>
                <AnimatePresence initial={false}>
                  {activa && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: 'easeOut' }}
                    >
                      <p className="px-6 pb-5 text-sm leading-relaxed text-neutral-400">{faq.r}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
