import { Sun, Sunset, LampDesk } from 'lucide-react'
import { Reveal } from '@/components/ui/Reveal'

/**
 * Sección "La ciencia" (id=ciencia) explicada en 3 pasos + protocolo diario.
 * Tono: divulgación rigurosa, sin promesas médicas.
 */

const PASOS = [
  {
    numero: '01',
    icono: Sunset,
    titulo: 'El atardecer dispara tu melatonina',
    texto:
      'Al caer el sol, tu retina deja de enviar la señal "es de día" y la glándula pineal empieza a segregar melatonina 30-60 min antes de tu hora habitual de dormir.',
  },
  {
    numero: '02',
    icono: LampDesk,
    titulo: 'Cualquier luz la frena',
    texto:
      'Los LEDs "cálidos", las pantallas y las lámparas de techo siguen emitiendo entre 600 y 1000 nm. Tu cerebro lo lee como día y retrasa el inicio del sueño hasta 90 minutos.',
  },
  {
    numero: '03',
    icono: Sun,
    titulo: 'MIKYRA corta la señal',
    texto:
      'Con el filtro puesto, mantienes tu rutina nocturna —leer, series, cena— mientras tu melatonina sube intacta. Duermes la noche que tu biología espera desde el paleolítico.',
  },
]

export function HowItWorks() {
  return (
    <section id="ciencia" className="relative scroll-mt-24 overflow-hidden py-16 sm:py-24" aria-labelledby="ciencia-titulo">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(60%_50%_at_50%_40%,rgba(127,29,29,0.18),transparent)]" />

      <div className="seccion">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-bold uppercase tracking-[0.25em] text-marca-ambar">La ciencia</p>
          <h2 id="ciencia-titulo" className="mt-2 text-3xl font-black text-white sm:text-4xl">
            Cómo la luz gobierna tu sueño
          </h2>
          <p className="mt-3 text-neutral-400">
            El ritmo circadiano es el reloj maestro de tu cuerpo y se sincroniza con la luz que recibe tu retina. Es la
            variable más potente —y la más ignorada— de tu higiene de sueño.
          </p>
        </Reveal>

        <div className="mt-12 grid gap-4 lg:grid-cols-3">
          {PASOS.map((paso, i) => (
            <Reveal key={paso.numero} retardo={i * 0.1}>
              <article className="tarjeta relative h-full p-7">
                <span
                  aria-hidden
                  className="absolute right-5 top-4 text-5xl font-black text-white/[0.04]"
                >
                  {paso.numero}
                </span>
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-marca-rojo to-black text-marca-brasa ring-1 ring-marca-rojo/50">
                  <paso.icono className="h-6 w-6" />
                </div>
                <h3 className="mt-5 text-lg font-bold text-white">{paso.titulo}</h3>
                <p className="mt-2 text-sm leading-relaxed text-neutral-400">{paso.texto}</p>
              </article>
            </Reveal>
          ))}
        </div>

        <Reveal retardo={0.25} className="mx-auto mt-10 max-w-3xl">
          <div className="tarjeta border-marca-ambar/25 bg-gradient-to-r from-marca-rojo/15 via-black to-marca-ambar/10 p-6 text-sm leading-relaxed text-neutral-300">
            <p>
              <strong className="text-marca-ambar">Protocolo recomendado:</strong> ponte las MIKYRA desde 1–2 h antes de
              dormir. Deja las DayShield ámbar durante la noche si usas pantalla. Guárdalas al despertar y exponte a luz
              solar en los primeros 30 min para anclar el reloj. La consistencia gana: evalúa tu sueño a las 2 semanas.
            </p>
            <p className="mt-3 text-xs text-neutral-500">
              Información divulgativa basada en literatura de cronobiología. No sustituye el consejo de un profesional
              sanitario.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
