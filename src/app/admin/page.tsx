import { AdminPedidos } from '@/components/admin/AdminPedidos'

export const metadata = { title: 'Pedidos — Admin' }

/**
 * Dashboard de pedidos: ventas por estado, acciones CJ y tracking.
 * Los datos se leen vía /api/admin/pedidos (cookie de sesión del middleware).
 */
export default function AdminPage() {
  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white">Pedidos</h1>
          <p className="mt-1 text-sm text-neutral-500">
            Flujo: pendiente → pagado (webhook) → procesando (CJ) → enviado (tracking) → entregado
          </p>
        </div>
        <a
          href="/api/admin/logout"
          className="rounded-lg border border-neutral-800 px-3 py-1.5 text-xs text-neutral-400 hover:text-white"
        >
          Cerrar sesión
        </a>
      </div>
      <AdminPedidos />
    </div>
  )
}
