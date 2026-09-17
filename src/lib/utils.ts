import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

/** Combina clases de Tailwind sin conflictos */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** Formatea un número como precio EUR (es-ES) */
export function formatearPrecio(valor: number): string {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR',
  }).format(valor)
}

/** Descuento aplicado sobre el precio original, en % (o null) */
export function calcularDescuento(precio: number, precioOriginal: number | null): number | null {
  if (!precioOriginal || precioOriginal <= precio) return null
  return Math.round((1 - precio / precioOriginal) * 100)
}

/** Envío gratuito a partir de 60€ (política de la tienda) */
export const UMBRAL_ENVIO_GRATIS = 60
export const COSTE_ENVIO = 4.99

export function calcularEnvio(subtotal: number): number {
  return subtotal >= UMBRAL_ENVIO_GRATIS || subtotal === 0 ? 0 : COSTE_ENVIO
}

/** Genera un id client-side para el checkout (client_reference_id) */
export function generarIdCliente(): string {
  if (typeof globalThis.crypto?.randomUUID === 'function') {
    return globalThis.crypto.randomUUID()
  }
  return `cli-${Date.now()}-${Math.floor(Math.random() * 1_000_000)}`
}
