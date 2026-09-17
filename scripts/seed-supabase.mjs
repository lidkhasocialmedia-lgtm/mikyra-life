/**
 * MIKYRA LIFE - Seed de productos hacia Supabase (FASE 2 opcional).
 *
 * Uso (necesitas el paquete supabase-js del proyecto ya instalado):
 *   SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... node scripts/seed-supabase.mjs
 *
 * Inserta los 3 productos core con las imágenes placeholder locales.
 * Idempotente: hace upsert por slug.
 */
import { createClient } from '@supabase/supabase-js'

const url = process.env.SUPABASE_URL
const key = process.env.SUPABASE_SERVICE_ROLE_KEY
if (!url || !key) {
  console.error('Faltan SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY como variables de entorno.')
  process.exit(1)
}

const supabase = createClient(url, key)

const { data: cats, error: errCats } = await supabase.from('categorias').select('id, slug')
if (errCats) throw errCats
const catId = (slug) => cats?.find((c) => c.slug === slug)?.id ?? null

const imagen = (slug, vista) => `/images/productos/${slug}-${vista}.svg`

const productos = [
  {
    nombre: 'MIKYRA PRO Red',
    slug: 'mikyra-pro-red',
    descripcion_corta: 'Bloqueo del 100% de luz roja. Tu aliado para recuperar el sueño profundo.',
    precio: 49.99,
    precio_original: 89.99,
    categoria_id: catId('luz-roja-nocturna'),
    imagenes: [imagen('mikyra-pro-red', 'frontal'), imagen('mikyra-pro-red', 'angular'), imagen('mikyra-pro-red', 'detallando')],
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
    destacado: true,
    meta_title: 'MIKYRA PRO Red | Gafas que bloquean el 100% de la luz roja',
    meta_description: 'Gafas nocturnas con bloqueo total 620-750nm + protección IR-C. Recupera tu melatonina. 49,99 € con garantía de 30 días.',
  },
  {
    nombre: 'MIKYRA BLACKOUT Zero',
    slug: 'mikyra-blackout',
    descripcion_corta: 'Bloqueo total del espectro visible para turnos de noche y siestas perfectas.',
    precio: 79.99,
    precio_original: 129.99,
    categoria_id: catId('bloqueo-total'),
    imagenes: [imagen('mikyra-blackout', 'frontal'), imagen('mikyra-blackout', 'angular'), imagen('mikyra-blackout', 'detallando')],
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
    destacado: false,
    meta_title: 'MIKYRA BLACKOUT Zero | Oscuridad absoluta para dormir siempre',
    meta_description: 'Bloqueo total del espectro visible. Para turnos de noche, siestas y hoteles. 79,99 € con envío desde almacén EU.',
  },
  {
    nombre: 'MIKYRA DayShield Amber',
    slug: 'mikyra-dayshield',
    descripcion_corta: 'Filtro ámbar diurno: pantallas sin fatiga y melatonina lista para la noche.',
    precio: 34.99,
    precio_original: 59.99,
    categoria_id: catId('luz-azul-diurna'),
    imagenes: [imagen('mikyra-dayshield', 'frontal'), imagen('mikyra-dayshield', 'angular'), imagen('mikyra-dayshield', 'detallando')],
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
    destacado: false,
    meta_title: 'MIKYRA DayShield Amber | Gafas de luz azul para el día',
    meta_description: 'Bloqueo total de luz azul y filtro verde de grado clínico. Fatiga digital -80%. 34,99 € con garantía 30 días.',
  },
]

for (const p of productos) {
  const { error } = await supabase.from('productos').upsert({ ...p, activo: true, stock: 999 }, { onConflict: 'slug' })
  if (error) {
    console.error(`❌ ${p.slug}:`, error.message)
  } else {
    console.log(`✅ ${p.nombre} insertado/actualizado`)
  }
}

console.log('\nSeed completado. Verifica en Supabase → Table Editor → productos.')
