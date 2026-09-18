/**
 * URL base canónica del sitio.
 * Robusta frente a NEXT_PUBLIC_URL vacío: Vercel a veces define la variable como
 * cadena vacía y `??` no protege de eso (new URL('') revienta el build).
 */
export function siteUrl(): string {
  const configured = process.env.NEXT_PUBLIC_URL?.trim()
  if (configured) return configured.replace(/\/+$/, '')

  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL ?? process.env.VERCEL_URL
  if (vercel?.trim()) return `https://${vercel.trim()}`

  return 'http://localhost:3000'
}
