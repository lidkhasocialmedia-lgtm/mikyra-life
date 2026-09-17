'use client'

import { useCallback, useEffect, useState } from 'react'
import { Loader2, PackageCheck, RefreshCcw, Send } from 'lucide-react'
import type { EstadoPedido, Pedido } from '@/types'
import { formatearPrecio } from '@/lib/utils'
import { cn } from '@/lib/utils'

const ESTADOS: Array<EstadoPedido | 'todos'> = ['todos', 'pendiente', 'pagado', 'procesando', 'enviado', 'entregado', 'cancelado']

const COLOR_ESTADO: Record<string, string> = {
  pendiente: 'bg-neutral-500/15 text-neutral-300',
  pagado: 'bg-amber-500/15 text-amber-300',
  procesando: 'bg-blue-500/15 text-blue-300',
  enviado: 'bg-purple-500/15 text-purple-300',
  entregado: 'bg-green-500/15 text-green-300',
  cancelado: 'bg-red-500/15 text-red-300',
}

/**
 * Tabla operativa del panel: filtrar por estado, enviar a CJ, sincronizar tracking.
 */
export function AdminPedidos() {
  const [pedidos, setPedidos] = useState<Pedido[]>([])
  const [estado, setEstado] = useState<EstadoPedido | 'todos'>('todos')
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [ocupado, setOcupado] = useState<string | null>(null)

  const cargar = useCallback(async () => {
    setCargando(true)
    setError(null)
    try {
      const params = estado !== 'todos' ? `?estado=${estado}` : ''
      const res = await fetch(`/api/admin/pedidos${params}`)
      const json = await res.json()
      if (!res.ok || !json.ok) throw new Error(json.error ?? `HTTP ${res.status}`)
      setPedidos(json.data ?? [])
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error')
    } finally {
      setCargando(false)
    }
  }, [estado])

  useEffect(() => {
    void cargar()
  }, [cargar])

  async function accion(id: string, accionNombre: 'enviar-cj' | 'sincronizar-tracking') {
    setOcupado(`${id}-${accionNombre}`)
    try {
      const res = await fetch('/api/admin/pedidos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, accion: accionNombre }),
      })
      const json = await res.json()
      if (!json.ok) alert(`Error: ${json.error}`)
      await cargar()
    } finally {
      setOcupado(null)
    }
  }

  async function actualizarTracking(id: string, numero: string, url: string) {
    setOcupado(`${id}-tracking`)
    try {
      const res = await fetch('/api/admin/pedidos', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, tracking_number: numero, tracking_url: url, estado: 'enviado' }),
      })
      const json = await res.json()
      if (!json.ok) alert(`Error: ${json.error}`)
      await cargar()
    } finally {
      setOcupado(null)
    }
  }

  return (
    <div className="mt-6">
      {/* Filtros */}
      <div className="flex flex-wrap gap-2">
        {ESTADOS.map((e) => (
          <button
            key={e}
            type="button"
            onClick={() => setEstado(e)}
            className={cn(
              'rounded-full border px-3.5 py-1.5 text-xs font-semibold capitalize transition-colors',
              estado === e ? 'border-marca-ambar bg-marca-ambar text-black' : 'border-neutral-800 text-neutral-400 hover:text-white'
            )}
          >
            {e}
          </button>
        ))}
        <button
          type="button"
          onClick={() => void cargar()}
          className="ml-auto flex items-center gap-1.5 rounded-full border border-neutral-800 px-3 py-1.5 text-xs text-neutral-400 hover:text-white"
        >
          <RefreshCcw className="h-3.5 w-3.5" /> Actualizar
        </button>
      </div>

      {error && (
        <div className="mt-6 rounded-xl border border-red-500/40 bg-red-500/10 p-4 text-sm text-red-300">
          {error} — recuerda configurar Supabase y ADMIN_TOKEN.
        </div>
      )}

      {cargando ? (
        <div className="mt-16 flex justify-center text-neutral-500">
          <Loader2 className="h-6 w-6 animate-spin" />
        </div>
      ) : pedidos.length === 0 ? (
        <p className="mt-16 text-center text-sm text-neutral-500">No hay pedidos en este estado.</p>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-xl border border-marca-borde">
          <table className="w-full min-w-[900px] text-left text-sm">
            <thead className="bg-black/60 text-xs uppercase tracking-wider text-neutral-500">
              <tr>
                <th className="px-4 py-3">Pedido</th>
                <th className="px-4 py-3">Cliente</th>
                <th className="px-4 py-3">Total</th>
                <th className="px-4 py-3">Estado</th>
                <th className="px-4 py-3">Tracking</th>
                <th className="px-4 py-3">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-marca-borde">
              {pedidos.map((p) => (
                <tr key={p.id} className="align-top hover:bg-white/[0.02]">
                  <td className="px-4 py-3">
                    <p className="font-bold text-white">{p.numero_pedido}</p>
                    <p className="text-xs text-neutral-500">{new Date(p.created_at).toLocaleString('es-ES')}</p>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-neutral-200">{p.cliente_nombre}</p>
                    <p className="text-xs text-neutral-500">{p.cliente_email}</p>
                    <p className="text-xs text-neutral-600">
                      {p.direccion_linea1}, {p.ciudad} ({p.codigo_postal})
                    </p>
                  </td>
                  <td className="px-4 py-3 font-bold text-marca-ambar">{formatearPrecio(Number(p.total))}</td>
                  <td className="px-4 py-3">
                    <span className={cn('rounded-full px-2.5 py-1 text-xs font-semibold capitalize', COLOR_ESTADO[p.estado])}>
                      {p.estado}
                    </span>
                    {p.cj_order_id && <p className="mt-1 text-[11px] text-neutral-500">CJ: {p.cj_order_id}</p>}
                    {p.notas && <p className="mt-1 max-w-[180px] truncate text-[11px] text-amber-400/80">{p.notas}</p>}
                  </td>
                  <td className="px-4 py-3">
                    <TrackingEditor pedido={p} onGuardar={actualizarTracking} ocupado={ocupado === `${p.id}-tracking`} />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-col gap-1.5">
                      {(p.estado === 'pagado') && (
                        <button
                          type="button"
                          onClick={() => void accion(p.id, 'enviar-cj')}
                          disabled={ocupado === `${p.id}-enviar-cj`}
                          className="flex items-center gap-1.5 rounded-lg bg-marca-rojo px-2.5 py-1.5 text-xs font-semibold text-white hover:bg-marca-rojo-claro disabled:opacity-50"
                        >
                          {ocupado === `${p.id}-enviar-cj` ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Send className="h-3.5 w-3.5" />}
                          Enviar a CJ
                        </button>
                      )}
                      {p.cj_order_id && !p.tracking_number && (
                        <button
                          type="button"
                          onClick={() => void accion(p.id, 'sincronizar-tracking')}
                          disabled={ocupado === `${p.id}-sincronizar-tracking`}
                          className="flex items-center gap-1.5 rounded-lg border border-neutral-700 px-2.5 py-1.5 text-xs text-neutral-300 hover:border-marca-ambar hover:text-marca-ambar disabled:opacity-50"
                        >
                          {ocupado === `${p.id}-sincronizar-tracking` ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <PackageCheck className="h-3.5 w-3.5" />}
                          Sync tracking
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

/** Editor inline de tracking (para pedidos que CJ aún no expone por API) */
function TrackingEditor({
  pedido,
  onGuardar,
  ocupado,
}: {
  pedido: Pedido
  onGuardar: (id: string, numero: string, url: string) => void
  ocupado: boolean
}) {
  const [editando, setEditando] = useState(false)
  const [numero, setNumero] = useState(pedido.tracking_number ?? '')
  const [url, setUrl] = useState(pedido.tracking_url ?? '')

  if (!editando && pedido.tracking_number) {
    return pedido.tracking_url ? (
      <a href={pedido.tracking_url} target="_blank" rel="noopener noreferrer" className="text-xs text-marca-ambar underline">
        {pedido.tracking_number}
      </a>
    ) : (
      <span className="text-xs text-neutral-300">{pedido.tracking_number}</span>
    )
  }

  if (!editando) {
    return (
      <button type="button" onClick={() => setEditando(true)} className="text-xs text-neutral-500 underline hover:text-white">
        + Añadir tracking
      </button>
    )
  }

  return (
    <form
      className="flex w-40 flex-col gap-1"
      onSubmit={(e) => {
        e.preventDefault()
        onGuardar(pedido.id, numero.trim(), url.trim())
        setEditando(false)
      }}
    >
      <input
        value={numero}
        onChange={(e) => setNumero(e.target.value)}
        placeholder="Nº seguimiento"
        className="rounded border border-neutral-800 bg-black px-2 py-1 text-xs text-white"
      />
      <input
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="URL tracking"
        className="rounded border border-neutral-800 bg-black px-2 py-1 text-xs text-white"
      />
      <button type="submit" disabled={ocupado || !numero} className="rounded bg-marca-ambar px-2 py-1 text-xs font-bold text-black disabled:opacity-50">
        Guardar
      </button>
    </form>
  )
}
