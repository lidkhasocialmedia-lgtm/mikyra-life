import Link from 'next/link'

export const metadata = { title: 'Admin — MIKYRA LIFE', robots: { index: false, follow: false } }

/**
 * Layout del panel: sin header/footer de tienda, navegación propia.
 * Protegido por src/middleware.ts (cookie mikyra_admin).
 */
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#050505]">
      <nav className="border-b border-marca-borde bg-black/80 px-6 py-4 backdrop-blur" aria-label="Panel MIKYRA">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-6">
          <Link href="/admin" className="font-black tracking-[0.2em] text-white">
            MIKYRA<span className="text-marca-ambar">ADMIN</span>
          </Link>
          <div className="flex items-center gap-4 text-sm text-neutral-400">
            <Link href="/admin" className="transition hover:text-marca-ambar">Pedidos</Link>
            <Link href="/admin/productos" className="transition hover:text-marca-ambar">Productos</Link>
            <Link href="/admin/login" className="transition hover:text-marca-ambar">Acceso</Link>
            <Link href="/" className="ml-auto transition hover:text-white">← Ir a la tienda</Link>
          </div>
        </div>
      </nav>
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">{children}</main>
    </div>
  )
}
