import { z } from 'zod'

/**
 * MIKYRA LIFE - Esquemas de validación (Zod) compartidos por cliente y servidor
 */

export const esquemaCheckout = z.object({
  email: z.string().email('Introduce un email válido'),
  nombre: z.string().min(2, 'Introduce tu nombre completo'),
  telefono: z
    .string()
    .regex(/^[+]?[0-9\s-]{9,15}$/, 'Teléfono no válido (mín. 9 dígitos)')
    .optional()
    .or(z.literal('')),
  direccion: z.string().min(5, 'Escribe tu dirección (calle, número, piso)'),
  direccion2: z.string().optional().or(z.literal('')),
  ciudad: z.string().min(2, 'Ciudad requerida'),
  codigoPostal: z
    .string()
    .regex(/^\d{4,5}$/, 'CP de 4-5 dígitos'),
  provincia: z.string().min(2, 'Provincia requerida'),
  pais: z.string().length(2, 'Código de país de 2 letras').default('ES'),
  clienteId: z.string().min(8, 'Identificador de cliente inválido'),
  items: z
    .array(
      z.object({
        slug: z.string().min(1),
        cantidad: z.number().int().min(1).max(10),
      })
    )
    .min(1, 'El carrito está vacío'),
})

export type DatosCheckout = z.infer<typeof esquemaCheckout>

export const esquemaNewsletter = z.object({
  email: z.string().email('Introduce un email válido'),
  fuente: z.string().max(100).optional(),
})

export type DatosNewsletter = z.infer<typeof esquemaNewsletter>
