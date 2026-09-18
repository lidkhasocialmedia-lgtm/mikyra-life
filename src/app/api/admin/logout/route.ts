import { NextResponse } from 'next/server'
import { siteUrl } from '@/lib/site'

/** GET /api/admin/logout - borra la cookie de acceso al panel */
export async function GET() {
  const respuesta = NextResponse.redirect(new URL('/admin/login', siteUrl()))
  respuesta.cookies.delete('mikyra_admin')
  return respuesta
}
