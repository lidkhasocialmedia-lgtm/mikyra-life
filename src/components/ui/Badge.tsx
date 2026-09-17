import { cn } from '@/lib/utils'

/** Etiqueta pequeña de marca */
export function Badge({
  children,
  className,
  tono = 'ambar',
}: {
  children: React.ReactNode
  className?: string
  tono?: 'ambar' | 'rojo' | 'neutro' | 'verde'
}) {
  const tonos = {
    ambar: 'bg-marca-ambar/15 text-marca-ambar border-marca-ambar/30',
    rojo: 'bg-marca-rojo/20 text-marca-brasa border-marca-rojo/40',
    neutro: 'bg-white/5 text-neutral-300 border-white/10',
    verde: 'bg-green-500/15 text-green-400 border-green-500/30',
  } as const

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-widest',
        tonos[tono],
        className
      )}
    >
      {children}
    </span>
  )
}
