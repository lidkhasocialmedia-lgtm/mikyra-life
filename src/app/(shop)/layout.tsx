import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { CartDrawer } from '@/components/layout/CartDrawer'

/**
 * Layout del grupo (shop): todo lo público comparte header, footer y drawer.
 * El drawer es client component; el resto permanece en server render.
 */
export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main className="pb-10">{children}</main>
      <Footer />
      <CartDrawer />
    </>
  )
}
