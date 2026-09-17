import type { Metadata } from 'next'
import { Clock, Mail, MessageSquare, Package } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Contacto',
  description: 'Soporte MIKYRA LIFE: responde un humano en menos de 24 h laborables.',
  alternates: { canonical: '/contacto' },
}

const CANALES = [
  {
    icono: Mail,
    titulo: 'Email',
    texto: 'Para pedidos, devoluciones y dudas de producto.',
    accion: { href: 'mailto:hola@mikyra.roadshop.online', label: 'hola@mikyra.roadshop.online' },
  },
  {
    icono: Package,
    titulo: 'Estado de mi pedido',
    texto: 'Reenviamos tracking en el día si tu email lo ha extraviado. Indícanos tu número MKY-…',
    accion: { href: 'mailto:pedidos@mikyra.roadshop.online', label: 'pedidos@mikyra.roadshop.online' },
  },
  {
    icono: MessageSquare,
    titulo: 'Dudas antes de comprar',
    texto: '¿Fit-over, graduación, migraña? Escríbenos y te decimos qué modelo encaja contigo.',
    accion: { href: 'mailto:hola@mikyra.roadshop.online?subject=Duda%20antes%20de%20comprar', label: 'Preguntar ahora' },
  },
]

export default function ContactoPage() {
  return (
    <div className="seccion max-w-4xl pt-28 sm:pt-36">
      <h1 className="text-3xl font-black text-white sm:text-4xl">Hablemos</h1>
      <p className="mt-3 max-w-xl text-neutral-400">
        Responde una persona del equipo, no un bot. Si escribimos nosotros primero, será por tu pedido: jamás para venderte
        otra cosa.
      </p>

      <div className="mt-10 grid gap-4 sm:grid-cols-3">
        {CANALES.map((c) => (
          <a key={c.titulo} href={c.accion.href} className="tarjeta group p-6 transition-colors hover:border-marca-ambar/40">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-marca-rojo/20 text-marca-brasa ring-1 ring-marca-rojo/40 transition group-hover:bg-marca-ambar/15 group-hover:text-marca-ambar">
              <c.icono className="h-5 w-5" />
            </div>
            <h2 className="mt-4 font-bold text-white">{c.titulo}</h2>
            <p className="mt-1.5 text-sm text-neutral-400">{c.texto}</p>
            <p className="mt-3 text-sm font-semibold text-marca-ambar underline-offset-2 group-hover:underline">{c.accion.label}</p>
          </a>
        ))}
      </div>

      <div className="mt-8 flex items-center gap-2 text-sm text-neutral-500">
        <Clock className="h-4 w-4" />
        Horario de soporte: L-V 9:00-18:00 (CET). Fines de semana: respuesta el lunes.
      </div>
    </div>
  )
}
