import { NextResponse } from 'next/server'

/** GET /api/admin/logout - borra la cookie de acceso al panel */
export async function GET() {
  const respuesta = NextResponse.redirect(new URL('/admin/login', process.env.NEXT_PUBLIC_URL ?? 'http://localhost:3000'))
  respuesta.cookies.delete('mikyra_admin')
  return respuesta
}
