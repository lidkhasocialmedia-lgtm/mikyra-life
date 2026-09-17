import Link from 'next/link'
import { clasesDeBoton } from '@/components/ui/Button'

/** CTA compacto reutilizable al pie de páginas informativas */
export function HeroCTA() {
  return (
    <section className="seccion pb-8">
      <div className="tarjeta flex flex-col items-center justify-between gap-4 border-marca-ambar/25 bg-gradient-to-r from-marca-rojo/10 via-black to-marca-ambar/10 p-8 text-center sm:flex-row sm:text-left">
        <div>
          <p className="text-lg font-bold text-white">¿Listo para dormir de otra manera?</p>
          <p className="text-sm text-neutral-400">Catálogo completo con garantía de 30 días.</p>
        </div>
        <Link href="/productos" className={clasesDeBoton('primario', 'md')}>
          Ver las gafas
        </Link>
      </div>
    </section>
  )
}
