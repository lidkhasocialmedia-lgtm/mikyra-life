import { NextRequest, NextResponse } from 'next/server'

/**
 * Protección del panel /admin con cookie HttpOnly emitida por /api/admin/login
 * (contraseña = env ADMIN_TOKEN). Suficiente para v1 de un dropshipping;
 * migrar a Supabase Auth cuando el volumen lo justifique.
 */
export function middleware(request: NextRequest) {
  const token = process.env.ADMIN_TOKEN
  const cookie = request.cookies.get('mikyra_admin')?.value

  // Si el owner aún no configuró ADMIN_TOKEN, no dejamos el panel abierto:
  if (!token) {
    // /admin/config debe seguir accesible para no crear bucle de redirecciones
    if (request.nextUrl.pathname.startsWith('/admin/config')) return NextResponse.next()
    return NextResponse.redirect(new URL('/admin/config', request.url))
  }

  if (cookie !== token) {
    if (request.nextUrl.pathname.startsWith('/api/admin')) {
      return NextResponse.json({ ok: false, error: 'No autorizado' }, { status: 401 })
    }
    return NextResponse.redirect(new URL('/admin/login', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
}
