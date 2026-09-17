-- ================================================
-- MIKYRA LIFE - Schema completo (Fase 2)
-- Pegar en Supabase → SQL Editor → Run
-- ================================================

-- Extensiones necesarias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ================================================
-- TABLA: categorias
-- ================================================
CREATE TABLE categorias (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  descripcion TEXT,
  imagen_url TEXT,
  activa BOOLEAN DEFAULT true,
  orden INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ================================================
-- TABLA: productos
-- ================================================
CREATE TABLE productos (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  nombre VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  descripcion TEXT,
  descripcion_corta VARCHAR(500),
  precio DECIMAL(10,2) NOT NULL,
  precio_original DECIMAL(10,2),
  imagenes JSONB DEFAULT '[]',
  categoria_id UUID REFERENCES categorias(id),
  stock INTEGER DEFAULT 999,
  activo BOOLEAN DEFAULT true,
  destacado BOOLEAN DEFAULT false,
  caracteristicas JSONB DEFAULT '[]',
  especificaciones JSONB DEFAULT '{}',
  tags TEXT[] DEFAULT '{}',
  -- CJ Dropshipping
  cj_product_id VARCHAR(255),
  cj_sku VARCHAR(255),
  -- SEO
  meta_title VARCHAR(255),
  meta_description VARCHAR(500),
  -- Stats
  ventas_total INTEGER DEFAULT 0,
  rating_promedio DECIMAL(3,2) DEFAULT 0,
  reviews_total INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ================================================
-- TABLA: pedidos
-- ================================================
CREATE TABLE pedidos (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  numero_pedido VARCHAR(20) UNIQUE NOT NULL,
  stripe_session_id VARCHAR(255) UNIQUE,
  stripe_payment_intent VARCHAR(255),
  estado VARCHAR(50) DEFAULT 'pendiente',
  -- pendiente | pagado | procesando | enviado | entregado | cancelado
  items JSONB NOT NULL,
  subtotal DECIMAL(10,2) NOT NULL,
  envio DECIMAL(10,2) DEFAULT 0,
  total DECIMAL(10,2) NOT NULL,
  -- Cliente
  cliente_email VARCHAR(255) NOT NULL,
  cliente_nombre VARCHAR(255),
  cliente_telefono VARCHAR(50),
  -- Dirección
  direccion_linea1 VARCHAR(255),
  direccion_linea2 VARCHAR(255),
  ciudad VARCHAR(100),
  codigo_postal VARCHAR(20),
  provincia VARCHAR(100),
  pais VARCHAR(2) DEFAULT 'ES',
  -- Dropshipping
  cj_order_id VARCHAR(255),
  tracking_number VARCHAR(255),
  tracking_url TEXT,
  -- Meta
  notas TEXT,
  ip_cliente VARCHAR(50),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ================================================
-- TABLA: reviews
-- ================================================
CREATE TABLE reviews (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  producto_id UUID REFERENCES productos(id) ON DELETE CASCADE,
  pedido_id UUID REFERENCES pedidos(id),
  nombre VARCHAR(100) NOT NULL,
  email VARCHAR(255),
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  titulo VARCHAR(255),
  comentario TEXT,
  verificado BOOLEAN DEFAULT false,
  aprobado BOOLEAN DEFAULT false,
  imagen_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ================================================
-- TABLA: suscriptores (email marketing)
-- ================================================
CREATE TABLE suscriptores (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  nombre VARCHAR(100),
  activo BOOLEAN DEFAULT true,
  fuente VARCHAR(100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ================================================
-- FUNCIÓN: generar número de pedido
-- ================================================
CREATE OR REPLACE FUNCTION generar_numero_pedido()
RETURNS TRIGGER AS $$
BEGIN
  NEW.numero_pedido = 'MKY-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' ||
                      LPAD(FLOOR(RANDOM() * 9999)::TEXT, 4, '0');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_numero_pedido
  BEFORE INSERT ON pedidos
  FOR EACH ROW
  EXECUTE FUNCTION generar_numero_pedido();

-- ================================================
-- FUNCIÓN: actualizar updated_at
-- ================================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_productos_updated_at
  BEFORE UPDATE ON productos
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trigger_pedidos_updated_at
  BEFORE UPDATE ON pedidos
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ================================================
-- ROW LEVEL SECURITY (RLS)
-- ================================================
ALTER TABLE productos ENABLE ROW LEVEL SECURITY;
ALTER TABLE pedidos ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE categorias ENABLE ROW LEVEL SECURITY;
ALTER TABLE suscriptores ENABLE ROW LEVEL SECURITY;

-- Productos: lectura pública solo activos
CREATE POLICY "productos_public_read" ON productos
  FOR SELECT USING (activo = true);

-- Categorías: lectura pública solo activas
CREATE POLICY "categorias_public_read" ON categorias
  FOR SELECT USING (activa = true);

-- Pedidos: solo accesible vía service_role (el anon key no puede leerlos)
CREATE POLICY "pedidos_service_only" ON pedidos
  FOR ALL USING (auth.role() = 'service_role');

-- Reviews: lectura pública solo aprobadas
CREATE POLICY "reviews_public_read" ON reviews
  FOR SELECT USING (aprobado = true);

-- Suscriptores: alta pública (el formulario de newsletter), lectura solo service_role
CREATE POLICY "suscriptores_public_insert" ON suscriptores
  FOR INSERT WITH CHECK (true);

CREATE POLICY "suscriptores_service_read" ON suscriptores
  FOR SELECT USING (auth.role() = 'service_role');

-- ================================================
-- DATOS INICIALES (seed de las 3 categorías)
-- ================================================
INSERT INTO categorias (nombre, slug, descripcion, orden) VALUES
('Luz Roja Nocturna', 'luz-roja-nocturna', 'Bloquean luz roja para preservar melatonina por la noche', 1),
('Bloqueo Total', 'bloqueo-total', 'Máxima protección para dormidores exigentes', 2),
('Luz Azul Diurna', 'luz-azul-diurna', 'Para uso en pantallas durante el día', 3);

-- ================================================
-- NOTA: los 3 productos core viven en src/lib/seed.ts
-- para que la tienda funcione sin BD. Cuando tengas
-- Supabase configurado, ejecuta el script:
--   node scripts/seed-supabase.mjs
-- que inserta en la tabla productos los datos de seed.
-- ================================================
