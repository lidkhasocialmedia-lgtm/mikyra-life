import { BedDouble, BrainCircuit, Eye, Sunrise } from 'lucide-react'
import { Reveal } from '@/components/ui/Reveal'

/**
 * Sección de beneficios centrada en resultados, no en características.
 * Cada tarjeta conecta la función con el dolor del avatar (biohacker de sueño).
 */

const BENEFICIOS = [
  {
    icono: BrainCircuit,
    titulo: 'Melatonina intacta',
    texto:
      'La luz roja e IR-C de LEDs y pantallas sigue llegando a tu retina de noche. Bloquéala y deja que tu pineal trabaje a horas.',
  },
  {
    icono: BedDouble,
    titulo: 'Conciliar en menos tiempo',
    texto:
      'Menos latencia de inicio del sueño: users reportan dormirse notablemente antes desde la primera semana de uso.',
  },
  {
    icono: Eye,
    titulo: 'Vista sin fatiga',
    texto:
      'Las lentes clase 1 eliminan el deslumbramiento residual de pantallas: leer antes de dormir deja de arder en los ojos.',
  },
  {
    icono: Sunrise,
    titulo: 'Mañanas más fáciles',
    texto:
      'Proteger tu señal circadiana de noche mejora la calidad del sueño profundo y reduce la inercia matinal.',
  },
]

export function Benefits() {
  return (
    <section className="seccion py-16 sm:py-24" aria-labelledby="beneficios-titulo">
      <Reveal>
        <p className="text-sm font-bold uppercase tracking-[0.25em] text-marca-brasa">Por qué funciona</p>
        <h2 id="beneficios-titulo" className="mt-2 max-w-2xl text-3xl font-black text-white sm:text-4xl">
          No es magia: es tu biología respondiendo a la luz
        </h2>
      </Reveal>

      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {BENEFICIOS.map((b, i) => (
          <Reveal key={b.titulo} retardo={i * 0.08}>
            <article className="tarjeta group h-full p-6 transition-colors hover:border-marca-ambar/40">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-marca-rojo/20 text-marca-brasa ring-1 ring-marca-rojo/40 transition-colors group-hover:bg-marca-ambar/15 group-hover:text-marca-ambar group-hover:ring-marca-ambar/40">
                <b.icono className="h-5 w-5" />
              </div>
              <h3 className="mt-4 text-lg font-bold text-white">{b.titulo}</h3>
              <p className="mt-2 text-sm leading-relaxed text-neutral-400">{b.texto}</p>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  )
}
