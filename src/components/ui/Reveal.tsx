'use client'

import { motion, type Variants } from 'framer-motion'

/**
 * Envoltorio de animación "revelar al hacer scroll" reutilizable.
 * Mantiene Framer Motion fuera del server render y estandariza la easing.
 */

const suave: Variants = {
  oculto: { opacity: 0, y: 24 },
  visible: (retardo: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: retardo, ease: [0.21, 0.47, 0.32, 0.98] },
  }),
}

export function Reveal({
  children,
  retardo = 0,
  className,
}: {
  children: React.ReactNode
  retardo?: number
  className?: string
}) {
  return (
    <motion.div
      className={className}
      variants={suave}
      initial="oculto"
      whileInView="visible"
      viewport={{ once: true, margin: '-60px' }}
      custom={retardo}
    >
      {children}
    </motion.div>
  )
}
