import { Hero } from '@/components/home/Hero'
import { Benefits } from '@/components/home/Benefits'
import { HowItWorks } from '@/components/home/HowItWorks'
import { FeaturedProducts } from '@/components/home/FeaturedProducts'
import { Testimonials } from '@/components/home/Testimonials'
import { FAQ } from '@/components/home/FAQ'
import { Garantía } from '@/components/home/Garantia'
import { cargarProductos } from '@/lib/seed'

/**
 * Home de MIKYRA LIFE — estructura de conversión:
 * Promesa → Prueba → Educación → Producto → Prueba social → Objeciones → Garantía
 * Server Component puro: los datos se cargan en servidor (SEO + velocidad).
 */
export default async function HomePage() {
  const productos = await cargarProductos()

  return (
    <>
      <Hero />
      <Benefits />
      <FeaturedProducts productos={productos} />
      <HowItWorks />
      <Testimonials />
      <FAQ />
      <Garantía />
    </>
  )
}
