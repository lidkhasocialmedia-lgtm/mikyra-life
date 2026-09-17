'use client'

import { useState } from 'react'
import { Check, ShoppingCart } from 'lucide-react'
import type { Producto } from '@/types'
import { useCarritoStore } from '@/store/cartStore'
import { cn } from '@/lib/utils'
import { Boton } from '@/components/ui/Button'

/**
 * Botón Añadir al carrito con feedback de confirmación.
 * Abre el drawer tras añadir (configurable) y limita a 10 uds/producto.
 */
export function AddToCart({
  producto,
  compacto = false,
  cantidad = 1,
  abrirDrawer = true,
}: {
  producto: Producto
  compacto?: boolean
  cantidad?: number
  abrirDrawer?: boolean
}) {
  const añadir = useCarritoStore((s) => s.añadir)
  const setAbierto = useCarritoStore((s) => s.setAbierto)
  const [exito, setExito] = useState(false)

  function handleClick(e: React.MouseEvent) {
    e.preventDefault() // no navegar cuando está dentro de la tarjeta enlazada
    e.stopPropagation()
    añadir(producto, cantidad)
    setExito(true)
    if (abrirDrawer) setAbierto(true)
    window.setTimeout(() => setExito(false), 1600)
  }

  return (
    <Boton
      variante={compacto ? 'oscuro' : 'primario'}
      tamano={compacto ? 'sm' : 'lg'}
      onClick={handleClick}
      className={cn(!compacto && 'w-full sm:w-auto', exito && 'border border-green-500/50 bg-green-600 text-white shadow-none hover:bg-green-600')}
      aria-label={`Añadir ${producto.nombre} al carrito`}
    >
      {exito ? (
        <>
          <Check className="h-4 w-4" />
          {compacto ? 'Añadido' : '¡En tu carrito!'}
        </>
      ) : (
        <>
          <ShoppingCart className="h-4 w-4" />
          {compacto ? 'Añadir' : 'Añadir al carrito'}
        </>
      )}
    </Boton>
  )
}
