import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'nodejs'

/**
 * POST /api/admin/login { token }
 * Emite la cookie httpOnly 'mikyra_admin' si el token coincide con ADMIN_TOKEN.
 */
export async function POST(request: NextRequest) {
  const esperado = process.env.ADMIN_TOKEN
  if (!esperado) {
    return NextResponse.json({ ok: false, error: 'ADMIN_TOKEN no configurado en el servidor' }, { status: 500 })
  }

  let token = ''
  try {
    token = (await request.json()).token ?? ''
  } catch {
    /* body inválido */
  }

  // Comparación en tiempo constante para no filtrar por timing
  if (token.length !== esperado.length || !igualSeguro(token, esperado)) {
    return NextResponse.json({ ok: false, error: 'Token incorrecto' }, { status: 401 })
  }

  const respuesta = NextResponse.json({ ok: true })
  respuesta.cookies.set('mikyra_admin', token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 7 días
  })
  return respuesta
}

function igualSeguro(a: string, b: string): boolean {
  let distinto = 0
  for (let i = 0; i < a.length; i++) distinto |= a.charCodeAt(i) ^ b.charCodeAt(i)
  return distinto === 0
}
