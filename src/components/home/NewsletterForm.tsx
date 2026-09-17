'use client'

import { useState } from 'react'
import { z } from 'zod'
import { Check, Loader2, Mail } from 'lucide-react'

const esquema = z.object({ email: z.string().email('Email no válido') })

type Estado = 'idle' | 'enviando' | 'exito' | 'error'

/**
 * Formulario de suscripción al newsletter (POST /api/newsletter).
 * Sin recargar: feedback inline con estados.
 */
export function NewsletterForm() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [estado, setEstado] = useState<Estado>('idle')

  async function enviar(e: React.FormEvent) {
    e.preventDefault()
    const parseo = esquema.safeParse({ email })
    if (!parseo.success) {
      setError(parseo.error.issues[0]?.message ?? 'Email no válido')
      return
    }
    setError(null)
    setEstado('enviando')
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, fuente: 'footer' }),
      })
      if (!res.ok) throw new Error()
      setEstado('exito')
      setEmail('')
    } catch {
      setEstado('error')
      setError('No pudimos registrarte. Inténtalo de nuevo.')
    }
  }

  if (estado === 'exito') {
    return (
      <div className="flex items-center gap-3 rounded-2xl border border-green-500/30 bg-green-500/10 px-5 py-4 text-sm text-green-300">
        <Check className="h-5 w-5 shrink-0" />
        <p>
          <strong>¡Listo!</strong> Revisa tu bandeja: te acabamos de enviar la guía del Protocolo de Oscuridad.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={enviar} noValidate className="w-full">
      <div className="flex flex-col gap-2 sm:flex-row">
        <div className="relative flex-1">
          <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500" />
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="tu@email.com"
            aria-label="Tu email"
            className="h-12 w-full rounded-xl border border-neutral-800 bg-black/60 pl-11 pr-4 text-sm text-white placeholder:text-neutral-600 focus:border-marca-ambar focus:outline-none focus:ring-2 focus:ring-marca-ambar/25"
          />
        </div>
        <button
          type="submit"
          disabled={estado === 'enviando'}
          className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-marca-ambar px-6 text-sm font-bold text-black transition hover:bg-marca-ambar-claro disabled:opacity-60"
        >
          {estado === 'enviando' && <Loader2 className="h-4 w-4 animate-spin" />}
          {estado === 'enviando' ? 'Enviando…' : 'Quiero la guía'}
        </button>
      </div>
      {error && <p className="mt-2 text-xs text-red-400">{error}</p>}
      {estado === 'error' && !error && <p className="mt-2 text-xs text-red-400">Error inesperado, inténtalo otra vez.</p>}
    </form>
  )
}
