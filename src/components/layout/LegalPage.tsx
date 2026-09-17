import Link from 'next/link'

/**
 * Plantilla compartida por las páginas legales / de soporte.
 * Mantiene consistencia visual sin crear 7 layouts distintos.
 */
export function LegalPage({
  titulo,
  intro,
  secciones,
  actualizado,
}: {
  titulo: string
  intro: string
  secciones: Array<{ h2: string; parrafos: string[] }>
  actualizado?: string
}) {
  return (
    <div className="seccion max-w-3xl pt-28 sm:pt-36">
      <p className="text-sm text-neutral-500">
        <Link href="/" className="hover:text-marca-ambar">
          Inicio
        </Link>{' '}
        / <span className="text-neutral-300">{titulo}</span>
      </p>
      <h1 className="mt-4 text-3xl font-black text-white sm:text-4xl">{titulo}</h1>
      <p className="mt-4 text-neutral-400">{intro}</p>
      {actualizado && <p className="mt-2 text-xs uppercase tracking-widest text-neutral-600">Última actualización: {actualizado}</p>}

      <div className="mt-10 space-y-10 pb-8">
        {secciones.map((s) => (
          <section key={s.h2}>
            <h2 className="text-xl font-bold text-white">{s.h2}</h2>
            {s.parrafos.map((p, i) => (
              <p key={i} className="mt-3 text-sm leading-relaxed text-neutral-400">
                {p}
              </p>
            ))}
          </section>
        ))}
      </div>
    </div>
  )
}
