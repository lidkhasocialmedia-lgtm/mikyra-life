import Image from 'next/image'
import Link from 'next/link'
import { cargarProductos, esProductoDemo } from '@/lib/seed'
import { formatearPrecio } from '@/lib/utils'

export const metadata = { title: 'Productos — Admin' }

/**
 * Gestión básica de productos (v1): listado con estado, precio, stock y CJ id.
 * La edición profunda se hace en Supabase Table Editor (más rápido y seguro
 * que recrear un CRM entero en la semana 1).
 */
export default async function AdminProductosPage() {
  const productos = await cargarProductos()

  return (
    <div>
      <h1 className="text-2xl font-black text-white">Productos</h1>
      <p className="mt-1 text-sm text-neutral-500">
        Fuente: Supabase (si está configurado) · Editar en profundidad →{' '}
        <a href="https://supabase.com/dashboard" target="_blank" rel="noopener noreferrer" className="text-marca-ambar underline">
          Supabase Table Editor
        </a>
      </p>

      <div className="mt-6 overflow-x-auto rounded-xl border border-marca-borde">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead className="bg-black/60 text-xs uppercase tracking-wider text-neutral-500">
            <tr>
              <th className="px-4 py-3">Producto</th>
              <th className="px-4 py-3">Precio</th>
              <th className="px-4 py-3">Stock</th>
              <th className="px-4 py-3">CJ</th>
              <th className="px-4 py-3">Destacado</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-marca-borde">
            {productos.map((p) => (
              <tr key={p.id} className="hover:bg-white/[0.02]">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="relative h-11 w-11 overflow-hidden rounded-lg border border-marca-borde bg-black">
                      <Image src={p.imagenes[0]} alt="" width={44} height={44} className="h-full w-full object-cover" unoptimized={p.imagenes[0].endsWith('.svg')} />
                    </div>
                    <div>
                      <Link href={`/productos/${p.slug}`} className="font-semibold text-white hover:text-marca-ambar">
                        {p.nombre}
                      </Link>
                      <p className="text-xs text-neutral-500">/{p.slug}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 font-bold text-marca-ambar">{formatearPrecio(p.precio)}</td>
                <td className="px-4 py-3 text-neutral-300">{p.stock}</td>
                <td className="px-4 py-3">
                  {p.cjProductId ? (
                    <code className="text-xs text-green-400">{p.cjProductId}</code>
                  ) : (
                    <code className="text-xs text-amber-400">sin vincular</code>
                  )}
                </td>
                <td className="px-4 py-3">{p.destacado ? '★' : '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {productos.every(esProductoDemo) && (
        <div className="mt-6 rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 text-sm text-amber-200">
          Estás viendo el catálogo <strong>semilla</strong>. Ejecuta{' '}
          <code className="rounded bg-black px-1.5 py-0.5">node scripts/seed-supabase.mjs</code> tras configurar
          Supabase para poblar la tabla <code className="rounded bg-black px-1.5 py-0.5">productos</code>.
        </div>
      )}
    </div>
  )
}
