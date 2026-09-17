import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { ItemCarrito, Producto } from '@/types'
import { calcularEnvio } from '@/lib/utils'

/**
 * MIKYRA LIFE - Store global del carrito (Zustand + persist).
 * Se sincroniza con localStorage para sobrevivir a recargas.
 */

interface CarritoEstado {
  items: ItemCarrito[]
  abierto: boolean
  añadir: (producto: Producto, cantidad?: number) => void
  quitar: (productoId: string) => void
  cambiarCantidad: (productoId: string, cantidad: number) => void
  vaciar: () => void
  setAbierto: (abierto: boolean) => void
}

const MAXIMO_POR_PRODUCTO = 10

export const useCarritoStore = create<CarritoEstado>()(
  persist(
    (set) => ({
      items: [],
      abierto: false,

      añadir: (producto, cantidad = 1) =>
        set((estado) => {
          const existente = estado.items.find((i) => i.productoId === producto.id)
          if (existente) {
            return {
              items: estado.items.map((i) =>
                i.productoId === producto.id
                  ? { ...i, cantidad: Math.min(i.cantidad + cantidad, MAXIMO_POR_PRODUCTO) }
                  : i
              ),
            }
          }
          const item: ItemCarrito = {
            productoId: producto.id,
            slug: producto.slug,
            nombre: producto.nombre,
            precio: producto.precio,
            imagen: producto.imagenes[0] ?? '/images/productos/mikyra-pro-red-frontal.svg',
            cantidad: Math.min(cantidad, MAXIMO_POR_PRODUCTO),
            cjVariantId: producto.cjVariantId,
          }
          return { items: [...estado.items, item] }
        }),

      quitar: (productoId) =>
        set((estado) => ({ items: estado.items.filter((i) => i.productoId !== productoId) })),

      cambiarCantidad: (productoId, cantidad) =>
        set((estado) => ({
          items:
            cantidad <= 0
              ? estado.items.filter((i) => i.productoId !== productoId)
              : estado.items.map((i) =>
                  i.productoId === productoId ? { ...i, cantidad: Math.min(cantidad, MAXIMO_POR_PRODUCTO) } : i
                ),
        })),

      vaciar: () => set({ items: [] }),
      setAbierto: (abierto) => set({ abierto }),
    }),
    {
      name: 'mikyra-carrito',
      storage: createJSONStorage(() => localStorage),
      // El drawer no debe persistirse abierto
      partialize: (estado) => ({ items: estado.items }),
    }
  )
)

/** Selectores derivados - usar estos en componentes, no calcular inline */
export function selectTotales(items: ItemCarrito[]) {
  const subtotal = items.reduce((acc, i) => acc + i.precio * i.cantidad, 0)
  const unidades = items.reduce((acc, i) => acc + i.cantidad, 0)
  const envio = calcularEnvio(subtotal)
  return { subtotal, unidades, envio, total: subtotal + envio }
}
