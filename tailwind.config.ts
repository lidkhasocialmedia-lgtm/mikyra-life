import type { Config } from 'tailwindcss'

/**
 * Configuración de Tailwind CSS para MIKYRA LIFE
 * Paleta de marca: negro profundo, rojo oscuro (luz roja) y ámbar (melatonina cálida)
 */
const config: Config = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        marca: {
          negro: '#000000',
          fondo: '#0a0a0a',
          superficie: '#171717',
          borde: '#262626',
          rojo: '#7f1d1d',
          'rojo-claro': '#b91c1c',
          brasa: '#f87171',
          ambar: '#f59e0b',
          'ambar-claro': '#fbbf24',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'glow-rojo': '0 0 40px -10px rgba(185, 28, 28, 0.55)',
        'glow-ambar': '0 0 32px -8px rgba(245, 158, 11, 0.45)',
      },
      keyframes: {
        'pulso-luz': {
          '0%, 100%': { opacity: '0.35', transform: 'scale(1)' },
          '50%': { opacity: '0.7', transform: 'scale(1.06)' },
        },
        'flotar': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
      },
      animation: {
        'pulso-luz': 'pulso-luz 6s ease-in-out infinite',
        flotar: 'flotar 5s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}

export default config
