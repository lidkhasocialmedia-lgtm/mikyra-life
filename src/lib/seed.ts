import type { Producto, ProductoFila, Review } from '@/types'
import { getSupabase } from './supabase'

/**
 * MIKYRA LIFE - Catálogo semilla + capa de acceso a productos.
 *
 * Estrategia "funciona sin backend":
 * - Si Supabase está configurado -> se leen los productos de la BD (mapeados a camelCase).
 * - Si no -> se sirven estos datos de seed, para poder desarrollar y hacer deploy
 *   de la tienda completa antes de conectar la base de datos.
 *
 * Imágenes: placeholders SVG locales generados por nosotros. Sustituir por fotos
 * reales (Cloudinary o Supabase Storage) cuando tengas las de CJ.
 */

const imagen = (slug: string, vista: string) => `/images/productos/${slug}-${vista}.svg`

type ProductoSeed = Omit<
  Producto,
  | 'categoriaId'
  | 'stock'
  | 'activo'
  | 'ventasTotal'
  | 'cjProductId'
  | 'cjVariantId'
  | 'metaTitle'
  | 'metaDescription'
> & {
  categoriaSlug: string
}

export const CATEGORIAS_SEED = [
  { slug: 'luz-roja-nocturna', nombre: 'Luz Roja Nocturna', descripcion: 'Bloquean luz roja para preservar melatonina por la noche', orden: 1 },
  { slug: 'bloqueo-total', nombre: 'Bloqueo Total', descripcion: 'Máxima protección para dormidores exigentes', orden: 2 },
  { slug: 'luz-azul-diurna', nombre: 'Luz Azul Diurna', descripcion: 'Para uso en pantallas durante el día', orden: 3 },
] as const

const SEMILLA: ProductoSeed[] = [
  {
    id: 'seed-mikyra-pro-red',
    nombre: 'MIKYRA PRO Red',
    slug: 'mikyra-pro-red',
    descripcionCorta:
      'Bloqueo del 100% de luz roja e infrarroja cercana. Tu aliado para recuperar el sueño profundo.',
    descripcion: `Las MIKYRA PRO Red están diseñadas para bloquear completamente el espectro de luz roja (620-750 nm) y parte del infrarrojo cercano (750-1400 nm), longitudes de onda que, presentes en bombillas LED, pantallas y lámparas de techo siguen alterando tu señal circadiana incluso en "modo noche".

La ciencia es clara: la luz rica en rojo e infrarrojo llega a la retina y frena la producción de melatonina en la glándula pineal. Con las PRO Red puedes mantener encendida tu luz ambiental roja, leer, trabajar o ver una serie sin sabotear la ventana de sueño que tanto cuesta construir.

Montura TR90 ultraligera (23 g) que desaparece en la cara, lentes de policarbonato clase 1 con transmisión de luz visible <1% y un ajuste pensado para dormir de lado sin presión en las sienes.`,
    precio: 49.99,
    precioOriginal: 89.99,
    imagenes: [imagen('mikyra-pro-red', 'frontal'), imagen('mikyra-pro-red', 'angular'), imagen('mikyra-pro-red', 'detallando')],
    categoriaSlug: 'luz-roja-nocturna',
    destacado: true,
    ratingPromedio: 4.8,
    reviewsTotal: 127,
    caracteristicas: [
      'Bloqueo 100% luz roja 620-750nm',
      'Protección infrarroja cercana 750-1400nm',
      'Montura TR90 ultraligera 23g',
      'Lente de policarbonato clase 1',
      'Incluye funda rígida + paño',
    ],
    especificaciones: {
      peso: '23g',
      material_montura: 'TR90',
      material_lente: 'Policarbonato',
      bloqueo: '620-750nm 100%',
      certificacion: 'CE EN ISO 12312-1',
    },
    tags: ['luz roja', 'melatonina', 'sueño', 'biohacking', 'nocturnas'],
  },
  {
    id: 'seed-mikyra-blackout',
    nombre: 'MIKYRA BLACKOUT Zero',
    slug: 'mikyra-blackout',
    descripcionCorta:
      'Bloqueo total del espectro visible. Oscuridad absoluta para quienes no pueden permitirse un solo fotón.',
    descripcion: `Las MIKYRA BLACKOUT Zero llevan el bloqueo un paso más allá: opacas al 100% en todo el espectro visible (380-1400 nm). Ideales para turnos de noche, siestas estratégicas, hoteles con mala blackout, uso tras cirugía o sesiones de sensor deprivation y meditación profunda.

El diseño de celda de silicona suave sella el contorno ocular sin presionar, permitiendo el uso 24/7 según los protocolos de oscuridad total de Huberman y Walker. Montura flexible con plegado plano para viajar.

Nota: con ellas puestas no puedes ver. Son para dormir, descansar o practicar oscuridad intencional, no para caminar por la calle.`,
    precio: 79.99,
    precioOriginal: 129.99,
    imagenes: [imagen('mikyra-blackout', 'frontal'), imagen('mikyra-blackout', 'angular'), imagen('mikyra-blackout', 'detallando')],
    categoriaSlug: 'bloqueo-total',
    destacado: false,
    ratingPromedio: 4.9,
    reviewsTotal: 64,
    caracteristicas: [
      'Bloqueo total del espectro visible 380-1400nm',
      'Celda de silicona hipoalergénica sellante',
      'Uso 24/7 aprobado en protocolos de blackout',
      'Plegable y apta para almohada',
      'Incluye funda rígida + 3 almohadillas de recambio',
    ],
    especificaciones: {
      peso: '28g',
      material_montura: 'Silicona + TR90',
      material_lente: 'Opaco total',
      bloqueo: '380-1400nm 100%',
      certificacion: 'CE',
    },
    tags: ['bloqueo total', 'turnos de noche', 'siesta', 'blackout', 'meditación'],
  },
  {
    id: 'seed-mikyra-dayshield',
    nombre: 'MIKYRA DayShield Amber',
    slug: 'mikyra-dayshield',
    descripcionCorta:
      'Filtro ámbar de día: bloquea luz azul y parte de la verde para reducir fatiga digital y preparar la noche desde las 9am.',
    descripcion: `La exposición a luz azul y verde de alta energía durante el día no solo seca tu parpadeo y fatiga tu vista: también aplana el pico de cortisol matutino y retrasa tu curva de melatonina nocturna. Las MIKYRA DayShield usan lentes ámbar de grado clínico que filtran 100% de la luz azul (<480 nm) y un 55% de la verde (480-560 nm).

El matiz cálido reduce el deslumbramiento de pantallas LED, mejora el contraste en oficina y te acompaña desde la última hora de trabajo hasta la cena, cuando toca cambiar a las PRO Red.

Aptas para conducir de día (transmisión >8%) y compatibles con graduación.`,
    precio: 34.99,
    precioOriginal: 59.99,
    imagenes: [imagen('mikyra-dayshield', 'frontal'), imagen('mikyra-dayshield', 'angular'), imagen('mikyra-dayshield', 'detallando')],
    categoriaSlug: 'luz-azul-diurna',
    destacado: false,
    ratingPromedio: 4.7,
    reviewsTotal: 203,
    caracteristicas: [
      'Bloqueo 100% luz azul <480nm',
      'Filtro 55% luz verde 480-560nm',
      'Reduce fatiga digital y dolor de cabeza',
      'Aptas para conducir de día',
      'Compatibles con graduación',
    ],
    especificaciones: {
      peso: '21g',
      material_montura: 'TR90',
      material_lente: 'CR-39 ámbar',
      bloqueo: '<480nm 100% / 480-560nm 55%',
      certificacion: 'CE EN ISO 12312-1',
    },
    tags: ['luz azul', 'pantallas', 'oficina', 'día', 'fatiga digital'],
  },
]

/** Mapea una fila de Supabase (snake_case) al tipo de la app (camelCase) */
export function mapearProducto(fila: ProductoFila, categoriaSlug?: string): Producto {
  return {
    id: fila.id,
    nombre: fila.nombre,
    slug: fila.slug,
    descripcion: fila.descripcion ?? '',
    descripcionCorta: fila.descripcion_corta ?? '',
    precio: Number(fila.precio),
    precioOriginal: fila.precio_original != null ? Number(fila.precio_original) : null,
    imagenes: Array.isArray(fila.imagenes) && fila.imagenes.length > 0 ? fila.imagenes : [imagen(fila.slug, 'frontal')],
    categoriaId: fila.categoria_id,
    categoriaSlug: categoriaSlug ?? 'luz-roja-nocturna',
    stock: fila.stock ?? 999,
    activo: fila.activo ?? true,
    destacado: fila.destacado ?? false,
    caracteristicas: Array.isArray(fila.caracteristicas) ? fila.caracteristicas : [],
    especificaciones: fila.especificaciones ?? {},
    tags: Array.isArray(fila.tags) ? fila.tags : [],
    cjProductId: fila.cj_product_id,
    cjVariantId: fila.cj_sku,
    metaTitle: fila.meta_title,
    metaDescription: fila.meta_description,
    ventasTotal: fila.ventas_total ?? 0,
    ratingPromedio: Number(fila.rating_promedio ?? 0),
    reviewsTotal: fila.reviews_total ?? 0,
  }
}

/** En modo demo las URLs de imagen se asignan por convención slug-vista */
function conImagenesDemo(p: ProductoSeed): Producto {
  return {
    ...p,
    categoriaId: null,
    stock: 999,
    activo: true,
    ventasTotal: 0,
    cjProductId: null,
    cjVariantId: null,
    metaTitle: null,
    metaDescription: null,
  }
}

const PRODUCTOS_DEMO: Producto[] = SEMILLA.map(conImagenesDemo)

export function esProductoDemo(p: Pick<Producto, 'id'>): boolean {
  return p.id.startsWith('seed-')
}

/** Todos los productos activos (BD si existe, seed si no) */
export async function cargarProductos(): Promise<Producto[]> {
  const supabase = getSupabase()
  if (supabase) {
    const { data, error } = await supabase
      .from('productos')
      .select('*, categorias(slug)')
      .eq('activo', true)
      .order('destacado', { ascending: false })
      .order('created_at', { ascending: false })

    if (!error && data && data.length > 0) {
      return data.map((fila) =>
        mapearProducto(fila as unknown as ProductoFila, (fila as { categorias?: { slug?: string } }).categorias?.slug)
      )
    }
    console.error('[productos] error leyendo Supabase, uso seed:', error?.message)
  }
  return PRODUCTOS_DEMO
}

export async function cargarProductoPorSlug(slug: string): Promise<Producto | null> {
  const supabase = getSupabase()
  if (supabase) {
    const { data, error } = await supabase
      .from('productos')
      .select('*, categorias(slug)')
      .eq('slug', slug)
      .eq('activo', true)
      .maybeSingle()

    if (!error && data) {
      return mapearProducto(data as unknown as ProductoFila, (data as { categorias?: { slug?: string } }).categorias?.slug)
    }
    if (!error && !data) return null
    console.error('[productos] error leyendo Supabase, uso seed:', error?.message)
  }
  return PRODUCTOS_DEMO.find((p) => p.slug === slug) ?? null
}

export async function cargarDestacados(limite = 3): Promise<Producto[]> {
  const productos = await cargarProductos()
  return productos.filter((p) => p.destacado).slice(0, limite)
}

export function listarSlugsSemilla(): string[] {
  return PRODUCTOS_DEMO.map((p) => p.slug)
}

/** Reviews de ejemplo (solo demo; en producción vienen de la tabla reviews con aprobado=true) */
export const REVIEWS_DEMO: Review[] = [
  {
    id: 'r1',
    productoId: 'seed-mikyra-pro-red',
    nombre: 'Laura G.',
    rating: 5,
    titulo: 'Mi melatonina volvió',
    comentario:
      'Llevo 3 semanas usándolas desde las 21h. Antes me costaba 1 hora dormirme; ahora unos 15 minutos. Ojalá las hubiera comprado hace años.',
    verificado: true,
    fecha: '2026-08-21',
  },
  {
    id: 'r2',
    productoId: 'seed-mikyra-pro-red',
    nombre: 'Carlos M.',
    rating: 5,
    titulo: 'Trabajo a turnos y por fin funcionan',
    comentario: 'Con luz roja + estas gafas puedo leer antes de dormir sin que el cerebro se active. Calidad de montura muy buena para el precio.',
    verificado: true,
    fecha: '2026-07-30',
  },
  {
    id: 'r3',
    productoId: 'seed-mikyra-blackout',
    nombre: 'Aitana R.',
    rating: 4,
    titulo: 'Negro absoluto',
    comentario: 'Habitación con farola fuera y siestas de 2h como de noche. Algo de calor en el puente nasal si las usas con la luz muy encendida.',
    verificado: true,
    fecha: '2026-08-02',
  },
  {
    id: 'r4',
    productoId: 'seed-mikyra-dayshield',
    nombre: 'Diego F.',
    rating: 5,
    titulo: 'Adiós ojo seco',
    comentario: 'Programador 8-10h de pantalla. Con las DayShield parpadeo más, termino el día con la vista mucho más fresca y duermo mejor sin cambiármelas hasta la cena.',
    verificado: true,
    fecha: '2026-08-28',
  },
]

export function reviewsDeProducto(productoId: string): Review[] {
  return REVIEWS_DEMO.filter((r) => r.productoId === productoId)
}
