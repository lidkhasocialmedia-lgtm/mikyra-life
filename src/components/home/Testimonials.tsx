import { Quote, Star } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { Reveal } from '@/components/ui/Reveal'

/**
 * Testimonios de la home.
 * NOTA HONESTA: son de ejemplo (demo). Sustituir por reviews reales de la tabla
 * `reviews` cuando existan ventas — nunca publicar falsos social proof de legal risk.
 */

const TESTIMONIOS = [
  {
    nombre: 'Laura G.',
    rol: 'Diseñadora UX · Madrid',
    rating: 5,
    titulo: 'Mi melatonina volvió',
    texto:
      'Llevo 3 semanas usándolas desde las 21h. Antes me costaba una hora dormirme; ahora unos 15 minutos. Ojalá las hubiera comprado hace años.',
  },
  {
    nombre: 'Carlos M.',
    rol: 'Enfermero UCI · turnos rotativos',
    rating: 5,
    titulo: 'Por fin duermo de día',
    texto:
      'Con las BLACKOUT en el turno de noche duermo 6 horas seguidas con sol entrando por la ventana. Cambiaron mi recuperación.',
  },
  {
    nombre: 'Diego F.',
    rol: 'Software engineer · Valencia',
    rating: 5,
    titulo: 'Adiós ojo seco',
    texto:
      'Las DayShield en 9h de pantalla diarias: termino el día con la vista fresca y sin el dolor de cabeza de las 6pm.',
  },
]

export function Testimonials() {
  return (
    <section className="relative overflow-hidden py-16 sm:py-24" aria-labelledby="opiniones-titulo">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(50%_60%_at_50%_50%,rgba(127,29,29,0.12),transparent)]" />
      <div className="seccion">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-bold uppercase tracking-[0.25em] text-marca-ambar">Opiniones</p>
          <h2 id="opiniones-titulo" className="mt-2 text-3xl font-black text-white sm:text-4xl">
            La gente duerme mejor. Literalmente.
          </h2>
        </Reveal>

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {TESTIMONIOS.map((t, i) => (
            <Reveal key={t.nombre} retardo={i * 0.1}>
              <figure className="tarjeta flex h-full flex-col p-6">
                <Quote className="h-6 w-6 text-marca-rojo-claro/70" aria-hidden />
                <div className="mt-3 flex gap-0.5" aria-label={`${t.rating} de 5 estrellas`}>
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star key={j} className="h-4 w-4 fill-marca-ambar text-marca-ambar" />
                  ))}
                </div>
                <blockquote className="mt-3 flex-1">
                  <p className="font-semibold text-white">“{t.titulo}”</p>
                  <p className="mt-2 text-sm leading-relaxed text-neutral-400">{t.texto}</p>
                </blockquote>
                <figcaption className="mt-5 flex items-center justify-between gap-2 border-t border-marca-borde/60 pt-4">
                  <div>
                    <p className="text-sm font-bold text-white">{t.nombre}</p>
                    <p className="text-xs text-neutral-500">{t.rol}</p>
                  </div>
                  <Badge tono="verde" className="text-[10px]">
                    Compra verificada
                  </Badge>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>

        <p className="mt-6 text-center text-[11px] uppercase tracking-widest text-neutral-600">
          ⚠️ Testimonios de ejemplo — sustituir por reviews reales antes de publicitar (ver README)
        </p>
      </div>
    </section>
  )
}
