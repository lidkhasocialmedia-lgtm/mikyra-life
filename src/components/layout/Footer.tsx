import Link from 'next/link'
import { Eye } from 'lucide-react'
import { NewsletterForm } from '@/components/home/NewsletterForm'

const COLUMNAS = [
  {
    titulo: 'Tienda',
    enlaces: [
      { href: '/productos', texto: 'Todas las gafas' },
      { href: '/productos/mikyra-pro-red', texto: 'MIKYRA PRO Red' },
      { href: '/productos/mikyra-blackout', texto: 'MIKYRA BLACKOUT Zero' },
      { href: '/productos/mikyra-dayshield', texto: 'MIKYRA DayShield Amber' },
      { href: '/carrito', texto: 'Carrito' },
    ],
  },
  {
    titulo: 'Soporte',
    enlaces: [
      { href: '/envios-devoluciones', texto: 'Envíos y devoluciones' },
      { href: '/garantia', texto: 'Garantía 30 días' },
      { href: '/contacto', texto: 'Contacto' },
      { href: '/faq', texto: 'Preguntas frecuentes' },
    ],
  },
  {
    titulo: 'Legal',
    enlaces: [
      { href: '/privacidad', texto: 'Política de privacidad' },
      { href: '/terminos', texto: 'Términos y condiciones' },
      { href: '/cookies', texto: 'Política de cookies' },
    ],
  },
]

/**
 * Footer con newsletter + enlaces de confianza.
 * Nota SEO: enlaces internos limpios, sin JS innecesario (Server Component).
 */
export function Footer() {
  return (
    <footer className="mt-24 border-t border-marca-borde bg-black">
      {/* Newsletter */}
      <div className="seccion grid gap-8 py-14 lg:grid-cols-2 lg:items-center">
        <div>
          <h3 className="text-2xl font-bold text-white">
            Guía gratuita: <span className="texto-degradado">Protocolo de Oscuridad</span>
          </h3>
          <p className="mt-2 max-w-md text-sm text-neutral-400">
            7 días de hábitos basados en evidencia para arreglar tu ritmo circadiano. Sin spam, cancela cuando quieras.
          </p>
        </div>
        <NewsletterForm />
      </div>

      {/* Enlaces */}
      <div className="border-t border-marca-borde/60">
        <div className="seccion grid grid-cols-2 gap-8 py-12 md:grid-cols-4">
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-full border border-marca-ambar/60">
                <Eye className="h-4 w-4 text-marca-brasa" />
              </span>
              <span className="font-black tracking-[0.2em] text-white">
                MIKYRA<span className="text-marca-ambar">LIFE</span>
              </span>
            </Link>
            <p className="mt-3 text-sm leading-relaxed text-neutral-500">
              Gafas de precisión para proteger tu ritmo circadiano. Biohacking del sueño sin humo.
            </p>
          </div>

          {COLUMNAS.map((col) => (
            <nav key={col.titulo} aria-label={col.titulo}>
              <h4 className="text-xs font-bold uppercase tracking-widest text-neutral-500">{col.titulo}</h4>
              <ul className="mt-4 space-y-2.5">
                {col.enlaces.map((enlace) => (
                  <li key={enlace.href}>
                    <Link href={enlace.href} className="text-sm text-neutral-400 transition-colors hover:text-marca-ambar">
                      {enlace.texto}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>
      </div>

      <div className="border-t border-marca-borde/60">
        <div className="seccion flex flex-col items-center justify-between gap-3 py-6 text-xs text-neutral-600 sm:flex-row">
          <p>© {new Date().getFullYear()} MIKYRA LIFE · mikyra.roadshop.online · Hecho con luz roja en Madrid</p>
          <p>Pagos seguros con Stripe · No somos sustituto de consejo médico</p>
        </div>
      </div>
    </footer>
  )
}
