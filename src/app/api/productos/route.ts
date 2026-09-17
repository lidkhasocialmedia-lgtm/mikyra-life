import { NextRequest, NextResponse } from 'next/server'
import { cargarProductos } from '@/lib/seed'
import type { ApiResponse } from '@/types'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/**
 * GET /api/productos?categoria=<slug>
 * Catálogo JSON público (solo campos sin datos sensibles).
 */
export async function GET(request: NextRequest) {
  try {
    const categoria = request.nextUrl.searchParams.get('categoria')
    let productos = await cargarProductos()
    if (categoria) productos = productos.filter((p) => p.categoriaSlug === categoria)

    return NextResponse.json<ApiResponse>({
      ok: true,
      data: productos.map(({ descripcion, ...resto }) => ({ ...resto, descripcionLarga: Boolean(descripcion) })),
    })
  } catch (error) {
    console.error('[api/productos]', error)
    return NextResponse.json<ApiResponse>({ ok: false, error: 'Error cargando catálogo' }, { status: 500 })
  }
}
