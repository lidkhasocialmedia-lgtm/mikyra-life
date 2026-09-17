import { forwardRef } from 'react'
import { cn } from '@/lib/utils'

/**
 * Botón de marca MIKYRA LIFE (CVA-like, sin dependencias extra).
 * Variante primaria = ámbar (CTA), secundaria = contorno, oscura = rojo profundo.
 */

export type VarianteBoton = 'primario' | 'secundario' | 'oscuro' | 'fantasma'
export type TamanoBoton = 'sm' | 'md' | 'lg'

const variantes: Record<VarianteBoton, string> = {
  primario:
    'bg-marca-ambar text-black hover:bg-marca-ambar-claro shadow-glow-ambar focus-visible:ring-marca-ambar',
  secundario:
    'border border-neutral-700 bg-transparent text-neutral-100 hover:border-marca-ambar hover:text-marca-ambar focus-visible:ring-neutral-400',
  oscuro:
    'bg-marca-rojo text-white hover:bg-marca-rojo-claro shadow-glow-rojo focus-visible:ring-marca-brasa',
  fantasma: 'bg-transparent text-neutral-300 hover:text-white hover:bg-white/5 focus-visible:ring-neutral-500',
}

const tamanos: Record<TamanoBoton, string> = {
  sm: 'h-9 px-3 text-sm gap-1.5',
  md: 'h-11 px-5 text-sm gap-2',
  lg: 'h-13 px-8 py-3.5 text-base gap-2.5',
}

/** Mismas clases visuales para usar en <Link> y no anidar <button> dentro de <a> */
export function clasesDeBoton(variante: VarianteBoton = 'primario', tamano: TamanoBoton = 'md', extra?: string) {
  return cn(
    'inline-flex items-center justify-center rounded-xl font-semibold tracking-wide transition-all duration-200',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-marca-fondo',
    'active:scale-[0.98]',
    variantes[variante],
    tamanos[tamano],
    extra
  )
}

export interface BotonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variante?: VarianteBoton
  tamano?: TamanoBoton
  cargando?: boolean
}

export const Boton = forwardRef<HTMLButtonElement, BotonProps>(
  ({ className, variante = 'primario', tamano = 'md', cargando = false, disabled, children, ...props }, ref) => (
    <button
      ref={ref}
      disabled={disabled || cargando}
      className={cn(
        'inline-flex items-center justify-center rounded-xl font-semibold tracking-wide transition-all duration-200',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-marca-fondo',
        'active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50',
        variantes[variante],
        tamanos[tamano],
        className
      )}
      {...props}
    >
      {cargando && (
        <span
          aria-hidden
          className="mr-1 inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
        />
      )}
      {children}
    </button>
  )
)

Boton.displayName = 'Boton'
