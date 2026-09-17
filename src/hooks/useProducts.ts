'use client'

import { useEffect, useState } from 'react'
import type { Producto } from '@/types'

/**
 * Hook para consumir el catálogo desde /api/productos (filtro por categoría).
 * Útil en componentes cliente (relacionados, filtros del catálogo).
 * El renderizado principal usa Server Components con cargarProductos().
 */
export function useProductos(categoriaSlug?: string) {
  const [productos, setProductos] = useState<Producto[]>([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelado = false

    async function cargar() {
      try {
        const params = categoriaSlug ? `?categoria=${encodeURIComponent(categoriaSlug)}` : ''
        const res = await fetch(`/api/productos${params}`)
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const json = await res.json()
        if (!cancelado) {
          setProductos(json.ok ? json.data : [])
        }
      } catch (e) {
        if (!cancelado) setError(e instanceof Error ? e.message : 'Error de red')
      } finally {
        if (!cancelado) setCargando(false)
      }
    }

    void cargar()
    return () => {
      cancelado = true
    }
  }, [categoriaSlug])

  return { productos, cargando, error }
}
