'use client'

import { useEffect, useMemo, useState } from 'react'
import { useCarritoStore, selectTotales } from '@/store/cartStore'
import type { ItemCarrito } from '@/types'

/**
 * Hook de carrito para componentes.
 * Evita el "hydration mismatch": hasta que no se monta en cliente,
 * devuelve el carrito vacío.
 */
export function useCarrito() {
  const items = useCarritoStore((s) => s.items)
  const añadir = useCarritoStore((s) => s.añadir)
  const quitar = useCarritoStore((s) => s.quitar)
  const cambiarCantidad = useCarritoStore((s) => s.cambiarCantidad)
  const vaciar = useCarritoStore((s) => s.vaciar)
  const abierto = useCarritoStore((s) => s.abierto)
  const setAbierto = useCarritoStore((s) => s.setAbierto)

  const [montado, setMontado] = useState(false)
  useEffect(() => setMontado(true), [])

  const itemsSeguros = useMemo<ItemCarrito[]>(() => (montado ? items : []), [montado, items])
  const totales = useMemo(() => selectTotales(itemsSeguros), [itemsSeguros])

  return {
    items: itemsSeguros,
    ...totales,
    montado,
    añadir,
    quitar,
    cambiarCantidad,
    vaciar,
    abierto,
    abrir: () => setAbierto(true),
    cerrar: () => setAbierto(false),
    toggle: () => setAbierto(!abierto),
  }
}
