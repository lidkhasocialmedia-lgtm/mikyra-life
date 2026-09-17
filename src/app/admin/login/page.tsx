'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { KeyRound } from 'lucide-react'
import { Boton } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

/**
 * Login simple con el token de ADMIN_TOKEN (env). Tras validar, el servidor
 * emite la cookie httpOnly que revisa el middleware.
 */
export default function AdminLoginPage() {
  const router = useRouter()
  const [token, setToken] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [enviando, setEnviando] = useState(false)

  async function entrar(e: React.FormEvent) {
    e.preventDefault()
    setEnviando(true)
    setError(null)
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      })
      const json = await res.json()
      if (res.ok && json.ok) {
        router.push('/admin')
        router.refresh()
      } else {
        setError(json.error ?? 'No autorizado')
      }
    } catch {
      setError('Error de conexión')
    } finally {
      setEnviando(false)
    }
  }

  return (
    <div className="mx-auto mt-16 max-w-md">
      <div className="tarjeta p-8">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-marca-rojo/25 ring-1 ring-marca-rojo/50">
          <KeyRound className="h-6 w-6 text-marca-brasa" />
        </div>
        <h1 className="mt-4 text-center text-xl font-black text-white">Acceso al panel</h1>
        <p className="mt-1 text-center text-sm text-neutral-500">
          Introduce el token definido en <code className="text-neutral-300">ADMIN_TOKEN</code>.
        </p>

        <form onSubmit={entrar} className="mt-6 space-y-4">
          <Input
            etiqueta="Token"
            type="password"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            placeholder="••••••••••••"
            autoFocus
            error={error ?? undefined}
          />
          <Boton type="submit" className="w-full" cargando={enviando} disabled={!token}>
            Entrar
          </Boton>
        </form>
      </div>
    </div>
  )
}
