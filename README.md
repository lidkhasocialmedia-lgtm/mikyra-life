# 🔴 MIKYRA LIFE

Tienda ecommerce de gafas bloqueadoras de luz roja / infrarroja — nicho biohacking, sueño y ritmo circadiano.
`mikyra.roadshop.online`

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Flidkhasocialmedia-lgtm%2Fmikyra-life&project-name=mikyra-life&repository-name=mikyra-life)

> **Despliegue en 1 clic:** pulsa el botón, inicia sesión en Vercel (puedes hacerlo con tu cuenta de GitHub) y listo.
> La app funciona sin ninguna variable de entorno (modo demo). Para activar pagos/BD/email, añade las
> variables del apartado siguiente en Vercel → Settings → Environment Variables.

## Stack

| Capa | Servicio | Nota |
|---|---|---|
| Framework | Next.js 14 (App Router, TS estricto) | `create-next-app@14` |
| UI | Tailwind CSS 3.4 + Framer Motion 11 + Radix (dialog) + lucide-react | mobile-first |
| BD | Supabase (schema en `supabase/schema.sql`) | **funciona sin BD en modo demo** |
| Pagos | Stripe Checkout + webhook | `sk_test_` al empezar |
| Dropshipping | API CJ Dropshipping v2.0 (`src/lib/cj.ts`) | opcional en demo |
| Emails | Resend (`src/lib/resend.ts`) | degrada a log si no hay key |
| Hosting | Vercel | `vercel.json` listo |

## Modo demo (0 claves = 0 bloqueos)

Todo el proyecto arranca **sin ninguna API key**: el catálogo, el carrito, las páginas SEO y las animaciones funcionan con
datos de `src/lib/seed.ts` y los pagos muestran un aviso de "modo demo". Cada integración (Supabase, Stripe, Resend, CJ)
se activa cuando defines sus variables. Esto permite desplegar en Vercel el mismo día y configurar las claves después.

## Arranque rápido

```bash
npm install            # ya ejecutado en este repo
cp .env.example .env.local   # (opcional en demo)
npm run dev            # http://localhost:3000
```

Comandos de calidad:

```bash
npm run lint && npx tsc --noEmit && npm run build
```

## Orden para activar servicios (FASE 0-6 de la guía)

1. **Supabase**: crear proyecto → pegar `supabase/schema.sql` en SQL Editor → `cp .env.example .env.local` y rellenar `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` → `SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... node scripts/seed-supabase.mjs`
2. **Stripe**: cuenta test → copiar `pk_test_`/`sk_test_` al env → instalar la CLI y reenviar el webhook local:
   ```bash
   stripe listen --forward-to localhost:3000/api/webhook
   # copia el whsec_... a STRIPE_WEBHOOK_SECRET
   ```
3. **CJ Dropshipping**: cuenta vendedor → buscar "red light blocking glasses" con +500 pedidos y almacén EU →
   en el producto CJ copia el **vid** (variant id) → pégalo en la columna `cj_sku` del producto en Supabase
   (así el webhook crea el pedido automáticamente). Rellena `CJ_EMAIL`/`CJ_PASSWORD`/`CJ_API_KEY`.
4. **Resend**: verifica el dominio `mikyra.roadshop.online` (o usa `onboarding@resend.dev` para pruebas) → `RESEND_API_KEY`.
5. **Vercel**: importar repo → Variables de entorno (todas las de `.env.example`, con `NEXT_PUBLIC_URL=https://mikyra.roadshop.online`) → Settings→Domains→ `mikyra.roadshop.online` + CNAME en tu DNS → en Stripe Dashboard crea el webhook **de producción** apuntando a `https://mikyra.roadshop.online/api/webhook`.
6. **Admin**: define `ADMIN_TOKEN` y entra en `/admin/login`.

## Estructura

```
src/
├── app/
│   ├── (shop)/              # todo lo público comparte Header/Footer/CartDrawer
│   │   ├── page.tsx         # Home (Hero→Beneficios→Catálogo→Ciencia→Reviews→FAQ→Garantía)
│   │   ├── productos/       # catálogo + [slug] detalle con schema.org Product
│   │   ├── carrito/ checkout/ gracias/
│   │   └── faq/ envios-devoluciones/ garantia/ contacto/ privacidad/ terminos/ cookies/
│   ├── admin/               # login, pedidos, productos (gate: cookie + ADMIN_TOKEN)
│   ├── api/
│   │   ├── checkout/route.ts    # valida, re-precifica, crea pedido + sesión Stripe
│   │   ├── webhook/route.ts     # pago → CJ → email → estado "procesando"
│   │   ├── productos/ newsletter/
│   │   └── admin/               # login, logout, pedidos (GET/PATCH/POST CJ)
│   ├── sitemap.ts  robots.ts
├── components/
│   ├── ui/        # Boton, Badge, Input, Reveal (animación scroll)
│   ├── layout/    # Header, Footer, CartDrawer, LegalPage
│   ├── home/      # Hero, Benefits, HowItWorks, FeaturedProducts, Testimonials, FAQ...
│   ├── shop/      # ProductCard, Gallery, AddToCart, CartView, CheckoutForm, Tabs
│   └── admin/     # AdminPedidos
├── lib/           # supabase, stripe, cj, resend, seed, utils, validation
├── store/         # cartStore (Zustand + persist)
├── hooks/         # useCart (anti-hydration), useProducts
└── types/
supabase/schema.sql    # tablas + triggers + RLS + seed categorías
scripts/seed-supabase.mjs
```

## Decisiones de ingeniería (para tu yo del futuro)

- **Re-precificación en servidor**: `/api/checkout` ignora los precios que envía el cliente y los lee del catálogo. Sin esto te vacían la tienda a 1 €.
- **Idempotencia del webhook**: si un pedido ya salió de `pendiente`, no se repite el pedido CJ ni el email.
- **Degradación elegante**: cada librería (`supabase`, `stripe`, `resend`, `cj`) devuelve `null`/no-op sin claves en lugar de petar el build.
- **Trigger `numero_pedido`**: la BD genera `MKY-YYYYMMDD-XXXX`; el front nunca inventa números de pedido.
- **Imágenes**: `public/images/productos/*.svg` son *placeholders ilustrativos*. Sustitúyelas por fotos reales (Cloudinary o Supabase Storage) **antes** de publicitar. Anunciar con renders propios está bien; robar fotos de otros vendedores de CJ no.
- **Testimonios**: son de ejemplo y están etiquetados como tal en la UI. Google/Consumo penaliza las reseñas falsas: bórralas en cuanto tengas reviews reales de la tabla `reviews`.

## Checklist legal antes de vender (España/UE)

- [ ] Aviso legal con NIF/CIF o datos del autónomo en `/terminos`
- [ ] Botón/banner de cookies si activas píxeles publicitarios
- [ ] Precios con IVA y gastos de envío visibles antes del pago (ya hecho en checkout)
- [ ] Textos de salud revisados: sin afirmaciones médicas (los actuales están redactados para evitarlo)
