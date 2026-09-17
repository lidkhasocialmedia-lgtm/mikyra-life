export const metadata = { title: 'Configuración pendiente — Admin' }

/**
 * Se muestra cuando ADMIN_TOKEN no está definido en el entorno.
 * Evita dejar el panel accesible durante el setup.
 */
export default function AdminConfigPage() {
  return (
    <div className="mx-auto mt-16 max-w-xl">
      <div className="tarjeta p-8">
        <h1 className="text-xl font-black text-white">⚙️ Configura el panel</h1>
        <p className="mt-3 text-sm leading-relaxed text-neutral-400">
          El área de administración está bloqueada hasta definir la variable{' '}
          <code className="rounded bg-black px-1.5 py-0.5 text-marca-ambar">ADMIN_TOKEN</code> en tu{' '}
          <code className="rounded bg-black px-1.5 py-0.5 text-marca-ambar">.env.local</code> (o en Vercel →
          Environment Variables).
        </p>
        <p className="mt-3 text-sm text-neutral-500">
          Ejemplo: <code className="text-neutral-300">ADMIN_TOKEN=s4l-e-m1-l-t-o-l-a-r-g-0-2026</code>. Tras añadirla,
          reinicia el servidor y usa ese valor como contraseña en <code>/admin/login</code>.
        </p>
      </div>
    </div>
  )
}
