import Link from 'next/link'
import { RotateCcw, ShieldCheck, Truck } from 'lucide-react'
import { Reveal } from '@/components/ui/Reveal'
import { clasesDeBoton } from '@/components/ui/Button'

/**
 * Franja final de cierre: garantía + envío + CTA. Última impresión antes del footer.
 */
export function Garantía() {
  return (
    <section className="seccion py-16" aria-label="Garantía y envío">
      <Reveal>
        <div className="relative overflow-hidden rounded-3xl border border-marca-rojo/40 bg-gradient-to-br from-[#1a0806] via-marca-fondo to-black p-8 text-center sm:p-14">
          <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(45%_60%_at_50%_0%,rgba(185,28,28,0.25),transparent)]" />

          <h2 className="relative text-3xl font-black text-white sm:text-4xl">
            Duerme mejor en 30 días
            <br />
            <span className="texto-degradado">o te devolvemos todo</span>
          </h2>
          <p className="relative mx-auto mt-4 max-w-xl text-neutral-400">
            Sin formularios, sin preguntas incómodas. Si tu sueño no mejora, no te quedamos nada. Así de seguros estamos
            del protocolo.
          </p>

          <div className="relative mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href="/productos" className={clasesDeBoton('primario', 'lg')}>
              Elegir mis gafas
            </Link>
            <Link href="/#ciencia" className={clasesDeBoton('secundario', 'lg')}>
              Entender la ciencia
            </Link>
          </div>

          <ul className="relative mt-10 grid gap-4 border-t border-white/5 pt-8 text-sm text-neutral-400 sm:grid-cols-3">
            <li className="flex items-center justify-center gap-2">
              <RotateCcw className="h-5 w-5 text-marca-ambar" />
              30 días de prueba real
            </li>
            <li className="flex items-center justify-center gap-2">
              <Truck className="h-5 w-5 text-marca-ambar" />
              Envío gratis desde 60€
            </li>
            <li className="flex items-center justify-center gap-2">
              <ShieldCheck className="h-5 w-5 text-marca-ambar" />
              Pago seguro con Stripe
            </li>
          </ul>
        </div>
      </Reveal>
    </section>
  )
}
