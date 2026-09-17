/**
 * MIKYRA LIFE - Tipos globales de la aplicación
 */

/** Especificaciones técnicas mostradas en la página de producto */
export interface Especificaciones {
  peso?: string
  material_montura?: string
  material_lente?: string
  bloqueo?: string
  certificacion?: string
  [clave: string]: string | undefined
}

/** Producto de la tienda (tabla Supabase `productos`) */
export interface Producto {
  id: string
  nombre: string
  slug: string
  descripcion: string
  descripcionCorta: string
  precio: number
  precioOriginal: number | null
  /** URLs de imágenes (pueden ser locales /public o de Cloudinary) */
  imagenes: string[]
  categoriaId: string | null
  categoriaSlug: string
  stock: number
  activo: boolean
  destacado: boolean
  caracteristicas: string[]
  especificaciones: Especificaciones
  tags: string[]
  /** IDs de CJ Dropshipping para crear el pedido automáticamente */
  cjProductId: string | null
  cjVariantId: string | null
  metaTitle: string | null
  metaDescription: string | null
  ventasTotal: number
  ratingPromedio: number
  reviewsTotal: number
}

export interface Categoria {
  id: string
  nombre: string
  slug: string
  descripcion: string | null
  orden: number
}

/** Línea del carrito (guardado en localStorage vía Zustand) */
export interface ItemCarrito {
  productoId: string
  slug: string
  nombre: string
  precio: number
  imagen: string
  cantidad: number
  cjVariantId: string | null
}

/** Fila devuelta por Supabase (snake_case) - se mapea con mapearProducto() */
export interface ProductoFila {
  id: string
  nombre: string
  slug: string
  descripcion: string | null
  descripcion_corta: string | null
  precio: number
  precio_original: number | null
  imagenes: string[] | null
  categoria_id: string | null
  stock: number | null
  activo: boolean | null
  destacado: boolean | null
  caracteristicas: string[] | null
  especificaciones: Especificaciones | null
  tags: string[] | null
  cj_product_id: string | null
  cj_sku: string | null
  meta_title: string | null
  meta_description: string | null
  ventas_total: number | null
  rating_promedio: number | null
  reviews_total: number | null
}

/** Pedido (tabla Supabase `pedidos`) */
export type EstadoPedido =
  | 'pendiente'
  | 'pagado'
  | 'procesando'
  | 'enviado'
  | 'entregado'
  | 'cancelado'

export interface Pedido {
  id: string
  numero_pedido: string
  estado: EstadoPedido
  items: Array<Record<string, unknown>>
  subtotal: number
  envio: number
  total: number
  cliente_email: string
  cliente_nombre: string | null
  cliente_telefono: string | null
  direccion_linea1: string | null
  ciudad: string | null
  codigo_postal: string | null
  provincia: string | null
  pais: string | null
  cj_order_id: string | null
  tracking_number: string | null
  tracking_url: string | null
  notas?: string | null
  created_at: string
}

export interface Review {
  id: string
  productoId: string
  nombre: string
  rating: number
  titulo: string | null
  comentario: string
  verificado: boolean
  fecha: string
}

/** Respuesta estándar de las APIs internas */
export interface ApiResponse<T = unknown> {
  ok: boolean
  data?: T
  error?: string
  /** true cuando la acción no pudo completarse por faltar configuración (modo demo) */
  demo?: boolean
}
